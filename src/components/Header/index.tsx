"use client";

import { Moon, Sun, Bell } from "lucide-react";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import { motion } from "framer-motion";

export default function Header() {
  const [mode, setMode]: any = useThemeSwitch();
  const user = useSelector((state: any) => state.user);

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
