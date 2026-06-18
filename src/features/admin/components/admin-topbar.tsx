import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminTopbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-admin-border bg-admin-surface px-8">
      <p className="text-[11px] font-medium uppercase tracking-[1.65px] text-admin-muted">
        Dashboard
      </p>

      <div className="flex items-center gap-4">
        <div className="relative hidden w-80 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-admin-muted" />
          <Input
            placeholder="Search orders, artisans, products..."
            className="h-10 rounded-xl border-admin-border bg-admin-canvas pl-10 text-sm"
          />
        </div>

        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-xl border border-admin-border text-admin-muted transition-colors hover:text-admin-ink"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-admin-error" />
        </button>

        <div className="size-8 rounded-full bg-gradient-to-br from-admin-primary to-[#8B4513]" />
      </div>
    </header>
  );
}
