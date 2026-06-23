import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  isProtectedRoute,
  getPostLoginRedirect,
} from "@/lib/auth/routes";
import { getSupabaseEnv } from "./env";

function redirectOAuthCodeToCallback(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const code = searchParams.get("code");

  if (!code || pathname === "/auth/callback") {
    return null;
  }

  // Supabase sometimes sends the PKCE code to Site URL (/) instead of /auth/callback
  // when the exact callback URL is missing from the Supabase redirect allowlist.
  const callbackUrl = request.nextUrl.clone();
  callbackUrl.pathname = "/auth/callback";

  if (!callbackUrl.searchParams.get("redirect")) {
    callbackUrl.searchParams.set(
      "redirect",
      pathname === "/" ? "/admin" : pathname,
    );
  }

  return NextResponse.redirect(callbackUrl);
}

export async function updateSession(request: NextRequest) {
  const oauthRedirect = redirectOAuthCodeToCallback(request);
  if (oauthRedirect) {
    return oauthRedirect;
  }

  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === "/login") {
    const redirectTo = getPostLoginRedirect(
      request.nextUrl.searchParams.get("redirect"),
    );
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Strip stale OAuth codes from the address bar once a session exists.
  if (user && request.nextUrl.searchParams.has("code") && pathname !== "/auth/callback") {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("code");
    return NextResponse.redirect(cleanUrl);
  }

  return supabaseResponse;
}
