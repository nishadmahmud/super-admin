'use client';

import Link from 'next/link';

export default function Header({ title = 'Dashboard' }) {
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
            </div>
        </header>
    );
}
