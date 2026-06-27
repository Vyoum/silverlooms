import { ShippingReturnsPage } from "@/features/legal/shipping-returns-page";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Shipping & Returns",
  description:
    "Shipping timelines, delivery coverage, and return policy for Silver Looms orders across India.",
  path: "/shipping-returns",
});

export default function Page() {
  return <ShippingReturnsPage />;
}
