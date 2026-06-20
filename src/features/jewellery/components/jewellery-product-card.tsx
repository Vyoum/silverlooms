"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/cart-provider";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface JewelleryProductCardProps {
  product: Product;
}

const badgeLabels: Record<string, string> = {
  NEW: "New Arrival",
  BESTSELLER: "Bestseller",
  SALE: "Sale",
};

const badgeStyles: Record<string, string> = {
  NEW: "bg-cream text-ink",
  BESTSELLER: "bg-gold text-ink",
  SALE: "bg-gold text-ink",
};

export function JewelleryProductCard({ product }: JewelleryProductCardProps) {
  const { addToCart } = useCart();
  const href = `/product/${product.slug}`;

  return (
    <article className="group flex flex-col border border-white/5 bg-[#1c1a16]">
      <div className="relative aspect-[286/357] overflow-hidden">
        <Link href={href} className="block size-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        {product.badge && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-3 py-0.5 text-[10px] uppercase tracking-[0.5px]",
              badgeStyles[product.badge],
            )}
          >
            {badgeLabels[product.badge] ?? product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-white/20 bg-ink/50 backdrop-blur-sm"
        >
          <Heart className="size-3.5 text-cream" />
        </button>
        <button
          type="button"
          className="absolute inset-x-4 bottom-3 flex items-center justify-center gap-2 rounded-full bg-gold py-3 text-[13px] font-medium uppercase tracking-[0.65px] text-ink opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() =>
            addToCart({
              slug: product.slug,
              colorHex: product.colors[0]?.hex,
            })
          }
        >
          <ShoppingBag className="size-4" />
          Add to Bag
        </button>
      </div>
      <div className="p-4">
        <Link href={href}>
          <h3 className="font-serif text-base leading-6 text-cream transition-colors hover:text-gold sm:text-xl sm:leading-7">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-[#c1c7cf]">
          ₹ {product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </article>
  );
}
