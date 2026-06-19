/**
 * Canonical app URL for OAuth redirects (Supabase + Google).
 * Set NEXT_PUBLIC_SITE_URL in production — e.g. https://silverlooms.in
 */
export function getConfiguredSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return url || null;
}

export async function getSiteUrl() {
  const configured = getConfiguredSiteUrl();
  if (configured) return configured;

  const { headers } = await import("next/headers");
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
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
