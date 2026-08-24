import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$', KHR: '៛', THB: '฿', VND: '₫', CNY: '¥',
  }
  const symbol = symbols[currency] ?? '$'
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(amount)
  return `${symbol}${formatted}`
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatDate(date: string | Date): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateTime(date: string | Date): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: string | Date): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const diffInSeconds = Math.floor((Date.now() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(d)
}

export function truncate(str: string, n: number): string {
  if (!str) return ''
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

export function slugify(str: string): string {
  if (!str) return ''
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function calculateDiscountPercent(price: number, comparePrice?: number): number {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

export function getImageUrl(path?: string | null): string {
  if (!path) return '/images/placeholder-product.png'

  // If already an absolute URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path.replace(/^http:\/\/enterprise-pos-api\.onrender\.com/, 'https://enterprise-pos-api.onrender.com')
  }

  // If data URI
  if (path.startsWith('data:')) return path

  // Clean path
  const clean = path.replace(/^\/?(api\/v1\/storage\/|storage\/)/, '')

  // In production, fallback to Render backend if needed, or relative for proxy
  if (import.meta.env.PROD) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://enterprise-pos-api.onrender.com/api/v1'
    const origin = apiBase.replace(/\/api\/v1\/?$/, '')
    return `${origin}/api/v1/storage/${clean}`
  }

  return `/api/v1/storage/${clean}`
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
