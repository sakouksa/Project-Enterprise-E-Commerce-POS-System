import api from '@/api/client'

/**
 * Normalizes and converts any product/user/employee/receipt image value (string, object, path, full URL)
 * into a valid, displayable URL that works reliably across both Desktop and Mobile testing (IP access).
 * Automatically handles rewriting backend localhost/127.0.0.1:8001 URLs to relative /storage URLs
 * so that Vite dev server proxy can route them seamlessly without CORS or loopback connection issues.
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

  // Full HTTP/HTTPS URLs
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const parsed = new URL(path)
      // If it points to backend ports (8001, 8000) or local hostnames, convert to relative /storage path
      if (
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname === '0.0.0.0' ||
        parsed.port === '8001' ||
        parsed.port === '8000' ||
        parsed.pathname.startsWith('/storage')
      ) {
        return parsed.pathname // e.g. "/storage/profile/xxx.jpg"
      }
    } catch (e) {
      // If URL constructor fails, regex strip localhost/127.0.0.1:8001
      path = path.replace(/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/, '')
      if (path.startsWith('/')) return path
    }
    return path
  }

  // Relative path handling
  const cleaned = path.startsWith('/') ? path.substring(1) : path

  // If already starts with storage/
  if (cleaned.startsWith('storage/')) {
    return `/${cleaned}`
  }

  // Common upload subdirectories that live in public storage
  const knownStoragePrefixes = [
    'companies/',
    'settings/',
    'stores/',
    'payments/',
    'logos/',
    'profile/',
    'employees/',
    'expenses/',
    'receipts/',
    'products/',
    'users/',
    'categories/',
    'brands/',
    'avatars/',
    'media/',
  ]
  if (knownStoragePrefixes.some(prefix => cleaned.startsWith(prefix))) {
    return `/storage/${cleaned}`
  }

  return `/${cleaned}`
}

/**
 * Resolves any storage file (PDF, receipt image, document, avatar) to a safe API streamed endpoint
 * ensuring zero 403 Forbidden errors when accessed via browser tabs or previews.
 */
export const getStorageFileUrl = (urlOrPath?: any): string => {
  if (!urlOrPath) return ''
  let path = ''
  if (typeof urlOrPath === 'string') {
    path = urlOrPath.trim()
  } else if (typeof urlOrPath === 'object' && urlOrPath !== null) {
    path = (urlOrPath.url || urlOrPath.receipt || urlOrPath.image || urlOrPath.path || '').trim()
  }
  if (!path || typeof path !== 'string') return ''

  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const parsed = new URL(path)
      if (
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname === '0.0.0.0' ||
        parsed.port === '8001' ||
        parsed.port === '8000' ||
        parsed.port === '5174' ||
        parsed.pathname.startsWith('/storage')
      ) {
        const cleanPath = parsed.pathname.replace(/^\/(api\/v1\/)?storage\//, '')
        return `/api/v1/storage/${cleanPath}`
      }
    } catch (e) {
      // Fallthrough
    }
    return path
  }

  const cleaned = path.replace(/^\/?(api\/v1\/)?storage\//, '').replace(/^\//, '')
  return `/api/v1/storage/${cleaned}`
}
