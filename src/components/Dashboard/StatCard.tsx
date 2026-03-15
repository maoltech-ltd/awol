"use client"
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
      className="p-6 rounded-2xl shadow-sm border bg-white dark:bg-gray-900 dark:border-gray-800"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>
          {change && <p className="text-sm text-green-500">{change}</p>}
        </div>

        <div className="text-gray-600">{icon}</div>
      </div>
    </motion.div>
  );
}