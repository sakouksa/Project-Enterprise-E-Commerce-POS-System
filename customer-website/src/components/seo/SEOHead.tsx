import React from 'react'
import { Helmet } from 'react-helmet-async'
import i18n from '@/lib/i18n'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface SEOHeadProps {
  // Core
  title?: string
  description?: string
  canonical?: string
  robots?: string
  keywords?: string

  // Open Graph
  ogType?: 'website' | 'product' | 'article'
  ogImage?: string
  ogLocale?: string

  // Article-specific
  publishedTime?: string
  modifiedTime?: string
  author?: string

  // Structured data
  schema?: Record<string, any> | Record<string, any>[]

  // Breadcrumbs (auto-generates BreadcrumbList schema)
  breadcrumbs?: BreadcrumbItem[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const SITE_NAME = 'NexTech Enterprise'

export const getSiteUrl = (): string => {
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }
  return 'https://enterprise-pos-api.onrender.com'
}

export const SITE_URL = getSiteUrl()
export const DEFAULT_IMG = `${SITE_URL}/logo.png`

// ─── Locale Mapping ───────────────────────────────────────────────────────────

const LOCALE_MAP: Record<string, string> = {
  en: 'en_US',
  km: 'km_KH',
  th: 'th_TH',
  vi: 'vi_VN',
  zh: 'zh_CN',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html?: string | null): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function truncateDesc(str: string, max = 160): string {
  if (!str) return ''
  str = str.trim()
  return str.length > max ? str.slice(0, max - 1) + '…' : str
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  robots = 'index, follow',
  keywords,
  ogType = 'website',
  ogImage,
  ogLocale,
  publishedTime,
  modifiedTime,
  author,
  schema,
  breadcrumbs,
}) => {
  const currentLang = i18n.language || 'en'
  const activeLocale = ogLocale || LOCALE_MAP[currentLang] || 'en_US'

  // ── Title composition ──────────────────────────────────────────────────────
  const rawTitle = title?.trim() || ''
  const fullTitle = rawTitle
    ? rawTitle.includes(SITE_NAME)
      ? rawTitle
      : `${rawTitle} | ${SITE_NAME}`
    : `${SITE_NAME} | Electronics, Computers, POS & E-Commerce Cambodia`

  // ── Description cleanup ────────────────────────────────────────────────────
  const cleanDesc = truncateDesc(
    stripHtml(description) ||
    'Shop authentic electronics, computers, smartphones, gaming gear, and enterprise POS hardware with fast nationwide delivery in Cambodia.'
  )

  // ── Canonical URL Normalization ────────────────────────────────────────────
  let canonicalUrl = SITE_URL
  if (canonical) {
    canonicalUrl = canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`
  } else if (typeof window !== 'undefined') {
    canonicalUrl = `${window.location.origin}${window.location.pathname}`
  }

  // ── OG Image ──────────────────────────────────────────────────────────────
  const ogImg = ogImage || DEFAULT_IMG

  // ── Breadcrumb structured data ─────────────────────────────────────────────
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
      }
    : null

  // ── Schema output ──────────────────────────────────────────────────────────
  const schemaItems: Record<string, any>[] = []
  if (breadcrumbSchema) schemaItems.push(breadcrumbSchema)
  if (schema) {
    if (Array.isArray(schema)) schemaItems.push(...schema)
    else schemaItems.push(schema)
  }

  return (
    <Helmet>
      {/* HTML Lang sync */}
      <html lang={currentLang} />

      {/* Core Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={cleanDesc} />
      <meta name="robots" content={robots} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Favicons & App Icons */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={cleanDesc} />
      <meta property="og:image" content={ogImg} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={activeLocale} />

      {/* Article-specific OG */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={cleanDesc} />
      <meta name="twitter:image" content={ogImg} />

      {/* Structured Data (JSON-LD) */}
      {schemaItems.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(schemaItems.length === 1 ? schemaItems[0] : schemaItems)}
        </script>
      )}
    </Helmet>
  )
}

// ─── Root WebSite + Organization schema (injected once in StorefrontLayout) ───

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    areaServed: 'KH',
    telephone: '+855-12-220-152',
    availableLanguage: ['English', 'Khmer', 'Thai', 'Vietnamese', 'Chinese'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KH',
    addressLocality: 'Phnom Penh',
  },
}

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: SITE_NAME,
  image: `${SITE_URL}/logo.png`,
  url: SITE_URL,
  telephone: '+855 12 220 152',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Russian Federation Blvd (110)',
    addressLocality: 'Phnom Penh',
    addressRegion: 'Phnom Penh',
    postalCode: '12000',
    addressCountry: 'KH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 11.5564,
    longitude: 104.9282,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],
}

export default SEOHead
