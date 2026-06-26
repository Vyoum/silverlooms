import type { NextRequest } from "next/server";

/** Production domain — fallback when env/headers are missing on Vercel */
export const PRODUCTION_SITE_URL = "https://silverlooms.in";

function isLocalHost(host: string) {
  const hostname = host.split(":")[0].trim().toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isSilverLoomsHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host === "silverlooms.in" || host === "www.silverlooms.in";
}

function siteUrlFromHost(host: string, protocol: string) {
  const normalizedHost = host.split(",")[0].trim();
  if (!normalizedHost) return null;

  const safeProtocol = protocol.endsWith(":") ? protocol.slice(0, -1) : protocol;
  return `${safeProtocol}://${normalizedHost}`;
}

function getServerAuthSiteUrl() {
  const raw = process.env.AUTH_SITE_URL?.trim() ?? process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;

  try {
    const url = raw.replace(/\/$/, "");
    if (!isLocalHost(new URL(url).hostname)) {
      return url;
    }
  } catch {
    // ignore invalid URL
  }

  return null;
}

export function resolveAuthSiteUrl(
  clientOrigin?: string | null,
  serverFallback?: string | null,
) {
  const serverAuthSite = getServerAuthSiteUrl();
  if (serverAuthSite) {
    return serverAuthSite;
  }

  for (const candidate of [clientOrigin, serverFallback]) {
    if (!candidate) continue;

    try {
      const parsed = new URL(candidate);
      if (isSilverLoomsHost(parsed.hostname)) {
        return PRODUCTION_SITE_URL;
      }
      if (!isLocalHost(parsed.hostname)) {
        return parsed.origin;
      }
    } catch {
      // ignore invalid origin
    }
  }

  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  if (clientOrigin) {
    try {
      const parsed = new URL(clientOrigin);
      if (isLocalHost(parsed.hostname)) {
        return parsed.origin;
      }
    } catch {
      // ignore invalid origin
    }
  }

  return serverFallback ?? "http://localhost:3000";
}

export async function getSiteUrl() {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "";
  const protocol =
    headersList.get("x-forwarded-proto") ??
    (isLocalHost(host) ? "http" : "https");

  const fromRequest = siteUrlFromHost(host, protocol);
  return resolveAuthSiteUrl(fromRequest, null);
}

export function resolveSiteUrlFromRequest(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const fromForwarded = forwardedHost
    ? siteUrlFromHost(forwardedHost, forwardedProto)
    : null;

  return resolveAuthSiteUrl(fromForwarded ?? request.nextUrl.origin, request.nextUrl.origin);
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

/** Add in Google Cloud → Credentials → OAuth client → Authorized redirect URIs */
export const GOOGLE_OAUTH_REDIRECT_URI =
  "https://wdrslpoowatuxcgdowsw.supabase.co/auth/v1/callback";

export const SUPABASE_SITE_URL = PRODUCTION_SITE_URL;
