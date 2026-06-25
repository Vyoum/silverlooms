import Image from "next/image";
import type { HomepageBrandStoryContent } from "@/lib/site-content/types";

export function BrandStorySectionPreview({
  content,
}: {
  content: HomepageBrandStoryContent;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-admin-border bg-cream">
      <p className="border-b border-admin-border bg-admin-canvas px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-admin-muted">
        Homepage preview — quote & portrait block
      </p>
      <div className="grid lg:grid-cols-2">
        <div className="flex items-center px-6 py-10 md:px-10 lg:py-16">
          <blockquote className="max-w-md font-serif text-xl font-light italic leading-relaxed text-ink md:text-2xl">
            &ldquo;{content.quote}&rdquo;
          </blockquote>
        </div>
        <div className="relative min-h-[280px] lg:min-h-[360px]">
          <Image
            src={content.imageUrl}
            alt={content.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute bottom-4 right-4 max-w-[200px] bg-cream/90 p-4 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[2px] text-forest">
              {content.captionEyebrow}
            </p>
            <p className="mt-1 font-serif text-base italic text-ink">
              {content.captionTitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
