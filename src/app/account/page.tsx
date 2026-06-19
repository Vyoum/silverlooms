import type { Metadata } from "next";
import { ProfileDashboardPage } from "@/features/account/profile-dashboard-page";
import {
  getAccountOrderCount,
  getAccountOrders,
} from "@/features/account/services/account-service";
import { requireAccountProfile } from "@/features/auth/services/session";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: `My Account | ${BRAND_NAME}`,
  description: "Manage your orders and personal collection.",
};

export default async function AccountPage() {
  const profile = await requireAccountProfile();

  const [orders, totalOrders] = profile.dbUserId
    ? await Promise.all([
        getAccountOrders(profile.dbUserId),
        getAccountOrderCount(profile.dbUserId),
      ])
    : [[], 0];

  return (
    <ProfileDashboardPage
      profile={profile}
      orders={orders}
      totalOrders={totalOrders}
    />
  );
}
