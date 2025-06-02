import Link from 'next/link'
import React from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaMobileAlt, 
         FaShieldAlt, FaServer, FaDatabase, FaRocket, FaSyncAlt, 
         FaUserFriends, FaBell } from 'react-icons/fa'

const About = () => {
  return (
    <div className='bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen p-4 md:p-8'>
      <div className='max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-10'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 mb-4'>
            About Our Chat Platform
          </h1>
          <div className='h-1 w-32 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto rounded-full'></div>
        </div>

        <section className='mb-10'>
          <p className='text-gray-700 text-lg md:text-xl mb-6 leading-relaxed'>
            Welcome to our modern MERN stack chat solution featuring real-time messaging, enterprise-grade security, 
            and seamless cross-device synchronization. Our platform leverages cutting-edge technologies to deliver 
            a fluid communication experience.
          </p>
        </section>

        <section className='mb-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center flex justify-center items-center'>
            <FaRocket className='mr-3 text-indigo-600' />
            MERN Stack Architecture
          </h2>
          
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            {/* MongoDB */}
            <div className='bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow'>
              <div className='flex items-center mb-3'>
                <FaDatabase className='text-green-500 text-2xl mr-2' />
                <h3 className='font-bold text-gray-800'>MongoDB</h3>
              </div>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  User data storage
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  Message history
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  Optimized query performance
                </li>
              </ul>
            </div>
            
            {/* Express.js */}
            <div className='bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow'>
              <div className='flex items-center mb-3'>
                <FaServer className='text-amber-500 text-2xl mr-2' />
                <h3 className='font-bold text-gray-800'>Express.js</h3>
              </div>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  REST API endpoints
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  JWT authentication
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  Rate limiting middleware
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  Socket.IO integration
                </li>
              </ul>
            </div>
            
            {/* React */}
            <div className='bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow'>
              <div className='flex items-center mb-3'>
                <div className='bg-blue-100 p-1 rounded mr-2'>
                  <FaCode className='text-blue-600 text-xl' />
                </div>
                <h3 className='font-bold text-gray-800'>React/Next.js</h3>
              </div>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  Real-time UI updates
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  Context API for state
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  Server-side rendering
                </li>
              </ul>
            </div>
            
            {/* Node.js */}
            <div className='bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow'>
              <div className='flex items-center mb-3'>
                <div className='bg-green-100 p-1 rounded mr-2'>
                  <FaSyncAlt className='text-green-600 text-xl' />
                </div>
                <h3 className='font-bold text-gray-800'>Node.js</h3>
              </div>
              <ul className='space-y-2 text-gray-600'>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  Event-driven architecture
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  WebSocket server
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 mr-2'>•</span>
                  Asynchronous I/O operations
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className='mb-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center flex justify-center items-center'>
            <FaShieldAlt className='mr-3 text-blue-500' />
            Security Features
          </h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-blue-50 rounded-xl p-6 border border-blue-200'>
              <div className='flex items-center mb-3'>
                <div className='bg-blue-100 p-2 rounded-full mr-3'>
                  <FaShieldAlt className='text-blue-600' />
                </div>
                <h3 className='font-bold text-gray-800'>Authentication</h3>
              </div>
              <p className='text-gray-600 pl-12'>
                JWT-based authentication with refresh token rotation. Passwords hashed with bcrypt 
                (salt rounds: 12). Session management with HTTP-only cookies.
              </p>
            </div>
            
            <div className='bg-blue-50 rounded-xl p-6 border border-blue-200'>
              <div className='flex items-center mb-3'>
                <div className='bg-green-100 p-2 rounded-full mr-3'>
                  <FaServer className='text-green-600' />
                </div>
                <h3 className='font-bold text-gray-800'>API Protection</h3>
              </div>
              <p className='text-gray-600 pl-12'>
                Express middleware for rate limiting (100 requests/10min). Helmet.js for header 
                protection. CORS with whitelisted domains. Input validation with Express-Validator.
              </p>
            </div>
          </div>
        </section>

        <section className='mb-12'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center flex justify-center items-center'>
            <FaUserFriends className='mr-3 text-purple-500' />
            Core Chat Features
          </h2>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='group bg-gradient-to-b from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 transition-all'>
              <h3 className='font-bold text-gray-800 mb-3 flex items-center'>
                <span className=' w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors'>
                  <FaSyncAlt className='text-blue-600' />
                </span>
                Real-time Messaging
              </h3>
              <p className='text-gray-600 pl-11'>
                Socket.IO for instant message delivery with WebSocket fallback. Typing indicators 
                and online status updates.
              </p>
            </div>
            
            <div className='group bg-gradient-to-b from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 transition-all'>
              <h3 className='font-bold text-gray-800 mb-3 flex items-center'>
                <span className=' w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors'>
                  <FaBell className='text-purple-600' />
                </span>
                Notifications
              </h3>
              <p className='text-gray-600 pl-11'>
                Browser notifications with service workers. Mobile push notifications via Firebase 
                Cloud Messaging. Email digests for offline users.
              </p>
            </div>
            
            <div className='group bg-gradient-to-b from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-300 transition-all'>
              <h3 className='font-bold text-gray-800 mb-3 flex items-center'>
                <span className=' w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-cyan-200 transition-colors'>
                  <FaMobileAlt className='text-cyan-600' />
                </span>
                Cross-platform
              </h3>
              <p className='text-gray-600 pl-11'>
                Responsive design with Tailwind CSS. Progressive Web App (PWA) support. Dark mode 
                and accessibility features.
              </p>
            </div>
          </div>
        </section>

        <section className='border-t pt-8 border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Connect With Us</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Link href="mailto:umaitkhitab0308@gmail.com" 
                  className='flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all'>
              <div className='bg-blue-100 p-3 rounded-full mr-4'>
                <FaEnvelope className='text-blue-600 text-xl' />
              </div>
              <span className='text-gray-700 font-medium hover:text-blue-600 transition-colors'>
                umaitkhitab0308@gmail.com
              </span>
            </Link>
            
            <Link href='https://github.com/umarkhitabwazir' 
                  className='flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition-all'
                  target='_blank'
                  rel='noopener noreferrer'>
              <div className='bg-gray-200 p-3 rounded-full mr-4'>
                <FaGithub className='text-gray-800 text-xl' />
              </div>
              <span className='text-gray-700 font-medium hover:text-gray-900 transition-colors'>
                GitHub Profile
              </span>
            </Link>
            
            <Link href='https://www.linkedin.com/in/umar-khitab-4136702a8/' 
                  className='flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all'
                  target='_blank'
                  rel='noopener noreferrer'>
              <div className='bg-blue-200 p-3 rounded-full mr-4'>
                <FaLinkedin className='text-blue-700 text-xl' />
              </div>
              <span className='text-gray-700 font-medium hover:text-blue-700 transition-colors'>
                LinkedIn Profile
              </span>
            </Link>
          </div>
        </section>

        <div className='mt-12 text-center'>
          <Link 
            href="/"
            className='inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          >
            Back to Chat Interface
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About