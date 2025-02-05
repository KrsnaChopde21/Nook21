'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)
      await signIn(email, password)
      router.push('/dashboard')
    } catch (error: any) {
      console.log('Firebase Auth Error:', error.code, error.message)
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email address.')
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.')
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.')
      } else {
        setError(`Failed to sign in: ${error.message}`)
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        <div>
          <Link href="/" className="flex justify-center font-bold text-3xl text-indigo-600">
            NOOK
          </Link>
          <h2 className="mt-6 font-extrabold text-3xl text-center text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-500 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
          <div className="-space-y-px shadow-sm rounded-md">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block relative focus:z-10 border-gray-300 focus:border-indigo-500 px-3 py-2 border rounded-none rounded-t-md focus:ring-indigo-500 w-full text-gray-900 sm:text-sm appearance-none focus:outline-none placeholder-gray-500"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block relative focus:z-10 border-gray-300 focus:border-indigo-500 px-3 py-2 border rounded-b-md rounded-none focus:ring-indigo-500 w-full text-gray-900 sm:text-sm appearance-none focus:outline-none placeholder-gray-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="border-gray-300 rounded focus:ring-indigo-500 w-4 h-4 text-indigo-600"
              />
              <label htmlFor="remember-me" className="block ml-2 text-gray-900 text-sm">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="relative flex justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 border border-transparent rounded-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full font-medium text-sm text-white disabled:cursor-not-allowed focus:outline-none group"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 