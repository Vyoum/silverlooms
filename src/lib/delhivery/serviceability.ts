import { getDelhiveryEnv, isDelhiveryTokenConfigured } from "./env";

export interface DelhiveryPincodeDetails {
  pincode: string;
  prepaid: boolean;
  cod: boolean;
  district?: string;
  stateCode?: string;
  transitDaysMin?: number;
  transitDaysMax?: number;
}

export interface DeliveryEstimateResult {
  serviceable: boolean;
  pincode: string;
  district?: string;
  stateCode?: string;
  estimatedDateMin?: string;
  estimatedDateMax?: string;
  message: string;
}

interface DelhiveryPincodeApiResponse {
  delivery_codes?: Array<{
    postal_code?: {
      pin?: number | string;
      pre_paid?: string;
      cash?: string;
      cod?: string;
      pickup?: string;
      district?: string;
      state_code?: string;
      remarks?: string;
      expected_delivery_days?: number | string;
      tat?: number | string;
      edd?: number | string;
      max_days?: number | string;
      min_days?: number | string;
    };
  }>;
}

const PROCESSING_DAYS = 1;

function isYes(value: string | undefined) {
  return value?.toUpperCase() === "Y";
}

function parsePositiveNumber(value: number | string | undefined) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : undefined;
}

function extractTransitDays(postalCode: NonNullable<
  NonNullable<DelhiveryPincodeApiResponse["delivery_codes"]>[number]["postal_code"]
>) {
  const candidates = [
    parsePositiveNumber(postalCode.expected_delivery_days),
    parsePositiveNumber(postalCode.tat),
    parsePositiveNumber(postalCode.edd),
    parsePositiveNumber(postalCode.min_days),
    parsePositiveNumber(postalCode.max_days),
  ].filter((value): value is number => value !== undefined);

  if (candidates.length === 0) return undefined;

  const min = Math.min(...candidates);
  const max = Math.max(...candidates);
  return { min, max: max === min ? min + 1 : max };
}

function addCalendarDays(from: Date, days: number) {
  const result = new Date(from);
  result.setDate(result.getDate() + days);
  return result;
}

function formatEstimateDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function estimateTransitDaysByPincode(originPincode: string, destinationPincode: string) {
  if (originPincode.slice(0, 3) === destinationPincode.slice(0, 3)) {
    return { min: 2, max: 3 };
  }

  if (originPincode.slice(0, 2) === destinationPincode.slice(0, 2)) {
    return { min: 3, max: 5 };
  }

  if (originPincode[0] === destinationPincode[0]) {
    return { min: 4, max: 6 };
  }

  return { min: 5, max: 8 };
}

function estimateTransitDays(
  originPincode: string | undefined,
  destinationPincode: string,
  destinationStateCode: string | undefined,
  originStateCode: string | undefined,
  apiTransit?: { min: number; max: number },
) {
  if (apiTransit) {
    return apiTransit;
  }

  if (
    originStateCode &&
    destinationStateCode &&
    originStateCode.toUpperCase() === destinationStateCode.toUpperCase()
  ) {
    return { min: 3, max: 5 };
  }

  if (originPincode) {
    return estimateTransitDaysByPincode(originPincode, destinationPincode);
  }

  return { min: 5, max: 8 };
}

async function fetchPincodeDetails(pincode: string): Promise<DelhiveryPincodeDetails | null> {
  if (!isDelhiveryTokenConfigured()) {
    return null;
  }

  const env = getDelhiveryEnv();
  const response = await fetch(
    `${env.apiBaseUrl}/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(pincode)}`,
    {
      headers: {
        Authorization: `Token ${env.apiToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Could not reach Delhivery serviceability API.");
  }

  const raw = (await response.json().catch(() => null)) as DelhiveryPincodeApiResponse | null;
  const postalCode = raw?.delivery_codes?.[0]?.postal_code;

  if (!postalCode) {
    return {
      pincode,
      prepaid: false,
      cod: false,
    };
  }

  const apiTransit = extractTransitDays(postalCode);

  return {
    pincode,
    prepaid: isYes(postalCode.pre_paid) || isYes(postalCode.cash),
    cod: isYes(postalCode.cod),
    district: postalCode.district,
    stateCode: postalCode.state_code,
    transitDaysMin: apiTransit?.min,
    transitDaysMax: apiTransit?.max,
  };
}

export async function estimateDeliveryForPincode(
  pincode: string,
): Promise<DeliveryEstimateResult> {
  const normalized = pincode.trim();

  if (!/^\d{6}$/.test(normalized)) {
    return {
      serviceable: false,
      pincode: normalized,
      message: "Enter a valid 6-digit pincode.",
    };
  }

  if (!isDelhiveryTokenConfigured()) {
    return {
      serviceable: false,
      pincode: normalized,
      message: "Delivery estimates are unavailable right now.",
    };
  }

  const env = getDelhiveryEnv();
  const [destination, origin] = await Promise.all([
    fetchPincodeDetails(normalized),
    env.pickupPincode ? fetchPincodeDetails(env.pickupPincode) : Promise.resolve(null),
  ]);

  if (!destination) {
    return {
      serviceable: false,
      pincode: normalized,
      message: "Could not check delivery for this pincode.",
    };
  }

  if (!destination.prepaid) {
    return {
      serviceable: false,
      pincode: normalized,
      district: destination.district,
      stateCode: destination.stateCode,
      message: "Sorry, we do not deliver to this pincode yet.",
    };
  }

  const apiTransit =
    destination.transitDaysMin && destination.transitDaysMax
      ? { min: destination.transitDaysMin, max: destination.transitDaysMax }
      : undefined;

  const transit = estimateTransitDays(
    env.pickupPincode,
    normalized,
    destination.stateCode,
    origin?.stateCode,
    apiTransit,
  );

  const start = new Date();
  const estimatedDateMin = addCalendarDays(start, PROCESSING_DAYS + transit.min);
  const estimatedDateMax = addCalendarDays(start, PROCESSING_DAYS + transit.max);

  const locationLabel = destination.district
    ? ` to ${destination.district}`
    : "";

  return {
    serviceable: true,
    pincode: normalized,
    district: destination.district,
    stateCode: destination.stateCode,
    estimatedDateMin: estimatedDateMin.toISOString(),
    estimatedDateMax: estimatedDateMax.toISOString(),
    message:
      transit.min === transit.max
        ? `Estimated delivery${locationLabel} by ${formatEstimateDate(estimatedDateMin)}`
        : `Estimated delivery${locationLabel} between ${formatEstimateDate(estimatedDateMin)} and ${formatEstimateDate(estimatedDateMax)}`,
  };
}
