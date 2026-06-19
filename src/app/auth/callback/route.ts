import { getPostLoginRedirect } from "@/lib/auth/routes";
import { getConfiguredSiteUrl } from "@/lib/auth/site-url";
import { syncUserFromSupabase } from "@/features/auth/services/user-sync";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const siteUrl = getConfiguredSiteUrl() ?? requestUrl.origin;
  const code = requestUrl.searchParams.get("code");
  const safeRedirect = getPostLoginRedirect(
    requestUrl.searchParams.get("redirect"),
  );
  const authError = requestUrl.searchParams.get("error_description");

  if (authError) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=${encodeURIComponent(authError)}`,
    );
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await syncUserFromSupabase(data.user);
      return NextResponse.redirect(`${siteUrl}${safeRedirect}`);
    }
  }

  return NextResponse.redirect(
    `${siteUrl}/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`,
  );
}
