"use server";

import { revalidatePath } from "next/cache";
import type { CategoryKind } from "@/features/catalog/lib/store-categories";
import {
  createStoreCategory,
  deleteStoreCategory,
  listStoreCategories,
} from "@/features/catalog/services/category-service";
import { requireAdminUser } from "@/features/auth/services/session";

export type CategoryActionResult = { success: boolean; error?: string };

export async function getCategoriesForAdminAction() {
  try {
    await requireAdminUser();
    const categories = await listStoreCategories();
    return { success: true as const, categories };
  } catch {
    return { success: false as const, error: "Could not load categories." };
  }
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

    if (!name) {
      return { success: false, error: "Category name is required." };
    }

    await createStoreCategory({
      name,
      kind,
      keywords: keywordsRaw
        ? keywordsRaw.split(",").map((keyword) => keyword.trim())
        : undefined,
      showInMarquee,
      showInCatalogFilter,
    });

    revalidatePath("/");
    revalidatePath("/kurtis");
    revalidatePath("/jewellery");
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create category.";
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

    revalidatePath("/");
    revalidatePath("/kurtis");
    revalidatePath("/jewellery");
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete category.";
    return { success: false, error: message };
  }
}
