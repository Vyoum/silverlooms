import { AdminUsersPage } from "@/features/admin/admin-users-page";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata = {
  title: `Users | ${BRAND_NAME}`,
};

export default function Page() {
  return <AdminUsersPage />;
}
