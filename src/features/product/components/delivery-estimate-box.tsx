"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DeliveryEstimateResponse {
  serviceable: boolean;
  pincode: string;
  district?: string;
  message: string;
  estimatedDateMin?: string;
  estimatedDateMax?: string;
}

const STORAGE_KEY = "silverlooms-delivery-pincode";

export function DeliveryEstimateBox() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeliveryEstimateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (saved && /^\d{6}$/.test(saved)) {
      setPincode(saved);
    }
  }, []);

  async function checkDelivery(event?: React.FormEvent) {
    event?.preventDefault();

    const normalized = pincode.trim();
    if (!/^\d{6}$/.test(normalized)) {
      setError("Enter a valid 6-digit pincode.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/delhivery/delivery-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: normalized }),
      });

      const data = (await response.json()) as DeliveryEstimateResponse;

      if (!response.ok) {
        setError(data.message ?? "Could not estimate delivery.");
        return;
      }

      setResult(data);
      window.sessionStorage.setItem(STORAGE_KEY, normalized);

      if (!data.serviceable) {
        setError(data.message);
      }
    } catch {
      setError("Could not estimate delivery right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-cream-warm p-5">
      <div className="mb-4 flex items-center gap-2 text-ink">
        <Truck className="size-4" />
        <p className="text-sm font-medium">Check delivery date</p>
      </div>

      <form onSubmit={checkDelivery} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sage" />
          <Input
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={pincode}
            onChange={(event) => {
              const next = event.target.value.replace(/\D/g, "").slice(0, 6);
              setPincode(next);
              setError(null);
              setResult(null);
            }}
            placeholder="Enter delivery pincode"
            className="h-11 rounded-full border-border bg-white pl-10"
            aria-label="Delivery pincode"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="h-11 rounded-full bg-ink px-6 text-[11px] uppercase tracking-[1.2px] text-cream hover:bg-forest"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Checking
            </>
          ) : (
            "Check"
          )}
        </Button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-[#8b4f4f]">{error}</p>
      )}

      {result?.serviceable && (
        <div
          className={cn(
            "mt-3 rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm text-ink",
          )}
        >
          <p className="font-medium">{result.message}</p>
          {result.district && (
            <p className="mt-1 text-sage">
              Delivering to {result.district}
              {result.pincode ? ` · ${result.pincode}` : ""}
            </p>
          )}
          <p className="mt-2 text-xs text-sage">
            Dispatched via Delhivery after your order is confirmed.
          </p>
        </div>
      )}
    </div>
  );
}
