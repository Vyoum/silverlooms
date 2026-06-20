import {
  markOrderPaid,
  markOrderPaymentFailed,
} from "@/features/checkout/services/order-fulfillment";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay/webhook";

interface RazorpayWebhookPayload {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
      };
    };
    order?: {
      entity?: {
        id?: string;
      };
    };
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    console.error("[razorpay] Invalid webhook signature");
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: RazorpayWebhookPayload;

  try {
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const payment = payload.payload?.payment?.entity;
    const razorpayOrderId =
      payment?.order_id ?? payload.payload?.order?.entity?.id;

    if (!razorpayOrderId) {
      return Response.json({ received: true, skipped: "no order id" });
    }

    switch (payload.event) {
      case "payment.captured":
      case "order.paid": {
        if (!payment?.id) {
          return Response.json({ received: true, skipped: "no payment id" });
        }

        await markOrderPaid({
          razorpayOrderId,
          razorpayPaymentId: payment.id,
        });
        break;
      }
      case "payment.failed": {
        await markOrderPaymentFailed(razorpayOrderId);
        break;
      }
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("[razorpay] Webhook handler failed:", error);
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
