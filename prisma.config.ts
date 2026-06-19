import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });

// DIRECT_URL is for local migrations (Supabase session pooler, port 5432).
// On Vercel/CI only DATABASE_URL is required — fall back so `prisma generate` succeeds at build time.
const datasourceUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
