import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'MOONIT — Your AI Assistant',
  description:
    'MOONIT — Your intelligent AI assistant. Ask questions, get instant answers, and explore ideas together.',
  openGraph: {
    title: 'MOONIT — Your AI Assistant',
    description: 'Ask questions, get instant answers, and explore ideas together.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  userScalable: true,
}

import { AuthProvider } from '@/hooks/use-auth'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#000000] text-white overflow-x-hidden" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
