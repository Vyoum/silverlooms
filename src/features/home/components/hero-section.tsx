import Image from "next/image";
import type { HomepageHeroContent } from "@/lib/site-content/types";
import { defaultHomepageContent } from "@/lib/site-content/defaults";
import { Container, PillButton } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

export function HeroSection({
  className,
  content = defaultHomepageContent.hero,
}: {
  className?: string;
  content?: HomepageHeroContent;
}) {
  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        "h-[min(calc(100dvh-2.25rem),480px)]",
        "sm:h-[min(calc(100dvh-2.25rem),560px)]",
        "md:h-auto md:min-h-[600px] md:max-h-[900px]",
        className,
      )}
    >
      <Image
        src={content.imageUrl}
        alt={content.imageAlt}
        fill
        priority
        className="object-cover object-[center_30%]"
        sizes="100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <Container className="relative z-10 flex flex-col items-center px-5 py-10 text-center sm:py-16 md:py-24">
        <span className="mb-3 rounded-full border border-border bg-cream/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[1px] backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[1.1px]">
          {content.eyebrow}
        </span>
        <h1 className="font-serif text-[2rem] font-light leading-[1.15] tracking-[2px] text-white sm:text-5xl sm:tracking-[3.4px] md:text-[68px] md:leading-[74.8px]">
          {content.titleLine1}
          <br />
          <em className="text-gold-bright">{content.titleAccent}</em>
          <br />
          {content.titleLine2}
        </h1>
        <p className="mt-3 max-w-[18rem] text-sm font-light leading-relaxed text-white/90 sm:mt-6 sm:max-w-xl sm:text-lg md:text-[21px]">
          {content.subtitle}
        </p>
        <div className="relative z-20 mt-5 flex w-full max-w-xs flex-col gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
          <PillButton href={content.primaryCtaHref} variant="primary" className="w-full sm:w-auto">
            {content.primaryCtaLabel}
          </PillButton>
          <PillButton
            href={content.secondaryCtaHref}
            variant="outline"
            className="w-full border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
          >
            {content.secondaryCtaLabel}
          </PillButton>
        </div>
      </Container>
    </section>
  );
}
