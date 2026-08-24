import React, { useState, useEffect } from 'react'
import { History } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import CustomerProductCard, { type ProductItem } from './CustomerProductCard'

export const RecentlyViewedSection: React.FC = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState<ProductItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('recently_viewed_products')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setItems(parsed.slice(0, 6))
        }
      }
    } catch {}
  }, [])

  if (!items || items.length === 0) return null

  return (
    <section className="container-site py-4 sm:py-6">
      <SectionHeader
        title={t('section.recently_viewed_title')}
        subtitle={t('section.recently_viewed_sub')}
        icon={<History className="w-5 h-5 text-gray-500" />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {items.map((prod) => (
          <CustomerProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  )
}

export default RecentlyViewedSection
