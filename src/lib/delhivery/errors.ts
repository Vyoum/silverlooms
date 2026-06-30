const DELHIVERY_ERROR_HINTS: Record<string, string> = {
  "shipment list contains no data":
    "DELHIVERY_CLIENT_NAME is wrong. In Delhivery One Panel, copy the exact API client name (case-sensitive) — it is usually not your shop display name like \"SILVER LOOMS\".",
  "clientwarehouse matching query does not exist":
    "DELHIVERY_PICKUP_LOCATION_NAME must exactly match your registered warehouse name in Delhivery (case and spaces matter).",
  "client-warehouse is not active":
    "Your Delhivery warehouse is inactive. Ask your Delhivery account manager to activate it.",
  "package type prepaid not serviceable":
    "Prepaid shipments are not enabled on your Delhivery account. Contact your Delhivery account manager.",
  "insufficient balance":
    "Delhivery wallet balance is too low. Recharge the account (minimum ₹500).",
  "duplicate order id":
    "This order was already submitted to Delhivery. Use a new order or contact support.",
};

export function explainDelhiveryError(message: string) {
  const normalized = message.trim().toLowerCase();

  for (const [needle, hint] of Object.entries(DELHIVERY_ERROR_HINTS)) {
    if (normalized.includes(needle)) {
      return `${message}\n\n${hint}`;
    }
  }

  return message;
}
