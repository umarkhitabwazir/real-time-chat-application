import React from 'react'
import {Suspense} from 'react'
import LoginComponent from '@/app/components/Login.component'
import LoadingComponent from '@/app/components/Loading.component'

const login = () => {

  return (
    <div>
      <Suspense fallback={
       <LoadingComponent/>
      }>
      <LoginComponent/>
      </Suspense>
    </div>
  )
}

export default login
