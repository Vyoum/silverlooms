"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { OrderDetailPanel } from "@/features/admin/components/order-detail-panel";
import { updateOrderStatusAction } from "@/features/admin/actions/commerce-actions";
import type { AdminOrderRow } from "@/features/admin/services/order-admin-service";
import type { OrderStatus } from "@/generated/prisma/client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type OrderFilter =
  | "all"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "payment_issues"
  | "shipment_issues";

const filterTabs: { id: OrderFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
  { id: "payment_issues", label: "Payment Issues" },
  { id: "shipment_issues", label: "Shipment Issues" },
];

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

function paymentClass(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-admin-canvas text-admin-muted";
  }
}

function matchesFilter(order: AdminOrderRow, filter: OrderFilter) {
  switch (filter) {
    case "pending":
      return order.status === "PENDING";
    case "processing":
      return order.status === "PROCESSING";
    case "shipped":
      return order.status === "SHIPPED";
    case "delivered":
      return order.status === "DELIVERED";
    case "cancelled":
      return order.status === "CANCELLED";
    case "payment_issues":
      return order.paymentStatus === "FAILED" || order.paymentStatus === "PENDING";
    case "shipment_issues":
      return order.hasShipmentError || (order.paymentStatus === "PAID" && !order.delhiveryWaybill);
    default:
      return true;
  }
}

interface CommerceConsoleProps {
  orders: AdminOrderRow[];
  initialOrderId?: string | null;
}

export function CommerceConsole({ orders, initialOrderId = null }: CommerceConsoleProps) {
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialOrderId);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      if (!matchesFilter(order, filter)) return false;
      if (!normalizedQuery) return true;

      return (
        order.orderNumber.toLowerCase().includes(normalizedQuery) ||
        order.customerName.toLowerCase().includes(normalizedQuery) ||
        order.customerEmail.toLowerCase().includes(normalizedQuery) ||
        (order.customerPhone?.includes(normalizedQuery) ?? false)
      );
    });
  }, [filter, orders, query]);

  function handleStatusChange(orderId: string, status: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, status);
      router.refresh();
    });
  }

  function handleOrderUpdated() {
    router.refresh();
  }

  return (
    <>
      <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium text-admin-ink">Orders</h2>
            <p className="mt-1 text-sm text-admin-muted">
              Click an order to view details, shipping info, and fulfillment actions.
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-admin-muted" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order #, name, email…"
              className="h-10 rounded-xl border-admin-border bg-admin-canvas pl-10 text-sm"
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors",
                filter === tab.id
                  ? "bg-admin-primary text-white"
                  : "bg-admin-canvas text-admin-muted hover:text-admin-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-4 text-sm text-admin-muted">
          Showing {filtered.length} of {orders.length} orders
        </div>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-admin-muted">
            No orders match this filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="border-b border-admin-border text-[11px] uppercase tracking-wider text-admin-muted">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Shipment</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer border-b border-admin-border/70 transition-colors hover:bg-admin-canvas/60"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <td className="py-4 font-medium text-admin-ink">{order.orderNumber}</td>
                    <td className="py-4">
                      <p className="text-admin-ink">{order.customerName}</p>
                      <p className="text-xs text-admin-muted">{order.customerEmail}</p>
                    </td>
                    <td className="py-4 text-admin-muted">{order.itemCount}</td>
                    <td className="py-4 font-medium text-admin-ink">{order.total}</td>
                    <td className="py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
                          paymentClass(order.paymentStatus),
                        )}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4">
                      {order.delhiveryWaybill ? (
                        <span className="text-xs font-medium text-admin-ink">
                          {order.delhiveryWaybill}
                        </span>
                      ) : order.hasShipmentError ? (
                        <span className="text-xs font-medium text-red-600">Error</span>
                      ) : order.paymentStatus === "PAID" ? (
                        <span className="text-xs text-admin-muted">Pending</span>
                      ) : (
                        <span className="text-xs text-admin-muted">—</span>
                      )}
                    </td>
                    <td className="py-4" onClick={(event) => event.stopPropagation()}>
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

      {selectedOrderId ? (
        <OrderDetailPanel
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onUpdated={handleOrderUpdated}
        />
      ) : null}
    </>
  );
}
