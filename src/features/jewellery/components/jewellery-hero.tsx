import Image from "next/image";
import { assets } from "@/lib/constants/assets";
import { Container } from "@/components/layout/page-shell";

export function JewelleryHero() {
  return (
    <section className="grid min-h-[480px] lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-cream px-8 py-16 md:px-16">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[2.2px] text-forest">
          Our Craft
        </p>
        <h1 className="font-serif text-5xl font-light leading-tight text-ink md:text-6xl">
          German Silver,
          <br />
          Timeless Grace
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-sage">
          Handcrafted anti-tarnish jewellery inspired by Rajasthani heritage.
          Each piece is designed to complement your ethnic wardrobe with
          understated elegance.
        </p>
        <div className="mt-8 flex flex-wrap gap-6 text-[11px] uppercase tracking-wider text-sage">
          <span className="flex items-center gap-2">✦ Anti-Tarnish</span>
          <span className="flex items-center gap-2">✦ Handcrafted</span>
        </div>
      </div>
      <div className="relative min-h-[400px]">
        <Image
          src={assets.hero.jewellery}
          alt="Layered silver necklaces editorial"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
