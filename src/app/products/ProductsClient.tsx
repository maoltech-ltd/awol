"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchProducts } from "@/src/redux/slice/awol/productSlice";
import useMounted from "@/src/redux/hooks/useMounted";

export default function ProductsClient({ page }: { page: number }) {
  const dispatch = useAppDispatch();
  const { products, status } = useSelector((state: RootState) => state.product);
  const user = useSelector((state: RootState) => state.user);
  const mounted = useMounted();

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchProducts({ token: user.token, page }));
  }, [user?.token, page]);

  if (!mounted) return null;
  if (!user?.token) return <div className="p-6">Please login</div>;
  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "failed") return <div className="p-6">Failed to load products.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div>
          <Link href="/products/product" className="border px-3 py-2">Add Product</Link>
          <Link href="/products/model" className="border px-3 py-2">Add Product Model</Link>
        </div>
      </div>

      <ul className="space-y-2">
        {products.map((p: any) => (
          <li key={p.id} className="border p-3">
            {p.name} (Company #{p.company}) —
            <Link className="underline ml-2" href={`/products/single/${p.id}`}>
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
