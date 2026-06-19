import type { User as SupabaseUser } from "@supabase/supabase-js";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

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
  const email = authUser.email?.trim().toLowerCase();
  if (!email) return null;

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ supabaseId: authUser.id }, { email }],
    },
  });

  const name = resolveName(authUser);

  if (existing) {
    const shouldBootstrapSuperAdmin =
      isSuperAdminEmail(email) && existing.role === UserRole.CUSTOMER;

    return prisma.user.update({
      where: { id: existing.id },
      data: {
        supabaseId: authUser.id,
        email,
        name: name ?? existing.name,
        ...(shouldBootstrapSuperAdmin ? { role: UserRole.SUPER_ADMIN } : {}),
      },
    });
  }

  return prisma.user.create({
    data: {
      supabaseId: authUser.id,
      email,
      name,
      role: isSuperAdminEmail(email) ? UserRole.SUPER_ADMIN : UserRole.CUSTOMER,
    },
  });
}
