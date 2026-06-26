import Image from "next/image";
import Link from "next/link";
import type { Order, OrderItem, OrderStatus } from "@/generated/prisma/client";
import type { AccountProfile } from "@/features/auth/services/session";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageShell } from "@/components/layout/page-shell";
import { ProfileMenuSection } from "@/features/account/components/profile-menu-section";
import { signOutAction } from "@/features/auth/actions";
import { BRAND_NAME } from "@/lib/constants/brand";
import {
  Bell,
  BookOpen,
  CreditCard,
  Eye,
  Heart,
  HelpCircle,
  History,
  MapPin,
  Package,
  Palette,
  Truck,
} from "lucide-react";

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: { imageUrl: string };
  })[];
};

interface ProfileDashboardPageProps {
  profile: AccountProfile;
  orders: OrderWithItems[];
  totalOrders: number;
  wishlistCount: number;
  memberSince: number;
}

function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "DELIVERED":
      return "Delivered";
    case "SHIPPED":
      return "Shipped";
    case "PROCESSING":
      return "In Studio";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Processing";
  }
}

function getInitials(name: string | null, email: string) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
}

function getDisplayName(name: string | null, email: string) {
  if (name?.trim()) return name.trim();
  return email.split("@")[0];
}

export function ProfileDashboardPage({
  profile,
  orders,
  totalOrders,
  wishlistCount,
  memberSince,
}: ProfileDashboardPageProps) {
  const fullName = getDisplayName(profile.name, profile.email);
  const initials = getInitials(profile.name, profile.email);
  const customOrders = 0;

  return (
    <PageShell>
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg md:max-w-[1280px]">
        <section className="px-5 pb-2 pt-10 text-center md:pt-14">
          <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-2xl border border-border bg-cream-warm font-serif text-2xl tracking-wide text-ink">
            {initials}
          </div>
          <h1 className="font-serif text-[2rem] leading-tight text-ink">{fullName}</h1>
          <p className="mt-2 text-sm text-sage">
            Patron since {memberSince}
            <span className="mx-2 text-border">·</span>
            <span className="uppercase tracking-[0.12em] text-ink/70">Edit</span>
          </p>
        </section>

        <section className="mx-5 mt-6 overflow-hidden rounded-xl border border-border bg-white">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { value: totalOrders, label: "Orders" },
              { value: wishlistCount, label: "Wishlist" },
              { value: customOrders, label: "Custom" },
            ].map((stat) => (
              <div key={stat.label} className="px-3 py-5 text-center">
                <p className="font-serif text-3xl leading-none text-ink">{stat.value}</p>
                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.16em] text-sage">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <ProfileMenuSection
          title="My Orders"
          items={[
            { label: "All Orders", href: "#orders", icon: Package },
            { label: "Custom Orders", href: "/jewellery", icon: Palette, badge: customOrders > 0 },
            { label: "Track Shipment", href: "#orders", icon: Truck },
          ]}
        />

        <ProfileMenuSection
          title="My Collection"
          items={[
            { label: "Wishlist", href: "/wishlist", icon: Heart },
            { label: "Recently Viewed", href: "/kurtis", icon: Eye },
            { label: "Browse History", href: "/kurtis?sort=bestseller", icon: History },
          ]}
        />

        <ProfileMenuSection
          title="Account"
          items={[
            { label: "Addresses", href: "#", icon: MapPin },
            { label: "Payment", href: "#", icon: CreditCard },
            { label: "Notifications", href: "#", icon: Bell },
            { label: "Help", href: "#", icon: HelpCircle },
            { label: "Our Story", href: "/#editorial", icon: BookOpen },
          ]}
        />

        <form action={signOutAction} className="mt-10 px-5 text-center">
          <button
            type="submit"
            className="border-b border-ink/30 pb-0.5 text-sm text-ink transition-colors hover:border-ink"
          >
            Sign Out
          </button>
        </form>

        <section id="orders" className="mt-12 px-5 pb-10 md:px-16">
          <div className="mb-6 flex items-end justify-between border-b border-ink/10 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-sage">{BRAND_NAME}</p>
              <h2 className="mt-1 font-serif text-2xl text-ink">Recent Orders</h2>
            </div>
            {totalOrders > orders.length ? (
              <span className="text-[10px] uppercase tracking-[0.14em] text-sage">
                {totalOrders} total
              </span>
            ) : null}
          </div>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center">
              <p className="font-serif text-xl text-ink">No orders yet</p>
              <p className="mt-2 text-sm text-sage">
                When you place an order, it will appear here.
              </p>
              <Link
                href="/kurtis"
                className="mt-6 inline-block border-b border-ink pb-1 text-[11px] uppercase tracking-[0.14em] text-ink"
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const item = order.items[0];
                const imageUrl = item?.product.imageUrl;

                return (
                  <article
                    key={order.id}
                    className="overflow-hidden rounded-xl border border-border bg-white"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-[10px] uppercase tracking-wider text-sage">
                            Order
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-sage">
                          Order #{order.orderNumber}
                        </p>
                        <h3 className="mt-1 font-serif text-lg text-ink">
                          {item?.productName ?? "Order items"}
                        </h3>
                        <p className="mt-1 text-sm text-sage">
                          {formatOrderDate(order.createdAt)} · {getStatusLabel(order.status)}
                        </p>
                        <Link
                          href={`/checkout/success?order=${order.orderNumber}`}
                          className="mt-3 inline-block text-[11px] uppercase tracking-[0.14em] text-ink underline-offset-2 hover:underline"
                        >
                          View order
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
