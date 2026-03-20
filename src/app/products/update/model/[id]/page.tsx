"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { createImage } from "@/src/redux/slice/ImageSlice";
import api from "@/src/api";
import Image from "next/image";

export default function UpdateModel() {

  const id = useParams().id
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<any>(null);

  // images
  const [defaultPreview, setDefaultPreview] = useState<string | null>(null);
  const [otherPreviews, setOtherPreviews] = useState<string[]>([]);

  // features array
  const [features, setFeatures] = useState<{ key: string; value: string }[]>([]);

  // FETCH + PREFILL
  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      try {
        const res = await api.get(`v1/awol/products/model/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        // convert features object → array
        const featureArray = data.features
          ? Object.entries(data.features).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          : [{ key: "", value: "" }];

        setForm({
          ...data,
          other_images: data.other_images || [],
        });

        setDefaultPreview(data.default_image || null);
        setOtherPreviews(data.other_images || []);
        setFeatures(featureArray);

      } catch {
        setError("Failed to load model");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, token]);

  // MONTHLY CALC
  const monthly = useMemo(() => {
    if (!form || !form.installment_months) return 0;
    return (
      (Number(form.installment_price || 0) -
        Number(form.down_payment || 0)) /
      Number(form.installment_months || 1)
    );
  }, [form]);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    });
  }

  // IMAGE HANDLERS
  async function handleDefaultImage(file: File) {
    try {
      setDefaultPreview(URL.createObjectURL(file));
      const res = await dispatch(createImage(file)).unwrap();

      setForm({ ...form, default_image: res.image });
    } catch {
      setError("Image upload failed");
    }
  }

  async function handleOtherImage(file: File, index: number) {
    try {
      const preview = URL.createObjectURL(file);

      const previewCopy = [...otherPreviews];
      previewCopy[index] = preview;
      setOtherPreviews(previewCopy);

      const res = await dispatch(createImage(file)).unwrap();

      const imgCopy = [...form.other_images];
      imgCopy[index] = res.url;

      setForm({ ...form, other_images: imgCopy });
    } catch {
      setError("Image upload failed");
    }
  }

  // FEATURES
  function addFeature() {
    setFeatures([...features, { key: "", value: "" }]);
  }

  function updateFeature(i: number, field: string, value: string) {
    const copy = [...features];
    copy[i][field as "key" | "value"] = value;
    setFeatures(copy);
  }

  // SUBMIT
  async function submit(e: any) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const featureJson: any = {};
      features.forEach((f) => {
        if (f.key && f.value) featureJson[f.key] = f.value;
      });

      await api.put(
        `v1/awol/products/model/${id}/`,
        {
          ...form,
          features: featureJson,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      router.back();
    } catch {
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!form) return null;

  return (
    // <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-950 py-12 px-4">
    //   <motion.form
    //     onSubmit={submit}
    //     initial={{ opacity: 0, y: 40 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl space-y-6"
    //   >
    //     <h1 className="text-3xl font-bold text-green-600">
    //       Update Product Model
    //     </h1>

    //     {error && (
    //       <div className="bg-red-100 text-red-600 p-3 rounded-xl">
    //         {error}
    //       </div>
    //     )}

    //     {/* MODEL NAME */}
    //     <input
    //       name="model_name"
    //       value={form.model_name}
    //       onChange={handleChange}
    //       className="input"
    //       placeholder="Model Name"
    //     />

    //     {/* DEFAULT IMAGE */}
    //     <div>
    //       <label className="text-sm">Default Image</label>
    //       <input
    //         type="file"
    //         onChange={(e) =>
    //           e.target.files?.[0] && handleDefaultImage(e.target.files[0])
    //         }
    //       />

    //       {defaultPreview && (
    //         <Image
    //           src={defaultPreview}
    //           alt="preview"
    //           width={150}
    //           height={150}
    //           className="mt-3 rounded-xl shadow"
    //         />
    //       )}
    //     </div>

    //     {/* OTHER IMAGES */}
    //     <div>
    //       <label>Other Images</label>

    //       {otherPreviews.map((img, i) => (
    //         <div key={i} className="mt-3">
    //           <input
    //             type="file"
    //             onChange={(e) =>
    //               e.target.files?.[0] &&
    //               handleOtherImage(e.target.files[0], i)
    //             }
    //           />
    //           {img && (
    //             <Image
    //               src={img}
    //               alt=""
    //               width={120}
    //               height={120}
    //               className="mt-2 rounded-lg"
    //             />
    //           )}
    //         </div>
    //       ))}

    //       <button
    //         type="button"
    //         onClick={() => {
    //           setOtherPreviews([...otherPreviews, ""]);
    //           setForm({
    //             ...form,
    //             other_images: [...form.other_images, ""],
    //           });
    //         }}
    //         className="text-green-600 mt-2"
    //       >
    //         + Add Image
    //       </button>
    //     </div>

    //     {/* FEATURES */}
    //     <div>
    //       <label>Features</label>

    //       {features.map((f, i) => (
    //         <div key={i} className="grid grid-cols-2 gap-3 mt-2">
    //           <input
    //             value={f.key}
    //             onChange={(e) =>
    //               updateFeature(i, "key", e.target.value)
    //             }
    //             placeholder="Feature"
    //             className="input"
    //           />
    //           <input
    //             value={f.value}
    //             onChange={(e) =>
    //               updateFeature(i, "value", e.target.value)
    //             }
    //             placeholder="Value"
    //             className="input"
    //           />
    //         </div>
    //       ))}

    //       <button
    //         type="button"
    //         onClick={addFeature}
    //         className="text-green-600 mt-2"
    //       >
    //         + Add Feature
    //       </button>
    //     </div>

    //     {/* PRICES */}
    //     <input
    //       type="number"
    //       name="cash_price"
    //       value={form.cash_price}
    //       onChange={handleChange}
    //       className="input"
    //       placeholder="Cash Price"
    //     />

    //     <label className="flex gap-2">
    //       <input
    //         type="checkbox"
    //         name="installment_allowed"
    //         checked={form.installment_allowed}
    //         onChange={handleChange}
    //       />
    //       Installment Allowed
    //     </label>

    //     {form.installment_allowed && (
    //       <>
    //         <input
    //           type="number"
    //           name="installment_price"
    //           value={form.installment_price || ""}
    //           onChange={handleChange}
    //           className="input"
    //           placeholder="Installment Price"
    //         />

    //         <input
    //           type="number"
    //           name="down_payment"
    //           value={form.down_payment || ""}
    //           onChange={handleChange}
    //           className="input"
    //           placeholder="Down Payment"
    //         />

    //         <input
    //           type="number"
    //           name="installment_months"
    //           value={form.installment_months}
    //           onChange={handleChange}
    //           className="input"
    //           placeholder="Months"
    //         />
    //       </>
    //     )}

    //     {monthly > 0 && (
    //       <motion.div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
    //         Monthly: ₦{monthly.toLocaleString()}
    //       </motion.div>
    //     )}

    //     {/* EXTRA FIELDS */}
    //     <input
    //       type="number"
    //       name="stock_quantity"
    //       value={form.stock_quantity}
    //       onChange={handleChange}
    //       className="input"
    //       placeholder="Stock Quantity"
    //     />

    //     <label className="flex gap-2">
    //       <input
    //         type="checkbox"
    //         name="is_available"
    //         checked={form.is_available}
    //         onChange={handleChange}
    //       />
    //       Available
    //     </label>

    //     <label className="flex gap-2">
    //       <input
    //         type="checkbox"
    //         name="is_featured"
    //         checked={form.is_featured}
    //         onChange={handleChange}
    //       />
    //       Featured
    //     </label>

    //     <button
    //       disabled={saving}
    //       className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:scale-[1.02] transition"
    //     >
    //       {saving ? "Updating..." : "Update Model"}
    //     </button>
    //   </motion.form>
    // </div>
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-950 py-12 px-4">
        <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-8"
        >
            <h1 className="text-3xl font-bold text-green-600">
            Update Product Model
            </h1>

            {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-xl shadow">
                {error}
            </div>
            )}

            {/* MODEL NAME */}
            <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Model Name
            </label>
            <input
                name="model_name"
                value={form.model_name}
                onChange={handleChange}
                className="input"
                placeholder="e.g Solar Inverter X200"
            />
            </div>

            {/* DEFAULT IMAGE */}
            <div>
            <label className="text-sm font-medium">Default Image</label>

            <div className="mt-2 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-inner hover:shadow-lg transition">
                <input
                type="file"
                onChange={(e) =>
                    e.target.files?.[0] && handleDefaultImage(e.target.files[0])
                }
                />

                <AnimatePresence>
                {defaultPreview && (
                    <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4"
                    >
                    <Image
                        src={defaultPreview}
                        alt="preview"
                        width={180}
                        height={180}
                        className="rounded-2xl shadow-xl hover:scale-105 transition"
                    />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            </div>

            {/* OTHER IMAGES */}
            <div>
            <label className="text-sm font-medium">Other Images</label>

            <div className="space-y-4 mt-3">
                {otherPreviews.map((img, i) => (
                <motion.div
                    key={i}
                    className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-inner hover:shadow-lg transition"
                >
                    <input
                    type="file"
                    onChange={(e) =>
                        e.target.files?.[0] &&
                        handleOtherImage(e.target.files[0], i)
                    }
                    />

                    {img && (
                    <Image
                        src={img}
                        alt=""
                        width={120}
                        height={120}
                        className="mt-3 rounded-xl shadow-md hover:scale-105 transition"
                    />
                    )}
                </motion.div>
                ))}
            </div>

            <button
                type="button"
                onClick={() => {
                setOtherPreviews([...otherPreviews, ""]);
                setForm({
                    ...form,
                    other_images: [...form.other_images, ""],
                });
                }}
                className="text-green-600 mt-3 hover:underline"
            >
                + Add Image
            </button>
            </div>

            {/* FEATURES */}
            <div>
            <label className="text-sm font-medium">Features</label>

            {features.map((f, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 mt-3">
                <input
                    value={f.key}
                    onChange={(e) => updateFeature(i, "key", e.target.value)}
                    placeholder="Feature (e.g Battery)"
                    className="input"
                />
                <input
                    value={f.value}
                    onChange={(e) => updateFeature(i, "value", e.target.value)}
                    placeholder="Value (e.g 5000mAh)"
                    className="input"
                />
                </div>
            ))}

            <button
                type="button"
                onClick={addFeature}
                className="text-green-600 mt-2 hover:underline"
            >
                + Add Feature
            </button>
            </div>

            {/* PRICING SECTION */}
            <div className="space-y-4">
            <h2 className="text-lg font-semibold text-green-700">
                Pricing
            </h2>

            <div>
                <label className="text-sm">Cash Price (₦)</label>
                <input
                type="number"
                name="cash_price"
                value={form.cash_price}
                onChange={handleChange}
                className="input"
                placeholder="e.g 250000"
                />
            </div>

            <label className="flex gap-2 items-center">
                <input
                type="checkbox"
                name="installment_allowed"
                checked={form.installment_allowed}
                onChange={handleChange}
                />
                Enable Installment Payment
            </label>

            {form.installment_allowed && (
                <>
                <div>
                    <label className="text-sm">Installment Price (₦)</label>
                    <input
                    type="number"
                    name="installment_price"
                    value={form.installment_price || ""}
                    onChange={handleChange}
                    className="input"
                    placeholder="Total installment price"
                    />
                </div>

                <div>
                    <label className="text-sm">Down Payment (₦)</label>
                    <input
                    type="number"
                    name="down_payment"
                    value={form.down_payment || ""}
                    onChange={handleChange}
                    className="input"
                    placeholder="Initial payment"
                    />
                </div>

                <div>
                    <label className="text-sm">Duration (Months)</label>
                    <input
                    type="number"
                    name="installment_months"
                    value={form.installment_months}
                    onChange={handleChange}
                    className="input"
                    />
                </div>
                </>
            )}
            </div>

            {/* MONTHLY */}
            {monthly > 0 && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 shadow"
            >
                Monthly Payment:
                <div className="text-xl font-bold text-green-600">
                ₦{monthly.toLocaleString()}
                </div>
            </motion.div>
            )}

            {/* STOCK */}
            <div>
            <label className="text-sm">Stock Quantity</label>
            <input
                type="number"
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                className="input"
            />
            </div>

            {/* FLAGS */}
            <div className="flex flex-wrap gap-6">
            <label className="flex gap-2">
                <input
                type="checkbox"
                name="is_available"
                checked={form.is_available}
                onChange={handleChange}
                />
                Available
            </label>

            <label className="flex gap-2">
                <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                />
                Featured
            </label>
            </div>

            {/* BUTTON */}
            <button
            disabled={saving}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] transition"
            >
            {saving ? "Updating..." : "Update Model"}
            </button>
        </motion.form>
        </div>
  );
}