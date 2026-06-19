import Image from "next/image";
import { assets } from "@/lib/constants/assets";

export function JewelleryHero() {
  return (
    <section className="grid min-h-[480px] bg-ink lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-gradient-to-r from-ink via-ink/95 to-ink/80 px-8 py-16 md:px-16">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[2.2px] text-muted-light">
          Our Craft
        </p>
        <h1 className="font-serif text-5xl font-light leading-tight tracking-[2px] text-cream md:text-[68px] md:leading-[1.1]">
          German Silver
          <br />
          <em className="text-gold">&amp; Beyond</em>
        </h1>
        <p className="mt-6 max-w-md text-base font-light leading-relaxed text-cream-dark/80">
          Discover artisanal silver jewellery, meticulously handcrafted by master
          artisans in Jaipur. Each piece carries the legacy of traditional Indian
          silversmithing, reimagined for the modern connoisseur.
        </p>
        <div className="mt-8 flex flex-wrap gap-6 text-[10px] uppercase tracking-wider text-cream-dark">
          <span className="flex items-center gap-2">✦ 92.5 Silver Base</span>
          <span className="flex items-center gap-2">✦ Anti-Tarnish Finish</span>
        </div>
      </div>
      <div className="relative min-h-[400px] bg-[#1a1816]">
        <Image
          src={assets.hero.jewellery}
          alt="Layered silver necklaces editorial"
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </section>
  );
}
