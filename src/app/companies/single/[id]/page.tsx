// import { useAppDispatch } from '@/src/redux/hooks/dispatch';
// import { fetchCompanyDetails } from '@/src/redux/slice/awol/companySlice';
// import { RootState } from '@/src/redux/store';
// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';

// export default async function CompanyDetail({ params }: { params: { id: string } }) {

//     const dispatch = useAppDispatch();
      
//     const { company, status } = useSelector((state: RootState) => state.company);
//     const user = useSelector((state: RootState) => state.user);
      
      
//     useEffect(() => {
//         if (!user?.token) return;
//         if (user?.token) {
//         dispatch(fetchCompanyDetails({ token: user.token, id: params.id }));
//         }
//     }, [user, dispatch]);

//     if (!user) return null;
//     if (status === "loading") return <div className="p-6">Loading...</div>;
//     if (status === "failed") return <div className="p-6">Failed to load company details.</div>;
//     if (!company) return <div className="p-6">Company not found.</div>;

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-semibold">{company.name}</h1>
//       <div className="border p-4">
//         <h2 className="font-semibold mb-2">Products</h2>
//         {company.products?.map((p: any) => (
//           <div key={p.id} className="mb-3">
//             <div className="font-medium">{p.name}</div>
//             <ul className="list-disc ml-6">
//               {p.models?.map((m: any) => (
//                 <li key={m.id}>{m.model_name} — Installment: ₦{m.installment_price}</li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import CompanyDetailsClient from "./CompanyDetailsClient";

export default function Page({ params }: { params: { id: string } }) {
  return <CompanyDetailsClient id={params.id} />;
}
