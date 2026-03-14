
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import {
  DribbbleIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "../icon";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { cs } from "@/src/utils";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  

  
  const user = useSelector((state: any) => state.user);
  const [mode, setMode]: any = useThemeSwitch();
  const [click, setClick] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [mounted, setMounted] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const mobileCategoriesRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setClick(!click);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleThemeChange = () => {
    setIsSwitching(true);
    setMode(mode === "light" ? "dark" : "light");
    setTimeout(() => {
      setIsSwitching(false);
    }, 300);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        // sm breakpoint
        setClick(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const pathname = usePathname();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isHome = pathname === "/";
  return (
    <div className="relative">
      <div className="w-full items-center justify-around bg-black dark:bg-white py-2">
        <Link href="/">
          {isHome ? (
            <h1 className="text-2xl sm:text-4xl font-bold text-white dark:text-black text-center">
              Awol
            </h1>
          ) : (
            <div className="text-2xl sm:text-4xl font-bold text-white dark:text-black text-center">
              Awol
            </div>
          )}
        </Link>
      </div>
      <button
        onClick={handleThemeChange}
        aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        type="button"
        className="fixed top-5 right-5 p-3 rounded-full bg-white shadow-xl cursor-pointer"
      >
        {mode === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />}
      </button>
      <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between relative">
        <div>
          <Logo user={user} />
          {user?.isAuthor && (
            <Link href="/" className="ml-2">
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                Admin
              </span>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
