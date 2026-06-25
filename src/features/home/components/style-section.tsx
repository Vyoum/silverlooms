import Image from "next/image";
import { Container, PillButton } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import type { HomepageStyleTile } from "@/lib/site-content/types";

export function StyleSection({ styles }: { styles: HomepageStyleTile[] }) {
  return (
    <section id="shop-by-style" className="border-b border-border py-20">
      <Container>
        <SectionHeading title="Shop By Styles" className="mb-12" />
        <div className="grid gap-6 md:grid-cols-3">
          {styles.map((style) => (
            <article key={style.name} className="flex flex-col items-center text-center">
              <div className="relative mb-6 aspect-[368/460] w-full overflow-hidden">
                <Image
                  src={style.imageUrl}
                  alt={style.imageAlt}
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
