import Link from "next/link";
import { PlusCircle, Tag } from "lucide-react";

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
          <PlusCircle className="size-6" />
          Add Product
        </Link>
        <Link
          href="/admin/store"
          className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-admin-border bg-admin-canvas text-[11px] font-medium uppercase tracking-wider text-admin-muted transition-colors hover:border-admin-primary hover:text-admin-primary"
        >
          <Tag className="size-6" />
          Manage Store
        </Link>
      </div>
    </section>
  );
}
