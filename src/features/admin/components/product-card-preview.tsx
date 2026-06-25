"use client";

import { ProductCard } from "@/components/shared/product-card";
import { JewelleryProductCard } from "@/features/jewellery/components/jewellery-product-card";
import type { ProductType } from "@/features/admin/lib/product-presets";
import type { Product } from "@/lib/types/product";
import {
  computeDiscount,
  parseBadge,
  parseColors,
  parseSizes,
} from "@/features/admin/lib/product-presets";

interface ProductCardPreviewProps {
  productType: ProductType;
  name: string;
  categoryLabel: string;
  collection: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  badge: string;
  sizes: string;
  colors: string;
  rating: number;
  reviewCount: number;
}

function buildPreviewProduct(props: ProductCardPreviewProps): Product {
  const discount = computeDiscount(props.price, props.originalPrice || undefined);

  return {
    id: "preview",
    slug: "preview",
    name: props.name || "Product Name",
    category: props.categoryLabel || "CATEGORY · TYPE",
    collection: props.collection || undefined,
    price: props.price || 0,
    originalPrice: discount.originalPrice,
    discountPercent: discount.discountPercent,
    rating: props.rating,
    reviewCount: props.reviewCount,
    image: props.imageUrl || "/placeholder.jpg",
    images: props.imageUrl ? [props.imageUrl] : ["/placeholder.jpg"],
    badge: parseBadge(props.badge),
    sizes: parseSizes(props.sizes, props.productType),
    colors: parseColors(props.colors, props.productType),
  };
}

export function ProductCardPreview(props: ProductCardPreviewProps) {
  const product = buildPreviewProduct(props);

  return (
    <div className="sticky top-24">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[1.65px] text-admin-muted">
        Storefront Preview
      </p>
      <div
        className={
          props.productType === "jewellery"
            ? "rounded-2xl bg-ink p-6"
            : "rounded-2xl border border-admin-border bg-cream p-6"
        }
      >
        {props.productType === "jewellery" ? (
          <JewelleryProductCard product={product} />
        ) : (
          <ProductCard product={product} />
        )}
      </div>
      <p className="mt-3 text-center text-[11px] text-admin-muted">
        Matches the live product card on /kurtis or /jewellery
      </p>
    </div>
  );
}
