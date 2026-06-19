import { getSessionUser } from "@/features/auth/services/session";
import { CheckoutPage } from "@/features/checkout/checkout-page";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata = {
  title: `Checkout | ${BRAND_NAME}`,
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
