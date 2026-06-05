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
    dispatch
  ]);

  const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });
  const inputClass =
    "rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400";
  

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
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

        <h1 className="mb-8 text-3xl font-bold text-slate-950 dark:text-white">
          Payments
        </h1>

        {/* FILTERS */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { value: search, set: setSearch, placeholder: "Search..." },
            { value: receiver, set: setReceiver, placeholder: "Receiver" },
            { value: customer, set: setCustomer, placeholder: "Customer" },
            { value: product, set: setProduct, placeholder: "Product" },
            { value: model, set: setModel, placeholder: "Model" },
          ].map((f, i) => (
            <input
              key={i}
              placeholder={f.placeholder}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className={inputClass}
            />
          ))}

          <input type="number" placeholder="Min Amount"
            className={inputClass}
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />

          <input type="number" placeholder="Max Amount"
            className={inputClass}
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />

          <input type="date" className={inputClass} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" className={inputClass} value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full">
            <thead className="bg-emerald-50 text-slate-700 dark:bg-emerald-950/40 dark:text-slate-200">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Product</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Date</th>
                <th className="p-4">Receiver</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-slate-700 dark:divide-slate-800 dark:text-slate-200">
              {payments.map((p: any) => (
                <tr
                  key={p.id}
                  className="cursor-pointer transition hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                >
                  <td className="p-4">{p.customer_name}</td>
                  <td className="p-4">{p.product_name} - {p.model_name}</td>

                  <td className="p-4 font-semibold text-emerald-700 dark:text-emerald-300">
                    {currency.format(p.amount_paid)}
                  </td>

                  <td className="p-4">{p.method}</td>
                  <td className="p-4">{p.payment_date}</td>
                  <td className="p-4">{p.received_by}</td>

                  <td className="p-4">
                    <button
                      onClick={() => setSelectedPayment(p)}
                      className="font-medium text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
            <div className="w-full bg-white p-6 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-slate-100 md:w-[400px]">

              <button
                onClick={() => setSelectedPayment(null)}
                className="text-red-500 mb-4"
              >
                Close
              </button>

              <h2 className="mb-4 text-xl font-semibold text-slate-950 dark:text-white">Payment Details</h2>

              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <p><b>Customer:</b> {selectedPayment.customer_name}</p>
                <p><b>Product:</b> {selectedPayment.product_name}</p>
                <p><b>Model:</b> {selectedPayment.model_name}</p>
                <p className="font-bold text-emerald-700 dark:text-emerald-300">
                  {currency.format(selectedPayment.amount_paid)}
                </p>
                <p><b>Method:</b> {selectedPayment.method}</p>
                <p><b>Reference:</b> {selectedPayment.reference}</p>
                <p><b>Date:</b> {selectedPayment.payment_date}</p>
                <p><b>Notes:</b> {selectedPayment.notes}</p>
              </div>
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
            className="rounded-md bg-slate-200 px-4 py-2 text-slate-800 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100"
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
            className="rounded-md bg-slate-200 px-4 py-2 text-slate-800 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-100"
          >
            Next
          </button>
        </div>

      </div>
    );
  }
}
