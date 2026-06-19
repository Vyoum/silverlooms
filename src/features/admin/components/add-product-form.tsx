"use client";

import { useActionState } from "react";
import { createProductAction, type CreateProductResult } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: CreateProductResult = { success: false };

async function formAction(
  _prev: CreateProductResult,
  formData: FormData,
): Promise<CreateProductResult> {
  return createProductAction(formData);
}

export function AddProductForm() {
  const [state, action, pending] = useActionState(formAction, initialState);

  return (
    <form
      id="add-product"
      action={action}
      className="rounded-2xl border border-admin-border bg-admin-surface p-6 md:p-8"
    >
      <h2 className="mb-6 font-serif text-2xl font-medium text-admin-ink">
        Add New Product
      </h2>

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
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Product Name *
          </label>
          <Input name="name" required placeholder="Gulabi Leheriya Kurti Set" className="bg-admin-canvas" />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Slug (optional)
          </label>
          <Input name="slug" placeholder="auto-generated-from-name" className="bg-admin-canvas" />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Category Label *
          </label>
          <Input
            name="categoryLabel"
            required
            placeholder="LEHERIYA · KURTI SET"
            className="bg-admin-canvas"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Price (₹) *
          </label>
          <Input name="price" type="number" required min={1} placeholder="2490" className="bg-admin-canvas" />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Stock Quantity
          </label>
          <Input name="stockQuantity" type="number" defaultValue={50} min={0} className="bg-admin-canvas" />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Badge
          </label>
          <select
            name="badge"
            className="h-8 w-full rounded-lg border border-input bg-admin-canvas px-2.5 text-sm"
          >
            <option value="">None</option>
            <option value="NEW">New</option>
            <option value="SALE">Sale</option>
            <option value="BESTSELLER">Bestseller</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Collection
          </label>
          <Input name="collection" placeholder="LEHERIYA COLLECTION" className="bg-admin-canvas" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Image URL *
          </label>
          <Input
            name="imageUrl"
            required
            placeholder="https://..."
            className="bg-admin-canvas"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Sizes (comma-separated)
          </label>
          <Input name="sizes" placeholder="XS, S, M, L, XL" className="bg-admin-canvas" />
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Colors (hex, comma-separated)
          </label>
          <Input name="colors" placeholder="#e4beb7, #b0cfa3" className="bg-admin-canvas" />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-admin-muted">
            Description
          </label>
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
        disabled={pending}
        className="mt-6 bg-admin-primary text-white hover:bg-admin-primary/90"
      >
        {pending ? "Adding..." : "Add Product to Store"}
      </Button>
    </form>
  );
}
