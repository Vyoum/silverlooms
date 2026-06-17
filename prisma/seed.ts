import { PrismaClient, ProductBadge } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { jewelleryProducts, kurtisProducts } from "../src/lib/constants/products";

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
    }
  }

  console.log(`Seeded ${allProducts.length} products`);
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
