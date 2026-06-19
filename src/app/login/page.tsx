import type { Metadata } from "next";
import { LoginPage } from "@/features/auth/components/login-page";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: `Sign In | ${BRAND_NAME}`,
};

interface PageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect?.startsWith("/") ? params.redirect : "/";

  return (
    <LoginPage
      redirectTo={redirectTo}
      error={params.error ? decodeURIComponent(params.error) : undefined}
    />
  );
}
