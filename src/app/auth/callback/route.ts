import { getPostLoginRedirect } from "@/lib/auth/routes";
import { resolveSiteUrlFromRequest } from "@/lib/auth/site-url";
import { syncUserFromSupabase } from "@/features/auth/services/user-sync";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const siteUrl = resolveSiteUrlFromRequest(requestUrl);
  const code = requestUrl.searchParams.get("code");
  const safeRedirect = getPostLoginRedirect(
    requestUrl.searchParams.get("redirect"),
  );
  const authError = requestUrl.searchParams.get("error_description");
  const redirectUrl = `${siteUrl}${safeRedirect}`;

  if (authError) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=${encodeURIComponent(authError)}`,
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`,
    );
  }

  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=${encodeURIComponent("Auth is not configured.")}`,
    );
  }

  let response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.redirect(redirectUrl);
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("[auth] OAuth code exchange failed:", error?.message);
    return NextResponse.redirect(
      `${siteUrl}/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`,
    );
  }

  try {
    await syncUserFromSupabase(data.user);
  } catch (syncError) {
    console.error("[auth] OAuth callback user sync failed:", syncError);
  }

  return response;
}
