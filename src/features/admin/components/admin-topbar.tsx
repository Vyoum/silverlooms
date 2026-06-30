export function AdminTopbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-admin-border bg-admin-surface px-8">
      <p className="text-[11px] font-medium uppercase tracking-[1.65px] text-admin-muted">
        Dashboard
      </p>

      <div className="flex items-center">
        <div className="size-8 rounded-full bg-gradient-to-br from-admin-primary to-[#8B4513]" />
      </div>
    </header>
  );
}
