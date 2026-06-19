"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/generated/prisma/client";
import { updateUserRoleAction } from "@/features/auth/actions/role-actions";
import { assignableRoles, roleLabel } from "@/features/auth/lib/roles";
import { cn } from "@/lib/utils";

export interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;
}

interface UsersTableProps {
  users: AdminUserRow[];
  currentUserId: string;
}

const roleBadgeStyles: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-[#1c1a16] text-gold",
  ADMIN: "bg-admin-primary/10 text-admin-primary",
  CUSTOMER: "bg-admin-canvas text-admin-muted",
};

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-medium text-admin-ink">Team & Roles</h2>
        <p className="mt-2 text-sm text-admin-muted">
          Super admins can promote customers to admin. Super admin accounts are protected.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border text-[11px] uppercase tracking-wider text-admin-muted">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Joined</th>
              <th className="pb-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const isProtected = user.role === "SUPER_ADMIN";

              return (
                <tr
                  key={user.id}
                  className="border-b border-admin-border/60 last:border-0"
                >
                  <td className="py-4 font-medium text-admin-ink">
                    {user.name ?? "—"}
                  </td>
                  <td className="py-4 text-admin-muted">{user.email}</td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        roleBadgeStyles[user.role],
                      )}
                    >
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-4 text-admin-muted">
                    {user.createdAt.toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-4 text-right">
                    {isProtected || isSelf ? (
                      <span className="text-[11px] text-admin-muted">—</span>
                    ) : (
                      <select
                        disabled={pending}
                        value={user.role === "SUPER_ADMIN" ? "CUSTOMER" : user.role}
                        onChange={(event) => {
                          const role = event.target.value as (typeof assignableRoles)[number];
                          startTransition(async () => {
                            await updateUserRoleAction(user.id, role);
                            router.refresh();
                          });
                        }}
                        className="rounded-lg border border-admin-border bg-admin-canvas px-2.5 py-1.5 text-xs"
                      >
                        {assignableRoles.map((role) => (
                          <option key={role} value={role}>
                            {roleLabel(role)}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
