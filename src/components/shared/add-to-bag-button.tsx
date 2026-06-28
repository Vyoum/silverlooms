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
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  async function handleClick() {
    setIsAdding(true);
    try {
      await addToCart({ slug, size, colorHex, quantity });
    } catch {
      // Toast is shown in the cart provider.
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isAdding}
      className={cn(
        "h-12 flex-1 rounded-full bg-forest text-[13px] uppercase tracking-[1.3px] text-cream hover:bg-forest/90",
        className,
      )}
    >
      {isAdding ? (
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
