import type { User as SupabaseUser } from "@supabase/supabase-js";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

function resolveEmail(authUser: SupabaseUser) {
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

function resolveName(authUser: SupabaseUser) {
  const metadata = authUser.user_metadata ?? {};
  return (
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    null
  );
}

function isSuperAdminEmail(email: string) {
  const configured = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(configured && email.toLowerCase() === configured);
}

export async function syncUserFromSupabase(authUser: SupabaseUser) {
  const email = resolveEmail(authUser);
  if (!email) {
    console.warn("[auth] Cannot sync user without email", {
      supabaseId: authUser.id,
    });
    return null;
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ supabaseId: authUser.id }, { email }],
    },
  });

  const name = resolveName(authUser);

  if (existing) {
    const shouldBootstrapSuperAdmin =
      isSuperAdminEmail(email) && existing.role === UserRole.CUSTOMER;

    try {
      return await prisma.user.update({
        where: { id: existing.id },
        data: {
          supabaseId: authUser.id,
          email,
          name: name ?? existing.name,
          ...(shouldBootstrapSuperAdmin ? { role: UserRole.SUPER_ADMIN } : {}),
        },
      });
    } catch (error) {
      console.error("[auth] Failed to update user in database", {
        supabaseId: authUser.id,
        email,
        error,
      });
      throw error;
    }
  }

  try {
    return await prisma.user.create({
      data: {
        supabaseId: authUser.id,
        email,
        name,
        role: isSuperAdminEmail(email)
          ? UserRole.SUPER_ADMIN
          : UserRole.CUSTOMER,
      },
    });
  } catch (error) {
    console.error("[auth] Failed to create user in database", {
      supabaseId: authUser.id,
      email,
      error,
    });
    throw error;
  }
}
