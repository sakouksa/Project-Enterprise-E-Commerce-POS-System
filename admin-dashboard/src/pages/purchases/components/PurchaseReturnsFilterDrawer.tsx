import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Sliders, X } from 'lucide-react'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

interface PurchaseReturnsFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  suppliers: any[]
  warehouses: any[]
  users: any[]
  statusFilter: string
  setStatusFilter: (val: string) => void
  supplierFilter: string
  setSupplierFilter: (val: string) => void
  warehouseFilter: string
  setWarehouseFilter: (val: string) => void
  minReturnAmountFilter: string
  setMinReturnAmountFilter: (val: string) => void
  maxReturnAmountFilter: string
  setMaxReturnAmountFilter: (val: string) => void
  returnDateStartFilter: string
  setReturnDateStartFilter: (val: string) => void
  returnDateEndFilter: string
  setReturnDateEndFilter: (val: string) => void
  createdByFilter: string
  setCreatedByFilter: (val: string) => void
  onReset: () => void
  setPage: (page: number) => void
}

export const PurchaseReturnsFilterDrawer: React.FC<PurchaseReturnsFilterDrawerProps> = ({
  isOpen,
  onClose,
  suppliers,
  warehouses,
  users,
  statusFilter,
  setStatusFilter,
  supplierFilter,
  setSupplierFilter,
  warehouseFilter,
  setWarehouseFilter,
  minReturnAmountFilter,
  setMinReturnAmountFilter,
  maxReturnAmountFilter,
  setMaxReturnAmountFilter,
  returnDateStartFilter,
  setReturnDateStartFilter,
  returnDateEndFilter,
  setReturnDateEndFilter,
  createdByFilter,
  setCreatedByFilter,
  onReset,
  setPage,
}) => {
  const { t } = useTranslation()

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
                    {t('purchases.advancedFilters', 'Advanced Return Filters')}
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
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('purchases.status', 'Status')}
                  </label>
                  <ModernSelect
                    value={statusFilter}
                    onChange={(val) => { setStatusFilter(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: t('common.allStatus', 'All Statuses') },
                      { value: 'draft', label: t('purchases.draft', 'Draft') },
                      { value: 'approved', label: t('purchases.approved', 'Approved') },
                      { value: 'cancelled', label: t('purchases.cancelled', 'Cancelled') },
                    ]}
                    placeholder={t('common.allStatus', 'All Statuses')}
                  />
                </div>

                {/* Supplier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('purchases.supplier', 'Supplier')}
                  </label>
                  <ModernSelect
                    value={supplierFilter}
                    onChange={(val) => { setSupplierFilter(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: t('purchases.allSuppliers', 'All Suppliers') },
                      ...(suppliers ?? []).map((s: any) => ({ value: String(s.id), label: s.name })),
                    ]}
                    placeholder={t('purchases.allSuppliers', 'All Suppliers')}
                  />
                </div>

                {/* Warehouse */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('purchases.warehouse', 'Warehouse')}
                  </label>
                  <ModernSelect
                    value={warehouseFilter}
                    onChange={(val) => { setWarehouseFilter(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: t('purchases.allWarehouses', 'All Warehouses') },
                      ...(warehouses ?? []).map((w: any) => ({ value: String(w.id), label: w.name })),
                    ]}
                    placeholder={t('purchases.allWarehouses', 'All Warehouses')}
                  />
                </div>

                {/* Return Date Range */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('purchases.returnDateRange', 'Return Date Range')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={returnDateStartFilter}
                      onChange={(e) => { setReturnDateStartFilter(e.target.value); setPage(1); }}
                      className="form-input text-xs w-full"
                    />
                    <input
                      type="date"
                      value={returnDateEndFilter}
                      onChange={(e) => { setReturnDateEndFilter(e.target.value); setPage(1); }}
                      className="form-input text-xs w-full"
                    />
                  </div>
                </div>

                {/* Amount Range */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('purchases.amountRange', 'Amount Range ($)')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minReturnAmountFilter}
                      onChange={(e) => { setMinReturnAmountFilter(e.target.value); setPage(1); }}
                      className="form-input text-xs w-full font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxReturnAmountFilter}
                      onChange={(e) => { setMaxReturnAmountFilter(e.target.value); setPage(1); }}
                      className="form-input text-xs w-full font-mono"
                    />
                  </div>
                </div>

                {/* Created By User */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('purchases.createdBy', 'Created By')}
                  </label>
                  <ModernSelect
                    value={createdByFilter}
                    onChange={(val) => { setCreatedByFilter(String(val)); setPage(1); }}
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
