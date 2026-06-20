"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  isDark?: boolean;
}

export function SearchDialog({ isDark }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const submitSearch = () => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const iconClass = cn(isDark ? "text-cream-dark" : "text-ink");

  return (
    <>
      <button
        type="button"
        aria-label="Search products"
        className={iconClass}
        onClick={() => setOpen(true)}
      >
        <Search className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-24">
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-cream p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-ink">Search</h2>
              <button
                type="button"
                aria-label="Close"
                className="text-sage hover:text-ink"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              className="flex gap-3"
            >
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search kurtis, jewellery, collections…"
                className="h-12 flex-1 rounded-full border border-border bg-white px-5 text-sm text-ink outline-none ring-forest/30 placeholder:text-sage focus:ring-2"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={query.trim().length < 2}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-forest px-6 text-[11px] font-medium uppercase tracking-[1.1px] text-cream transition-opacity disabled:opacity-40"
              >
                <Search className="size-4" />
                Search
              </button>
            </form>

            <p className="mt-4 text-xs text-sage">
              Try &ldquo;silver&rdquo;, &ldquo;kurti&rdquo;, or &ldquo;necklace&rdquo;
            </p>
          </div>
        </div>
      )}
    </>
  );
}
