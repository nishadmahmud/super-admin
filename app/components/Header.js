'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getToken, getUser, logout } from '../lib/api';

export default function Header({ title = 'Dashboard' }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = getToken();
        const userData = getUser();
        setIsLoggedIn(!!token);
        setUser(userData);
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left: Title */}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

            {/* Center: Search */}
            <div className="flex-1 max-w-xl mx-8">
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#673DE6]/20 focus:border-[#673DE6] transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                        Ctrl K
                    </span>
                </div>
            </div>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-3">
                {isLoggedIn ? (
                    <>
                        {/* User Info */}
                        <div className="flex items-center gap-2 mr-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.owner_name?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden md:block">
                                {user?.owner_name || 'Admin'}
                            </span>
                        </div>
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#673DE6] transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 bg-[#673DE6] text-white rounded-lg text-sm font-medium hover:bg-[#5a35cc] transition-colors"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
