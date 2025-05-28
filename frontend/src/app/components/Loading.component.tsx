import React from 'react'

const LoadingComponent = () => {
  return (
 <div className="bg-gray-50 flex gap-3  items-center justify-center min-h-screen">
              {/* <h5 className='text-black font-medium text-lg'>Loading</h5> */}
              <span className="text-black  font-medium text-lg animate-ping ">L</span>
              <span className="text-black  font-medium text-lg animate-ping ">o</span>
              <span className="text-black  font-medium text-lg animate-ping 0">a</span>
              <span className="text-black  font-medium text-lg animate-ping ">d</span>
              <span className="text-black  font-medium text-lg animate-ping ">i</span>
              <span className="text-black  font-medium text-lg animate-ping ">n</span>
              <span className="text-black  font-medium text-lg animate-ping ">g</span>
              <span className="text-black  font-medium text-lg animate-ping ">.</span>
              <span className="text-black  font-medium text-lg animate-ping ">.</span>
              <span className="text-black  font-medium text-lg animate-ping ">.</span>
            </div>
  )
}

export default LoadingComponent
