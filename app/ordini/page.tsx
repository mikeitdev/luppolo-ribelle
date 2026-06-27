'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type OrderItem = {
  id: string
  product_name: string
  product_price: number
  quantity: number
}

type Order = {
  id: string
  status: string
  total: number
  notes: string | null
  created_at: string
  order_items: OrderItem[]
}

const statusLabel: Record<string, string> = {
  pending: '⏳ In attesa',
  confirmed: '✅ Confermato',
  ready: '🔔 Pronto',
  completed: '✔️ Completato',
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-600',
}

export default function OrdiniPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('orders')
        .select('id, status, total, notes, created_at, order_items(id, product_name, product_price, quantity)')
        .order('created_at', { ascending: false })

      setOrders((data as Order[]) ?? [])
      setLoading(false)
    }

    load()
  }, [router])

  if (loading) return <p className="text-center py-16 text-gray-400">Caricamento...</p>

  if (orders.length === 0) return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-gray-500 text-lg">Nessun ordine ancora.</p>
      <button
        onClick={() => router.push('/')}
        className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-xl hover:bg-amber-600"
      >
        Vai al menu
      </button>
    </main>
  )

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">I miei ordini</h1>

      <div className="flex flex-col gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-400">
                  {new Date(order.created_at).toLocaleString('it-IT')}
                </p>
                {order.notes && (
                  <p className="text-sm text-gray-500 mt-1">📝 {order.notes}</p>
                )}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[order.status] ?? 'bg-gray-100'}`}>
                {statusLabel[order.status] ?? order.status}
              </span>
            </div>

            <div className="flex flex-col gap-1 mb-3">
              {order.order_items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}× {item.product_name}</span>
                  <span className="text-gray-500">€ {(item.product_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 flex justify-end">
              <span className="font-semibold text-amber-600">Totale: € {order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}