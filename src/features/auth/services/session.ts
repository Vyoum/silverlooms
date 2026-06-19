import { redirect } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User, UserRole } from "@/generated/prisma/client";
import { canAccessAdmin, canManageUsers } from "@/features/auth/lib/roles";
import { syncUserFromSupabase } from "@/features/auth/services/user-sync";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/supabase/env";
import { prisma } from "@/lib/db";
import { ACCOUNT_ROUTE } from "@/lib/auth/routes";

export type AccountProfile = {
  email: string;
  name: string | null;
  dbUserId: string | null;
};

function resolveAuthEmail(authUser: SupabaseUser) {
  const direct = authUser.email?.trim().toLowerCase();
  if (direct) return direct;

  for (const identity of authUser.identities ?? []) {
    const identityEmail = identity.identity_data?.email;
    if (typeof identityEmail === "string" && identityEmail.trim()) {
      return identityEmail.trim().toLowerCase();
    }
  }

  return null;
}

function resolveAuthName(authUser: SupabaseUser) {
  const metadata = authUser.user_metadata ?? {};
  return (
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    null
  );
}

async function getSupabaseAuthUser() {
  if (!isAuthConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("[auth] getUser failed:", error.message);
    return null;
  }

  return authUser;
}

export async function getSessionUser(): Promise<User | null> {
  const authUser = await getSupabaseAuthUser();
  if (!authUser) return null;

  try {
    return await syncUserFromSupabase(authUser);
  } catch (syncError) {
    console.error("[auth] getSessionUser sync failed:", syncError);
    return null;
  }
}

/** Gate the Stitch profile dashboard on Supabase auth, not Prisma sync. */
export async function requireAccountProfile(): Promise<AccountProfile> {
  const authUser = await getSupabaseAuthUser();

  if (!authUser) {
    redirect(`/login?redirect=${encodeURIComponent(ACCOUNT_ROUTE)}`);
  }

  let dbUser: User | null = null;

  try {
    dbUser = await syncUserFromSupabase(authUser);
  } catch (syncError) {
    console.error("[auth] requireAccountProfile sync failed:", syncError);
  }

  const email = dbUser?.email ?? resolveAuthEmail(authUser);

  if (!email) {
    redirect("/login?error=Could%20not%20read%20your%20account%20email.");
  }

  return {
    email,
    name: dbUser?.name ?? resolveAuthName(authUser),
    dbUserId: dbUser?.id ?? null,
  };
}

export async function requireAuthenticatedUser() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdminUser() {
  const user = await requireAuthenticatedUser();
  if (!canAccessAdmin(user.role)) {
    redirect("/");
  }
  return user;
}

export async function requireSuperAdminUser() {
  const user = await requireAuthenticatedUser();
  if (!canManageUsers(user.role)) {
    redirect("/admin");
  }
  return user;
}

export async function listUsersForAdmin() {
  return prisma.user.findMany({
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

export function formatUserRole(role: UserRole) {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "ADMIN":
      return "Admin";
    default:
      return "Customer";
  }
}
