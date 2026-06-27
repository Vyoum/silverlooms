import type { StoreCategory } from "@/features/catalog/lib/store-categories";
import type { ProductType } from "@/features/admin/lib/product-presets";
import { filterCatalogCategories } from "@/features/admin/lib/product-category";
import { cn } from "@/lib/utils";

interface ProductCategorySelectProps {
  categories: StoreCategory[];
  productType: ProductType;
  value: string;
  onChange: (categoryId: string) => void;
  name?: string;
  required?: boolean;
  className?: string;
}

export function ProductCategorySelect({
  categories,
  productType,
  value,
  onChange,
  name = "categoryId",
  required = false,
  className,
}: ProductCategorySelectProps) {
  const options = filterCatalogCategories(categories, productType);
  const hasCurrentValue =
    value.length > 0 && !options.some((category) => category.id === value);
  const currentOption = categories.find((category) => category.id === value);

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
      {hasCurrentValue && currentOption ? (
        <option value={value}>{currentOption.name} (current)</option>
      ) : null}
      {options.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
