import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/admin-shell";
import { BRAND_NAME } from "@/lib/constants/brand";
import { canManageUsers } from "@/features/auth/lib/roles";
import { requireAdminUser } from "@/features/auth/services/session";

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: `${BRAND_NAME} admin console`,
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();

  return (
    <AdminShell
      userName={user.name ?? user.email}
      userRole={user.role}
      showUsersNav={canManageUsers(user.role)}
    >
      {children}
    </AdminShell>
  );
}
