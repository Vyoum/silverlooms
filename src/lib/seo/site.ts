import { PRODUCTION_SITE_URL } from "@/lib/auth/site-url";

/** Canonical origin for metadata, sitemap, and JSON-LD (no trailing slash). */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return PRODUCTION_SITE_URL;
}

export const SITE_URL = getSiteUrl();

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
