"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { AddToBagButton } from "@/components/shared/add-to-bag-button";
import { WishlistHeartButton } from "@/features/wishlist/components/wishlist-heart-button";
import { useWishlist } from "@/features/wishlist/wishlist-provider";
import { SizeGuide, SizeGuideTrigger } from "@/components/shared/size-guide";
import { DeliveryEstimateBox } from "@/features/product/components/delivery-estimate-box";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types/product";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const sizes = product.sizes ?? ["XS", "S", "M", "L", "XL"];
  const [selectedSize, setSelectedSize] = useState(sizes.includes("M") ? "M" : sizes[0]);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.hex ?? undefined,
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.slug);

  return (
    <div className="w-full lg:w-[45%] lg:pl-12">
      {product.collection && (
        <p className="mb-2 text-[10px] uppercase tracking-[1.8px] text-sage md:mb-4 md:text-[11px] md:tracking-[2.2px]">
          {product.collection}
        </p>
      )}
      <h1 className="font-serif text-2xl font-light text-ink sm:text-3xl lg:text-4xl">
        {product.name}
      </h1>

      <div className="mt-2 flex items-center gap-2 md:mt-4 md:gap-3">
        <StarRating rating={product.rating} />
        <span className="text-xs text-sage md:text-sm">{product.reviewCount} reviews</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-6 md:gap-4">
        <span className="text-xl font-medium text-ink md:text-2xl">
          ₹{product.price.toLocaleString("en-IN")}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-base text-sage line-through md:text-lg">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
            {product.discountPercent && (
              <span className="rounded bg-[#e4beb7]/30 px-2 py-0.5 text-[11px] text-[#795b56]">
                {product.discountPercent}% OFF
              </span>
            )}
          </>
        )}
      </div>

      <DeliveryEstimateBox />

      {product.description && (
        <p className="mt-4 text-sm leading-relaxed text-sage md:mt-6 md:text-base">
          {product.description}
        </p>
      )}

      {sizes.length > 0 && (
        <div className="mt-5 md:mt-8">
          <div className="mb-2 flex items-center justify-between gap-4 md:mb-3">
            <p className="text-sm font-medium text-ink">Select Size</p>
            <SizeGuideTrigger onClick={() => setSizeGuideOpen(true)} />
          </div>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border text-[10px] md:size-10 md:text-[11px]",
                  selectedSize === size
                    ? "border-ink bg-ink text-white"
                    : "border-sage-light text-ink hover:border-ink",
                )}
              >
                {size}
              </button>
            ))}
          </div>
          <SizeGuide
            open={sizeGuideOpen}
            onOpenChange={setSizeGuideOpen}
            highlightSize={selectedSize}
          />
        </div>
      )}

      {product.colors.length > 0 && (
        <div className="mt-4 md:mt-6">
          <p className="mb-2 text-sm font-medium text-ink md:mb-3">Color</p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => setSelectedColor(color.hex)}
                className={cn(
                  "size-7 rounded-full border md:size-8",
                  selectedColor === color.hex &&
                    "ring-2 ring-ink ring-offset-2",
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name ?? `Color ${color.hex}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row md:mt-8 md:gap-3">
        <AddToBagButton
          slug={product.slug}
          size={selectedSize}
          colorHex={selectedColor}
          className="h-11 text-[12px] tracking-[1.1px] md:h-12 md:text-[13px] md:tracking-[1.3px]"
        />
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-11 flex-1 rounded-full border-ink text-[12px] uppercase tracking-[1.1px] md:h-12 md:text-[13px] md:tracking-[1.3px]",
            wishlisted && "bg-ink/5",
          )}
          onClick={() => toggleWishlist(product.slug, product.name)}
        >
          {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
        </Button>
      </div>
    </div>
  );
}
