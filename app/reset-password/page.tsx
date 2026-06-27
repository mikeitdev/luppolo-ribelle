'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      console.log('code:', code)

      if (!code) {
        setError('Link non valido o scaduto')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      console.error('Errore exchange:', JSON.stringify(error))

      if (error) {
        setError('Link non valido o scaduto')
      } else {
        setReady(true)
      }
    }

    init()
  }, [])

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

    if (error) {
      setError(error.message)
    } else {
      await supabase.auth.signOut()
      router.push('/login')
    }

    setLoading(false)
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center mb-8">Nuova password</h1>

      {!ready && !error && (
        <p className="text-center text-gray-400">Verifica in corso...</p>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      {ready && (
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

          <button
            onClick={handleReset}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Salvataggio...' : 'Aggiorna password'}
          </button>
        </div>
      )}
    </main>
  )
}