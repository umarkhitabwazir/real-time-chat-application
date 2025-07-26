import { useRouter } from 'next/navigation'
import React from 'react'

const SignUpWithGoogleComponent = () => {
  const API = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const signup = async () => {
    router.push(`${API}/auth/google`);
  }
  return (
    <div className="flex justify-center items-center mt-4">
      <button
        type='reset'
        onClick={signup}
        className="flex items-center cursor-pointer gap-3 bg-white text-gray-700 border border-gray-300 rounded-full px-6 py-3 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google logo"
          className="w-5 h-5"
        />
        <span className="text-sm font-medium">Sign up with Google</span>
      </button>
    </div>

  )
}

export default SignUpWithGoogleComponent
