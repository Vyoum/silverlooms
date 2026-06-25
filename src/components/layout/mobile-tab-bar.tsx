"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Grid2x2,
  Hand,
  Home,
  Search,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Collections", href: "/kurtis", icon: Grid2x2 },
  { label: "Search", href: "/search", icon: Search },
  { label: "Artisans", href: "/#editorial", icon: Hand },
  { label: "Account", href: "/account", icon: User },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    if (base === "/") return pathname === "/";
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-cream/95 backdrop-blur-md md:hidden"
      aria-label="Mobile tab navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-[10px] uppercase tracking-[0.08em]",
                active ? "text-ink" : "text-sage",
              )}
            >
              <Icon className={cn("size-5", active && "stroke-[2.5px]")} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
