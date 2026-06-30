"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/generated/prisma/client";
import { createShipmentForPaidOrder } from "@/features/checkout/services/delhivery-shipment-service";
import { requireAdminUser } from "@/features/auth/services/session";
import {
  getOrderDetailForAdmin,
  listOrdersForAdmin,
  updateOrderStatus,
} from "@/features/admin/services/order-admin-service";
import { prisma } from "@/lib/db";

export type CommerceActionResult = { success: boolean; error?: string };

const allowedStatuses: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

function revalidateCommercePaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/commerce");
}

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
    revalidateCommercePaths();

    return { success: true };
  } catch {
    return { success: false, error: "Could not update order status." };
  }
}

export async function getOrderDetailAction(orderId: string) {
  try {
    await requireAdminUser();
    const order = await getOrderDetailForAdmin(orderId);

    if (!order) {
      return { success: false as const, error: "Order not found." };
    }

    return { success: true as const, order };
  } catch {
    return { success: false as const, error: "Could not load order details." };
  }
}

export async function retryDelhiveryShipmentAction(
  orderId: string,
): Promise<CommerceActionResult> {
  try {
    await requireAdminUser();

    const result = await createShipmentForPaidOrder(orderId);

    if (!result) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { delhiveryShipmentError: true },
      });

      return {
        success: false,
        error:
          order?.delhiveryShipmentError ??
          "Shipment was not created. Check Delhivery configuration and shipping details.",
      };
    }

    if (!result.delhiveryWaybill) {
      return {
        success: false,
        error:
          result.delhiveryShipmentError ??
          "Shipment request failed. See order details for more information.",
      };
    }

    revalidateCommercePaths();
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create Delhivery shipment.";
    return { success: false, error: message };
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
