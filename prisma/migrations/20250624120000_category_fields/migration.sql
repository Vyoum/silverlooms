-- CreateEnum
CREATE TYPE "CategoryKind" AS ENUM ('APPAREL', 'JEWELLERY');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN "kind" "CategoryKind" NOT NULL DEFAULT 'APPAREL';
ALTER TABLE "categories" ADD COLUMN "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "categories" ADD COLUMN "show_in_marquee" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "categories" ADD COLUMN "show_in_catalog_filter" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "categories" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;
