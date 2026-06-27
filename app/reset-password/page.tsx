'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    setError(null)

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri')
      return
    }

    if (password !== confirm) {
      setError('Le password non coincidono')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) setError(error.message)
    else {
      await supabase.auth.signOut()
      router.push('/login')
    }

    setLoading(false)
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center mb-8">Nuova password</h1>

      <div className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Nuova password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
        />
        <input
          type="password"
          placeholder="Conferma password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : 'Aggiorna password'}
        </button>
      </div>
    </main>
  )
}