import { AuthProvider } from '@/lib/contexts/AuthContext'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nook - Your Library\'s Digital Manager',
  description: 'A cutting-edge library management system designed to make library operations effortless.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
