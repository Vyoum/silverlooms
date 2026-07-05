import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import type { HomepageShopByFabricContent } from "@/lib/site-content/types";

export function FabricSection({ content }: { content: HomepageShopByFabricContent }) {
  return (
    <section className="border-b border-border py-20">
      <Container>
        <SectionHeading
          title={content.title}
          subtitle={content.subtitle}
          className="mb-12"
        />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {content.fabrics.map((fabric) => (
            <Link
              key={fabric.name}
              href={fabric.href}
              className="group relative aspect-[270/360] overflow-hidden"
            >
              <Image
                src={fabric.imageUrl}
                alt={fabric.imageAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
              <h3 className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-white">
                {fabric.name}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
