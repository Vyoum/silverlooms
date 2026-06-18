"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavItems } from "../lib/mock-data";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "shopping-bag": ShoppingBag,
  users: Users,
  "file-text": FileText,
  store: Store,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-admin-border bg-admin-surface">
      <div className="px-8 pb-4 pt-8">
        <h1 className="font-serif text-[22px] font-medium leading-tight text-admin-ink">
          Silver Looms
        </h1>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[1.65px] text-admin-muted">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {adminNavItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-12 items-center gap-3 rounded-xl px-4 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-admin-primary/10 text-admin-primary"
                  : "text-admin-muted hover:bg-admin-canvas hover:text-admin-ink",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-admin-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-admin-primary/15 font-serif text-sm text-admin-primary">
            SL
          </div>
          <div>
            <p className="text-[13px] font-medium text-admin-ink">Admin</p>
            <p className="text-[11px] text-admin-muted">Brand Owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
