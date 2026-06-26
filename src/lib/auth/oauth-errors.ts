/** Maps Supabase / Google OAuth errors to user-friendly login messages. */
export function formatAuthErrorMessage(error?: string | null): string | undefined {
  if (!error?.trim()) return undefined;

  const normalized = error.trim().toLowerCase();

  if (
    normalized.includes("disabled_client") ||
    normalized.includes("oauth client was disabled")
  ) {
    return "Google sign-in is temporarily unavailable because the OAuth client is disabled in Google Cloud Console. Re-enable it or update the Client ID in Supabase → Authentication → Google.";
  }

  if (normalized.includes("provider is not enabled")) {
    return "Google sign-in is not enabled in Supabase. Turn on the Google provider under Authentication → Providers.";
  }

  if (normalized.includes("redirect_uri_mismatch")) {
    return "Google sign-in redirect URL is misconfigured. Add your Supabase callback URL in Google Cloud Console credentials.";
  }

  return error.trim();
}
