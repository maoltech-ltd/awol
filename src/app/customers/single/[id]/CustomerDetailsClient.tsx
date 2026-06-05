"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchCustomerDetails } from "@/src/redux/slice/awol/customerSlice";
import { RootState } from "@/src/redux/store";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function CustomerDetailsClient({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const { customer, contracts, payments, status } = useSelector((state: RootState) => state.customer);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchCustomerDetails({ token: user.token, id }));
  }, [user?.token, id, dispatch]);

  if (status === "loading") return <div className="p-6 text-slate-800 dark:text-slate-100">Loading...</div>;
  if (!customer) return <div className="p-6 text-slate-800 dark:text-slate-100">Customer not found</div>;

  return (
    <div className="min-h-screen space-y-6 p-6 text-slate-900 dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
          {customer.full_name}
        </h1>

        <div className="mt-3 space-y-1 text-slate-700 dark:text-slate-300">
          <p>Phone: {customer.phone}</p>
          <p>Address: {customer.address}</p>
          <p>Guarantor: {customer.guarantor_name} ({customer.guarantor_phone})</p>
        </div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">Contracts</h2>

        {contracts.length === 0 && <p className="text-slate-600 dark:text-slate-300">No contracts</p>}

        {contracts.map((c: any, i: number) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-slate-200 bg-white p-4 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <p>Total: {currency.format(Number(c.total_price || 0))}</p>
            <p>Balance: {currency.format(Number(c.balance || 0))}</p>
            <p>Status: {c.status}</p>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">Payments</h2>

        {payments.length === 0 && <p className="text-slate-600 dark:text-slate-300">No payments</p>}

        {payments.map((p: any, i: number) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-slate-200 bg-white p-3 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {currency.format(Number(p.amount_paid || 0))} - {p.payment_date}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
