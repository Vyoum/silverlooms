"use server";

import { revalidatePath } from "next/cache";
import {
  computeDiscount,
  parseBadge,
  parseColors,
  parseSizes,
  type ProductType,
} from "@/features/admin/lib/product-presets";
import { saveProductImage } from "@/features/admin/services/product-image-service";
import { requireAdminUser } from "@/features/auth/services/session";
import { createProduct, slugify, updateProduct } from "@/features/catalog/services/product-service";

export interface CreateProductResult {
  success: boolean;
  error?: string;
  slug?: string;
}

export type UpdateProductResult = CreateProductResult;

function revalidateProductPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/kurtis");
  revalidatePath("/jewellery");
  revalidatePath("/admin");
  revalidatePath("/admin/store");
  revalidatePath("/admin/jewellery");
  revalidatePath(`/product/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/product/${previousSlug}`);
  }
}

export async function createProductAction(
  formData: FormData,
): Promise<CreateProductResult> {
  try {
    await requireAdminUser();

    const productType = (String(formData.get("productType") ?? "apparel") ||
      "apparel") as ProductType;
    const name = String(formData.get("name") ?? "").trim();
    const categoryLabel = String(formData.get("categoryLabel") ?? "").trim();
    const price = Number(formData.get("price"));
    const originalPriceRaw = Number(formData.get("originalPrice"));
    const imageFile = formData.get("image");
    let imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const collection = String(formData.get("collection") ?? "").trim();
    const sizesRaw = String(formData.get("sizes") ?? "").trim();
    const colorsRaw = String(formData.get("colors") ?? "").trim();
    const stockQuantity = Number(formData.get("stockQuantity") ?? 50);
    const badgeRaw = String(formData.get("badge") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const rating = Number(formData.get("rating"));
    const reviewCount = Number(formData.get("reviewCount"));

    if (!name || !categoryLabel || Number.isNaN(price) || price <= 0) {
      return { success: false, error: "Name, category, and price are required." };
    }

    const slug = slugInput || slugify(name);

    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        imageUrl = await saveProductImage(imageFile, slug);
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Could not upload product image.";
        return { success: false, error: message };
      }
    }

    if (!imageUrl) {
      return {
        success: false,
        error: "Upload a product photo or provide an image URL.",
      };
    }
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

    revalidateProductPaths(product.slug);

    return { success: true, slug: product.slug };
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "A product with this slug already exists."
        : "Failed to create product. Please try again.";
    return { success: false, error: message };
  }
}

export async function getProductForEditAction(productId: string) {
  try {
    await requireAdminUser();

    const { getProductForEdit } = await import(
      "@/features/admin/services/analytics-service"
    );

    const product = await getProductForEdit(productId);
    if (!product) {
      return { success: false as const, error: "Product not found." };
    }

    return { success: true as const, product };
  } catch {
    return { success: false as const, error: "Could not load product." };
  }
}

export async function updateProductAction(
  formData: FormData,
): Promise<UpdateProductResult> {
  try {
    await requireAdminUser();

    const productId = String(formData.get("productId") ?? "").trim();
    const previousSlug = String(formData.get("previousSlug") ?? "").trim();
    const productType = (String(formData.get("productType") ?? "apparel") ||
      "apparel") as ProductType;
    const name = String(formData.get("name") ?? "").trim();
    const categoryLabel = String(formData.get("categoryLabel") ?? "").trim();
    const price = Number(formData.get("price"));
    const originalPriceRaw = Number(formData.get("originalPrice"));
    const imageFile = formData.get("image");
    let imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const collection = String(formData.get("collection") ?? "").trim();
    const sizesRaw = String(formData.get("sizes") ?? "").trim();
    const colorsRaw = String(formData.get("colors") ?? "").trim();
    const badgeRaw = String(formData.get("badge") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const rating = Number(formData.get("rating"));
    const reviewCount = Number(formData.get("reviewCount"));

    if (!productId || !name || !categoryLabel || Number.isNaN(price) || price <= 0) {
      return { success: false, error: "Name, category, and price are required." };
    }

    const slug = slugInput || slugify(name);

    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        imageUrl = await saveProductImage(imageFile, slug);
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Could not upload product image.";
        return { success: false, error: message };
      }
    }

    if (!imageUrl) {
      return {
        success: false,
        error: "Upload a product photo or provide an image URL.",
      };
    }

    const sizes = parseSizes(sizesRaw, productType);
    const colors = parseColors(colorsRaw, productType);
    const badge = parseBadge(badgeRaw);
    const discount = computeDiscount(
      Math.round(price),
      Number.isNaN(originalPriceRaw) || originalPriceRaw <= 0
        ? undefined
        : Math.round(originalPriceRaw),
    );

    const product = await updateProduct(productId, {
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
    });

    revalidateProductPaths(product.slug, previousSlug);

    return { success: true, slug: product.slug };
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "A product with this slug already exists."
        : "Failed to update product. Please try again.";
    return { success: false, error: message };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await requireAdminUser();

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

export async function getProductInventoryAction(productId: string) {
  try {
    const { requireAdminUser } = await import("@/features/auth/services/session");
    await requireAdminUser();

    const { getProductInventory } = await import(
      "@/features/admin/services/inventory-service"
    );

    const inventory = await getProductInventory(productId);
    return { success: true as const, inventory };
  } catch {
    return { success: false as const, error: "Could not load inventory." };
  }
}

export async function updateProductInventoryAction(
  productId: string,
  updates: { inventoryId: string; quantity: number }[],
) {
  try {
    const { requireAdminUser } = await import("@/features/auth/services/session");
    await requireAdminUser();

    const { updateProductInventoryQuantities } = await import(
      "@/features/admin/services/inventory-service"
    );

    await updateProductInventoryQuantities(productId, updates);

    revalidatePath("/admin");
    revalidatePath("/admin/store");
    revalidatePath("/admin/jewellery");
    revalidatePath("/kurtis");
    revalidatePath("/jewellery");

    return { success: true as const };
  } catch {
    return { success: false as const, error: "Could not update inventory." };
  }
}
