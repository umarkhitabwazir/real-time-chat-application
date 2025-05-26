'use client'
import Link from "next/link";
import React, { useState } from "react";

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="flex items-center justify-between p-4 bg-gray-800 text-white relative">
            <div className="text-2xl font-bold">Chat App</div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex space-x-4">
                <Link  href="/" className="hover:text-gray-400">Home</Link>
                <Link href="/api/about" className="hover:text-gray-400">About</Link>
                <Link href="/api/chat" className="hover:text-gray-400">Chat</Link>
                <Link href="/api/login" className="hover:text-gray-400">Login</Link>
                <Link href="/api/register" className="hover:text-gray-400">Register</Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="bg-gray-600 px-3 py-1 rounded"
                >
                    Menu
                </button>

                {/* Mobile Dropdown Menu */}
                {showMenu && (
                    <div className="absolute right-4 top-16 w-48 bg-gray-800 text-white rounded shadow-lg z-50">
                        <ul className="p-4 space-y-2">
                            <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
                            <li><Link href="/about" className="hover:text-gray-400">About</Link></li>
                            <li><Link href="/api/chat" className="hover:text-gray-400">Chat</Link></li>
                            <li><Link href="/api/login" className="hover:text-gray-400">Login</Link></li>
                            <li><Link href="/api/register" className="hover:text-gray-400">Register</Link></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
