"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/features/wishlist/wishlist-provider";
import { cn } from "@/lib/utils";

interface WishlistHeartButtonProps {
  slug: string;
  productName?: string;
  className?: string;
  iconClassName?: string;
  filledClassName?: string;
}

export function WishlistHeartButton({
  slug,
  productName,
  className,
  iconClassName,
  filledClassName = "fill-current",
}: WishlistHeartButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(slug);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(slug, productName);
      }}
    >
      <Heart
        className={cn(iconClassName, active && filledClassName)}
      />
    </button>
  );
}
