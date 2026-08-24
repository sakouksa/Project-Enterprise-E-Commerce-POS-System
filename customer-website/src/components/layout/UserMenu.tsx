import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Heart,
  LogOut,
  Package,
  Settings,
  User,
  Scale,
  ShieldCheck,
  MapPin,
  HelpCircle,
  Phone,
  Sparkles,
  Award,
  ChevronRight,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore, useWishlistStore, useCompareStore } from '@/stores'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'

export const UserMenu: React.FC = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { isLoggedIn, customer, logout } = useAuthStore()
  const wishlistCount = useWishlistStore((s) => s.count)
  const compareCount = useCompareStore((s) => s.items.length)
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)

  // Global click outside hook to close dropdown
  useClickOutside(menuRef, () => setOpen(false))

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* ── Trigger Button ─────────────────────────────────────────────── */}
      {!isLoggedIn ? (
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex flex-col text-left px-2.5 py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group select-none',
            open && 'bg-slate-100 dark:bg-slate-800'
          )}
          aria-expanded={open}
          aria-label="Account & Lists Menu"
        >
          <span className="text-[10px] text-slate-400 font-medium leading-none">
            {t('nav.hello_signin', 'Hello, Sign In')}
          </span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-0.5 leading-tight mt-0.5">
            <span>{t('nav.account_and_lists', 'Account & Lists')}</span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                open && 'rotate-180 text-blue-600'
              )}
            />
          </span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer group select-none',
            open && 'bg-slate-100 dark:bg-slate-800'
          )}
          aria-expanded={open}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2C376B] to-blue-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            {customer?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium leading-none">
              Hello, {customer?.name?.split(' ')[0]}
            </span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-0.5 leading-tight mt-0.5">
              <span>{t('nav.account', 'My Account')}</span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                  open && 'rotate-180 text-blue-600'
                )}
              />
            </span>
          </div>
        </button>
      )}

      {/* ── Dropdown Popup ────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-50 select-none divide-y divide-slate-100 dark:divide-slate-800',
              !isLoggedIn ? 'w-[380px] sm:w-[420px]' : 'w-72 sm:w-80'
            )}
          >
            {/* ── 1. GUEST STATE POPUP ──────────────────────────────────── */}
            {!isLoggedIn ? (
              <div>
                {/* Hero Sign In CTA Box */}
                <div className="p-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900 text-center space-y-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-[#2C376B] to-blue-600 hover:from-[#202952] hover:to-blue-700 text-white text-xs font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-98"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t('nav.login', 'Sign In')}</span>
                  </Link>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 pt-0.5">
                    <span>{t('nav.new_customer', 'New customer?')}</span>
                    <Link
                      to="/auth/register"
                      onClick={() => setOpen(false)}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>{t('nav.start_here', 'Start here.')}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Two Column Navigation Grid (Amazon / Best Buy / PTC style) */}
                <div className="p-4 grid grid-cols-2 gap-4 divide-x divide-slate-100 dark:divide-slate-800">
                  {/* Left Column: Your Lists & Shopping */}
                  <div className="space-y-1 pr-2">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('nav.your_lists', 'Your Lists')}</span>
                    </div>

                    <Link
                      to="/account/wishlist"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate">{t('nav.wishlist', 'Wishlist')}</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="text-[10px] bg-rose-500 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/products?sort=compare"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Scale className="w-3.5 h-3.5 text-purple-500" />
                        <span className="truncate">{t('nav.compare', 'Compare')}</span>
                      </div>
                      {compareCount > 0 && (
                        <span className="text-[10px] bg-purple-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                          {compareCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/track-order"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      <Package className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{t('nav.track_order', 'Track Order')}</span>
                    </Link>

                    <Link
                      to="/warranty"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{t('nav.warranty_check', 'Warranty Check')}</span>
                    </Link>
                  </div>

                  {/* Right Column: Your Account */}
                  <div className="space-y-1 pl-4">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span>{t('nav.your_account', 'Your Account')}</span>
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{t('nav.account', 'Your Account')}</span>
                    </Link>

                    <Link
                      to="/account/orders"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{t('nav.my_orders', 'My Orders')}</span>
                    </Link>

                    <Link
                      to="/account/addresses"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{t('nav.addresses', 'Addresses')}</span>
                    </Link>

                    <Link
                      to="/faq"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{t('nav.help_center', 'Help & FAQs')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* ── 2. LOGGED IN CUSTOMER POPUP (Like Admin Dashboard Profile Card) ── */
              <div>
                {/* Profile Card Header */}
                <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/80 dark:to-slate-850">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2C376B] to-blue-600 flex items-center justify-center text-white text-base font-black flex-shrink-0 shadow-md">
                      {customer?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {customer?.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{customer?.email}</div>
                    </div>
                  </div>

                  {/* Tier Badge & Loyalty Points */}
                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-black">
                      <Award className="w-3 h-3" />
                      <span>{t('nav.vip_member', 'VIP Member')}</span>
                    </div>

                    {customer?.loyalty_points != null && (
                      <div className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                        🏆 {customer.loyalty_points.toFixed(0)} {t('nav.points_unit', 'points')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Navigation Links */}
                <div className="p-2 space-y-0.5">
                  {[
                    { to: '/account', icon: User, label: t('nav.account', 'My Profile') },
                    { to: '/account/orders', icon: Package, label: t('nav.my_orders', 'My Orders') },
                    { to: '/account/wishlist', icon: Heart, label: t('nav.wishlist', 'Wishlist') },
                    { to: '/account/addresses', icon: MapPin, label: t('nav.addresses', 'Addresses') },
                    { to: '/account/profile', icon: Settings, label: t('nav.profile_settings', 'Settings') },
                  ].map(({ to, icon: Icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-700 dark:text-slate-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        <span>{label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>

                {/* Logout Action */}
                <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold text-red-600 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav.logout', 'Sign Out')}</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserMenu
