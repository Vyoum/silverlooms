import { prisma } from "@/lib/db";

export async function getAccountOrders(userId: string, limit = 5) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      items: {
        take: 1,
        include: {
          product: {
            select: { imageUrl: true },
          },
        },
      },
    },
  });
}

export async function getAccountOrderCount(userId: string) {
  return prisma.order.count({ where: { userId } });
}
