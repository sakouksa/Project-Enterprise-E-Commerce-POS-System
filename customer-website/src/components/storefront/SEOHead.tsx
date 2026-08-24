import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
  schema?: Record<string, any>
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Enterprise Store | Premium Tech, Devices & Authentic Lifestyle Goods',
  description = 'Shop authentic products from world-leading brands. Enjoy flash sales, instant discount coupons, and fast shipping with 24/7 dedicated support.',
  image = '/og-image.jpg',
  url = window.location.href,
  schema,
}) => {
  const fullTitle = title.includes('Enterprise') ? title : `${title} | Enterprise Store`

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Enterprise E-Commerce Store',
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />

      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  )
}

export default SEOHead
