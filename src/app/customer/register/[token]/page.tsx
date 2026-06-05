"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BadgeCheck, BatteryCharging, CreditCard, ShoppingBag } from "lucide-react";
import api from "@/src/api";

type ProductModel = {
  id: number;
  model_name: string;
  product_name?: string;
  company_name?: string;
  cash_price: number | string;
  installment_price?: number | string;
  down_payment?: number | string;
  installment_months: number;
  installment_allowed: boolean;
  features?: Record<string, string>;
};

type Company = {
  id: number;
  name: string;
  products: {
    id: number;
    name: string;
    models: ProductModel[];
  }[];
};

const emptyForm = {
  full_name: "",
  phone: "",
  email: "",
  alt_phone: "",
  address: "",
  city: "",
  state: "",
  id_type: "nin",
  id_number: "",
  guarantor_name: "",
  guarantor_phone: "",
  employment_status: "salary",
  employer_name: "",
  monthly_income: "",
  monthly_existing_debt: "0",
  requested_down_payment: "",
  requested_months: "",
  bank_name: "",
  account_number: "",
  bvn_last4: "",
  business_address: "",
  years_at_address: "1",
  years_employed_or_trading: "1",
};

const formatMoney = (value?: number | string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function CustomerInviteRegistrationPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [purchaseType, setPurchaseType] = useState<"cash" | "credit">("cash");
  const [quote, setQuote] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "submitting" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const models = useMemo(
    () =>
      companies.flatMap((company) =>
        company.products.flatMap((product) =>
          product.models.map((model) => ({
            ...model,
            product_name: product.name,
            company_name: company.name,
          }))
        )
      ),
    [companies]
  );

  const selectedModel = useMemo(
    () => models.find((model) => String(model.id) === selectedModelId) || null,
    [models, selectedModelId]
  );

  useEffect(() => {
    async function load() {
      try {
        const [inviteRes, companiesRes] = await Promise.all([
          api.get(`v1/customer-awol/customers/invites/${token}/`),
          api.get("v1/customer-awol/companies-products"),
        ]);

        const invite = inviteRes.data;
        if (invite.status !== "pending") {
          setStatus("error");
          setMessage("This registration link has already been used or is no longer active.");
          return;
        }

        setForm((current) => ({
          ...current,
          full_name: invite.full_name || "",
          phone: invite.phone || "",
          email: invite.email || "",
        }));
        setCompanies(companiesRes.data || []);
        setStatus("ready");
      } catch {
        setStatus("error");
        setMessage("Could not load this registration link.");
      }
    }

    if (token) load();
  }, [token]);

  useEffect(() => {
    if (!selectedModel) return;
    setForm((current) => ({
      ...current,
      requested_down_payment: String(selectedModel.down_payment || ""),
      requested_months: String(selectedModel.installment_months || ""),
    }));
    setQuote(null);
    if (!selectedModel.installment_allowed && purchaseType === "credit") {
      setPurchaseType("cash");
    }
  }, [selectedModel, purchaseType]);

  function updateForm(key: keyof typeof emptyForm, value: string) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (["requested_down_payment", "requested_months", "monthly_income", "monthly_existing_debt"].includes(key)) {
      fetchQuote(next);
    }
  }

  async function fetchQuote(nextForm = form) {
    if (!selectedModel?.installment_allowed) return;

    try {
      const res = await api.post("v1/customer-awol/credit/quote/", {
        product_model: selectedModel.id,
        down_payment: Number(nextForm.requested_down_payment || selectedModel.down_payment || 0),
        months: Number(nextForm.requested_months || selectedModel.installment_months || 1),
        monthly_income: Number(nextForm.monthly_income || 0),
        monthly_existing_debt: Number(nextForm.monthly_existing_debt || 0),
      });
      setQuote(res.data);
    } catch {
      setQuote(null);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selectedModel) {
      setMessage("Please select a product model.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const payload: Record<string, any> = {
      ...form,
      invite_token: token,
      product_model: selectedModel.id,
      purchase_type: purchaseType,
    };

    if (purchaseType === "credit") {
      payload.monthly_income = Number(form.monthly_income || 0);
      payload.monthly_existing_debt = Number(form.monthly_existing_debt || 0);
      payload.requested_down_payment = Number(form.requested_down_payment || selectedModel.down_payment || 0);
      payload.requested_months = Number(form.requested_months || selectedModel.installment_months || 1);
      payload.years_at_address = Number(form.years_at_address || 0);
      payload.years_employed_or_trading = Number(form.years_employed_or_trading || 0);
    }

    try {
      const res = await api.post("v1/customer-awol/customers/register/", payload);
      setQuote(res.data?.quote || quote);
      setStatus("success");
      setMessage(
        purchaseType === "credit"
          ? `Application submitted. Decision: ${res.data?.credit_application?.status || "review"}.`
          : "Registration submitted. AWOL will contact you shortly."
      );
    } catch (error: any) {
      setStatus("ready");
      setMessage(error?.response?.data ? JSON.stringify(error.response.data) : "Registration failed. Check your details and try again.");
    }
  }

  if (status === "loading") {
    return <main className="min-h-screen bg-slate-50 p-6 text-slate-700">Loading registration link...</main>;
  }

  if (status === "error") {
    return <main className="min-h-screen bg-slate-50 p-6 text-red-700">{message}</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f8f3] px-4 py-8 text-slate-950">
      <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <ShoppingBag size={16} />
            AWOL customer registration
          </div>
          <h1 className="mt-3 text-2xl font-semibold">Choose your product</h1>

          <select
            required
            value={selectedModelId}
            onChange={(event) => setSelectedModelId(event.target.value)}
            className="mt-5 h-11 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500"
          >
            <option value="">Select product model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.company_name} - {model.product_name} - {model.model_name}
              </option>
            ))}
          </select>

          {selectedModel && (
            <div className="mt-5 space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <BatteryCharging size={18} />
                  <span className="text-sm font-medium">{selectedModel.company_name}</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold">{selectedModel.model_name}</h2>
                <p className="text-sm text-slate-500">{selectedModel.product_name}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Cash price</div>
                    <div className="font-semibold">{formatMoney(selectedModel.cash_price)}</div>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Installment price</div>
                    <div className="font-semibold">{selectedModel.installment_allowed ? formatMoney(selectedModel.installment_price) : "N/A"}</div>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Term</div>
                    <div className="font-semibold">{selectedModel.installment_allowed ? `${selectedModel.installment_months} months` : "Cash only"}</div>
                  </div>
                </div>
              </div>

              {selectedModel.features && Object.keys(selectedModel.features).length > 0 && (
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="font-semibold">Product features</h3>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {Object.entries(selectedModel.features).map(([key, value]) => (
                      <div key={key} className="rounded-md bg-slate-50 p-3 text-sm">
                        <span className="font-medium capitalize">{key.replaceAll("_", " ")}: </span>
                        <span className="text-slate-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex rounded-md border border-slate-200 bg-slate-50 p-1">
                <button type="button" onClick={() => setPurchaseType("cash")} className={`flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold ${purchaseType === "cash" ? "bg-white shadow-sm" : "text-slate-500"}`}>
                  <ShoppingBag size={16} />
                  Cash
                </button>
                <button type="button" disabled={!selectedModel.installment_allowed} onClick={() => setPurchaseType("credit")} className={`flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold disabled:opacity-40 ${purchaseType === "credit" ? "bg-white shadow-sm" : "text-slate-500"}`}>
                  <CreditCard size={16} />
                  Easy Buy
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Your details</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input required placeholder="Full name" value={form.full_name} onChange={(event) => updateForm("full_name", event.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
            <input required placeholder="Phone number" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
            <input placeholder="Email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
            <input placeholder="Alternate phone" value={form.alt_phone} onChange={(event) => updateForm("alt_phone", event.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
            <input required placeholder="City" value={form.city} onChange={(event) => updateForm("city", event.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
            <input required placeholder="State" value={form.state} onChange={(event) => updateForm("state", event.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
          </div>
          <textarea required placeholder="Address" value={form.address} onChange={(event) => updateForm("address", event.target.value)} className="mt-3 min-h-20 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500" />

          {purchaseType === "credit" && (
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-3 flex items-center gap-2 font-semibold text-emerald-900">
                <BadgeCheck size={18} />
                Easy Buy details
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={form.employment_status} onChange={(event) => updateForm("employment_status", event.target.value)} className="h-11 rounded-md border border-emerald-200 bg-white px-3">
                  <option value="salary">Salary earner</option>
                  <option value="business">Business owner</option>
                  <option value="self_employed">Self employed</option>
                  <option value="student">Student</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="other">Other</option>
                </select>
                <input placeholder="Employer or business name" value={form.employer_name} onChange={(event) => updateForm("employer_name", event.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                <input required type="number" placeholder="Monthly income" value={form.monthly_income} onChange={(event) => updateForm("monthly_income", event.target.value)} onBlur={() => fetchQuote()} className="h-11 rounded-md border border-emerald-200 px-3" />
                <input type="number" placeholder="Existing monthly debt" value={form.monthly_existing_debt} onChange={(event) => updateForm("monthly_existing_debt", event.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                <input type="number" placeholder="Down payment" value={form.requested_down_payment} onChange={(event) => updateForm("requested_down_payment", event.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                <input type="number" placeholder="Months" value={form.requested_months} onChange={(event) => updateForm("requested_months", event.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                <select value={form.id_type} onChange={(event) => updateForm("id_type", event.target.value)} className="h-11 rounded-md border border-emerald-200 bg-white px-3">
                  <option value="nin">NIN</option>
                  <option value="drivers_license">Driver license</option>
                  <option value="voters_card">Voter card</option>
                  <option value="passport">Passport</option>
                </select>
                <input required placeholder="ID number" value={form.id_number} onChange={(event) => updateForm("id_number", event.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                <input required placeholder="Guarantor name" value={form.guarantor_name} onChange={(event) => updateForm("guarantor_name", event.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                <input required placeholder="Guarantor phone" value={form.guarantor_phone} onChange={(event) => updateForm("guarantor_phone", event.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
              </div>
              {quote && (
                <div className="mt-4 grid gap-3 rounded-md bg-white p-3 text-sm sm:grid-cols-3">
                  <div><span className="text-slate-500">Monthly</span><div className="font-semibold">{formatMoney(quote.monthly_payment)}</div></div>
                  <div><span className="text-slate-500">Max affordable</span><div className="font-semibold">{formatMoney(quote.max_monthly_payment)}</div></div>
                  <div><span className="text-slate-500">Status</span><div className={`font-semibold ${quote.affordable ? "text-emerald-700" : "text-amber-700"}`}>{quote.affordable ? "Looks affordable" : "Needs review"}</div></div>
                </div>
              )}
            </div>
          )}

          {message && (
            <div className={`mt-4 rounded-md p-3 text-sm ${status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          <button disabled={status === "submitting" || status === "success"} className="mt-5 w-full rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {status === "submitting" ? "Submitting..." : "Submit Registration"}
          </button>
        </section>
      </form>
    </main>
  );
}
