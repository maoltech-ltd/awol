// app/ClientWrapper.tsx (client)
"use client";

import { usePathname } from "next/navigation";
import ReduxProvider from "../redux/ReduxProvider";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludePaths = ["/signin", "/signup", "/"];
  const shouldShowHeaderFooter = !excludePaths.includes(pathname);

  return (
    <ReduxProvider>
      <Script id="theme-switcher" strategy="beforeInteractive">
        {`if (localStorage.getItem('theme') === 'dark' ||
          (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }`}
      </Script>

      {shouldShowHeaderFooter && <Header />}
      {shouldShowHeaderFooter && <Sidebar />}
      {children}
      {shouldShowHeaderFooter && <Footer />}
    </ReduxProvider>
  );
}
