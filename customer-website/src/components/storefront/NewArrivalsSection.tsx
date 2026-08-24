import React from 'react'
import { Sparkle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import CustomerProductCard, { type ProductItem } from './CustomerProductCard'

interface NewArrivalsSectionProps {
  products: ProductItem[]
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  const { t } = useTranslation()

  if (!products || products.length === 0) return null

  return (
    <section className="container-site py-4 sm:py-6">
      <SectionHeader
        title={t('section.new_arrivals_title')}
        subtitle={t('section.new_arrivals_sub')}
        icon={<Sparkle className="w-5 h-5 text-emerald-500" />}
        badge="Just Landed"
        viewAllLink="/products?sort=newest"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.slice(0, 12).map((prod) => (
          <CustomerProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  )
}

export default NewArrivalsSection
