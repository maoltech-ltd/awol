"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import api from "@/src/api";

export default function UpdateProduct() {
  const id = useParams().id  
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.user);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      const res = await api.get(`v1/awol/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        name: res.data.name,
        description: res.data.description,
      });

      setLoading(false);
    }

    fetchData();
  }, [id, token]);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: any) {
    e.preventDefault();

    await api.put(`v1/awol/products/${id}/`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    router.push(`/products/single/${id}`);
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl space-y-5"
    >
      <h1 className="text-3xl font-bold text-green-600">Update Product</h1>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-green-400"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-green-400"
      />

      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:scale-[1.02] transition">
        Update Product
      </button>
    </motion.form>
  );
}