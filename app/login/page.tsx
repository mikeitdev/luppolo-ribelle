'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [isForgot, setIsForgot] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (isForgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) setError(error.message)
      else setSuccess('Email inviata! Controlla la tua casella di posta.')
      setLoading(false)
      return
    }

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else router.push('/')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email o password errati')
      else router.push('/')
    }

    setLoading(false)
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center mb-8">
        {isForgot ? 'Reset password' : isRegister ? 'Crea account' : 'Accedi'}
      </h1>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
        />

        {!isForgot && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
          />
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Caricamento...' : isForgot ? 'Invia email' : isRegister ? 'Registrati' : 'Accedi'}
        </button>

        {!isForgot && (
          <>
            <button
              onClick={() => { setIsRegister(!isRegister); setError(null) }}
              className="text-sm text-gray-500 hover:text-gray-700 underline text-center"
            >
              {isRegister ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
            </button>
            <button
              onClick={() => { setIsForgot(true); setError(null) }}
              className="text-sm text-gray-400 hover:text-gray-600 underline text-center"
            >
              Password dimenticata?
            </button>
          </>
        )}

        {isForgot && (
          <button
            onClick={() => { setIsForgot(false); setError(null); setSuccess(null) }}
            className="text-sm text-gray-500 hover:text-gray-700 underline text-center"
          >
            Torna al login
          </button>
        )}
      </div>
    </main>
  )
}