import Image from "next/image";
import { Container } from "@/components/layout/page-shell";
import type { CatalogHeroContent } from "@/lib/site-content/catalog-hero";
import { cn } from "@/lib/utils";

interface CategoryHeroProps {
  className?: string;
  hero: CatalogHeroContent;
}

export function CategoryHero({ className, hero }: CategoryHeroProps) {
  return (
    <section
      className={cn(
        "relative h-[min(38dvh,240px)] min-h-[200px] overflow-hidden bg-ink sm:h-[280px] md:h-[380px] md:max-h-none",
        className,
      )}
    >
      <Image
        src={hero.imageUrl}
        alt={hero.title}
        fill
        priority
        quality={92}
        className="object-cover object-[center_20%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10" />
      <Container className="relative flex h-full flex-col justify-end pb-6 md:pb-10">
        <p className="mb-1 text-[10px] uppercase tracking-[1.65px] text-cream-dark/90 sm:mb-2 sm:text-[11px]">
          {hero.eyebrow}
        </p>
        <h1 className="font-serif text-[28px] font-light leading-tight text-white sm:text-[36px] md:text-[42px] md:leading-[50.4px]">
          {hero.title}
        </h1>
        <p className="mt-1 text-sm text-cream-dark/90 sm:mt-2 sm:text-base">{hero.subtitle}</p>
      </Container>
    </section>
  );
}
