import { HOME_ROUTE, getPostLoginRedirect } from "@/lib/auth/routes";
import {
  buildAuthCallbackUrl,
  resolveSiteUrlFromRequest,
} from "@/lib/auth/site-url";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/supabase/env";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  const siteUrl = resolveSiteUrlFromRequest(request);
  const redirectPath = getPostLoginRedirect(
    request.nextUrl.searchParams.get("redirect") ?? HOME_ROUTE,
  );
  const callbackUrl = buildAuthCallbackUrl(siteUrl, redirectPath);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error?.message ?? "Google sign-in failed.")}`,
        siteUrl,
      ),
    );
  }

  return NextResponse.redirect(data.url);
}
