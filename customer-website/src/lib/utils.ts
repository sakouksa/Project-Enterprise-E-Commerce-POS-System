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

export function formatDate(date: string | Date, format = 'MMM d, yyyy'): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function calculateDiscountPercent(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

export function getImageUrl(path?: string | null): string {
  if (!path) return '/images/placeholder-product.png'

  // Convert absolute API storage URLs → relative path served via Vite proxy
  // e.g. http://localhost:8001/api/v1/storage/products/x.webp → /api/v1/storage/products/x.webp
  const storagePatterns = [
    /^https?:\/\/[^/]+\/(api\/v1\/storage\/)/,  // http://host/api/v1/storage/...
    /^https?:\/\/[^/]+\/storage\//,              // http://host/storage/...
  ]
  for (const pattern of storagePatterns) {
    const m = path.match(pattern)
    if (m) {
      // Extract everything after the host, keep the path relative
      const relativePath = path.replace(/^https?:\/\/[^/]+/, '')
      return relativePath
    }
  }

  // If it's a full external URL (not our own server), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  // Relative path: return as-is
  return path
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
