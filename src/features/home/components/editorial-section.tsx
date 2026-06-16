import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { assets } from "@/lib/constants/assets";
import { Container, TextLink } from "@/components/layout/page-shell";

export function EditorialSection() {
  return (
    <section id="editorial" className="border-b border-border bg-cream-warm py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="max-w-lg">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[2.2px] text-forest">
              The Editorial Edit
            </p>
            <h2 className="font-serif text-[42px] font-light leading-[50.4px] tracking-wide text-ink">
              Curated <em className="italic">Elegance</em> for the Modern Soul
            </h2>
            <p className="mt-6 text-base font-light leading-[28.8px] text-sage">
              Our editorial collections are a testament to the enduring beauty of
              Indian craftsmanship. Each piece is selected not just for its aesthetic
              appeal, but for the story it tells—a narrative of heritage, patience, and
              the pursuit of perfection.
            </p>
            <TextLink href="/kurtis" className="mt-8 inline-flex">
              View the Lookbook
              <ArrowRight className="size-4" />
            </TextLink>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-sm">
            <Image
              src={assets.editorial.lookbook}
              alt="Editorial fashion showcase"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
