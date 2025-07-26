'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import SignUpWithGoogleComponent from './SignUpWithGoogle.component';


const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()


  const API = process.env.NEXT_PUBLIC_API_URL


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(false)
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering user:', formData);
    setLoading(true)
    try {
      await axios.post(`${API}/sign-up`, formData)
      alert('please login with the recently registered email')
      return router.push('/api/login')
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setLoading(false)
        setError(error.response?.data.error)
        console.log('signup-error', error.response?.data.error)
      }
    } finally {
      setLoading(false)

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm">Sign up to get started</p>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold text-white rounded-xl transition-all ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-x-0 border-t border-gray-300"></div>
          <span className="bg-white px-3 text-gray-400 text-sm z-10">or</span>
        </div>

        <div>
          <SignUpWithGoogleComponent />
        </div>

        <div className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{' '}
          <Link href="/api/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>

  );
};

export default RegisterComponent;
