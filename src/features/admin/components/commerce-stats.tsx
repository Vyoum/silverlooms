import { AlertCircle, IndianRupee, Package, Truck } from "lucide-react";
import type { CommerceStats } from "@/features/admin/services/order-admin-service";

interface CommerceStatsProps {
  stats: CommerceStats;
}

const cards = [
  {
    key: "totalOrders" as const,
    label: "Total Orders",
    icon: Package,
    accent: "#5B7A5E",
    sub: (stats: CommerceStats) => `${stats.paidOrders} paid`,
  },
  {
    key: "pendingFulfillment" as const,
    label: "Pending Fulfillment",
    icon: Package,
    accent: "#B8860B",
    sub: () => "Paid, not yet shipped",
  },
  {
    key: "paidAwaitingShipment" as const,
    label: "Awaiting Shipment",
    icon: Truck,
    accent: "#4A7C8C",
    sub: () => "No Delhivery waybill yet",
  },
  {
    key: "shipmentIssues" as const,
    label: "Shipment Issues",
    icon: AlertCircle,
    accent: "#C4704A",
    sub: () => "Needs attention",
  },
  {
    key: "revenueThisMonth" as const,
    label: "Revenue This Month",
    icon: IndianRupee,
    accent: "#6B5B95",
    sub: () => "From paid orders",
  },
];

export function CommerceStatsCards({ stats }: CommerceStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const value =
          card.key === "revenueThisMonth" ? stats.revenueThisMonth : String(stats[card.key]);

        return (
          <article
            key={card.key}
            className="relative overflow-hidden rounded-2xl border border-admin-border bg-admin-surface p-5"
          >
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ backgroundColor: card.accent }}
            />
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
                {card.label}
              </p>
              <Icon className="size-5 text-admin-muted" />
            </div>
            <p className="mt-4 font-serif text-3xl font-medium text-admin-ink">{value}</p>
            <p className="mt-2 text-[11px] text-admin-muted">{card.sub(stats)}</p>
          </article>
        );
      })}
    </section>
  );
}
