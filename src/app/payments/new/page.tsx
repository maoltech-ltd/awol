"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { addPayment } from "@/src/redux/slice/awol/paymentSlice";

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <form
        onSubmit={submit}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Record Payment
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        {/* CONTRACT ID */}
        <div>
          <label className="font-medium text-gray-700 dark:text-gray-200">
            Contract ID
          </label>
          <p className="text-sm text-gray-500">
            Enter the ID of the customer’s active contract.
          </p>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
            value={sale}
            onChange={(e) => setSale(e.target.value)}
          />
        </div>

        {/* AMOUNT */}
        <div>
          <label className="font-medium text-gray-700 dark:text-gray-200">
            Amount Paid
          </label>
          <p className="text-sm text-gray-500">
            Enter the amount the customer is paying now.
          </p>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {Number(amount) > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              {currency.format(Number(amount))}
            </p>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div>
          <label className="font-medium text-gray-700 dark:text-gray-200">
            Payment Method
          </label>
          <p className="text-sm text-gray-500">
            Select how the customer made this payment.
          </p>

          <select
            className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="transfer">Bank Transfer</option>
            <option value="pos">POS</option>
          </select>
        </div>

        {/* NOTES */}
        <div>
          <label className="font-medium text-gray-700 dark:text-gray-200">
            Notes (Optional)
          </label>
          <textarea
            className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded font-medium hover:opacity-90 transition"
        >
          {loading ? "Saving Payment..." : "Save Payment"}
        </button>
      </form>
    </div>
  );
}