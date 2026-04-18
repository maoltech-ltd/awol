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
          className="p-2 rounded-xl hover:bg-gray-100 dark:text-light dark:hover:bg-gray-800 transition"
        >
          {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>
    )
}