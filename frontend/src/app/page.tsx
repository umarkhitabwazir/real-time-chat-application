'use client'
import React, { useState } from 'react'
import AddUserComponent from './components/AddUser.component'


const HomePage = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <div className="max-w-md w-full text-center space-y-6">

        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-blue-500">ChatSphere</span>
        </h1>

        <h3 className="text-lg text-gray-300 font-light">
          Connect & chat with your friends in real time.
        </h3>

        <p className="text-gray-400 text-sm">
          To begin chatting, please{" "}
          <button
            onClick={() => setShowAddUser(true)}
            className="text-blue-400 hover:text-blue-300 underline transition"
          >
            select a user
          </button>.
        </p>

        <div className="flex justify-center">
          {showAddUser && (
            <div className="w-full">
              <AddUserComponent setShowAddUser={setShowAddUser} />
            </div>
          )}
        </div>

        <div className="pt-10 text-xs text-gray-500">
          Built with ❤️ by{" "}
          <a
            href="https://umarkhitab.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline cursor-pointer hover:text-blue-400"
          >
            Umar Khitab
          </a>{" "}
          — Real-time MERN Chat App
        </div>
      </div>
    </div>

  )
}

export default HomePage
