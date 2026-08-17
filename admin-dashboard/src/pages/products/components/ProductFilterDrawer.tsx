import React from 'react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'
import ModernSelect from '@/components/shared/ModernSelect'
import FilterDrawerShell from '@/components/shared/FilterDrawerShell'

interface ProductFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  categoryFilter: string
  setCategoryFilter: (val: string) => void
  brandFilter: string
  setBrandFilter: (val: string) => void
  stockLevelFilter: string
  setStockLevelFilter: (val: string) => void
  priceMinFilter: string
  priceMaxFilter: string
  setPriceMinFilter: (val: string) => void
  setPriceMaxFilter: (val: string) => void
  categories: any[]
  brands: any[]
  onReset: () => void
}

const FL = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</label>
    {children}
  </div>
)

const inputCls = "w-full text-xs font-semibold rounded-xl bg-card border border-border/80 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all py-2.5 px-3.5 text-foreground shadow-2xs"

export const ProductFilterDrawer: React.FC<ProductFilterDrawerProps> = ({
  isOpen, onClose,
  statusFilter, setStatusFilter,
  categoryFilter, setCategoryFilter,
  brandFilter, setBrandFilter,
  stockLevelFilter, setStockLevelFilter,
  priceMinFilter, priceMaxFilter,
  setPriceMinFilter, setPriceMaxFilter,
  categories = [], brands = [],
  onReset,
}) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['products', 'common'])

  const activeCount = [statusFilter, categoryFilter, brandFilter, stockLevelFilter, priceMinFilter, priceMaxFilter].filter(Boolean).length

  const statusOptions = [
    { value: '', label: t('allStatus', 'All Statuses') },
    { value: 'active', label: t('common.active', 'Active') },
    { value: 'inactive', label: t('common.inactive', 'Inactive') },
    { value: 'draft', label: t('draft', 'Draft / Hidden') },
    { value: 'archived', label: t('archived', 'Archived') },
  ]

  const categoryOptions = [
    { value: '', label: t('allCategories', 'All Categories') },
    ...categories.map((c: any) => ({ value: String(c.id), label: c.name }))
  ]

  const brandOptions = [
    { value: '', label: t('allBrands', 'All Brands') },
    ...brands.map((b: any) => ({ value: String(b.id), label: b.name }))
  ]

  const stockLevelOptions = [
    { value: '', label: t('allStockLevels', 'All Stock Levels') },
    { value: 'in_stock', label: t('inStock', 'In Stock (> 0)') },
    { value: 'low_stock', label: t('lowStock', 'Low Stock Warning') },
    { value: 'out_of_stock', label: t('outOfStock', 'Out of Stock (= 0)') },
  ]

  return (
    <FilterDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      title={t('drawerTitle', 'Filter Products Catalog')}
      activeCount={activeCount}
      applyLabel={t('applyFilters', 'Apply Filters')}
      resetLabel={t('reset', 'Reset Filters')}
    >
      <FL label={t('filterStatus', 'Product Status')}>
        <ModernSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          placeholder={t('allStatus', 'All Statuses')}
        />
      </FL>

      <FL label={t('filterCategory', 'Category')}>
        <ModernSelect
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categoryOptions}
          placeholder={t('allCategories', 'All Categories')}
        />
      </FL>

      <FL label={t('filterBrand', 'Brand')}>
        <ModernSelect
          value={brandFilter}
          onChange={setBrandFilter}
          options={brandOptions}
          placeholder={t('allBrands', 'All Brands')}
        />
      </FL>

      <FL label={t('filterStockLevel', 'Stock Level')}>
        <ModernSelect
          value={stockLevelFilter}
          onChange={setStockLevelFilter}
          options={stockLevelOptions}
          placeholder={t('allStockLevels', 'All Stock Levels')}
        />
      </FL>

      <FL label={t('filterPriceRange', 'Price Range ($)')}>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">$</span>
            <input type="number" value={priceMinFilter} onChange={e => setPriceMinFilter(e.target.value)} placeholder={t('minPrice', 'Min')} className={`${inputCls} pl-7`} />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">$</span>
            <input type="number" value={priceMaxFilter} onChange={e => setPriceMaxFilter(e.target.value)} placeholder={t('maxPrice', 'Max')} className={`${inputCls} pl-7`} />
          </div>
        </div>
      </FL>
    </FilterDrawerShell>
  )
}

export default ProductFilterDrawer
