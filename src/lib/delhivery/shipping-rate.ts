import { getDelhiveryEnv, isDelhiveryTokenConfigured } from "./env";
import { estimateDeliveryForPincode } from "./serviceability";
import { estimateWeightGrams } from "./weight";

export interface ShippingRateResult {
  serviceable: boolean;
  pincode: string;
  shippingCost: number;
  approximate: true;
  message: string;
  estimatedDelivery?: string;
}

interface DelhiveryInvoiceChargesRow {
  total_amount?: number;
  gross_amount?: number;
}

interface DelhiveryInvoiceChargesError {
  error?: string;
}

function parseChargeAmount(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.ceil(value);
}

async function fetchInvoiceCharges(input: {
  originPincode: string;
  destinationPincode: string;
  weightGrams: number;
}) {
  const env = getDelhiveryEnv();
  const params = new URLSearchParams({
    md: "E",
    cgm: String(input.weightGrams),
    o_pin: input.originPincode,
    d_pin: input.destinationPincode,
    ss: "Delivered",
    pt: "Pre-paid",
  });

  const response = await fetch(
    `${env.apiBaseUrl}/api/kinko/v1/invoice/charges/.json?${params.toString()}`,
    {
      headers: {
        Authorization: `Token ${env.apiToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const raw = (await response.json().catch(() => null)) as
    | DelhiveryInvoiceChargesRow[]
    | DelhiveryInvoiceChargesError
    | null;

  if (!response.ok) {
    const message =
      raw && !Array.isArray(raw) && raw.error
        ? raw.error
        : `Delhivery shipping quote failed (${response.status}).`;
    throw new Error(message);
  }

  const row = Array.isArray(raw) ? raw[0] : null;
  if (!row) {
    throw new Error("Delhivery did not return a shipping quote.");
  }

  return parseChargeAmount(row.total_amount ?? row.gross_amount);
}

export async function estimateShippingRateForCheckout(input: {
  destinationPincode: string;
  itemCount: number;
}): Promise<ShippingRateResult> {
  const pincode = input.destinationPincode.trim();

  if (!/^\d{6}$/.test(pincode)) {
    return {
      serviceable: false,
      pincode,
      shippingCost: 0,
      approximate: true,
      message: "Enter a valid 6-digit pincode to see shipping.",
    };
  }

  if (!isDelhiveryTokenConfigured()) {
    return {
      serviceable: false,
      pincode,
      shippingCost: 0,
      approximate: true,
      message: "Shipping estimates are unavailable right now.",
    };
  }

  const env = getDelhiveryEnv();
  if (!env.pickupPincode || !/^\d{6}$/.test(env.pickupPincode)) {
    return {
      serviceable: false,
      pincode,
      shippingCost: 0,
      approximate: true,
      message: "Shipping estimates are unavailable right now.",
    };
  }

  const delivery = await estimateDeliveryForPincode(pincode);
  if (!delivery.serviceable) {
    return {
      serviceable: false,
      pincode,
      shippingCost: 0,
      approximate: true,
      message: delivery.message,
    };
  }

  try {
    const shippingCost = await fetchInvoiceCharges({
      originPincode: env.pickupPincode,
      destinationPincode: pincode,
      weightGrams: estimateWeightGrams(input.itemCount),
    });

    return {
      serviceable: true,
      pincode,
      shippingCost,
      approximate: true,
      estimatedDelivery: delivery.message,
      message:
        shippingCost === 0
          ? "Estimated shipping is free for this pincode."
          : `Estimated shipping: ₹${shippingCost.toLocaleString("en-IN")} (approx.)`,
    };
  } catch (error) {
    console.error("[delhivery] shipping rate failed:", error);
    return {
      serviceable: false,
      pincode,
      shippingCost: 0,
      approximate: true,
      message: "Could not estimate shipping for this pincode. Please try again.",
    };
  }
}
