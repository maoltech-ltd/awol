"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchCompanyDetails } from "@/src/redux/slice/awol/companySlice";
import { useRouter } from "next/navigation";

export default function CompanyDetailsClient({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { company, status } = useSelector((state: RootState) => state.company);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchCompanyDetails({ token: user.token, id }));
  }, [user?.token, id, dispatch]);

  if (!user?.token) return <div className="p-6 text-slate-800 dark:text-slate-100">Please login</div>;
  if (status === "loading") return <div className="p-6 text-slate-800 dark:text-slate-100">Loading...</div>;
  if (!company) return <div className="p-6 text-slate-800 dark:text-slate-100">Company not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl space-y-4 rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      {/* <h1 className="text-3xl font-bold text-green-700">{company.name}</h1> */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
          {company.name}
        </h1>

        <button
          onClick={() => router.push(`/companies/update/${company.id.toString()}`)}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          Update Company
        </button>
      </div>

      <div className="space-y-2 text-slate-700 dark:text-slate-300">
        <p><span className="font-medium">Type:</span> {company.company_type}</p>
        <p><span className="font-medium">Phone:</span> {company.phone}</p>
        <p><span className="font-medium">Address:</span> {company.address}</p>
      </div>
    </motion.div>
  );
}
