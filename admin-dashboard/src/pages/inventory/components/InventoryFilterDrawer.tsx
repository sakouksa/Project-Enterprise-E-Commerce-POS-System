import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Sliders, X } from 'lucide-react'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

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

export const InventoryFilterDrawer: React.FC<InventoryFilterDrawerProps> = ({
  isOpen,
  onClose,
  warehouses,
  categories,
  brands,
  suppliers,
  users,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col justify-between"
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">
                    {t('advancedFilters', 'Advanced Inventory Filters')}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                {/* Warehouse */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('warehouse', 'Warehouse Location')}
                  </label>
                  <ModernSelect
                    value={selectedWarehouse}
                    onChange={(val) => { setSelectedWarehouse(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: t('allWarehouses', 'All Warehouses') },
                      ...(warehouses ?? []).map((w: any) => ({ value: String(w.id), label: w.name })),
                    ]}
                    placeholder={t('allWarehouses', 'All Warehouses')}
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('category', 'Category')}
                  </label>
                  <ModernSelect
                    value={selectedCategory}
                    onChange={(val) => { setSelectedCategory(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: t('allCategories', 'All Categories') },
                      ...(categories ?? []).map((c: any) => ({ value: String(c.id), label: c.name })),
                    ]}
                    placeholder={t('allCategories', 'All Categories')}
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('brand', 'Brand')}
                  </label>
                  <ModernSelect
                    value={selectedBrand}
                    onChange={(val) => { setSelectedBrand(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: t('allBrands', 'All Brands') },
                      ...(brands ?? []).map((b: any) => ({ value: String(b.id), label: b.name })),
                    ]}
                    placeholder={t('allBrands', 'All Brands')}
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('stockStatus', 'Stock Level Status')}
                  </label>
                  <ModernSelect
                    value={selectedStatus}
                    onChange={(val) => { setSelectedStatus(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: t('allStatus', 'All Stock Statuses') },
                      { value: 'in_stock', label: t('inStock', 'In Stock (Healthy)') },
                      { value: 'low_stock', label: t('lowStock', 'Low Stock (Alert)') },
                      { value: 'out_of_stock', label: t('outOfStock', 'Out of Stock (Zero)') },
                    ]}
                    placeholder={t('allStatus', 'All Stock Statuses')}
                  />
                </div>

                {/* Supplier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('supplier', 'Supplier')}
                  </label>
                  <ModernSelect
                    value={selectedSupplier}
                    onChange={(val) => { setSelectedSupplier(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: t('allSuppliers', 'All Suppliers') },
                      ...(suppliers ?? []).map((s: any) => ({ value: String(s.id), label: s.name })),
                    ]}
                    placeholder={t('allSuppliers', 'All Suppliers')}
                  />
                </div>

                {/* Date Range */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('dateRange', 'Created / Updated Date Range')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filterStartDate}
                      onChange={e => { setFilterStartDate(e.target.value); setPage(1); }}
                      className="form-input text-xs w-full"
                    />
                    <input
                      type="date"
                      value={filterEndDate}
                      onChange={e => { setFilterEndDate(e.target.value); setPage(1); }}
                      className="form-input text-xs w-full"
                    />
                  </div>
                </div>

                {/* Created By User */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('createdBy', 'Operator / Created By')}
                  </label>
                  <ModernSelect
                    value={selectedCreatedBy}
                    onChange={(val) => { setSelectedCreatedBy(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: 'All Users' },
                      ...(users ?? []).map((u: any) => ({ value: String(u.id), label: u.name })),
                    ]}
                    placeholder="All Users"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  {t('common.reset', 'Reset')}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 cursor-pointer"
                >
                  {t('common.apply', 'Apply')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
