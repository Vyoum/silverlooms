import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CartItem } from "@/lib/types/cart";

interface CartItemsListProps {
  items: CartItem[];
}

export function CartItemsList({ items }: CartItemsListProps) {
  return (
    <div className="space-y-0 divide-y divide-border">
      {items.map((item) => (
        <article
          key={`${item.product.id}-${item.size}`}
          className="flex gap-6 py-8"
        >
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
              </div>
              <p className="font-medium text-ink">
                ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center rounded-full border border-border">
                <button
                  type="button"
                  className="px-3 py-2"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3" />
                </button>
                <span className="px-3 text-sm">{item.quantity}</span>
                <button
                  type="button"
                  className="px-3 py-2"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3" />
                </button>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-sage hover:text-ink"
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
