import Link from "next/link";
import {
  FileText,
  Gem,
  Package,
  Shirt,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";

const panels = [
  {
    title: "Apparel Products",
    description: "Add kurtis and apparel, upload photos, edit prices and stock.",
    href: "/admin/store",
    icon: Shirt,
    accent: "border-admin-primary/30 hover:border-admin-primary",
  },
  {
    title: "Jewellery Products",
    description: "Manage German silver jewellery listings, images, and inventory.",
    href: "/admin/jewellery",
    icon: Gem,
    accent: "border-[#1c1a16]/40 hover:border-gold",
  },
  {
    title: "Categories",
    description: "Add Shirts, Bags, Leheriya, Bandhej, and more for filters & marquee.",
    href: "/admin/categories",
    icon: Tag,
    accent: "border-admin-primary/30 hover:border-admin-primary",
  },
  {
    title: "Homepage Content",
    description: "Edit hero, jewellery catalog banner, editorial copy, quote & portrait image, and banners.",
    href: "/admin/content",
    icon: FileText,
    accent: "border-admin-primary/30 hover:border-admin-primary",
  },
  {
    title: "Orders & Commerce",
    description: "View orders, update fulfillment status, and track payments.",
    href: "/admin/commerce",
    icon: ShoppingBag,
    accent: "border-admin-primary/30 hover:border-admin-primary",
  },
  {
    title: "Reviews",
    description: "See customer reviews across your catalogue.",
    href: "/admin/community",
    icon: Users,
    accent: "border-admin-primary/30 hover:border-admin-primary",
  },
  {
    title: "Analytics Overview",
    description: "Revenue, pending orders, and low-stock alerts below.",
    href: "#analytics",
    icon: Package,
    accent: "border-admin-border hover:border-admin-muted",
  },
] as const;

export function ManagementHub() {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-5">
        <h2 className="font-serif text-2xl font-medium text-admin-ink">
          Store Management
        </h2>
        <p className="mt-1 text-sm text-admin-muted">
          Add products, upload images, edit homepage content, and manage orders.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {panels.map((panel) => {
          const Icon = panel.icon;
          return (
            <Link
              key={panel.href}
              href={panel.href}
              className={`group rounded-xl border bg-admin-canvas p-5 transition-colors ${panel.accent}`}
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-admin-primary/10 text-admin-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-medium text-admin-ink">{panel.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-admin-muted">
                {panel.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
