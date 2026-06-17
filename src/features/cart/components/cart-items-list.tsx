"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/features/cart/cart-provider";

export function CartItemsList() {
  const { cart, updateQuantity, removeItem, isPending } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center">
        <p className="font-serif text-2xl text-ink">Your bag is empty</p>
        <p className="mt-2 text-sm text-sage">
          Discover our curated collections and add something you love.
        </p>
        <Link
          href="/kurtis"
          className="mt-6 inline-flex rounded-full bg-forest px-8 py-3 text-[13px] uppercase tracking-[1.3px] text-cream"
        >
          Shop Apparel
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-0 divide-y divide-border">
      {cart.items.map((item) => (
        <article key={item.id} className="flex gap-6 py-8">
          <Link
            href={`/product/${item.product.slug}`}
            className="relative h-[120px] w-[90px] shrink-0 overflow-hidden bg-cream-dark"
          >
            <Image
              src={item.product.image}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="90px"
            />
          </Link>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex justify-between gap-4">
              <div>
                <Link
                  href={`/product/${item.product.slug}`}
                  className="font-serif text-xl text-ink hover:text-forest"
                >
                  {item.product.name}
                </Link>
                {item.size && (
                  <p className="mt-1 text-sm text-sage">Size: {item.size}</p>
                )}
                {item.colorHex && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-sage">
                    <span
                      className="size-4 rounded-full border border-border"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    Color selected
                  </div>
                )}
              </div>
              <p className="font-medium text-ink">
                ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center rounded-full border border-border">
                <button
                  type="button"
                  className="px-3 py-2 disabled:opacity-50"
                  aria-label="Decrease quantity"
                  disabled={isPending}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="size-3" />
                </button>
                <span className="min-w-6 px-3 text-center text-sm">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="px-3 py-2 disabled:opacity-50"
                  aria-label="Increase quantity"
                  disabled={isPending}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="size-3" />
                </button>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-sage hover:text-ink disabled:opacity-50"
                disabled={isPending}
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="size-3" />
                Remove
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
