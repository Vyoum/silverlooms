"use client";

import { useActionState, useEffect, useState } from "react";
import {
  signInWithEmailAction,
  signUpWithEmailAction,
  type AuthActionResult,
} from "@/features/auth/actions";
import { cn } from "@/lib/utils";

const initialState: AuthActionResult = { success: false };

interface LoginFormProps {
  redirectTo: string;
  variant?: "light" | "dark";
}

export function LoginForm({ redirectTo, variant = "dark" }: LoginFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [origin, setOrigin] = useState("");
  const action = mode === "signin" ? signInWithEmailAction : signUpWithEmailAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const isLight = variant === "light";

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div>
      {state.error && (
        <p
          className={cn(
            "mb-6 rounded-lg px-4 py-3 text-sm",
            state.success
              ? isLight
                ? "border border-heritage-gold/40 bg-heritage-gold/10 text-forest"
                : "border border-heritage-gold/30 bg-heritage-gold/10 text-heritage-gold"
              : isLight
                ? "border border-red-300 bg-red-50 text-red-700"
                : "border border-red-400/30 bg-red-500/10 text-red-200",
          )}
        >
          {state.error}
        </p>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="siteOrigin" value={origin} readOnly />
        <input type="hidden" name="redirect" value={redirectTo} />

        <div className="relative pt-2">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email Address"
            className={cn(
              "peer w-full border-0 border-b bg-transparent px-0 py-2 text-base transition-all placeholder-transparent focus:ring-0",
              isLight
                ? "border-ink/20 text-ink focus:border-forest"
                : "border-white/20 text-white focus:border-heritage-gold",
            )}
          />
          <label
            htmlFor="email"
            className={cn(
              "pointer-events-none absolute left-0 top-4 text-base transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest",
              isLight
                ? "text-sage peer-focus:text-forest peer-[:not(:placeholder-shown)]:text-sage"
                : "text-white/60 peer-focus:text-heritage-gold peer-[:not(:placeholder-shown)]:text-white/60",
            )}
          >
            Email Address
          </label>
        </div>

        <div className="relative pt-2">
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password"
            className={cn(
              "peer w-full border-0 border-b bg-transparent px-0 py-2 text-base transition-all placeholder-transparent focus:ring-0",
              isLight
                ? "border-ink/20 text-ink focus:border-forest"
                : "border-white/20 text-white focus:border-heritage-gold",
            )}
          />
          <label
            htmlFor="password"
            className={cn(
              "pointer-events-none absolute left-0 top-4 text-base transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest",
              isLight
                ? "text-sage peer-focus:text-forest peer-[:not(:placeholder-shown)]:text-sage"
                : "text-white/60 peer-focus:text-heritage-gold peer-[:not(:placeholder-shown)]:text-white/60",
            )}
          >
            Password
          </label>
          {mode === "signin" && (
            <div className="absolute right-0 top-4">
              <button
                type="button"
                className={cn(
                  "text-[10px] uppercase tracking-wider transition-colors",
                  isLight
                    ? "text-forest hover:text-ink"
                    : "text-heritage-gold hover:text-white",
                )}
              >
                Forgot?
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={pending || !origin}
          className={cn(
            "mt-2 w-full py-4 text-[12px] uppercase tracking-[0.15em] transition-colors duration-300 active:scale-[0.98] disabled:opacity-60 md:py-5 md:text-[13px]",
            isLight
              ? "bg-forest text-cream hover:bg-ink"
              : "bg-cream text-onyx hover:bg-heritage-gold",
          )}
        >
          {pending ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div
        className={cn(
          "mt-8 border-t pt-6 text-center",
          isLight ? "border-ink/10" : "border-white/5",
        )}
      >
        <p className={cn("text-sm", isLight ? "text-sage" : "text-white/80")}>
          {mode === "signin" ? "New to Silver Looms?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className={cn(
              "ml-1 border-b font-medium transition-all",
              isLight
                ? "border-ink/20 text-ink hover:border-forest"
                : "border-white/20 text-white hover:border-heritage-gold",
            )}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
