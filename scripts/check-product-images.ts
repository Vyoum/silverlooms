import { config } from "dotenv";
import { prisma } from "../src/lib/db";

config({ path: ".env.local" });

async function main() {
  const products = await prisma.product.findMany({
    select: { slug: true, name: true, imageUrl: true, categoryLabel: true },
    orderBy: { createdAt: "desc" },
  });

  const figma = products.filter((p) => p.imageUrl.includes("figma.com"));
  const local = products.filter((p) => p.imageUrl.startsWith("/"));
  const supabase = products.filter((p) => p.imageUrl.includes("supabase.co"));

  console.log(`Total: ${products.length}`);
  console.log(`Figma URLs: ${figma.length}`);
  console.log(`Local URLs: ${local.length}`);
  console.log(`Supabase URLs: ${supabase.length}`);
  console.log("\nSample URLs:");
  for (const product of products.slice(0, 8)) {
    console.log(`- ${product.slug}: ${product.imageUrl}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
