// "use client";

// import { useEffect, useRef, useState, useMemo } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/store";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import {
//   fetchProducts,
//   addProductModel,
//   Product,
// } from "@/src/redux/slice/awol/productSlice";
// import { useRouter } from "next/navigation";

// export default function AddModelClient() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const { token } = useSelector((state: RootState) => state.user);
//   const { products } = useSelector((state: RootState) => state.product);

//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);

//   const [modelName, setModelName] = useState("");
//   const [cashPrice, setCashPrice] = useState("");
//   const [installmentPrice, setInstallmentPrice] = useState("");
//   const [downPayment, setDownPayment] = useState("");
//   const [months, setMonths] = useState("");
//   const [installmentAllowed, setInstallmentAllowed] = useState(true);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown outside click
//   useEffect(() => {
//     function handleClick(e: any) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   // Fetch products
//   useEffect(() => {
//     if (token) {
//       dispatch(fetchProducts({ token, page: 1 }));
//     }
//   }, [token]);

//   const filteredProducts = products.filter((p: Product) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const monthlyPayment = useMemo(() => {
//     if (!months || Number(months) <= 0) return 0;
//     return (
//       (Number(installmentPrice) - Number(downPayment)) / Number(months)
//     );
//   }, [installmentPrice, downPayment, months]);

//   function validateForm() {
//     if (!selectedProduct) return "Please select a product";
//     if (!modelName.trim()) return "Model name is required";
//     if (Number(cashPrice) <= 0) return "Cash price must be greater than 0";
//     if (installmentAllowed) {
//       if (Number(installmentPrice) <= 0)
//         return "Installment price must be greater than 0";
//       if (Number(installmentPrice) < Number(cashPrice))
//         return "Installment price cannot be less than cash price";
//       if (Number(downPayment) < 0)
//         return "Down payment cannot be negative";
//       if (Number(downPayment) >= Number(installmentPrice))
//         return "Down payment must be less than installment price";
//       if (Number(months) <= 0)
//         return "Installment months must be greater than 0";
//     }
//     return "";
//   }

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     try {
//       setLoading(true);

//       await dispatch(
//         addProductModel({
//           token,
//           data: {
//             product: selectedProduct?.id,
//             model_name: modelName,
//             cash_price: Number(cashPrice),
//             installment_price: installmentAllowed ? Number(installmentPrice) : Number(cashPrice),
//             down_payment: Number(downPayment),
//             installment_months: Number(months),
//             installment_allowed: installmentAllowed,
//           },
//         })
//       ).unwrap();

//       router.push(`/products/single/${selectedProduct?.id}`);
//     } catch {
//       setError("Failed to create product model");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const currency = new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//   });

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
//       <form
//         onSubmit={submit}
//         className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
//       >
//         <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
//           Add Product Model
//         </h1>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-3 rounded">
//             {error}
//           </div>
//         )}

//         {/* PRODUCT SELECT */}
//         <div className="relative" ref={dropdownRef}>
//           <label className="block font-medium text-gray-700 dark:text-gray-200">
//             Product
//           </label>
//           <p className="text-sm text-gray-500 mb-1">
//             Select the base product this model belongs to.
//           </p>
//           <input
//             className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
//             placeholder="Search product..."
//             value={selectedProduct ? selectedProduct.name : search}
//             onFocus={() => setOpen(true)}
//             onChange={(e) => {
//               setSelectedProduct(null);
//               setSearch(e.target.value);
//             }}
//           />
//           {open && (
//             <div className="absolute z-50 w-full bg-white dark:bg-gray-700 border max-h-60 overflow-y-auto shadow-lg">
//               {filteredProducts.map((p) => (
//                 <div
//                   key={p.id}
//                   onClick={() => {
//                     setSelectedProduct(p);
//                     setOpen(false);
//                   }}
//                   className="p-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600"
//                 >
//                   {p.name}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* MODEL NAME */}
//         <div>
//           <label className="block font-medium text-gray-700 dark:text-gray-200">
//             Model Name
//           </label>
//           <p className="text-sm text-gray-500 mb-1">
//             Example: 128GB Storage, 6GB RAM, Black Edition.
//           </p>
//           <input
//             className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
//             value={modelName}
//             onChange={(e) => setModelName(e.target.value)}
//           />
//         </div>

//         {/* CASH PRICE */}
//         <div>
//           <label className="block font-medium text-gray-700 dark:text-gray-200">
//             Cash Price
//           </label>
//           <p className="text-sm text-gray-500 mb-1">
//             Full payment amount if customer pays outright.
//           </p>
//           <input
//             type="number"
//             className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
//             value={cashPrice}
//             onChange={(e) => setCashPrice(e.target.value)}
//           />
//         </div>

//         {/* INSTALLMENT SECTION */}
//         <div className="border-t pt-6 space-y-4">
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={installmentAllowed}
//               onChange={(e) => setInstallmentAllowed(e.target.checked)}
//             />
//             <span className="text-gray-700 dark:text-gray-200 font-medium">
//               Enable Installment Purchase
//             </span>
//           </div>

//           {installmentAllowed && (
//             <>
//               <div>
//                 <label className="block font-medium text-gray-700 dark:text-gray-200">
//                   Installment Price
//                 </label>
//                 <p className="text-sm text-gray-500 mb-1">
//                   Total amount paid through installment.
//                 </p>
//                 <input
//                   type="number"
//                   className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
//                   value={installmentPrice}
//                   onChange={(e) =>
//                     setInstallmentPrice(e.target.value)
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 dark:text-gray-200">
//                   Down Payment
//                 </label>
//                 <p className="text-sm text-gray-500 mb-1">
//                   Initial deposit before installment begins.
//                 </p>
//                 <input
//                   type="number"
//                   className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
//                   value={downPayment}
//                   onChange={(e) =>
//                     setDownPayment(e.target.value)
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 dark:text-gray-200">
//                   Installment Duration (Months)
//                 </label>
//                 <p className="text-sm text-gray-500 mb-1">
//                   Number of months customer will pay.
//                 </p>
//                 <input
//                   type="number"
//                   className="w-full border px-3 py-2 rounded bg-transparent text-gray-800 dark:text-white"
//                   value={months}
//                   onChange={(e) => setMonths(e.target.value)}
//                 />
//               </div>

//               {monthlyPayment > 0 && (
//                 <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded">
//                   <p className="text-sm text-gray-600 dark:text-gray-300">
//                     Estimated Monthly Payment:
//                   </p>
//                   <p className="text-lg font-semibold text-blue-600">
//                     {currency.format(monthlyPayment)}
//                   </p>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         <button
//           disabled={loading}
//           className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded font-medium hover:opacity-90 transition"
//         >
//           {loading ? "Saving..." : "Save Model"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
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

  const [features, setFeatures] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchProducts({ token, page: 1 }));
    }
  }, [token]);

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

      setDefaultImage(result.url); // API response
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
      imgCopy[index] = result.url;

      setOtherImages(imgCopy);
    } catch {
      setError("Image upload failed");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Add Product Model
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
        )}

        {/* PRODUCT SELECT */}

        <div>
          <label className="font-medium">Product</label>
          <input
            placeholder="Search product..."
            className="w-full border px-3 py-2 rounded mt-1 bg-transparent"
            value={selectedProduct ? selectedProduct.name : search}
            onChange={(e) => {
              setSelectedProduct(null);
              setSearch(e.target.value);
            }}
            onFocus={() => setOpen(true)}
          />

          {open && (
            <div className="border mt-1 bg-white dark:bg-gray-700 max-h-60 overflow-y-auto">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    setSelectedProduct(p);
                    setOpen(false);
                  }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODEL NAME */}

        <div>
          <label>Model Name</label>
          <input
            className="w-full border px-3 py-2 rounded mt-1"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />
        </div>

        {/* DEFAULT IMAGE */}

        <div>
          <label>Default Image URL</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border px-3 py-2 rounded mt-1"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleDefaultImage(e.target.files[0]);
              }
            }}
          />

          {defaultPreview && (
            <Image
              src={defaultPreview}
              alt="Default product preview"
              className="mt-3 w-40 rounded-lg border"
              width={160}
              height={160}
            />
          )}
        </div>

        {/* OTHER IMAGES */}

        <div>
        <label>Other Images</label>

        {otherPreviews.map((preview, i) => (
          <div key={i} className="mt-3 space-y-2">

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleOtherImage(e.target.files[0], i);
                }
              }}
            />

            {preview && (
              <Image
                src={preview}
                alt="Other product preview"
                className="w-32 rounded border"
                width={128}
                height={128}
              />
            )}

          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            setOtherPreviews([...otherPreviews, ""]);
            setOtherImages([...otherImages, ""]);
          }}
          className="text-sm text-blue-600 mt-2"
        >
          + Add another image
        </button>
      </div>

        {/* FEATURES */}

        <div>
          <label>Features</label>

          {features.map((f, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 mt-2">
              <input
                placeholder="Feature name"
                className="border px-3 py-2 rounded"
                value={f.key}
                onChange={(e) =>
                  updateFeature(i, "key", e.target.value)
                }
              />
              <input
                placeholder="Feature value"
                className="border px-3 py-2 rounded"
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
            className="text-sm text-blue-600 mt-2"
          >
            + Add feature
          </button>
        </div>

        {/* CASH PRICE */}

        <div>
          <label>Cash Price</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={cashPrice}
            onChange={(e) => setCashPrice(e.target.value)}
          />
        </div>

        {/* INSTALLMENT */}

        <div className="space-y-4 border-t pt-6">

          <label className="flex items-center gap-2">
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
                type="number"
                placeholder="Installment Price"
                className="w-full border px-3 py-2 rounded"
                value={installmentPrice}
                onChange={(e) =>
                  setInstallmentPrice(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Down Payment"
                className="w-full border px-3 py-2 rounded"
                value={downPayment}
                onChange={(e) =>
                  setDownPayment(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Installment Months"
                className="w-full border px-3 py-2 rounded"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
              />

              {monthlyPayment > 0 && (
                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded">
                  Monthly Payment:
                  <div className="text-lg font-semibold text-blue-600">
                    {currency.format(monthlyPayment)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <button
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded font-medium hover:opacity-90 transition"
        >
          {loading ? "Saving..." : "Save Model"}
        </button>
      </motion.form>
    </div>
  );
}