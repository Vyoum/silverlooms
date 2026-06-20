import crypto from "crypto";

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string | null,
) {
  const secret =
    process.env.RAZORPAY_WEBHOOK_SECRET ?? process.env.RAZORPAY_KEY_SECRET;

  if (!secret || !signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
}
