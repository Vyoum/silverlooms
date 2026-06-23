import { estimateDeliveryForPincode } from "@/lib/delhivery/serviceability";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { pincode?: string } | null;
    const pincode = String(body?.pincode ?? "").trim();

    const result = await estimateDeliveryForPincode(pincode);
    return Response.json(result);
  } catch (error) {
    console.error("[delhivery] delivery estimate failed:", error);
    return Response.json(
      {
        serviceable: false,
        pincode: "",
        message: "Could not estimate delivery right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
