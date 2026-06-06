"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  BatteryCharging,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  ExternalLink,
  Filter,
  Mail,
  MessageCircle,
  Send,
  Share2,
  ShoppingBag,
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

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<RegistrationMode>("cash");
  const [form, setForm] = useState(emptyForm);
  const [quote, setQuote] = useState<any>(null);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = useMemo(
    () =>
      companies
        .flatMap((company) =>
          company.products.flatMap((item) =>
            item.models.map((model) => ({
              ...model,
              product_name: item.name,
              company_name: company.name,
            }))
          )
        )
        .find((model) => String(model.id) === String(params.id)),
    [companies, params.id]
  );

  const productUrl = typeof window !== "undefined" ? window.location.href : "";
  const galleryImages = useMemo(
    () => [product?.default_image, ...(product?.other_images || [])].filter(Boolean) as string[],
    [product]
  );

  useEffect(() => {
    api
      .get("v1/customer-awol/companies-products")
      .then((res) => setCompanies(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!product || !mode) return;
    setForm((current) => ({
      ...current,
      requested_down_payment: String(product.down_payment || ""),
      requested_months: String(product.installment_months || ""),
    }));
    setQuote(null);
    setSubmitState("idle");
    setMessage("");
    setAgreementAccepted(false);
  }, [product, mode]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  async function fetchQuote(nextForm = form) {
    if (!product?.installment_allowed) return;

    try {
      const res = await api.post("v1/customer-awol/credit/quote/", {
        product_model: product.id,
        down_payment: Number(nextForm.requested_down_payment || product.down_payment || 0),
        months: Number(nextForm.requested_months || product.installment_months || 1),
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
    if (!product) return;
    if (!agreementAccepted) {
      setSubmitState("error");
      setMessage("Please read and accept the customer agreement before submitting.");
      return;
    }

    setSubmitState("loading");
    setMessage("");

    const payload: Record<string, any> = {
      ...form,
      product_model: product.id,
      purchase_type: mode,
    };

    if (mode === "credit") {
      payload.monthly_income = Number(form.monthly_income || 0);
      payload.monthly_existing_debt = Number(form.monthly_existing_debt || 0);
      payload.requested_down_payment = Number(form.requested_down_payment || product.down_payment || 0);
      payload.requested_months = Number(form.requested_months || product.installment_months || 1);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8f3] px-4 py-12 text-slate-950">
        <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-white p-8 text-slate-500">Loading product...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f7f8f3] px-4 py-12 text-slate-950">
        <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-white p-8">
          <Link href="/customer/products" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <ArrowLeft size={17} />
            Back to products
          </Link>
          <h1 className="mt-5 text-2xl font-semibold">Product not found</h1>
          <p className="mt-2 text-slate-600">This product may be unavailable or removed from the AWOL store.</p>
        </div>
      </main>
    );
  }

  const whatsappMessage = `Hello, I am interested in ${product.model_name}%0AProduct: ${product.product_name}%0APrice: ${formatMoney(product.cash_price)}%0ABNPL: ${product.installment_allowed ? "Yes" : "No"}%0ALink: ${productUrl}`;
  const activeImage = galleryImages[activeImageIndex];

  function showPreviousImage() {
    if (galleryImages.length < 2) return;
    setActiveImageIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  }

  function showNextImage() {
    if (galleryImages.length < 2) return;
    setActiveImageIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  }

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <Link href="/customer/products" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <ArrowLeft size={17} />
            Back to products
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="relative min-h-80 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 lg:min-h-[620px]">
            {activeImage ? (
              <Image src={activeImage} alt={product.model_name} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" priority />
            ) : (
              <div className="flex h-full min-h-80 items-center justify-center text-emerald-600">
                <BatteryCharging size={72} />
              </div>
            )}

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
                  aria-label="Previous product image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
                  aria-label="Next product image"
                >
                  <ChevronRight size={22} />
                </button>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-slate-950/65 px-3 py-2">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition ${index === activeImageIndex ? "bg-white" : "bg-white/45 hover:bg-white/75"}`}
                      aria-label={`Show product image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-md border bg-slate-100 transition ${
                    index === activeImageIndex ? "border-emerald-500 ring-2 ring-emerald-100" : "border-slate-200 hover:border-slate-400"
                  }`}
                  aria-label={`Open product image ${index + 1}`}
                >
                  <Image src={image} alt={product.model_name} fill sizes="(max-width: 768px) 22vw, 8vw" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="text-sm font-medium text-emerald-700">{product.company_name}</div>
          <h1 className="mt-1 text-3xl font-semibold text-slate-950 md:text-4xl">{product.model_name}</h1>
          <p className="mt-1 text-sm text-slate-500">{product.product_name}</p>

          <ProductShareButtons url={productUrl} title={`AWOL product: ${product.model_name}`} />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Cash price</div>
              <div className="mt-1 font-semibold">{formatMoney(product.cash_price)}</div>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Down payment</div>
              <div className="mt-1 font-semibold">{product.installment_allowed ? formatMoney(product.down_payment) : "N/A"}</div>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Term</div>
              <div className="mt-1 font-semibold">{product.installment_allowed ? `${product.installment_months} months` : "Cash only"}</div>
            </div>
          </div>

          {product.features && Object.keys(product.features).length > 0 && (
            <div className="mt-5">
              <h2 className="font-semibold">Specifications</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {Object.entries(product.features).map(([key, value]) => (
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
            <button disabled={!product.installment_allowed} onClick={() => setMode("credit")} className={`flex flex-1 items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold disabled:opacity-40 ${mode === "credit" ? "bg-white shadow-sm" : "text-slate-500"}`}>
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
              <h2 className="font-semibold text-slate-950">Customer Agreement</h2>
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
      </section>
    </main>
  );
}

function ProductShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const text = `${title} ${url}`;

  const links = [
    { label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, icon: MessageCircle },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: ExternalLink },
    { label: "X", href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, icon: ExternalLink },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: ExternalLink },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, icon: Send },
    { label: "Reddit", href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, icon: ExternalLink },
    { label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`, icon: ExternalLink },
    { label: "Threads", href: `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`, icon: ExternalLink },
    { label: "Tumblr", href: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&title=${encodedTitle}`, icon: ExternalLink },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(text)}`, icon: Mail },
    { label: "SMS", href: `sms:?&body=${encodeURIComponent(text)}`, icon: MessageCircle },
  ];

  async function shareNative() {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await copyLink();
    }
  }

  async function copyLink() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={shareNative} className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white">
          <Share2 size={16} />
          Share
        </button>
        <button type="button" onClick={copyLink} className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
          <Copy size={16} />
          {copied ? "Copied" : "Copy link"}
        </button>
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={label === "Email" || label === "SMS" ? undefined : "_blank"}
            rel={label === "Email" || label === "SMS" ? undefined : "noopener noreferrer"}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <Icon size={15} />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
