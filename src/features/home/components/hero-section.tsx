import Image from "next/image";
import { assets } from "@/lib/constants/assets";
import { Container, PillButton } from "@/components/layout/page-shell";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[600px] max-h-[900px] items-center justify-center overflow-hidden">
      <Image
        src={assets.hero.home}
        alt="Woman in premium terracotta Anarkali suit"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/20" />
      <Container className="relative z-10 flex flex-col items-center py-24 text-center">
        <span className="mb-6 rounded-full border border-border bg-cream/80 px-4 py-2 text-[11px] font-medium uppercase tracking-[1.1px] backdrop-blur-sm">
          The Heritage Collection
        </span>
        <h1 className="font-serif text-5xl font-light leading-tight tracking-[3.4px] text-white md:text-[68px] md:leading-[74.8px]">
          The Art of
          <br />
          <em className="text-gold-bright">Wearing</em>
          <br />
          India
        </h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/90 md:text-[21px]">
          Discover a curated selection of artisanal apparel and exquisite silver
          jewellery, crafted for the modern aesthete.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <PillButton href="/kurtis" variant="primary">
            Shop Apparel
          </PillButton>
          <PillButton href="/jewellery" variant="outline">
            Shop Jewellery
          </PillButton>
        </div>
      </Container>
    </section>
  );
}
