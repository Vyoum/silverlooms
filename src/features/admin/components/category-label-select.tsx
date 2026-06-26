import { CategoryKind, type StoreCategory } from "@/features/catalog/lib/store-categories";
import type { ProductType } from "@/features/admin/lib/product-presets";
import { cn } from "@/lib/utils";

export function formatCategoryLabel(category: Pick<StoreCategory, "name">) {
  return category.name.toUpperCase();
}

export function filterCategoriesByProductType(
  categories: StoreCategory[],
  productType: ProductType,
) {
  const kind =
    productType === "jewellery" ? CategoryKind.JEWELLERY : CategoryKind.APPAREL;

  return categories.filter((category) => category.kind === kind);
}

export function defaultCategoryLabel(
  categories: StoreCategory[],
  productType: ProductType,
) {
  const match = filterCategoriesByProductType(categories, productType)[0];
  return match ? formatCategoryLabel(match) : "";
}

interface CategoryLabelSelectProps {
  categories: StoreCategory[];
  productType: ProductType;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  className?: string;
}

export function CategoryLabelSelect({
  categories,
  productType,
  value,
  onChange,
  name = "categoryLabel",
  required = false,
  className,
}: CategoryLabelSelectProps) {
  const options = filterCategoriesByProductType(categories, productType);
  const hasCurrentValue =
    value.length > 0 &&
    !options.some((category) => formatCategoryLabel(category) === value);

  return (
    <select
      name={name}
      required={required}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "h-8 w-full rounded-lg border border-input bg-admin-canvas px-2.5 text-sm",
        className,
      )}
    >
      {options.length === 0 && !hasCurrentValue ? (
        <option value="">No categories available</option>
      ) : null}
      {hasCurrentValue ? (
        <option value={value}>{value} (current)</option>
      ) : null}
      {options.map((category) => {
        const label = formatCategoryLabel(category);
        return (
          <option key={category.id} value={label}>
            {category.name}
          </option>
        );
      })}
    </select>
  );
}
