import type { LowStockItem } from "../types";

interface LowStockAlertsProps {
  items: LowStockItem[];
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="text-admin-warning">⚠</span>
        <h3 className="font-serif text-xl font-medium text-admin-ink">
          Low Stock Alerts
        </h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-admin-muted">All products are well stocked.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.sku}
              className="flex items-center justify-between rounded-xl border border-admin-border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-admin-ink">{item.name}</p>
                <p className="mt-0.5 text-[11px] text-admin-muted">
                  SKU: {item.sku}
                </p>
              </div>
              <span
                className={
                  item.urgent
                    ? "text-[11px] font-medium text-admin-error"
                    : "text-[11px] font-medium text-admin-warning"
                }
              >
                {item.stock}
              </span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
