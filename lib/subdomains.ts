/**
 * Utility to handle cross-subdomain navigation.
 * Strictly uses environment variables.
 */

// These are expected to be available on both server and client (via NEXT_PUBLIC_ prefix)
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV;
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || process.env.MAIN_DOMAIN;
const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOP_DOMAIN || process.env.SHOP_DOMAIN;
const ADMIN_DOMAIN = process.env.NEXT_PUBLIC_ADMIN_DOMAIN || process.env.ADMIN_DOMAIN;

export function isSubdomainEnvironment() {
  // If APP_ENV is dev, we are in a local environment (no subdomains)
  return APP_ENV === 'test' || APP_ENV === 'prod';
}

export function getShopUrl(path: string = "") {
  if (!isSubdomainEnvironment()) {
    return `/shop${path}`;
  }
  return `https://${SHOP_DOMAIN}${path}`;
}

export function getAdminUrl(path: string = "") {
  if (!isSubdomainEnvironment()) {
    return `/admin${path}`;
  }
  return `https://${ADMIN_DOMAIN}${path}`;
}

export function getMainUrl(path: string = "") {
  if (!isSubdomainEnvironment()) {
    return path || "/";
  }
  return `https://${MAIN_DOMAIN}${path}`;
}
