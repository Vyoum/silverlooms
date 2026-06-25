"use server";

import { revalidatePath } from "next/cache";
import type { ProductSort } from "@/features/catalog/lib/product-sort";
import type { CategoryKind } from "@/features/catalog/lib/store-categories";
import {
  createStoreCategory,
  deleteStoreCategory,
  listStoreCategories,
  updateStoreCategory,
} from "@/features/catalog/services/category-service";
import { saveProductImage } from "@/features/admin/services/product-image-service";
import { requireAdminUser } from "@/features/auth/services/session";
import {
  getApparelCatalogHeroes,
  saveApparelCatalogHeroes,
  type ApparelCatalogHeroes,
} from "@/lib/site-content/catalog-hero";

export type CategoryActionResult = { success: boolean; error?: string };

const PRODUCT_SORTS: ProductSort[] = ["all", "bestseller", "new"];

export async function getCategoriesForAdminAction() {
  try {
    await requireAdminUser();
    const [categories, catalogHeroes] = await Promise.all([
      listStoreCategories(),
      getApparelCatalogHeroes(),
    ]);
    return { success: true as const, categories, catalogHeroes };
  } catch {
    return { success: false as const, error: "Could not load categories." };
  }
}

function revalidateCategoryPaths() {
  revalidatePath("/");
  revalidatePath("/kurtis");
  revalidatePath("/jewellery");
  revalidatePath("/admin/categories");
}

export async function createCategoryAction(
  _prev: CategoryActionResult,
  formData: FormData,
): Promise<CategoryActionResult> {
  try {
    await requireAdminUser();

    const name = String(formData.get("name") ?? "").trim();
    const kind = String(formData.get("kind") ?? "APPAREL") as CategoryKind;
    const keywordsRaw = String(formData.get("keywords") ?? "").trim();
    const showInMarquee = formData.get("showInMarquee") === "on";
    const showInCatalogFilter = formData.get("showInCatalogFilter") === "on";
    const heroTitle = String(formData.get("heroTitle") ?? "").trim();
    const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
    const imageFile = formData.get("heroImage");

    if (!name) {
      return { success: false, error: "Category name is required." };
    }

    let heroImageUrl: string | null = null;
    if (imageFile instanceof File && imageFile.size > 0) {
      heroImageUrl = await saveProductImage(imageFile, `category-${slugify(name)}`);
    }

    await createStoreCategory({
      name,
      kind,
      keywords: keywordsRaw
        ? keywordsRaw.split(",").map((keyword) => keyword.trim())
        : undefined,
      showInMarquee,
      showInCatalogFilter,
      heroImageUrl,
      heroTitle: heroTitle || null,
      heroSubtitle: heroSubtitle || null,
    });

    revalidateCategoryPaths();
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create category.";
    return { success: false, error: message };
  }
}

export async function updateCategoryAction(
  _prev: CategoryActionResult,
  formData: FormData,
): Promise<CategoryActionResult> {
  try {
    await requireAdminUser();

    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const kind = String(formData.get("kind") ?? "APPAREL") as CategoryKind;
    const keywordsRaw = String(formData.get("keywords") ?? "").trim();
    const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();
    const showInMarquee = formData.get("showInMarquee") === "on";
    const showInCatalogFilter = formData.get("showInCatalogFilter") === "on";
    const heroTitle = String(formData.get("heroTitle") ?? "").trim();
    const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
    const existingImageUrl = String(formData.get("heroImageUrl") ?? "").trim();
    const imageFile = formData.get("heroImage");
    const slug = String(formData.get("slug") ?? "category").trim();

    if (!id) {
      return { success: false, error: "Category id is required." };
    }

    if (!name) {
      return { success: false, error: "Category name is required." };
    }

    let heroImageUrl = existingImageUrl || null;
    if (imageFile instanceof File && imageFile.size > 0) {
      heroImageUrl = await saveProductImage(imageFile, `category-${slug}`);
    }

    const sortOrder = sortOrderRaw ? Number.parseInt(sortOrderRaw, 10) : 0;
    if (Number.isNaN(sortOrder)) {
      return { success: false, error: "Sort order must be a number." };
    }

    await updateStoreCategory(id, {
      name,
      kind,
      keywords: keywordsRaw
        ? keywordsRaw.split(",").map((keyword) => keyword.trim().toLowerCase())
        : [name.toLowerCase()],
      sortOrder,
      showInMarquee,
      showInCatalogFilter,
      heroTitle: heroTitle || null,
      heroSubtitle: heroSubtitle || null,
      heroImageUrl,
    });

    revalidateCategoryPaths();
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update category.";
    return { success: false, error: message };
  }
}

export async function updateCategoryHeroAction(
  _prev: CategoryActionResult,
  formData: FormData,
): Promise<CategoryActionResult> {
  try {
    await requireAdminUser();

    const id = String(formData.get("id") ?? "").trim();
    const heroTitle = String(formData.get("heroTitle") ?? "").trim();
    const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
    const existingImageUrl = String(formData.get("heroImageUrl") ?? "").trim();
    const imageFile = formData.get("heroImage");
    const slug = String(formData.get("slug") ?? "category").trim();

    if (!id) {
      return { success: false, error: "Category id is required." };
    }

    let heroImageUrl = existingImageUrl || null;
    if (imageFile instanceof File && imageFile.size > 0) {
      heroImageUrl = await saveProductImage(imageFile, `category-${slug}`);
    }

    await updateStoreCategory(id, {
      heroTitle: heroTitle || null,
      heroSubtitle: heroSubtitle || null,
      heroImageUrl,
    });

    revalidateCategoryPaths();
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update category hero.";
    return { success: false, error: message };
  }
}

export async function updateCatalogHeroAction(
  _prev: CategoryActionResult,
  formData: FormData,
): Promise<CategoryActionResult> {
  try {
    await requireAdminUser();

    const sort = String(formData.get("sort") ?? "all") as ProductSort;
    if (!PRODUCT_SORTS.includes(sort)) {
      return { success: false, error: "Invalid catalog view." };
    }

    const current = await getApparelCatalogHeroes();
    const eyebrow = String(formData.get("eyebrow") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const subtitle = String(formData.get("subtitle") ?? "").trim();
    const existingImageUrl = String(formData.get("imageUrl") ?? "").trim();
    const imageFile = formData.get("heroImage");

    let imageUrl = existingImageUrl || current[sort].imageUrl;
    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await saveProductImage(imageFile, `catalog-${sort}`);
    }

    const next: ApparelCatalogHeroes = {
      ...current,
      [sort]: {
        eyebrow: eyebrow || current[sort].eyebrow,
        title: title || current[sort].title,
        subtitle: subtitle || current[sort].subtitle,
        imageUrl,
      },
    };

    await saveApparelCatalogHeroes(next);
    revalidateCategoryPaths();
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update catalog hero.";
    return { success: false, error: message };
  }
}

export async function deleteCategoryFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  await deleteCategoryAction(id);
}

export async function deleteCategoryAction(id: string): Promise<CategoryActionResult> {
  try {
    await requireAdminUser();
    await deleteStoreCategory(id);
    revalidateCategoryPaths();
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete category.";
    return { success: false, error: message };
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
