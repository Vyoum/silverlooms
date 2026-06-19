import type { PendingOrderRow } from "../types";

interface PendingOrdersCardProps {
  orders: PendingOrderRow[];
}

export function PendingOrdersCard({ orders }: PendingOrdersCardProps) {
  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-serif text-xl font-medium text-admin-ink">
          Pending Orders
        </h3>
        <span className="rounded-full bg-admin-warning/10 px-2.5 py-1 text-[11px] font-medium text-admin-warning">
          {orders.length} Active
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-admin-muted">No pending orders right now.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              className="rounded-xl border border-admin-border bg-admin-canvas p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-admin-ink">{order.title}</p>
                  <p className="mt-1 text-[11px] text-admin-muted">{order.time}</p>
                </div>
              </div>
              {order.note && (
                <p className="mt-3 border-l-2 border-admin-primary/30 pl-3 text-sm italic text-admin-muted">
                  {order.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
