// 'use client';

// import { useAppDispatch } from '@/src/redux/hooks/dispatch';
// import { fetchCustomerDetails } from '@/src/redux/slice/awol/customerSlice';
// import { RootState } from '@/src/redux/store';
// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';

// export default function CustomerDetailsClient({ id }: { id: string }) {
//     const dispatch = useAppDispatch();
//     const { customer, contracts, payments, status } = useSelector((state: RootState) => state.customer);
//     const user = useSelector((state: RootState) => state.user);

//     useEffect(() => {
//         if (!user?.token) return;
//         dispatch(fetchCustomerDetails({ token: user.token, id }));
//     }, [user?.token, id, dispatch]);

//     if (status === "loading") return <div className="p-6">Loading...</div>;
//     if (!customer) return <div className="p-6">Customer not found</div>;

//     return ( 
//         <div className="p-6 space-y-6"> 
//             <div className="border p-4 rounded"> 
//                 <h1 className="text-2xl font-bold">{customer.full_name}</h1> 
//                 <p>Phone: {customer.phone}</p> 
//                 <p>Address: {customer.address}</p> 
//                 <p>Guarantor: {customer.guarantor_name} ({customer.guarantor_phone})</p> 
//             </div>

            
//             <div className="border p-4 rounded">
//                 <h2 className="font-semibold mb-2">Contracts</h2>
//                 {contracts.length === 0 && <p>No contracts</p>}
//                 {contracts.map((c: any) => (
//                 <div key={c.id} className="border p-2 my-2 rounded">
//                     Total: ₦{c.total_price} <br/>
//                     Balance: ₦{c.balance} <br/>
//                     Status: {c.status}
//                 </div>
//                 ))}
//             </div>

//             <div className="border p-4 rounded">
//                 <h2 className="font-semibold mb-2">Payments</h2>
//                 {payments.length === 0 && <p>No payments</p>}
//                 {payments.map((p: any) => (
//                 <div key={p.id}>
//                     ₦{p.amount_paid} — {p.payment_date}
//                 </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchCustomerDetails } from "@/src/redux/slice/awol/customerSlice";
import { RootState } from "@/src/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function CustomerDetailsClient({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const { customer, contracts, payments, status } = useSelector((state: RootState) => state.customer);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchCustomerDetails({ token: user.token, id }));
  }, [user?.token, id, dispatch]);

  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (!customer) return <div className="p-6">Customer not found</div>;

  return (
    <div className="p-6 space-y-6">

      {/* CUSTOMER INFO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-green-700">
          {customer.full_name}
        </h1>

        <div className="mt-3 space-y-1 text-gray-600 dark:text-gray-300">
          <p>📞 {customer.phone}</p>
          <p>📍 {customer.address}</p>
          <p>👤 Guarantor: {customer.guarantor_name} ({customer.guarantor_phone})</p>
        </div>
      </motion.div>

      {/* CONTRACTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-green-700">Contracts</h2>

        {contracts.length === 0 && <p className="dark:text-light">No contracts</p>}

        {contracts.map((c: any, i: number) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-light shadow"
          >
            <p>Total: ₦{c.total_price}</p>
            <p>Balance: ₦{c.balance}</p>
            <p>Status: {c.status}</p>
          </motion.div>
        ))}
      </div>

      {/* PAYMENTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-green-700 ">Payments</h2>

        {payments.length === 0 && <p className="dark:text-light">No payments</p>}

        {payments.map((p: any, i: number) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-light shadow"
          >
            ₦{p.amount_paid} — {p.payment_date}
          </motion.div>
        ))}
      </div>
    </div>
  );
}