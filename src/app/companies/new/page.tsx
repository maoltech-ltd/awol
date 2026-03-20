
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { addCompany } from "@/src/redux/slice/awol/companySlice";

export default function NewCompany() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    address: "",
    company_type: "other",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.token) return;

    await dispatch(addCompany({ token: user.token, data: form })).unwrap();
    router.push("/companies");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <form
        onSubmit={submit}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl space-y-5"
      >
        <h1 className="text-3xl font-bold text-green-700">
          Add Company
        </h1>

        {/* INPUTS */}
        {[
          { name: "name", placeholder: "Company Name" },
          { name: "contact_person", placeholder: "Contact Person" },
          { name: "phone", placeholder: "Phone Number" },
          { name: "address", placeholder: "Address" },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={(form as any)[field.name]}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner focus:ring-2 focus:ring-green-400 outline-none"
          />
        ))}

        {/* SELECT */}
        <select
          name="company_type"
          value={form.company_type}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-inner"
        >
          <option value="bike">Bike Company</option>
          <option value="solar">Solar Company</option>
          <option value="pos">POS Provider</option>
          <option value="electronics">Electronics</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.02] transition"
        >
          Save Company
        </button>
      </form>
    </motion.div>
  );
}