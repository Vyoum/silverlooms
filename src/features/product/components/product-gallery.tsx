"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types/product";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.images?.length ? product.images : [product.image];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] ?? product.image;

  function showPrevious() {
    setSelectedIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  }

  function showNext() {
    setSelectedIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  }

  return (
    <div className="w-full lg:w-[55%]">
      <div className="relative mb-2 aspect-[4/5] max-h-[min(46dvh,360px)] w-full overflow-hidden bg-cream-dark md:mb-4 md:max-h-none md:aspect-[3/4]">
        <Image
          src={activeImage}
          alt={`${product.name} — photo ${selectedIndex + 1}`}
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
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm"
              aria-label="Next photo"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    selectedIndex === index ? "bg-white" : "bg-white/50",
                  )}
                  aria-label={`Show photo ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {images.map((thumb, index) => (
            <button
              key={`${thumb}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden border md:border-2",
                selectedIndex === index ? "border-ink" : "border-transparent",
              )}
            >
              <Image
                src={thumb}
                alt={`${product.name} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
