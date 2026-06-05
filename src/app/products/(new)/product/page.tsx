"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  const [description, setDescription] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!token) return;
    dispatch(clearCompany());
    setPage(1);
    dispatch(fetchCompanies({ token, search: "", page: 1 }));
  }, [token, dispatch]);

  useEffect(() => {
    if (!token) return;
    const delay = setTimeout(() => {
      dispatch(clearCompany());
      setPage(1);
      dispatch(fetchCompanies({ token, search, page: 1 }));
    }, 400);
    return () => clearTimeout(delay);
  }, [search, dispatch, token]);

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
          data: { name, description, company: selectedCompany.id },
        })
      ).unwrap();

      router.push("/products");
    } catch {
      setError("Failed to create product");
    }
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-xl space-y-5 rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">Add Product</h1>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>}

      {/* Name */}
      <input
        className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Description */}
      <textarea
        className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <input
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
          placeholder="Search company..."
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
            className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {companies.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCompany(c);
                  setOpen(false);
                }}
                className="cursor-pointer p-3 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                {c.name}
              </div>
            ))}

            {status === "loading" && (
              <div className="p-3 text-center text-slate-500 dark:text-slate-400">Loading...</div>
            )}
          </div>
        )}
      </div>

      <button className="w-full rounded-md bg-emerald-700 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400">
        Save Product
      </button>
    </motion.form>
  );
}
