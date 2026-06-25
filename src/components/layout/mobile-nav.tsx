"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AccountNavButton } from "@/features/auth/components/account-nav-button";
import type { MobileNavSection } from "@/lib/constants/navigation";
import { isNavLinkActive } from "@/lib/navigation/is-nav-link-active";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  sections: readonly MobileNavSection[];
  isDark?: boolean;
}

export function MobileNav({ sections, isDark }: MobileNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const isLinkActive = (href: string) =>
    isNavLinkActive(href, pathname, search, hash);

  const menuOverlay =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex md:hidden"
            role="presentation"
          >
            <nav
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className={cn(
                "flex h-full w-[min(88vw,340px)] shrink-0 flex-col shadow-2xl",
                isDark
                  ? "border-r border-white/10 bg-ink text-cream"
                  : "border-r border-border bg-cream text-ink",
              )}
            >
              <div
                className={cn(
                  "flex h-20 shrink-0 items-center justify-between px-5",
                  isDark ? "border-b border-white/10" : "border-b border-border",
                )}
              >
                <span className="font-serif text-lg tracking-[1px]">
                  {isDark ? "Silver Looms" : "SILVER LOOMS"}
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className={cn(isDark ? "text-cream-dark" : "text-sage")}
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {sections.map((section) => (
                  <div key={section.title} className="mb-6 last:mb-2">
                    <p
                      className={cn(
                        "mb-2 px-4 text-[10px] font-medium uppercase tracking-[1.65px]",
                        isDark ? "text-cream-dark/60" : "text-sage",
                      )}
                    >
                      {section.title}
                    </p>
                    <ul className="flex flex-col gap-1">
                      {section.links.map((link) => {
                        const active = isLinkActive(link.href);
                        return (
                          <li key={`${section.title}-${link.href}`}>
                            <Link
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "block rounded-lg px-4 py-2.5 text-sm uppercase tracking-[1.2px] transition-colors",
                                isDark
                                  ? active
                                    ? "bg-white/10 text-[#cbecbd]"
                                    : "text-cream-dark/90 hover:bg-white/5 hover:text-cream"
                                  : active
                                    ? "bg-ink/5 font-medium text-ink"
                                    : "text-sage hover:bg-ink/5 hover:text-ink",
                              )}
                            >
                              {link.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div
                className={cn(
                  "shrink-0 border-t p-5",
                  isDark ? "border-white/10" : "border-border",
                )}
              >
                <AccountNavButton
                  isDark={isDark}
                  variant="menu-item"
                  onNavigate={() => setOpen(false)}
                />
              </div>
            </nav>

            <button
              type="button"
              aria-label="Close menu"
              className="h-full flex-1 bg-ink/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex items-center justify-center md:hidden",
          isDark ? "text-cream-dark" : "text-ink",
        )}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {menuOverlay}
    </>
  );
}
