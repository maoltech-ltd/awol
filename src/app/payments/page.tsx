"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { fetchPayments, Payment } from "@/src/redux/slice/awol/paymentSlice";

export default function PaymentsPage() {
  const dispatch = useAppDispatch();
  const { token } = useSelector((state: RootState) => state.user);

  const [search, setSearch] = useState("");
  const [receiver, setReceiver] = useState("");
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [model, setModel] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [previous, setPrevious] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { payments, status, error } = useSelector((state: RootState) => state.payment);

  useEffect(() => {
    if (token) dispatch(fetchPayments({
      token,
      params: {
        search,
        receiver,
        customer,
        product,
        model,
        min_amount: minAmount,
        max_amount: maxAmount,
        date_from: fromDate,
        date_to: toDate,
      },
    })
  );
  }, [
    token, 
    search,
    receiver,
    customer,
    product,
    model,
    minAmount,
    maxAmount,
    fromDate,
    toDate,
  ]);

  const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });
  

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Payments
        </h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if(status === "succeeded" ) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
          Payments
        </h1>

        {/* FILTERS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            placeholder="Search reference, notes, customer..."
            className="filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            placeholder="Receiver"
            className="filter-input"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />

          <input
            placeholder="Customer"
            className="filter-input"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />

          <input
            placeholder="Product"
            className="filter-input"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />

          <input
            placeholder="Model"
            className="filter-input"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <input
            type="number"
            placeholder="Min Amount"
            className="filter-input"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Amount"
            className="filter-input"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />

          <input
            type="date"
            className="filter-input"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            className="filter-input"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Date</th>
                <th className="p-3">Receiver</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p: any) => (
                <tr
                  key={p.id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">
                    {p.customer_name}
                  </td>
                  <td className="p-3">
                    {p.product_name} - {p.model_name}
                  </td>
                  <td className="p-3 font-semibold">
                    {currency.format(p.amount_paid)}
                  </td>
                  <td className="p-3">{p.method}</td>
                  <td className="p-3">{p.payment_date}</td>
                  <td className="p-3">{p.received_by}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedPayment(p)}
                      className="text-blue-600 hover:underline"
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
            <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
              <button
                className="mb-4 text-red-500"
                onClick={() => setSelectedPayment(null)}
              >
                Close
              </button>

              <h2 className="text-xl font-semibold mb-4">
                Payment Details
              </h2>

              <p><strong>Customer:</strong> {selectedPayment.customer_name}</p>
              <p><strong>Product:</strong> {selectedPayment.product_name}</p>
              <p><strong>Model:</strong> {selectedPayment.model_name}</p>
              <p><strong>Amount:</strong> {currency.format(selectedPayment.amount_paid)}</p>
              <p><strong>Method:</strong> {selectedPayment.method}</p>
              <p><strong>Reference:</strong> {selectedPayment.reference}</p>
              <p><strong>Received By:</strong> {selectedPayment.received_by}</p>
              <p><strong>Date:</strong> {selectedPayment.payment_date}</p>
              <p><strong>Notes:</strong> {selectedPayment.notes}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            disabled={!previous}
            onClick={() =>
              dispatch(
                fetchPayments({
                  token,
                  params: { page: previous?.split("page=")[1] },
                })
              )
            }
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={!next}
            onClick={() =>
              dispatch(
                fetchPayments({
                  token,
                  params: { page: next?.split("page=")[1] },
                })
              )
            }
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <style jsx>{`
          .filter-input {
            @apply border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white;
          }
        `}</style>
      </div>
    );
  }
}