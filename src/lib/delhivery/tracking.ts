export function getDelhiveryTrackingUrl(waybill: string) {
  return `https://www.delhivery.com/track/package/${encodeURIComponent(waybill)}`;
}
