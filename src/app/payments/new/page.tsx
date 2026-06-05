"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { addPayment } from "@/src/redux/slice/awol/paymentSlice";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400";
const labelClass = "font-medium text-slate-700 dark:text-slate-200";
const hintClass = "text-sm text-slate-500 dark:text-slate-400";

export default function NewPayment() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [sale, setSale] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  function validate() {
    if (!sale) return "Contract ID is required";
    if (Number(sale) <= 0) return "Invalid Contract ID";
    if (!amount) return "Payment amount is required";
    if (Number(amount) <= 0) return "Amount must be greater than zero";

    return "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!user?.token) {
      setError("You are not logged in");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await dispatch(
        addPayment({
          token: user.token,
          data: {
            sale: Number(sale),
            amount_paid: Number(amount),
            method,
            notes,
          },
        })
      ).unwrap();

      router.push("/customers");
    } catch (err: any) {
      setError(err?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <form
        onSubmit={submit}
        className="mx-auto max-w-2xl space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">
          Record Payment
        </h1>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className={labelClass}>Contract ID</label>
          <p className={hintClass}>Enter the ID of the customer&apos;s active contract.</p>
          <input
            type="number"
            className={inputClass}
            value={sale}
            onChange={(e) => setSale(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Amount Paid</label>
          <p className={hintClass}>Enter the amount the customer is paying now.</p>
          <input
            type="number"
            className={inputClass}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {Number(amount) > 0 && (
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">
              {currency.format(Number(amount))}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Payment Method</label>
          <p className={hintClass}>Select how the customer made this payment.</p>

          <select
            className={inputClass}
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="transfer">Bank Transfer</option>
            <option value="pos">POS</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Notes (Optional)</label>
          <textarea
            className={inputClass}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-md bg-slate-950 py-3 font-medium text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {loading ? "Saving Payment..." : "Save Payment"}
        </button>
      </form>
    </div>
  );
}
