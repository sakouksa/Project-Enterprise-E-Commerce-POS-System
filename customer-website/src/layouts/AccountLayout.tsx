import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  User, Package, Heart, MapPin, Star, Settings,
  LogOut, ChevronRight, ShieldCheck, CreditCard
} from 'lucide-react'
import { useAuthStore } from '@/stores'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/account',           icon: User,       label: 'Dashboard', exact: true },
  { to: '/account/orders',    icon: Package,    label: 'My Orders' },
  { to: '/account/wishlist',  icon: Heart,      label: 'Wishlist' },
  { to: '/account/addresses', icon: MapPin,     label: 'Addresses' },
  { to: '/account/reviews',   icon: Star,       label: 'My Reviews' },
  { to: '/account/profile',   icon: Settings,   label: 'Profile & Security' },
]

const AccountLayout: React.FC = () => {
  const { customer, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-1 py-8">
        <div className="container-site">
          {/* Account Header Banner */}
          <div className="card p-6 mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-bold border border-white/30">
                {customer?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-white">{customer?.name}</h1>
                <p className="text-sm text-blue-100 mt-0.5">{customer?.email}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-medium text-blue-200">
                  <span>Group: {customer?.group || 'Regular'}</span>
                  <span>•</span>
                  <span>Reward Points: {customer?.loyalty_points?.toFixed(0) ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/products" className="btn bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 backdrop-blur-sm">
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-2">
              <div className="card p-2 space-y-1">
                {navItems.map(({ to, icon: Icon, label, exact }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={exact}
                    className={({ isActive }) => cn(
                      'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </NavLink>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors card"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Account Content Area */}
            <div className="lg:col-span-3">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AccountLayout
