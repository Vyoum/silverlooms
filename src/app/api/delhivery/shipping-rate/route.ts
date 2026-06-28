import { estimateShippingRateForCheckout } from "@/lib/delhivery/shipping-rate";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { pincode?: string; itemCount?: number }
      | null;

    const pincode = String(body?.pincode ?? "").trim();
    const itemCount = Math.max(1, Number(body?.itemCount ?? 1) || 1);

    const result = await estimateShippingRateForCheckout({
      destinationPincode: pincode,
      itemCount,
    });

    return Response.json(result);
  } catch (error) {
    console.error("[delhivery] shipping rate failed:", error);
    return Response.json(
      {
        serviceable: false,
        pincode: "",
        shippingCost: 0,
        approximate: true,
        message: "Could not estimate shipping right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
