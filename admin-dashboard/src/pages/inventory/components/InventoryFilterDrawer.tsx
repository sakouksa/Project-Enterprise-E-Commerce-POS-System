import React from 'react'
import { useTranslation } from 'react-i18next'
import ModernSelect from '@/components/shared/ModernSelect'
import FilterDrawerShell from '@/components/shared/FilterDrawerShell'

interface InventoryFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  warehouses: any[]
  categories: any[]
  brands: any[]
  suppliers: any[]
  users: any[]
  selectedWarehouse: string
  setSelectedWarehouse: (val: string) => void
  selectedCategory: string
  setSelectedCategory: (val: string) => void
  selectedBrand: string
  setSelectedBrand: (val: string) => void
  selectedStatus: string
  setSelectedStatus: (val: string) => void
  selectedSupplier: string
  setSelectedSupplier: (val: string) => void
  filterStartDate: string
  setFilterStartDate: (val: string) => void
  filterEndDate: string
  setFilterEndDate: (val: string) => void
  selectedCreatedBy: string
  setSelectedCreatedBy: (val: string) => void
  onReset: () => void
  setPage: (page: number) => void
}

const FL = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
  </div>
)

const inputCls = "w-full text-xs font-semibold rounded-xl bg-card border border-border/80 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all py-2.5 px-3.5 text-foreground shadow-2xs"

export const InventoryFilterDrawer: React.FC<InventoryFilterDrawerProps> = ({
  isOpen,
  onClose,
  warehouses = [],
  categories = [],
  brands = [],
  suppliers = [],
  users = [],
  selectedWarehouse,
  setSelectedWarehouse,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedStatus,
  setSelectedStatus,
  selectedSupplier,
  setSelectedSupplier,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  selectedCreatedBy,
  setSelectedCreatedBy,
  onReset,
  setPage,
}) => {
  const { t } = useTranslation(['inventory', 'common'])

  const activeCount = [
    selectedWarehouse,
    selectedCategory,
    selectedBrand,
    selectedStatus,
    selectedSupplier,
    filterStartDate,
    filterEndDate,
    selectedCreatedBy,
  ].filter(Boolean).length

  const set = (fn: (val: string) => void) => (val: string) => {
    fn(val)
    setPage(1)
  }

  return (
    <FilterDrawerShell
      isOpen={isOpen}
      onClose={onClose}
      onReset={onReset}
      title={t('advancedFilters', 'Advanced Inventory Filters')}
      activeCount={activeCount}
      applyLabel={t('common.apply', 'Apply')}
      resetLabel={t('common.reset', 'Reset')}
    >
      {/* Warehouse */}
      <FL label={t('warehouse', 'Warehouse Location')}>
        <ModernSelect
          value={selectedWarehouse}
          onChange={set(setSelectedWarehouse)}
          options={[
            { value: '', label: t('allWarehouses', 'All Warehouses') },
            ...warehouses.map((w: any) => ({ value: String(w.id), label: w.name })),
          ]}
          placeholder={t('allWarehouses', 'All Warehouses')}
        />
      </FL>

      {/* Category */}
      <FL label={t('category', 'Category')}>
        <ModernSelect
          value={selectedCategory}
          onChange={set(setSelectedCategory)}
          options={[
            { value: '', label: t('allCategories', 'All Categories') },
            ...categories.map((c: any) => ({ value: String(c.id), label: c.name })),
          ]}
          placeholder={t('allCategories', 'All Categories')}
        />
      </FL>

      {/* Brand */}
      <FL label={t('brand', 'Brand')}>
        <ModernSelect
          value={selectedBrand}
          onChange={set(setSelectedBrand)}
          options={[
            { value: '', label: t('allBrands', 'All Brands') },
            ...brands.map((b: any) => ({ value: String(b.id), label: b.name })),
          ]}
          placeholder={t('allBrands', 'All Brands')}
        />
      </FL>

      {/* Stock Level Status */}
      <FL label={t('stockStatus', 'Stock Level Status')}>
        <ModernSelect
          value={selectedStatus}
          onChange={set(setSelectedStatus)}
          options={[
            { value: '', label: t('allStatus', 'All Stock Statuses') },
            { value: 'in_stock', label: t('inStockHealthy', 'In Stock (Healthy)') },
            { value: 'low_stock', label: t('lowStockAlert', 'Low Stock (Alert)') },
            { value: 'out_of_stock', label: t('outOfStockZero', 'Out of Stock (Zero)') },
          ]}
          placeholder={t('allStatus', 'All Stock Statuses')}
        />
      </FL>

      {/* Supplier */}
      <FL label={t('supplier', 'Supplier')}>
        <ModernSelect
          value={selectedSupplier}
          onChange={set(setSelectedSupplier)}
          options={[
            { value: '', label: t('allSuppliers', 'All Suppliers') },
            ...suppliers.map((s: any) => ({ value: String(s.id), label: s.name })),
          ]}
          placeholder={t('allSuppliers', 'All Suppliers')}
        />
      </FL>

      {/* Date Range */}
      <FL label={t('dateRange', 'Date Range')}>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <span className="block text-[10px] font-medium text-muted-foreground mb-1">{t('startDate', 'Start Date')}</span>
            <input
              type="date"
              value={filterStartDate}
              onChange={e => { setFilterStartDate(e.target.value); setPage(1) }}
              className="w-full text-xs font-semibold rounded-xl bg-card border border-border/80 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-10 px-3 text-foreground shadow-sm"
            />
          </div>
          <div>
            <span className="block text-[10px] font-medium text-muted-foreground mb-1">{t('endDate', 'End Date')}</span>
            <input
              type="date"
              value={filterEndDate}
              onChange={e => { setFilterEndDate(e.target.value); setPage(1) }}
              className="w-full text-xs font-semibold rounded-xl bg-card border border-border/80 hover:border-primary/40 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-10 px-3 text-foreground shadow-sm"
            />
          </div>
        </div>
      </FL>

      {/* Operator / Created By */}
      <FL label={t('createdBy', 'Operator / Created By')}>
        <ModernSelect
          value={selectedCreatedBy}
          onChange={set(setSelectedCreatedBy)}
          options={[
            { value: '', label: t('allUsers', 'All Users') },
            ...users.map((u: any) => ({ value: String(u.id), label: u.name })),
          ]}
          placeholder={t('allUsers', 'All Users')}
        />
      </FL>
    </FilterDrawerShell>
  )
}

export default InventoryFilterDrawer
