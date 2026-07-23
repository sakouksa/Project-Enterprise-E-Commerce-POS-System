import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Auth Store ──────────────────────────────────────────────────────────────

export interface CustomerUser {
  id: number
  name: string
  email: string
  phone?: string
  photo?: string
  loyalty_points: number
  total_spent: number
  order_count: number
  group?: string
  addresses?: unknown[]
}

interface AuthState {
  token: string | null
  user: { id: number; name: string; email: string } | null
  customer: CustomerUser | null
  isLoggedIn: boolean

  login: (token: string, user: AuthState['user'], customer: CustomerUser) => void
  logout: () => void
  updateCustomer: (data: Partial<CustomerUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token:      null,
      user:       null,
      customer:   null,
      isLoggedIn: false,

      login: (token, user, customer) => {
        localStorage.setItem('customer_token', token)
        set({ token, user, customer, isLoggedIn: true })
      },

      logout: () => {
        localStorage.removeItem('customer_token')
        set({ token: null, user: null, customer: null, isLoggedIn: false })
      },

      updateCustomer: (data) =>
        set((s) => ({ customer: s.customer ? { ...s.customer, ...data } : null })),
    }),
    {
      name: 'customer_auth',
      partialize: (s) => ({ token: s.token, user: s.user, customer: s.customer, isLoggedIn: s.isLoggedIn }),
    }
  )
)

// ─── Wishlist Store ──────────────────────────────────────────────────────────

interface WishlistState {
  items: number[]  // product IDs
  count: number
  setItems: (ids: number[]) => void
  addItem:  (id: number) => void
  removeItem: (id: number) => void
  has: (id: number) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,

      setItems: (ids) => set({ items: ids, count: ids.length }),

      addItem: (id) =>
        set((s) => {
          if (s.items.includes(id)) return s
          const items = [...s.items, id]
          return { items, count: items.length }
        }),

      removeItem: (id) =>
        set((s) => {
          const items = s.items.filter((i) => i !== id)
          return { items, count: items.length }
        }),

      has: (id) => get().items.includes(id),
    }),
    {
      name: 'customer_wishlist',
    }
  )
)

// ─── Settings Store (currency, language, theme) ──────────────────────────────

export type CurrencyCode = 'USD' | 'KHR' | 'THB' | 'VND' | 'CNY'
export type LanguageCode = 'en' | 'km' | 'th' | 'vi' | 'zh'
export type ThemeMode   = 'light' | 'dark' | 'system'

interface SettingsState {
  currency:    CurrencyCode
  language:    LanguageCode
  theme:       ThemeMode
  isDark:      boolean
  exchangeRates: Record<string, number>

  setCurrency:     (currency: CurrencyCode) => void
  setLanguage:     (language: LanguageCode) => void
  setTheme:        (theme: ThemeMode) => void
  setExchangeRates: (rates: Record<string, number>) => void
  convertPrice:    (usdAmount: number) => number
  formatPrice:     (amount: number, showCurrency?: boolean) => string
}

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  KHR: '៛',
  THB: '฿',
  VND: '₫',
  CNY: '¥',
}

const DEFAULT_RATES: Record<string, number> = {
  USD: 1,
  KHR: 4100,
  THB: 35,
  VND: 25000,
  CNY: 7.2,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      currency:      'USD',
      language:      'en',
      theme:         'light',
      isDark:        false,
      exchangeRates: DEFAULT_RATES,

      setCurrency: (currency) => {
        localStorage.setItem('currency', currency)
        set({ currency })
      },

      setLanguage: (language) => {
        localStorage.setItem('language', language)
        set({ language })
      },

      setTheme: (theme) => {
        const isDark =
          theme === 'dark' ||
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

        document.documentElement.classList.toggle('dark', isDark)
        set({ theme, isDark })
      },

      setExchangeRates: (rates) => set({ exchangeRates: rates }),

      convertPrice: (usdAmount) => {
        const { currency, exchangeRates } = get()
        const rate = exchangeRates[currency] ?? DEFAULT_RATES[currency] ?? 1
        return usdAmount * rate
      },

      formatPrice: (amount, showCurrency = true) => {
        const { currency } = get()
        const symbol = CURRENCY_SYMBOLS[currency] ?? '$'

        const formatted = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: currency === 'USD' ? 2 : 0,
          maximumFractionDigits: currency === 'USD' ? 2 : 0,
        }).format(amount)

        return showCurrency ? `${symbol}${formatted}` : formatted
      },
    }),
    {
      name: 'customer_settings',
      partialize: (s) => ({ currency: s.currency, language: s.language, theme: s.theme }),
    }
  )
)

// ─── Compare Store ───────────────────────────────────────────────────────────

interface CompareState {
  items: number[]  // product IDs (max 4)
  addItem: (id: number) => boolean
  removeItem: (id: number) => void
  has: (id: number) => boolean
  clear: () => void
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (id) => {
        const { items } = get()
        if (items.includes(id)) return false
        if (items.length >= 4) return false
        set({ items: [...items, id] })
        return true
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i !== id) })),

      has: (id) => get().items.includes(id),
      clear: ()  => set({ items: [] }),
    }),
    { name: 'customer_compare' }
  )
)
