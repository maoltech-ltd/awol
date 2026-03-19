// 'use client';

// import { useAppDispatch } from '@/src/redux/hooks/dispatch';
// import { fetchCustomers } from '@/src/redux/slice/awol/customerSlice';
// import { RootState } from '@/src/redux/store';
// import Link from 'next/link';
// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';

// export default function CustomersPageClient({ searchParams }: any) {
// const page = Number(searchParams?.page ?? 1);

// const dispatch = useAppDispatch();
// const { customers, status } = useSelector((state: RootState) => state.customer);
// const user = useSelector((state: RootState) => state.user);

// useEffect(() => {
//     if (!user?.token) return;
//     dispatch(fetchCustomers({ token: user.token, page }));
// }, [user?.token, page, dispatch]);

// if (status === "loading") return <div className="p-6">Loading...</div>;

// return ( 
//     <div className="p-6"> 
//         <div className="flex justify-between mb-4"> 
//             <h1 className="text-2xl font-semibold">Customers</h1> 
//             <Link href="/customers/new" className="border px-3 py-2">
//                 Add Customer 
//             </Link> 
//         </div>

//         <table className="w-full border">
//             <thead>
//             <tr className="bg-gray-100">
//                 <th className="p-2 text-left">Name</th>
//                 <th className="p-2 text-left">Phone</th>
//                 <th className="p-2 text-left">Action</th>
//             </tr>
//             </thead>
//             <tbody>
//             {customers.map((c: any) => (
//                 <tr key={c.id} className="border-b hover:bg-gray-50">
//                 <td className="p-2">{c.full_name}</td>
//                 <td className="p-2">{c.phone}</td>
//                 <td className="p-2">
//                     <Link
//                     className="text-blue-600 underline"
//                     href={`/customers/single/${c.id}`}
//                     >
//                     View Details
//                     </Link>
//                 </td>
//                 </tr>
//             ))}
//             </tbody>
//         </table>
//     </div>
// );
// }
"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchCustomers } from "@/src/redux/slice/awol/customerSlice";
import { RootState } from "@/src/redux/store";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import useMounted from "@/src/redux/hooks/useMounted";

export default function CustomersPageClient({ searchParams }: any) {
  const page = Number(searchParams?.page ?? 1);

  const dispatch = useAppDispatch();
  const { customers, status } = useSelector((state: RootState) => state.customer);
  const user = useSelector((state: RootState) => state.user);
  const mounted = useMounted();

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchCustomers({ token: user.token, page }));
  }, [user?.token, page, dispatch]);

  if (!mounted) return null;
  if (status === "loading") return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-3xl font-bold text-green-700">Customers</h1>

        <Link
          href="/customers/new"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:shadow-xl transition"
        >
          + Add Customer
        </Link>
      </div>

      <div className="space-y-4">
        {customers.map((c: any, i: number) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 shadow hover:shadow-xl transition flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold text-lg text-gray-800 dark:text-dark">
                {c.full_name}
              </h2>
              <p className="text-sm text-gray-500">{c.phone}</p>
            </div>

            <Link
              href={`/customers/single/${c.id}`}
              className="text-green-600 font-medium hover:underline"
            >
              View →
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}