'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/booking', label: 'Book' },
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ]

  return (
    <header className="bg-slate-50 border-b border-slate-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-semibold text-slate-800">
            Dental<span className="text-blue-600">Scheduler</span>
          </Link>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}