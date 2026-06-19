import type { UserRole } from "@/generated/prisma/client";
import { AdminSidebar } from "./components/admin-sidebar";
import { AdminTopbar } from "./components/admin-topbar";
import { roleLabel } from "@/features/auth/lib/roles";

interface AdminShellProps {
  children: React.ReactNode;
  userName: string;
  userRole: UserRole;
  showUsersNav?: boolean;
}

export function AdminShell({
  children,
  userName,
  userRole,
  showUsersNav = false,
}: AdminShellProps) {
  return (
    <div className="admin-theme flex min-h-screen bg-admin-canvas">
      <AdminSidebar
        userName={userName}
        userRoleLabel={roleLabel(userRole)}
        showUsersNav={showUsersNav}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
