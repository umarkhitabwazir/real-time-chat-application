'use client'
import React from 'react'
import { User } from '../interfaces/user.interface'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const profileComponent: React.FC<User> = ({ user }) => {
    const API = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()


    const loggedOut = async () => {
        try {
            await axios.get(`${API}/loggedOut`, { withCredentials: true });
            router.push('/api/login')


        } catch (error) {
            router.push(`/api/login?redirectTo=${encodeURIComponent(window.location.href)}`);


        }
    }
    return (
        <div className='absolute right-0 top-11   z-50' >
            <div className='   p-4 w-45 rounded-b-md bg-gray-800 text-white'>
                <div className=' flex flex-col items-center justify-start space-y-2'>
                    <h1 className='text-2xl font-bold'>Profile</h1>
                    <img src={user.avatar || " /default-avatar.png"} alt={`${user.username} profile`} className='rounded-full bg-cover object-cover w-10 h-10' />
                    <span className='ml-2'>{user.username}</span>
                    <span className='ml-2 text-xs '>{user.email}</span>

                    <button className='ml-2 w-full cursor-pointer hover:bg-red-400 bg-red-500 text-white px-2 py-1 rounded'
                        onClick={loggedOut}>Logout</button>
                    <button className='ml-2 w-full cursor-pointer hover:bg-blue-400 bg-blue-500 text-white px-2 py-1 rounded'>Settings</button>
                    <button className='ml-2 w-full cursor-pointer hover:bg-green-400 bg-green-500 text-white px-2 py-1 rounded'>Profile</button>
                </div>



            </div>
        </div>
    )
}

export default profileComponent
