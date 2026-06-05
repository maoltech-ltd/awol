"use client";

import { Moon, Sun, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useThemeSwitch } from "./Hooks/useThemeSwitch";

export default function ThemeToggle() {
  const [mode, setMode]: any = useThemeSwitch();
  const user = useSelector((state: any) => state.user);
    return (
        <motion.button
          whileHover={{ rotate: 20, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="rounded-md border border-slate-200 bg-white p-2 text-slate-800 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>
    )
}
