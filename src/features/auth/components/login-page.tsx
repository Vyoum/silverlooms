import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { GoogleSignInButton } from "./google-sign-in-button";
import { BRAND_NAME } from "@/lib/constants/brand";
import { isAuthConfigured } from "@/lib/supabase/env";

interface LoginPageProps {
  redirectTo?: string;
  error?: string;
}

export function LoginPage({ redirectTo = "/", error }: LoginPageProps) {
  const authConfigured = isAuthConfigured();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-cream text-ink selection:bg-heritage-gold/20">
      <main className="flex h-full flex-grow flex-col md:flex-row">
        <div className="relative hidden h-full overflow-hidden md:block md:w-[55%] lg:w-[60%]">
          <Image
            src="/images/login-hero.jpg"
            alt={`${BRAND_NAME} heritage editorial`}
            fill
            priority
            quality={95}
            className="object-cover object-center transition-transform duration-[3000ms] hover:scale-105"
            sizes="(max-width: 768px) 0vw, 60vw"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-onyx p-5 md:w-[45%] md:p-16 lg:w-[40%]">
          <div className="mt-auto w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="mb-12">
              <h1 className="font-serif text-[40px] leading-tight text-white md:text-[48px]">
                The Heritage Awaits
              </h1>
              <p className="mt-4 text-base text-white/80">
                Sign in to your {BRAND_NAME} account
              </p>
            </div>

            {!authConfigured ? (
              <p className="rounded-lg border border-heritage-gold/30 bg-white/5 px-4 py-3 text-sm text-white/80">
                Auth is not configured yet. Add{" "}
                <code className="text-heritage-gold">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-heritage-gold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                to your environment.
              </p>
            ) : (
              <>
                {error && (
                  <p className="mb-6 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </p>
                )}

                <GoogleSignInButton redirectTo={redirectTo} />

                <div className="relative flex items-center py-10">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="mx-4 shrink-0 text-xs uppercase tracking-widest text-white/40">
                    OR
                  </span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                <LoginForm redirectTo={redirectTo} />
              </>
            )}
          </div>

          <div className="mt-auto flex w-full max-w-[420px] justify-center gap-6 pb-4 pt-16">
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
      </main>
    </div>
  );
}
