export const adminNavItems = [
  { label: "Overview", href: "/admin", icon: "layout-dashboard" },
  { label: "Store", href: "/admin/store", icon: "store" },
  { label: "Jewellery", href: "/admin/jewellery", icon: "gem" },
  { label: "Users", href: "/admin/users", icon: "user-cog", superAdminOnly: true },
  { label: "Commerce", href: "/admin/commerce", icon: "shopping-bag" },
  { label: "Community", href: "/admin/community", icon: "users" },
  { label: "Site Content", href: "/admin/content", icon: "file-text" },
] as const;
