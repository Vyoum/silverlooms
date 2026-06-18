import { customOrders } from "../lib/mock-data";

export function CustomOrdersCard() {
  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-serif text-xl font-medium text-admin-ink">
          Custom Orders
        </h3>
        <span className="rounded-full bg-admin-warning/10 px-2.5 py-1 text-[11px] font-medium text-admin-warning">
          7 Pending
        </span>
      </div>

      <div className="space-y-4">
        {customOrders.map((order) => (
          <div
            key={order.title}
            className="rounded-xl border border-admin-border bg-admin-canvas p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-admin-ink">{order.title}</p>
                <p className="mt-1 text-[11px] text-admin-muted">{order.time}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg bg-admin-primary px-3 py-1.5 text-[11px] font-medium text-white"
              >
                {order.primaryAction}
              </button>
            </div>
            {order.note && (
              <p className="mt-3 border-l-2 border-admin-primary/30 pl-3 text-sm italic text-admin-muted">
                {order.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
