"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { WishlistHeartButton } from "@/features/wishlist/components/wishlist-heart-button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { useCart } from "@/features/cart/cart-provider";
import type { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const badgeStyles: Record<string, string> = {
  SALE: "bg-[#e4beb7] text-ink hover:bg-[#e4beb7]",
  NEW: "bg-forest text-cream hover:bg-forest",
  BESTSELLER: "bg-[#d9c9a8] text-ink hover:bg-[#d9c9a8]",
};

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const href = `/product/${product.slug}`;
  const defaultSize = product.sizes?.includes("M")
    ? "M"
    : product.sizes?.[0];

  return (
    <article className={cn("group flex flex-col", className)}>
      <div className="relative mb-4 aspect-[286/430] overflow-hidden">
        <Link href={href} className="block size-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        {product.badge && (
          <Badge
            className={cn(
              "absolute left-3 top-3 rounded-none px-3 py-1 text-[9px] font-normal uppercase tracking-wider",
              badgeStyles[product.badge],
            )}
          >
            {product.badge}
          </Badge>
        )}
        <div className="absolute right-3 top-3 flex gap-2 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <WishlistHeartButton
            slug={product.slug}
            productName={product.name}
            className="rounded-full bg-cream/90 p-2 backdrop-blur-sm"
            iconClassName="size-4 text-ink"
            filledClassName="fill-forest text-forest"
          />
          <button
            type="button"
            aria-label="Quick add to bag"
            className="rounded-full bg-cream/90 p-2 backdrop-blur-sm"
            onClick={() =>
              addToCart({
                slug: product.slug,
                size: defaultSize,
                colorHex: product.colors[0]?.hex,
              })
            }
          >
            <ShoppingBag className="size-4 text-ink" />
          </button>
        </div>
      </div>

      <p className="mb-1 text-[9px] uppercase tracking-wider text-sage">
        {product.category}
      </p>
      <Link href={href}>
        <h3 className="font-serif text-[15px] leading-snug text-ink transition-colors hover:text-forest sm:text-[17px] sm:leading-[25.5px]">
          {product.name}
        </h3>
      </Link>

      {product.colors.length > 0 && (
        <div className="mt-2 flex gap-1">
          {product.colors.map((color) => (
            <span
              key={color.hex}
              className="size-[18px] rounded-full border border-border"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm font-medium text-ink">
          ₹{product.price.toLocaleString("en-IN")}
        </span>
        {product.originalPrice && (
          <span className="text-[13px] text-sage line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </span>
        )}
        {product.discountPercent && (
          <span className="text-[11px] text-[#795b56]">
            {product.discountPercent}% off
          </span>
        )}
      </div>

      <StarRating
        rating={product.rating}
        reviewCount={product.reviewCount}
        className="mt-2"
      />
    </article>
  );
}
