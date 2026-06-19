import { redirect } from "next/navigation";
import type { User, UserRole } from "@/generated/prisma/client";
import { canAccessAdmin, canManageUsers } from "@/features/auth/lib/roles";
import { syncUserFromSupabase } from "@/features/auth/services/user-sync";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/supabase/env";
import { prisma } from "@/lib/db";

export async function getSessionUser(): Promise<User | null> {
  if (!isAuthConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  return syncUserFromSupabase(authUser);
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
