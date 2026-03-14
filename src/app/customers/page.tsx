// import { useAppDispatch } from '@/src/redux/hooks/dispatch';
// import { fetchCustomers } from '@/src/redux/slice/awol/customerSlice';
// import { RootState } from '@/src/redux/store';
// import Link from 'next/link';
// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';

import CustomersPageClient from "./CustomersPageClient";

// export default async function CustomersPage({ searchParams }: any) {
//   const page = searchParams?.page ?? '1';
//   const dispatch = useAppDispatch();
  
//     const { customers, status } = useSelector((state: RootState) => state.customer);
//     const user = useSelector((state: RootState) => state.user);
  
  
//     useEffect(() => {
//       if (!user?.token) return;
//       if (user?.token) {
//         dispatch(fetchCustomers({ token: user.token, page }));
//       }
//     }, [user, dispatch]);
  
//     if (!user) return null;
//     if (status === "loading") return <div className="p-6">Loading...</div>;
//     if (status === "failed") return <div className="p-6">Failed to load customers.</div>;

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-semibold">Customers</h1>
//         <Link href="/customers/new" className="border px-3 py-2">Add Customer</Link>
//       </div>
//       <table className="w-full border">
//         <tbody>
//           {customers.map((c: any) => (
//             <tr key={c.id} className="border-b">
//               <td className="p-2">{c.full_name}</td>
//               <td className="p-2">{c.phone}</td>
//               <td className="p-2"><Link className="underline" href={`/customers/${c.id}`}>View</Link></td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

export default function Page({ searchParams }: any) {
  return <CustomersPageClient searchParams={searchParams} />;
}