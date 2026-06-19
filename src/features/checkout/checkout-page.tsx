"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { useCart } from "@/features/cart/cart-provider";
import { CheckoutForm } from "./components/checkout-form";
import { Separator } from "@/components/ui/separator";

interface CheckoutPageProps {
  defaultEmail?: string;
  defaultName?: string;
}

export function CheckoutPage({ defaultEmail, defaultName }: CheckoutPageProps) {
  const { cart } = useCart();
  const { summary, itemCount } = cart;

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <Container className="py-12">
          <div className="mb-10">
            <h1 className="font-serif text-[42px] font-light text-ink">Checkout</h1>
            <p className="mt-1 text-sm text-sage">
              Secure payment powered by Razorpay
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <CheckoutForm defaultEmail={defaultEmail} defaultName={defaultName} />

            <aside className="h-fit rounded-lg border border-border bg-cream-warm p-8">
              <h2 className="mb-6 font-serif text-2xl text-ink">Order Summary</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-sage">Subtotal ({itemCount} items)</dt>
                  <dd>₹{summary.subtotal.toLocaleString("en-IN")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sage">Shipping</dt>
                  <dd>
                    {summary.shipping === 0
                      ? "Free"
                      : `₹${summary.shipping.toLocaleString("en-IN")}`}
                  </dd>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-forest">
                    <dt>Discount</dt>
                    <dd>-₹{summary.discount.toLocaleString("en-IN")}</dd>
                  </div>
                )}
              </dl>
              <Separator className="my-6" />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>₹{summary.total.toLocaleString("en-IN")}</span>
              </div>
              <Link
                href="/cart"
                className="mt-6 block text-center text-[11px] uppercase tracking-wider text-sage underline"
              >
                Back to bag
              </Link>
            </aside>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
