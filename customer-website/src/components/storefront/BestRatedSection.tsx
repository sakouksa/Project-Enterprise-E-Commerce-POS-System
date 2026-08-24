import React from 'react'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import CustomerProductCard, { type ProductItem } from './CustomerProductCard'

interface BestRatedSectionProps {
  products: ProductItem[]
}

export const BestRatedSection: React.FC<BestRatedSectionProps> = ({ products }) => {
  const { t } = useTranslation()

  if (!products || products.length === 0) return null

  return (
    <section className="container-site py-4 sm:py-6">
      <SectionHeader
        title={t('section.top_rated_title')}
        subtitle={t('section.top_rated_sub')}
        icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
        badge="4.5+ Stars"
        viewAllLink="/products?sort=rating"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.slice(0, 6).map((prod) => (
          <CustomerProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  )
}

export default BestRatedSection
