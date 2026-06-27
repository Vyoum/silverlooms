import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPage } from "@/features/auth/components/login-page";
import { HOME_ROUTE, getPostLoginRedirect } from "@/lib/auth/routes";
import { noIndexMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Sign In",
  ...noIndexMetadata,
};

interface PageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  let isLoggedIn = false;

  if (isAuthConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    isLoggedIn = Boolean(user);

    if (user && !params.error) {
      redirect(getPostLoginRedirect(params.redirect));
    }
  }

  const redirectTo = params.redirect?.startsWith("/")
    ? params.redirect
    : HOME_ROUTE;

  return (
    <LoginPage
      redirectTo={redirectTo}
      error={params.error ? decodeURIComponent(params.error) : undefined}
      isLoggedIn={isLoggedIn}
    />
  );
}
