'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

export default function NavBar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setIsAdmin(profile?.role === 'admin')
      }
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setIsAdmin(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-amber-500 text-white px-4 py-3 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">🍺 Luppolo Ribelle</Link>
      <div className="flex gap-4 items-center text-sm">
        {user ? (
          <>
            {isAdmin && (
              <Link href="/admin" className="hover:underline font-semibold">Admin</Link>
            )}
            <Link href="/ordini" className="hover:underline">I miei ordini</Link>
            <button onClick={handleLogout} className="hover:underline">Esci</button>
          </>
        ) : (
          <Link href="/login" className="hover:underline">Accedi</Link>
        )}
      </div>
    </nav>
  )
}