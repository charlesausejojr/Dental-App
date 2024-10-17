import Link from 'next/link'

export default function Navbar() {
    return <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
            <Link href="/">
                <div className="text-xl font-semibold text-gray-700">Dental Scheduler</div>
            </Link>
            <div>
                <Link href="/login" className="text-gray-800 hover:text-blue-600 px-3 py-2">Login</Link>
                <Link href="/register" className="text-gray-800 hover:text-blue-600 px-3 py-2">Register</Link>
            </div>
        </div>
      </nav>
    </header>
  }
  