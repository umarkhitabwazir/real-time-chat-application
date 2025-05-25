import React from 'react'
import ChatAppComponent from '@/app/components/ChatApp.component'

const chat = () => {
  return (
    <div>
      <ChatAppComponent user={{
        _id: '',
        username: '',
        email: '',
        password: '',
        avatar: '',

      }} />
    </div>
  )
}

export default chat
