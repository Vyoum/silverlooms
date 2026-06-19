import Image from "next/image";
import Link from "next/link";
import type { Order, OrderItem, OrderStatus } from "@/generated/prisma/client";
import type { AccountProfile } from "@/features/auth/services/session";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageShell } from "@/components/layout/page-shell";
import { signOutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: { imageUrl: string };
  })[];
};

interface ProfileDashboardPageProps {
  profile: AccountProfile;
  orders: OrderWithItems[];
  totalOrders: number;
}

const accountNavItems = [
  { label: "Order History", active: true },
  { label: "Bespoke Requests", active: false },
  { label: "Saved Pieces", active: false },
  { label: "Personal Details", active: false },
  { label: "Addresses", active: false },
] as const;

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

function getStatusClass(status: OrderStatus) {
  switch (status) {
    case "DELIVERED":
      return "border-forest text-forest";
    case "SHIPPED":
    case "PROCESSING":
      return "border-heritage-gold text-heritage-gold";
    case "CANCELLED":
      return "border-red-600 text-red-600";
    default:
      return "border-sage text-sage";
  }
}

function getDisplayName(profile: AccountProfile) {
  if (profile.name?.trim()) {
    return profile.name.trim().split(" ")[0];
  }

  return profile.email.split("@")[0];
}

export function ProfileDashboardPage({
  profile,
  orders,
  totalOrders,
}: ProfileDashboardPageProps) {
  const firstName = getDisplayName(profile);

  return (
    <PageShell>
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-5 py-16 md:px-16">
        <div className="mb-24 text-center md:text-left">
          <h1 className="font-serif text-[40px] leading-tight text-ink md:text-[64px] md:leading-[72px]">
            The Curated Heritage
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-sage">
            A sanctuary for your personal collection and bespoke journeys.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:gap-16">
          <aside className="mb-12 w-full shrink-0 md:mb-0 md:w-64">
            <nav className="flex flex-col space-y-6">
              {accountNavItems.map((item) => (
                <span
                  key={item.label}
                  className={cn(
                    "flex items-center gap-4 text-xs font-medium uppercase tracking-[0.1em]",
                    item.active
                      ? "text-heritage-gold"
                      : "text-sage",
                  )}
                >
                  <span
                    className={cn(
                      "block h-px",
                      item.active
                        ? "w-8 bg-heritage-gold"
                        : "w-4 bg-border",
                    )}
                  />
                  {item.label}
                </span>
              ))}
            </nav>

            <form action={signOutAction} className="mt-12">
              <button
                type="submit"
                className="text-xs font-medium uppercase tracking-[0.1em] text-sage transition-colors hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-16">
              <h2 className="font-serif text-[32px] leading-10 text-ink">
                Welcome back, {firstName}
              </h2>
              <p className="mt-2 text-base text-sage">
                Manage your collection and track your recent acquisitions below.
              </p>
            </div>

            <section className="mb-24">
              <div className="mb-8 flex items-end justify-between border-b border-ink/10 pb-4">
                <h3 className="font-serif text-2xl text-ink">Recent Orders</h3>
                {totalOrders > orders.length && (
                  <span className="text-xs font-medium uppercase tracking-[0.1em] text-sage">
                    {totalOrders} total
                  </span>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="border border-dashed border-border bg-cream-dark/40 px-8 py-16 text-center">
                  <p className="font-serif text-2xl text-ink">No orders yet</p>
                  <p className="mt-3 text-sage">
                    When you place an order, it will appear here.
                  </p>
                  <Link
                    href="/kurtis"
                    className="mt-8 inline-block border-b border-ink pb-1 text-xs font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:border-heritage-gold hover:text-heritage-gold"
                  >
                    Explore Collections
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order, index) => {
                    const item = order.items[0];
                    const imageUrl = item?.product.imageUrl;

                    return (
                      <div key={order.id}>
                        <div className="group flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                          <div className="aspect-[3/4] w-full overflow-hidden bg-cream-dark sm:w-48">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={item.productName}
                                width={192}
                                height={256}
                                className="size-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center bg-cream-dark px-4 text-center text-xs font-medium uppercase tracking-[0.1em] text-sage">
                                Order
                                <br />
                                Item
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-start justify-between gap-4">
                              <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-[0.1em] text-sage">
                                  Order #{order.orderNumber}
                                </p>
                                <h4 className="mb-2 font-serif text-2xl text-ink">
                                  {item?.productName ?? "Order items"}
                                </h4>
                                {item && (
                                  <p className="text-base text-sage">
                                    Qty {item.quantity}
                                    {item.size ? ` · Size ${item.size}` : ""}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                <span
                                  className={cn(
                                    "mb-2 inline-block border px-3 py-1 text-xs font-medium uppercase tracking-wider",
                                    getStatusClass(order.status),
                                  )}
                                >
                                  {getStatusLabel(order.status)}
                                </span>
                                <p className="text-base text-sage">
                                  {formatOrderDate(order.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="mt-6">
                              <Link
                                href={`/checkout/success?order=${order.orderNumber}`}
                                className="border-b border-ink pb-1 text-xs font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:border-heritage-gold hover:text-heritage-gold"
                              >
                                View order
                              </Link>
                            </div>
                          </div>
                        </div>
                        {index < orders.length - 1 && (
                          <div className="mt-8 h-px bg-ink/5" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="relative overflow-hidden bg-[#F1EAD8] px-5 py-16 md:p-16">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
              <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <Image
                    src="https://lh3.googleusercontent.com/aida/AP1WRLuVa7n-bJNYMonhrm5zp_REuOxsJGFJiadO8aJ6Db0Fq45Cn9qBW0_yH6vzQPpH5MZO7rSg3bvr5vRpvWzulTl7A3E8EUZqy2dNxDwGJN6DUuYUCa44iI-bMc7BblO6aWmmfgJReeGLOIuyJ_1I8XPJo_XPuceW8fOQUb84SqA0SXKqgxSUj7ENm6yGwKDQdTpmn5GyBZogflOXu5tkr1mtkCLcqyjjTw5Ur4d861kUXRZx9jx1BgaXTW7a"
                    alt="Bespoke inspiration editorial"
                    width={640}
                    height={800}
                    className="aspect-[4/5] w-full object-cover shadow-sm"
                  />
                </div>
                <div className="w-full space-y-6 lg:w-1/2">
                  <h3 className="font-serif text-2xl text-ink">
                    Bespoke Inspiration
                  </h3>
                  <p className="text-lg text-sage">
                    Elevate your personal narrative with pieces crafted
                    exclusively for you. Our artisans are ready to translate
                    your heritage into silver.
                  </p>
                  <Link
                    href="/jewellery"
                    className="inline-block bg-onyx px-8 py-4 text-xs font-medium uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-heritage-gold"
                  >
                    Start a Commission
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
