'use client'
import React, { useState } from 'react'
import { Message } from '../interfaces/message.interface'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'



const MoreComponent = ({ currentUserName, message, fetchMessages }: { currentUserName: string | null, message: Message, fetchMessages: () => Promise<void> }) => {
  const [showDelete, setShowDelete] = useState(false)
  const [showComponent, setShowComponent] = useState(true)
  const [loading, setLoading] = useState('')
  const API = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const deleteForEveryOneHandler = async () => {
    setLoading('everyone')
    try {
      await axios.patch(`${API}/deleteForEveryOne/${message._id}`, {}, { withCredentials: true })
      await fetchMessages()
      setShowDelete(false)
      setShowComponent(false)
      setLoading('')





    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.error === "Unauthorized") {
          setShowDelete(true)
setLoading('')

          router.push(`/api/login?redirectTo=${encodeURIComponent(window.location.href)}`)

        }

      }
    }
  }

  const deleteForMeHandler = async () => {
    setLoading('forMe')
    try {
      await axios.patch(`${API}/deleteForMe/${message._id}`, {}, { withCredentials: true })
      await fetchMessages()
      setShowComponent(false)
      document.onmouseover = null
      setShowDelete(false)
      setLoading('')

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.error === "Unauthorized") {
          setShowDelete(false)
          setLoading('')


          router.push(`/api/login?redirectTo=${encodeURIComponent(window.location.href)}`)
        }
      }
    }
  }
  return (
    <>{showComponent&&
    
 <div className="z-70 fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
  <div className="bg-white rounded-xl shadow-2xl max-w-xs w-full p-6 relative space-y-4">
    {/* Title */}
    <h2 className="text-lg font-semibold text-gray-800">Message Options</h2>
    <p className="text-gray-400 text-sm line-through">
      {!message.deleteForEveryone && !message.deleteForMe && message.content}
    </p>

    <button
      onClick={() => setShowDelete((prev) => !prev)}
      className="w-full py-2 bg-green-600 text-white cursor-pointer rounded-md hover:bg-green-500 transition"
    >
      Delete
    </button>

    {showDelete && (
      <div className="space-y-2">
        <button
          onClick={deleteForMeHandler}
          className="w-full py-2 bg-red-500 text-white cursor-pointer rounded-md hover:bg-red-400 transition"
        >
          {loading === "forMe" ? "Loading..." : "Delete for Me"}
        </button>

        {message.sender.username === currentUserName && !message.deleteForEveryone && (
          <button
            onClick={deleteForEveryOneHandler}
            className="w-full py-2 bg-red-500 cursor-pointer text-white rounded-md hover:bg-red-400 transition"
          >
            {loading === "everyone" ? "Loading..." : "Delete for Everyone"}
          </button>
        )}
      </div>
    )}

    <button
      onClick={() => {
        setShowComponent(false);
        setShowDelete(false);
      }}
      className="absolute cursor-pointer top-2 right-2 text-xl text-gray-500 hover:text-red-600"
    >
      &times;
    </button>
  </div>
</div>

    }    

    </>
  )
}

export default MoreComponent
