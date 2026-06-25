"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfileMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean;
}

interface ProfileMenuSectionProps {
  title: string;
  items: ProfileMenuItem[];
}

export function ProfileMenuSection({ title, items }: ProfileMenuSectionProps) {
  return (
    <section className="mt-8 px-5">
      <h2 className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-sage">
        {title}
      </h2>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-4 transition-colors hover:bg-cream-warm/60",
                index > 0 && "border-t border-border/80",
              )}
            >
              <Icon className="size-5 shrink-0 text-ink/75" strokeWidth={1.5} />
              <span className="flex-1 text-sm text-ink">{item.label}</span>
              <div className="flex items-center gap-2">
                {item.badge ? (
                  <span className="size-2 rounded-full bg-violet-500" aria-hidden />
                ) : null}
                <ChevronRight className="size-4 text-sage" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
