import React from 'react'
import { Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import CustomerProductCard, { type ProductItem } from './CustomerProductCard'

interface TodaysDealsSectionProps {
  products: ProductItem[]
}

export const TodaysDealsSection: React.FC<TodaysDealsSectionProps> = ({ products }) => {
  const { t } = useTranslation()

  if (!products || products.length === 0) return null

  return (
    <section className="container-site py-4 sm:py-6">
      <SectionHeader
        title={t('section.deals_title')}
        subtitle={t('section.deals_sub')}
        icon={<Tag className="w-5 h-5 text-rose-500" />}
        badge="Special Discounts"
        viewAllLink="/products?sort=deals"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.slice(0, 12).map((prod) => (
          <CustomerProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  )
}

export default TodaysDealsSection
