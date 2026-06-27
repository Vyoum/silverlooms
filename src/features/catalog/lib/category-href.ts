import {
  CategoryKind,
  DEFAULT_STORE_CATEGORIES,
  type StoreCategory,
} from "@/features/catalog/lib/store-categories";
import {
  JEWELLERY_CATEGORY_OPTIONS,
  JEWELLERY_MATERIAL_OPTIONS,
} from "@/features/jewellery/lib/jewellery-filters";

export type MarqueeCategoryItem = {
  label: string;
  href: string;
};

export function buildStoreCategoryHref(
  category: Pick<StoreCategory, "slug" | "kind">,
) {
  if (category.kind === CategoryKind.APPAREL) {
    return `/kurtis?category=${category.slug}`;
  }

  if (category.slug === "silver-jewellery") {
    return "/jewellery";
  }

  if (JEWELLERY_CATEGORY_OPTIONS.some((option) => option.slug === category.slug)) {
    return `/jewellery?category=${category.slug}`;
  }

  if (JEWELLERY_MATERIAL_OPTIONS.some((option) => option.slug === category.slug)) {
    return `/jewellery?material=${category.slug}`;
  }

  return "/jewellery";
}

export function toMarqueeCategoryItem(
  category: Pick<StoreCategory, "name" | "slug" | "kind">,
): MarqueeCategoryItem {
  return {
    label: category.name.toUpperCase(),
    href: buildStoreCategoryHref(category),
  };
}

export function fallbackMarqueeCategories(): MarqueeCategoryItem[] {
  return DEFAULT_STORE_CATEGORIES.filter((category) => category.showInMarquee).map(
    toMarqueeCategoryItem,
  );
}
