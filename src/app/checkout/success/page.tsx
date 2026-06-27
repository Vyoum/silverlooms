import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { getPaidOrderConfirmation } from "@/features/checkout/services/order-service";
import { getDelhiveryTrackingUrl } from "@/lib/delhivery/tracking";
import { noIndexMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Order Confirmed",
  ...noIndexMetadata,
};

interface PageProps {
  searchParams: Promise<{ order?: string; tracking?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderNumber = params.order?.trim();
  const order = orderNumber ? await getPaidOrderConfirmation(orderNumber) : null;
  const trackingNumber =
    order?.delhiveryWaybill?.trim() || params.tracking?.trim() || null;

  return (
    <PageShell>
      <SiteHeader />
      <main>
        <Container className="py-24 text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[1.65px] text-forest">
            Payment Successful
          </p>
          <h1 className="font-serif text-4xl text-ink md:text-5xl">
            Thank you for your order
          </h1>
          {orderNumber && (
            <p className="mt-4 text-sage">
              Order <span className="font-medium text-ink">{orderNumber}</span> is
              confirmed.
              {!trackingNumber && " We'll email you shipping updates soon."}
            </p>
          )}

          {trackingNumber ? (
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border bg-cream-warm px-6 py-5 text-left">
              <p className="text-[11px] font-medium uppercase tracking-[1.65px] text-forest">
                Delhivery Tracking Number
              </p>
              <p className="mt-2 font-mono text-lg tracking-wide text-ink">
                {trackingNumber}
              </p>
              <p className="mt-2 text-sm text-sage">
                Your shipment has been booked. Use this number to track delivery.
              </p>
              <a
                href={getDelhiveryTrackingUrl(trackingNumber)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forest hover:underline"
              >
                Track on Delhivery
                <ExternalLink className="size-4" />
              </a>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/kurtis"
              className={cn(
                buttonVariants(),
                "h-12 rounded-full bg-forest px-8 text-[13px] uppercase tracking-[1.3px] hover:bg-forest/90",
              )}
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 rounded-full px-8 text-[13px] uppercase tracking-[1.3px]",
              )}
            >
              Back to Home
            </Link>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
