import ProductDetailsClient from "./ProductDetailsClient";

export default function Page({ params }: { params: { id: string } }) {
  return <ProductDetailsClient id={params.id} />;
}
