import {
  JEWELLERY_MATERIAL_OPTIONS,
  type JewelleryMaterialSlug,
} from "@/features/jewellery/lib/jewellery-filters";
import { cn } from "@/lib/utils";

interface JewelleryMaterialSelectProps {
  value: string;
  onChange: (materialSlug: string) => void;
  name?: string;
  className?: string;
}

export function JewelleryMaterialSelect({
  value,
  onChange,
  name = "materialSlug",
  className,
}: JewelleryMaterialSelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "h-8 w-full rounded-lg border border-input bg-admin-canvas px-2.5 text-sm",
        className,
      )}
    >
      <option value="">Select material (optional)</option>
      {JEWELLERY_MATERIAL_OPTIONS.map((material) => (
        <option key={material.slug} value={material.slug}>
          {material.label}
        </option>
      ))}
    </select>
  );
}

export function isJewelleryMaterialSlug(
  value: string | null | undefined,
): value is JewelleryMaterialSlug {
  if (!value) return false;
  return JEWELLERY_MATERIAL_OPTIONS.some((option) => option.slug === value);
}
