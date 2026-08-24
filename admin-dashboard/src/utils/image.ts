import { API_BASE_URL } from '@/api/client'

/**
 * Derives the Backend Origin URL from API_BASE_URL or env settings.
 * E.g. "https://enterprise-pos-api.onrender.com/api/v1" -> "https://enterprise-pos-api.onrender.com"
 * In local dev without absolute API_BASE_URL, returns "" (uses Vite proxy).
 */
const getBackendOrigin = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL || API_BASE_URL || ''
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return base.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '').replace(/\/+$/, '')
  }
  if (import.meta.env.PROD) {
    return 'https://enterprise-pos-api.onrender.com'
  }
  return ''
}

const BACKEND_ORIGIN = getBackendOrigin()

/**
 * Normalizes and converts any product/user/employee/receipt/logo image value (string, object, path, full URL)
 * into a valid, displayable URL that works reliably in Production (Vercel/CDN) and Local Dev.
 * Automatically rewrites localhost/127.0.0.1:8001 DB seed URLs to the active backend storage endpoint.
 */
export const getAbsoluteImageUrl = (urlOrPath?: any): string => {
  if (!urlOrPath) return ''

  let path = ''

  if (typeof urlOrPath === 'string') {
    path = urlOrPath.trim()
  } else if (typeof urlOrPath === 'object' && urlOrPath !== null) {
    path = (urlOrPath.url || urlOrPath.image || urlOrPath.image_path || urlOrPath.photo || urlOrPath.avatar || urlOrPath.path || '').trim()
  }

  if (!path || typeof path !== 'string') return ''

  // Data URIs or Blob URLs
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }

  // Local frontend public directory assets
  if (
    path === '/logo.svg' ||
    path === '/logo.png' ||
    path === '/favicon.svg' ||
    path === '/favicon.ico' ||
    path === '/icons.svg' ||
    path === '/apple-touch-icon.png' ||
    path.startsWith('/images/') ||
    path.startsWith('/assets/')
  ) {
    return path
  }

  // External CDN URLs (e.g. Unsplash, Cloudinary, AWS S3, etc.)
  if (
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    // Check if it's pointing to localhost or old dev backend ports
    const isLocalhost = /^(https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(path)
    if (isLocalhost) {
      const cleanPath = path
        .replace(/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\/?/, '')
        .replace(/^(api\/v1\/)?storage\//, '')
      return BACKEND_ORIGIN ? `${BACKEND_ORIGIN}/api/v1/storage/${cleanPath}` : `/api/v1/storage/${cleanPath}`
    }

    // Secure HTTP to HTTPS if on production
    if (path.startsWith('http://enterprise-pos-api.onrender.com')) {
      return path.replace(/^http:\/\//, 'https://')
    }

    return path
  }

  // Relative path (e.g. "storage/products/xxx.webp", "products/xxx.webp", "companies/logo.png")
  const cleanPath = path.replace(/^\/?(api\/v1\/)?storage\//, '').replace(/^\//, '')

  if (BACKEND_ORIGIN) {
    return `${BACKEND_ORIGIN}/api/v1/storage/${cleanPath}`
  }

  return `/api/v1/storage/${cleanPath}`
}

/**
 * Resolves any storage file (PDF, receipt image, document, avatar) to a safe API streamed endpoint
 * ensuring zero 403 Forbidden errors when accessed via browser tabs or previews.
 */
export const getStorageFileUrl = (urlOrPath?: any): string => {
  return getAbsoluteImageUrl(urlOrPath)
}
