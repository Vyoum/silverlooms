export function estimateWeightKg(itemCount: number) {
  return Math.max(0.5, Number((itemCount * 0.35).toFixed(2)));
}

export function estimateWeightGrams(itemCount: number) {
  return Math.max(500, Math.round(estimateWeightKg(itemCount) * 1000));
}
