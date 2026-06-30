import type { OrderStatus, PaymentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatOrderDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  delhiveryWaybill: string | null;
  hasShipmentError: boolean;
  shipmentError: string | null;
}

export interface AdminOrderItemRow {
  id: string;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: string;
  size: string | null;
  colorHex: string | null;
}

export interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: string;
  shippingCost: string;
  discount: string;
  total: string;
  promoCode: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  delhiveryWaybill: string | null;
  delhiveryShipmentError: string | null;
  shippingLine1: string | null;
  shippingLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPincode: string | null;
  items: AdminOrderItemRow[];
}

export interface CommerceStats {
  totalOrders: number;
  pendingFulfillment: number;
  paidAwaitingShipment: number;
  shipmentIssues: number;
  revenueThisMonth: string;
  paidOrders: number;
}

function mapOrderRow(order: {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: Date;
  delhiveryWaybill: string | null;
  delhiveryShipmentError: string | null;
  _count: { items: number };
}): AdminOrderRow {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: formatCurrency(order.total),
    totalAmount: order.total,
    itemCount: order._count.items,
    createdAt: formatOrderDate(order.createdAt),
    delhiveryWaybill: order.delhiveryWaybill,
    hasShipmentError: Boolean(order.delhiveryShipmentError),
    shipmentError: order.delhiveryShipmentError,
  };
}

export async function getCommerceStats(): Promise<CommerceStats> {
  const monthStart = startOfMonth(new Date());

  const [totalOrders, pendingFulfillment, paidAwaitingShipment, shipmentIssues, revenueAgg, paidOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { status: { in: ["PENDING", "PROCESSING"] }, paymentStatus: "PAID" },
      }),
      prisma.order.count({
        where: {
          paymentStatus: "PAID",
          delhiveryWaybill: null,
          status: { not: "CANCELLED" },
        },
      }),
      prisma.order.count({
        where: { delhiveryShipmentError: { not: null } },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: monthStart },
          paymentStatus: "PAID",
          status: { not: "CANCELLED" },
        },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { paymentStatus: "PAID" } }),
    ]);

  return {
    totalOrders,
    pendingFulfillment,
    paidAwaitingShipment,
    shipmentIssues,
    revenueThisMonth: formatCurrency(revenueAgg._sum.total ?? 0),
    paidOrders,
  };
}

export async function listOrdersForAdmin(): Promise<AdminOrderRow[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { items: true } },
    },
    take: 200,
  });

  return orders.map(mapOrderRow);
}

export async function getOrderDetailForAdmin(
  orderId: string,
): Promise<AdminOrderDetail | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });

  if (!order) return null;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: formatOrderDate(order.createdAt),
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: formatCurrency(order.subtotal),
    shippingCost: formatCurrency(order.shippingCost),
    discount: formatCurrency(order.discount),
    total: formatCurrency(order.total),
    promoCode: order.promoCode,
    razorpayOrderId: order.razorpayOrderId,
    razorpayPaymentId: order.razorpayPaymentId,
    delhiveryWaybill: order.delhiveryWaybill,
    delhiveryShipmentError: order.delhiveryShipmentError,
    shippingLine1: order.shippingLine1,
    shippingLine2: order.shippingLine2,
    shippingCity: order.shippingCity,
    shippingState: order.shippingState,
    shippingPincode: order.shippingPincode,
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      productSlug: item.productSlug,
      quantity: item.quantity,
      unitPrice: formatCurrency(item.unitPrice),
      size: item.size,
      colorHex: item.colorHex,
    })),
  };
}

export async function getOrderIdByNumber(orderNumber: string): Promise<string | null> {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true },
  });
  return order?.id ?? null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export interface AdminReviewRow {
  id: string;
  productName: string;
  userEmail: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
}

export async function listReviewsForAdmin(): Promise<AdminReviewRow[]> {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
    take: 50,
  });

  return reviews.map((review) => ({
    id: review.id,
    productName: review.product.name,
    userEmail: review.user.email,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    createdAt: review.createdAt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));
}
