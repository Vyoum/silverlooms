import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { HomepageEditorialContent } from "@/lib/site-content/types";
import { defaultHomepageContent } from "@/lib/site-content/defaults";
import { Container, TextLink } from "@/components/layout/page-shell";

export function EditorialSection({
  content = defaultHomepageContent.editorial,
}: {
  content?: HomepageEditorialContent;
}) {
  return (
    <section id="editorial" className="border-b border-border bg-cream-warm py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="max-w-lg">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[2.2px] text-forest">
              {content.eyebrow}
            </p>
            <h2 className="font-serif text-[42px] font-light leading-[50.4px] tracking-wide text-ink">
              {content.title}
            </h2>
            <p className="mt-6 text-base font-light leading-[28.8px] text-sage">
              {content.body}
            </p>
            <TextLink href={content.linkHref} className="mt-8 inline-flex">
              {content.linkText}
              <ArrowRight className="size-4" />
            </TextLink>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-sm">
            <Image
              src={content.imageUrl}
              alt={content.imageAlt}
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
