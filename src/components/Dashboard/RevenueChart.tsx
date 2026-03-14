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
    <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-semibold mb-4">Monthly Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#4f46e5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}