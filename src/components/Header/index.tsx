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
      className="w-full h-16 backdrop-blur-md bg-white/70 dark:bg-black/70 shadow-md dark:shadow-lg flex items-center justify-between px-6 sticky top-0 z-40"
    >
      {/* Logo */}
      <Logo user={user} />

      {/* Right section */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-xl hover:bg-gray-100 dark:text-light dark:hover:bg-gray-800 transition"
        >
          <Bell size={20} />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ rotate: 20, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="p-2 rounded-xl hover:bg-gray-100 dark:text-light dark:hover:bg-gray-800 transition"
        >
          {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>

        {/* Username */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-sm font-semibold dark:text-light"
        >
          {user?.username || "Admin"}
        </motion.div>
      </div>
    </motion.header>
  );
}