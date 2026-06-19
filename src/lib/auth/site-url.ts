/** Production domain — fallback when env/headers are missing on Vercel */
export const PRODUCTION_SITE_URL = "https://silverlooms.in";

function isLocalHost(host: string) {
  const hostname = host.split(":")[0].trim().toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/**
 * Canonical app URL for OAuth redirects (Supabase + Google).
 * Set NEXT_PUBLIC_SITE_URL on Vercel — e.g. https://silverlooms.in
 */
export function getConfiguredSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (url && !isLocalHost(new URL(url).hostname)) {
    return url;
  }

  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  return url || null;
}

export async function getSiteUrl() {
  const configured = getConfiguredSiteUrl();
  if (configured) return configured;

  const { headers } = await import("next/headers");
  const headersList = await headers();
  const host = (
    headersList.get("x-forwarded-host") ?? headersList.get("host") ?? ""
  )
    .split(",")[0]
    .trim();
  const protocol = headersList.get("x-forwarded-proto") ?? "https";

  if (host && !isLocalHost(host)) {
    return `${protocol}://${host}`;
  }

  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  return "http://localhost:3000";
}

/** Use in /auth/callback — never send production users to localhost */
export function resolveSiteUrlFromRequest(requestUrl: URL) {
  const configured = getConfiguredSiteUrl();
  if (configured) return configured;

  if (!isLocalHost(requestUrl.hostname)) {
    return requestUrl.origin;
  }

  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  return requestUrl.origin;
}

export function buildAuthCallbackUrl(siteUrl: string, redirectPath = "/") {
  const safeRedirect = redirectPath.startsWith("/") ? redirectPath : "/";
  return `${siteUrl}/auth/callback?redirect=${encodeURIComponent(safeRedirect)}`;
}

/** Add these in Supabase → Authentication → URL Configuration → Redirect URLs */
export const SUPABASE_REDIRECT_URLS = [
  "https://silverlooms.in/auth/callback",
  "https://www.silverlooms.in/auth/callback",
  "http://localhost:3000/auth/callback",
] as const;

export const SUPABASE_SITE_URL = PRODUCTION_SITE_URL;
