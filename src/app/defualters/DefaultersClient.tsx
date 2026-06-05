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
  }, [user?.token, dispatch]);

  if (!user?.token) return <div className="p-6 text-slate-800 dark:text-slate-100">Please login</div>;
  if (status === "loading") return <div className="p-6 text-slate-800 dark:text-slate-100">Loading...</div>;
  if (status === "failed") return <div className="p-6 text-slate-800 dark:text-slate-100">Failed to load customers.</div>;

  return (
    <div className="min-h-screen p-6 text-slate-900 dark:text-slate-100">
      <h1 className="mb-4 text-2xl font-semibold text-slate-950 dark:text-white">Defaulters</h1>

      {customers.map((s: any) => (
        <div
          key={s.id}
          className="mb-2 rounded-lg border border-slate-200 bg-white p-3 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          Customer #{s.customer} - Balance NGN {s.balance} - Due {s.next_due_date}
        </div>
      ))}
    </div>
  );
}
