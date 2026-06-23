import Image from "next/image";
import type { HomepageBrandStoryContent } from "@/lib/site-content/types";
import { defaultHomepageContent } from "@/lib/site-content/defaults";
import { Container } from "@/components/layout/page-shell";

export function BrandStorySection({
  content = defaultHomepageContent.brandStory,
}: {
  content?: HomepageBrandStoryContent;
}) {
  return (
    <section className="border-b border-border">
      <div className="grid lg:grid-cols-2">
        <div className="flex items-center bg-cream px-8 py-20 md:px-16 lg:py-32">
          <blockquote className="max-w-md font-serif text-3xl font-light italic leading-relaxed text-ink md:text-4xl">
            &ldquo;{content.quote}&rdquo;
          </blockquote>
        </div>
        <div className="relative min-h-[500px] lg:min-h-[700px]">
          <Image
            src={content.imageUrl}
            alt={content.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute bottom-8 right-8 max-w-xs bg-cream/90 p-6 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[2.2px] text-forest">
              {content.captionEyebrow}
            </p>
            <p className="mt-1 font-serif text-lg italic text-ink">{content.captionTitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
