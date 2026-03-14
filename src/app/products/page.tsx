// import { useAppDispatch } from '@/src/redux/hooks/dispatch';
// import { fetchProducts } from '@/src/redux/slice/awol/productSlice';
// import { RootState } from '@/src/redux/store';
// import Link from 'next/link';
// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';

// export default async function ProductsPage({ searchParams }: any) {
//   const page = searchParams?.page ?? '1';
//     const dispatch = useAppDispatch();
    
//       const { products, status } = useSelector((state: RootState) => state.product);
//       const user = useSelector((state: RootState) => state.user);
    
    
//       useEffect(() => {
//         if (!user?.token) return;
//         if (user?.token) {
//           dispatch(fetchProducts({ token: user.token, page }));
//         }
//       }, [user, dispatch]);
    
//       if (!user) return null;
//       if (status === "loading") return <div className="p-6">Loading...</div>;
//       if (status === "failed") return <div className="p-6">Failed to load products.</div>;
//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-semibold">Products</h1>
//         <Link href="/products/new" className="border px-3 py-2">Add Product</Link>
//       </div>
//       <ul className="space-y-2">
//         {products?.map((p: any) => (
//           <li key={p.id} className="border p-3">{p.name} (Company #{p.company})</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import ProductsClient from "./ProductsClient";

export default function Page({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Number(searchParams?.page ?? "1");
  return <ProductsClient page={page} />;
}
