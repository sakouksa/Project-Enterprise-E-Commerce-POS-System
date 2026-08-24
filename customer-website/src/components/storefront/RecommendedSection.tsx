import React from 'react'
import { Sparkles, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores'
import SectionHeader from './SectionHeader'
import CustomerProductCard, { type ProductItem } from './CustomerProductCard'

interface RecommendedSectionProps {
  products: ProductItem[]
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({ products }) => {
  const { t } = useTranslation()
  const { isLoggedIn, customer } = useAuthStore()

  if (!products || products.length === 0) return null

  return (
    <section className="container-site py-4 sm:py-6">
      <SectionHeader
        title={t('section.recommended_title')}
        subtitle={
          isLoggedIn && customer
            ? `Personalized picks based on your recent activity, ${customer.name}`
            : t('section.recommended_sub')
        }
        icon={isLoggedIn ? <UserCheck className="w-5 h-5 text-purple-500" /> : <Sparkles className="w-5 h-5 text-purple-500" />}
        badge={isLoggedIn ? 'For You' : 'Top Trending'}
        viewAllLink="/products"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.slice(0, 12).map((prod) => (
          <CustomerProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  )
}

export default RecommendedSection
