// import { useAppDispatch } from '@/src/redux/hooks/dispatch';
// import { fetchCompanies } from '@/src/redux/slice/awol/companySlice';
// import { RootState } from '@/src/redux/store';
// import Link from 'next/link';
// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';

import CompaniesClient from "./CompaniesClient";

// export default async function CompaniesPage({ searchParams }: { searchParams: { search?: string; page?: string } }) {
//   const search = searchParams.search ?? '';
//   const page = Number(searchParams.page ?? '1');


//     const dispatch = useAppDispatch();
  
//     const { companies, status } = useSelector((state: RootState) => state.company);
//     const user = useSelector((state: RootState) => state.user);
  
  
//     useEffect(() => {
//       if (!user?.token) return;
//       if (user?.token) {
//         dispatch(fetchCompanies({ token: user.token, search, page }));
//       }
//     }, [user, dispatch]);
  
//     if (!user) return null;
//     if (status === "loading") return <div className="p-6">Loading...</div>;
//     if (status === "failed") return <div className="p-6">Failed to load companies.</div>;

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
//           <tr className="border-b"><th className="p-2 text-left">Name</th><th className="p-2">Type</th><th className="p-2">Action</th></tr>
//         </thead>
//         <tbody>
//           {companies.map((c: any) => (
//             <tr key={c.id} className="border-b">
//               <td className="p-2">{c.name}</td>
//               <td className="p-2 text-center">{c.company_type}</td>
//               <td className="p-2 text-center"><Link href={`/companies/${c.id}`} className="underline">View</Link></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }



export default function Page({ searchParams }: { searchParams: { search?: string; page?: string } }) {
  const search = searchParams?.search ?? "";
  const page = Number(searchParams?.page ?? "1");

  return <CompaniesClient search={search} page={page} />;
}
