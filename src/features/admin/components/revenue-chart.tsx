import type { RevenueSummaryItem } from "../types";

interface RevenueChartProps {
  chartData: number[];
  revenueSummary: RevenueSummaryItem[];
}

function buildChartPath(values: number[], width: number, height: number) {
  const max = Math.max(...values, 1);
  const step = width / (values.length - 1);

  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - (value / max) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const line = points.join(" ");
  const area = `${line} ${width},${height} 0,${height}`;
  return { line, area };
}

export function RevenueChart({ chartData, revenueSummary }: RevenueChartProps) {
  const width = 560;
  const height = 180;
  const { line, area } = buildChartPath(chartData, width, height);

  return (
    <article className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-medium text-admin-ink">
            Revenue Overview
          </h3>
          <p className="mt-1 text-sm text-admin-muted">Last 7 days (paid orders)</p>
        </div>
        <div className="flex flex-wrap gap-6">
          {revenueSummary.map((item) => (
            <div key={item.label} className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-admin-muted">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-medium text-admin-ink">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-44 w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C4704A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#C4704A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#revenueFill)" />
          <polyline
            points={line}
            fill="none"
            stroke="#C4704A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-admin-muted">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
