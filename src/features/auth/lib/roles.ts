import type { UserRole } from "@/generated/prisma/client";

export function canAccessAdmin(role: UserRole) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function canManageUsers(role: UserRole) {
  return role === "SUPER_ADMIN";
}

export function roleLabel(role: UserRole) {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "ADMIN":
      return "Admin";
    default:
      return "Customer";
  }
}

export const assignableRoles = ["CUSTOMER", "ADMIN"] as const satisfies readonly UserRole[];

export type AssignableRole = (typeof assignableRoles)[number];
