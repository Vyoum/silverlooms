import type { OrderStatus } from "@/generated/prisma/client";

export interface KpiMetric {
  label: string;
  value: string;
  change?: string;
  changeLabel?: string;
  trend?: "up" | "alert" | "neutral";
  progress?: number;
  progressLabel?: string;
  accent: string;
  icon: "indian-rupee" | "package" | "sparkles" | "palette" | "eye" | "box" | "gem";
}

export interface RevenueSummaryItem {
  label: string;
  value: string;
}

export interface RecentOrderRow {
  id: string;
  customer: string;
  date: string;
  status: OrderStatus;
  amount: string;
}

export interface LowStockItem {
  name: string;
  sku: string;
  stock: string;
  urgent: boolean;
}

export interface PendingOrderRow {
  title: string;
  time: string;
  note: string | null;
  orderNumber: string;
}

export interface DashboardData {
  kpis: KpiMetric[];
  revenueSummary: RevenueSummaryItem[];
  chartData: number[];
  recentOrders: RecentOrderRow[];
  pendingOrders: PendingOrderRow[];
  lowStockItems: LowStockItem[];
  productCount: number;
  apparelCount: number;
  jewelleryCount: number;
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  categoryLabel: string;
  collection?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl: string;
  badge?: "NEW" | "SALE" | "BESTSELLER" | "";
  sizes?: string;
  colors?: string;
  stockQuantity?: number;
}

export interface AdminProductRow {
  id: string;
  slug: string;
  name: string;
  categoryLabel: string;
  productType: "apparel" | "jewellery";
  price: number;
  stock: number;
  createdAt: string;
}
