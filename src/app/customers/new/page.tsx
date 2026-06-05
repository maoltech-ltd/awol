"use client";

import { FormEvent, useState } from "react";
import { Copy, Link as LinkIcon, Send } from "lucide-react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { createCustomerInvite } from "@/src/redux/slice/awol/customerSlice";
import { RootState } from "@/src/redux/store";

export default function NewCustomerInvitePage() {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    note: "",
  });
  const [publicUrl, setPublicUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!user?.token) return;

    setLoading(true);
    setMessage("");
    setPublicUrl("");

    try {
      const res = await dispatch(
        createCustomerInvite({
          token: user.token,
          data: {
            ...form,
            frontend_base_url: window.location.origin,
          },
        })
      ).unwrap();

      setPublicUrl(res.public_url);
      setMessage("Customer link created.");
    } catch (error: any) {
      setMessage(error?.response?.data ? JSON.stringify(error.response.data) : "Could not create customer link.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setMessage("Link copied.");
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 dark:bg-gray-900">
      <section className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <LinkIcon size={16} />
            Customer onboarding link
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
            Start Customer Registration
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create a secure link, copy it, and send it to the customer yourself.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Customer name</label>
            <input
              value={form.full_name}
              onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
              className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 outline-none focus:border-emerald-500"
              placeholder="Optional prefill"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Phone</label>
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 outline-none focus:border-emerald-500"
              placeholder="Optional prefill"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Internal note</label>
            <textarea
              value={form.note}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              className="mt-1 min-h-24 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-emerald-500"
              placeholder="Optional note for staff"
            />
          </div>

          <button
            disabled={loading || !user?.token}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-gray-950"
          >
            <Send size={17} />
            {loading ? "Creating link..." : "Create Link"}
          </button>
        </form>

        {publicUrl && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <label className="text-sm font-medium text-emerald-900">Send this link to the customer</label>
            <div className="mt-2 flex gap-2">
              <input readOnly value={publicUrl} className="h-11 flex-1 rounded-md border border-emerald-200 bg-white px-3 text-sm text-gray-800" />
              <button onClick={copyLink} className="inline-flex h-11 items-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white">
                <Copy size={16} />
                Copy
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-200">
            {message}
          </div>
        )}
      </section>
    </main>
  );
}
