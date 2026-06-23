import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { prisma } = await import("../src/lib/db");

  try {
    const count = await prisma.user.count();
    const admins = await prisma.user.count({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    });
    console.log(`Database OK — ${count} users, ${admins} with admin access`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Database error: ${message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
