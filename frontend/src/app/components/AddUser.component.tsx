'use client'
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useState } from 'react'

const AddUserComponent = ({ setShowAddUser }: { setShowAddUser: Dispatch<SetStateAction<boolean>> }) => {
    const [user, setUser] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL;
    const submitHandler = async () => {
        setError('');
        setLoading(true);
        if (!user) {
            setError('User name is required');
            setLoading(false);
            return;
        }
        if (user.length < 3) {
            setError('User name must be at least 3 characters long');
            return;
        }
        try {
            await axios.get(`${API}/check-user/${user}`);
            setLoading(false);
            setShowAddUser(false);
            router.push(`/api/chat?user=${user}`);

        } catch (error) {
            if (error instanceof AxiosError && error.response?.data.status === 404) {
                setLoading(false);
                setError(error.response?.data.error);

            }
        }
    }
    return (
      <div className="fixed inset-0 z-50 bg-gray-700  flex items-center justify-center px-4">
  <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
    {/* Close Button */}
    <button
      onClick={() => {
        setShowAddUser(false);
        setError('');
        setUser('');
      }}
      className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl cursor-pointer font-bold"
      aria-label="Close"
    >
      &times;
    </button>

    {/* Content */}
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Add User</h2>

      <input
        type="text"
        value={user}
        onKeyDown={(e) => e.key === 'Enter' && submitHandler()}
        onChange={(e) => {
          setError('');
          setLoading(false);
          setUser(e.target.value);
        }}
        placeholder="Enter username"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
      />

      <button
        onClick={submitHandler}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded-lg hover:bg-blue-500 transition"
      >
        {loading ? 'Loading...' : 'Select'}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  </div>
</div>

    )
}

export default AddUserComponent
