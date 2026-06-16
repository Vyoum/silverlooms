import Image from "next/image";
import { assets } from "@/lib/constants/assets";
import { Container } from "@/components/layout/page-shell";

export function CategoryHero() {
  return (
    <section className="relative h-[280px] overflow-hidden bg-[#f0eee9]">
      <Image
        src={assets.hero.kurtis}
        alt="Kurtis and Sets collection"
        fill
        className="object-cover mix-blend-multiply opacity-90"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
      <Container className="relative flex h-full flex-col justify-end pb-10">
        <h1 className="font-serif text-[42px] font-light leading-[50.4px] text-white">
          Kurtis & Sets
        </h1>
        <p className="mt-2 text-base text-cream-dark/90">
          142 styles · New arrivals every week
        </p>
      </Container>
    </section>
  );
}
