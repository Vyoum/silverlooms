import { signOutAction } from "@/features/auth/actions";
import { isAuthConfigured } from "@/lib/supabase/env";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  className?: string;
  isDark?: boolean;
}

export function SignOutButton({ className, isDark }: SignOutButtonProps) {
  if (!isAuthConfigured()) {
    return (
      <button
        type="button"
        aria-label="Account"
        className={cn("hidden sm:block", className, isDark ? "text-cream-dark" : "text-ink")}
      >
        <User className="size-5" />
      </button>
    );
  }

  return (
    <form action={signOutAction} className="hidden sm:block">
      <button
        type="submit"
        aria-label="Sign out"
        title="Sign out"
        className={cn(className, isDark ? "text-cream-dark" : "text-ink")}
      >
        <User className="size-5" />
      </button>
    </form>
  );
}
