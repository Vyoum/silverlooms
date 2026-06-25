import type { Metadata } from "next";
import { ProfileDashboardPage } from "@/features/account/profile-dashboard-page";
import {
  getAccountOrderCount,
  getAccountOrders,
  getAccountWishlistCount,
} from "@/features/account/services/account-service";
import { requireAccountProfile, getSessionUser } from "@/features/auth/services/session";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: `My Account | ${BRAND_NAME}`,
  description: "Manage your orders and personal collection.",
};

export default async function AccountPage() {
  const profile = await requireAccountProfile();
  const sessionUser = await getSessionUser();
  const memberSince = sessionUser?.createdAt
    ? new Date(sessionUser.createdAt).getFullYear()
    : new Date().getFullYear();

  const [orders, totalOrders, wishlistCount] = profile.dbUserId
    ? await Promise.all([
        getAccountOrders(profile.dbUserId),
        getAccountOrderCount(profile.dbUserId),
        getAccountWishlistCount(profile.dbUserId),
      ])
    : [[], 0, 0];

  return (
    <ProfileDashboardPage
      profile={profile}
      orders={orders}
      totalOrders={totalOrders}
      wishlistCount={wishlistCount}
      memberSince={memberSince}
    />
  );
}
