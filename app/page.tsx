'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import Cart from '@/components/Cart'

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  available: boolean
}

type Category = {
  id: string
  name: string
  position: number
  products: Product[]
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const { addItem, removeItem, items } = useCart()

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name, position, products(id, name, description, price, available)')
      .order('position')
      .order('position', { referencedTable: 'products' })
      .then(({ data }) => setCategories((data as Category[]) ?? []))
  }, [])

  function getQuantity(id: string) {
    return items.find(i => i.id === id)?.quantity ?? 0
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 pb-48">
      <h1 className="text-3xl font-bold text-center mb-2">🍺 Luppolo Ribelle</h1>
      <p className="text-center text-gray-500 mb-8">Birreria • Pinse • Pucce</p>

      {categories.map((category) => (
        <section key={category.id} className="mb-10">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">{category.name}</h2>
          <div className="flex flex-col gap-4">
            {category.products?.filter(p => p.available).map((product) => {
              const qty = getQuantity(product.id)
              return (
                <div key={product.id} className="flex justify-between items-center bg-white rounded-xl shadow-sm p-4">
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    {product.description && (
                      <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                    )}
                    <p className="font-semibold text-amber-600 mt-1">€ {product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {qty > 0 && (
                      <>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="w-4 text-center font-semibold">{qty}</span>
                      </>
                    )}
                    <button
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                      className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <Cart />
    </main>
  )
}