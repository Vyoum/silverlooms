"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { AccountNavButton } from "@/features/auth/components/account-nav-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchDialog } from "@/components/layout/search-dialog";
import { mainNavLinks, homeNavLinks } from "@/lib/constants/navigation";
import { useCart } from "@/features/cart/cart-provider";
import { useWishlist } from "@/features/wishlist/wishlist-provider";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  variant?: "home" | "default" | "jewellery";
  className?: string;
}

function NavLink({
  href,
  label,
  isActive,
  isDark,
}: {
  href: string;
  label: string;
  isActive: boolean;
  isDark: boolean;
}) {
  return (
    <Link
      href={href}
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
      {label}
    </Link>
  );
}

export function SiteHeader({ variant = "default", className }: SiteHeaderProps) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const navLinks = variant === "home" ? homeNavLinks : mainNavLinks;
  const isDark = variant === "jewellery";
  const isHome = variant === "home";

  const isLinkActive = (href: string) => {
    const baseHref = href.split("?")[0].split("#")[0];
    return (
      pathname === baseHref ||
      (baseHref !== "/" && pathname.startsWith(baseHref))
    );
  };

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
      <div className="relative mx-auto flex h-20 max-w-[1280px] items-center px-4 md:px-16">
        <div className="flex min-w-0 flex-1 items-center">
          <MobileNav links={navLinks} isDark={isDark} />
          <nav className="hidden items-center gap-8 md:flex">
            {(isHome ? navLinks.slice(0, 2) : navLinks).map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isLinkActive(link.href)}
                isDark={isDark}
              />
            ))}
          </nav>
        </div>

        <Link
          href="/"
          className={cn(
            "absolute left-1/2 -translate-x-1/2 shrink-0 font-serif font-light",
            isDark
              ? "text-xl tracking-[1.26px] text-cream md:text-[42px] md:leading-[50.4px]"
              : "text-2xl tracking-[2px] text-ink md:text-[28px]",
          )}
        >
          {isDark ? "Silver Looms" : "SILVER LOOMS"}
        </Link>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-4 md:gap-5">
          {isHome && (
            <nav className="mr-2 hidden items-center gap-8 md:flex">
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
          )}

          <SearchDialog isDark={isDark} />
          <div className="hidden md:inline-flex">
            <AccountNavButton isDark={isDark} />
          </div>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className={cn("relative", isDark ? "text-cream-dark" : "text-ink")}
          >
            <Heart className="size-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex size-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[10px] text-cream">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
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
