/**
 * Utility to handle cross-subdomain navigation.
 * Uses APP_ENV to determine the correct domains.
 */

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV || 'dev';

export function isSubdomainEnvironment() {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || APP_ENV === 'dev';
  return !isLocal;
}

export function getShopUrl(path: string = "") {
  if (typeof window === "undefined") return `/shop${path}`;

  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || APP_ENV === 'dev';

  if (isLocal) {
    return `/shop${path}`;
  }

  // Determine the base domain
  const isTest = APP_ENV === 'test' || hostname.includes("newtest.orthonu.com");
  const baseShopDomain = isTest ? "newtestshop.orthonu.com" : "shop.orthonu.com";

  return `https://${baseShopDomain}${path}`;
}

export function getAdminUrl(path: string = "") {
  if (typeof window === "undefined") return `/admin${path}`;

  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || APP_ENV === 'dev';

  if (isLocal) {
    return `/admin${path}`;
  }

  const isTest = APP_ENV === 'test' || hostname.includes("newtest.orthonu.com");
  const baseAdminDomain = isTest ? "newtestconsole.orthonu.com" : "console.orthonu.com";

  return `https://${baseAdminDomain}${path}`;
}

export function getMainUrl(path: string = "") {
  if (typeof window === "undefined") return path || "/";

  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || APP_ENV === 'dev';

  if (isLocal) {
    return path || "/";
  }

  const isTest = APP_ENV === 'test' || hostname.includes("newtest.orthonu.com");
  const baseMainDomain = isTest ? "newtest.orthonu.com" : "orthonu.com";

  return `https://${baseMainDomain}${path}`;
}
