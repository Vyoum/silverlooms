"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import {
  getWishlistAction,
  syncGuestWishlistAction,
  toggleWishlistAction,
} from "@/features/wishlist/actions";
import { createClient } from "@/lib/supabase/client";
import { isAuthConfigured } from "@/lib/supabase/env";
import { WISHLIST_STORAGE_KEY } from "./lib/constants";

interface WishlistContextValue {
  slugs: string[];
  itemCount: number;
  authenticated: boolean;
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string, productName?: string) => void;
  isPending: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readGuestSlugs(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeGuestSlugs(slugs: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(slugs));
}

function clearGuestSlugs() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
}

interface WishlistProviderProps {
  children: React.ReactNode;
  initialSlugs?: string[];
  initialAuthenticated?: boolean;
}

export function WishlistProvider({
  children,
  initialSlugs = [],
  initialAuthenticated = false,
}: WishlistProviderProps) {
  const [slugs, setSlugs] = useState<string[]>(initialSlugs);
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [ready, setReady] = useState(initialAuthenticated);
  const [isPending, startTransition] = useTransition();

  const syncGuestWishlist = useCallback(async () => {
    const guestSlugs = readGuestSlugs();
    if (guestSlugs.length === 0) {
      const state = await getWishlistAction();
      setSlugs(state.slugs);
      setAuthenticated(state.authenticated);
      setReady(true);
      return;
    }

    const result = await syncGuestWishlistAction(guestSlugs);
    clearGuestSlugs();
    setSlugs(result.slugs);
    setAuthenticated(result.authenticated);
    setReady(true);
  }, []);

  useEffect(() => {
    if (initialAuthenticated) {
      setReady(true);
      return;
    }

    if (!isAuthConfigured()) {
      setSlugs(readGuestSlugs());
      setReady(true);
      return;
    }

    const supabase = createClient();

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        void syncGuestWishlist();
      } else {
        setSlugs(readGuestSlugs());
        setAuthenticated(false);
        setReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        void syncGuestWishlist();
        return;
      }

      if (event === "SIGNED_OUT") {
        setSlugs(readGuestSlugs());
        setAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [initialAuthenticated, syncGuestWishlist]);

  useEffect(() => {
    if (!ready || authenticated) return;
    writeGuestSlugs(slugs);
  }, [slugs, ready, authenticated]);

  const isWishlisted = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs],
  );

  const toggleWishlist = useCallback(
    (slug: string, productName?: string) => {
      startTransition(async () => {
        const result = await toggleWishlistAction(slug);

        if (result.ok) {
          setSlugs(result.slugs);
          setAuthenticated(true);
          toast.success(
            result.added
              ? productName
                ? `${productName} saved to wishlist`
                : "Saved to wishlist"
              : productName
                ? `${productName} removed from wishlist`
                : "Removed from wishlist",
          );
          return;
        }

        if (!result.ok && "requiresAuth" in result && result.requiresAuth) {
          setSlugs((current) => {
            const exists = current.includes(slug);
            const next = exists
              ? current.filter((item) => item !== slug)
              : [...current, slug];

            toast.success(
              exists
                ? productName
                  ? `${productName} removed from wishlist`
                  : "Removed from wishlist"
                : productName
                  ? `${productName} saved locally — sign in to sync`
                  : "Saved locally — sign in to sync to your account",
            );

            return next;
          });
          return;
        }

        if (!result.ok) {
          toast.error("error" in result ? result.error : "Could not update wishlist.");
        }
      });
    },
    [],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      slugs,
      itemCount: slugs.length,
      authenticated,
      isWishlisted,
      toggleWishlist,
      isPending,
    }),
    [slugs, authenticated, isWishlisted, toggleWishlist, isPending],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
