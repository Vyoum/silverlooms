import { createDelhiveryShipment } from "@/lib/delhivery/client";
import { isDelhiveryConfigured } from "@/lib/delhivery/env";
import { prisma } from "@/lib/db";

function buildShippingAddress(order: {
  shippingLine1: string | null;
  shippingLine2: string | null;
}) {
  return [order.shippingLine1, order.shippingLine2].filter(Boolean).join(", ");
}

function estimateWeightKg(itemCount: number) {
  return Math.max(0.5, Number((itemCount * 0.35).toFixed(2)));
}

export async function createShipmentForPaidOrder(orderId: string) {
  if (!isDelhiveryConfigured()) {
    console.warn("[delhivery] Skipping shipment creation — configuration incomplete.");
    return null;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.delhiveryWaybill) {
    return order;
  }

  if (order.paymentStatus !== "PAID") {
    return order;
  }

  const shippingAddress = buildShippingAddress(order);
  const missingFields = [
    !order.customerPhone && "customer phone",
    !shippingAddress && "shipping address",
    !order.shippingCity && "shipping city",
    !order.shippingState && "shipping state",
    !order.shippingPincode && "shipping pincode",
  ].filter(Boolean);

  if (missingFields.length > 0) {
    const error = `Missing ${missingFields.join(", ")} for Delhivery shipment.`;
    await prisma.order.update({
      where: { id: order.id },
      data: { delhiveryShipmentError: error },
    });
    console.error("[delhivery]", error, { orderId: order.id });
    return null;
  }

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const productsDescription =
    order.items
      .map((item) => {
        const variant = [item.size, item.colorHex].filter(Boolean).join(" / ");
        return variant
          ? `${item.productName} (${variant}) x${item.quantity}`
          : `${item.productName} x${item.quantity}`;
      })
      .join(", ") || "Silver Looms order";

  const result = await createDelhiveryShipment({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone!,
    shippingAddress,
    shippingCity: order.shippingCity!,
    shippingState: order.shippingState!,
    shippingPincode: order.shippingPincode!,
    totalAmount: order.total,
    quantity: totalQuantity,
    productsDescription,
    weightKg: estimateWeightKg(totalQuantity),
  });

  if (!result.success || !result.waybill) {
    const error = result.error ?? "Could not create Delhivery shipment.";
    await prisma.order.update({
      where: { id: order.id },
      data: { delhiveryShipmentError: error },
    });
    console.error("[delhivery] Shipment creation failed:", error, {
      orderId: order.id,
      raw: result.raw,
    });
    return null;
  }

  return prisma.order.update({
    where: { id: order.id },
    data: {
      delhiveryWaybill: result.waybill,
      delhiveryShipmentError: null,
    },
  });
}
