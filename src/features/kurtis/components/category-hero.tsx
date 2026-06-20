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
        "relative h-[min(38dvh,240px)] min-h-[200px] overflow-hidden bg-ink sm:h-[280px] md:h-[380px] md:max-h-none",
        className,
      )}
    >
      <Image
        src={assets.hero.kurtis}
        alt={copy.alt}
        fill
        priority
        quality={92}
        className="object-cover object-[center_20%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10" />
      <Container className="relative flex h-full flex-col justify-end pb-6 md:pb-10">
        <p className="mb-1 text-[10px] uppercase tracking-[1.65px] text-cream-dark/90 sm:mb-2 sm:text-[11px]">
          {sort === "all" ? "Collections" : PRODUCT_SORT_LABELS[sort]}
        </p>
        <h1 className="font-serif text-[28px] font-light leading-tight text-white sm:text-[36px] md:text-[42px] md:leading-[50.4px]">
          {copy.title}
        </h1>
        <p className="mt-1 text-sm text-cream-dark/90 sm:mt-2 sm:text-base">{copy.subtitle}</p>
      </Container>
    </section>
  );
}
