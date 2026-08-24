import React from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import CustomerProductCard, { type ProductItem } from './CustomerProductCard'

interface FeaturedProductsSectionProps {
  products: ProductItem[]
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products }) => {
  const { t } = useTranslation()

  if (!products || products.length === 0) return null

  return (
    <section className="container-site py-4 sm:py-6">
      <SectionHeader
        title={t('section.featured_title')}
        subtitle={t('section.featured_sub')}
        icon={<Sparkles className="w-5 h-5" />}
        badge="Editor's Choice"
        viewAllLink="/products?featured=true"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.slice(0, 12).map((prod) => (
          <CustomerProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedProductsSection
