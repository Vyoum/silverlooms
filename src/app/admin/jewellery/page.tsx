import { AdminStorePage } from "@/features/admin/admin-store-page";

export const metadata = {
  title: "Jewellery | Admin | Silver Looms",
};

export default function Page() {
  return (
    <AdminStorePage
      defaultProductType="jewellery"
      title="Jewellery Store"
      description="Add silver jewellery — they appear instantly on /jewellery."
      storefrontHref="/jewellery"
      storefrontLabel="View /jewellery"
    />
  );
}
