import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/providers/AppProviders'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'APEX Studio', template: '%s | APEX Studio' },
  description: 'Premium fitness studio offering yoga, HIIT, spin, pilates, boxing, and more. Book your class today.',
  keywords: ['fitness', 'yoga', 'HIIT', 'spin', 'pilates', 'gym', 'studio', 'workout'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100`}>
        <AppProviders>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  )
}
