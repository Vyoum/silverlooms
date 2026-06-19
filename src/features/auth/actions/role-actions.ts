"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@/generated/prisma/client";
import { assignableRoles, type AssignableRole } from "@/features/auth/lib/roles";
import { requireSuperAdminUser } from "@/features/auth/services/session";
import { prisma } from "@/lib/db";

export interface UpdateUserRoleResult {
  success: boolean;
  error?: string;
}

export async function updateUserRoleAction(
  userId: string,
  role: AssignableRole,
): Promise<UpdateUserRoleResult> {
  try {
    const actor = await requireSuperAdminUser();

    if (!assignableRoles.includes(role)) {
      return { success: false, error: "Invalid role." };
    }

    if (actor.id === userId) {
      return { success: false, error: "You cannot change your own role." };
    }

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) {
      return { success: false, error: "User not found." };
    }

    if (target.role === UserRole.SUPER_ADMIN) {
      return { success: false, error: "Super admin roles cannot be changed here." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");

    return { success: true };
  } catch {
    return { success: false, error: "Could not update user role." };
  }
}
