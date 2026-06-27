import Link from "next/link";
import {
  ContentPageShell,
  ContentSection,
} from "@/features/legal/components/content-page-shell";
import { BRAND_NAME, INSTAGRAM_URL } from "@/lib/constants/brand";

export function ShippingReturnsPage() {
  return (
    <ContentPageShell
      title="Shipping & Returns"
      description="Delivery timelines, shipping coverage, and how to request a return or exchange."
    >
      <ContentSection title="Shipping">
        <p>
          {BRAND_NAME} offers complimentary shipping on orders across India. Once your
          payment is confirmed, your order is prepared in our Jaipur studio and handed
          to our delivery partner.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Standard delivery typically takes 5–10 business days depending on your pincode.</li>
          <li>
            You will receive tracking details by email when your shipment is booked with
            Delhivery.
          </li>
          <li>
            Track your order anytime from your{" "}
            <Link href="/account" className="text-ink underline-offset-2 hover:underline">
              account dashboard
            </Link>
            .
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Order issues">
        <p>
          If your order arrives damaged, incomplete, or incorrect, contact us within 48
          hours of delivery with your order number and photos. We will review the issue
          and arrange a replacement, exchange, or refund where applicable.
        </p>
      </ContentSection>

      <ContentSection title="Returns & exchanges" id="returns">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Apparel and jewellery must be unused, unworn, and in original packaging with
            tags intact to qualify for a return or exchange.
          </li>
          <li>
            Custom or made-to-order pieces may not be eligible for return unless there
            is a manufacturing defect.
          </li>
          <li>
            Refunds, once approved, are processed to your original payment method within
            7–10 business days.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Need help?">
        <p>
          Message us on{" "}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline-offset-2 hover:underline"
          >
            Instagram
          </a>{" "}
          with your order number, or visit our{" "}
          <Link href="/privacy" className="text-ink underline-offset-2 hover:underline">
            Privacy Policy
          </Link>{" "}
          for more information.
        </p>
      </ContentSection>
    </ContentPageShell>
  );
}
