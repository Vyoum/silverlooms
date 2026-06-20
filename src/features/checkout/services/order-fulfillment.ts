import { prisma } from "@/lib/db";
import { decrementInventoryForOrder } from "@/features/admin/services/inventory-service";

export async function markOrderPaid(input: {
  orderId?: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}) {
  const order = input.orderId
    ? await prisma.order.findUnique({ where: { id: input.orderId } })
    : await prisma.order.findFirst({
        where: { razorpayOrderId: input.razorpayOrderId },
      });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus === "PAID") {
    return order;
  }

  if (order.razorpayOrderId && order.razorpayOrderId !== input.razorpayOrderId) {
    throw new Error("Payment order mismatch.");
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "PAID",
      status: "PROCESSING",
      razorpayPaymentId: input.razorpayPaymentId,
      razorpayOrderId: input.razorpayOrderId,
    },
  });

  await decrementInventoryForOrder(order.id);

  return updated;
}

export async function markOrderPaymentFailed(razorpayOrderId: string) {
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId },
  });

  if (!order || order.paymentStatus === "PAID") {
    return null;
  }

  return prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "FAILED" },
  });
}
