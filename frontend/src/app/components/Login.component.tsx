"use client"
import React from 'react'
import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { setTimeout } from 'timers'

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
    <div className="bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto">
        <div className="flex flex-col p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500">Please sign in to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  if (e.target.value.length > 0) setError('')
                  setEmail(e.target.value)
                }}
                className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (e.target.value.length > 0) setError('')
                }}
                className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5 cursor-pointer text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 cursor-pointer text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        <div className="flex justify-center items-center text-gray-500 mt-2">
          <span>or</span>
        </div>

        <div className="mt-4 text-center">
          <Link href="/api/register" className="text-blue-600 hover:underline">
            Go to register
          </Link>
        </div>
        </div>
        
      </form>
    </div>
  )
}


export default LoginComponent
