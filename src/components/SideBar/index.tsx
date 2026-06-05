"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  CreditCard,
  AlertTriangle,
  Menu
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Products", href: "/products", icon: Package },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Defaulters", href: "/defualters", icon: AlertTriangle },
];

export default function Sidebar({ open, setOpen }: any) {

  const pathname = usePathname();

  return (
    // <motion.aside
    //   animate={{ width: open ? 256 : 0 }}
    //   transition={{ duration: 0.3 }}
    //   className="h-screen border-r bg-white dark:bg-black dark:border-gray-800 fixed overflow-hidden"
    // >
    <motion.aside
      initial={false}
      animate={{ x: open ? 0 : -260 }}
      transition={{ duration: 0.3 }}
      className="fixed z-50 h-screen w-64 border-r border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
    >

      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-10 top-4 rounded-md border border-slate-200 bg-white p-2 text-slate-900 shadow dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        <Menu size={20} />
      </button>

      <div className="p-4">

        <h2 className="mb-8 text-xl font-bold text-emerald-600 dark:text-emerald-400">
          AWOL
        </h2>

        <nav className="space-y-3">

          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link key={link.name} href={link.href}>

                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 10px rgba(34,197,94,0.7)"
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
                  ${
                    active
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                      : "text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-emerald-950/40"
                  }`}
                >

                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className={active ? "text-white" : "text-emerald-600 dark:text-emerald-400"}
                  >
                    <Icon size={18} />
                  </motion.div>

                  {link.name}

                </motion.div>

              </Link>
            );
          })}

        </nav>

      </div>

    </motion.aside>
  );
}
