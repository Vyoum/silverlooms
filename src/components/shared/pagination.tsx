import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  className?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 12,
  className,
}: PaginationProps) {
  const pages = [1, 2, 3, "...", totalPages];

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-4 text-sm", className)}
    >
      <button
        type="button"
        className="text-sage transition-colors hover:text-ink"
      >
        Previous
      </button>
      <div className="flex items-center gap-4">
        {pages.map((page, i) =>
          typeof page === "number" ? (
            <button
              key={i}
              type="button"
              className={cn(
                "min-w-4 text-center transition-colors hover:text-ink",
                page === currentPage
                  ? "font-medium text-ink"
                  : "text-sage",
              )}
            >
              {page}
            </button>
          ) : (
            <span key={i} className="text-sage">
              {page}
            </span>
          ),
        )}
      </div>
      <button
        type="button"
        className="text-sage transition-colors hover:text-ink"
      >
        Next
      </button>
    </nav>
  );
}
