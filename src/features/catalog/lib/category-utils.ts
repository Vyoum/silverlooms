import type { Product } from "@/lib/types/product";
import {
  CategoryKind,
  productMatchesCategory,
  type StoreCategory,
} from "@/features/catalog/lib/store-categories";

const JEWELLERY_LABEL_PATTERNS = [
  /necklace|choker/i,
  /earring|jhumka/i,
  /bangle|kada/i,
  /\bring\b/i,
  /pendant/i,
  /maang/i,
  /jewell?(ery|ery)/i,
  /german silver/i,
  /anti[- ]?tarnish/i,
  /temple jewell?ery/i,
  /oxid/i,
  /kin fog/i,
] as const;

const APPAREL_LABEL_PATTERNS = [
  /kurti/i,
  /leheriya/i,
  /bandhej|bandhani/i,
  /saree/i,
  /anarkali/i,
  /shirt/i,
  /\bsuit\b/i,
  /\bbag\b|tote|clutch/i,
  /lehenga/i,
  /co-ord|coord/i,
  /dupatta/i,
] as const;

export function isJewelleryCategory(categoryLabel: string): boolean {
  return JEWELLERY_LABEL_PATTERNS.some((pattern) =>
    pattern.test(categoryLabel),
  );
}

export function isApparelCategoryLabel(categoryLabel: string): boolean {
  return APPAREL_LABEL_PATTERNS.some((pattern) => pattern.test(categoryLabel));
}

export function resolveProductCatalogKind(
  product: Pick<Product, "category" | "categoryKind" | "categorySlug" | "materialSlug">,
): CategoryKind {
  if (product.categoryKind === CategoryKind.APPAREL) {
    return CategoryKind.APPAREL;
  }

  if (product.categoryKind === CategoryKind.JEWELLERY) {
    return CategoryKind.JEWELLERY;
  }

  if (product.materialSlug) {
    return CategoryKind.JEWELLERY;
  }

  const label = product.category;
  const apparelSignal = isApparelCategoryLabel(label);
  const jewellerySignal = isJewelleryCategory(label);

  if (apparelSignal && !jewellerySignal) {
    return CategoryKind.APPAREL;
  }

  if (jewellerySignal && !apparelSignal) {
    return CategoryKind.JEWELLERY;
  }

  if (jewellerySignal && apparelSignal) {
    return CategoryKind.JEWELLERY;
  }

  return CategoryKind.APPAREL;
}

export function isJewelleryProduct(
  product: Pick<Product, "category" | "categoryKind" | "categorySlug" | "materialSlug">,
) {
  return resolveProductCatalogKind(product) === CategoryKind.JEWELLERY;
}

export function isApparelProduct(
  product: Pick<Product, "category" | "categoryKind" | "categorySlug" | "materialSlug">,
) {
  return resolveProductCatalogKind(product) === CategoryKind.APPAREL;
}

export function inferCategoryIdFromLabel(
  categoryLabel: string,
  categories: StoreCategory[],
  materialSlug?: string | null,
): string | null {
  const kind =
    materialSlug || isJewelleryCategory(categoryLabel)
      ? CategoryKind.JEWELLERY
      : isApparelCategoryLabel(categoryLabel)
        ? CategoryKind.APPAREL
        : CategoryKind.APPAREL;

  const pool = categories.filter(
    (category) =>
      category.kind === kind &&
      (kind === CategoryKind.JEWELLERY || category.showInCatalogFilter),
  );

  if (pool.length === 0) return null;

  const head = categoryLabel.toUpperCase().split("·")[0]?.trim() ?? "";

  const exact = pool.find((category) => category.name.toUpperCase() === head);
  if (exact) return exact.id;

  if (materialSlug) {
    const materialMatch = pool.find((category) => category.slug === materialSlug);
    if (materialMatch) return materialMatch.id;
  }

  for (const category of pool) {
    if (productMatchesCategory(categoryLabel, category.keywords)) {
      return category.id;
    }
  }

  if (kind === CategoryKind.JEWELLERY && !materialSlug) {
    const silverFallback = categories.find(
      (category) => category.slug === "silver-jewellery",
    );
    if (silverFallback) return silverFallback.id;
  }

  return pool[0]?.id ?? null;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
