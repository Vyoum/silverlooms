"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Gem,
  LayoutDashboard,
  ShoppingBag,
  Store,
  Tag,
  UserCog,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/constants/brand";
import { adminNavItems } from "../lib/admin-nav";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  "shopping-bag": ShoppingBag,
  users: Users,
  "user-cog": UserCog,
  "file-text": FileText,
  store: Store,
  tag: Tag,
  gem: Gem,
};

interface AdminSidebarProps {
  userName: string;
  userRoleLabel: string;
  showUsersNav?: boolean;
}

export function AdminSidebar({
  userName,
  userRoleLabel,
  showUsersNav = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const initials = userName
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  const navItems = adminNavItems.filter(
    (item) => !("superAdminOnly" in item && item.superAdminOnly) || showUsersNav,
  );

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-admin-border bg-admin-surface">
      <div className="px-8 pb-4 pt-8">
        <h1 className="font-serif text-[22px] font-medium leading-tight text-admin-ink">
          {BRAND_NAME}
        </h1>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[1.65px] text-admin-muted">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
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
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-admin-ink">{userName}</p>
            <p className="text-[11px] text-admin-muted">{userRoleLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
