import { AdminStorePage } from "@/features/admin/admin-store-page";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata = {
  title: `Jewellery | ${BRAND_NAME}`,
};

export default function Page() {
  return (
    <AdminStorePage
      defaultProductType="jewellery"
      title="Jewellery Store"
      description="Add German silver jewellery — they appear instantly on /jewellery."
      storefrontHref="/jewellery"
      storefrontLabel="View /jewellery"
    />
  );
}
