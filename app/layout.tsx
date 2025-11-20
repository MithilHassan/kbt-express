import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'


export const metadata: Metadata = {
  title: 'KBT EXPRESS',
  description: 'Global Logistic Solution',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
          <Header />
          {children}
          <Footer />
        <Analytics />
      </body>
    </html>
  )
}
