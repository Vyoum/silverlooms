"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { mainNavLinks, homeNavLinks } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  variant?: "home" | "default";
  cartCount?: number;
}

export function SiteHeader({ variant = "default", cartCount = 2 }: SiteHeaderProps) {
  const pathname = usePathname();
  const navLinks = variant === "home" ? homeNavLinks : mainNavLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 md:px-16">
        {variant === "home" ? (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] uppercase tracking-[1.3px] text-ink transition-colors hover:text-forest"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/"
              className="font-serif text-2xl font-light tracking-[2px] text-ink md:text-[28px]"
            >
              SILVER LOOMS
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] uppercase tracking-[1.3px] text-ink transition-colors hover:text-forest"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </>
        ) : (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => {
                const baseHref = link.href.split("?")[0].split("#")[0];
                const isActive =
                  pathname === baseHref ||
                  (baseHref !== "/" && pathname.startsWith(baseHref));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-[13px] uppercase tracking-[1.3px] transition-colors hover:text-forest",
                      isActive
                        ? "border-b border-ink pb-0.5 text-ink"
                        : "text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl font-light tracking-[2px] text-ink"
            >
              SILVER LOOMS
            </Link>
            <div className="hidden w-[387px] md:block" />
          </>
        )}

        <div className="flex items-center gap-4 md:gap-5">
          <button type="button" aria-label="Search" className="text-ink">
            <Search className="size-5" />
          </button>
          <button type="button" aria-label="Account" className="hidden text-ink sm:block">
            <User className="size-5" />
          </button>
          <button type="button" aria-label="Wishlist" className="hidden text-ink sm:block">
            <Heart className="size-5" />
          </button>
          <Link href="/cart" aria-label="Cart" className="relative text-ink">
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-forest text-[10px] text-cream">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
