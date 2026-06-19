import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/admin-shell";
import { BRAND_NAME } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: `${BRAND_NAME} admin console`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
