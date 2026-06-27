import { getSessionUser } from "@/features/auth/services/session";
import { CheckoutPage } from "@/features/checkout/checkout-page";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata = {
  title: "Checkout",
  ...noIndexMetadata,
};

export default async function Page() {
  const user = await getSessionUser();

  return (
    <CheckoutPage
      defaultEmail={user?.email}
      defaultName={user?.name ?? undefined}
    />
  );
}
