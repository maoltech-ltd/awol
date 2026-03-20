"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import {
  fetchProducts,
  addProductModel,
  Product,
} from "@/src/redux/slice/awol/productSlice";
import { useRouter } from "next/navigation";
import { createImage } from "@/src/redux/slice/ImageSlice";
import Image from "next/image";

export default function AddModelClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { token } = useSelector((state: RootState) => state.user);
  const { products } = useSelector((state: RootState) => state.product);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [modelName, setModelName] = useState("");
  const [cashPrice, setCashPrice] = useState("");
  const [installmentPrice, setInstallmentPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [months, setMonths] = useState("");
  const [installmentAllowed, setInstallmentAllowed] = useState(true);

  const [defaultImage, setDefaultImage] = useState<string | null>(null);
  const [defaultPreview, setDefaultPreview] = useState<string | null>(null);
  const [otherImages, setOtherImages] = useState<string[]>([]);
  const [otherPreviews, setOtherPreviews] = useState<string[]>([]);

  const [features, setFeatures] = useState([{ key: "", value: "" }]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) dispatch(fetchProducts({ token, page: 1 }));
  }, [token, dispatch]);

  const filteredProducts = products.filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const monthlyPayment = useMemo(() => {
    if (!months) return 0;
    return (
      (Number(installmentPrice) - Number(downPayment)) /
      Number(months || 1)
    );
  }, [installmentPrice, downPayment, months]);

  function addFeature() {
    setFeatures([...features, { key: "", value: "" }]);
  }

  function updateFeature(i: number, field: string, value: string) {
    const copy = [...features];
    copy[i][field as "key" | "value"] = value;
    setFeatures(copy);
  }

  async function handleDefaultImage(file: File) {
    try {
      setDefaultPreview(URL.createObjectURL(file));
      const result = await dispatch(createImage(file)).unwrap();
      setDefaultImage(result.image);
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

      const result = await dispatch(createImage(file)).unwrap();

      const imgCopy = [...otherImages];
      imgCopy[index] = result.image;
      setOtherImages(imgCopy);
    } catch {
      setError("Image upload failed");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const featureJson: any = {};
      features.forEach((f) => {
        if (f.key && f.value) featureJson[f.key] = f.value;
      });

      await dispatch(
        addProductModel({
          token,
          data: {
            product: selectedProduct?.id,
            model_name: modelName,
            cash_price: Number(cashPrice),
            installment_price: Number(installmentPrice),
            down_payment: Number(downPayment),
            installment_months: Number(months),
            installment_allowed: installmentAllowed,
            default_image: defaultImage,
            other_images: otherImages.filter((i) => i),
            features: featureJson,
          },
        })
      ).unwrap();

      router.push(`/products/single/${selectedProduct?.id}`);
    } catch {
      setError("Failed to create product model");
    } finally {
      setLoading(false);
    }
  }

  const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-950 py-12 px-4">

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl space-y-6"
        onSubmit={submit}
      >
        <h1 className="text-3xl font-bold text-green-700">
          Add Product Model
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* PRODUCT SELECT */}
        <div ref={dropdownRef}>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Product
          </label>

          <input
            className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Search product..."
            value={selectedProduct ? selectedProduct.name : search}
            onChange={(e) => {
              setSelectedProduct(null);
              setSearch(e.target.value);
            }}
            onFocus={() => setOpen(true)}
          />

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-h-60 overflow-y-auto"
              >
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 hover:bg-green-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(p);
                      setOpen(false);
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INPUTS */}
        <input
          placeholder="Model Name"
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner focus:ring-2 focus:ring-green-400 outline-none"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />

        {/* DEFAULT IMAGE */}
        <div>
          <label className="text-sm font-medium">Default Image</label>

          <input
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={(e) =>
              e.target.files?.[0] && handleDefaultImage(e.target.files[0])
            }
          />

          <AnimatePresence>
            {defaultPreview && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4"
              >
                <Image
                  src={defaultPreview}
                  alt="preview"
                  width={150}
                  height={150}
                  className="rounded-xl shadow-lg"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* OTHER IMAGES */}
        <div>
          <label className="text-sm font-medium">Other Images</label>

          {otherPreviews.map((preview, i) => (
            <motion.div key={i} className="mt-4 space-y-2">
              <input
                type="file"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleOtherImage(e.target.files[0], i)
                }
              />

              {preview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Image
                    src={preview}
                    alt="preview"
                    width={120}
                    height={120}
                    className="rounded-lg shadow-md"
                  />
                </motion.div>
              )}
            </motion.div>
          ))}

          <button
            type="button"
            onClick={() => {
              setOtherPreviews([...otherPreviews, ""]);
              setOtherImages([...otherImages, ""]);
            }}
            className="text-green-600 mt-2"
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
                placeholder="Feature"
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner"
                value={f.key}
                onChange={(e) =>
                  updateFeature(i, "key", e.target.value)
                }
              />
              <input
                placeholder="Value"
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner"
                value={f.value}
                onChange={(e) =>
                  updateFeature(i, "value", e.target.value)
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addFeature}
            className="text-green-600 mt-2"
          >
            + Add Feature
          </button>
        </div>

        {/* PRICES */}
        <input
          type="number"
          placeholder="Cash Price"
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner"
          value={cashPrice}
          onChange={(e) => setCashPrice(e.target.value)}
        />

        {/* INSTALLMENT */}
        <div className="space-y-4">
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={installmentAllowed}
              onChange={(e) =>
                setInstallmentAllowed(e.target.checked)
              }
            />
            Enable Installment
          </label>

          {installmentAllowed && (
            <>
              <input
                placeholder="Installment Price"
                className="input"
                value={installmentPrice}
                onChange={(e) =>
                  setInstallmentPrice(e.target.value)
                }
              />

              <input
                placeholder="Down Payment"
                className="input"
                value={downPayment}
                onChange={(e) =>
                  setDownPayment(e.target.value)
                }
              />

              <input
                placeholder="Months"
                className="input"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
              />

              {monthlyPayment > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 shadow"
                >
                  Monthly:
                  <div className="text-lg font-bold text-green-600">
                    {currency.format(monthlyPayment)}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] transition"
        >
          {loading ? "Saving..." : "Save Model"}
        </button>
      </motion.form>
    </div>
  );
}