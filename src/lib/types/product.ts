export type ProductBadge = "NEW" | "SALE" | "BESTSELLER";

export interface ProductColor {
  hex: string;
  name?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  collection?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  colors: ProductColor[];
  badge?: ProductBadge;
  sizes?: string[];
  description?: string;
}
