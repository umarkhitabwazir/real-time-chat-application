'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ProfileComponent from "./Profile.component";
import Auth from "../utils/auth";
import { User } from "../interfaces/user.interface";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Header: React.FC<User> = ({ user }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const pathName = usePathname()
    const noShowNavbarOnThisRoutes = ['/api/login', '/api/register']
    const router = useRouter();


    return (
        !noShowNavbarOnThisRoutes.includes(pathName) &&
    <>
  {/* Navbar */}
  <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
    <div onClick={()=>router.push('/')}
     className="text-2xl font-semibold hover:text-gray-500 cursor-pointer tracking-wide">Chat App</div>

    {/* Desktop Menu */}
    <nav className="hidden sm:flex items-center space-x-6">
      <Link href="/" className="hover:text-gray-400 transition">Home</Link>
      <Link href="/api/chat" className="hover:text-gray-400 transition">Chat</Link>
      <Link href="/api/about" className="hover:text-gray-400 transition">About</Link>
      <Link href="https://github.com/umarkhitabwazir/real-time-chat-application" target="_blank" className="hover:text-gray-400 transition">Source Code</Link>
      <Link href="/api/login" className="hover:text-gray-400 transition">Login</Link>
      <Link href="/api/register" className="hover:text-gray-400 transition">Register</Link>

      {user && (
        <Image
          onClick={() => setShowProfile((prev) => !prev)}
          title="Profile"
          src="/default-avatar.png"
          className="w-8 h-8 rounded-full cursor-pointer object-cover border-2 border-gray-300 hover:border-white transition"
          width={30}
          height={30}
          alt="Profile"
        />
      )}
    </nav>

    {/* Mobile Menu Button */}
    <div className="sm:hidden">
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 cursor-pointer rounded transition"
      >
        ☰ Menu
      </button>

      {/* Mobile Dropdown Menu */}
      {showMenu && (
        <div
          onMouseLeave={() => !showProfile && setShowMenu(false)}
          className="absolute top-16 right-4 w-60 bg-gray-800 text-white rounded-lg shadow-lg z-50"
        >
          <ul className="flex flex-col p-4 space-y-3 text-sm">
            <li onClick={() => router.push('/')} className="hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">Home</li>
            <li onClick={() => router.push('/api/about')} className="hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">About</li>
            <li onClick={() => router.push('/api/chat')} className="hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">Chat</li>
            <li onClick={() => router.push('/api/login')} className="hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">Login</li>
            <li onClick={() => router.push('/api/register')} className="hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">Register</li>
            <li onClick={() => router.push('https://github.com/umarkhitabwazir/real-time-chat-application')} className="hover:bg-gray-700 px-3 py-2 rounded cursor-pointer">Source Code</li>

            {user && (
              <li
                onClick={() => setShowProfile((prev) => !prev)}
                title={user?.email}

                className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                <Image
                  src="/default-avatar.png"
                  title="Profile"
                  className="w-7 h-7 rounded-full object-cover"
                  width={30}
                  height={30}
                  alt="Profile"
                />
                <span
                  className="max-w-[100px] truncate text-sm text-gray-300"
                  >{user?.email}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  </div>

  {/* Profile Dropdown */}
  {showProfile && (
    <div
      onMouseLeave={() => {
        setShowMenu(false);
        setShowProfile(false);
      }}
    >
      <ProfileComponent user={user} />
    </div>
  )}
</>

    );
};

export default Auth(Header);
