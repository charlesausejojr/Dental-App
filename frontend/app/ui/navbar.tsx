'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink : React.FC<NavLinkProps> = ({ href, label },) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
        pathname === href
          ? 'bg-blue-100 text-blue-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      {label}
    </Link>
  );
};

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-slate-50 border-b border-slate-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-semibold text-slate-800">
            Dental<span className="text-blue-600">Scheduler</span>
          </Link>

          <div className="flex space-x-4 items-center">
            <NavLink href="/" label="Home" />
            {isAuthenticated ? (
              <>
                <NavLink href="/booking" label="Book" />
                <NavLink href="/dashboard" label="Appointments" />
                <NavLink href="/profile" label="Profile" />
                <button onClick={logout} className="bg-transparent">
                  <LogOut className="w-4 h-4 text-slate-600" />
                </button>
              </>
            ) : (
              <>
                <NavLink href="/login" label="Login" />
                <NavLink href="/register" label="Register" />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
