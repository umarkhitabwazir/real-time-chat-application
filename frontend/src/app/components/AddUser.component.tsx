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
        <div className=' w-full h-full text-black z-50 absolute  bg-gray-400 opacity-90 p-4 flex flex-col items-center space-y-4'>
            <div className='w-70 h-60 sm:w-auto sm:h-auto bg-white flex flex-col justify-center items-center rounded-lg  relative p-4'>
                <div className='absolute  right-2 top-1'>
                    <button
                        onClick={() => {
                            setShowAddUser(false);
                            setError('');
                            setUser('');
                        }}
                        className='text-xl text-black hover:text-red-600 cursor-pointer'>
                        &times;</button>
                </div>
                <div className='flex flex-col items-center justify-center space-y-4'>
                    <h1 className='text-2xl font-bold text-black'>Add User</h1>
                    <input type="text"
                        value={user}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                submitHandler();
                            }
                        }}
                        onChange={(e) => {
                            setError('');
                            setLoading(false);
                            setUser(e.target.value);
                        }}
                        className="border rounded p-2 mr-2 text-black" placeholder="Type user name..." />
                    <button
                        onClick={submitHandler}
                        disabled={loading}
                        className="bg-blue-500 text-white cursor-pointer hover:bg-blue-400 rounded px-4 py-2">
                        {loading ? "loading..." : "select"}
                    </button>
                    {
                        error && <div className='text-red-500 text-sm'>{error}</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default AddUserComponent
