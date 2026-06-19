import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container, PageShell } from "@/components/layout/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `Order Confirmed | ${BRAND_NAME}`,
};

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderNumber = params.order;

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
              confirmed. We&apos;ll email you shipping updates soon.
            </p>
          )}
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
