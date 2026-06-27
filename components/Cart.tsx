'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { validateOrderItems, sanitizeNotes } from '@/lib/validators'

export default function Cart() {
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const router = useRouter()

  if (items.length === 0) return null

  async function handleOrder() {
    setLoading(true)

    const validationError = validateOrderItems(items)
    if (validationError) {
      alert(validationError)
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const cleanNotes = sanitizeNotes(notes)

    const { data: order, error } = await supabase
      .from('orders')
      .insert({ user_id: user.id, total, notes: cleanNotes })
      .select()
      .single()

    if (error || !order) {
      alert('Errore durante l\'ordine, riprova')
      setLoading(false)
      return
    }

    await supabase.from('order_items').insert(
      items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
      }))
    )

    clearCart()
    setLoading(false)
    router.push('/ordini')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-4 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity}× {item.name}</span>
            <span className="text-amber-600">€ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Note sull'ordine (opzionale)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-amber-400"
      />
      <button
        onClick={handleOrder}
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
      >
        {loading ? 'Invio ordine...' : `Ordina • € ${total.toFixed(2)}`}
      </button>
    </div>
  )
}