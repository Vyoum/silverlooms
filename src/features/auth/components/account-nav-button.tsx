"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ACCOUNT_ROUTE } from "@/lib/auth/routes";
import { isAuthConfigured } from "@/lib/supabase/env";
import { cn } from "@/lib/utils";

interface AccountNavButtonProps {
  isDark?: boolean;
  variant?: "icon" | "menu-item";
  onNavigate?: () => void;
  className?: string;
}

export function AccountNavButton({
  isDark,
  variant = "icon",
  onNavigate,
  className,
}: AccountNavButtonProps) {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthConfigured()) {
      setLoggedIn(false);
      setReady(true);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(Boolean(data.user));
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session?.user));
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const iconClass = cn(isDark ? "text-cream-dark" : "text-ink");

  const menuItemClass = cn(
    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm uppercase tracking-[1.3px] transition-colors",
    isDark
      ? "text-cream-dark/90 hover:bg-white/5 hover:text-cream"
      : "text-sage hover:bg-ink/5 hover:text-ink",
    pathname === ACCOUNT_ROUTE &&
      (isDark ? "bg-white/10 text-[#cbecbd]" : "bg-ink/5 font-medium text-ink"),
    className,
  );

  if (!ready) {
    if (variant === "menu-item") {
      return (
        <span
          className={cn(menuItemClass, "opacity-40")}
          aria-hidden
        >
          <User className="size-4" />
          Account
        </span>
      );
    }

    return (
      <span className={cn("inline-flex", iconClass, className)} aria-hidden>
        <User className="size-5 opacity-40" />
      </span>
    );
  }

  if (loggedIn) {
    const isAccountPage = pathname === ACCOUNT_ROUTE;

    if (variant === "menu-item") {
      return (
        <Link
          href={ACCOUNT_ROUTE}
          aria-label="My profile"
          onClick={onNavigate}
          className={menuItemClass}
        >
          <User className="size-4" />
          My Profile
        </Link>
      );
    }

    return (
      <Link
        href={ACCOUNT_ROUTE}
        aria-label="My profile"
        title="My profile"
        className={cn(
          iconClass,
          isAccountPage &&
            "border-b border-heritage-gold pb-0.5 text-heritage-gold",
          className,
        )}
      >
        <User className="size-5" />
      </Link>
    );
  }

  const loginHref =
    pathname === "/login"
      ? "/login"
      : pathname === ACCOUNT_ROUTE
        ? `/login?redirect=${encodeURIComponent(ACCOUNT_ROUTE)}`
        : `/login?redirect=${encodeURIComponent(pathname)}`;

  if (variant === "menu-item") {
    return (
      <Link
        href={loginHref}
        aria-label="Sign in"
        onClick={onNavigate}
        className={menuItemClass}
      >
        <User className="size-4" />
        Sign In
      </Link>
    );
  }

  return (
    <Link
      href={loginHref}
      aria-label="Sign in"
      title="Sign in"
      className={cn(iconClass, className)}
    >
      <User className="size-5" />
    </Link>
  );
}
