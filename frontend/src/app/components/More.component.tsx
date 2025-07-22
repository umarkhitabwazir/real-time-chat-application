'use client'
import React, { useState } from 'react'
import { Message } from '../interfaces/message.interface'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'



const MoreComponent = ({ currentUserName, message, fetchMessages }: { currentUserName: string | null, message: Message, fetchMessages: () => Promise<void> }) => {
  const [showDelete, setShowDelete] = useState(false)
  const [showComponent, setShowComponent] = useState(true)
  const API = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const deleteForEveryOneHandler = async () => {
    try {
      await axios.patch(`${API}/deleteForEveryOne/${message._id}`, {}, { withCredentials: true })
      await fetchMessages()
      setShowDelete(false)
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
      setShowComponent(false)
      document.onmouseover = null
      setShowDelete(false)

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.error === "Unauthorized") {
          setShowDelete(false)


          router.push(`/api/login?redirectTo=${encodeURIComponent(window.location.href)}`)
        }
      }
    }
  }
  return (
    <>{showComponent&&
    
     <div
    className="fixed inset-0 z-50  bg-opacity-100 flex items-center justify-center px-4"
  
  >
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs p-6 relative space-y-4">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800">Message Options</h2>

      {/* Delete Main Button */}
      <button
        onClick={() => setShowDelete((prev) => !prev)}
        className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
      >
        Delete
      </button>

      {/* Conditional Sub Options */}
      {showDelete && (
        <div className="space-y-2">
          <button
            onClick={deleteForMeHandler}
            className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition"
          >
            Delete for Me
          </button>

          {message.sender.username === currentUserName && !message.deleteForEveryone && (
            <button
              onClick={deleteForEveryOneHandler}
              className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition"
            >
              Delete for Everyone
            </button>
          )}
        </div>
      )}

      {/* Close Button (Optional for UX) */}
      <button
        onClick={() => {
          setShowComponent(false);
          setShowDelete(false);
        }}
        className="absolute top-2 right-2 text-xl text-gray-500 cursor-pointer  hover:text-red-600"
        aria-label="Close"
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
