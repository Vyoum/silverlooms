import { getSessionUser } from "@/features/auth/services/session";

/**
 * Ensures Supabase Auth users are mirrored into the Prisma `users` table
 * on any page load — not only at sign-in/callback time.
 */
export async function AuthSessionSync() {
  try {
    await getSessionUser();
  } catch (error) {
    console.error("[auth] Failed to sync session user to database:", error);
  }

  return null;
}
