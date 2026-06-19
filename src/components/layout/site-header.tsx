"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { mainNavLinks, homeNavLinks } from "@/lib/constants/navigation";
import { useCart } from "@/features/cart/cart-provider";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  variant?: "home" | "default" | "jewellery";
  className?: string;
}

export function SiteHeader({ variant = "default", className }: SiteHeaderProps) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const navLinks = variant === "home" ? homeNavLinks : mainNavLinks;
  const isDark = variant === "jewellery";

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        isDark
          ? "border-b border-white/10 bg-ink/90 backdrop-blur-[6px]"
          : "glass-nav",
        className,
      )}
    >
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
                      "text-[13px] uppercase tracking-[1.3px] transition-colors",
                      isDark
                        ? isActive
                          ? "border-b border-forest-light pb-0.5 text-[#cbecbd]"
                          : "text-cream-dark/90 hover:text-cream"
                        : isActive
                          ? "border-b border-ink pb-0.5 text-ink"
                          : "text-ink hover:text-forest",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/"
              className={cn(
                "absolute left-1/2 -translate-x-1/2 font-serif font-light tracking-[1.26px]",
                isDark
                  ? "text-[28px] text-cream md:text-[42px] md:leading-[50.4px]"
                  : "text-2xl tracking-[2px] text-ink md:text-[28px]",
              )}
            >
              {isDark ? "Silver Looms" : "SILVER LOOMS"}
            </Link>
            <div className="hidden w-[387px] md:block" />
          </>
        )}

        <div className="flex items-center gap-4 md:gap-5">
          <button
            type="button"
            aria-label="Search"
            className={isDark ? "text-cream-dark" : "text-ink"}
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className={cn("hidden sm:block", isDark ? "text-cream-dark" : "text-ink")}
          >
            <User className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Wishlist"
            className={cn("hidden sm:block", isDark ? "text-cream-dark" : "text-ink")}
          >
            <Heart className="size-5" />
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className={cn("relative", isDark ? "text-cream-dark" : "text-ink")}
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[10px] text-cream">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
