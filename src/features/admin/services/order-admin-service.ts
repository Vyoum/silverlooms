import type { OrderStatus } from "@/generated/prisma/client";
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

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: string;
  total: string;
  itemCount: number;
  createdAt: string;
}

export async function listOrdersForAdmin(): Promise<AdminOrderRow[]> {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { items: true } },
    },
    take: 100,
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: formatCurrency(order.total),
    itemCount: order._count.items,
    createdAt: formatOrderDate(order.createdAt),
  }));
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
