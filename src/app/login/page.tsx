import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginPage } from "@/features/auth/components/login-page";
import { ACCOUNT_ROUTE, getPostLoginRedirect } from "@/lib/auth/routes";
import { BRAND_NAME } from "@/lib/constants/brand";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: `Sign In | ${BRAND_NAME}`,
};

interface PageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  if (isAuthConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect(getPostLoginRedirect(params.redirect));
    }
  }

  const redirectTo = params.redirect?.startsWith("/")
    ? params.redirect
    : ACCOUNT_ROUTE;

  return (
    <LoginPage
      redirectTo={redirectTo}
      error={params.error ? decodeURIComponent(params.error) : undefined}
    />
  );
}
