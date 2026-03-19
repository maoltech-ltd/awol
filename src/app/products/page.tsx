
import ProductsClient from "./ProductsClient";

export default function Page({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Number(searchParams?.page ?? "1");
  return <ProductsClient page={page} />;
}
