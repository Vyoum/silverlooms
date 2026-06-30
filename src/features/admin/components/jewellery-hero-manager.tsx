"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import {
  updateJewelleryHeroAction,
  type ContentActionResult,
} from "@/features/admin/actions/content-actions";
import type { JewelleryHeroContent } from "@/lib/site-content/jewellery-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ContentActionResult = { success: false };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
      {children}
    </label>
  );
}

export function JewelleryHeroManager({ hero }: { hero: JewelleryHeroContent }) {
  const [state, formAction, pending] = useActionState(
    updateJewelleryHeroAction,
    initialState,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <section className="rounded-2xl border border-admin-border bg-admin-surface p-6">
      <div className="mb-6">
        <h2 className="font-serif text-xl font-medium text-admin-ink">
          Jewellery catalog hero
        </h2>
        <p className="mt-1 text-sm text-admin-muted">
          Edit the large photo and headline at the top of /jewellery — the German
          Silver hero banner customers see before category tabs.
        </p>
      </div>

      <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <input type="hidden" name="imageUrl" value={hero.imageUrl} />

        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-admin-canvas lg:aspect-[3/4]">
          <Image
            src={previewUrl ?? hero.imageUrl}
            alt={hero.imageAlt}
            fill
            unoptimized={Boolean(previewUrl)}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>

        <div className="space-y-4">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <Input name="eyebrow" defaultValue={hero.eyebrow} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Title line 1</FieldLabel>
              <Input name="titleLine1" defaultValue={hero.titleLine1} />
            </div>
            <div>
              <FieldLabel>Title accent</FieldLabel>
              <Input name="titleAccent" defaultValue={hero.titleAccent} />
            </div>
          </div>
          <div>
            <FieldLabel>Description</FieldLabel>
            <Input name="description" defaultValue={hero.description} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Highlight 1</FieldLabel>
              <Input name="highlightOne" defaultValue={hero.highlightOne} />
            </div>
            <div>
              <FieldLabel>Highlight 2</FieldLabel>
              <Input name="highlightTwo" defaultValue={hero.highlightTwo} />
            </div>
          </div>
          <div>
            <FieldLabel>Image alt text</FieldLabel>
            <Input name="imageAlt" defaultValue={hero.imageAlt} />
          </div>
          <div>
            <FieldLabel>Hero background photo</FieldLabel>
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

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save jewellery hero"}
            </Button>
            {state.success ? (
              <span className="text-xs text-emerald-700">Saved.</span>
            ) : null}
            {state.error ? <span className="text-xs text-red-600">{state.error}</span> : null}
          </div>
        </div>
      </form>
    </section>
  );
}
