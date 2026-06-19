"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/features/cart/cart-provider";
import { cn } from "@/lib/utils";

export function OrderSummary() {
  const { cart } = useCart();
  const { summary, itemCount, promoCode } = cart;

  return (
    <aside className="rounded-lg border border-border bg-cream-warm p-8">
      <h2 className="mb-6 font-serif text-2xl text-ink">Order Summary</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-sage">Subtotal ({itemCount} items)</dt>
          <dd className="text-ink">
            ₹{summary.subtotal.toLocaleString("en-IN")}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sage">Shipping</dt>
          <dd className="text-ink">
            {summary.shipping === 0
              ? "Free"
              : `₹${summary.shipping.toLocaleString("en-IN")}`}
          </dd>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-forest">
            <dt>Discount {promoCode ? `(${promoCode})` : ""}</dt>
            <dd>-₹{summary.discount.toLocaleString("en-IN")}</dd>
          </div>
        )}
      </dl>
      <Separator className="my-6" />
      <div className="mb-6 flex justify-between text-lg font-medium">
        <span>Total</span>
        <span>₹{summary.total.toLocaleString("en-IN")}</span>
      </div>
      {itemCount === 0 ? (
        <Button
          disabled
          className="h-12 w-full rounded-full bg-forest text-[13px] uppercase tracking-[1.3px] hover:bg-forest/90"
        >
          Proceed to Checkout
        </Button>
      ) : (
        <Link
          href="/checkout"
          className={cn(
            buttonVariants(),
            "flex h-12 w-full items-center justify-center rounded-full bg-forest text-[13px] uppercase tracking-[1.3px] hover:bg-forest/90",
          )}
        >
          Proceed to Checkout
        </Link>
      )}
      <p className="mt-4 text-center text-[11px] text-sage">
        Free shipping on orders above ₹5,000
      </p>
    </aside>
  );
}

export function PromoCodeSection() {
  const { cart, applyPromo, clearPromo, isPending } = useCart();
  const [code, setCode] = useState(cart.promoCode ?? "");

  async function handleApply() {
    if (!code.trim()) return;
    const success = await applyPromo(code);
    if (!success) return;
  }

  return (
    <div className="mt-8 rounded-lg border border-border p-6">
      <h3 className="mb-4 text-sm font-medium text-ink">Promo Code</h3>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Try SILVER10 or WELCOME500"
          className="rounded-full border-border bg-cream"
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0 rounded-full uppercase tracking-wider"
          disabled={isPending || !code.trim()}
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
      {cart.promoCode && (
        <button
          type="button"
          className="mt-3 text-[11px] uppercase tracking-wider text-sage underline"
          onClick={() => {
            clearPromo();
            setCode("");
          }}
        >
          Remove promo code
        </button>
      )}
    </div>
  );
}
