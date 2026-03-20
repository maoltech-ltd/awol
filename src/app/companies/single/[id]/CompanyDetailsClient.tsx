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

  if (!user?.token) return <div className="p-6">Please login</div>;
  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (!company) return <div className="p-6">Company not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl space-y-4"
    >
      {/* <h1 className="text-3xl font-bold text-green-700">{company.name}</h1> */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-700">
          {company.name}
        </h1>

        <button
          onClick={() => router.push(`/companies/update/${company.id.toString()}`)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-xl hover:scale-105 transition"
        >
          Update Company
        </button>
      </div>

      <div className="space-y-2 text-gray-600 dark:text-gray-300">
        <p><span className="font-medium">Type:</span> {company.company_type}</p>
        <p><span className="font-medium">Phone:</span> {company.phone}</p>
        <p><span className="font-medium">Address:</span> {company.address}</p>
      </div>
    </motion.div>
  );
}
