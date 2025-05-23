'use client'
import React, { useState } from 'react'
import AddUserComponent from './components/AddUser.component'


const page = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold '>Welcome to home page</h1>
      <h3 className=''>chat with your friend</h3>
      <p className='text-gray-500'>
        Please{' '}
        <button
          onClick={() => setShowAddUser(true)}
          className='text-blue-600 underline cursor-pointer hover:text-blue-500 bg-transparent border-none p-0'
        >
          select
        </button>{' '}
        a user to start chatting.
      </p>

      {
        showAddUser && <AddUserComponent setShowAddUser={setShowAddUser} />
      }

    </div>
  )
}

export default page
