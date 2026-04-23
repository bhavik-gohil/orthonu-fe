import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  // Environment Check
  // We apply these rules if APP_ENV is TEST or PROD, or if the hostname is a deployed domain
  const isDeployedEnv =
    process.env.APP_ENV === "test" ||
    process.env.APP_ENV === "prod" ||
    hostname.includes(".orthonu.com");

  // 1. Local setup / normal routing fallback
  if (!isDeployedEnv) {
    return NextResponse.next();
  }

  // --- DOMAIN CONFIGURATION ---
  // You can set these in your .env file for PROD:
  // SHOP_DOMAIN=shop.orthonu.com
  // ADMIN_DOMAIN=console.orthonu.com
  // MAIN_DOMAIN=orthonu.com
  const SHOP_DOMAIN = process.env.SHOP_DOMAIN;
  const ADMIN_DOMAIN = process.env.ADMIN_DOMAIN;
  const MAIN_DOMAIN = process.env.MAIN_DOMAIN;

  const isShop = hostname === SHOP_DOMAIN;
  const isAdmin = hostname === ADMIN_DOMAIN;
  const isMain = hostname === MAIN_DOMAIN;

  // Safeguard against /shop/shop loops
  if (pathname.startsWith("/shop/shop")) {
    return NextResponse.rewrite(
      new URL(pathname.replace("/shop/shop", "/shop"), req.url),
    );
  }

  if (pathname.startsWith("/admin/admin")) {
    return NextResponse.rewrite(
      new URL(pathname.replace("/admin/admin", "/admin"), req.url),
    );
  }

  // SHOP
  if (isShop) {
    return NextResponse.rewrite(
      new URL(`/shop${pathname}${url.search}`, req.url),
    );
  }

  // ADMIN
  if (isAdmin) {
    return NextResponse.rewrite(
      new URL(`/admin${pathname}${url.search}`, req.url),
    );
  }

  // MAIN SITE redirects
  if (isMain) {
    if (pathname.startsWith("/shop")) {
      const newPath = pathname.replace("/shop", "") || "/";
      return NextResponse.redirect(new URL(newPath, `https://${SHOP_DOMAIN}`));
    }

    if (pathname.startsWith("/admin")) {
      const newPath = pathname.replace("/admin", "") || "/";
      return NextResponse.redirect(new URL(newPath, `https://${ADMIN_DOMAIN}`));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
