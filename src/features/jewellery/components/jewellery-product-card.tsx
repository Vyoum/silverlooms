"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/cart/cart-provider";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface JewelleryProductCardProps {
  product: Product;
}

const badgeStyles: Record<string, string> = {
  NEW: "bg-cream text-ink hover:bg-cream",
  BESTSELLER: "bg-gold text-ink hover:bg-gold",
  SALE: "bg-gold text-ink hover:bg-gold",
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
            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </Link>
        {product.badge && (
          <Badge
            className={cn(
              "absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-normal uppercase tracking-wider",
              badgeStyles[product.badge],
            )}
          >
            {product.badge}
          </Badge>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 rounded-full border border-white/20 bg-ink/50 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <Heart className="size-4 text-cream" />
        </button>
        <button
          type="button"
          className="absolute inset-x-4 bottom-3 flex items-center justify-center gap-2 rounded-full bg-gold py-3 text-[13px] font-medium uppercase tracking-wider text-ink opacity-0 transition-opacity group-hover:opacity-100"
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
          <h3 className="font-serif text-xl text-cream transition-colors hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted-light">
          ₹ {product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </article>
  );
}
