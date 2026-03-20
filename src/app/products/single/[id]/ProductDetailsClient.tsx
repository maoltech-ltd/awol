"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchProductDetails } from "@/src/redux/slice/awol/productSlice";
import { useRouter } from "next/navigation";
import useMounted from "@/src/redux/hooks/useMounted";

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
  if (!user?.token) return <div className="p-6">Please login</div>;
  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="p-6 space-y-6">
      {/* <h1 className="text-3xl font-bold text-green-700">{product.name}</h1>
       */}
       <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-700">
            {product.name}
          </h1>

          <button
            onClick={() => router.push(`/products/update/product/${product.id.toString()}`)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-xl hover:scale-105 transition"
          >
            Update Product
          </button>
        </div>

      <div className="space-y-4">
        {models.map((m: any, i: number) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition"
          >
            {/* <h2 className="font-semibold text-lg text-gray-800 mb-2">
              {m.model_name}
            </h2> */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg text-gray-800">
                {m.model_name}
              </h2>

              <button
                onClick={() => router.push(`/products/update/model/${m.id.toString()}`)}
                className="text-sm px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>Cash: ₦{m.cash_price}</div>
              <div>Installment: ₦{m.installment_price}</div>
              <div>Down: ₦{m.down_payment}</div>
              <div>Months: {m.installment_months}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}