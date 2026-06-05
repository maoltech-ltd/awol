"use client";

import type React from "react";
import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BatteryCharging, Edit, Package, Plus, ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchProductDetails } from "@/src/redux/slice/awol/productSlice";
import { useRouter } from "next/navigation";
import useMounted from "@/src/redux/hooks/useMounted";

const formatMoney = (value?: number | string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function ProductDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { product, models, status } = useSelector((state: RootState) => state.product);
  const user = useSelector((state: RootState) => state.user);
  const mounted = useMounted();

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchProductDetails({ token: user.token, id }));
  }, [user?.token, id, dispatch]);

  if (!mounted) return null;
  if (!user?.token) return <div className="p-6 text-slate-800 dark:text-slate-100">Please login</div>;
  if (status === "loading") return <div className="p-6 text-slate-800 dark:text-slate-100">Loading...</div>;
  if (!product) return <div className="p-6 text-slate-800 dark:text-slate-100">Product not found</div>;

  const availableCount = models.filter((model: any) => model.is_available).length;
  const stockCount = models.reduce((sum: number, model: any) => sum + Number(model.stock_quantity || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <Package size={18} />
                Product #{product.id}
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{product.name}</h1>
              {"description" in product && (product as any).description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{(product as any).description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => router.push(`/products/update/product/${product.id.toString()}`)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <Edit size={17} />
                Update product
              </button>
              <button onClick={() => router.push("/products/model")} className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                <Plus size={17} />
                Add model
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Stat label="Models" value={models.length} />
            <Stat label="Available" value={availableCount} />
            <Stat label="Stock units" value={stockCount} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {models.map((model: any, index: number) => (
            <motion.article
              key={model.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="grid sm:grid-cols-[180px_1fr]">
                <div className="relative min-h-44 bg-slate-100 dark:bg-slate-800">
                  {model.default_image ? (
                    <Image src={model.default_image} alt={model.model_name} fill sizes="180px" className="object-cover" />
                  ) : (
                    <div className="flex h-full min-h-44 items-center justify-center text-emerald-600">
                      <BatteryCharging size={44} />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{model.model_name}</h2>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        {model.is_featured && <Badge>Featured</Badge>}
                        {model.is_available ? <Badge>Available</Badge> : <Badge muted>Unavailable</Badge>}
                        {model.installment_allowed && <Badge>Easy Buy</Badge>}
                      </div>
                    </div>
                    <button onClick={() => router.push(`/products/update/model/${model.id.toString()}`)} className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <Edit size={15} />
                      Edit
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Price label="Cash" value={model.cash_price} />
                    <Price label="Installment" value={model.installment_price} />
                    <Price label="Down payment" value={model.down_payment} />
                    <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Term and stock</div>
                      <div className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{model.installment_months || 0} months / {model.stock_quantity || 0} units</div>
                    </div>
                  </div>

                  {model.features && Object.keys(model.features).length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        <ShieldCheck size={16} />
                        Features
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {Object.entries(model.features).slice(0, 6).map(([key, value]) => (
                          <div key={key} className="rounded-md border border-slate-100 px-3 py-2 text-xs dark:border-slate-800">
                            <span className="font-semibold capitalize">{key.replaceAll("_", " ")}: </span>
                            <span className="text-slate-600 dark:text-slate-300">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        {models.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No product models have been added yet.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-950">
      <div className="text-2xl font-semibold text-slate-950 dark:text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function Price({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-950">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{value ? formatMoney(value) : "N/A"}</div>
    </div>
  );
}

function Badge({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span className={`rounded px-2 py-1 font-semibold ${muted ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"}`}>
      {children}
    </span>
  );
}
