import {
  PlusCircle,
  Sparkles,
  Tag,
  UserPlus,
} from "lucide-react";
import { quickActions } from "../lib/mock-data";

const iconMap = {
  "plus-circle": PlusCircle,
  "user-plus": UserPlus,
  sparkles: Sparkles,
  tag: Tag,
};

export function QuickActions() {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <h3 className="mb-5 font-serif text-xl font-medium text-admin-ink">
        Quick Actions
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon as keyof typeof iconMap];
          return (
            <button
              key={action.label}
              type="button"
              className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-admin-border bg-admin-canvas text-[11px] font-medium uppercase tracking-wider text-admin-muted transition-colors hover:border-admin-primary hover:text-admin-primary"
            >
              <Icon className="size-6" />
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
