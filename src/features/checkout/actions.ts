"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/features/auth/services/session";
import { clearCart } from "@/features/cart/services/cart-service";
import {
  completeOrderPayment,
  createCheckoutSession,
} from "@/features/checkout/services/order-service";
import type { ShippingDetails } from "@/features/checkout/types";
import { verifyRazorpaySignature } from "@/lib/razorpay/verify";
import { isRazorpayConfigured } from "@/lib/razorpay/server";

export interface CheckoutActionResult {
  success: boolean;
  error?: string;
  session?: Awaited<ReturnType<typeof createCheckoutSession>>;
}

export async function createCheckoutAction(
  shipping: ShippingDetails,
): Promise<CheckoutActionResult> {
  try {
    if (!isRazorpayConfigured()) {
      return { success: false, error: "Payments are not configured yet." };
    }

    const user = await getSessionUser();
    const session = await createCheckoutSession(shipping, user?.id);

    return { success: true, session };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start checkout.";
    return { success: false, error: message };
  }
}

export async function verifyPaymentAction(input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{
  success: boolean;
  orderNumber?: string;
  trackingNumber?: string;
  error?: string;
}> {
  try {
    const valid = verifyRazorpaySignature(
      input.razorpayOrderId,
      input.razorpayPaymentId,
      input.razorpaySignature,
    );

    if (!valid) {
      return { success: false, error: "Payment verification failed." };
    }

    const order = await completeOrderPayment(input);
    await clearCart();

    revalidatePath("/cart");
    revalidatePath("/admin");

    return {
      success: true,
      orderNumber: order.orderNumber,
      trackingNumber: order.delhiveryWaybill ?? undefined,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not verify payment.";
    return { success: false, error: message };
  }
}
