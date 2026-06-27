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

const nextStatus: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'ready',
  ready: 'completed',
}

const nextStatusLabel: Record<string, string> = {
  pending: 'Conferma',
  confirmed: 'Pronto',
  ready: 'Completa',
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      // Verifica che l'utente sia admin
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') { router.push('/'); return }

      await fetchOrders()
    }
    load()
  }, [router])

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('id, status, total, notes, created_at, order_items(id, product_name, product_price, quantity)')
      .neq('status', 'completed')
      .order('created_at', { ascending: true })

    setOrders((data as Order[]) ?? [])
    setLoading(false)
  }

  async function updateStatus(orderId: string, newStatus: string) {
  await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  await fetchOrders()
  }

  if (loading) return <p className="text-center py-16 text-gray-400">Caricamento...</p>

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Pannello Admin</h1>
      <p className="text-gray-500 mb-6">Ordini attivi (esclusi i completati)</p>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-16">Nessun ordine attivo 🎉</p>
      ) : (
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
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[order.status]}`}>
                  {statusLabel[order.status]}
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

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold text-amber-600">€ {order.total.toFixed(2)}</span>
                {nextStatus[order.status] && (
                  <button
                    onClick={() => updateStatus(order.id, nextStatus[order.status])}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                  >
                    {nextStatusLabel[order.status]} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}