import { AdminShell } from "@/features/admin/admin-shell";
import { CustomOrdersCard } from "@/features/admin/components/custom-orders-card";
import { KpiCards } from "@/features/admin/components/kpi-cards";
import { LowStockAlerts } from "@/features/admin/components/low-stock-alerts";
import { QuickActions } from "@/features/admin/components/quick-actions";
import { RecentOrdersTable } from "@/features/admin/components/recent-orders-table";
import { RevenueChart } from "@/features/admin/components/revenue-chart";
import { WelcomeStrip } from "@/features/admin/components/welcome-strip";

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
    <WelcomeStrip />
    <KpiCards />

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <RevenueChart />
        <RecentOrdersTable />
      </div>
      <div className="space-y-6">
        <CustomOrdersCard />
        <LowStockAlerts />
      </div>
    </div>

    <QuickActions />
    </div>
  );
}
