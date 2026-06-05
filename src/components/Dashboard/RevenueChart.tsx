"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 210000 },
  { month: "Mar", revenue: 180000 },
  { month: "Apr", revenue: 240000 },
  { month: "May", revenue: 300000 },
];

export default function RevenueChart() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <h3 className="mb-4 font-semibold text-slate-950 dark:text-white">Monthly Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#059669" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
