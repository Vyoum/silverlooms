import { CalendarDays } from "lucide-react";

export function WelcomeStrip() {
  const today = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="flex flex-col justify-between gap-4 rounded-2xl border border-admin-border bg-admin-surface p-6 sm:flex-row sm:items-center">
      <div>
        <h2 className="font-serif text-2xl font-medium text-admin-ink">
          Good morning, Admin.
        </h2>
        <p className="mt-1 text-sm text-admin-muted">
          Here&apos;s how Silver Looms is doing today.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-admin-canvas px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-admin-muted">
        <CalendarDays className="size-4" />
        {today}
      </div>
    </section>
  );
}
