// "use client";

// import { useEffect, useState } from "react";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/store";
// import { addCustomer } from "@/src/redux/slice/awol/customerSlice";
// import { fetchProducts, fetchProductDetails } from "@/src/redux/slice/awol/productSlice";
// import { createContract } from "@/src/redux/slice/awol/contractSlice";
// import { useRouter } from "next/navigation";

// export default function NewContract() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const user = useSelector((state: RootState) => state.user);
//   const { products, models } = useSelector((state: RootState) => state.product);

//   // CUSTOMER
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");

//   // PRODUCT
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");

//   // PAYMENT
//   const [totalPrice, setTotalPrice] = useState("");
//   const [downPayment, setDownPayment] = useState("");

//   const [isInstallment, setIsInstallment] = useState(false);

//   // LOAD PRODUCTS
//   useEffect(() => {
//     if (!user?.token) return;
//     dispatch(fetchProducts({ token: user.token }));
//   }, [user?.token]);

//   // WHEN PRODUCT CHANGES → LOAD MODELS
//   useEffect(() => {
//     if (!selectedProduct || !user?.token) return;
//     dispatch(fetchProductDetails({ token: user.token, id: selectedProduct }));
//   }, [selectedProduct]);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!user?.token) return;

//     try {
//       // 1️⃣ CREATE CUSTOMER
//       const customerRes = await dispatch(
//         addCustomer({
//           token: user.token,
//           data: {
//             full_name: name,
//             phone,
//             address,
//           },
//         })
//       ).unwrap();

//       const customerId = customerRes.id;

//       // 2️⃣ CREATE CONTRACT
//       await dispatch(
//         createContract({
//           token: user.token,
//           data: {
//             customer: customerId,
//             product_model: Number(selectedModel),
//             total_price: Number(totalPrice),
//             down_payment_paid: Number(downPayment),
//             is_installment: isInstallment
//           },
//         })
//       ).unwrap();

//       // 3️⃣ REDIRECT
//       router.push(`/customers/single/${customerId}`);

//     } catch (err) {
//       console.log(err);
//       alert("Failed to create contract");
//     }
//   }

//   return (
//     <form onSubmit={submit} className="p-6 space-y-4 max-w-xl">
//       <h1 className="text-xl font-semibold">New Contract</h1>

//       {/* CUSTOMER */}
//       <h2 className="font-semibold">Customer Information</h2>
//       <input className="border w-full px-3 py-2" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} />
//       <input className="border w-full px-3 py-2" placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} />
//       <input className="border w-full px-3 py-2" placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />

//       {/* PRODUCT */}
//       <h2 className="font-semibold">Product</h2>
//       <select className="border w-full px-3 py-2" value={selectedProduct} onChange={e=>setSelectedProduct(e.target.value)}>
//         <option value="">Select Product</option>
//         {products.map((p:any)=>(
//           <option key={p.id} value={p.id}>{p.name}</option>
//         ))}
//       </select>

//       {/* MODEL */}
//       <select className="border w-full px-3 py-2" value={selectedModel} onChange={e=>setSelectedModel(e.target.value)}>
//         <option value="">Select Model</option>
//         {models.map((m:any)=>(
//           <option key={m.id} value={m.id}>
//             {m.model_name} - ₦{m.installment_price}
//           </option>
//         ))}
//       </select>



//       {/* PAYMENT */}
//       <input className="border w-full px-3 py-2" placeholder="Total Price" value={totalPrice} onChange={e=>setTotalPrice(e.target.value)} />
//       <input className="border w-full px-3 py-2" placeholder="Down Payment Paid" value={downPayment} onChange={e=>setDownPayment(e.target.value)} />
      
//       {/*INSTALLMENT*/}
//       <label className="flex items-center space-x-2">
//         <input type="checkbox" checked={isInstallment} onChange={e=>setIsInstallment(e.target.checked)} />
//         <span>Is Installment?</span>
//       </label>
      
      
//       <button className="border px-4 py-2">Create Contract</button>
//     </form>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { addCustomer } from "@/src/redux/slice/awol/customerSlice";
import {
  fetchProducts,
  fetchProductDetails,
} from "@/src/redux/slice/awol/productSlice";
import { createContract } from "@/src/redux/slice/awol/contractSlice";
import { useRouter } from "next/navigation";

export default function NewContract() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  const { products, models } = useSelector(
    (state: RootState) => state.product
  );

  // CUSTOMER
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // PRODUCT
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedModel, setSelectedModel] = useState<any>(null);

  // PAYMENT
  const [totalPrice, setTotalPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [isInstallment, setIsInstallment] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // LOAD PRODUCTS
  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchProducts({ token: user.token }));
  }, [user?.token, dispatch]);

  // LOAD MODELS
  useEffect(() => {
    if (!selectedProduct || !user?.token) return;
    dispatch(
      fetchProductDetails({ token: user.token, id: selectedProduct })
    );
  }, [user?.token,selectedProduct, dispatch]);

  // When model changes → auto-set correct price
  useEffect(() => {
    if (!selectedModel) return;

    if (isInstallment) {
      setTotalPrice(String(selectedModel.installment_price));
    } else {
      setTotalPrice(String(selectedModel.cash_price));
    }
  }, [selectedModel, isInstallment]);

  const selectedModelData = useMemo(() => {
    return models.find((m: any) => m.id === Number(selectedModel));
  }, [selectedModel, models]);

  const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  function validate() {
    if (!name.trim()) return "Customer name is required";
    if (!phone.trim()) return "Phone number is required";
    if (!selectedProduct) return "Please select a product";
    if (!selectedModel) return "Please select a model";
    if (Number(totalPrice) <= 0) return "Invalid total price";
    if (Number(downPayment) < 0) return "Down payment cannot be negative";

    if (isInstallment) {
      if (!selectedModelData?.installment_allowed)
        return "This model does not allow installment";

      if (Number(downPayment) >= Number(totalPrice))
        return "Down payment must be less than total price";
    } else {
      if (Number(downPayment) !== Number(totalPrice))
        return "For instant purchase, full payment must be made";
    }

    return "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.token) return;

    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const customerRes = await dispatch(
        addCustomer({
          token: user.token,
          data: {
            full_name: name,
            phone,
            address,
          },
        })
      ).unwrap();

      const customerId = customerRes.id;

      await dispatch(
        createContract({
          token: user.token,
          data: {
            customer: customerId,
            product_model: Number(selectedModel),
            total_price: Number(totalPrice),
            down_payment_paid: Number(downPayment),
            is_installment: isInstallment,
          },
        })
      ).unwrap();

      router.push(`/customers/single/${customerId}`);
    } catch {
      setError("Failed to create contract");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <form
        onSubmit={submit}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Create New Contract
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        {/* CUSTOMER */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">
            Customer Information
          </h2>

          <div>
            <label className="font-medium">Full Name</label>
            <p className="text-sm text-gray-500">
              Customer&apos;s legal full name.
            </p>
            <input
              className="w-full border px-3 py-2 rounded bg-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Phone Number</label>
            <p className="text-sm text-gray-500">
              Active phone number for payment reminders.
            </p>
            <input
              className="w-full border px-3 py-2 rounded bg-transparent"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium">Address</label>
            <p className="text-sm text-gray-500">
              Customer residential or business address.
            </p>
            <input
              className="w-full border px-3 py-2 rounded bg-transparent"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* PRODUCT */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">
            Product Selection
          </h2>

          <select
            className="w-full border px-3 py-2 rounded bg-transparent"
            value={selectedProduct}
            onChange={(e) => {
              setSelectedProduct(e.target.value);
              setSelectedModel("");
            }}
          >
            <option value="">Select Product</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="w-full border px-3 py-2 rounded bg-transparent"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">Select Model</option>
            {models.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.model_name}
              </option>
            ))}
          </select>

          {/* SHOW PRICES */}
          {selectedModelData && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded space-y-2">
              <p>
                💰 <strong>Instant Price:</strong>{" "}
                {currency.format(Number(selectedModelData.cash_price))}
              </p>
              <p>
                📅 <strong>Installment Price:</strong>{" "}
                {currency.format(Number(selectedModelData.installment_price))}
              </p>
            </div>
          )}
        </div>

        {/* PAYMENT */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">
            Payment Details
          </h2>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isInstallment}
              onChange={(e) => setIsInstallment(e.target.checked)}
            />
            <span>Enable Installment Plan</span>
          </label>

          <div>
            <label>Total Price</label>
            <p className="text-sm text-gray-500">
              Auto-filled based on purchase type.
            </p>
            <input
              className="w-full border px-3 py-2 rounded bg-transparent"
              value={totalPrice}
              readOnly
            />
          </div>

          <div>
            <label>Down Payment Paid</label>
            <p className="text-sm text-gray-500">
              Amount customer is paying today.
            </p>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded bg-transparent"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded font-medium"
        >
          {loading ? "Creating..." : "Create Contract"}
        </button>
      </form>
    </div>
  );
}