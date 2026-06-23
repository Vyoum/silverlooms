"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "@/features/admin/actions/commerce-actions";
import type { AdminOrderRow } from "@/features/admin/services/order-admin-service";
import type { OrderStatus } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const statusOptions: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function statusClass(status: OrderStatus) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-800";
    case "SHIPPED":
      return "bg-sky-100 text-sky-800";
    case "PROCESSING":
      return "bg-amber-100 text-amber-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-admin-canvas text-admin-muted";
  }
}

export function OrdersAdminTable({ orders }: { orders: AdminOrderRow[] }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleStatusChange(orderId: string, status: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, status);
      router.refresh();
    });
  }

  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-medium text-admin-ink">All Orders</h2>
          <p className="mt-1 text-sm text-admin-muted">
            Update fulfillment status as orders move through your pipeline.
          </p>
        </div>
        <span className="text-sm text-admin-muted">{orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <p className="py-10 text-center text-sm text-admin-muted">
          No orders yet. They will appear here after customers checkout.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-admin-border text-[11px] uppercase tracking-wider text-admin-muted">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-admin-border/70">
                  <td className="py-4 font-medium text-admin-ink">{order.orderNumber}</td>
                  <td className="py-4">
                    <p className="text-admin-ink">{order.customerName}</p>
                    <p className="text-xs text-admin-muted">{order.customerEmail}</p>
                  </td>
                  <td className="py-4 text-admin-muted">{order.itemCount}</td>
                  <td className="py-4 font-medium text-admin-ink">{order.total}</td>
                  <td className="py-4">
                    <span className="rounded-full bg-admin-canvas px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-admin-muted">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4">
                    <select
                      value={order.status}
                      disabled={pending}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value as OrderStatus)
                      }
                      className={cn(
                        "rounded-full border-0 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider outline-none",
                        statusClass(order.status),
                      )}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 text-admin-muted">{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
