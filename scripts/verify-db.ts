import { config } from "dotenv";

config({ path: ".env.local" });

type TableCheck = {
  name: string;
  count: number;
  status: "ok" | "empty" | "error";
  note?: string;
};

const expectedTables = [
  "categories",
  "products",
  "product_colors",
  "carts",
  "cart_items",
  "users",
  "inventory",
  "wishlists",
  "orders",
  "order_items",
  "reviews",
  "site_content",
] as const;

async function countTable(
  prisma: typeof import("../src/lib/db").prisma,
  table: (typeof expectedTables)[number],
): Promise<TableCheck> {
  try {
    let count = 0;

    switch (table) {
      case "categories":
        count = await prisma.category.count();
        break;
      case "products":
        count = await prisma.product.count();
        break;
      case "product_colors":
        count = await prisma.productColor.count();
        break;
      case "carts":
        count = await prisma.cart.count();
        break;
      case "cart_items":
        count = await prisma.cartItem.count();
        break;
      case "users":
        count = await prisma.user.count();
        break;
      case "inventory":
        count = await prisma.inventory.count();
        break;
      case "wishlists":
        count = await prisma.wishlist.count();
        break;
      case "orders":
        count = await prisma.order.count();
        break;
      case "order_items":
        count = await prisma.orderItem.count();
        break;
      case "reviews":
        count = await prisma.review.count();
        break;
      case "site_content":
        count = await prisma.siteContent.count();
        break;
    }

    return {
      name: table,
      count,
      status: count > 0 ? "ok" : "empty",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { name: table, count: 0, status: "error", note: message };
  }
}

async function main() {
  const { prisma } = await import("../src/lib/db");

  console.log("Silver Looms — database verification\n");

  const checks = await Promise.all(
    expectedTables.map((table) => countTable(prisma, table)),
  );

  const errors = checks.filter((check) => check.status === "error");
  const empty = checks.filter((check) => check.status === "empty");

  for (const check of checks) {
    const label =
      check.status === "error"
        ? "ERROR"
        : check.status === "empty"
          ? "EMPTY"
          : "OK   ";
    console.log(`${label}  ${check.name.padEnd(16)} ${check.count}`);
    if (check.note) console.log(`       ↳ ${check.note}`);
  }

  console.log("\nFeature → database mapping:");
  console.log("  Admin products (create/edit/delete) → products, product_colors, inventory");
  console.log("  Admin inventory editor              → inventory");
  console.log("  Admin homepage content              → site_content");
  console.log("  Admin orders/commerce               → orders, order_items");
  console.log("  Admin users/roles                   → users");
  console.log("  Storefront catalog                  → products (falls back to static file if DB empty)");
  console.log("  Cart                                → carts, cart_items (cookie fallback if DB fails)");
  console.log("  Checkout / payments                 → orders, order_items, inventory");
  console.log("  Wishlist                            → wishlists");
  console.log("  Auth accounts                       → users");

  if (errors.length > 0) {
    console.error(`\n${errors.length} table(s) failed — run: npm run db:push`);
    process.exit(1);
  }

  if (empty.some((table) => table.name === "products")) {
    console.log(
      "\nNote: products table is empty — storefront will show static demo products until you add items in /admin/store.",
    );
  }

  if (empty.some((table) => table.name === "site_content")) {
    console.log(
      "Note: site_content is empty — homepage uses built-in defaults until you save from /admin/content.",
    );
  }

  console.log("\nDatabase schema is reachable and all tables exist.");
}

void main()
  .catch((error) => {
    console.error("Verification failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import("../src/lib/db");
    await prisma.$disconnect();
  });
