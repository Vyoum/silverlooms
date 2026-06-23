import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/features/auth/actions";
import { canAccessAdmin } from "@/features/auth/lib/roles";
import { getSessionUser } from "@/features/auth/services/session";
import { createClient } from "@/lib/supabase/server";
import { isAuthConfigured } from "@/lib/supabase/env";
import { BRAND_NAME } from "@/lib/constants/brand";
import { Button } from "@/components/ui/button";

export async function AdminAccessPage() {
  if (!isAuthConfigured()) {
    redirect("/login?redirect=/admin");
  }

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login?redirect=/admin");
  }

  const dbUser = await getSessionUser();

  if (dbUser && canAccessAdmin(dbUser.role)) {
    redirect("/admin");
  }

  const email = dbUser?.email ?? authUser.email ?? "your account";
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-admin-canvas px-5 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-admin-border bg-admin-surface p-8 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-wider text-admin-muted">
          {BRAND_NAME} Admin
        </p>
        <h1 className="mt-2 font-serif text-3xl font-medium text-admin-ink">
          Admin access required
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-admin-muted">
          You&apos;re signed in as <span className="font-medium text-admin-ink">{email}</span>,
          but this account has customer access only. An admin or super admin role is needed
          to open the console.
        </p>

        <div className="mt-6 space-y-3 rounded-xl border border-admin-border bg-admin-canvas p-4 text-sm text-admin-muted">
          <p className="font-medium text-admin-ink">To get access locally:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Set{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-admin-ink">
                SUPER_ADMIN_EMAIL="{email}"
              </code>{" "}
              in <code className="rounded bg-white px-1.5 py-0.5">.env.local</code>
            </li>
            <li>Restart <code className="rounded bg-white px-1.5 py-0.5">npm run dev</code></li>
            <li>Sign out, then sign in again with that email</li>
          </ol>
          <p className="pt-1">
            Or run{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-admin-ink">
              npm run admin:promote -- {email}
            </code>{" "}
            after you&apos;ve signed in once.
          </p>
          {superAdminEmail ? (
            <p className="text-xs">
              Current <code>SUPER_ADMIN_EMAIL</code> is set to{" "}
              <span className="font-medium text-admin-ink">{superAdminEmail}</span>.
              {superAdminEmail.toLowerCase() !== email.toLowerCase()
                ? " It does not match your signed-in email."
                : " Sign out and sign in again to apply the role."}
            </p>
          ) : (
            <p className="text-xs text-amber-800">
              <code>SUPER_ADMIN_EMAIL</code> is not set in <code>.env.local</code> yet.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <form action={signOutAction}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-admin-primary px-4 text-sm font-medium text-white"
          >
            Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
