import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { assets } from "@/lib/constants/assets";
import { Container } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/shared/section-heading";

const articles = [
  {
    tag: "Craftsmanship • 5 min read",
    title: "The Jaipur Craft Journey",
    description:
      "Explore the intricate process of block printing and zardozi embroidery that brings our heritage collections to life in the heart of Rajasthan.",
    image: assets.editorial.jaipurCraft,
  },
  {
    tag: "Style Guide • 4 min read",
    title: "Styling Silver for Summer",
    description:
      "Discover how to pair tactile fabrics with our signature German silver and anti-tarnish jewellery pieces for a breezy, elevated summer aesthetic.",
    image: assets.editorial.stylingSilver,
  },
];

export function GoodReadsSection() {
  return (
    <section id="good-reads" className="border-b border-border bg-cream py-20">
      <Container>
        <SectionHeading
          title="Good Reads"
          subtitle="Stories of craftsmanship, styling tips, and the heritage behind our collections."
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.title}
              href="#"
              className="group flex flex-col"
            >
              <div className="relative mb-6 aspect-[564/317] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <p className="mb-3 text-[11px] uppercase tracking-[1.65px] text-sage">
                {article.tag}
              </p>
              <h3 className="mb-3 font-serif text-[28px] leading-[42px] text-ink">
                {article.title}
              </h3>
              <p className="text-base leading-6 text-sage">{article.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
