"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import {
  updateCategoryAction,
  type CategoryActionResult,
} from "@/features/admin/actions/category-actions";
import type { StoreCategory } from "@/features/catalog/lib/store-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: CategoryActionResult = { success: false };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
      {children}
    </label>
  );
}

export function CategoryEditor({ category }: { category: StoreCategory }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateCategoryAction,
    initialState,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-admin-primary hover:underline"
      >
        <Pencil className="size-3.5" />
        Edit
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-admin-border bg-admin-canvas p-4">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={category.id} />
        <input type="hidden" name="slug" value={category.slug} />
        <input type="hidden" name="heroImageUrl" value={category.heroImageUrl ?? ""} />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" defaultValue={category.name} required />
          </div>
          <div>
            <FieldLabel>Type</FieldLabel>
            <select
              name="kind"
              defaultValue={category.kind}
              className="h-10 w-full rounded-lg border border-admin-border bg-white px-3 text-sm text-admin-ink outline-none focus:border-admin-primary"
            >
              <option value="APPAREL">Apparel</option>
              <option value="JEWELLERY">Jewellery</option>
            </select>
          </div>
          <div>
            <FieldLabel>Sort order</FieldLabel>
            <Input
              name="sortOrder"
              type="number"
              defaultValue={category.sortOrder}
              min={0}
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <FieldLabel>Match keywords (comma-separated)</FieldLabel>
            <Input
              name="keywords"
              defaultValue={category.keywords.join(", ")}
              placeholder={category.name.toLowerCase()}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-admin-ink">
            <input
              type="checkbox"
              name="showInMarquee"
              defaultChecked={category.showInMarquee}
            />
            Show in homepage marquee
          </label>
          <label className="flex items-center gap-2 text-sm text-admin-ink">
            <input
              type="checkbox"
              name="showInCatalogFilter"
              defaultChecked={category.showInCatalogFilter}
            />
            Show in catalog filter
          </label>
        </div>

        <div className="border-t border-admin-border pt-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-admin-muted">
            Category hero (apparel /kurtis filter)
          </p>

          {category.heroImageUrl || previewUrl ? (
            <div className="relative mb-3 aspect-[16/9] max-w-xs overflow-hidden rounded-lg">
              <Image
                src={previewUrl ?? category.heroImageUrl!}
                alt={category.name}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Hero title</FieldLabel>
              <Input
                name="heroTitle"
                defaultValue={category.heroTitle ?? category.name}
                placeholder={category.name}
              />
            </div>
            <div>
              <FieldLabel>Hero subtitle</FieldLabel>
              <Input
                name="heroSubtitle"
                defaultValue={category.heroSubtitle ?? ""}
                placeholder={`Shop ${category.name.toLowerCase()}`}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Background photo</FieldLabel>
              <Input
                name="heroImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    setPreviewUrl(null);
                    return;
                  }
                  setPreviewUrl(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-admin-muted hover:text-admin-ink"
          >
            Close
          </button>
          {state.success ? (
            <span className="text-xs text-emerald-700">Saved.</span>
          ) : null}
          {state.error ? <span className="text-xs text-red-600">{state.error}</span> : null}
        </div>
      </form>
    </div>
  );
}
