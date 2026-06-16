import Image from "next/image";
import { assets } from "@/lib/constants/assets";
import { Container, PillButton } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";

const styles = [
  {
    name: "Threads of Paradise",
    image: assets.styles.threadsOfParadise,
    href: "/kurtis",
  },
  {
    name: "Midnight Kari Grace",
    image: assets.styles.midnightKariGrace,
    href: "/kurtis",
  },
  {
    name: "Whispers of Charm",
    image: assets.styles.whispersOfCharm,
    href: "/kurtis",
  },
];

export function StyleSection() {
  return (
    <section id="shop-by-style" className="border-b border-border py-20">
      <Container>
        <SectionHeading title="Shop By Styles" className="mb-12" />
        <div className="grid gap-6 md:grid-cols-3">
          {styles.map((style) => (
            <article key={style.name} className="flex flex-col items-center text-center">
              <div className="relative mb-6 aspect-[368/460] w-full overflow-hidden">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="mb-4 font-serif text-xl text-ink">{style.name}</h3>
              <PillButton href={style.href} variant="ghost">
                Explore
              </PillButton>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
