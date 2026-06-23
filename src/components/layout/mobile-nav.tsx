"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AccountNavButton } from "@/features/auth/components/account-nav-button";
import { cn } from "@/lib/utils";

interface MobileNavLink {
  label: string;
  href: string;
}

interface MobileNavProps {
  links: readonly MobileNavLink[];
  isDark?: boolean;
}

export function MobileNav({ links, isDark }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  const isLinkActive = (href: string) => {
    const baseHref = href.split("?")[0].split("#")[0];
    if (!baseHref || baseHref === "/") {
      return pathname === "/" && !href.includes("#");
    }
    return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center md:hidden",
          isDark ? "text-cream-dark" : "text-ink",
        )}
      >
        <Menu className="size-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className={cn(
              "relative z-10 flex h-full w-[min(85vw,320px)] flex-col shadow-2xl",
              isDark
                ? "border-r border-white/10 bg-ink text-cream"
                : "border-r border-border bg-cream text-ink",
            )}
          >
            <div
              className={cn(
                "flex h-20 items-center justify-between px-5",
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

            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto p-5">
              {links.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-sm uppercase tracking-[1.3px] transition-colors",
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

            <div
              className={cn(
                "mt-auto border-t p-5",
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
        </div>
      )}
    </>
  );
}
