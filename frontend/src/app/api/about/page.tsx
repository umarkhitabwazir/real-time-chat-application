import Link from 'next/link'
import React from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaMobileAlt, FaShieldAlt } from 'react-icons/fa'

const About = () => {
  return (
    <div className='bg-gray-50 min-h-screen p-8'>
      <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8'>
        <h1 className='text-4xl font-bold text-gray-800 mb-6 text-center'>
          About Our Chat Platform
        </h1>

        <section className='mb-8'>
          <p className='text-gray-600 text-lg mb-4 leading-relaxed'>
            Welcome to our modern chat solution, a secure and scalable communication platform 
            designed to enhance real-time collaboration. Built with cutting-edge technologies, 
            our application offers seamless interaction across all devices while maintaining 
            enterprise-grade security standards.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4 flex items-center'>
            <FaCode className='mr-2 text-blue-500' />
            Technical Architecture
          </h2>
          <ul className='space-y-3 text-gray-600'>
            <li className='flex items-center'>
              <FaShieldAlt className='mr-2 text-green-500' />
              JWT-authenticated REST API with rate limiting
            </li>
            <li className='flex items-center'>
              <FaMobileAlt className='mr-2 text-purple-500' />
              Responsive UI with Tailwind CSS breakpoint optimization
            </li>
            <li className='flex items-center'>
              <FaCode className='mr-2 text-red-500' />
              Type-safe implementation with Next.js and TypeScript
            </li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Core Features</h2>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-2 text-gray-700'>User Management</h3>
              <p className='text-gray-600'>Secure registration with bcrypt hashing and session management</p>
            </div>
            <div className='p-4 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-2 text-gray-700'>Real-time Communication</h3>
              <p className='text-gray-600'>WebSocket integration for instant message delivery</p>
            </div>
          </div>
        </section>

        <section className='border-t pt-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Contact Information</h2>
          <div className='grid gap-3 text-gray-600'>
            <div className='flex items-center'>
              <FaEnvelope className='mr-2 text-blue-500' />
              <Link href="mailto:umaitkhitab0308@gmail.com" className='hover:text-blue-600 transition-colors'>
                umaitkhitab0308@gmail.com
              </Link>
            </div>
            <div className='flex items-center'>
              <FaGithub className='mr-2 text-gray-700' />
              <Link 
                href='https://github.com/umarkhitabwazir' 
                className='hover:text-gray-800 transition-colors'
                target='_blank'
                rel='noopener noreferrer'
              >
                GitHub Profile
              </Link>
            </div>
            <div className='flex items-center'>
              <FaLinkedin className='mr-2 text-blue-600' />
              <Link 
                href='https://www.linkedin.com/in/umar-khitab-4136702a8/' 
                className='hover:text-blue-700 transition-colors'
                target='_blank'
                rel='noopener noreferrer'
              >
                LinkedIn Profile
              </Link>
            </div>
          </div>
        </section>

        <div className='mt-8 text-center'>
          <Link 
            href="/"
            className='inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors'
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About