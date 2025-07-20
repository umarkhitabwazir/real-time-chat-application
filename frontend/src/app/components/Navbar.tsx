'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ProfileComponent from "./Profile.component";
import Auth from "../utils/auth";
import { User } from "../interfaces/user.interface";
import { usePathname } from "next/navigation";

const Header: React.FC<User> = ({ user }) => {
    console.log('user in header', user)
    const [showMenu, setShowMenu] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const pathName = usePathname()
    const noShowNavbarOnThisRoutes = ['/api/login', '/api/register']
    console.log('params', pathName)


    return (
        !noShowNavbarOnThisRoutes.includes(pathName) &&
        <>
            <div className="flex items-center justify-between p-4 bg-gray-800 text-white relative">
                <div className="text-2xl font-bold">Chat App</div>

                {/* Desktop Menu */}
                <div aria-disabled className="hidden sm:flex select-none space-x-4">
                    <Link href="/" className="hover:text-gray-400" >Home</Link>
                    <Link href="/api/chat" className="hover:text-gray-400" >Chat</Link>
                    <Link href="/api/about" className="hover:text-gray-400" >About</Link>
                    <Link href="https://github.com/umarkhitabwazir/real-time-chat-application" className="hover:text-gray-400" >source code</Link>
                    <Link href="/api/login" className="hover:text-gray-400" >Login</Link>
                    <Link href="/api/register" className="hover:text-gray-400">Register</Link>
                    <Image
                        onClick={() => setShowProfile((prev) => !prev)}
                        title="profile" src="/default-avatar.png"
                        className={`${!user && 'hidden'} cursor-pointer rounded-full bg-cover object-cover `} width={30} height={30} alt="profile" />
                </div>

                {/* Mobile Menu Button */}
                <div aria-disabled className="select-none sm:hidden">
                    <button
                        onClick={() => setShowMenu((prev) => !prev)}
                        className="bg-gray-600 px-3 py-1 cursor-pointer hover:bg-gray-500 hover:px-5 rounded"
                    >
                        Menu
                    </button>

                    {/* Mobile Dropdown Menu */}
                    {showMenu && (
                        <div
                        aria-disabled
                            onMouseLeave={() => {
                                if (!showProfile) {
                                    setShowMenu(false);
                                }
                            }}
                            className="absolute select-none right-4 top-16 w-70 bg-gray-800 text-white rounded-b-md shadow-lg z-50"
                            >
                            <ul className="p-4 space-y-2">
                                <li className="hover:bg-white hover:text-black  cursor-pointer">
                                    <Link href="/" >Home</Link>
                                </li>
                                <li className="hover:bg-white hover:text-black  cursor-pointer">
                                    <Link href="/api/about" >About</Link>
                                </li>
                                <li className="hover:bg-white hover:text-black  cursor-pointer">
                                    <Link href="/api/chat" >Chat</Link>
                                </li>
                                <li className="hover:bg-white hover:text-black  cursor-pointer">
                                    <Link href="/api/login" >Login</Link>
                                </li>
                                <li className="hover:bg-white hover:text-black  cursor-pointer">
                                    <Link href="/api/register" >Register</Link>
                                </li>
                                <li className="hover:bg-white hover:text-black  cursor-pointer">
                                    <Link href="https://github.com/umarkhitabwazir/real-time-chat-application" className="hover:text-gray-400" >source code</Link>
                                </li>
                                {
                                    user &&
                                <li
                                    onClick={() => setShowProfile((prev) => !prev)}
                                    className="flex items-center space-x-2  cursor-pointer hover:bg-white hover:text-black">

                                    <Image
                                        title="profile" src="/default-avatar.png" className="rounded-full cursor-pointer bg-cover object-cover  "
                                        width={30} height={30} alt="profile"
                                    />
                                    <span className=" ">{user?.email}</span>
                                </li>
                                }


                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {
                showProfile &&
                <div onMouseLeave={() => {
                    setShowMenu(false);
                    setShowProfile(false);
                }}>

                    <ProfileComponent user={user} />
                </div>

            }
        </>
    );
};

export default Auth(Header);
