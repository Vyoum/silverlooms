import Link from "next/link";
import { ExternalLink, Gem, PlusCircle, Shirt, Tag } from "lucide-react";

export function QuickActions() {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <h3 className="mb-5 font-serif text-xl font-medium text-admin-ink">
        Quick Actions
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/store#add-product"
          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-admin-border bg-admin-canvas text-[11px] font-medium uppercase tracking-wider text-admin-muted transition-colors hover:border-admin-primary hover:text-admin-primary"
        >
          <Shirt className="size-6" />
          Add Apparel
        </Link>
        <Link
          href="/admin/jewellery#add-product"
          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-admin-border bg-[#1c1a16] text-[11px] font-medium uppercase tracking-wider text-white/70 transition-colors hover:border-gold hover:text-gold"
        >
          <Gem className="size-6" />
          Add Jewellery
        </Link>
        <Link
          href="/admin/store"
          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-admin-border bg-admin-canvas text-[11px] font-medium uppercase tracking-wider text-admin-muted transition-colors hover:border-admin-primary hover:text-admin-primary"
        >
          <Tag className="size-6" />
          Manage Apparel
        </Link>
        <Link
          href="/admin/jewellery"
          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-admin-border bg-admin-canvas text-[11px] font-medium uppercase tracking-wider text-admin-muted transition-colors hover:border-admin-primary hover:text-admin-primary"
        >
          <PlusCircle className="size-6" />
          Manage Jewellery
        </Link>
        <Link
          href="/kurtis"
          target="_blank"
          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-admin-border bg-admin-canvas text-[11px] font-medium uppercase tracking-wider text-admin-muted transition-colors hover:border-admin-primary hover:text-admin-primary sm:col-span-2 lg:col-span-2"
        >
          <ExternalLink className="size-6" />
          View Kurtis Storefront
        </Link>
        <Link
          href="/jewellery"
          target="_blank"
          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#1c1a16] bg-[#1c1a16] text-[11px] font-medium uppercase tracking-wider text-white/70 transition-colors hover:border-gold hover:text-gold sm:col-span-2 lg:col-span-2"
        >
          <ExternalLink className="size-6" />
          View Jewellery Storefront
        </Link>
      </div>
    </section>
  );
}
