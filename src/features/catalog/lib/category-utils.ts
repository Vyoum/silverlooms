const JEWELLERY_KEYWORDS = [
  "NECKLACE",
  "EARRINGS",
  "EARRING",
  "BANGLE",
  "KADA",
  "PENDANT",
  "MAANG",
  "JEWELLERY",
  "SILVER",
  "CHOKER",
] as const;

export function isJewelleryCategory(categoryLabel: string): boolean {
  const upper = categoryLabel.toUpperCase();
  return JEWELLERY_KEYWORDS.some((keyword) => upper.includes(keyword));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
