import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
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
  const href = `/product/${product.slug}`;

  return (
    <article className={cn("group flex flex-col", className)}>
      <Link href={href} className="relative mb-4 block aspect-[286/430] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
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
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Heart className="size-4 text-ink" />
        </button>
      </Link>

      <p className="mb-1 text-[9px] uppercase tracking-wider text-sage">
        {product.category}
      </p>
      <Link href={href}>
        <h3 className="font-serif text-[17px] leading-[25.5px] text-ink transition-colors hover:text-forest">
          {product.name}
        </h3>
      </Link>

      {product.colors.length > 0 && (
        <div className="mt-2 flex gap-1">
          {product.colors.map((color, i) => (
            <span
              key={i}
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
