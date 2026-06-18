import {
  AlertCircle,
  Eye,
  IndianRupee,
  Package,
  Palette,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { kpiMetrics } from "../lib/mock-data";

const iconMap = {
  "indian-rupee": IndianRupee,
  package: Package,
  sparkles: Sparkles,
  palette: Palette,
  eye: Eye,
};

export function KpiCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {kpiMetrics.map((metric) => {
        const Icon = iconMap[metric.icon as keyof typeof iconMap];

        return (
          <article
            key={metric.label}
            className="relative overflow-hidden rounded-2xl border border-admin-border bg-admin-surface p-5"
          >
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ backgroundColor: metric.accent }}
            />
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
                {metric.label}
              </p>
              <Icon className="size-5 text-admin-muted" />
            </div>
            <p className="mt-4 font-serif text-4xl font-medium text-admin-ink">
              {metric.value}
            </p>
            {"progress" in metric && metric.progress !== undefined ? (
              <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-admin-canvas">
                  <div
                    className="h-full rounded-full bg-admin-primary"
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-[11px] text-admin-muted">
                  {metric.progressLabel}
                </p>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-1.5 text-[11px]">
                {metric.trend === "up" ? (
                  <TrendingUp className="size-3.5 text-admin-success" />
                ) : (
                  <AlertCircle className="size-3.5 text-admin-warning" />
                )}
                <span
                  className={
                    metric.trend === "up"
                      ? "font-medium text-admin-success"
                      : "font-medium text-admin-warning"
                  }
                >
                  {metric.change}
                </span>
                {"changeLabel" in metric && metric.changeLabel && (
                  <span className="text-admin-muted">{metric.changeLabel}</span>
                )}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
