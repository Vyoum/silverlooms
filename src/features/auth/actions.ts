"use server";

import { redirect } from "next/navigation";
import { buildAuthCallbackUrl, getSiteUrl } from "@/lib/auth/site-url";
import { getPostLoginRedirect } from "@/lib/auth/routes";
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
  const redirectTo = String(formData.get("redirect") ?? "/");

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user) {
    await syncUserFromSupabase(data.user);
  }

  redirect(getPostLoginRedirect(redirectTo));
}

export async function signUpWithEmailAction(
  _prev: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/");

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
  const redirectTo = String(formData.get("redirect") ?? "/");
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
