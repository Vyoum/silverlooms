import Image from "next/image";
import { assets } from "@/lib/constants/assets";
import { Container } from "@/components/layout/page-shell";

export function BrandStorySection() {
  return (
    <section className="border-b border-border">
      <div className="grid lg:grid-cols-2">
        <div className="flex items-center bg-cream px-8 py-20 md:px-16 lg:py-32">
          <blockquote className="max-w-md font-serif text-3xl font-light italic leading-relaxed text-ink md:text-4xl">
            &ldquo;Every thread carries the whispers of generations—woven with patience,
            worn with pride.&rdquo;
          </blockquote>
        </div>
        <div className="relative min-h-[500px] lg:min-h-[700px]">
          <Image
            src={assets.editorial.brandStory}
            alt="Editorial fashion portrait"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute bottom-8 right-8 max-w-xs bg-cream/90 p-6 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[2.2px] text-forest">
              Threads of Paradise
            </p>
            <p className="mt-1 font-serif text-lg italic text-ink">
              Midnight Kari Grace
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
