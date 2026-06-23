"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import {
  getProductForEditAction,
  updateProductAction,
  type UpdateProductResult,
} from "@/features/admin/actions";
import {
  apparelCategoryPresets,
  imagePresets,
  jewelleryCategoryPresets,
  type ProductType,
} from "@/features/admin/lib/product-presets";
import type { AdminProductEditData } from "@/features/admin/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initialState: UpdateProductResult = { success: false };

async function formAction(
  _prev: UpdateProductResult,
  formData: FormData,
): Promise<UpdateProductResult> {
  return updateProductAction(formData);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
      {children}
    </label>
  );
}

interface EditProductDialogProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSaved: () => void;
}

export function EditProductDialog({
  productId,
  productName,
  onClose,
  onSaved,
}: EditProductDialogProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [product, setProduct] = useState<AdminProductEditData | null>(null);
  const [state, action, pending] = useActionState(formAction, initialState);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryLabel, setCategoryLabel] = useState("");
  const [collection, setCollection] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [badge, setBadge] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [rating, setRating] = useState(4.5);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    let active = true;

    void getProductForEditAction(productId).then((result) => {
      if (!active) return;

      if (result.success && result.product) {
        const data = result.product;
        setProduct(data);
        setName(data.name);
        setSlug(data.slug);
        setCategoryLabel(data.categoryLabel);
        setCollection(data.collection);
        setDescription(data.description);
        setPrice(data.price);
        setOriginalPrice(data.originalPrice);
        setImageUrl(data.imageUrl);
        setBadge(data.badge);
        setSizes(data.sizes);
        setColors(data.colors);
        setRating(data.rating);
        setReviewCount(data.reviewCount);
        setLoadError(null);
      } else {
        setLoadError(result.error ?? "Could not load product.");
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  useEffect(() => {
    if (state.success) {
      onSaved();
      onClose();
    }
  }, [state.success, onClose, onSaved]);

  function handleImageFileChange(file: File | null) {
    setImageFile(file);
    if (file) {
      setImageUrl("");
    }
  }

  function clearSelectedImage() {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (product) {
      setImageUrl(product.imageUrl);
    }
  }

  const productType: ProductType = product?.productType ?? "apparel";
  const categoryPresets =
    productType === "apparel" ? apparelCategoryPresets : jewelleryCategoryPresets;
  const previewImageUrl = imagePreviewUrl ?? imageUrl;
  const hasImage = Boolean(imageFile || imageUrl);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close product editor"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-2xl">
        <div className="border-b border-admin-border px-6 py-5">
          <h3 className="font-serif text-2xl text-admin-ink">Edit product</h3>
          <p className="mt-1 text-sm text-admin-muted">{productName}</p>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {loading ? (
            <p className="text-sm text-admin-muted">Loading product…</p>
          ) : loadError ? (
            <p className="text-sm text-admin-error">{loadError}</p>
          ) : product ? (
            <form id="edit-product" action={action} className="space-y-5">
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="previousSlug" value={product.slug} />
              <input type="hidden" name="productType" value={productType} />

              {state.error && (
                <p className="rounded-lg bg-admin-error/10 px-4 py-3 text-sm text-admin-error">
                  {state.error}
                </p>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel>Product Name *</FieldLabel>
                  <Input
                    name="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="bg-admin-canvas"
                  />
                </div>

                <div>
                  <FieldLabel>Slug</FieldLabel>
                  <Input
                    name="slug"
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    className="bg-admin-canvas"
                  />
                </div>

                <div>
                  <FieldLabel>Category Label *</FieldLabel>
                  <Input
                    name="categoryLabel"
                    required
                    list="edit-category-presets"
                    value={categoryLabel}
                    onChange={(event) => setCategoryLabel(event.target.value)}
                    className="bg-admin-canvas"
                  />
                  <datalist id="edit-category-presets">
                    {categoryPresets.map((preset) => (
                      <option key={preset} value={preset} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <FieldLabel>Sale Price (₹) *</FieldLabel>
                  <Input
                    name="price"
                    type="number"
                    required
                    min={1}
                    value={price || ""}
                    onChange={(event) => setPrice(Number(event.target.value))}
                    className="bg-admin-canvas"
                  />
                </div>

                <div>
                  <FieldLabel>Original Price (₹)</FieldLabel>
                  <Input
                    name="originalPrice"
                    type="number"
                    min={0}
                    value={originalPrice || ""}
                    onChange={(event) => setOriginalPrice(Number(event.target.value))}
                    className="bg-admin-canvas"
                  />
                </div>

                <div>
                  <FieldLabel>Badge</FieldLabel>
                  <select
                    name="badge"
                    value={badge}
                    onChange={(event) => setBadge(event.target.value)}
                    className="h-8 w-full rounded-lg border border-input bg-admin-canvas px-2.5 text-sm"
                  >
                    <option value="">None</option>
                    <option value="NEW">New</option>
                    <option value="SALE">Sale</option>
                    <option value="BESTSELLER">Bestseller</option>
                  </select>
                </div>

                <div>
                  <FieldLabel>Collection</FieldLabel>
                  <Input
                    name="collection"
                    value={collection}
                    onChange={(event) => setCollection(event.target.value)}
                    className="bg-admin-canvas"
                  />
                </div>

                <div>
                  <FieldLabel>Rating</FieldLabel>
                  <Input
                    name="rating"
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                    className="bg-admin-canvas"
                  />
                </div>

                <div>
                  <FieldLabel>Review Count</FieldLabel>
                  <Input
                    name="reviewCount"
                    type="number"
                    min={0}
                    value={reviewCount}
                    onChange={(event) => setReviewCount(Number(event.target.value))}
                    className="bg-admin-canvas"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Product Photo *</FieldLabel>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <label
                        htmlFor={`product-image-upload-${product.id}`}
                        className={cn(
                          "flex min-h-[160px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-6 text-center transition-colors",
                          imageFile
                            ? "border-admin-primary bg-admin-primary/5"
                            : "border-admin-border bg-admin-canvas hover:border-admin-primary/50",
                        )}
                      >
                        <ImagePlus className="mb-3 size-7 text-admin-muted" />
                        <span className="text-sm font-medium text-admin-ink">
                          {imageFile ? imageFile.name : "Upload a new photo"}
                        </span>
                        <span className="mt-1 text-xs text-admin-muted">
                          JPG, PNG, or WebP up to 5 MB
                        </span>
                        <input
                          ref={fileInputRef}
                          id={`product-image-upload-${product.id}`}
                          name="image"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          onChange={(event) =>
                            handleImageFileChange(event.target.files?.[0] ?? null)
                          }
                        />
                      </label>

                      {previewImageUrl ? (
                        <div className="relative h-[160px] w-full overflow-hidden rounded-xl border border-admin-border bg-admin-canvas sm:w-[160px]">
                          <Image
                            src={previewImageUrl}
                            alt="Product preview"
                            fill
                            unoptimized={previewImageUrl.startsWith("blob:")}
                            className="object-cover"
                          />
                          {imageFile ? (
                            <button
                              type="button"
                              onClick={clearSelectedImage}
                              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                              aria-label="Remove uploaded photo"
                            >
                              <X className="size-3.5" />
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-admin-muted">
                        Or choose a preset / paste an image URL
                      </p>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {imagePresets[productType].map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => {
                              clearSelectedImage();
                              setImageUrl(preset.url);
                            }}
                            className={cn(
                              "rounded-full border px-3 py-1 text-[11px] transition-colors",
                              !imageFile && imageUrl === preset.url
                                ? "border-admin-primary bg-admin-primary/10 text-admin-primary"
                                : "border-admin-border text-admin-muted hover:border-admin-primary/50",
                            )}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                      <Input
                        name="imageUrl"
                        value={imageUrl}
                        onChange={(event) => {
                          if (imageFile) {
                            clearSelectedImage();
                          }
                          setImageUrl(event.target.value);
                        }}
                        placeholder="https://... or leave blank when uploading"
                        className="bg-admin-canvas"
                      />
                    </div>
                  </div>
                  {!hasImage ? (
                    <p className="mt-2 text-xs text-admin-muted">
                      Upload a photo or provide an image URL before saving.
                    </p>
                  ) : null}
                </div>

                {productType === "apparel" ? (
                  <div>
                    <FieldLabel>Sizes (comma-separated)</FieldLabel>
                    <Input
                      name="sizes"
                      value={sizes}
                      onChange={(event) => setSizes(event.target.value)}
                      className="bg-admin-canvas"
                    />
                  </div>
                ) : (
                  <input type="hidden" name="sizes" value="" />
                )}

                <div className={productType === "apparel" ? "" : "md:col-span-2"}>
                  <FieldLabel>Colors (hex, comma-separated)</FieldLabel>
                  <Input
                    name="colors"
                    value={colors}
                    onChange={(event) => setColors(event.target.value)}
                    className="bg-admin-canvas"
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    name="description"
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="w-full rounded-lg border border-input bg-admin-canvas px-2.5 py-2 text-sm"
                  />
                </div>
              </div>
            </form>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-admin-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-admin-border px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-admin-muted"
          >
            Cancel
          </button>
          <Button
            type="submit"
            form="edit-product"
            disabled={pending || loading || Boolean(loadError) || !hasImage}
            className="rounded-full bg-admin-primary px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white hover:bg-admin-primary/90"
          >
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
