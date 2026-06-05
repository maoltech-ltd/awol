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

  if (!user?.token) return <div className="p-6 text-slate-800 dark:text-slate-100">Please login</div>;
  if (status === "loading") return <div className="p-6 text-slate-800 dark:text-slate-100">Loading...</div>;
  if (status === "failed") return <div className="p-6 text-slate-800 dark:text-slate-100">Failed to load companies.</div>;

  return (
    <div className="min-h-screen p-6 text-slate-900 dark:text-slate-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">Companies</h1>

        <Link
          href="/companies/new"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
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
          className="w-72 rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
        />

        <button className="rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
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
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                {c.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{c.company_type}</p>
            </div>

            <Link
              href={`/companies/single/${c.id}`}
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
