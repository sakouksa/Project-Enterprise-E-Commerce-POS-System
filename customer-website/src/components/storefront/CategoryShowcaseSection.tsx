import React from 'react'
import { Link } from 'react-router-dom'
import { Layers, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SectionHeader from './SectionHeader'
import CustomerProductCard, { type ProductItem } from './CustomerProductCard'

export interface ShowcaseCategory {
  id: number
  name: string
  slug: string
  image?: string | null
  product_count?: number
  products: ProductItem[]
}

interface CategoryShowcaseSectionProps {
  categories: ShowcaseCategory[]
}

export const CategoryShowcaseSection: React.FC<CategoryShowcaseSectionProps> = ({ categories }) => {
  const { t } = useTranslation()

  if (!categories || categories.length === 0) return null

  return (
    <section className="container-site py-4 sm:py-6 space-y-8 sm:space-y-12">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="p-5 sm:p-7 rounded-3xl bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200/60 dark:border-gray-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white font-display">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {cat.product_count ?? 10}+ {t('common.items')} {t('section.category_showcase_sub')}
                </p>
              </div>
            </div>

            <Link
              to={`/category/${cat.slug}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {t('common.view_all')} {cat.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {cat.products.slice(0, 4).map((prod) => (
              <CustomerProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default CategoryShowcaseSection
