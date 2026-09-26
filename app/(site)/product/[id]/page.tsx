import { notFound } from "next/navigation";
import { getProductDetail, listFlavors } from "@/lib/store";
import ProductView from "@/components/product-view";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProductDetail(Number(id));
  if (!detail) notFound();
  const flavors = await listFlavors();
  return <ProductView detail={detail} flavors={flavors} />;
}
