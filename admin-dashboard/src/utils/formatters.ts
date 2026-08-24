/**
 * Shared utility functions for formatting dates, currency, numbers, percentages, and JSON.
 */

export interface FormatCurrencyOptions {
  currency?: string
  decimals?: number
  compact?: boolean
  locale?: string
  fallback?: string
}

export interface FormatNumberOptions {
  decimals?: number
  locale?: string
  fallback?: string
}

export interface FormatDateOptions {
  locale?: string
  includeTime?: boolean
  fallback?: string
}

/**
 * Formats numeric or string amounts into standardized currency strings.
 * Supports USD ($), KHR (៛), custom decimals, compact chart notation ($1.2k), and locale.
 */
export const formatCurrency = (
  val?: number | string | null,
  optionsOrCurr?: FormatCurrencyOptions | string
): string => {
  const defaultFallback = '$0.00'
  if (val === null || val === undefined || val === '') {
    return (typeof optionsOrCurr === 'object' && optionsOrCurr.fallback) ? optionsOrCurr.fallback : defaultFallback
  }

  const num = typeof val === 'number' ? val : parseFloat(String(val)) || 0
  if (isNaN(num)) {
    return (typeof optionsOrCurr === 'object' && optionsOrCurr.fallback) ? optionsOrCurr.fallback : defaultFallback
  }

  let curr = 'USD'
  let decimals = 2
  let compact = false
  let locale = 'en-US'

  if (typeof optionsOrCurr === 'string') {
    curr = optionsOrCurr
    if (curr === 'KHR') decimals = 0
  } else if (optionsOrCurr && typeof optionsOrCurr === 'object') {
    if (optionsOrCurr.currency) curr = optionsOrCurr.currency
    if (optionsOrCurr.compact) compact = optionsOrCurr.compact
    if (optionsOrCurr.locale) locale = optionsOrCurr.locale
    if (optionsOrCurr.decimals !== undefined) {
      decimals = optionsOrCurr.decimals
    } else if (curr === 'KHR') {
      decimals = 0
    }
  }

  // Compact notation (e.g. for chart axes: $1.2k, $3.5M)
  if (compact) {
    const abs = Math.abs(num)
    const sign = num < 0 ? '-' : ''
    const prefix = curr === 'KHR' ? '៛' : '$'
    if (abs >= 1_000_000) {
      return `${sign}${prefix}${(abs / 1_000_000).toFixed(1)}M`
    }
    if (abs >= 1_000) {
      return `${sign}${prefix}${(abs / 1_000).toFixed(1)}k`
    }
    return `${sign}${prefix}${abs.toFixed(decimals)}`
  }

  if (curr === 'KHR') {
    const formatted = Math.round(num).toLocaleString(locale === 'km-KH' ? 'km-KH' : 'en-US')
    return `៛${formatted}`
  }

  return `$${num.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/**
 * Formats a number with standard thousand separators.
 */
export const formatNumber = (
  val?: number | string | null,
  options?: FormatNumberOptions
): string => {
  const fallback = options?.fallback ?? '0'
  if (val === null || val === undefined || val === '') return fallback
  const num = typeof val === 'number' ? val : parseFloat(String(val)) || 0
  if (isNaN(num)) return fallback

  const locale = options?.locale ?? 'en-US'

  if (options?.decimals !== undefined) {
    return num.toLocaleString(locale, {
      minimumFractionDigits: options.decimals,
      maximumFractionDigits: options.decimals,
    })
  }
  return num.toLocaleString(locale)
}

/**
 * Formats compact numbers (e.g. 1.2k, 2.4M).
 */
export const formatCompactNumber = (val?: number | string | null): string => {
  if (val === null || val === undefined || val === '') return '0'
  const num = typeof val === 'number' ? val : parseFloat(String(val)) || 0
  if (isNaN(num)) return '0'

  const abs = Math.abs(num)
  const sign = num < 0 ? '-' : ''
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1)}M`
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(1)}k`
  }
  return `${sign}${abs}`
}

/**
 * Formats a percentage value (e.g., 84.5%).
 */
export const formatPercent = (val?: number | string | null, decimals: number = 1): string => {
  if (val === null || val === undefined || val === '') return '0%'
  const num = typeof val === 'number' ? val : parseFloat(String(val)) || 0
  if (isNaN(num)) return '0%'
  return `${num.toFixed(decimals)}%`
}

/**
 * Formats a date or string into ISO short date format (YYYY-MM-DD).
 */
export const formatShortDate = (
  dateStr?: string | Date | null,
  options?: FormatDateOptions
): string => {
  const fallback = options?.fallback ?? '—'
  if (!dateStr) return fallback
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  if (isNaN(date.getTime())) return fallback
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Formats a date or string into short date-time format (YYYY-MM-DD HH:mm).
 */
export const formatShortDateTime = (
  dateStr?: string | Date | null,
  options?: FormatDateOptions
): string => {
  const fallback = options?.fallback ?? '—'
  if (!dateStr) return fallback
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  if (isNaN(date.getTime())) return fallback
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

/**
 * Formats a date for display (e.g. Sep 15, 2026 or Sep 15, 2026, 02:30 PM).
 */
export const formatDisplayDate = (
  d?: string | Date | null,
  options?: FormatDateOptions
): string => {
  const fallback = options?.fallback ?? '—'
  if (!d) return fallback
  const date = typeof d === 'string' ? new Date(d) : d
  if (isNaN(date.getTime())) return fallback

  const locale = options?.locale || 'en-US'
  const dateOpts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(options?.includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }

  return date.toLocaleDateString(locale, dateOpts)
}

/**
 * Formats a date into HTML input `datetime-local` format (YYYY-MM-DDTHH:mm).
 */
export const formatDateTimeLocal = (dateStr?: string | Date | null): string => {
  if (!dateStr) return ''
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    if (isNaN(d.getTime())) {
      if (typeof dateStr === 'string') {
        const clean = dateStr.replace(' ', 'T')
        return clean.length >= 16 ? clean.slice(0, 16) : clean
      }
      return ''
    }
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ''
  }
}

/**
 * Formats JSON or object values to display strings.
 */
export const formatJsonValue = (val: any): string => {
  if (val === null || val === undefined) return ''
  if (typeof val === 'string') return val
  try {
    return JSON.stringify(val)
  } catch {
    return String(val)
  }
}
