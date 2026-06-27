import type { ProductType } from "@/features/admin/lib/product-presets";
import {
  resolveProductCategoryLabel,
} from "@/features/admin/lib/product-category";
import {
  isJewelleryMaterialSlug,
} from "@/features/admin/components/jewellery-material-select";
import { CategoryKind } from "@/features/catalog/lib/store-categories";
import { prisma } from "@/lib/db";

export async function resolveProductCategoryFields(
  categoryId: string,
  productType: ProductType,
  materialSlugInput?: string | null,
) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Selected category was not found.");
  }

  const expectedKind =
    productType === "jewellery" ? CategoryKind.JEWELLERY : CategoryKind.APPAREL;

  if (category.kind !== expectedKind) {
    throw new Error("Selected category does not match the product type.");
  }

  const materialSlug =
    productType === "jewellery" && isJewelleryMaterialSlug(materialSlugInput)
      ? materialSlugInput
      : undefined;

  return {
    categoryId: category.id,
    categoryLabel: resolveProductCategoryLabel(
      {
        name: category.name,
        kind: category.kind,
      },
      productType,
      materialSlug,
    ),
    materialSlug,
  };
}

export function mapCategoryRecord(category: {
  id: string;
  name: string;
  kind: string;
}) {
  return {
    id: category.id,
    name: category.name,
    kind: category.kind as typeof CategoryKind.APPAREL | typeof CategoryKind.JEWELLERY,
  };
}
