import { getDashboardData } from "@/features/admin/services/analytics-service";
import { KpiCards } from "@/features/admin/components/kpi-cards";
import { LowStockAlerts } from "@/features/admin/components/low-stock-alerts";
import { ManagementHub } from "@/features/admin/components/management-hub";
import { PendingOrdersCard } from "@/features/admin/components/pending-orders-card";
import { QuickActions } from "@/features/admin/components/quick-actions";
import { RecentOrdersTable } from "@/features/admin/components/recent-orders-table";
import { RevenueChart } from "@/features/admin/components/revenue-chart";
import { WelcomeStrip } from "@/features/admin/components/welcome-strip";

export async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <WelcomeStrip
        productCount={data.productCount}
        apparelCount={data.apparelCount}
        jewelleryCount={data.jewelleryCount}
      />
      <ManagementHub />
      <div id="analytics" className="space-y-6 scroll-mt-8">
        <KpiCards metrics={data.kpis} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <RevenueChart
              chartData={data.chartData}
              revenueSummary={data.revenueSummary}
            />
            <RecentOrdersTable orders={data.recentOrders} />
          </div>
          <div className="space-y-6">
            <PendingOrdersCard orders={data.pendingOrders} />
            <LowStockAlerts items={data.lowStockItems} />
          </div>
        </div>

        <QuickActions />
      </div>
    </div>
  );
}
