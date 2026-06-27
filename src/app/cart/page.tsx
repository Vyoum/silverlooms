import { CartPage } from "@/features/cart/cart-page";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata = {
  title: "Your Bag",
  description: "Review your shopping bag and proceed to checkout.",
  ...noIndexMetadata,
};

export default function Page() {
  return <CartPage />;
}
