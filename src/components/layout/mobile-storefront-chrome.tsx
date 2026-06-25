"use client";

import { usePathname } from "next/navigation";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { cn } from "@/lib/utils";

const HIDDEN_PATH_PREFIXES = ["/login", "/admin", "/auth", "/checkout"];

function shouldHideMobileChrome(pathname: string) {
  return HIDDEN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function MobileStorefrontChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showTabBar = !shouldHideMobileChrome(pathname);

  return (
    <div className={cn(showTabBar && "pb-24 md:pb-0")}>
      {children}
      {showTabBar ? <MobileTabBar /> : null}
    </div>
  );
}
