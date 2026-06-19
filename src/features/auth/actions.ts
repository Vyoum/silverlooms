"use server";

import { redirect } from "next/navigation";
import { buildAuthCallbackUrl, getSiteUrl } from "@/lib/auth/site-url";
import { ACCOUNT_ROUTE, getPostLoginRedirect } from "@/lib/auth/routes";
import { syncUserFromSupabase } from "@/features/auth/services/user-sync";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

export async function signInWithEmailAction(
  _prev: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? ACCOUNT_ROUTE);

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    try {
      await syncUserFromSupabase(data.user);
    } catch (syncError) {
      console.error("[auth] Email sign-in user sync failed:", syncError);
    }
  }

  redirect(getPostLoginRedirect(redirectTo));
}

export async function signUpWithEmailAction(
  _prev: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? ACCOUNT_ROUTE);

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: buildAuthCallbackUrl(siteUrl, redirectTo),
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    error: "Check your email to confirm your account, then sign in.",
  };
}

export async function signInWithGoogleAction(formData: FormData) {
  const redirectTo = String(formData.get("redirect") ?? ACCOUNT_ROUTE);
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: buildAuthCallbackUrl(siteUrl, safeRedirect),
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect("/login?error=auth");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function ensureUserSyncedAction(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { ok: false, error: error?.message ?? "Not authenticated" };
    }

    const synced = await syncUserFromSupabase(user);
    if (!synced) {
      return { ok: false, error: "Could not resolve user email for sync." };
    }

    return { ok: true };
  } catch (syncError) {
    const message =
      syncError instanceof Error ? syncError.message : "User sync failed";
    console.error("[auth] ensureUserSyncedAction failed:", syncError);
    return { ok: false, error: message };
  }
}
