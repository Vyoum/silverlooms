import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  className?: string;
}

export function StarRating({ rating, reviewCount, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            className={cn(
              "size-2.5",
              filled || half
                ? "fill-ink text-ink"
                : "fill-muted text-muted",
            )}
          />
        );
      })}
      {reviewCount !== undefined && (
        <span className="ml-1 text-[11px] text-sage">({reviewCount})</span>
      )}
    </div>
  );
}
