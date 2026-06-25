import { config } from "dotenv";
import { PrismaClient, ProductBadge } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { jewelleryProducts, kurtisProducts } from "../src/lib/constants/products";
import { DEFAULT_STORE_CATEGORIES } from "../src/features/catalog/lib/store-categories";

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
  for (const category of DEFAULT_STORE_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {},
    });
  }
  console.log(`Seeded ${DEFAULT_STORE_CATEGORIES.length} categories`);

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

  // Remove legacy demo orders from older seeds — admin only shows real checkout orders
  const removed = await prisma.order.deleteMany({
    where: { customerEmail: { endsWith: "@example.com" } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} demo orders`);
  }
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
