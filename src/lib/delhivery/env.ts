export function getDelhiveryEnv() {
  return {
    apiToken: process.env.DELHIVERY_API_TOKEN,
    apiBaseUrl:
      process.env.DELHIVERY_API_BASE_URL?.replace(/\/$/, "") ??
      "https://track.delhivery.com",
    clientName: process.env.DELHIVERY_CLIENT_NAME,
    pickupLocationName: process.env.DELHIVERY_PICKUP_LOCATION_NAME,
    pickupAddress: process.env.DELHIVERY_PICKUP_ADDRESS,
    pickupPincode: process.env.DELHIVERY_PICKUP_PINCODE,
    pickupPhone: process.env.DELHIVERY_PICKUP_PHONE,
    pickupCity: process.env.DELHIVERY_PICKUP_CITY,
    pickupState: process.env.DELHIVERY_PICKUP_STATE,
    sellerGstTin: process.env.DELHIVERY_SELLER_GST_TIN,
    hsnCode: process.env.DELHIVERY_HSN_CODE ?? "6204",
  };
}

export function isDelhiveryConfigured() {
  const env = getDelhiveryEnv();

  return Boolean(
    env.apiToken &&
      env.clientName &&
      env.pickupLocationName &&
      env.pickupAddress &&
      env.pickupPincode &&
      env.pickupPhone &&
      env.pickupCity &&
      env.pickupState &&
      env.sellerGstTin,
  );
}
