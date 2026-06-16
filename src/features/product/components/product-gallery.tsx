"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types/product";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnails = [product.image, product.image, product.image, product.image];

  return (
    <div className="w-full lg:w-[55%]">
      <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-cream-dark">
        <Image
          src={thumbnails[selectedIndex]}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        {product.badge && (
          <span className="absolute left-4 top-4 bg-forest px-3 py-1 text-[11px] uppercase tracking-wider text-cream">
            {product.badge}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {thumbnails.map((thumb, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className={cn(
              "relative aspect-square overflow-hidden border-2",
              selectedIndex === i ? "border-ink" : "border-transparent",
            )}
          >
            <Image
              src={thumb}
              alt={`${product.name} view ${i + 1}`}
              fill
              className="object-cover"
              sizes="120px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
