import { OrderClient } from "@/app/order/OrderClient";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return <OrderClient tableToken={resolvedSearchParams.table ?? null} />;
}
