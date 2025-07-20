'use client'
import React, { useState } from 'react'
import { Message } from '../interfaces/message.interface'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'



const MoreComponent = ({ currentUserName, message, fetchMessages }: { currentUserName: string | null, message: Message, fetchMessages: () => Promise<void> }) => {
  const [showDelete, setShowDelete] = useState(false)
  const [showComponent, setShowComponent] = useState(false)
  const API = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const deleteForEveryOneHandler = async () => {
    try {
      await axios.patch(`${API}/deleteForEveryOne/${message._id}`, {}, { withCredentials: true })
      await fetchMessages()
      setShowDelete(true)
      setShowDelete(false)



    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.error === "Unauthorized") {
          setShowDelete(true)


          router.push(`/api/login?redirectTo=${encodeURIComponent(window.location.href)}`)

        }

      }
    }
  }

  const deleteForMeHandler = async () => {
    try {
      await axios.patch(`${API}/deleteForMe/${message._id}`, {}, { withCredentials: true })
      await fetchMessages()
      setShowDelete(true)
      setShowDelete(false)

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.error === "Unauthorized") {
          setShowDelete(true)


          router.push(`/api/login?redirectTo=${encodeURIComponent(window.location.href)}`)
        }
      }
    }
  }
  return (
    <>
      <div onMouseLeave={() => {
        setShowComponent(true);
          setShowDelete(false)
      }} className={`${showComponent ? "hidden" : ''}
         relative right-3 z-48  bg-blue-500 shadow-2xl rounded-md flex justify-center items-start p-1 h-60 w-40`}>
        <button
          onClick={() => setShowDelete((prev) => !prev)}
          className='text-white bg-green-500 w-full cursor-pointer hover:bg-green-400 rounded-md'>delete</button>
        {showDelete &&
          <div className={`  absolute top-10 left-0  bg-blue-500 shadow-2xl rounded- h-20 w-40 flex flex-col justify-start items-center gap-2 p-1`}>
            <button onClick={deleteForMeHandler} className='text-white bg-red-500 w-full cursor-pointer hover:bg-red-400 rounded-md '
            >delete for me </button>
            {
              message.sender.username === currentUserName && !message.deleteForEveryone &&
              <button onClick={deleteForEveryOneHandler} className='text-white bg-red-500 w-full cursor-pointer hover:bg-red-400 rounded-md'
              >delete for everone </button>
            }
          </div>
        }
      </div>
    </>
  )
}

export default MoreComponent
