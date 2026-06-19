import type { OrderStatus } from "@/generated/prisma/client";
import type { RecentOrderRow } from "../types";

const statusStyles: Record<OrderStatus, string> = {
  SHIPPED: "bg-admin-success/10 text-admin-success",
  PROCESSING: "bg-admin-primary/10 text-admin-primary",
  PENDING: "bg-admin-warning/10 text-admin-warning",
  DELIVERED: "bg-admin-success/10 text-admin-success",
  CANCELLED: "bg-admin-muted/10 text-admin-muted",
};

interface RecentOrdersTableProps {
  orders: RecentOrderRow[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-serif text-xl font-medium text-admin-ink">
          Recent Orders
        </h3>
        <span className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
          {orders.length} orders
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="py-8 text-center text-sm text-admin-muted">
          No orders yet. Orders appear here when customers complete checkout.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-admin-border text-[11px] uppercase tracking-wider text-admin-muted">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-admin-border/60 last:border-0"
                >
                  <td className="py-4 font-medium text-admin-ink">{order.id}</td>
                  <td className="py-4 text-admin-muted">{order.customer}</td>
                  <td className="py-4 text-admin-muted">{order.date}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusStyles[order.status]}`}
                    >
                      {order.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="py-4 text-right font-medium text-admin-ink">
                    {order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
