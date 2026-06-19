"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { AddToBagButton } from "@/components/shared/add-to-bag-button";
import { SizeGuide, SizeGuideTrigger } from "@/components/shared/size-guide";
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

  return (
    <div className="w-full lg:w-[45%] lg:pl-12">
      {product.collection && (
        <p className="mb-4 text-[11px] uppercase tracking-[2.2px] text-sage">
          {product.collection}
        </p>
      )}
      <h1 className="font-serif text-4xl font-light text-ink">{product.name}</h1>

      <div className="mt-4 flex items-center gap-3">
        <StarRating rating={product.rating} />
        <span className="text-sm text-sage">{product.reviewCount} reviews</span>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <span className="text-2xl font-medium text-ink">
          ₹{product.price.toLocaleString("en-IN")}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-sage line-through">
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

      {product.description && (
        <p className="mt-6 text-base leading-relaxed text-sage">
          {product.description}
        </p>
      )}

      {sizes.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-ink">Select Size</p>
            <SizeGuideTrigger onClick={() => setSizeGuideOpen(true)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border text-[11px]",
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
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-ink">Color</p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color.hex}
                type="button"
                onClick={() => setSelectedColor(color.hex)}
                className={cn(
                  "size-8 rounded-full border",
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

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <AddToBagButton
          slug={product.slug}
          size={selectedSize}
          colorHex={selectedColor}
        />
        <Button
          variant="outline"
          className="h-12 flex-1 rounded-full border-ink text-[13px] uppercase tracking-[1.3px]"
        >
          Add to Wishlist
        </Button>
      </div>
    </div>
  );
}
