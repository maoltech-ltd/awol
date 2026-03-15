// // app/ClientWrapper.tsx (client)
// "use client";

// import { usePathname } from "next/navigation";
// import ReduxProvider from "../redux/ReduxProvider";
// import Script from "next/script";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import Sidebar from "../components/SideBar";

// export default function ClientWrapper({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const excludePaths = ["/signin", "/signup", "/"];
//   const excludePathsSidebar = ["/signin", "signup", "/", "/customer/products"]
//   const shouldShowHeaderFooter = !excludePaths.includes(pathname);
//   const shouldShowSiderBar = !excludePathsSidebar.includes(pathname);

//   return (
//     <ReduxProvider>
//       <Script id="theme-switcher" strategy="beforeInteractive">
//         {`if (localStorage.getItem('theme') === 'dark' ||
//           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
//             document.documentElement.classList.add('dark')
//           } else {
//             document.documentElement.classList.remove('dark')
//           }`}
//       </Script>

//       {shouldShowHeaderFooter && <Header />}
//       {shouldShowSiderBar && <Sidebar />}
//       {children}
//       {shouldShowHeaderFooter && <Footer />}
//     </ReduxProvider>
//   );
// }
"use client";

import { usePathname } from "next/navigation";
import ReduxProvider from "../redux/ReduxProvider";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/SideBar";
import { useState } from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const excludePaths = ["/signin", "/signup", "/"];
  const excludePathsSidebar = ["/signin", "/signup", "/", "/customer/products"];

  const showHeaderFooter = !excludePaths.includes(pathname);
  const showSidebar = !excludePathsSidebar.includes(pathname);

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

      <div className="flex min-h-screen">

        {showSidebar && (
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        )}

        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            showSidebar && sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >

          {showHeaderFooter && <Header />}

          <main className="flex-1 p-6 transition-all duration-300">
            {children}
          </main>

          {showHeaderFooter && <Footer />}

        </div>

      </div>

    </ReduxProvider>
  );
}