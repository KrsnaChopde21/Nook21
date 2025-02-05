'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signUp, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      await signIn(email, password)
    } else {
      await signUp(email, password)
    }
  }

  return (
    <div className="bg-white shadow-md mx-auto mt-8 p-6 rounded-lg max-w-md">
      <h2 className="mb-6 font-bold text-2xl text-center">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 border rounded-lg w-full"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 border rounded-lg w-full"
            required
          />
        </div>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg w-full text-white"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 hover:underline"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  )
} 