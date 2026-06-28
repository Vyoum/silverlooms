export interface ShippingDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingLine1: string;
  shippingLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
}

export interface CheckoutShippingQuote {
  loading: boolean;
  serviceable: boolean;
  pincode: string;
  shippingCost: number;
  message?: string;
  estimatedDelivery?: string;
}

export interface CheckoutSession {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  currency: "INR";
  keyId: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}
