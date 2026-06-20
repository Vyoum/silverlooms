import { prisma } from "@/lib/db";

export async function getProductInventory(productId: string) {
  return prisma.inventory.findMany({
    where: { productId },
    orderBy: { size: "asc" },
    select: {
      id: true,
      size: true,
      sku: true,
      quantity: true,
      lowStockThreshold: true,
    },
  });
}

export async function updateProductInventoryQuantities(
  productId: string,
  updates: { inventoryId: string; quantity: number }[],
) {
  await prisma.$transaction(
    updates.map((update) =>
      prisma.inventory.updateMany({
        where: { id: update.inventoryId, productId },
        data: { quantity: Math.max(0, Math.round(update.quantity)) },
      }),
    ),
  );
}

export async function decrementInventoryForOrder(orderId: string) {
  const items = await prisma.orderItem.findMany({
    where: { orderId },
    select: {
      productId: true,
      quantity: true,
      size: true,
    },
  });

  for (const item of items) {
    const size = item.size?.trim() || "ONE_SIZE";

    await prisma.inventory.updateMany({
      where: { productId: item.productId, size },
      data: { quantity: { decrement: item.quantity } },
    });
  }
}
