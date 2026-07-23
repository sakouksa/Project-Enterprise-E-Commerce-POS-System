import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Search, User, Menu, X,
  Sun, Moon, Globe, ChevronDown, Phone, Mail,
  MapPin, LogOut, Package, Settings, ChevronRight,
  Bell, Bookmark
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore, useWishlistStore, useSettingsStore } from '@/stores'
import { debounce } from '@/lib/utils'
import api from '@/lib/api'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SearchSuggestion {
  id: number
  name: string
  slug: string
  price: number
  image?: string
}

// ─── Top Bar (Announcement + contact) ────────────────────────────────────────

const TopBar: React.FC = () => {
  const { currency, setCurrency, language, setLanguage } = useSettingsStore()

  return (
    <div className="bg-gray-900 text-gray-300 text-xs py-2 hidden md:block">
      <div className="container-site flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="tel:+855123456789" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3 h-3" />
            +855 12 345 6789
          </a>
          <a href="mailto:hello@store.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3 h-3" />
            hello@store.com
          </a>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Currency */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              {currency} <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {(['USD','KHR','THB','VND','CNY'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={cn(
                    'w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                    currency === c ? 'text-blue-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              <Globe className="w-3 h-3" />
              {language.toUpperCase()} <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {([
                { code: 'en', label: '🇺🇸 English' },
                { code: 'km', label: '🇰🇭 ខ្មែរ' },
                { code: 'th', label: '🇹🇭 ภาษาไทย' },
                { code: 'vi', label: '🇻🇳 Tiếng Việt' },
                { code: 'zh', label: '🇨🇳 中文' },
              ] as const).map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={cn(
                    'w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                    language === code ? 'text-blue-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

const SearchBar: React.FC<{ className?: string }> = ({ className }) => {
  const navigate       = useNavigate()
  const [query, setQ]  = useState('')
  const [focused, setF] = useState(false)
  const [results, setR] = useState<SearchSuggestion[]>([])
  const [loading, setL] = useState(false)
  const inputRef       = useRef<HTMLInputElement>(null)

  const search = debounce(async (q: string) => {
    if (q.length < 2) { setR([]); return }
    setL(true)
    try {
      const { data } = await api.get('/search/autocomplete', { params: { q } })
      setR(data.data ?? [])
    } catch {
      setR([])
    } finally {
      setL(false)
    }
  }, 300)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQ('')
      setF(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className={cn(
          'flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2.5 transition-all duration-200',
          focused && 'bg-white dark:bg-gray-700 shadow-glow ring-2 ring-blue-500/20'
        )}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQ(e.target.value); search(e.target.value) }}
            onFocus={() => setF(true)}
            onBlur={() => setTimeout(() => setF(false), 200)}
            placeholder="Search products, brands, categories..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none min-w-0"
          />
          {query && (
            <button type="button" onClick={() => { setQ(''); setR([]) }}>
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions */}
      <AnimatePresence>
        {focused && (results.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
          >
            {loading && (
              <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
            )}
            {results.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.slug}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                  <div className="text-xs text-blue-600">${item.price?.toFixed(2)}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
            ))}
            <Link
              to={`/search?q=${encodeURIComponent(query)}`}
              className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Search className="w-4 h-4" />
              View all results for "{query}"
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── User Menu ────────────────────────────────────────────────────────────────

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { isLoggedIn, customer, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/auth/login" className="btn-ghost text-sm hidden sm:flex">
          Sign In
        </Link>
        <Link to="/auth/register" className="btn-primary text-sm hidden sm:flex">
          Join Free
        </Link>
        <Link to="/auth/login" className="btn-icon sm:hidden">
          <User className="w-5 h-5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {customer?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <span className="text-sm font-medium hidden lg:block">
          {customer?.name?.split(' ')[0]}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 hidden lg:block" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: .96, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .96, y: 4 }}
              transition={{ duration: .15 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-40"
            >
              {/* Profile header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="font-semibold text-gray-900 dark:text-white">{customer?.name}</div>
                <div className="text-xs text-gray-500 truncate">{customer?.email}</div>
                {customer?.loyalty_points != null && (
                  <div className="mt-1 text-xs text-blue-600 font-medium">
                    🏆 {customer.loyalty_points.toFixed(0)} points
                  </div>
                )}
              </div>

              {/* Menu items */}
              {([
                { to: '/account',           icon: User,    label: 'Dashboard' },
                { to: '/account/orders',    icon: Package, label: 'My Orders' },
                { to: '/account/wishlist',  icon: Heart,   label: 'Wishlist' },
                { to: '/account/profile',   icon: Settings, label: 'Profile & Settings' },
              ]).map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                >
                  <Icon className="w-4 h-4 text-gray-400" />
                  {label}
                </Link>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Header ──────────────────────────────────────────────────────────────

const Header: React.FC = () => {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { item_count, toggleOpen }  = useCartStore()
  const wishlistCount               = useWishlistStore((s) => s.count)
  const { theme, setTheme, isDark } = useSettingsStore()
  const location                    = useLocation()

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  const navLinks = [
    { label: 'Home',       to: '/' },
    { label: 'Products',   to: '/products' },
    { label: 'Deals',      to: '/products?sort=deals' },
    { label: 'Blog',       to: '/blog' },
    { label: 'About',      to: '/about' },
    { label: 'Contact',    to: '/contact' },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300',
        scrolled && 'shadow-sm'
      )}
    >
      <div className="container-site">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white font-display hidden sm:block">
              ShopKh
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                  location.pathname === to
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <SearchBar className="flex-1 max-w-xl hidden md:block" />

          {/* Action Icons */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-icon text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="btn-icon relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={toggleOpen}
              className="btn-icon relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart className="w-5 h-5" />
              {item_count > 0 && (
                <motion.span
                  key={item_count}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {item_count > 9 ? '9+' : item_count}
                </motion.span>
              )}
            </button>

            {/* User */}
            <UserMenu />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-icon lg:hidden text-gray-600 dark:text-gray-300"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 lg:hidden overflow-hidden"
          >
            <nav className="container-site py-4 flex flex-col gap-1">
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    location.pathname === to
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
