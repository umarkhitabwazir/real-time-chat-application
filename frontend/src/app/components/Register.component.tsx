'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { useRouter} from 'next/navigation';


const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
const router=useRouter()


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
    <div className="flex items-center text-black justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="text-black w-full mb-4 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />



        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-6 p-3 border text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <div className='flex justify-center items-center mb-2'>

          <p className='text-red-500'>{error}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${loading?'cursor-not-allowed bg-gray-500':'bg-blue-600 hover:bg-blue-700'} w-full   text-white py-3 rounded-xl  transition`}
        >
           {loading?'Loading...':'Register'} 
        </button>

        <div className="flex justify-center items-center text-gray-500 mt-2">
          <span>or</span>
        </div>

        <div className="mt-4 text-center">
          <Link href="/api/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterComponent;
