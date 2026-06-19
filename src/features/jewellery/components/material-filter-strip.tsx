import { jewelleryMaterialFilters } from "@/lib/constants/navigation";
import { Container } from "@/components/layout/page-shell";

export function MaterialFilterStrip() {
  return (
    <section className="border-b border-white/10 bg-ink py-8">
      <Container>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {jewelleryMaterialFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className="w-48 shrink-0 rounded border border-white/10 px-[17px] py-[17px] text-left text-[11px] font-medium uppercase tracking-[1.65px] text-cream transition-colors hover:border-white/30"
            >
              {filter}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
