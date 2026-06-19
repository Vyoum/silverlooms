import { AdminStorePage } from "@/features/admin/admin-store-page";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata = {
  title: `Store | ${BRAND_NAME}`,
};

export default function Page() {
  return <AdminStorePage defaultProductType="apparel" />;
}
