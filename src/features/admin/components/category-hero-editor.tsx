"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import {
  updateCategoryHeroAction,
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

export function CategoryHeroEditor({ category }: { category: StoreCategory }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateCategoryHeroAction,
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
        Edit hero
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-admin-border bg-admin-canvas p-4">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={category.id} />
        <input type="hidden" name="slug" value={category.slug} />
        <input type="hidden" name="heroImageUrl" value={category.heroImageUrl ?? ""} />

        {category.heroImageUrl || previewUrl ? (
          <div className="relative aspect-[16/9] max-w-xs overflow-hidden rounded-lg">
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

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save hero"}
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
