import Image from "next/image";
import { assets } from "@/lib/constants/assets";
import { CategoryTabs } from "./category-tabs";

export function JewelleryHero() {
  return (
    <div className="bg-ink">
      <section className="grid lg:min-h-[480px] lg:grid-cols-[55%_45%]">
        <div className="flex flex-col justify-center border-white/10 bg-gradient-to-r from-ink via-ink/95 to-ink/80 px-5 pt-4 pb-6 sm:px-8 sm:py-12 md:border-r md:px-16 md:py-16">
          <p className="mb-3 hidden text-[10px] font-medium uppercase tracking-[2.2px] text-[#c1c7cf] sm:mb-4 sm:block sm:text-[11px]">
            Our Craft
          </p>
          <h1 className="font-serif text-[2rem] font-light leading-[1.1] tracking-[1px] text-cream sm:text-[42px] sm:tracking-[2px] md:text-[68px] md:leading-[74.8px] md:tracking-[3.4px]">
            German Silver
            <br />
            <em className="text-gold">&amp; Beyond</em>
          </h1>
          <p className="mt-4 max-w-md text-sm font-light leading-[1.6] text-[rgba(228,226,221,0.8)] sm:mt-6 sm:text-base">
            Discover artisanal silver jewellery, meticulously handcrafted by master
            artisans in Jaipur.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.5px] text-[#e4e2dd] sm:mt-8 sm:gap-6">
            <span className="flex items-center gap-2">✦ German Silver</span>
            <span className="flex items-center gap-2">✦ Anti-Tarnish Finish</span>
          </div>
        </div>
        <div className="relative h-[min(32dvh,220px)] min-h-[180px] bg-[#1a1816] sm:h-[240px] lg:min-h-[480px] lg:h-auto">
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
