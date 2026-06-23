"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { createProductAction, type CreateProductResult } from "@/features/admin/actions";
import { ProductCardPreview } from "@/features/admin/components/product-card-preview";
import {
  apparelCategoryPresets,
  imagePresets,
  jewelleryCategoryPresets,
  mockStyleDefaults,
  type ProductType,
} from "@/features/admin/lib/product-presets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initialState: CreateProductResult = { success: false };

async function formAction(
  _prev: CreateProductResult,
  formData: FormData,
): Promise<CreateProductResult> {
  return createProductAction(formData);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
      {children}
    </label>
  );
}

export function AddProductForm({
  defaultProductType = "apparel",
}: {
  defaultProductType?: ProductType;
}) {
  const [state, action, pending] = useActionState(formAction, initialState);
  const [productType, setProductType] = useState<ProductType>(defaultProductType);
  const defaults = mockStyleDefaults[productType];

  const [name, setName] = useState("");
  const [categoryLabel, setCategoryLabel] = useState<string>(defaults.category);
  const [collection, setCollection] = useState<string>(defaults.collection);
  const [price, setPrice] = useState(2490);
  const [originalPrice, setOriginalPrice] = useState(3200);
  const [imageUrl, setImageUrl] = useState<string>(defaults.imageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [badge, setBadge] = useState("");
  const [sizes, setSizes] = useState<string>(defaults.sizes);
  const [colors, setColors] = useState<string>(defaults.colors);
  const [rating, setRating] = useState<number>(defaults.rating);
  const [reviewCount, setReviewCount] = useState<number>(defaults.reviewCount);

  function switchType(type: ProductType) {
    const next = mockStyleDefaults[type];
    setProductType(type);
    setCategoryLabel(next.category);
    setCollection(next.collection);
    setImageUrl(next.imageUrl);
    setImageFile(null);
    setSizes(next.sizes);
    setColors(next.colors);
    setRating(next.rating);
    setReviewCount(next.reviewCount);
    if (type === "apparel") {
      setPrice(2490);
      setOriginalPrice(3200);
    } else {
      setPrice(1890);
      setOriginalPrice(0);
    }
  }

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
  }

  const previewImageUrl = imagePreviewUrl ?? imageUrl;
  const hasImage = Boolean(imageFile || imageUrl);
  const categoryPresets =
    productType === "apparel" ? apparelCategoryPresets : jewelleryCategoryPresets;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form
        id="add-product"
        action={action}
        className="rounded-2xl border border-admin-border bg-admin-surface p-6 md:p-8"
      >
        <input type="hidden" name="productType" value={productType} />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-medium text-admin-ink">
            Add New Product
          </h2>
          <div className="flex rounded-lg border border-admin-border p-0.5">
            {(["apparel", "jewellery"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => switchType(type)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
                  productType === type
                    ? "bg-admin-primary text-white"
                    : "text-admin-muted hover:text-admin-ink",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {state.error && (
          <p className="mb-4 rounded-lg bg-admin-error/10 px-4 py-3 text-sm text-admin-error">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="mb-4 rounded-lg bg-admin-success/10 px-4 py-3 text-sm text-admin-success">
            Product created successfully! It is now live on the storefront.
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FieldLabel>Product Name *</FieldLabel>
            <Input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                productType === "apparel"
                  ? "Gulabi Leheriya Kurti Set"
                  : "Jodha Silver Choker"
              }
              className="bg-admin-canvas"
            />
          </div>

          <div>
            <FieldLabel>Slug (optional)</FieldLabel>
            <Input name="slug" placeholder="auto-generated-from-name" className="bg-admin-canvas" />
          </div>

          <div>
            <FieldLabel>Category Label *</FieldLabel>
            <Input
              name="categoryLabel"
              required
              list="category-presets"
              value={categoryLabel}
              onChange={(e) => setCategoryLabel(e.target.value)}
              placeholder="LEHERIYA · KURTI SET"
              className="bg-admin-canvas"
            />
            <datalist id="category-presets">
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
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="2490"
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
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              placeholder="3200 — shows strikethrough + % off"
              className="bg-admin-canvas"
            />
          </div>

          <div>
            <FieldLabel>Stock Quantity</FieldLabel>
            <Input
              name="stockQuantity"
              type="number"
              defaultValue={50}
              min={0}
              className="bg-admin-canvas"
            />
          </div>

          <div>
            <FieldLabel>Badge</FieldLabel>
            <select
              name="badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
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
              onChange={(e) => setCollection(e.target.value)}
              placeholder="LEHERIYA COLLECTION"
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
              onChange={(e) => setRating(Number(e.target.value))}
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
              onChange={(e) => setReviewCount(Number(e.target.value))}
              className="bg-admin-canvas"
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel>Product Photo *</FieldLabel>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <label
                  htmlFor="product-image-upload"
                  className={cn(
                    "flex min-h-[180px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
                    imageFile
                      ? "border-admin-primary bg-admin-primary/5"
                      : "border-admin-border bg-admin-canvas hover:border-admin-primary/50",
                  )}
                >
                  <ImagePlus className="mb-3 size-8 text-admin-muted" />
                  <span className="text-sm font-medium text-admin-ink">
                    {imageFile ? imageFile.name : "Click to upload a photo"}
                  </span>
                  <span className="mt-1 text-xs text-admin-muted">
                    JPG, PNG, or WebP up to 5 MB
                  </span>
                  <input
                    ref={fileInputRef}
                    id="product-image-upload"
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
                  <div className="relative h-[180px] w-full overflow-hidden rounded-xl border border-admin-border bg-admin-canvas sm:w-[180px]">
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
                  onChange={(e) => {
                    if (imageFile) {
                      clearSelectedImage();
                    }
                    setImageUrl(e.target.value);
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

          {productType === "apparel" && (
            <div>
              <FieldLabel>Sizes (comma-separated)</FieldLabel>
              <Input
                name="sizes"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="XS, S, M, L, XL"
                className="bg-admin-canvas"
              />
            </div>
          )}
          {productType === "jewellery" && <input type="hidden" name="sizes" value="" />}

          <div className={productType === "apparel" ? "" : "md:col-span-2"}>
            <FieldLabel>Colors (hex, comma-separated)</FieldLabel>
            <Input
              name="colors"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder={
                productType === "apparel" ? "#e4beb7, #b0cfa3, #ffffff" : "#c0c0c0"
              }
              className="bg-admin-canvas"
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <textarea
              name="description"
              rows={3}
              placeholder="Product description..."
              className="w-full rounded-lg border border-input bg-admin-canvas px-2.5 py-2 text-sm"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={pending || !hasImage}
          className="mt-6 bg-admin-primary text-white hover:bg-admin-primary/90"
        >
          {pending ? "Adding..." : "Add Product to Store"}
        </Button>
      </form>

      <ProductCardPreview
        productType={productType}
        name={name}
        categoryLabel={categoryLabel}
        collection={collection}
        price={price}
        originalPrice={originalPrice}
        imageUrl={previewImageUrl}
        badge={badge}
        sizes={sizes}
        colors={colors}
        rating={rating}
        reviewCount={reviewCount}
      />
    </div>
  );
}
