import { X } from "lucide-react";

const activeFilters = [
  { label: "Size: M" },
  { label: "Color: Dusty Rose" },
  { label: "Sort: New First" },
];

export function ActiveFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-cream-dark px-4 py-3 md:px-16">
      <nav className="text-[11px] uppercase tracking-wider text-sage">
        Home / Apparel / Kurtis & Sets
      </nav>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {activeFilters.map((filter) => (
          <span
            key={filter.label}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-cream px-3 py-1 text-[11px] text-ink"
          >
            {filter.label}
            <X className="size-3" />
          </span>
        ))}
        <button type="button" className="text-[11px] text-sage-light underline">
          Clear All
        </button>
      </div>
    </div>
  );
}
