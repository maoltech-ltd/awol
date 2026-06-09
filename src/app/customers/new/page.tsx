"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Copy, Link as LinkIcon, Plus, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { addCustomer, createCustomerInvite } from "@/src/redux/slice/awol/customerSlice";
import { RootState } from "@/src/redux/store";
import api from "@/src/api";

type Mode = "direct" | "invite";

const inputClass =
  "mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400";

const textAreaClass =
  "mt-1 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400";

const labelClass = "text-sm font-medium text-slate-800 dark:text-slate-100";

export default function NewCustomerPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const [mode, setMode] = useState<Mode>("direct");
  const [directForm, setDirectForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    alt_phone: "",
    address: "",
    city: "",
    state: "",
    customer_type: "cash_buyer",
    id_type: "",
    id_number: "",
    guarantor_name: "",
    guarantor_phone: "",
  });
  const [inviteForm, setInviteForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    note: "",
    selected_product_model: "",
    custom_cash_price: "",
    custom_installment_price: "",
    custom_down_payment: "",
    custom_installment_months: "",
  });
  const [products, setProducts] = useState<any[]>([]);
  const [productModels, setProductModels] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("mode") === "invite" ? "invite" : "direct");
  }, []);

  useEffect(() => {
    if (!user?.token || mode !== "invite") return;

    api
      .get("v1/awol/products/?page=1", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setProducts(res.data.results || res.data || []))
      .catch(() => setProducts([]));
  }, [user?.token, mode]);

  useEffect(() => {
    if (!user?.token || !selectedProductId) {
      setProductModels([]);
      return;
    }

    api
      .get(`v1/awol/products/${selectedProductId}/`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setProductModels(res.data.models || []))
      .catch(() => setProductModels([]));
  }, [user?.token, selectedProductId]);

  function updateDirect(name: string, value: string) {
    setDirectForm((current) => ({ ...current, [name]: value }));
  }

  function updateInvite(name: string, value: string) {
    setInviteForm((current) => ({ ...current, [name]: value }));
  }

  function selectProduct(productId: string) {
    setSelectedProductId(productId);
    setProductModels([]);
    setInviteForm((current) => ({
      ...current,
      selected_product_model: "",
      custom_cash_price: "",
      custom_installment_price: "",
      custom_down_payment: "",
      custom_installment_months: "",
    }));
  }

  function selectProductModel(modelId: string) {
    const model = productModels.find((item) => String(item.id) === modelId);
    setInviteForm((current) => ({
      ...current,
      selected_product_model: modelId,
      custom_cash_price: model ? String(model.cash_price || "") : "",
      custom_installment_price: model ? String(model.installment_price || "") : "",
      custom_down_payment: model ? String(model.down_payment || "") : "",
      custom_installment_months: model ? String(model.installment_months || "") : "",
    }));
  }

  async function submitDirect(event: FormEvent) {
    event.preventDefault();
    if (!user?.token) return;

    setLoading(true);
    setMessage("");

    try {
      await dispatch(addCustomer({ token: user.token, data: directForm })).unwrap();
      setMessage("Customer added successfully.");
      router.push("/customers");
    } catch (error: any) {
      setMessage(error?.response?.data ? JSON.stringify(error.response.data) : "Could not add customer.");
    } finally {
      setLoading(false);
    }
  }

  async function submitInvite(event: FormEvent) {
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
            ...Object.fromEntries(
              Object.entries(inviteForm).filter(([, value]) => value !== "")
            ),
            frontend_base_url: window.location.origin,
          },
        })
      ).unwrap();

      setPublicUrl(res.public_url);
      setMessage("Unique customer link generated.");
    } catch (error: any) {
      setMessage(error?.response?.data ? JSON.stringify(error.response.data) : "Could not generate customer link.");
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
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            {mode === "direct" ? <Plus size={16} /> : <LinkIcon size={16} />}
            {mode === "direct" ? "Admin adds customer" : "Customer registration link"}
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
            {mode === "direct" ? "Add Customer" : "Generate Customer Link"}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {mode === "direct"
              ? "Use this when staff will enter the customer information directly."
              : "Each generated link contains a unique backend UUID token and opens the customer registration form."}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-950 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setMode("direct");
              setMessage("");
              setPublicUrl("");
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition ${
              mode === "direct"
                ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            <Plus size={16} />
            Add Customer
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("invite");
              setMessage("");
            }}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition ${
              mode === "invite"
                ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            <LinkIcon size={16} />
            Create Link
          </button>
        </div>

        {mode === "direct" ? (
          <form onSubmit={submitDirect} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Customer name</label>
                <input required value={directForm.full_name} onChange={(event) => updateDirect("full_name", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input required value={directForm.phone} onChange={(event) => updateDirect("phone", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={directForm.email} onChange={(event) => updateDirect("email", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Alternative phone</label>
                <input value={directForm.alt_phone} onChange={(event) => updateDirect("alt_phone", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input value={directForm.city} onChange={(event) => updateDirect("city", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input value={directForm.state} onChange={(event) => updateDirect("state", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Customer type</label>
                <select value={directForm.customer_type} onChange={(event) => updateDirect("customer_type", event.target.value)} className={inputClass}>
                  <option value="cash_buyer">Cash Buyer</option>
                  <option value="credit_applicant">Credit Applicant</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>ID type</label>
                <input value={directForm.id_type} onChange={(event) => updateDirect("id_type", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>ID number</label>
                <input value={directForm.id_number} onChange={(event) => updateDirect("id_number", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Guarantor phone</label>
                <input value={directForm.guarantor_phone} onChange={(event) => updateDirect("guarantor_phone", event.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <textarea required value={directForm.address} onChange={(event) => updateDirect("address", event.target.value)} className={textAreaClass} />
            </div>
            <div>
              <label className={labelClass}>Guarantor name</label>
              <input value={directForm.guarantor_name} onChange={(event) => updateDirect("guarantor_name", event.target.value)} className={inputClass} />
            </div>

            <button disabled={loading || !user?.token} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              <Check size={17} />
              {loading ? "Adding customer..." : "Add Customer"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitInvite} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Customer name</label>
                <input value={inviteForm.full_name} onChange={(event) => updateInvite("full_name", event.target.value)} className={inputClass} placeholder="Optional prefill" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input value={inviteForm.phone} onChange={(event) => updateInvite("phone", event.target.value)} className={inputClass} placeholder="Optional prefill" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={inviteForm.email} onChange={(event) => updateInvite("email", event.target.value)} className={inputClass} placeholder="Optional prefill" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Product</label>
                <select value={selectedProductId} onChange={(event) => selectProduct(event.target.value)} className={inputClass}>
                  <option value="">No fixed product</option>
                  {products.map((product: any) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Model</label>
                <select value={inviteForm.selected_product_model} onChange={(event) => selectProductModel(event.target.value)} className={inputClass} disabled={!selectedProductId}>
                  <option value="">Select model</option>
                  {productModels.map((model: any) => (
                    <option key={model.id} value={model.id}>
                      {model.model_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {inviteForm.selected_product_model && (
              <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Cash price</label>
                  <input type="number" min="1" value={inviteForm.custom_cash_price} onChange={(event) => updateInvite("custom_cash_price", event.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Easy Buy total</label>
                  <input type="number" min="1" value={inviteForm.custom_installment_price} onChange={(event) => updateInvite("custom_installment_price", event.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Easy Buy down payment</label>
                  <input type="number" min="0" value={inviteForm.custom_down_payment} onChange={(event) => updateInvite("custom_down_payment", event.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Easy Buy months</label>
                  <input type="number" min="1" value={inviteForm.custom_installment_months} onChange={(event) => updateInvite("custom_installment_months", event.target.value)} className={inputClass} />
                </div>
              </div>
            )}
            <div>
              <label className={labelClass}>Internal note</label>
              <textarea value={inviteForm.note} onChange={(event) => updateInvite("note", event.target.value)} className={textAreaClass} placeholder="Optional note for staff" />
            </div>

            <button disabled={loading || !user?.token} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
              <Send size={17} />
              {loading ? "Generating link..." : "Generate Unique Link"}
            </button>
          </form>
        )}

        {publicUrl && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
            <label className="text-sm font-medium text-emerald-950 dark:text-emerald-100">
              Unique customer registration link
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input readOnly value={publicUrl} className="h-11 flex-1 rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 dark:border-emerald-800 dark:bg-slate-950 dark:text-white" />
              <button onClick={copyLink} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
                <Copy size={16} />
                Copy Link
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
            {message}
          </div>
        )}
      </section>
    </main>
  );
}
