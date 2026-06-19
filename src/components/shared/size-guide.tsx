"use client";

import { useEffect, useRef } from "react";
import { Ruler, X } from "lucide-react";
import { sizeGuideRows, sizeGuideTips } from "@/lib/constants/size-guide";
import { cn } from "@/lib/utils";

interface SizeGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightSize?: string;
  className?: string;
}

export function SizeGuide({
  open,
  onOpenChange,
  highlightSize,
  className,
}: SizeGuideProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onOpenChange(false);
        }
      }}
      className={cn(
        "fixed inset-0 z-[100] m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-4 backdrop:bg-ink/40 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center",
        className,
      )}
    >
      <div
        role="document"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-cream p-6 shadow-xl md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-forest">
              <Ruler className="size-4" />
              <span className="text-[11px] font-medium uppercase tracking-[1.65px]">
                Size Guide
              </span>
            </div>
            <h2 className="font-serif text-2xl font-light text-ink">
              Kurtis & Sets
            </h2>
            <p className="mt-2 text-sm text-sage">
              All measurements are in inches. Refer to the chart below to find
              your best fit.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-border p-2 text-sage transition-colors hover:text-ink"
            aria-label="Close size guide"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-cream-dark text-[11px] uppercase tracking-wider text-sage">
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Bust</th>
                <th className="px-4 py-3 font-medium">Waist</th>
                <th className="px-4 py-3 font-medium">Hip</th>
                <th className="px-4 py-3 font-medium">Length</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuideRows.map((row) => {
                const isHighlighted = highlightSize === row.size;

                return (
                  <tr
                    key={row.size}
                    className={cn(
                      "border-b border-border/60 last:border-0",
                      isHighlighted && "bg-forest/5",
                    )}
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      {row.size}
                      {isHighlighted && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-forest">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sage">{row.bustIn}&quot;</td>
                    <td className="px-4 py-3 text-sage">{row.waistIn}&quot;</td>
                    <td className="px-4 py-3 text-sage">{row.hipIn}&quot;</td>
                    <td className="px-4 py-3 text-sage">{row.lengthIn}&quot;</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-xl bg-cream-dark p-5">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[1.65px] text-sage">
            How to Measure
          </p>
          <ul className="space-y-2 text-sm leading-relaxed text-sage">
            {sizeGuideTips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-forest">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}

interface SizeGuideTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SizeGuideTrigger({ onClick, className }: SizeGuideTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[1.3px] text-forest underline underline-offset-4 transition-colors hover:text-forest/80",
        className,
      )}
    >
      <Ruler className="size-3.5" />
      Size Guide
    </button>
  );
}
