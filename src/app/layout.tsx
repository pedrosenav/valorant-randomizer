import type { Metadata } from 'next'
import { Inter, Anton } from 'next/font/google'
import './globals.css'

import Header from '@/components/Header'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Valorant Randomizer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.variable} ${anton.variable} bg-gray-900 font-sans text-white`}
      >
        <Header />
        {children}
      </body>
    </html>
  )
}
