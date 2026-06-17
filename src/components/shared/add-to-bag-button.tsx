"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-provider";
import { cn } from "@/lib/utils";

interface AddToBagButtonProps {
  slug: string;
  size?: string;
  colorHex?: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function AddToBagButton({
  slug,
  size,
  colorHex,
  quantity = 1,
  className,
  children = "Add to Bag",
}: AddToBagButtonProps) {
  const { addToCart, isPending } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  async function handleClick() {
    setIsAdding(true);
    try {
      await addToCart({ slug, size, colorHex, quantity });
    } finally {
      setIsAdding(false);
    }
  }

  const loading = isPending || isAdding;

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "h-12 flex-1 rounded-full bg-forest text-[13px] uppercase tracking-[1.3px] text-cream hover:bg-forest/90",
        className,
      )}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Adding...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
