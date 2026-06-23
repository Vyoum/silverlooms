import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { GoogleSignInButton } from "./google-sign-in-button";
import { BRAND_NAME } from "@/lib/constants/brand";
import { ACCOUNT_ROUTE } from "@/lib/auth/routes";
import { isAuthConfigured } from "@/lib/supabase/env";

interface LoginPageProps {
  redirectTo?: string;
  error?: string;
}

export function LoginPage({ redirectTo = ACCOUNT_ROUTE, error }: LoginPageProps) {
  const authConfigured = isAuthConfigured();

  return (
    <div className="min-h-dvh bg-onyx text-white selection:bg-heritage-gold/20">
      <main className="flex min-h-dvh flex-col md:flex-row">
        <div className="relative hidden min-h-dvh md:block md:w-[55%] lg:w-[60%]">
          <Image
            src="/images/login-hero.jpg"
            alt={`${BRAND_NAME} heritage editorial`}
            fill
            priority
            quality={95}
            className="object-cover object-center"
            sizes="(max-width: 768px) 0vw, 60vw"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="flex min-h-dvh w-full flex-col md:w-[45%] lg:w-[40%]">
          <div className="flex items-center justify-between px-5 pb-2 pt-[max(1rem,env(safe-area-inset-top))] md:hidden">
            <Link
              href="/"
              className="font-serif text-lg tracking-[1px] text-white"
            >
              SILVER LOOMS
            </Link>
            <Link
              href="/"
              className="text-[10px] uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
            >
              Back
            </Link>
          </div>

          <div className="flex flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 md:justify-center md:px-16 md:py-12">
            <div className="mx-auto w-full max-w-[420px] md:my-auto">
              <div className="mb-8 md:mb-12">
                <h1 className="font-serif text-[2rem] leading-tight text-white sm:text-[2.25rem] md:text-[48px]">
                  The Heritage Awaits
                </h1>
                <p className="mt-3 text-sm text-white/80 sm:text-base">
                  Sign in to your {BRAND_NAME} account
                </p>
              </div>

              {!authConfigured ? (
                <p className="rounded-lg border border-heritage-gold/30 bg-white/5 px-4 py-3 text-sm text-white/80">
                  Auth is not configured yet. Add{" "}
                  <code className="text-heritage-gold">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                  and{" "}
                  <code className="text-heritage-gold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                  to your environment.
                </p>
              ) : (
                <>
                  {error && (
                    <p className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </p>
                  )}

                  <GoogleSignInButton redirectTo={redirectTo} />

                  <div className="relative flex items-center py-6 md:py-10">
                    <div className="flex-grow border-t border-white/10" />
                    <span className="mx-4 shrink-0 text-[10px] uppercase tracking-widest text-white/40 sm:text-xs">
                      OR
                    </span>
                    <div className="flex-grow border-t border-white/10" />
                  </div>

                  <LoginForm redirectTo={redirectTo} />
                </>
              )}
            </div>

            <div className="mx-auto mt-10 flex w-full max-w-[420px] justify-center gap-6 md:mt-16">
              <Link
                href="#"
                className="text-[10px] uppercase tracking-widest text-white/40 transition-colors hover:text-white"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-[10px] uppercase tracking-widest text-white/40 transition-colors hover:text-white"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
