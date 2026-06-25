-- AlterTable
ALTER TABLE "products" ADD COLUMN "gallery_image_urls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
