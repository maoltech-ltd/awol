"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, BatteryCharging, Zap } from "lucide-react"
import Image from "next/image"
import api from "@/src/api"

interface ProductModel {
  id: number
  model_name: string
  cash_price: number
  installment_price?: number
  down_payment?: number
  installment_months: number
  installment_allowed: Boolean
  default_image: string
  other_images?: string[]
  stock_quantity: number
  is_available: boolean
  is_featured: boolean
  features?: Record<string, string>
}

interface Product {
  id: number
  name: string
  models: ProductModel[]
}

interface Company {
  id: number
  name: string
  company_type: string
  products: Product[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<ProductModel | null>(null)
  const [searchProduct, setSearchProduct] = useState("")
  const [searchModel, setSearchModel] = useState("")
  const [companyFilter, setCompanyFilter] = useState("")


  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [installmentOnly, setInstallmentOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)


  useEffect(() => {

    const params = new URLSearchParams()

    if (searchProduct) params.append("product", searchProduct)
    if (searchModel) params.append("model", searchModel)
    if (companyFilter) params.append("company", companyFilter)

    if (minPrice) params.append("min_price", minPrice)
    if (maxPrice) params.append("max_price", maxPrice)

    if (installmentOnly) params.append("installment_allowed", "true")
    params.append("page", String(page))
    params.append("page_size", "20")

    api.get(`v1/customer-awol/companies-products?${params.toString()}`)
      .then(res => {
        
        const companies: Company[] = res.data

        // setHasNext(!!companies?.next)
        // setHasPrev(!!companies?.previous)

        setProducts(companies.flatMap(company => company.products))

      })

}, [searchProduct, searchModel, companyFilter, minPrice, maxPrice, installmentOnly, page])

useEffect(() => {
  setPage(1)
}, [searchProduct, searchModel, companyFilter, minPrice, maxPrice, installmentOnly])

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-950 dark:to-black text-gray-900 dark:text-white">

      {/* PAGE HEADER */}

      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold"
        >
          Explore Our Products
        </motion.h1>

        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Browse innovative technology from our partner companies.
          Purchase instantly or through flexible installment plans.
        </p>

      </section>

      <section className="max-w-7xl mx-auto px-6 pb-12">

        <div className="bg-white dark:bg-gray-900 shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] rounded-xl p-6 grid md:grid-cols-3 gap-4">

          {/* PRODUCT SEARCH */}

          <motion.input
            whileFocus={{ scale: 1.05 }}
            whileHover={{ scale: 1.02 }}
            placeholder="Search product..."
            value={searchProduct}
            onChange={(e)=>setSearchProduct(e.target.value)}
            className="px-4 py-2 rounded-lg dark:bg-gray-800 shadow-inner outline-none"
          />

          {/* MODEL SEARCH */}
          <motion.input
            whileFocus={{ scale: 1.05 }}
            whileHover={{ scale: 1.02 }}
            placeholder="Search model..."
            value={searchModel}
            onChange={(e)=>setSearchModel(e.target.value)}
            className="px-4 py-2 rounded-lg dark:bg-gray-800 shadow-inner outline-none"
          />
          {/* COMPANY */}

          <input
            placeholder="Company..."
            value={companyFilter}
            onChange={(e)=>setCompanyFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:bg-gray-800"
          />

          {/* PRICE RANGE */}

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e)=>setMinPrice(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:bg-gray-800"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e)=>setMaxPrice(e.target.value)}
            className="px-4 py-2 rounded-lg border dark:bg-gray-800"
          />

          {/* INSTALLMENT */}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={installmentOnly}
              onChange={(e)=>setInstallmentOnly(e.target.checked)}
            />
            Installment Available
          </label>

        </div>
      </section>

      {/* COMPANIES */}

      <section className="max-w-7xl mx-auto px-6 pb-20 space-y-16">

        {products.map((product, i) => (

          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * .1 }}
          >

            {/* PRODUCTS */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {product.models.map(model => (

                  <motion.div
                    key={model.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white dark:bg-gray-900 shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] rounded-2xl shadow-xl overflow-hidden cursor-pointer"
                    onClick={() => setSelected(model)}
                  >

                    {/* IMAGE */}

                    {/* <div className="h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center"> */}
                    {/* <div className="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden"> */}
                    <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-800 overflow-hidden">
                      {model.default_image ? (
                        <Image
                          src={model.default_image}
                          alt={model.model_name}
                          className="object-cover"
                          fill
                          placeholder="blur"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                        />
                      ) : (
                        // <BatteryCharging className="w-12 h-12 text-green-500" />
                        <div className="flex items-center justify-center h-full">
                          <BatteryCharging className="w-12 h-12 text-green-500" />
                        </div>
                      )}
                    </div>


                    {/* INFO */}

                    <div className="p-6">

                      <h3 className="text-xl font-semibold dark:text-dark">
                        {model.model_name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 dark:text-dark">
                        {product.name}
                      </p>

                      <div className="mt-4 space-y-1">

                        <p className="font-bold text-green-500">
                          ₦{model.cash_price}
                        </p>

                        {model.installment_allowed && (
                          <p className="text-sm text-gray-600 dark:text-dark">
                            Installment Available
                          </p>
                        )}

                      </div>

                    </div>

                  </motion.div>

                ))
              }

            </div>

          </motion.div>

        ))}

      </section>

      {/* PRODUCT MODAL */}

      <AnimatePresence mode="wait">
        

        {selected && (

          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              // className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-8 shadow-2xl relative"
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: .8 }}
              animate={{ scale: 1 }}
              exit={{ scale: .8 }}
            >

              <button
                // className="absolute top-4 right-4 dark:text-dark"
                // onClick={() => setSelected(null)}
                className="sticky top-0 ml-auto block bg-white dark:bg-gray-900 z-10 p-2 rounded-full shadow"
                onClick={(e) => e.stopPropagation()}
              >
                <X />
              </button>


              {/* IMAGE */}

              {selected.default_image && (
                <Image
                  src={selected.default_image}
                  alt={selected.model_name}
                  // className="rounded-xl mb-6"
                  className="rounded-xl mb-6 object-cover"
                  width={400}
                  height={300}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              )}


              {/* TITLE */}

              <h2 className="text-2xl font-bold dark:text-dark">
                {selected.model_name}
              </h2>


              {/* PRICE */}

              <div className="mt-4 space-y-2 dark:text-dark">

                <p className="text-green-500 text-xl font-bold">
                  Cash Price: ₦{selected.cash_price}
                </p>

                {selected.installment_allowed && (
                  <>
                    <p>
                      Installment Price: ₦{selected.installment_price}
                    </p>

                    <p>
                      Down Payment: ₦{selected.down_payment}
                    </p>

                    <p>
                      Duration: {selected.installment_months} months
                    </p>
                  </>
                )}

              </div>


              {/* FEATURES */}

              {selected.features && (

                <div className="mt-6">

                  <h3 className="font-semibold mb-3">
                    Features
                  </h3>

                  <ul className="space-y-1 text-sm text-gray-600 dark:text-dark">

                    {Object.entries(selected.features).map(([k, v]) => (
                      <li key={k}>
                        <strong>{k}:</strong> {v}
                      </li>
                    ))}

                  </ul>

                </div>

              )}

            </motion.div>

          </motion.div>

        )}
      <div className="flex justify-center items-center gap-4 mt-10">

        <button
          disabled={!hasPrev}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 
          shadow hover:scale-105 transition disabled:opacity-40"
        >
          Prev
        </button>

        <button
          disabled={!hasNext}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 
          shadow hover:scale-105 transition disabled:opacity-40"
        >
          Next
        </button>

      </div>
      </AnimatePresence>

    </main>
  )
}