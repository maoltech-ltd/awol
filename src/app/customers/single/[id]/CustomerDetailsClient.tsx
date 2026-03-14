'use client';

import { useAppDispatch } from '@/src/redux/hooks/dispatch';
import { fetchCustomerDetails } from '@/src/redux/slice/awol/customerSlice';
import { RootState } from '@/src/redux/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function CustomerDetailsClient({ id }: { id: string }) {
    const dispatch = useAppDispatch();
    const { customer, contracts, payments, status } = useSelector((state: RootState) => state.customer);
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!user?.token) return;
        dispatch(fetchCustomerDetails({ token: user.token, id }));
    }, [user?.token, id]);

    if (status === "loading") return <div className="p-6">Loading...</div>;
    if (!customer) return <div className="p-6">Customer not found</div>;

    return ( 
        <div className="p-6 space-y-6"> 
            <div className="border p-4 rounded"> 
                <h1 className="text-2xl font-bold">{customer.full_name}</h1> 
                <p>Phone: {customer.phone}</p> 
                <p>Address: {customer.address}</p> 
                <p>Guarantor: {customer.guarantor_name} ({customer.guarantor_phone})</p> 
            </div>

            
            <div className="border p-4 rounded">
                <h2 className="font-semibold mb-2">Contracts</h2>
                {contracts.length === 0 && <p>No contracts</p>}
                {contracts.map((c: any) => (
                <div key={c.id} className="border p-2 my-2 rounded">
                    Total: ₦{c.total_price} <br/>
                    Balance: ₦{c.balance} <br/>
                    Status: {c.status}
                </div>
                ))}
            </div>

            <div className="border p-4 rounded">
                <h2 className="font-semibold mb-2">Payments</h2>
                {payments.length === 0 && <p>No payments</p>}
                {payments.map((p: any) => (
                <div key={p.id}>
                    ₦{p.amount_paid} — {p.payment_date}
                </div>
                ))}
            </div>
        </div>
    );
}
