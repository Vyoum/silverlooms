import { prisma } from "@/lib/db";
import { isJewelleryCategory } from "@/features/catalog/lib/category-utils";
import type { DashboardData, KpiMetric } from "../types";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatOrderDate(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today, ${time}`;
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const monthStart = startOfMonth(now);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const revenueGoal = 500_000;

  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [
    ordersToday,
    ordersYesterday,
    revenueTodayAgg,
    revenueYesterdayAgg,
    revenueMonthAgg,
    pendingOrders,
    recentOrders,
    lowStockRows,
    productCount,
    allProducts,
    dailyRevenue,
    paidOrderCount,
  ] = await Promise.all([
    prisma.order.count({
      where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: yesterdayStart, lt: todayStart },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: todayStart },
        paymentStatus: "PAID",
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: yesterdayStart, lt: todayStart },
        paymentStatus: "PAID",
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: monthStart, lte: monthEnd },
        paymentStatus: "PAID",
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      where: { status: { in: ["PENDING", "PROCESSING"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.inventory.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { quantity: "asc" },
    }),
    prisma.product.count(),
    prisma.product.findMany({ select: { categoryLabel: true } }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        paymentStatus: "PAID",
        status: { not: "CANCELLED" },
      },
      select: { total: true, createdAt: true },
    }),
    prisma.order.count({
      where: { paymentStatus: "PAID", status: { not: "CANCELLED" } },
    }),
  ]);

  const revenueToday = revenueTodayAgg._sum.total ?? 0;
  const revenueYesterday = revenueYesterdayAgg._sum.total ?? 0;
  const revenueMonth = revenueMonthAgg._sum.total ?? 0;

  const revenueChange =
    revenueYesterday > 0
      ? Math.round(((revenueToday - revenueYesterday) / revenueYesterday) * 100)
      : revenueToday > 0
        ? 100
        : 0;

  const orderChange = ordersToday - ordersYesterday;
  const monthProgress = Math.min(100, Math.round((revenueMonth / revenueGoal) * 100));

  const totalRevenueAgg = await prisma.order.aggregate({
    where: { paymentStatus: "PAID", status: { not: "CANCELLED" } },
    _sum: { total: true },
    _avg: { total: true },
  });
  const totalRevenue = totalRevenueAgg._sum.total ?? 0;
  const avgOrderValue = Math.round(totalRevenueAgg._avg.total ?? 0);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(sevenDaysAgo);
    day.setDate(day.getDate() + i);
    const dayStart = startOfDay(day);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    return dailyRevenue
      .filter((o) => o.createdAt >= dayStart && o.createdAt < dayEnd)
      .reduce((sum, o) => sum + o.total, 0);
  });

  const maxChart = Math.max(...chartData, 1);
  const normalizedChart = chartData.map((v) => Math.round((v / maxChart) * 100));

  const jewelleryCount = allProducts.filter((p) =>
    isJewelleryCategory(p.categoryLabel),
  ).length;
  const apparelCount = productCount - jewelleryCount;

  const kpis: KpiMetric[] = [
    {
      label: "Revenue Today",
      value: formatCurrency(revenueToday),
      change: `${revenueChange >= 0 ? "+" : ""}${revenueChange}%`,
      changeLabel: "vs yesterday",
      trend: revenueChange >= 0 ? "up" : "alert",
      accent: "#C4704A",
      icon: "indian-rupee",
    },
    {
      label: "Orders Today",
      value: String(ordersToday),
      change: `${orderChange >= 0 ? "+" : ""}${orderChange}`,
      trend: orderChange >= 0 ? "up" : "neutral",
      accent: "#5B7A5E",
      icon: "package",
    },
    {
      label: "Pending Orders",
      value: String(pendingOrders.length),
      change: pendingOrders.length > 0 ? "Action Needed" : "All Clear",
      trend: pendingOrders.length > 0 ? "alert" : "up",
      accent: "#B8860B",
      icon: "sparkles",
    },
    {
      label: "Apparel Products",
      value: String(apparelCount),
      change: "On /kurtis",
      trend: "up",
      accent: "#5B7A5E",
      icon: "box",
    },
    {
      label: "Jewellery Products",
      value: String(jewelleryCount),
      change: "On /jewellery",
      trend: "up",
      accent: "#6B5B95",
      icon: "gem",
    },
    {
      label: "Revenue This Month",
      value: formatCurrency(revenueMonth),
      progress: monthProgress,
      progressLabel: `${monthProgress}% of ₹5L goal`,
      accent: "#4A7C8C",
      icon: "eye",
    },
  ];

  const lowStockFiltered = lowStockRows
    .filter((row) => row.quantity <= row.lowStockThreshold)
    .slice(0, 6);

  return {
    kpis,
    revenueSummary: [
      { label: "Total Revenue", value: formatCurrency(totalRevenue) },
      { label: "Avg. Order Value", value: formatCurrency(avgOrderValue) },
      {
        label: "Paid Orders",
        value: String(paidOrderCount),
      },
    ],
    chartData: normalizedChart,
    recentOrders: recentOrders.map((order) => ({
      id: order.orderNumber,
      customer: order.customerName,
      date: formatOrderDate(order.createdAt),
      status: order.status,
      amount: formatCurrency(order.total),
    })),
    pendingOrders: pendingOrders.map((order) => ({
      title: order.orderNumber,
      time: formatOrderDate(order.createdAt),
      note: order.status === "PENDING" ? "Awaiting processing" : "In fulfillment",
      orderNumber: order.orderNumber,
    })),
    lowStockItems: lowStockFiltered.map((row) => ({
      name: row.product.name,
      sku: row.sku ?? row.id.slice(0, 8).toUpperCase(),
      stock: row.quantity === 0 ? "0 left" : `${row.quantity} left`,
      urgent: row.quantity === 0,
    })),
    productCount,
    apparelCount,
    jewelleryCount,
  };
}

export async function listAdminProducts() {
  const products = await prisma.product.findMany({
    include: {
      inventory: { select: { quantity: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryLabel: p.categoryLabel,
    productType: (isJewelleryCategory(p.categoryLabel)
      ? "jewellery"
      : "apparel") as "apparel" | "jewellery",
    price: p.price,
    stock: p.inventory.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: p.createdAt.toLocaleDateString("en-IN"),
  }));
}
