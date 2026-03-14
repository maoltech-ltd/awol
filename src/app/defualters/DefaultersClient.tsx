"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchDefaults } from "@/src/redux/slice/awol/defaultSlice";

export default function DefaultersClient() {
  const dispatch = useAppDispatch();
  const { customers, status } = useSelector((state: RootState) => state.default);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user?.token) return;
    dispatch(fetchDefaults({ token: user.token, page: 1 }));
  }, [user?.token]);

  if (!user?.token) return <div className="p-6">Please login</div>;
  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (status === "failed") return <div className="p-6">Failed to load customers.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Defaulters</h1>

      {customers.map((s: any) => (
        <div key={s.id} className="border p-3 mb-2">
          Customer #{s.customer} — Balance ₦{s.balance} — Due {s.next_due_date}
        </div>
      ))}
    </div>
  );
}
