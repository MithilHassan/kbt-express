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
  openGraph: {
    title: 'KBT EXPRESS',
    description: 'Global Logistic Solution',
    url: 'https://kbtexpress.net',
    images: [
      {
        url: 'https://kbtexpress.net/logo.png',  
        width: 800,
        height: 600,
        alt: 'KBT EXPRESS Logo',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/x-icon"></link>
        <meta property="og:title" content="KBT EXPRESS" />
        <meta property="og:description" content="Global Logistic Solution" />
        <meta property="og:image" content="https://kbtexpress.net/logo.png" />
        <meta property="og:url" content="https://kbtexpress.net" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
