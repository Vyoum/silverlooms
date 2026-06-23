"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/generated/prisma/client";
import { requireAdminUser } from "@/features/auth/services/session";
import {
  listOrdersForAdmin,
  updateOrderStatus,
} from "@/features/admin/services/order-admin-service";

export type CommerceActionResult = { success: boolean; error?: string };

const allowedStatuses: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
): Promise<CommerceActionResult> {
  try {
    await requireAdminUser();

    if (!allowedStatuses.includes(status)) {
      return { success: false, error: "Invalid order status." };
    }

    await updateOrderStatus(orderId, status);

    revalidatePath("/admin");
    revalidatePath("/admin/commerce");

    return { success: true };
  } catch {
    return { success: false, error: "Could not update order status." };
  }
}

export async function listOrdersForAdminAction() {
  try {
    await requireAdminUser();
    const orders = await listOrdersForAdmin();
    return { success: true as const, orders };
  } catch {
    return { success: false as const, error: "Could not load orders." };
  }
}
