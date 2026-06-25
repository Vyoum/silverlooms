import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { LoginForm } from "./login-form";
import { GoogleSignInButton } from "./google-sign-in-button";
import { signOutAction } from "@/features/auth/actions";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants/brand";
import { assets } from "@/lib/constants/assets";
import { HOME_ROUTE } from "@/lib/auth/routes";
import { isAuthConfigured } from "@/lib/supabase/env";

interface LoginPageProps {
  redirectTo?: string;
  error?: string;
  isLoggedIn?: boolean;
}

export function LoginPage({
  redirectTo = HOME_ROUTE,
  error,
  isLoggedIn = false,
}: LoginPageProps) {
  const authConfigured = isAuthConfigured();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink text-ink selection:bg-heritage-gold/20">
      <Image
        src={assets.auth.loginHero}
        alt=""
        fill
        priority
        quality={90}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/80 via-ink/55 to-forest/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(197,163,103,0.18),transparent_45%)]" />

      <main className="relative z-10 flex min-h-dvh flex-col lg:flex-row">
        <section className="flex flex-1 flex-col justify-between px-6 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-12 lg:px-16 lg:py-12">
          <BrandLogo
            size="lg"
            showName
            href="/"
            priority
            nameClassName="text-cream"
          />

          <div className="mt-auto hidden max-w-lg lg:block">
            <p className="font-serif text-4xl leading-tight text-cream xl:text-5xl">
              {BRAND_TAGLINE}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
              Handcrafted apparel and silver jewellery from the looms and
              ateliers of Jaipur.
            </p>
          </div>
        </section>

        <section className="flex w-full items-center justify-center px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 lg:w-[min(100%,520px)] lg:shrink-0 lg:px-10 lg:py-12 xl:w-[560px]">
          <div className="w-full max-w-[420px] rounded-2xl border border-cream/20 bg-cream/95 p-6 shadow-2xl shadow-ink/20 backdrop-blur-md sm:p-8">
            <div className="mb-8 text-center lg:text-left">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-forest">
                Welcome back
              </p>
              <h1 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-sage">
                Access your {BRAND_NAME} account
              </p>
            </div>

            {!authConfigured ? (
              <p className="rounded-lg border border-heritage-gold/30 bg-heritage-gold/10 px-4 py-3 text-sm text-ink/80">
                Auth is not configured yet. Add{" "}
                <code className="text-forest">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-forest">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                to your environment.
              </p>
            ) : (
              <>
                {error && (
                  <p className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                {isLoggedIn && error ? (
                  <form action={signOutAction} className="mb-5">
                    <button
                      type="submit"
                      className="text-[11px] uppercase tracking-wider text-forest underline underline-offset-2"
                    >
                      Sign out and try a different account
                    </button>
                  </form>
                ) : null}

                <GoogleSignInButton redirectTo={redirectTo} variant="light" />

                <div className="relative flex items-center py-6">
                  <div className="flex-grow border-t border-ink/10" />
                  <span className="mx-4 shrink-0 text-[10px] uppercase tracking-widest text-sage">
                    Or
                  </span>
                  <div className="flex-grow border-t border-ink/10" />
                </div>

                <LoginForm redirectTo={redirectTo} variant="light" />
              </>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">
              <Link
                href="/"
                className="text-[10px] uppercase tracking-widest text-sage transition-colors hover:text-forest"
              >
                Back to shop
              </Link>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-[10px] uppercase tracking-widest text-sage transition-colors hover:text-forest"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-[10px] uppercase tracking-widest text-sage transition-colors hover:text-forest"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
