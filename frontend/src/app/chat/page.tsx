import React from 'react'
import ChatAppComponent from '../components/ChatApp.component'
import { User } from '../interfaces/user.interface'

const chat = ({user}:{user:User}) => {
  return (
    <div>
      <ChatAppComponent user={user}/>
    </div>
  )
}

export default chat
