import type { CategoryKind } from "@/features/catalog/lib/store-categories";
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
  heroImageUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
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
    heroImageUrl: row.heroImageUrl,
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
  };
}

export async function syncDefaultCategories() {
  for (const category of DEFAULT_STORE_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: {
        ...category,
        heroImageUrl: null,
        heroTitle: null,
        heroSubtitle: null,
      },
      update: {},
    });
  }
}

/** @deprecated Use syncDefaultCategories */
export const ensureDefaultCategories = syncDefaultCategories;

export async function listStoreCategories(kind?: CategoryKind) {
  try {
    await syncDefaultCategories();

    const rows = await prisma.category.findMany({
      where: kind ? { kind } : undefined,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return rows.map(mapCategory);
  } catch (error) {
    console.error("[categories] Failed to load categories:", error);
    return DEFAULT_STORE_CATEGORIES.map((category) => ({
      ...category,
      id: `fallback-${category.slug}`,
      heroImageUrl: null,
      heroTitle: null,
      heroSubtitle: null,
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
  heroImageUrl?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
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
      heroImageUrl: input.heroImageUrl ?? null,
      heroTitle: input.heroTitle ?? null,
      heroSubtitle: input.heroSubtitle ?? null,
    },
  });
}

export async function updateStoreCategory(
  id: string,
  input: {
    name?: string;
    kind?: CategoryKind;
    keywords?: string[];
    sortOrder?: number;
    heroImageUrl?: string | null;
    heroTitle?: string | null;
    heroSubtitle?: string | null;
    showInMarquee?: boolean;
    showInCatalogFilter?: boolean;
  },
) {
  const data: {
    name?: string;
    slug?: string;
    kind?: CategoryKind;
    keywords?: string[];
    sortOrder?: number;
    heroImageUrl?: string | null;
    heroTitle?: string | null;
    heroSubtitle?: string | null;
    showInMarquee?: boolean;
    showInCatalogFilter?: boolean;
  } = {};

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) {
      throw new Error("Category name is required.");
    }

    const nextSlug = slugify(name);
    const existing = await prisma.category.findUnique({ where: { slug: nextSlug } });
    if (existing && existing.id !== id) {
      throw new Error("Another category already uses this name.");
    }

    data.name = name;
    data.slug = nextSlug;
  }

  if (input.kind !== undefined) data.kind = input.kind;
  if (input.keywords !== undefined) data.keywords = input.keywords;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;
  if (input.heroImageUrl !== undefined) data.heroImageUrl = input.heroImageUrl;
  if (input.heroTitle !== undefined) data.heroTitle = input.heroTitle;
  if (input.heroSubtitle !== undefined) data.heroSubtitle = input.heroSubtitle;
  if (input.showInMarquee !== undefined) data.showInMarquee = input.showInMarquee;
  if (input.showInCatalogFilter !== undefined) {
    data.showInCatalogFilter = input.showInCatalogFilter;
  }

  return prisma.category.update({
    where: { id },
    data,
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
  try {
    const row = await prisma.category.findUnique({ where: { slug } });
    return row ? mapCategory(row) : null;
  } catch {
    return null;
  }
}
