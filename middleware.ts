import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages that should be accessible from any subdomain without being rewritten to /shop or /admin
const PUBLIC_PAGES = [
  "/privacy-policy",
  "/terms-of-use",
  "/shipping-policy",
  "/refund-and-returns-policy",
  "/ccpa-opt-out",
  "/community-guidelines",
  "/about",
  "/contact",
  "/test-contact",
  "/resources"
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  // Skip middleware for public pages to allow them to resolve from root regardless of subdomain
  if (PUBLIC_PAGES.some(path => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next();
  }

  // Environment Check
  const isDeployedEnv =
    process.env.APP_ENV === "test" ||
    process.env.APP_ENV === "prod" ||
    hostname.includes(".orthonu.com");

  // Local setup — skip all subdomain logic
  if (!isDeployedEnv) {
    return NextResponse.next();
  }

  // --- DOMAIN CONFIGURATION ---
  const SHOP_DOMAIN = process.env.SHOP_DOMAIN;
  const ADMIN_DOMAIN = process.env.ADMIN_DOMAIN;
  const MAIN_DOMAIN = process.env.MAIN_DOMAIN;

  const isShop = hostname === SHOP_DOMAIN;
  const isAdmin = hostname === ADMIN_DOMAIN;
  const isMain = hostname === MAIN_DOMAIN;

  // SHOP subdomain — internally rewrite to /shop/...
  if (isShop && !pathname.startsWith("/shop")) {
    return NextResponse.rewrite(
      new URL(`/shop${pathname}${url.search}`, req.url),
    );
  }

  // ADMIN subdomain — internally rewrite to /admin/...
  if (isAdmin && !pathname.startsWith("/admin")) {
    return NextResponse.rewrite(
      new URL(`/admin${pathname}${url.search}`, req.url),
    );
  }

  // MAIN SITE — redirect /shop and /admin to their subdomains
  if (isMain) {
    if (pathname.startsWith("/shop")) {
      const stripped = pathname.slice("/shop".length) || "/";
      return NextResponse.redirect(
        new URL(`${stripped}${url.search}`, `https://${SHOP_DOMAIN}`),
      );
    }

    if (pathname.startsWith("/admin")) {
      const stripped = pathname.slice("/admin".length) || "/";
      return NextResponse.redirect(
        new URL(`${stripped}${url.search}`, `https://${ADMIN_DOMAIN}`),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
