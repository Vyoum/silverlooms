import {
  listUsersForAdmin,
  requireSuperAdminUser,
} from "@/features/auth/services/session";
import { UsersTable } from "@/features/admin/components/users-table";

export async function AdminUsersPage() {
  const currentUser = await requireSuperAdminUser();
  const users = await listUsersForAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Users</h1>
        <p className="mt-2 text-sm text-admin-muted">
          Manage who can access the admin dashboard.
        </p>
      </div>

      <UsersTable users={users} currentUserId={currentUser.id} />
    </div>
  );
}
