"use client";

import { useActionState, useState } from "react";
import {
  signInWithEmailAction,
  signUpWithEmailAction,
  type AuthActionResult,
} from "@/features/auth/actions";

const initialState: AuthActionResult = { success: false };

interface LoginFormProps {
  redirectTo: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const action = mode === "signin" ? signInWithEmailAction : signUpWithEmailAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div>
      {state.error && (
        <p
          className={`mb-6 rounded-lg px-4 py-3 text-sm ${
            state.success
              ? "border border-heritage-gold/30 bg-heritage-gold/10 text-heritage-gold"
              : "border border-red-400/30 bg-red-500/10 text-red-200"
          }`}
        >
          {state.error}
        </p>
      )}

      <form action={formAction} className="space-y-6 md:space-y-10">
        <input type="hidden" name="redirect" value={redirectTo} />

        <div className="relative pt-2">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email Address"
            className="peer w-full border-0 border-b border-white/20 bg-transparent px-0 py-2 text-base text-white transition-all placeholder-transparent focus:border-heritage-gold focus:ring-0"
          />
          <label
            htmlFor="email"
            className="pointer-events-none absolute left-0 top-4 text-base text-white/60 transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-heritage-gold peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest"
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
            className="peer w-full border-0 border-b border-white/20 bg-transparent px-0 py-2 text-base text-white transition-all placeholder-transparent focus:border-heritage-gold focus:ring-0"
          />
          <label
            htmlFor="password"
            className="pointer-events-none absolute left-0 top-4 text-base text-white/60 transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-heritage-gold peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest"
          >
            Password
          </label>
          {mode === "signin" && (
            <div className="absolute right-0 top-4">
              <button
                type="button"
                className="text-[10px] uppercase tracking-wider text-heritage-gold transition-colors hover:text-white"
              >
                Forgot?
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full bg-cream py-4 text-[12px] uppercase tracking-[0.15em] text-onyx transition-colors duration-500 hover:bg-heritage-gold active:scale-[0.98] disabled:opacity-60 md:mt-4 md:py-6 md:text-[13px]"
        >
          {pending ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-8 border-t border-white/5 pt-6 text-center md:mt-12 md:pt-8">
        <p className="text-sm text-white/80 md:text-base">
          {mode === "signin" ? "New to Silver Looms?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="ml-1 border-b border-white/20 font-bold text-white transition-all hover:border-heritage-gold"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
