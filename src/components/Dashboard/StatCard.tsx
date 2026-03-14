import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
}

export default function StatCard({ title, value, icon, change }: Props) {
  return (
    <div className="p-6 rounded-2xl shadow-sm border bg-white dark:bg-gray-900 dark:border-gray-800 transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>
          {change && (
            <p className="text-sm text-green-500 mt-1">{change}</p>
          )}
        </div>
        <div className="text-gray-600 dark:text-gray-300">{icon}</div>
      </div>
    </div>
  );
}