"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { AccountNavButton } from "@/features/auth/components/account-nav-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchDialog } from "@/components/layout/search-dialog";
import { siteNavLinks, buildMobileNavSections, mobileNavSections } from "@/lib/constants/navigation";
import { isNavLinkActive } from "@/lib/navigation/is-nav-link-active";
import { useStoreCategories } from "@/features/catalog/store-categories-provider";
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
        "whitespace-nowrap text-[13px] uppercase tracking-[1.3px] transition-colors",
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
  const searchParams = useSearchParams();
  const [hash, setHash] = useState("");
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const navLinks = siteNavLinks;
  const isDark = variant === "jewellery";
  const isHome = variant === "home";

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  const search = useMemo(() => {
    const value = searchParams.toString();
    return value ? `?${value}` : "";
  }, [searchParams]);

  const storeCategories = useStoreCategories();
  const navSections = useMemo(() => {
    const apparel = storeCategories.filter(
      (category) => category.kind === "APPAREL" && category.showInCatalogFilter,
    );
    return apparel.length > 0
      ? buildMobileNavSections(apparel)
      : mobileNavSections;
  }, [storeCategories]);

  const isLinkActive = (href: string) =>
    isNavLinkActive(href, pathname, search, hash);

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
        {/* Left: hamburger (mobile) + logo (desktop) */}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <MobileNav sections={navSections} isDark={isDark} />
          <BrandLogo
            size="sm"
            className="hidden md:inline-flex md:h-10 lg:h-12"
            priority={isHome}
          />
        </div>

        {/* Center: logo on mobile, nav links on desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <BrandLogo size="sm" priority={isHome} />
        </div>

        {/* Center: all primary nav links (desktop) */}
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 md:flex lg:gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={isLinkActive(link.href)}
              isDark={isDark}
            />
          ))}
        </nav>

        {/* Right: search, account, wishlist, cart */}
        <div className="flex flex-1 items-center justify-end gap-4 md:gap-5">
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
