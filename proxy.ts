import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages that should be accessible from any subdomain without being rewritten to /shop or /admin
const PUBLIC_PAGES = ["/about", "/contact", "/test-contact", "/resources"];

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  // Skip middleware for public pages to allow them to resolve from root regardless of subdomain
  if (
    PUBLIC_PAGES.some(
      (path) => pathname === path || pathname.startsWith(path + "/"),
    )
  ) {
    return NextResponse.next();
  }

  // Environment Check - Using the NEXT_PUBLIC variables you added to .env
  const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;
  const isDeployedEnv = APP_ENV === "test" || APP_ENV === "prod";

  // Local setup — skip all subdomain logic
  if (!isDeployedEnv) {
    return NextResponse.next();
  }

  // --- DOMAIN CONFIGURATION ---
  // Using the exact NEXT_PUBLIC_ variables from your updated .env
  const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN;
  const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOP_DOMAIN;
  const ADMIN_DOMAIN = process.env.NEXT_PUBLIC_ADMIN_DOMAIN;
  const START_DOMAIN = process.env.NEXT_PUBLIC_START_DOMAIN;

  // Strip port from hostname if present
  const cleanHostname = hostname.split(":")[0];

  const isShop = cleanHostname === SHOP_DOMAIN;
  const isAdmin = cleanHostname === ADMIN_DOMAIN;
  const isStart = cleanHostname === START_DOMAIN;
  const isMain = cleanHostname === MAIN_DOMAIN;

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

  // START subdomain — internally rewrite to /start/...
  if (isStart && !pathname.startsWith("/start")) {
    return NextResponse.rewrite(
      new URL(`/start${pathname}${url.search}`, req.url),
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
