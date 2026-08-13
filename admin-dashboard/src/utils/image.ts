import api from '@/api/client'

/**
 * Normalizes and converts any product image value (string, object, path, full URL)
 * into a valid, displayable absolute or relative URL.
 * Also handles rewriting backend localhost:8001 URLs to relative /storage URLs
 * so that Vite dev server proxy can route them seamlessly without CORS or IPv6 localhost connection issues.
 */
export const getAbsoluteImageUrl = (urlOrPath?: any): string => {
  if (!urlOrPath) return ''

  let path = ''

  if (typeof urlOrPath === 'string') {
    path = urlOrPath
  } else if (typeof urlOrPath === 'object' && urlOrPath !== null) {
    path = urlOrPath.url || urlOrPath.image || urlOrPath.image_path || urlOrPath.path || ''
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
      // If it points to backend localhost/127.0.0.1 on port 8001 or 8000, convert to relative /storage path
      if (
        (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') &&
        (parsed.port === '8001' || parsed.port === '8000' || parsed.port === '')
      ) {
        return parsed.pathname // e.g. "/storage/products/apple/..."
      }
    } catch (e) {
      // Fallthrough
    }
    return path
  }

  // Relative path handling
  const cleaned = path.startsWith('/') ? path.substring(1) : path
  const storagePath = cleaned.startsWith('storage/') ? cleaned : `storage/${cleaned}`

  return `/${storagePath}`
}
