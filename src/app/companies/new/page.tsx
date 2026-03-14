// // 

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/store";
// import { useAppDispatch } from "@/src/redux/hooks/dispatch";
// import { addCompany } from "@/src/redux/slice/awol/companySlice";

// export default function NewCompany() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const user = useSelector((state: RootState) => state.user);

//   const [name, setName] = useState("");

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();

//     if (!user?.token) return;

//     await dispatch(addCompany({ token: user.token, data: { name } })).unwrap();

//     router.push("/aw/companies");
//   }

//   return (
//     <form onSubmit={submit} className="p-6 max-w-xl space-y-4">
//       <h1 className="text-xl font-semibold">Add Company</h1>

//       <input
//         className="border w-full px-3 py-2"
//         placeholder="Company Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//       />

//       <button className="border px-4 py-2">Save</button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
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
    <div className="p-6 max-w-2xl mx-auto">
      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border p-6 
        bg-white dark:bg-zinc-900 
        border-gray-200 dark:border-zinc-700
        shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Add Company
        </h1>

        {/* Company Name */}
        <input
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded-lg border
          bg-white dark:bg-zinc-800
          border-gray-300 dark:border-zinc-600
          text-gray-800 dark:text-gray-100"
        />

        {/* Contact Person */}
        <input
          name="contact_person"
          placeholder="Contact Person"
          value={form.contact_person}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border
          bg-white dark:bg-zinc-800
          border-gray-300 dark:border-zinc-600
          text-gray-800 dark:text-gray-100"
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border
          bg-white dark:bg-zinc-800
          border-gray-300 dark:border-zinc-600
          text-gray-800 dark:text-gray-100"
        />

        {/* Address */}
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border
          bg-white dark:bg-zinc-800
          border-gray-300 dark:border-zinc-600
          text-gray-800 dark:text-gray-100"
        />

        {/* Company Type */}
        <select
          name="company_type"
          value={form.company_type}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border
          bg-white dark:bg-zinc-800
          border-gray-300 dark:border-zinc-600
          text-gray-800 dark:text-gray-100"
        >
          <option value="bike">Bike Company</option>
          <option value="solar">Solar Company</option>
          <option value="pos">POS Provider</option>
          <option value="electronics">Electronics</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 rounded-xl
          bg-black text-white
          dark:bg-white dark:text-black
          transition hover:opacity-90"
        >
          Save Company
        </button>
      </form>
    </div>
  );
}

