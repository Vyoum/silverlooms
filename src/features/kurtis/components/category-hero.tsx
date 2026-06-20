import Image from "next/image";
import { assets } from "@/lib/constants/assets";
import { Container } from "@/components/layout/page-shell";
import {
  PRODUCT_SORT_LABELS,
  type ProductSort,
} from "@/features/catalog/lib/product-sort";
import { cn } from "@/lib/utils";

interface CategoryHeroProps {
  className?: string;
  sort: ProductSort;
}

const heroCopy: Record<
  ProductSort,
  { title: string; subtitle: string; alt: string }
> = {
  all: {
    title: "Kurtis & Sets",
    subtitle: "Curated apparel · New arrivals every week",
    alt: "Kurtis and Sets collection",
  },
  bestseller: {
    title: "Best Sellers",
    subtitle: "Our most loved pieces across the store",
    alt: "Best selling Silver Looms collection",
  },
  new: {
    title: "New Arrivals",
    subtitle: "Fresh from our atelier — limited pieces",
    alt: "New arrivals collection",
  },
};

export function CategoryHero({ className, sort }: CategoryHeroProps) {
  const copy = heroCopy[sort];

  return (
    <section
      className={cn(
        "relative h-[280px] overflow-hidden bg-[#f0eee9]",
        className,
      )}
    >
      <Image
        src={assets.hero.kurtis}
        alt={copy.alt}
        fill
        className="object-cover mix-blend-multiply opacity-90"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
      <Container className="relative flex h-full flex-col justify-end pb-10">
        <p className="mb-2 text-[11px] uppercase tracking-[1.65px] text-cream-dark/80">
          {sort === "all" ? "Collections" : PRODUCT_SORT_LABELS[sort]}
        </p>
        <h1 className="font-serif text-[42px] font-light leading-[50.4px] text-white">
          {copy.title}
        </h1>
        <p className="mt-2 text-base text-cream-dark/90">{copy.subtitle}</p>
      </Container>
    </section>
  );
}
