// "use client";

// import { useEffect } from "react";
// import Link from "next/link";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/store";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { fetchCompanies } from "@/src/redux/slice/awol/companySlice";
// import useMounted from "@/src/redux/hooks/useMounted";


// export default function CompaniesClient({ search, page }: { search: string; page: number }) {
//   const dispatch = useAppDispatch();
//   const { companies, status } = useSelector((state: RootState) => state.company);
//   const user = useSelector((state: RootState) => state.user);

//   const mounted = useMounted();
//   useEffect(() => {
//     if (!user?.token) return;
//     dispatch(fetchCompanies({ token: user.token, search, page }));
//   }, [user?.token, search, page, dispatch]);

//   if (!mounted) return null;

//   if (!user?.token) return <div className="p-6">Please login</div>;
//   if (status === "loading") return <div className="p-6">Loading...</div>;
//   if (status === "failed") return <div className="p-6">Failed to load companies.</div>;

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-semibold">Companies</h1>
//         <Link href="/companies/new" className="border px-3 py-2">Add Company</Link>
//       </div>

//       <form className="mb-4">
//         <input name="search" defaultValue={search} placeholder="Search..." className="border px-3 py-2 w-72" />
//         <button className="ml-2 border px-3 py-2">Search</button>
//       </form>

//       <table className="w-full border">
//         <thead>
//           <tr className="border-b">
//             <th className="p-2 text-left">Name</th>
//             <th className="p-2">Type</th>
//             <th className="p-2">Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {companies.map((c: any) => (
//             <tr key={c.id} className="border-b">
//               <td className="p-2">{c.name}</td>
//               <td className="p-2 text-center">{c.company_type}</td>
//               <td className="p-2 text-center">
//                 <Link href={`/companies/single/${c.id}`} className="underline">View</Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
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
import { fetchCompanies } from "@/src/redux/slice/awol/companySlice";
import useMounted from "@/src/redux/hooks/useMounted";

export default function CompaniesClient({ search, page }: { search: string; page: number }) {
  const dispatch = useAppDispatch();
  const { companies, status } = useSelector((state: RootState) => state.company);
  const user = useSelector((state: RootState) => state.user);
  const mounted = useMounted();

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchCompanies({ token: user.token, search, page }));
  }, [user?.token, search, page, dispatch]);

  if (!mounted) return null;

  if (!user?.token) return <div className="p-6">Please login</div>;
  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "failed") return <div className="p-6">Failed to load companies.</div>;

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Companies</h1>

        <Link
          href="/companies/new"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:shadow-xl transition"
        >
          + Add Company
        </Link>
      </div>

      {/* SEARCH */}
      <form className="mb-6 flex gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search companies..."
          className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner w-72 focus:ring-2 focus:ring-green-400 outline-none"
        />

        <button className="px-4 py-3 rounded-xl bg-green-600 text-white shadow hover:shadow-lg hover:scale-105 transition">
          Search
        </button>
      </form>

      {/* LIST */}
      <div className="space-y-4">
        {companies.map((c: any, i: number) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white dark:bg-gray-900 shadow hover:shadow-xl transition flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                {c.name}
              </h2>
              <p className="text-sm text-gray-500">{c.company_type}</p>
            </div>

            <Link
              href={`/companies/single/${c.id}`}
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