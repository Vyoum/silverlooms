export interface SizeGuideRow {
  size: string;
  bustIn: string;
  waistIn: string;
  hipIn: string;
  lengthIn: string;
}

export const sizeGuideRows: SizeGuideRow[] = [
  { size: "XS", bustIn: "32", waistIn: "26", hipIn: "34", lengthIn: "42" },
  { size: "S", bustIn: "34", waistIn: "28", hipIn: "36", lengthIn: "43" },
  { size: "M", bustIn: "36", waistIn: "30", hipIn: "38", lengthIn: "44" },
  { size: "L", bustIn: "38", waistIn: "32", hipIn: "40", lengthIn: "45" },
  { size: "XL", bustIn: "40", waistIn: "34", hipIn: "42", lengthIn: "46" },
  { size: "XXL", bustIn: "42", waistIn: "36", hipIn: "44", lengthIn: "47" },
];

export const sizeGuideTips = [
  "Measure over light innerwear, keeping the tape snug but not tight.",
  "For bust, measure around the fullest part of the chest.",
  "For length, measure from shoulder to hem along the front.",
  "If between sizes, we recommend sizing up for a relaxed fit.",
];
