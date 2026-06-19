import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/constants/assets";
import { Container } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";

const fabrics = [
  { name: "Cotton", image: assets.fabrics.cotton },
  { name: "Lawn Cotton", image: assets.fabrics.lawnCotton },
  { name: "Shiffon", image: assets.fabrics.mulmulCotton },
  { name: "Jaipur Fabric", image: assets.fabrics.jaipurFabric },
];

export function FabricSection() {
  return (
    <section className="border-b border-border py-20">
      <Container>
        <SectionHeading
          title="Shop By Fabric"
          subtitle="Explore our curated collections woven from the finest natural fabrics, each telling its own story of texture and tradition."
          className="mb-12"
        />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {fabrics.map((fabric) => (
            <Link
              key={fabric.name}
              href="/kurtis"
              className="group relative aspect-[270/360] overflow-hidden"
            >
              <Image
                src={fabric.image}
                alt={fabric.name}
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
