import { AdminCommercePage } from "@/features/admin/admin-commerce-page";

interface PageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <AdminCommercePage initialOrderNumber={params.order} />;
}
