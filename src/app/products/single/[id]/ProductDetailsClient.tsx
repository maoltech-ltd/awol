"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchProductDetails } from "@/src/redux/slice/awol/productSlice";
import useMounted from "@/src/redux/hooks/useMounted";

export default function ProductDetailsClient({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const { product, models, status } = useSelector((state: RootState) => state.product);
  const user = useSelector((state: RootState) => state.user);

  const mounted = useMounted();

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchProductDetails({ token: user.token, id }));
  }, [user?.token, id]);

  if (!mounted) return null;

  if (!user?.token) return <div className="p-6">Please login</div>;
  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{product.name}</h1>

      <div className="border p-4">
        <h2 className="font-semibold mb-2">Models</h2>

        {models.map((m: any) => (
          <div key={m.id} className="border p-3 mb-2">
            <div className="font-medium">{m.model_name}</div>
            <div>Cash Price: ₦{m.cash_price}</div>
            <div>Installment: ₦{m.installment_price}</div>
            <div>Downpayment: ₦{m.down_payment}</div>
            <div>Months: {m.installment_months}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
