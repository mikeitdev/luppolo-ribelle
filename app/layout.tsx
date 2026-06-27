import type { Metadata, Viewport } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import { CartProvider } from '@/context/CartContext'

export const metadata: Metadata = {
  title: 'Luppolo Ribelle',
  description: 'Birreria, Pinse e Pucce',
  manifest: '/manifest.json',
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