'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser } from '../lib/api';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Subscriptions',
    href: '/subscriptions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    name: 'Support',
    href: '/support',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#1a1625] flex flex-col z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#673DE6] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SA</span>
          </div>
          <span className="text-white font-semibold text-lg">SuperAdmin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-[#673DE6] text-white'
                      : 'text-[#a0a0b0] hover:bg-[#2a2535] hover:text-white'
                    }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-white/10">
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2a2535] transition-colors">
          {user?.profile_pic ? (
            <img
              src={user.profile_pic}
              alt={user.owner_name || 'User'}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#673DE6]"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.owner_name?.charAt(0) || 'A'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.owner_name || 'Admin User'}
            </p>
            <p className="text-[#a0a0b0] text-xs truncate">
              {user?.outlet_name || user?.email || 'admin@saas.com'}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
