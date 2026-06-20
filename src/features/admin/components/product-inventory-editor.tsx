"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getProductInventoryAction,
  updateProductInventoryAction,
} from "@/features/admin/actions";

interface InventoryRow {
  id: string;
  size: string;
  sku: string | null;
  quantity: number;
  lowStockThreshold: number;
}

interface ProductInventoryEditorProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSaved: () => void;
}

export function ProductInventoryEditor({
  productId,
  productName,
  onClose,
  onSaved,
}: ProductInventoryEditorProps) {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    void getProductInventoryAction(productId).then((result) => {
      if (!active) return;

      if (result.success && result.inventory) {
        setRows(result.inventory);
        setError(null);
      } else {
        setError(result.error ?? "Could not load inventory.");
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [productId]);

  const save = () => {
    startTransition(async () => {
      const result = await updateProductInventoryAction(
        productId,
        rows.map((row) => ({
          inventoryId: row.id,
          quantity: row.quantity,
        })),
      );

      if (result.success) {
        onSaved();
        onClose();
      } else {
        setError(result.error ?? "Could not update inventory.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close inventory editor"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-2xl">
        <h3 className="font-serif text-2xl text-admin-ink">Update stock</h3>
        <p className="mt-1 text-sm text-admin-muted">{productName}</p>

        {loading ? (
          <p className="mt-8 text-sm text-admin-muted">Loading inventory…</p>
        ) : rows.length === 0 ? (
          <p className="mt-8 text-sm text-admin-muted">
            No inventory rows found for this product.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {rows.map((row) => (
              <label
                key={row.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-admin-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-admin-ink">
                    Size {row.size}
                  </p>
                  {row.sku && (
                    <p className="text-xs text-admin-muted">SKU {row.sku}</p>
                  )}
                </div>
                <input
                  type="number"
                  min={0}
                  value={row.quantity}
                  onChange={(event) => {
                    const quantity = Number(event.target.value);
                    setRows((current) =>
                      current.map((item) =>
                        item.id === row.id
                          ? { ...item, quantity: Number.isNaN(quantity) ? 0 : quantity }
                          : item,
                      ),
                    );
                  }}
                  className="h-10 w-24 rounded-lg border border-admin-border bg-white px-3 text-sm text-admin-ink"
                />
              </label>
            ))}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-admin-error">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-admin-border px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-admin-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending || loading || rows.length === 0}
            onClick={save}
            className="rounded-full bg-admin-primary px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
