'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth(); // Access user info

  return (
    <header className="bg-slate-50 border-b border-slate-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-semibold text-slate-800">
            Dental<span className="text-blue-600">Scheduler</span>
          </Link>

          <div className="flex space-x-4 items-center">
            <Link
              href="/"
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === "/"
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/booking"
                  className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === "/booking" 
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
                >
                  Book
                </Link>
                <Link
                  href="/dashboard"
                  className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === "/dashboard" 
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
                >
                  Appointments
                </Link>
                <button onClick={logout} className="bg-transparent">
                  <LogOut className='w-4 h-4 text-slate-600'/>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === "/login" 
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === "/register" 
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
