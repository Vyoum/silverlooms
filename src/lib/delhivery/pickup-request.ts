import { getDelhiveryEnv, isDelhiveryConfigured } from "./env";

export interface DelhiveryPickupRequestResult {
  success: boolean;
  pickupId?: number;
  error?: string;
  raw?: unknown;
}

function formatPickupDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isDuplicatePickupError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("already") ||
    normalized.includes("active") ||
    normalized.includes("exists") ||
    normalized.includes("closed")
  );
}

export async function createDelhiveryPickupRequest(input?: {
  expectedPackageCount?: number;
  pickupDate?: Date;
}): Promise<DelhiveryPickupRequestResult> {
  if (!isDelhiveryConfigured()) {
    return {
      success: false,
      error: "Delhivery is not fully configured.",
    };
  }

  const env = getDelhiveryEnv();
  const pickupLocation = env.pickupLocationName?.trim();

  if (!pickupLocation) {
    return {
      success: false,
      error: "Pickup location name is not configured.",
    };
  }

  const payload = {
    pickup_time: env.pickupTime,
    pickup_date: formatPickupDate(input?.pickupDate ?? new Date()),
    pickup_location: pickupLocation,
    expected_package_count: Math.max(1, input?.expectedPackageCount ?? 1),
  };

  const response = await fetch(`${env.apiBaseUrl}/fm/request/new/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${env.apiToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const raw = (await response.json().catch(() => null)) as
    | {
        pickup_id?: number;
        pickup_location?: string;
        error?: string;
      }
    | Record<string, string>
    | null;

  if (!response.ok) {
    const errorMessage =
      (raw && "pickup_location" in raw && typeof raw.pickup_location === "string"
        ? raw.pickup_location
        : undefined) ??
      (raw && "error" in raw && typeof raw.error === "string" ? raw.error : undefined) ??
      `Delhivery pickup request failed (${response.status}).`;

    if (isDuplicatePickupError(errorMessage)) {
      return {
        success: true,
        error: errorMessage,
        raw,
      };
    }

    return {
      success: false,
      error: errorMessage,
      raw,
    };
  }

  const pickupId =
    raw && typeof raw === "object" && "pickup_id" in raw && typeof raw.pickup_id === "number"
      ? raw.pickup_id
      : undefined;

  return {
    success: true,
    pickupId,
    raw,
  };
}
