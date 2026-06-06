"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  BatteryCharging,
  Calculator,
  Search,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import api from "@/src/api";

const MotionLink = motion(Link);

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

const formatMoney = (value?: number | string) => {
  const numeric = Number(value || 0);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(numeric);
};

export default function ProductsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
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
            <MotionLink
              key={model.id}
              href={`/customer/products/${model.id}`}
              whileHover={{ y: -4 }}
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
                <div className="mt-4 text-sm font-semibold text-emerald-700">View product</div>
              </div>
            </MotionLink>
          ))}
        </div>

        {models.length === 0 && (
          <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No product models match the current filters.
          </div>
        )}
      </section>
    </main>
  );
}
