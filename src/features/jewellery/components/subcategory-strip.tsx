import Link from "next/link";
import { jewellerySubcategories } from "@/lib/constants/navigation";
import { Container } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

export function SubcategoryStrip() {
  return (
    <section className="border-y border-border bg-cream py-8">
      <Container>
        <div className="flex flex-wrap gap-4">
          {jewellerySubcategories.map((cat, i) => (
            <Link
              key={cat}
              href={`/jewellery?category=${cat.toLowerCase()}`}
              className={cn(
                "rounded-full border px-4 py-3 text-[11px] uppercase tracking-[1.1px] transition-colors",
                i === 0
                  ? "border-ink bg-ink text-cream"
                  : "border-border text-ink hover:border-ink",
              )}
            >
              {cat}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
