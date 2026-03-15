"use client";

import Link from "next/link";
import { Moon, Sun, Bell } from "lucide-react";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import { motion } from "framer-motion";

export default function Header() {
  const [mode, setMode]: any = useThemeSwitch();
  const user = useSelector((state: any) => state.user);

  return (
    <header className="w-full h-16 border-b bg-white dark:bg-black dark:border-gray-800 flex items-center justify-between px-6">

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Logo user={user} />
      </motion.div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <Bell size={20} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {user?.username || "Admin"}
          </span>
        </div>

      </div>
    </header>
  );
}