"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ExternalLink, RefreshCw, X } from "lucide-react";
import {
  getOrderDetailAction,
  retryDelhiveryShipmentAction,
  updateOrderStatusAction,
} from "@/features/admin/actions/commerce-actions";
import type { AdminOrderDetail } from "@/features/admin/services/order-admin-service";
import type { OrderStatus } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
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

function paymentClass(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    case "REFUNDED":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-admin-canvas text-admin-muted";
  }
}

function formatAddress(order: AdminOrderDetail) {
  const lines = [
    order.shippingLine1,
    order.shippingLine2,
    [order.shippingCity, order.shippingState, order.shippingPincode]
      .filter(Boolean)
      .join(", "),
  ].filter(Boolean);

  return lines.length > 0 ? lines : ["No shipping address on file"];
}

interface OrderDetailPanelProps {
  orderId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export function OrderDetailPanel({ orderId, onClose, onUpdated }: OrderDetailPanelProps) {
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function loadOrder() {
    setLoadError(null);
    const result = await getOrderDetailAction(orderId);

    if (!result.success) {
      setLoadError(result.error);
      setOrder(null);
      return;
    }

    setOrder(result.order);
  }

  useEffect(() => {
    void loadOrder();
  }, [orderId]);

  function handleStatusChange(status: OrderStatus) {
    startTransition(async () => {
      setActionError(null);
      const result = await updateOrderStatusAction(orderId, status);
      if (!result.success) {
        setActionError(result.error ?? "Could not update status.");
        return;
      }
      await loadOrder();
      onUpdated();
    });
  }

  function handleRetryShipment() {
    startTransition(async () => {
      setActionError(null);
      const result = await retryDelhiveryShipmentAction(orderId);
      if (!result.success) {
        setActionError(result.error ?? "Could not create shipment.");
        return;
      }
      await loadOrder();
      onUpdated();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-0 sm:p-4">
      <div className="flex h-full w-full max-w-xl flex-col border-admin-border bg-admin-surface shadow-2xl sm:rounded-2xl sm:border">
        <div className="flex items-start justify-between border-b border-admin-border px-6 py-5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
              Order Details
            </p>
            <h2 className="mt-1 font-serif text-2xl font-medium text-admin-ink">
              {order?.orderNumber ?? "Loading…"}
            </h2>
            {order ? (
              <p className="mt-1 text-sm text-admin-muted">{order.createdAt}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-admin-muted transition-colors hover:bg-admin-canvas hover:text-admin-ink"
            aria-label="Close order details"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadError ? (
            <p className="text-sm text-red-600">{loadError}</p>
          ) : !order ? (
            <p className="text-sm text-admin-muted">Loading order…</p>
          ) : (
            <div className="space-y-6">
              <section className="rounded-xl border border-admin-border bg-admin-canvas p-4">
                <h3 className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
                  Customer
                </h3>
                <p className="mt-2 font-medium text-admin-ink">{order.customerName}</p>
                <p className="text-sm text-admin-muted">{order.customerEmail}</p>
                {order.customerPhone ? (
                  <p className="text-sm text-admin-muted">{order.customerPhone}</p>
                ) : null}
              </section>

              <section className="rounded-xl border border-admin-border bg-admin-canvas p-4">
                <h3 className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
                  Shipping Address
                </h3>
                <div className="mt-2 space-y-1 text-sm text-admin-ink">
                  {formatAddress(order).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-admin-muted">
                  Line Items
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 rounded-xl border border-admin-border px-4 py-3"
                    >
                      <div>
                        <Link
                          href={`/product/${item.productSlug}`}
                          target="_blank"
                          className="font-medium text-admin-ink hover:text-admin-primary"
                        >
                          {item.productName}
                        </Link>
                        <p className="mt-1 text-xs text-admin-muted">
                          Qty {item.quantity}
                          {item.size ? ` · ${item.size}` : ""}
                          {item.colorHex ? ` · ${item.colorHex}` : ""}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-admin-ink">
                        {item.unitPrice}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-admin-border bg-admin-canvas p-4">
                <h3 className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
                  Order Summary
                </h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-admin-muted">Subtotal</dt>
                    <dd className="text-admin-ink">{order.subtotal}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-admin-muted">Shipping</dt>
                    <dd className="text-admin-ink">{order.shippingCost}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-admin-muted">Discount</dt>
                    <dd className="text-admin-ink">{order.discount}</dd>
                  </div>
                  {order.promoCode ? (
                    <div className="flex justify-between">
                      <dt className="text-admin-muted">Promo</dt>
                      <dd className="text-admin-ink">{order.promoCode}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between border-t border-admin-border pt-2 font-medium">
                    <dt className="text-admin-ink">Total</dt>
                    <dd className="text-admin-ink">{order.total}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border border-admin-border bg-admin-canvas p-4">
                <h3 className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
                  Payment
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
                      paymentClass(order.paymentStatus),
                    )}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                {order.razorpayOrderId ? (
                  <p className="mt-3 break-all text-xs text-admin-muted">
                    Razorpay Order: {order.razorpayOrderId}
                  </p>
                ) : null}
                {order.razorpayPaymentId ? (
                  <p className="mt-1 break-all text-xs text-admin-muted">
                    Razorpay Payment: {order.razorpayPaymentId}
                  </p>
                ) : null}
              </section>

              <section className="rounded-xl border border-admin-border bg-admin-canvas p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
                    Fulfillment
                  </h3>
                  <select
                    value={order.status}
                    disabled={pending}
                    onChange={(event) =>
                      handleStatusChange(event.target.value as OrderStatus)
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
                </div>

                {order.delhiveryWaybill ? (
                  <div className="mt-4">
                    <p className="text-sm text-admin-ink">
                      Waybill:{" "}
                      <span className="font-medium">{order.delhiveryWaybill}</span>
                    </p>
                    <a
                      href={`https://www.delhivery.com/track/package/${order.delhiveryWaybill}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-admin-primary hover:underline"
                    >
                      Track on Delhivery
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                ) : order.paymentStatus === "PAID" ? (
                  <div className="mt-4">
                    <p className="text-sm text-admin-muted">No shipment created yet.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 gap-2"
                      disabled={pending}
                      onClick={handleRetryShipment}
                    >
                      <RefreshCw className={cn("size-4", pending && "animate-spin")} />
                      Create Delhivery Shipment
                    </Button>
                  </div>
                ) : null}

                {order.delhiveryShipmentError ? (
                  <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {order.delhiveryShipmentError}
                  </p>
                ) : null}
              </section>

              {actionError ? (
                <p className="text-sm text-red-600">{actionError}</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
