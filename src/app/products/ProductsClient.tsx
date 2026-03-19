// "use client";

// import { useEffect } from "react";
// import Link from "next/link";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/store";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { fetchProducts } from "@/src/redux/slice/awol/productSlice";
// import useMounted from "@/src/redux/hooks/useMounted";

// export default function ProductsClient({ page }: { page: number }) {
//   const dispatch = useAppDispatch();
//   const { products, status } = useSelector((state: RootState) => state.product);
//   const user = useSelector((state: RootState) => state.user);
//   const mounted = useMounted();

//   useEffect(() => {
//     if (!user?.token) return;
//     dispatch(fetchProducts({ token: user.token, page }));
//   }, [user?.token, page, dispatch]);

//   if (!mounted) return null;
//   if (!user?.token) return <div className="p-6">Please login</div>;
//   if (status === "loading") return <div className="p-6">Loading...</div>;
//   if (status === "failed") return <div className="p-6">Failed to load products.</div>;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-semibold">Products</h1>
//         <div>
//           <Link href="/products/product" className="border px-3 py-2">Add Product</Link>
//           <Link href="/products/model" className="border px-3 py-2">Add Product Model</Link>
//         </div>
//       </div>

//       <ul className="space-y-2">
//         {products.map((p: any) => (
//           <li key={p.id} className="border p-3">
//             {p.name} (Company #{p.company}) —
//             <Link className="underline ml-2" href={`/products/single/${p.id}`}>
//               View
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import useMounted from "@/src/redux/hooks/useMounted";
import { fetchProducts } from "@/src/redux/slice/awol/productSlice";

export default function ProductsClient({ page }: { page: number }) {
  const dispatch = useAppDispatch();
  const { products, status } = useSelector((state: RootState) => state.product);
  const user = useSelector((state: RootState) => state.user);
  const mounted = useMounted();

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchProducts({ token: user.token, page }));
  }, [user?.token, page, dispatch]);

  if (!mounted) return null;
  if (!user?.token) return <div className="p-6">Please login</div>;
  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "failed") return <div className="p-6">Failed to load products.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-3xl font-bold text-green-700">Products</h1>

        <div className="flex gap-3">
          <Link href="/products/product" className="px-4 py-2 rounded-xl bg-green-600 text-white shadow-md hover:shadow-lg hover:bg-green-700 transition">
            Add Product
          </Link>
          <Link href="/products/model" className="px-4 py-2 rounded-xl bg-emerald-500 text-white shadow-md hover:shadow-lg hover:bg-emerald-600 transition">
            Add Model
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((p: any, i: number) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl bg-white shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{p.name}</h2>
                <p className="text-sm text-gray-500">Company #{p.company}</p>
              </div>

              <Link
                href={`/products/single/${p.id}`}
                className="text-green-600 font-medium hover:underline"
              >
                View →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}