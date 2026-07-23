import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ShieldCheck, ShoppingBag } from 'lucide-react'

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-gray-950 font-sans antialiased">
      {/* Auth Header */}
      <header className="py-6 px-4">
        <div className="container-site flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white font-display">ShopKh</span>
          </Link>
          <Link to="/" className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            Back to Store
          </Link>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Protected by Enterprise 256-bit SSL Encryption</span>
        </div>
        <p>© {new Date().getFullYear()} ShopKh Enterprise Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default AuthLayout
