import {createBrowserClient} from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
   {
    auth: {
      flowType: 'pkce',
      storage: {
        getItem: (key) => {
          if (typeof document === 'undefined') return null
          const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'))
          return match ? decodeURIComponent(match[2]) : null
        },
        setItem: (key, value) => {
          if (typeof document === 'undefined') return
          document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=3600;SameSite=Lax`
        },
        removeItem: (key) => {
          if (typeof document === 'undefined') return
          document.cookie = `${key}=;path=/;max-age=0`
        },
      },
    },
  }
)