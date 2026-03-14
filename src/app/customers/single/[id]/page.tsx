// import { useAppDispatch } from '@/src/redux/hooks/dispatch';
// import { fetchCustomerDetails } from '@/src/redux/slice/awol/customerSlice';
// import { RootState } from '@/src/redux/store';
// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';



// export default async function CustomerDetail({ params }: { params: { id: string } }) {
//   const dispatch = useAppDispatch();
        
//       const { customer, status } = useSelector((state: RootState) => state.customer);
//       const user = useSelector((state: RootState) => state.user);
        
        
//       useEffect(() => {
//           if (!user?.token) return;
//           if (user?.token) {
//           dispatch(fetchCustomerDetails({ token: user.token, id: params.id }));
//           }
//       }, [user, dispatch]);
  
//       if (!user) return null;
//       if (status === "loading") return <div className="p-6">Loading...</div>;
//       if (status === "failed") return <div className="p-6">Failed to load customer details.</div>;
//       if (!customer) return <div className="p-6">Customer not found.</div>;

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-semibold">{customer.full_name}</h1>

//       <div className="border p-4">
//         <h2 className="font-semibold">Contracts</h2>
//         {customer.contracts.map((s: any) => (
//           <div key={s.id} className="border p-2 my-2">
//             Balance: ₦{s.balance} | Status: {s.status}
//           </div>
//         ))}
//       </div>

//       <div className="border p-4">
//         <h2 className="font-semibold">Payments</h2>
//         {customer.payments.map((p: any) => (
//           <div key={p.id}>₦{p.amount_paid} on {p.payment_date}</div>
//         ))}
//       </div>
//     </div>
//   );
// }

import CustomerDetailsClient from "./CustomerDetailsClient";

export default function Page({ params }: { params: { id: string } }) {
  return <CustomerDetailsClient id={params.id} />;
}
 