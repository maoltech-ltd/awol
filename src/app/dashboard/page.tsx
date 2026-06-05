import RecentContracts from "@/src/components/Dashboard/RecentContracts";
import RevenueChart from "@/src/components/Dashboard/RevenueChart";
import StatCard from "@/src/components/Dashboard/StatCard";
import { DollarSign, Users, FileText, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 transition dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Hire Purchase Dashboard</h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="NGN 2,450,000"
          icon={<DollarSign />}
          change="+12% this month"
        />
        <StatCard title="Active Contracts" value="128" icon={<FileText />} />
        <StatCard title="Total Customers" value="320" icon={<Users />} />
        <StatCard title="Overdue Contracts" value="18" icon={<AlertTriangle />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <RecentContracts />
      </div>
    </main>
  );
}
