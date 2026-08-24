import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  MapPin,
  Scale,
  Sparkles,
  Phone,
  Flame,
  Grid,
  Laptop,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  useWishlistStore,
  useCompareStore,
  useSettingsStore,
  useLocationStore,
} from '@/stores'
import { useCartStore } from '@/stores/cartStore'
import { useStoreSettings, useScrollPosition } from '@/hooks'
import { cn } from '@/lib/utils'
import Navbar from './Navbar'
import TopUtilityBar from './TopUtilityBar'
import GlobalSearchBar from './GlobalSearchBar'
import UserMenu from './UserMenu'
import CompareModal from '@/components/common/CompareModal'

export const Header: React.FC<{ announcement?: any }> = ({ announcement }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const { isScrolled } = useScrollPosition(10)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  // Use global custom hook for store settings
  const { data: storeSettings } = useStoreSettings()

  const { item_count, subtotal, toggleOpen } = useCartStore()
  const wishlistCount = useWishlistStore((s) => s.count)
  const compareCount = useCompareStore((s) => s.items.length)
  const { formatPrice } = useSettingsStore()
  const { province } = useLocationStore()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const siteName = storeSettings?.site_name || 'Enterprise'
  const siteSubtitle = storeSettings?.site_subtitle || 'Tech Store & POS'

  return (
    <>
      <TopUtilityBar announcement={announcement} />

      <header
        className={cn(
          'sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-all duration-300',
          isScrolled && 'shadow-lg'
        )}
      >
        <div className="container-site">
          <div className="flex items-center justify-between gap-3 lg:gap-5 h-20">
            {/* Store Brand Logo & Name (Dynamically loaded from Backend) */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              {storeSettings?.site_logo && !logoError ? (
                <div className="h-11 flex items-center justify-center">
                  <img
                    src={storeSettings.site_logo}
                    alt={siteName}
                    onError={() => setLogoError(true)}
                    className="h-10 w-auto max-w-[170px] object-contain rounded-lg group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-[#2C376B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="text-white font-black text-lg font-display">
                    {siteName.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex flex-col">
                <span className="font-black text-lg sm:text-xl text-slate-900 dark:text-white font-display tracking-tight leading-none">
                  {siteName}
                </span>
                <span className="text-[10px] font-bold text-[#2C376B] dark:text-blue-400 tracking-wider uppercase mt-0.5">
                  {siteSubtitle}
                </span>
              </div>
            </Link>

            {/* Auto-detected Location Indicator (Non-clickable Status Badge) */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-left select-none"
              title="Auto-detected Delivery Location"
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium leading-none">
                  {t('nav.hello', 'Hello')}
                </span>
                <div className="flex items-center gap-1 mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate max-w-[130px]">{province || 'Phnom Penh'}</span>
                </div>
              </div>
            </div>

            {/* Center: Large Global AI Search Bar (Desktop) */}
            <GlobalSearchBar className="flex-1 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-1 lg:mx-3 hidden lg:block" />

            {/* Header Control Center Icons (Compare, Wishlist with text, Cart, Account, Theme) */}
            <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 ml-auto">
              {/* Compare Button with Count & Text */}
              <button
                onClick={() => setCompareOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none group"
                title={t('nav.compare', 'Compare')}
              >
                <div className="relative">
                  <Scale className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {compareCount}
                  </span>
                </div>
                <span className="text-xs font-bold hidden xl:inline">
                  {t('nav.compare_short', 'Compare')}
                </span>
              </button>

              {/* Wishlist Button with Count & Text */}
              <Link
                to="/account/wishlist"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none group"
                title={t('nav.wishlist', 'Wishlist')}
              >
                <div className="relative">
                  <Heart className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-rose-500 transition-colors" />
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                </div>
                <span className="text-xs font-bold hidden xl:inline">
                  {t('nav.wishlist_short', 'Wishlist')}
                </span>
              </Link>

              {/* Shopping Cart Button with Count & Text */}
              <button
                onClick={toggleOpen}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none group"
                aria-label="Open Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {item_count > 9 ? '9+' : item_count}
                  </span>
                </div>
                <div className="hidden xl:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold">
                    {t('nav.cart_short', 'Cart')}
                  </span>
                  {subtotal > 0 && (
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {formatPrice(subtotal)}
                    </span>
                  )}
                </div>
              </button>

              {/* Account Dropdown */}
              <UserMenu />

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center lg:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="lg:hidden pb-3">
            <GlobalSearchBar />
          </div>
        </div>

        {/* Sub-Header Navbar (Desktop All Categories & Nav links) */}
        <Navbar />

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 bottom-0 left-0 w-80 bg-white dark:bg-slate-900 z-50 lg:hidden shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-[#2C376B] text-white">
                  <span className="font-bold font-display text-sm">{siteName} Menu</span>
                  <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Auto-detected Delivery Location status badge */}
                  <div
                    className="w-full flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs font-bold text-slate-900 dark:text-white select-none"
                  >
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-normal">
                        {t('nav.deliver_to', 'Deliver to')}
                      </span>
                      <span>{province}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                      {t('nav.categories', 'Categories')}
                    </div>
                    {[
                      { to: '/', label: t('nav.home'), icon: Flame },
                      { to: '/products?sort=deals', label: t('nav.special_offers'), icon: Flame },
                      { to: '/products', label: t('nav.products'), icon: Grid },
                      { to: '/products?category=laptops', label: t('nav.laptops', 'Laptops & Mac'), icon: Laptop },
                      { to: '/products?category=smartphones', label: t('nav.smartphones', 'Smartphones'), icon: Sparkles },
                      { to: '/about', label: t('nav.about'), icon: Sparkles },
                      { to: '/contact', label: t('nav.contact'), icon: Phone },
                    ].map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <CompareModal isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
    </>
  )
}

export default Header
