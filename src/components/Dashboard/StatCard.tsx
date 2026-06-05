"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
}

export default function StatCard({ title, value, icon, change }: Props) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{value}</h2>
          {change && <p className="text-sm text-emerald-600 dark:text-emerald-300">{change}</p>}
        </div>

        <div className="text-slate-600 dark:text-slate-300">{icon}</div>
      </div>
    </motion.div>
  );
}
