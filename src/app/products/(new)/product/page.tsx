// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/store";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { addProduct } from "@/src/redux/slice/awol/productSlice";
// import {
//   clearCompany,
//   fetchCompanies,
// } from "@/src/redux/slice/companySlice";

// export default function NewProduct() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();

//   const { token } = useSelector((state: RootState) => state.user);
//   const { companies, status } = useSelector(
//     (state: RootState) => state.company
//   );

//   const [name, setName] = useState("");
//   const [company, setCompany] = useState<number | null>(null);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [error, setError] = useState("");

//   const listRef = useRef<HTMLDivElement>(null);

//   // INITIAL LOAD
//   useEffect(() => {
//     if (token) {
//       dispatch(clearCompany());
//       setPage(1);
//       dispatch(fetchCompanies({ token, search: "", page: 1 }));
//     }
//   }, [token]);

//   // SEARCH
//   useEffect(() => {
//     if (!token) return;

//     const delay = setTimeout(() => {
//       dispatch(clearCompany());
//       setPage(1);
//       dispatch(fetchCompanies({ token, search, page: 1 }));
//     }, 500); // debounce

//     return () => clearTimeout(delay);
//   }, [search]);

//   // INFINITE SCROLL
//   function handleScroll() {
//     if (!listRef.current  || status === "loading") return;

//     const { scrollTop, scrollHeight, clientHeight } = listRef.current;

//     if (scrollTop + clientHeight >= scrollHeight - 10) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       dispatch(fetchCompanies({ token, search, page: nextPage }));
//     }
//   }

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();

//     if (!company) {
//       setError("Please select a company");
//       return;
//     }

//     try {
//       await dispatch(
//         addProduct({
//           token,
//           data: { name, company },
//         })
//       ).unwrap();

//       router.push("/products");
//     } catch {
//       setError("Failed to create product");
//     }
//   }

//   return (
//     <form onSubmit={submit} className="p-6 space-y-4 max-w-xl">
//       <h1 className="text-xl font-semibold">Add Product</h1>

//       {error && <div className="text-red-500">{error}</div>}

//       <input
//         className="border w-full px-3 py-2"
//         placeholder="Product Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//       />

//       {/* SEARCH */}
//       <input
//         className="border w-full px-3 py-2"
//         placeholder="Search company..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* LIST */}
//       <div
//         ref={listRef}
//         onScroll={handleScroll}
//         className="border max-h-60 overflow-y-auto"
//       >
//         {companies.map((c) => (
//           <div
//             key={c.id}
//             onClick={() => setCompany(c.id)}
//             className={`p-2 cursor-pointer hover:bg-gray-200 ${
//               company === c.id ? "bg-blue-100" : ""
//             }`}
//           >
//             {c.name}
//           </div>
//         ))}

//         {status === "loading" && <div className="p-2 text-gray-500">Loading more...</div>}
//       </div>

//       <button className="border px-4 py-2 bg-black text-white">
//         Save Product
//       </button>
//     </form>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { addProduct } from "@/src/redux/slice/awol/productSlice";
import { clearCompany, fetchCompanies } from "@/src/redux/slice/awol/companySlice";

export default function NewProduct() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { token } = useSelector((state: RootState) => state.user);
  const { companies, status } = useSelector((state: RootState) => state.company);

  const [name, setName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // first load
  useEffect(() => {
    if (!token) return;

    dispatch(clearCompany());
    setPage(1);
    dispatch(fetchCompanies({ token, search: "", page: 1 }));
  }, [token]);

  // search
  useEffect(() => {
    if (!token) return;

    const delay = setTimeout(() => {
      dispatch(clearCompany());
      setPage(1);
      dispatch(fetchCompanies({ token, search, page: 1 }));
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // lazy scroll
  function handleScroll() {
    if (!listRef.current || status === "loading") return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchCompanies({ token, search, page: nextPage }));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedCompany) {
      setError("Please select a company");
      return;
    }

    try {
      await dispatch(
        addProduct({
          token,
          data: { name, company: selectedCompany.id },
        })
      ).unwrap();

      router.push("/products");
    } catch {
      setError("Failed to create product");
    }
  }

  return (
    <form onSubmit={submit} className="p-6 space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Add Product</h1>

      {error && <div className="text-red-500">{error}</div>}

      {/* Product name */}
      <input
        className="border w-full px-3 py-2"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* COMPANY DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <input
          className="border w-full px-3 py-2"
          placeholder="Search & select company..."
          value={selectedCompany ? selectedCompany.name : search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSelectedCompany(null);
            setSearch(e.target.value);
          }}
        />

        {open && (
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="absolute z-50 mt-1 w-full bg-white border max-h-60 overflow-y-auto shadow-lg"
          >
            {companies.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCompany(c);
                  setOpen(false);
                }}
                className="p-2 cursor-pointer hover:bg-blue-50"
              >
                {c.name}
              </div>
            ))}

            {status === "loading" && (
              <div className="p-2 text-gray-500 text-center">
                Loading...
              </div>
            )}

            {!status && companies.length === 0 && (
              <div className="p-2 text-gray-400 text-center">
                No companies found
              </div>
            )}
          </div>
        )}
      </div>

      <button className="border px-4 py-2 bg-black text-white">
        Save Product
      </button>
    </form>
  );
}
