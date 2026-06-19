import { prisma } from "@/lib/db";
import { getRazorpayClient } from "@/lib/razorpay/server";
import { getCart } from "@/features/cart/services/cart-service";
import type { ShippingDetails, CheckoutSession } from "../types";

function generateOrderNumber() {
  const suffix = Date.now().toString(36).toUpperCase();
  return `SL-${suffix}`;
}

export async function createCheckoutSession(
  shipping: ShippingDetails,
  userId?: string,
): Promise<CheckoutSession> {
  const cart = await getCart();

  if (cart.items.length === 0) {
    throw new Error("Your bag is empty.");
  }

  const orderNumber = generateOrderNumber();
  const amountPaise = cart.summary.total * 100;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      customerName: shipping.customerName,
      customerEmail: shipping.customerEmail,
      customerPhone: shipping.customerPhone,
      status: "PENDING",
      paymentStatus: "PENDING",
      subtotal: cart.summary.subtotal,
      shippingCost: cart.summary.shipping,
      discount: cart.summary.discount,
      total: cart.summary.total,
      promoCode: cart.promoCode,
      shippingLine1: shipping.shippingLine1,
      shippingLine2: shipping.shippingLine2,
      shippingCity: shipping.shippingCity,
      shippingState: shipping.shippingState,
      shippingPincode: shipping.shippingPincode,
      items: {
        create: cart.items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productSlug: item.product.slug,
          quantity: item.quantity,
          unitPrice: item.product.price,
          size: item.size,
          colorHex: item.colorHex,
        })),
      },
    },
  });

  const razorpay = getRazorpayClient();
  const razorpayOrder = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: order.orderNumber,
    notes: {
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { razorpayOrderId: razorpayOrder.id },
  });

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error("Razorpay key ID is not configured.");
  }

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    razorpayOrderId: razorpayOrder.id,
    amount: cart.summary.total,
    currency: "INR",
    keyId,
    prefill: {
      name: shipping.customerName,
      email: shipping.customerEmail,
      contact: shipping.customerPhone,
    },
  };
}

export async function completeOrderPayment(input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus === "PAID") {
    return order;
  }

  if (order.razorpayOrderId !== input.razorpayOrderId) {
    throw new Error("Payment order mismatch.");
  }

  return prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "PAID",
      status: "PROCESSING",
      razorpayPaymentId: input.razorpayPaymentId,
    },
  });
}
