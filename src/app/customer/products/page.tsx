"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  BatteryCharging,
  Calculator,
  CreditCard,
  Filter,
  Search,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import api from "@/src/api";
import WhatsAppButton from "@/src/components/Buttons/WhatsAppButton";

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
  default_image?: string;
  other_images?: string[];
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  features?: Record<string, string>;
};

type Product = {
  id: number;
  name: string;
  models: ProductModel[];
};

type Company = {
  id: number;
  name: string;
  company_type: string;
  products: Product[];
};

type RegistrationMode = "cash" | "credit";

const formatMoney = (value?: number | string) => {
  const numeric = Number(value || 0);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(numeric);
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

export default function ProductsPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selected, setSelected] = useState<ProductModel | null>(null);
  const [mode, setMode] = useState<RegistrationMode>("cash");
  const [form, setForm] = useState(emptyForm);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [installmentOnly, setInstallmentOnly] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [agreementAccepted, setAgreementAccepted] = useState(false);

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

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchProduct) params.append("product", searchProduct);
    if (searchModel) params.append("model", searchModel);
    if (companyFilter) params.append("company", companyFilter);
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);
    if (installmentOnly) params.append("installment_allowed", "true");

    api.get(`v1/customer-awol/companies-products?${params.toString()}`).then((res) => {
      setCompanies(res.data || []);
    });
  }, [searchProduct, searchModel, companyFilter, minPrice, maxPrice, installmentOnly]);

  useEffect(() => {
    if (!selected || !mode) return;
    setForm((current) => ({
      ...current,
      requested_down_payment: String(selected.down_payment || ""),
      requested_months: String(selected.installment_months || ""),
    }));
    setQuote(null);
    setSubmitState("idle");
    setMessage("");
    setAgreementAccepted(false);
  }, [selected, mode]);

  async function fetchQuote(nextForm = form) {
    if (!selected?.installment_allowed) return;

    try {
      const res = await api.post("v1/customer-awol/credit/quote/", {
        product_model: selected.id,
        down_payment: Number(nextForm.requested_down_payment || selected.down_payment || 0),
        months: Number(nextForm.requested_months || selected.installment_months || 1),
        monthly_income: Number(nextForm.monthly_income || 0),
        monthly_existing_debt: Number(nextForm.monthly_existing_debt || 0),
      });
      setQuote(res.data);
    } catch {
      setQuote(null);
    }
  }

  function updateForm(key: keyof typeof emptyForm, value: string) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (["requested_down_payment", "requested_months", "monthly_income", "monthly_existing_debt"].includes(key)) {
      fetchQuote(next);
    }
  }

  async function submitRegistration(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    if (!agreementAccepted) {
      setSubmitState("error");
      setMessage("Please read and accept the customer agreement before submitting.");
      return;
    }

    setSubmitState("loading");
    setMessage("");

    const payload: Record<string, any> = {
      ...form,
      product_model: selected.id,
      purchase_type: mode,
    };

    if (mode === "credit") {
      payload.monthly_income = Number(form.monthly_income || 0);
      payload.monthly_existing_debt = Number(form.monthly_existing_debt || 0);
      payload.requested_down_payment = Number(form.requested_down_payment || selected.down_payment || 0);
      payload.requested_months = Number(form.requested_months || selected.installment_months || 1);
      payload.years_at_address = Number(form.years_at_address || 0);
      payload.years_employed_or_trading = Number(form.years_employed_or_trading || 0);
    }

    try {
      const res = await api.post("v1/customer-awol/customers/register/", payload);
      setSubmitState("success");
      const status = res.data?.credit_application?.status;
      const score = res.data?.credit_application?.score;
      setMessage(
        mode === "credit"
          ? `Application received. Decision: ${status || "review"}${score ? `, score ${score}/100` : ""}.`
          : "Your interest has been registered. AWOL will contact you shortly."
      );
      setQuote(res.data?.quote || quote);
      window.sessionStorage.setItem(
        "awolRegistrationSuccessMessage",
        mode === "credit"
          ? "Your Easy Buy application has been submitted successfully. AWOL will review your details and contact you shortly."
          : "Your registration has been submitted successfully. AWOL will contact you shortly."
      );
      router.push("/?registration=success");
    } catch (error: any) {
      setSubmitState("error");
      setMessage(error?.response?.data ? JSON.stringify(error.response.data) : "Registration failed. Check your details and try again.");
    }
  }

  const whatsappMessage = selected
    ? `Hello, I am interested in ${selected.model_name}%0AProduct: ${selected.product_name}%0APrice: ${formatMoney(selected.cash_price)}%0ABNPL: ${selected.installment_allowed ? "Yes" : "No"}`
    : "";

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <ShieldCheck size={16} />
              Cash, Easy Buy, and solar-ready products
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal md:text-5xl">
              AWOL Energy product store
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Compare solar, mobility, and energy devices with transparent cash pricing, installment terms, and an eligibility check before you apply.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#products" className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                <ShoppingBag size={18} />
                Browse products
              </a>
              <a href="/customer/solar/calculator" className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                <Calculator size={18} />
                Solar calculator
              </a>
            </div>
          </div>

          <div className="grid content-end gap-3 rounded-lg border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Products", models.length],
                ["BNPL ready", models.filter((item) => item.installment_allowed).length],
                ["Featured", models.filter((item) => item.is_featured).length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-white/10 p-4">
                  <div className="text-2xl font-semibold">{value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-300">{label}</div>
                </div>
              ))}
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Easy Buy estimates use income, existing debt, down payment, guarantor details, and product terms. Final approval still requires staff verification.
            </p>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1fr_0.8fr_0.6fr_0.6fr_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} placeholder="Search product" className="h-11 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500" />
          </label>
          <input value={searchModel} onChange={(e) => setSearchModel(e.target.value)} placeholder="Search model" className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
          <input value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} placeholder="Company" className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
          <label className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm">
            <input type="checkbox" checked={installmentOnly} onChange={(e) => setInstallmentOnly(e.target.checked)} />
            Easy Buy
          </label>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {models.map((model) => (
            <motion.button
              key={model.id}
              type="button"
              whileHover={{ y: -4 }}
              onClick={() => setSelected(model)}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                {model.default_image ? (
                  <Image src={model.default_image} alt={model.model_name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-emerald-600">
                    <BatteryCharging size={42} />
                  </div>
                )}
                {model.is_featured && <span className="absolute left-3 top-3 rounded bg-amber-400 px-2 py-1 text-xs font-semibold text-slate-950">Featured</span>}
              </div>
              <div className="p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{model.company_name}</div>
                <h2 className="mt-1 min-h-12 text-base font-semibold leading-6 text-slate-950">{model.model_name}</h2>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-emerald-700">{formatMoney(model.cash_price)}</div>
                    <div className="mt-1 text-xs text-slate-500">{model.stock_quantity > 0 ? `${model.stock_quantity} in stock` : "Confirm availability"}</div>
                  </div>
                  {model.installment_allowed && (
                    <div className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      Easy Buy
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {models.length === 0 && (
          <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No product models match the current filters.
          </div>
        )}
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 bg-slate-950/70 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="mx-auto grid max-h-[92vh] max-w-6xl overflow-y-auto rounded-lg bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-72 bg-slate-100 lg:min-h-full">
                {selected.default_image ? (
                  <Image src={selected.default_image} alt={selected.model_name} fill sizes="50vw" className="object-cover" />
                ) : (
                  <div className="flex h-full min-h-72 items-center justify-center text-emerald-600">
                    <BatteryCharging size={72} />
                  </div>
                )}
              </div>

              <div className="p-5 md:p-7">
                <button onClick={() => setSelected(null)} className="ml-auto flex h-10 w-10 items-center justify-center rounded-md border border-slate-200">
                  <X size={20} />
                </button>

                <div className="mt-2 text-sm font-medium text-emerald-700">{selected.company_name}</div>
                <h2 className="mt-1 text-3xl font-semibold text-slate-950">{selected.model_name}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.product_name}</p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Cash price</div>
                    <div className="mt-1 font-semibold">{formatMoney(selected.cash_price)}</div>
                  </div>
                  <div className="rounded-md border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Down payment</div>
                    <div className="mt-1 font-semibold">{selected.installment_allowed ? formatMoney(selected.down_payment) : "N/A"}</div>
                  </div>
                  <div className="rounded-md border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Term</div>
                    <div className="mt-1 font-semibold">{selected.installment_allowed ? `${selected.installment_months} months` : "Cash only"}</div>
                  </div>
                </div>

                {selected.features && Object.keys(selected.features).length > 0 && (
                  <div className="mt-5">
                    <h3 className="font-semibold">Specifications</h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {Object.entries(selected.features).map(([key, value]) => (
                        <div key={key} className="rounded-md bg-slate-50 p-3 text-sm">
                          <span className="font-medium capitalize text-slate-700">{key.replaceAll("_", " ")}: </span>
                          <span className="text-slate-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex rounded-md border border-slate-200 bg-slate-50 p-1">
                  <button onClick={() => setMode("cash")} className={`flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold ${mode === "cash" ? "bg-white shadow-sm" : "text-slate-500"}`}>
                    <ShoppingBag size={16} />
                    Cash buyer
                  </button>
                  <button disabled={!selected.installment_allowed} onClick={() => setMode("credit")} className={`flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold disabled:opacity-40 ${mode === "credit" ? "bg-white shadow-sm" : "text-slate-500"}`}>
                    <CreditCard size={16} />
                    Easy Buy
                  </button>
                </div>

                <form onSubmit={submitRegistration} className="mt-5 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input required placeholder="Full name" value={form.full_name} onChange={(e) => updateForm("full_name", e.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
                    <input required placeholder="Phone number" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
                    <input placeholder="Email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
                    <input placeholder="Alternate phone" value={form.alt_phone} onChange={(e) => updateForm("alt_phone", e.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
                    <input required placeholder="City" value={form.city} onChange={(e) => updateForm("city", e.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
                    <input required placeholder="State" value={form.state} onChange={(e) => updateForm("state", e.target.value)} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500" />
                  </div>
                  <textarea required placeholder="Address" value={form.address} onChange={(e) => updateForm("address", e.target.value)} className="min-h-20 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500" />

                  {mode === "credit" && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <div className="mb-3 flex items-center gap-2 font-semibold text-emerald-900">
                        <BadgeCheck size={18} />
                        Eligibility details
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <select value={form.employment_status} onChange={(e) => updateForm("employment_status", e.target.value)} className="h-11 rounded-md border border-emerald-200 bg-white px-3">
                          <option value="salary">Salary earner</option>
                          <option value="business">Business owner</option>
                          <option value="self_employed">Self employed</option>
                          <option value="student">Student</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="other">Other</option>
                        </select>
                        <input placeholder="Employer or business name" value={form.employer_name} onChange={(e) => updateForm("employer_name", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input type="number" placeholder="Monthly income" value={form.monthly_income} onChange={(e) => updateForm("monthly_income", e.target.value)} onBlur={() => fetchQuote()} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input type="number" placeholder="Existing monthly debt" value={form.monthly_existing_debt} onChange={(e) => updateForm("monthly_existing_debt", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input type="number" placeholder="Down payment" value={form.requested_down_payment} onChange={(e) => updateForm("requested_down_payment", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input type="number" placeholder="Months" value={form.requested_months} onChange={(e) => updateForm("requested_months", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <select value={form.id_type} onChange={(e) => updateForm("id_type", e.target.value)} className="h-11 rounded-md border border-emerald-200 bg-white px-3">
                          <option value="nin">NIN</option>
                          <option value="drivers_license">Driver license</option>
                          <option value="voters_card">Voter card</option>
                          <option value="passport">Passport</option>
                        </select>
                        <input required placeholder="ID number" value={form.id_number} onChange={(e) => updateForm("id_number", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input required placeholder="Guarantor name" value={form.guarantor_name} onChange={(e) => updateForm("guarantor_name", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input required placeholder="Guarantor phone" value={form.guarantor_phone} onChange={(e) => updateForm("guarantor_phone", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input placeholder="Bank name" value={form.bank_name} onChange={(e) => updateForm("bank_name", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input placeholder="Account number" value={form.account_number} onChange={(e) => updateForm("account_number", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input maxLength={4} placeholder="BVN last 4 digits" value={form.bvn_last4} onChange={(e) => updateForm("bvn_last4", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input type="number" placeholder="Years at address" value={form.years_at_address} onChange={(e) => updateForm("years_at_address", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
                        <input type="number" placeholder="Years employed/trading" value={form.years_employed_or_trading} onChange={(e) => updateForm("years_employed_or_trading", e.target.value)} className="h-11 rounded-md border border-emerald-200 px-3" />
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
                    <div className={`rounded-md p-3 text-sm ${submitState === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {message}
                    </div>
                  )}

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <h3 className="font-semibold text-slate-950">Customer Agreement</h3>
                    <p className="mt-2">
                      I confirm that the information I provided is true and complete. I authorize AWOL to contact me about this purchase, verify my details where required, and use my information to process this registration or Easy Buy application.
                    </p>
                    <p className="mt-2">
                      I understand that product availability, pricing, payment terms, and Easy Buy approval are subject to AWOL confirmation. Submitting this form does not guarantee credit approval or product reservation until AWOL confirms it.
                    </p>
                    <label className="mt-3 flex items-start gap-3 font-medium text-slate-900">
                      <input
                        required
                        type="checkbox"
                        checked={agreementAccepted}
                        onChange={(event) => setAgreementAccepted(event.target.checked)}
                        className="mt-1"
                      />
                      <span>I have read and agree to the customer agreement.</span>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button disabled={submitState === "loading"} className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                      <Filter size={17} />
                      {submitState === "loading" ? "Submitting..." : mode === "credit" ? "Check eligibility" : "Register interest"}
                    </button>
                    <WhatsAppButton message={whatsappMessage} />
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
