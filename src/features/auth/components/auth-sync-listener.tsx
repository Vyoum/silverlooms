"use client";

import { useEffect } from "react";
import { ensureUserSyncedAction } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { isAuthConfigured } from "@/lib/supabase/env";

/**
 * Mirrors Supabase Auth users into Prisma after Google OAuth and session refresh.
 * Server layout sync alone can miss users when callback cookies are not persisted.
 */
export function AuthSyncListener() {
  useEffect(() => {
    if (!isAuthConfigured()) return;

    const supabase = createClient();

    const syncUser = () => {
      void ensureUserSyncedAction().then((result) => {
        if (!result.ok) {
          console.error("[auth] User sync failed:", result.error);
        }
      });
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        syncUser();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session?.user &&
        (event === "SIGNED_IN" ||
          event === "INITIAL_SESSION" ||
          event === "TOKEN_REFRESHED")
      ) {
        syncUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
