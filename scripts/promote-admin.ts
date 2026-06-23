import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    console.error("Usage: npm run admin:promote -- your@email.com");
    process.exit(1);
  }

  const { prisma } = await import("../src/lib/db");
  const { UserRole } = await import("../src/generated/prisma/client");

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error(
        `No user found for ${email}. Sign in once on the site first, then run this again.`,
      );
      process.exit(1);
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      console.log(`${email} is already SUPER_ADMIN.`);
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: UserRole.SUPER_ADMIN },
    });

    console.log(`Promoted ${email} to SUPER_ADMIN. You can now access /admin.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to promote user: ${message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
