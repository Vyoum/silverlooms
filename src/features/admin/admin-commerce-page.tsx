import { OrdersAdminTable } from "@/features/admin/components/orders-admin-table";
import { listOrdersForAdmin } from "@/features/admin/services/order-admin-service";

export async function AdminCommercePage() {
  const orders = await listOrdersForAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-admin-ink">Commerce</h1>
        <p className="mt-2 max-w-2xl text-sm text-admin-muted">
          Manage customer orders and update fulfillment status from pending through
          delivered.
        </p>
      </div>
      <OrdersAdminTable orders={orders} />
    </div>
  );
}
