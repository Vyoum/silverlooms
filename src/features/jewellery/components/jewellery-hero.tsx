import Image from "next/image";
import { assets } from "@/lib/constants/assets";
import { CategoryTabs } from "./category-tabs";

export function JewelleryHero() {
  return (
    <div className="bg-ink">
      <section className="grid min-h-[480px] lg:grid-cols-[55%_45%]">
        <div className="flex flex-col justify-center border-white/10 bg-gradient-to-r from-ink via-ink/95 to-ink/80 px-8 py-12 md:border-r md:px-16 md:py-16">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[2.2px] text-[#c1c7cf]">
            Our Craft
          </p>
          <h1 className="font-serif text-[42px] font-light leading-[1.1] tracking-[2px] text-cream md:text-[68px] md:leading-[74.8px] md:tracking-[3.4px]">
            German Silver
            <br />
            <em className="text-gold">&amp; Beyond</em>
          </h1>
          <p className="mt-6 max-w-md text-base font-light leading-[1.6] text-[rgba(228,226,221,0.8)]">
            Discover artisanal silver jewellery, meticulously handcrafted by master
            artisans in Jaipur. Each piece carries the legacy of traditional Indian
            silversmithing, reimagined for the modern connoisseur.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.5px] text-[#e4e2dd]">
            <span className="flex items-center gap-2">✦ 92.5 Silver Base</span>
            <span className="flex items-center gap-2">✦ Anti-Tarnish Finish</span>
          </div>
        </div>
        <div className="relative min-h-[320px] bg-[#1a1816] lg:min-h-[480px]">
          <Image
            src={assets.hero.jewellery}
            alt="Layered silver necklaces editorial"
            fill
            className="object-cover opacity-80"
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority
          />
        </div>
      </section>
      <CategoryTabs />
    </div>
  );
}
