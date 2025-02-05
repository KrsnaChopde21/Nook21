'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import Link from 'next/link'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <div className="top-0 z-50 sticky bg-nook-500 text-white">
      <div className="mx-auto px-6 py-2 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-bold text-2xl hover:text-nook-100 tracking-tight transition-all"
          >
            NOOK
          </Link>

          {/* Navigation */}
          <nav className="md:flex items-center gap-x-8 hidden">
            <a 
              href="#features" 
              className="hover:bg-nook-600/10 px-3 py-1.5 rounded-md text-sm hover:text-nook-100 transition-all"
            >
              Powerful Features
            </a>
            <a 
              href="#security" 
              className="hover:bg-nook-600/10 px-3 py-1.5 rounded-md text-sm hover:text-nook-100 transition-all"
            >
              Security & Reliability
            </a>
            <a 
              href="#benefits" 
              className="hover:bg-nook-600/10 px-3 py-1.5 rounded-md text-sm hover:text-nook-100 transition-all"
            >
              Benefits
            </a>
            <a 
              href="#pricing" 
              className="hover:bg-nook-600/10 px-3 py-1.5 rounded-md text-sm hover:text-nook-100 transition-all"
            >
              Pricing
            </a>
          </nav>

          {/* Right Section: Customer Care and Login */}
          <div className="flex items-center gap-x-6">
            {/* Customer Care */}
            <div className="flex items-center text-sm">
              <div className="flex items-center gap-x-2">

               
                
              </div>
            </div>

            {/* Login Button */}
            {user ? (
              <button
                onClick={() => signOut()}
                className="bg-white hover:bg-nook-50 hover:shadow-md px-3.5 py-1.5 rounded-md focus:ring-2 focus:ring-nook-200 focus:ring-offset-2 focus:ring-offset-nook-500 font-semibold text-nook-500 text-sm transition-all"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-white hover:bg-nook-50 hover:shadow-md px-3.5 py-1.5 rounded-md focus:ring-2 focus:ring-nook-200 focus:ring-offset-2 focus:ring-offset-nook-500 font-semibold text-nook-500 text-sm transition-all"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 