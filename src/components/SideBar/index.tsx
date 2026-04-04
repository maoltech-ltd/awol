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
      className="h-screen w-64 border-r bg-white dark:bg-black dark:border-gray-800 fixed z-50"
    >

      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-10 top-4 p-2 bg-white dark:bg-gray-900 shadow rounded-lg"
      >
        <Menu size={20} />
      </button>

      <div className="p-4">

        <h2 className="text-xl font-bold mb-8 text-green-500">
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
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition dark:text-light
                  ${
                    active
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/40"
                      : "hover:bg-green-50 dark:hover:bg-green-900/20"
                  }`}
                >

                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className="text-green-500"
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