import { CommerceConsole } from "@/features/admin/components/commerce-console";
import { CommerceStatsCards } from "@/features/admin/components/commerce-stats";
import {
  getCommerceStats,
  getOrderIdByNumber,
  listOrdersForAdmin,
} from "@/features/admin/services/order-admin-service";

interface AdminCommercePageProps {
  initialOrderNumber?: string;
}

export async function AdminCommercePage({
  initialOrderNumber,
}: AdminCommercePageProps) {
  const [orders, stats, initialOrderId] = await Promise.all([
    listOrdersForAdmin(),
    getCommerceStats(),
    initialOrderNumber ? getOrderIdByNumber(initialOrderNumber) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Commerce</h1>
        <p className="mt-2 max-w-2xl text-sm text-admin-muted">
          Manage orders end to end — payments, fulfillment status, shipping labels, and
          customer details.
        </p>
      </div>

      <CommerceStatsCards stats={stats} />
      <CommerceConsole orders={orders} initialOrderId={initialOrderId} />
    </div>
  );
}
