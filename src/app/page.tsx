"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, BatteryCharging, Sun, X } from "lucide-react"

export default function LandingPage() {

  const [modal, setModal] = useState<null | string>(null)

  const openModal = (type: string) => setModal(type)
  const closeModal = () => setModal(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-950 dark:to-black text-gray-900 dark:text-white overflow-x-hidden">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-24 grid lg:grid-cols-2 gap-14 items-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Welcome to  
            <span className="text-green-500"> AWOL Energy</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            AWOL delivers innovative technology designed to power modern
            lifestyles. From electric mobility to renewable energy systems
            and smart electronics — we make advanced technology accessible
            through instant purchase or flexible installment plans.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <Link
              href="/customer/products"
              className="px-8 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition"
            >
              Explore Products
            </Link>

            <button
              onClick={() => openModal("company")}
              className="px-8 py-4 rounded-xl border border-gray-400 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 transition"
            >
              About AWOL
            </button>

          </div>
        </motion.div>


        {/* Animated visual */}
        <motion.div
          initial={{ opacity: 0, scale: .8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .8 }}
          className="relative"
        >

          <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 rounded-full"></div>

          <div className="relative bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-10 rounded-3xl shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <Zap className="text-green-500 w-8 h-8" />
              <span className="text-sm text-gray-500">AWOL Technology</span>
            </div>

            <h3 className="text-2xl font-bold">
              Smart Energy & Mobility
            </h3>

            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
              Experience the future of transportation, solar energy,
              and electronics built for modern living.
            </p>

          </div>

        </motion.div>

      </section>


      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">

        {[
          {
            title: "Electric Mobility",
            icon: BatteryCharging,
            desc: "Advanced electric bikes and vehicles built for performance and sustainability."
          },
          {
            title: "Solar Energy",
            icon: Sun,
            desc: "Power homes and businesses with reliable solar panels and inverter systems."
          },
          {
            title: "Smart Electronics",
            icon: Zap,
            desc: "Modern electronics and appliances designed to simplify everyday life."
          }
        ].map((item, i) => {

          const Icon = item.icon

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * .2 }}
              className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl"
            >

              <Icon className="w-10 h-10 text-green-500 mb-5" />

              <h3 className="text-xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                {item.desc}
              </p>

            </motion.div>
          )
        })}

      </section>


      {/* INSTALLMENT SECTION */}
      <section className="py-24 bg-gray-100 dark:bg-gray-950">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold"
          >
            Flexible Payment Options
          </motion.h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Choose between instant payment or installment plans designed to
            make advanced technology affordable.
          </p>

          <div className="grid md:grid-cols-2 gap-10 mt-14">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-10 rounded-2xl bg-white dark:bg-gray-900 shadow-xl"
            >
              <h3 className="text-2xl font-bold">
                Instant Payment
              </h3>

              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Purchase your products immediately and enjoy full ownership
                right away with exclusive purchase benefits.
              </p>

              <Link
                href="/customer/products"
                className="inline-block mt-6 px-6 py-3 bg-green-500 text-white rounded-lg"
              >
                Shop Now
              </Link>
            </motion.div>


            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-10 rounded-2xl bg-white dark:bg-gray-900 shadow-xl"
            >
              <h3 className="text-2xl font-bold">
                Installment Plans
              </h3>

              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Spread your payments over time with flexible installment
                packages designed to fit your budget.
              </p>

              <button
                onClick={() => openModal("models")}
                className="inline-block mt-6 px-6 py-3 bg-green-500 text-white rounded-lg"
              >
                View Packages
              </button>
            </motion.div>

          </div>

        </div>

      </section>


      {/* STATS */}
      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">

          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "500+", label: "Products Available" },
            { value: "24/7", label: "Customer Support" }
          ].map((stat, i) => (

            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * .2 }}
            >
              <h3 className="text-4xl font-bold text-green-500">
                {stat.value}
              </h3>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>

          ))}

        </div>

      </section>


      {/* CTA */}
      <section className="py-28 text-center">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >

          <h2 className="text-5xl font-bold">
            Discover The Future With AWOL
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Explore innovative energy, mobility and electronics solutions.
          </p>

          <Link
            href="/customer/products"
            className="inline-block mt-8 px-10 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-lg"
          >
            Browse Products
          </Link>

        </motion.div>

      </section>


      {/* MODALS */}

      <AnimatePresence>

        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
          >

            <motion.div
              initial={{ scale: .8 }}
              animate={{ scale: 1 }}
              exit={{ scale: .8 }}
              className="bg-white dark:bg-gray-900 max-w-lg w-full p-8 rounded-2xl shadow-2xl relative"
            >

              <button
                onClick={closeModal}
                className="absolute top-4 right-4"
              >
                <X />
              </button>


              {modal === "company" && (
                <>
                  <h3 className="text-2xl font-bold">
                    About AWOL
                  </h3>

                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    AWOL is a technology-driven company focused on delivering
                    innovative solutions in renewable energy, electric
                    mobility, and smart electronics. Our mission is to make
                    advanced technology accessible through flexible payment
                    systems and reliable products.
                  </p>
                </>
              )}


              {modal === "models" && (
                <>
                  <h3 className="text-2xl font-bold">
                    Installment Packages
                  </h3>

                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Packages and models from the database can be displayed
                    here dynamically. Customers can explore payment plans,
                    durations and monthly costs.
                  </p>
                </>
              )}

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </main>
  )
}