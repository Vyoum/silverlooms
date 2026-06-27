import type { StoreCategory } from "@/features/catalog/lib/store-categories";
import { CategoryKind } from "@/features/catalog/lib/store-categories";
import type { ProductType } from "@/features/admin/lib/product-presets";
import {
  getJewelleryMaterialLabel,
  JEWELLERY_MATERIAL_OPTIONS,
  type JewelleryMaterialSlug,
} from "@/features/jewellery/lib/jewellery-filters";

export function formatCategoryLabel(category: Pick<StoreCategory, "name">) {
  return category.name.toUpperCase();
}

export function filterCatalogCategories(
  categories: StoreCategory[],
  productType: ProductType,
) {
  const kind =
    productType === "jewellery" ? CategoryKind.JEWELLERY : CategoryKind.APPAREL;

  return categories.filter(
    (category) => category.kind === kind && category.showInCatalogFilter,
  );
}

export function defaultCatalogCategoryId(
  categories: StoreCategory[],
  productType: ProductType,
) {
  return filterCatalogCategories(categories, productType)[0]?.id ?? "";
}

export function buildJewelleryCategoryLabel(
  categoryName: string,
  materialSlug?: string | null,
) {
  const base = categoryName.toUpperCase();
  const materialLabel = materialSlug
    ? getJewelleryMaterialLabel(materialSlug as JewelleryMaterialSlug)
    : null;

  if (!materialLabel) return base;
  return `${base} · ${materialLabel.toUpperCase()}`;
}

export function resolveProductCategoryLabel(
  category: Pick<StoreCategory, "name" | "kind">,
  productType: ProductType,
  materialSlug?: string | null,
) {
  if (productType === "jewellery" || category.kind === CategoryKind.JEWELLERY) {
    return buildJewelleryCategoryLabel(category.name, materialSlug);
  }

  return formatCategoryLabel(category);
}

export function inferCatalogCategoryId(
  categories: StoreCategory[],
  productType: ProductType,
  categoryLabel: string,
) {
  const options = filterCatalogCategories(categories, productType);
  const normalizedLabel = categoryLabel.toUpperCase().split("·")[0]?.trim() ?? "";

  const exactMatch = options.find(
    (category) => category.name.toUpperCase() === normalizedLabel,
  );
  if (exactMatch) return exactMatch.id;

  const keywordMatch = options.find((category) =>
    categoryLabel.toUpperCase().includes(category.name.toUpperCase()),
  );
  if (keywordMatch) return keywordMatch.id;

  return defaultCatalogCategoryId(categories, productType);
}

export function inferMaterialSlugFromLabel(categoryLabel: string) {
  for (const material of JEWELLERY_MATERIAL_OPTIONS) {
    if (material.pattern.test(categoryLabel)) {
      return material.slug;
    }
  }

  return "";
}
