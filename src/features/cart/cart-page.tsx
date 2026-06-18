"use client";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { useCart } from "@/features/cart/cart-provider";
import { CartItemsList } from "./components/cart-items-list";
import { CartRecommendations } from "./components/cart-recommendations";
import { OrderSummary, PromoCodeSection } from "./components/order-summary";

const checkoutSteps = ["Bag", "Shipping", "Payment"];

export function CartPage() {
  const { cart } = useCart();

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <Container className="py-12">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-[42px] font-light text-ink">
                Your Bag
              </h1>
              <p className="mt-1 text-sm text-sage">
                {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
              </p>
            </div>
            <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-sage">
              {checkoutSteps.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  {i > 0 && <span className="text-border">›</span>}
                  <span className={i === 0 ? "font-medium text-ink" : ""}>
                    {step}
                  </span>
                </span>
              ))}
            </nav>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <CartItemsList />
              {cart.items.length > 0 && <PromoCodeSection />}
            </div>
            <OrderSummary />
          </div>
        </Container>
        <CartRecommendations />
      </main>
      <SiteFooter />
    </PageShell>
  );
}
