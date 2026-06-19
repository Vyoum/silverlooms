import { config } from "dotenv";
import { PrismaClient, ProductBadge } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { jewelleryProducts, kurtisProducts } from "../src/lib/constants/products";

config({ path: ".env.local" });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL is required to seed");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const allProducts = [...kurtisProducts, ...jewelleryProducts];

async function main() {
  for (const product of allProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        slug: product.slug,
        name: product.name,
        categoryLabel: product.category,
        collection: product.collection,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        rating: product.rating,
        reviewCount: product.reviewCount,
        imageUrl: product.image,
        badge: product.badge as ProductBadge | undefined,
        sizes: product.sizes ?? [],
        colors: {
          create: product.colors.map((color) => ({
            hex: color.hex,
            name: color.name,
          })),
        },
      },
      update: {
        name: product.name,
        categoryLabel: product.category,
        collection: product.collection,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        rating: product.rating,
        reviewCount: product.reviewCount,
        imageUrl: product.image,
        badge: product.badge as ProductBadge | undefined,
        sizes: product.sizes ?? [],
      },
    });

    const saved = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (saved) {
      await prisma.productColor.deleteMany({ where: { productId: saved.id } });
      await prisma.productColor.createMany({
        data: product.colors.map((color) => ({
          productId: saved.id,
          hex: color.hex,
          name: color.name,
        })),
      });

      const sizes = product.sizes?.length ? product.sizes : ["ONE_SIZE"];
      for (const size of sizes) {
        await prisma.inventory.upsert({
          where: {
            productId_size: {
              productId: saved.id,
              size,
            },
          },
          create: {
            productId: saved.id,
            sku:
              size === "ONE_SIZE"
                ? product.slug
                : `${product.slug}-${size.toLowerCase()}`,
            size,
            quantity: 50,
            lowStockThreshold: 5,
          },
          update: {
            sku:
              size === "ONE_SIZE"
                ? product.slug
                : `${product.slug}-${size.toLowerCase()}`,
          },
        });
      }
    }
  }

  console.log(`Seeded ${allProducts.length} products`);

  const dbProducts = await prisma.product.findMany({ take: 4 });
  if (dbProducts.length === 0) return;

  const sampleOrders = [
    {
      orderNumber: "ORD-9021",
      customerName: "Meera Reddy",
      customerEmail: "meera@example.com",
      status: "SHIPPED" as const,
      paymentStatus: "PAID" as const,
      subtotal: 4000,
      shippingCost: 0,
      discount: 0,
      total: 4200,
      items: [{ product: dbProducts[0], qty: 1, price: dbProducts[0].price }],
      daysAgo: 0,
    },
    {
      orderNumber: "ORD-9020",
      customerName: "Anjali Gupta",
      customerEmail: "anjali@example.com",
      status: "PROCESSING" as const,
      paymentStatus: "PAID" as const,
      subtotal: 12300,
      shippingCost: 0,
      discount: 0,
      total: 12500,
      items: [{ product: dbProducts[1], qty: 2, price: dbProducts[1].price }],
      daysAgo: 0,
    },
    {
      orderNumber: "ORD-9019",
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      status: "PENDING" as const,
      paymentStatus: "PAID" as const,
      subtotal: 3600,
      shippingCost: 199,
      discount: 0,
      total: 3800,
      items: [{ product: dbProducts[2], qty: 1, price: dbProducts[2].price }],
      daysAgo: 1,
    },
    {
      orderNumber: "ORD-9018",
      customerName: "Kavita Iyer",
      customerEmail: "kavita@example.com",
      status: "SHIPPED" as const,
      paymentStatus: "PAID" as const,
      subtotal: 5950,
      shippingCost: 0,
      discount: 0,
      total: 6150,
      items: [{ product: dbProducts[3], qty: 1, price: dbProducts[3].price }],
      daysAgo: 1,
    },
  ];

  for (const order of sampleOrders) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - order.daysAgo);

    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      create: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        discount: order.discount,
        total: order.total,
        createdAt,
        items: {
          create: order.items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productSlug: item.product.slug,
            quantity: item.qty,
            unitPrice: item.price,
          })),
        },
      },
      update: {
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
      },
    });
  }

  // Set one product low on stock for admin alerts demo
  const lowStock = await prisma.inventory.findFirst();
  if (lowStock) {
    await prisma.inventory.update({
      where: { id: lowStock.id },
      data: { quantity: 2 },
    });
  }

  console.log(`Seeded ${sampleOrders.length} sample orders`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
