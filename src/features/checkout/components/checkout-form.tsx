"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/features/cart/cart-provider";
import {
  createCheckoutAction,
  verifyPaymentAction,
} from "@/features/checkout/actions";
import type { CheckoutSession, ShippingDetails } from "@/features/checkout/types";
import { BRAND_NAME } from "@/lib/constants/brand";

function isRazorpayConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
    };
  }
}

interface CheckoutFormProps {
  defaultEmail?: string;
  defaultName?: string;
}

export function CheckoutForm({ defaultEmail = "", defaultName = "" }: CheckoutFormProps) {
  const router = useRouter();
  const { cart } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const paymentsConfigured = isRazorpayConfigured();

  async function openRazorpay(session: CheckoutSession) {
    if (!window.Razorpay) {
      setError("Payment gateway failed to load. Please refresh and try again.");
      return;
    }

    const options = {
      key: session.keyId,
      amount: session.amount * 100,
      currency: session.currency,
      name: BRAND_NAME,
      description: `Order ${session.orderNumber}`,
      order_id: session.razorpayOrderId,
      prefill: session.prefill,
      theme: { color: "#36512e" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const result = await verifyPaymentAction({
          orderId: session.orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });

        if (result.success && result.orderNumber) {
          router.push(`/checkout/success?order=${encodeURIComponent(result.orderNumber)}`);
          return;
        }

        setError(result.error ?? "Payment verification failed.");
        setPending(false);
      },
      modal: {
        ondismiss: () => setPending(false),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      setError(response.error.description);
      setPending(false);
    });
    rzp.open();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const shipping: ShippingDetails = {
      customerName: String(formData.get("customerName") ?? "").trim(),
      customerEmail: String(formData.get("customerEmail") ?? "").trim(),
      customerPhone: String(formData.get("customerPhone") ?? "").trim(),
      shippingLine1: String(formData.get("shippingLine1") ?? "").trim(),
      shippingLine2: String(formData.get("shippingLine2") ?? "").trim() || undefined,
      shippingCity: String(formData.get("shippingCity") ?? "").trim(),
      shippingState: String(formData.get("shippingState") ?? "").trim(),
      shippingPincode: String(formData.get("shippingPincode") ?? "").trim(),
    };

    const result = await createCheckoutAction(shipping);

    if (!result.success || !result.session) {
      setError(result.error ?? "Could not start checkout.");
      setPending(false);
      return;
    }

    await openRazorpay(result.session);
  }

  if (cart.items.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-cream-warm p-6 text-sm text-sage">
        Your bag is empty. Add items before checkout.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-lg border border-border bg-cream-warm p-6">
          <h2 className="mb-6 font-serif text-2xl text-ink">Shipping Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-sage">
                Full Name
              </label>
              <Input
                name="customerName"
                required
                defaultValue={defaultName}
                className="rounded-lg border-border bg-cream"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-sage">
                Email
              </label>
              <Input
                name="customerEmail"
                type="email"
                required
                defaultValue={defaultEmail}
                className="rounded-lg border-border bg-cream"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-sage">
                Phone
              </label>
              <Input
                name="customerPhone"
                type="tel"
                required
                pattern="[0-9+\s-]{10,15}"
                placeholder="10-digit mobile"
                className="rounded-lg border-border bg-cream"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-sage">
                Address Line 1
              </label>
              <Input
                name="shippingLine1"
                required
                className="rounded-lg border-border bg-cream"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-sage">
                Address Line 2 (optional)
              </label>
              <Input name="shippingLine2" className="rounded-lg border-border bg-cream" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-sage">
                City
              </label>
              <Input name="shippingCity" required className="rounded-lg border-border bg-cream" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-sage">
                State
              </label>
              <Input name="shippingState" required className="rounded-lg border-border bg-cream" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-sage">
                Pincode
              </label>
              <Input
                name="shippingPincode"
                required
                pattern="[0-9]{6}"
                className="rounded-lg border-border bg-cream"
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {!paymentsConfigured && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Razorpay keys are missing. Add{" "}
            <code>NEXT_PUBLIC_RAZORPAY_KEY_ID</code> and{" "}
            <code>RAZORPAY_KEY_SECRET</code> to your environment.
          </p>
        )}

        <Button
          type="submit"
          disabled={pending || !scriptReady || !paymentsConfigured}
          className="h-12 w-full rounded-full bg-forest text-[13px] uppercase tracking-[1.3px] hover:bg-forest/90"
        >
          {pending
            ? "Processing..."
            : `Pay ₹${cart.summary.total.toLocaleString("en-IN")} with Razorpay`}
        </Button>
      </form>
    </>
  );
}
