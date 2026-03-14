import RecentContracts from "@/src/components/Dashboard/RecentContracts";
import RevenueChart from "@/src/components/Dashboard/RevenueChart";
import StatCard from "@/src/components/Dashboard/StatCard";
import { DollarSign, Users, FileText, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white p-6 transition">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Hire Purchase Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="₦2,450,000"
          icon={<DollarSign />}
          change="+12% this month"
        />
        <StatCard
          title="Active Contracts"
          value="128"
          icon={<FileText />}
        />
        <StatCard
          title="Total Customers"
          value="320"
          icon={<Users />}
        />
        <StatCard
          title="Overdue Contracts"
          value="18"
          icon={<AlertTriangle />}
        />
      </div>
    
      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RecentContracts />
      </div>
    </main>
  );
}