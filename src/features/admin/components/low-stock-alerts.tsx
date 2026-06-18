import { AlertTriangle } from "lucide-react";
import { lowStockItems } from "../lib/mock-data";

export function LowStockAlerts() {
  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6 flex items-center gap-2">
        <AlertTriangle className="size-5 text-admin-warning" />
        <h3 className="font-serif text-xl font-medium text-admin-ink">
          Low Stock Alerts
        </h3>
      </div>

      <div className="space-y-3">
        {lowStockItems.map((item) => (
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
    </article>
  );
}
