import React from 'react'
import ChatAppComponent from '../components/ChatApp.component'
import { User } from '../interfaces/user.interface'

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
