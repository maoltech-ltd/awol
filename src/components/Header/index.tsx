"use client";

import { useEffect } from "react";
import { Moon, Sun, Bell, TrendingUp } from "lucide-react";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import { motion } from "framer-motion";
import { fetchFxRates } from "@/src/redux/slice/marketSlice";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import type { RootState } from "@/src/redux/store";

const formatRate = (value?: number | null) => {
  if (!value) return "--";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
};

export default function Header() {
  const [mode, setMode]: any = useThemeSwitch();
  const user = useSelector((state: any) => state.user);
  const dispatch = useAppDispatch();
  const fx = useSelector((state: RootState) => state.fx);
  const comparison = fx.data?.rate_comparison;
  const officialRate = comparison?.official ?? fx.data?.official_rate;
  const parallelRate = comparison?.parallel ?? fx.data?.parallel_rate ?? fx.data?.base_usd_rate;
  const spread = comparison?.spread;
  const spreadPercent = comparison?.spread_percent;

  useEffect(() => {
    if (fx.status === "idle") {
      dispatch(fetchFxRates());
    }
  }, [dispatch, fx.status]);

  const tickerItems = [
    `USD/NGN official: ${formatRate(officialRate)}${comparison?.official_date ? ` (${comparison.official_date})` : ""}`,
    `USD/NGN parallel: ${formatRate(parallelRate)}`,
    spread !== null && spread !== undefined
      ? `Spread: ${formatRate(spread)}${spreadPercent !== null && spreadPercent !== undefined ? ` (${spreadPercent.toFixed(2)}%)` : ""}`
      : "Spread: --",
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      // className="w-full h-16 border-b backdrop-blur-md bg-white/70 dark:bg-black/70 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40"
      className="sticky top-0 z-40 flex min-h-16 w-full flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 text-slate-900 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-100 md:flex-nowrap md:gap-4 md:px-6"
    >
      {/* Logo */}
      <Logo user={user} />

      <div className="group order-3 flex w-full min-w-0 items-center overflow-hidden rounded-md border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100 sm:text-sm md:order-none md:w-auto md:flex-1">
        <TrendingUp size={16} className="mr-2 shrink-0 text-emerald-600 dark:text-emerald-300" />
        <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
          <div className="animate-headline-ticker inline-flex min-w-max gap-8 pr-8">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item}-${index}`} className="font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-3 md:gap-4">

        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="rounded-md p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Bell size={20} />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ rotate: 20, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="rounded-md p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>

        {/* Username */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="max-w-24 truncate text-sm font-semibold text-slate-800 dark:text-slate-100 md:max-w-none"
        >
          {user?.username || "Admin"}
        </motion.div>
      </div>
    </motion.header>
  );
}
