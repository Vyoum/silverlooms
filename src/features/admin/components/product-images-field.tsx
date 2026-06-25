"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImagePlus, X } from "lucide-react";
import { imagePresets, type ProductType } from "@/features/admin/lib/product-presets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ProductImageItem = {
  id: string;
  url: string;
  file?: File;
};

function createId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toProductImageItems(imageUrl: string, galleryImageUrls: string[] = []) {
  return buildUniqueImageList(imageUrl, galleryImageUrls).map((url) => ({
    id: createId(),
    url,
  }));
}

export function buildUniqueImageList(imageUrl: string, galleryImageUrls: string[] = []) {
  const images = [imageUrl, ...galleryImageUrls]
    .map((url) => url.trim())
    .filter(Boolean);

  return images.filter((url, index) => images.indexOf(url) === index);
}

interface ProductImagesFieldProps {
  items: ProductImageItem[];
  onChange: (items: ProductImageItem[]) => void;
  productType: ProductType;
}

export function ProductImagesField({
  items,
  onChange,
  productType,
}: ProductImagesFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  function addFiles(files: FileList | File[]) {
    const nextFiles = Array.from(files);
    if (nextFiles.length === 0) return;

    const additions = nextFiles.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(previewUrl);
      return { id: createId(), url: previewUrl, file };
    });

    onChange([...items, ...additions]);
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    onChange(next);
  }

  function addPresetUrl(url: string) {
    if (items.some((item) => item.url === url && !item.file)) return;
    onChange([...items, { id: createId(), url }]);
  }

  const persistedUrls = items.filter((item) => !item.file).map((item) => item.url);
  const galleryManifest = items.map((item) =>
    item.file ? { type: "file" as const } : { type: "url" as const, url: item.url },
  );

  return (
    <div className="space-y-4">
      <input type="hidden" name="imageUrls" value={JSON.stringify(persistedUrls)} />
      <input type="hidden" name="galleryManifest" value={JSON.stringify(galleryManifest)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
            }
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
          Add photos
        </Button>
        <p className="text-xs text-admin-muted">
          First photo is the cover image. Add multiple for the product carousel.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-xl border border-admin-border bg-admin-canvas"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={item.url}
                  alt={`Product photo ${index + 1}`}
                  fill
                  unoptimized={item.url.startsWith("blob:")}
                  className="object-cover"
                  sizes="240px"
                />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-full bg-admin-primary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                    Cover
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                  aria-label={`Remove photo ${index + 1}`}
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-admin-border px-2 py-1.5">
                <span className="text-[10px] uppercase tracking-wider text-admin-muted">
                  Photo {index + 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                    className="rounded p-1 text-admin-muted hover:bg-white disabled:opacity-30"
                    aria-label="Move photo earlier"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 1)}
                    className="rounded p-1 text-admin-muted hover:bg-white disabled:opacity-30"
                    aria-label="Move photo later"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <label
          className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-admin-border bg-admin-canvas px-6 py-8 text-center transition-colors hover:border-admin-primary/50"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (event.dataTransfer.files.length > 0) {
              addFiles(event.dataTransfer.files);
            }
          }}
        >
          <ImagePlus className="mb-3 size-8 text-admin-muted" />
          <span className="text-sm font-medium text-admin-ink">
            Drop photos here or click Add photos
          </span>
          <span className="mt-1 text-xs text-admin-muted">
            JPG, PNG, or WebP up to 5 MB each
          </span>
        </label>
      )}

      <div>
        <p className="mb-2 text-xs text-admin-muted">Or add a preset / image URL</p>
        <div className="mb-2 flex flex-wrap gap-2">
          {imagePresets[productType].map((preset) => (
            <button
              key={preset.url}
              type="button"
              onClick={() => addPresetUrl(preset.url)}
              className="rounded-full border border-admin-border px-3 py-1 text-[11px] text-admin-muted transition-colors hover:border-admin-primary/50"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <UrlAddRow onAdd={(url) => addPresetUrl(url)} />
      </div>
    </div>
  );
}

function UrlAddRow({ onAdd }: { onAdd: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2">
      <Input ref={inputRef} placeholder="https://..." className="bg-admin-canvas" />
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const url = inputRef.current?.value.trim();
          if (!url) return;
          onAdd(url);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }}
      >
        Add URL
      </Button>
    </div>
  );
}

export function appendGalleryFilesToForm(form: HTMLFormElement, items: ProductImageItem[]) {
  form.querySelectorAll("[data-gallery-file]").forEach((element) => element.remove());

  items
    .filter((item) => item.file)
    .forEach((item) => {
      const transfer = new DataTransfer();
      transfer.items.add(item.file!);
      const input = document.createElement("input");
      input.type = "file";
      input.name = "newGalleryImages";
      input.files = transfer.files;
      input.className = "sr-only";
      input.setAttribute("data-gallery-file", "true");
      form.appendChild(input);
    });
}
