'use client';

import { useAppDispatch } from '@/src/redux/hooks/dispatch';
import { fetchCustomers } from '@/src/redux/slice/awol/customerSlice';
import { RootState } from '@/src/redux/store';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function CustomersPageClient({ searchParams }: any) {
const page = Number(searchParams?.page ?? 1);

const dispatch = useAppDispatch();
const { customers, status } = useSelector((state: RootState) => state.customer);
const user = useSelector((state: RootState) => state.user);

useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchCustomers({ token: user.token, page }));
}, [user?.token, page, dispatch]);

if (status === "loading") return <div className="p-6">Loading...</div>;

return ( 
    <div className="p-6"> 
        <div className="flex justify-between mb-4"> 
            <h1 className="text-2xl font-semibold">Customers</h1> 
            <Link href="/customers/new" className="border px-3 py-2">
                Add Customer 
            </Link> 
        </div>

        <table className="w-full border">
            <thead>
            <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Action</th>
            </tr>
            </thead>
            <tbody>
            {customers.map((c: any) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.full_name}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">
                    <Link
                    className="text-blue-600 underline"
                    href={`/customers/single/${c.id}`}
                    >
                    View Details
                    </Link>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);
}
