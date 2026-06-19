import { assets } from "@/lib/constants/assets";
import type { ProductBadge } from "@/lib/types/product";

export type ProductType = "apparel" | "jewellery";

export const apparelCategoryPresets = [
  "LEHERIYA · KURTI SET",
  "EMBROIDERED · KURTI SET",
  "FLORAL · STRAIGHT KURTI",
  "A-LINE · KURTI SET",
  "ANARKALI · SUIT SET",
] as const;

export const jewelleryCategoryPresets = [
  "NECKLACE · GERMAN SILVER",
  "EARRINGS · ANTI-TARNISH",
  "BANGLES · OXIDISED",
  "PENDANT · GERMAN SILVER",
  "MAANG TIKKA · TEMPLE",
] as const;

export const imagePresets = {
  apparel: [
    { label: "Gulabi Tie-dye", url: assets.products.gulabiTieDye },
    { label: "Gulabi Leheriya", url: assets.products.gulabiLeheriya },
    { label: "Embroidered Set", url: assets.products.product2 },
    { label: "Floral Kurti", url: assets.products.product3 },
  ],
  jewellery: [
    { label: "Silver Choker", url: assets.products.jodhaNecklace },
    { label: "Drop Earrings", url: assets.products.silverEarrings },
    { label: "Silver Bangles", url: assets.products.silverBangles },
    { label: "Pendant", url: assets.products.silverPendant },
  ],
} as const;

export const mockStyleDefaults = {
  apparel: {
    sizes: "XS, S, M, L, XL",
    colors: "#e4beb7, #b0cfa3, #ffffff",
    category: apparelCategoryPresets[0],
    collection: "HERITAGE COLLECTION",
    rating: 4.5,
    reviewCount: 0,
    imageUrl: assets.products.gulabiLeheriya,
  },
  jewellery: {
    sizes: "",
    colors: "#c0c0c0",
    category: jewelleryCategoryPresets[0],
    collection: "",
    rating: 4.5,
    reviewCount: 0,
    imageUrl: assets.products.jodhaNecklace,
  },
} as const;

export function parseColors(raw: string, productType: ProductType) {
  const parsed = raw
    .split(",")
    .map((hex) => ({ hex: hex.trim() }))
    .filter((c) => c.hex);

  if (parsed.length > 0) return parsed;

  return productType === "apparel"
    ? [{ hex: "#e4beb7" }, { hex: "#b0cfa3" }, { hex: "#ffffff" }]
    : [{ hex: "#c0c0c0" }];
}

export function parseSizes(raw: string, productType: ProductType) {
  const parsed = raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  if (parsed.length > 0) return parsed;
  return productType === "apparel" ? ["XS", "S", "M", "L", "XL"] : [];
}

export function computeDiscount(
  price: number,
  originalPrice?: number,
): { originalPrice?: number; discountPercent?: number } {
  if (!originalPrice || originalPrice <= price) {
    return {};
  }
  return {
    originalPrice: Math.round(originalPrice),
    discountPercent: Math.round((1 - price / originalPrice) * 100),
  };
}

export function parseBadge(raw: string): ProductBadge | undefined {
  if (raw && ["NEW", "SALE", "BESTSELLER"].includes(raw)) {
    return raw as ProductBadge;
  }
  return undefined;
}
