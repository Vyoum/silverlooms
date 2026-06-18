import { AdminSidebar } from "./components/admin-sidebar";
import { AdminTopbar } from "./components/admin-topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-theme flex min-h-screen bg-admin-canvas">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
