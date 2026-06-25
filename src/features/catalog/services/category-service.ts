import { CategoryKind } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/features/catalog/services/product-service";
import {
  DEFAULT_STORE_CATEGORIES,
  type StoreCategory,
} from "@/features/catalog/lib/store-categories";

function mapCategory(row: {
  id: string;
  slug: string;
  name: string;
  kind: CategoryKind;
  keywords: string[];
  showInMarquee: boolean;
  showInCatalogFilter: boolean;
  sortOrder: number;
}): StoreCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    kind: row.kind,
    keywords: row.keywords,
    showInMarquee: row.showInMarquee,
    showInCatalogFilter: row.showInCatalogFilter,
    sortOrder: row.sortOrder,
  };
}

export async function ensureDefaultCategories() {
  for (const category of DEFAULT_STORE_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: {},
    });
  }
}

export async function listStoreCategories(kind?: CategoryKind) {
  try {
    const count = await prisma.category.count();
    if (count === 0) {
      await ensureDefaultCategories();
    }

    const rows = await prisma.category.findMany({
      where: kind ? { kind } : undefined,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return rows.map(mapCategory);
  } catch (error) {
    console.error("[categories] Failed to load categories:", error);
    return DEFAULT_STORE_CATEGORIES.map((category, index) => ({
      ...category,
      id: `fallback-${category.slug}`,
    }));
  }
}

export async function listMarqueeCategoryLabels() {
  const categories = await listStoreCategories();
  return categories
    .filter((category) => category.showInMarquee)
    .map((category) => category.name.toUpperCase());
}

export async function listCatalogFilterCategories(kind: CategoryKind) {
  const categories = await listStoreCategories(kind);
  return categories.filter((category) => category.showInCatalogFilter);
}

export async function createStoreCategory(input: {
  name: string;
  kind: CategoryKind;
  keywords?: string[];
  showInMarquee?: boolean;
  showInCatalogFilter?: boolean;
  sortOrder?: number;
}) {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Category name is required.");
  }

  const slug = slugify(name);
  const keywords =
    input.keywords?.map((keyword) => keyword.trim().toLowerCase()).filter(Boolean) ??
    [name.toLowerCase()];

  return prisma.category.create({
    data: {
      slug,
      name,
      kind: input.kind,
      keywords,
      showInMarquee: input.showInMarquee ?? true,
      showInCatalogFilter: input.showInCatalogFilter ?? true,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function deleteStoreCategory(id: string) {
  const linked = await prisma.product.count({ where: { categoryId: id } });
  if (linked > 0) {
    throw new Error("Cannot delete a category that still has products linked.");
  }

  await prisma.category.delete({ where: { id } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
