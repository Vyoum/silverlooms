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
}

export function AccountNavButton({ isDark }: AccountNavButtonProps) {
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

  if (!ready) {
    return (
      <span className={cn("inline-flex", iconClass)} aria-hidden>
        <User className="size-5 opacity-40" />
      </span>
    );
  }

  if (loggedIn) {
    const isAccountPage = pathname === ACCOUNT_ROUTE;

    return (
      <Link
        href={ACCOUNT_ROUTE}
        aria-label="My account"
        title="My account"
        className={cn(
          iconClass,
          isAccountPage &&
            "border-b border-heritage-gold pb-0.5 text-heritage-gold",
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
        ? "/login"
        : `/login?redirect=${encodeURIComponent(pathname)}`;

  return (
    <Link
      href={loginHref}
      aria-label="Sign in"
      title="Sign in"
      className={iconClass}
    >
      <User className="size-5" />
    </Link>
  );
}
