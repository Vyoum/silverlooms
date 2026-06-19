import { AdminStorePage } from "@/features/admin/admin-store-page";

export const metadata = {
  title: "Store | Admin | Silver Looms",
};

export default function Page() {
  return <AdminStorePage defaultProductType="apparel" />;
}
