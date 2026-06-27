import type { Metadata, Viewport } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import { CartProvider } from '@/context/CartContext'

export const metadata: Metadata = {
  title: 'Luppolo Ribelle',
  description: 'Birreria, Pinse e Pucce',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f59e0b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="bg-gray-50 min-h-screen">
        <CartProvider>
          <NavBar />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}