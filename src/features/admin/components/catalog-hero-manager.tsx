"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import {
  updateCatalogHeroAction,
  type CategoryActionResult,
} from "@/features/admin/actions/category-actions";
import type { ApparelCatalogHeroes } from "@/lib/site-content/catalog-hero";
import type { ProductSort } from "@/features/catalog/lib/product-sort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: CategoryActionResult = { success: false };

const sortViews: { sort: ProductSort; label: string }[] = [
  { sort: "all", label: "All apparel (/kurtis)" },
  { sort: "bestseller", label: "Best sellers" },
  { sort: "new", label: "New arrivals" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
      {children}
    </label>
  );
}

function CatalogHeroCard({
  sort,
  label,
  hero,
}: {
  sort: ProductSort;
  label: string;
  hero: ApparelCatalogHeroes[ProductSort];
}) {
  const [state, formAction, pending] = useActionState(
    updateCatalogHeroAction,
    initialState,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <form
      action={formAction}
      className="rounded-xl border border-admin-border bg-white p-4"
    >
      <input type="hidden" name="sort" value={sort} />
      <input type="hidden" name="imageUrl" value={hero.imageUrl} />

      <p className="mb-3 text-sm font-medium text-admin-ink">{label}</p>

      <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg bg-admin-canvas">
          <Image
            src={previewUrl ?? hero.imageUrl}
            alt={hero.title}
            fill
            unoptimized={Boolean(previewUrl)}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
      </div>

      <div className="space-y-3">
        <div>
          <FieldLabel>Eyebrow</FieldLabel>
          <Input name="eyebrow" defaultValue={hero.eyebrow} />
        </div>
        <div>
          <FieldLabel>Title</FieldLabel>
          <Input name="title" defaultValue={hero.title} />
        </div>
        <div>
          <FieldLabel>Subtitle</FieldLabel>
          <Input name="subtitle" defaultValue={hero.subtitle} />
        </div>
        <div>
          <FieldLabel>Background photo</FieldLabel>
          <Input
            name="heroImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setPreviewUrl((current) => {
                  if (current) URL.revokeObjectURL(current);
                  return null;
                });
                return;
              }
              setPreviewUrl((current) => {
                if (current) URL.revokeObjectURL(current);
                return URL.createObjectURL(file);
              });
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save banner"}
        </Button>
        {state.success ? (
          <span className="text-xs text-emerald-700">Saved.</span>
        ) : null}
        {state.error ? <span className="text-xs text-red-600">{state.error}</span> : null}
      </div>
    </form>
  );
}

export function CatalogHeroManager({ heroes }: { heroes: ApparelCatalogHeroes }) {
  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-medium text-admin-ink">
          Apparel catalog banners
        </h2>
        <p className="mt-1 text-sm text-admin-muted">
          Edit the large background photo and headline on the kurtis page — including
          the main Collections banner you see at the top of /kurtis.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {sortViews.map(({ sort, label }) => (
          <CatalogHeroCard
            key={sort}
            sort={sort}
            label={label}
            hero={heroes[sort]}
          />
        ))}
      </div>
    </section>
  );
}
