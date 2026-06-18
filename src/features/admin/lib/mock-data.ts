export const adminNavItems = [
  { label: "Overview", href: "/admin", icon: "layout-dashboard" },
  { label: "Commerce", href: "/admin/commerce", icon: "shopping-bag" },
  { label: "Community", href: "/admin/community", icon: "users" },
  { label: "Content", href: "/admin/content", icon: "file-text" },
  { label: "Store", href: "/admin/store", icon: "store" },
] as const;

export const kpiMetrics = [
  {
    label: "Revenue Today",
    value: "₹18,450",
    change: "+12%",
    changeLabel: "vs yesterday",
    trend: "up" as const,
    accent: "#C4704A",
    icon: "indian-rupee",
  },
  {
    label: "Orders Today",
    value: "34",
    change: "+5",
    trend: "up" as const,
    accent: "#5B7A5E",
    icon: "package",
  },
  {
    label: "Pending Custom",
    value: "7",
    change: "Action Needed",
    trend: "alert" as const,
    accent: "#B8860B",
    icon: "sparkles",
  },
  {
    label: "Active Artisans",
    value: "12",
    change: "+3",
    trend: "up" as const,
    accent: "#6B5B95",
    icon: "palette",
  },
  {
    label: "Visitors This Month",
    value: "3,241",
    progress: 32,
    progressLabel: "32% of goal",
    accent: "#4A7C8C",
    icon: "eye",
  },
];

export const revenueSummary = [
  { label: "Total Revenue", value: "₹1,24,500" },
  { label: "Avg. Order Value", value: "₹3,450" },
  { label: "Conversion Rate", value: "2.4%" },
];

export const recentOrders = [
  {
    id: "#ORD-9021",
    customer: "Meera Reddy",
    date: "Today, 10:42 AM",
    status: "Shipped" as const,
    amount: "₹4,200",
  },
  {
    id: "#ORD-9020",
    customer: "Anjali Gupta",
    date: "Today, 09:15 AM",
    status: "Processing" as const,
    amount: "₹12,500",
  },
  {
    id: "#ORD-9019",
    customer: "Priya Sharma",
    date: "Yesterday",
    status: "Pending" as const,
    amount: "₹3,800",
  },
  {
    id: "#ORD-9018",
    customer: "Kavita Iyer",
    date: "Yesterday",
    status: "Shipped" as const,
    amount: "₹6,150",
  },
];

export const customOrders = [
  {
    title: "Bridal Lehenga Trim",
    time: "2 days ago",
    note: '"Looking for zardosi border matching image attached, 5 meters needed by next week."',
    primaryAction: "Assign Artisan",
  },
  {
    title: "Banarasi Silk Dyeing",
    time: "3 days ago",
    note: null,
    primaryAction: "View Details",
  },
];

export const lowStockItems = [
  {
    name: "Royal Blue Banarasi Dupatta",
    sku: "DP-B-042",
    stock: "2 left",
    urgent: false,
  },
  {
    name: "Kalamkari Block Print Set",
    sku: "BK-K-011",
    stock: "0 left",
    urgent: true,
  },
];

export const quickActions = [
  { label: "Add Product", icon: "plus-circle" },
  { label: "Add Artisan", icon: "user-plus" },
  { label: "Custom Orders", icon: "sparkles" },
  { label: "Create Promo", icon: "tag" },
];

export const chartData = [42, 58, 45, 72, 65, 88, 76];
