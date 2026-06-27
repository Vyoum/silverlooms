import type { Metadata } from "next";
import { ProfileDashboardPage } from "@/features/account/profile-dashboard-page";
import {
  getAccountOrderCount,
  getAccountOrders,
  getAccountWishlistCount,
} from "@/features/account/services/account-service";
import { requireAccountProfile, getSessionUser } from "@/features/auth/services/session";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your orders and personal collection.",
  ...noIndexMetadata,
};

export default async function AccountPage() {
  const profile = await requireAccountProfile();
  const sessionUser = await getSessionUser();
  const memberSince = sessionUser?.createdAt
    ? new Date(sessionUser.createdAt).getFullYear()
    : new Date().getFullYear();

  let orders: Awaited<ReturnType<typeof getAccountOrders>> = [];
  let totalOrders = 0;
  let wishlistCount = 0;

  if (profile.dbUserId) {
    try {
      [orders, totalOrders, wishlistCount] = await Promise.all([
        getAccountOrders(profile.dbUserId),
        getAccountOrderCount(profile.dbUserId),
        getAccountWishlistCount(profile.dbUserId),
      ]);
    } catch (error) {
      console.error("[account] Failed to load account stats:", error);
    }
  }

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
