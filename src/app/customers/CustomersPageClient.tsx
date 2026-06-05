"use client";

import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import useMounted from "@/src/redux/hooks/useMounted";
import { fetchCustomers } from "@/src/redux/slice/awol/customerSlice";
import { RootState } from "@/src/redux/store";
import { motion } from "framer-motion";
import { Link as LinkIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";

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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Customers</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Add a customer yourself or generate a unique customer registration link.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/customers/new?mode=direct"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Plus size={16} />
            Add Customer
          </Link>
          <Link
            href="/customers/new?mode=invite"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-700 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50 dark:border-emerald-400 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-slate-800"
          >
            <LinkIcon size={16} />
            Create Customer Link
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {customers.map((c: any, i: number) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                {c.full_name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{c.phone}</p>
            </div>

            <Link
              href={`/customers/single/${c.id}`}
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-300"
            >
              View
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
