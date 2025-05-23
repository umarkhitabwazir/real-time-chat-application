'use client'
import axios from 'axios'
import React, { useEffect } from 'react'

const MessageComponent = () => {

  const API = process.env.NEXT_PUBLIC_API_URL

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const username = formData.get('username')
    const message = formData.get('message')
  
      try {
        const response = await axios.post(`${API}/send-message`, { receiverUsername:username, message: message },{withCredentials: true})
        console.log(response)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
  }



  return (
    <div className='text-white'>
     <form action="" onSubmit={sendMessage}>
      <div className="mb-6">
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">Username</label>
        <input type="text" name="username" className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter username" required />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">Message</label>
        <textarea name="message" rows={4} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter message"></textarea>
      </div>
      <button type="submit"
       className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
       >Send Message
       </button>
     </form>
    </div>
  )
}

export default MessageComponent
