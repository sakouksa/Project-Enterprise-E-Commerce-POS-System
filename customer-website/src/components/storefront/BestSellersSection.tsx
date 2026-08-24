import React from 'react'
import { Award } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import CustomerProductCard, { type ProductItem } from './CustomerProductCard'

interface BestSellersSectionProps {
  products: ProductItem[]
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ products }) => {
  const { t } = useTranslation()

  if (!products || products.length === 0) return null

  return (
    <section className="container-site py-4 sm:py-6">
      <SectionHeader
        title={t('section.best_sellers_title')}
        subtitle={t('section.best_sellers_sub')}
        icon={<Award className="w-5 h-5 text-amber-500" />}
        badge="Top Volume"
        viewAllLink="/products?sort=best_sellers"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.slice(0, 12).map((prod) => (
          <CustomerProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  )
}

export default BestSellersSection
