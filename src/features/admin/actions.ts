"use server";

import { revalidatePath } from "next/cache";
import {
  computeDiscount,
  parseBadge,
  parseColors,
  parseSizes,
  type ProductType,
} from "@/features/admin/lib/product-presets";
import { createProduct, slugify } from "@/features/catalog/services/product-service";

export interface CreateProductResult {
  success: boolean;
  error?: string;
  slug?: string;
}

export async function createProductAction(
  formData: FormData,
): Promise<CreateProductResult> {
  try {
    const productType = (String(formData.get("productType") ?? "apparel") ||
      "apparel") as ProductType;
    const name = String(formData.get("name") ?? "").trim();
    const categoryLabel = String(formData.get("categoryLabel") ?? "").trim();
    const price = Number(formData.get("price"));
    const originalPriceRaw = Number(formData.get("originalPrice"));
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const collection = String(formData.get("collection") ?? "").trim();
    const sizesRaw = String(formData.get("sizes") ?? "").trim();
    const colorsRaw = String(formData.get("colors") ?? "").trim();
    const stockQuantity = Number(formData.get("stockQuantity") ?? 50);
    const badgeRaw = String(formData.get("badge") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const rating = Number(formData.get("rating"));
    const reviewCount = Number(formData.get("reviewCount"));

    if (!name || !categoryLabel || !imageUrl || Number.isNaN(price) || price <= 0) {
      return { success: false, error: "Name, category, price, and image URL are required." };
    }

    const slug = slugInput || slugify(name);
    const sizes = parseSizes(sizesRaw, productType);
    const colors = parseColors(colorsRaw, productType);
    const badge = parseBadge(badgeRaw);
    const discount = computeDiscount(
      Math.round(price),
      Number.isNaN(originalPriceRaw) || originalPriceRaw <= 0
        ? undefined
        : Math.round(originalPriceRaw),
    );

    const product = await createProduct({
      name,
      slug,
      categoryLabel,
      collection: collection || undefined,
      description: description || undefined,
      price: Math.round(price),
      originalPrice: discount.originalPrice,
      discountPercent: discount.discountPercent,
      rating: Number.isNaN(rating) ? 4.5 : rating,
      reviewCount: Number.isNaN(reviewCount) ? 0 : reviewCount,
      imageUrl,
      badge,
      sizes,
      colors,
      stockQuantity: Number.isNaN(stockQuantity) ? 50 : stockQuantity,
    });

    revalidatePath("/");
    revalidatePath("/kurtis");
    revalidatePath("/jewellery");
    revalidatePath("/admin");
    revalidatePath("/admin/store");
    revalidatePath("/admin/jewellery");
    revalidatePath(`/product/${product.slug}`);

    return { success: true, slug: product.slug };
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "A product with this slug already exists."
        : "Failed to create product. Please try again.";
    return { success: false, error: message };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/");
    revalidatePath("/kurtis");
    revalidatePath("/jewellery");
    revalidatePath("/admin");
    revalidatePath("/admin/store");
    revalidatePath("/admin/jewellery");
    return { success: true };
  } catch {
    return { success: false, error: "Could not delete product." };
  }
}
