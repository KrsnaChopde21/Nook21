'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { LogOut, User, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="top-0 left-0 fixed bg-white border-r w-16 md:w-48 lg:w-64 h-screen transition-all duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Link href="/dashboard" className="font-bold text-xl md:text-2xl text-nook-500 text-center md:text-left block">
              <span className="hidden md:inline">NOOK</span>
              <span className="md:hidden">N</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 md:p-4">
            <Link 
              href="/dashboard/customers"
              className="flex items-center justify-center md:justify-start space-x-2 hover:bg-nook-50 p-2 rounded-md text-gray-700 hover:text-nook-500"
            >
              <Users size={20} />
              <span className="hidden md:inline">Customers</span>
            </Link>
            <Link 
              href="/dashboard/add-customer"
              className="flex items-center justify-center md:justify-start space-x-2 hover:bg-nook-50 p-2 rounded-md text-gray-700 hover:text-nook-500"
            >
              <User size={20} />
              <span className="hidden md:inline">Add Customer</span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="p-2 md:p-4 border-t">
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center md:justify-start space-x-2 hover:bg-red-50 p-2 rounded-md w-full text-gray-700 hover:text-red-600"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-16 md:ml-48 lg:ml-64 p-4 md:p-8 w-full">
        {children}
      </main>
    </div>
  )
} 