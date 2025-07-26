"use client"
import React from 'react'
import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { setTimeout } from 'timers'
import LoginUpWithGoogleComponent from './LoginWithGoogle.component'

const LoginComponent = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo: string | null = searchParams.get('redirectTo') || '/';
  const API = process.env.NEXT_PUBLIC_API_URL || ''
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }
    try {
      const response = await axios.post(`${API}/login`, {
        email: email,
        password: password
      }, { withCredentials: true })
      console.log(response.data)
      setLoading(false)
      router.push(`${redirectTo}`)
      setTimeout(() => {
        window.location.reload()
      }
        , 1500)


    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setLoading(false)
        console.log(err.response?.data.error)
        setError(err.response?.data.error)
      }
    }
  }
  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
  <form onSubmit={handleSubmit} className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl space-y-6">
    
    <div className="text-center">
      <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back 👋</h1>
      <p className="text-gray-500 mt-1">Sign in to your account to continue</p>
    </div>

    {error && (
      <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">
        {error}
      </div>
    )}

    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => {
          if (e.target.value.length > 0) setError('');
          setEmail(e.target.value);
        }}
        className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value.length > 0) setError('');
          }}
          className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none pr-12 transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-500 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Signing in...' : 'Sign In'}
    </button>

    <div className="text-center text-sm text-gray-500">or</div>

    <div className="text-center">
      <Link href="/api/register" className="text-indigo-600 hover:underline text-sm">
        Don't have an account? Register
      </Link>
    </div>

    <div className="pt-2">
      <LoginUpWithGoogleComponent />
    </div>
  </form>
</div>

  )
}


export default LoginComponent
