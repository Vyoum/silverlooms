import { getDelhiveryEnv, isDelhiveryConfigured } from "./env";

export interface DelhiveryShipmentInput {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  totalAmount: number;
  quantity: number;
  productsDescription: string;
  weightKg: number;
}

export interface DelhiveryCreateShipmentResult {
  success: boolean;
  waybill?: string;
  error?: string;
  raw?: unknown;
}

function sanitizeDelhiveryText(value: string) {
  return value
    .replace(/[&%#;\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatOrderDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function createDelhiveryShipment(
  input: DelhiveryShipmentInput,
): Promise<DelhiveryCreateShipmentResult> {
  if (!isDelhiveryConfigured()) {
    return {
      success: false,
      error: "Delhivery is not fully configured.",
    };
  }

  const env = getDelhiveryEnv();
  const payload = {
    pickup_location: {
      name: env.pickupLocationName,
      add: sanitizeDelhiveryText(env.pickupAddress!),
      pin: env.pickupPincode,
      phone: env.pickupPhone,
      city: sanitizeDelhiveryText(env.pickupCity!),
      state: sanitizeDelhiveryText(env.pickupState!),
      country: "India",
    },
    shipments: [
      {
        name: sanitizeDelhiveryText(input.customerName),
        add: sanitizeDelhiveryText(input.shippingAddress),
        pin: input.shippingPincode,
        phone: input.customerPhone,
        city: sanitizeDelhiveryText(input.shippingCity),
        state: sanitizeDelhiveryText(input.shippingState),
        country: "India",
        order: input.orderNumber,
        order_date: formatOrderDate(new Date()),
        payment_mode: "Prepaid",
        total_amount: input.totalAmount,
        quantity: input.quantity,
        products_desc: sanitizeDelhiveryText(input.productsDescription),
        weight: input.weightKg,
        seller_gst_tin: env.sellerGstTin,
        hsn_code: env.hsnCode,
        client: env.clientName,
      },
    ],
  };

  const body = `format=json&data=${JSON.stringify(payload)}`;

  const response = await fetch(`${env.apiBaseUrl}/api/cmu/create.json`, {
    method: "POST",
    headers: {
      Authorization: `Token ${env.apiToken}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const raw = (await response.json().catch(() => null)) as
    | {
        success?: boolean;
        error?: string | boolean;
        rmk?: string;
        packages?: Array<{ waybill?: string; status?: string; remarks?: string[] }>;
        package_count?: number;
      }
    | null;

  if (!response.ok) {
    return {
      success: false,
      error: raw?.rmk ?? `Delhivery request failed (${response.status}).`,
      raw,
    };
  }

  const waybill = raw?.packages?.[0]?.waybill;
  const packageError = raw?.packages?.[0]?.remarks?.[0];
  const requestFailed = raw?.success === false || raw?.error === true;

  if (!waybill || requestFailed) {
    return {
      success: false,
      error:
        packageError ??
        (typeof raw?.error === "string" ? raw.error : undefined) ??
        raw?.rmk ??
        "Delhivery did not return a waybill.",
      raw,
    };
  }

  return {
    success: true,
    waybill,
    raw,
  };
}
