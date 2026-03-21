"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import api from "@/src/api";

export default function UpdateCompany() {
  const id = useParams().id;
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.user);

  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    address: "",
    company_type: "other",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      const res = await api.get(`v1/awol/companies/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm(res.data);
      setLoading(false);
    }

    fetchData();
  }, [id, token]);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: any) {
    e.preventDefault();

    await api.put(`v1/awol/companies/single/${id}/`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    router.push(`/companies/${id}`);
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl space-y-5"
    >
      <h1 className="text-3xl font-bold text-green-600">Update Company</h1>

      {Object.keys(form).map((key) =>
        key !== "company_type" ? (
          <input
            key={key}
            name={key}
            value={(form as any)[key]}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-green-400 outline-none"
          />
        ) : null
      )}

      <select
        name="company_type"
        value={form.company_type}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800"
      >
        <option value="bike">Bike</option>
        <option value="solar">Solar</option>
        <option value="pos">POS</option>
        <option value="electronics">Electronics</option>
        <option value="other">Other</option>
      </select>

      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:scale-[1.02] transition">
        Update Company
      </button>
    </motion.form>
  );
}