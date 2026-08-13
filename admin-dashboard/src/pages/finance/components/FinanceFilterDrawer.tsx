import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TabType } from '../types'

interface FinanceFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeTab: TabType
  categories: any[]
  filterType: string
  setFilterType: (val: string) => void
  filterStatus: string
  setFilterStatus: (val: string) => void
  filterAccount: string
  setFilterAccount: (val: string) => void
  filterCategory: string
  setFilterCategory: (val: string) => void
  filterPaymentMethod: string
  setFilterPaymentMethod: (val: string) => void
  filterDateStart: string
  setFilterDateStart: (val: string) => void
  filterDateEnd: string
  setFilterDateEnd: (val: string) => void
  filterAmountMin: string
  setFilterAmountMin: (val: string) => void
  filterAmountMax: string
  setFilterAmountMax: (val: string) => void
  filterCreatedBy: string
  setFilterCreatedBy: (val: string) => void
  onReset: () => void
}

export const FinanceFilterDrawer: React.FC<FinanceFilterDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  categories = [],
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterAccount,
  setFilterAccount,
  filterCategory,
  setFilterCategory,
  filterPaymentMethod,
  setFilterPaymentMethod,
  filterDateStart,
  setFilterDateStart,
  filterDateEnd,
  setFilterDateEnd,
  filterAmountMin,
  setFilterAmountMin,
  filterAmountMax,
  setFilterAmountMax,
  filterCreatedBy,
  setFilterCreatedBy,
  onReset,
}) => {
  const { t } = useTranslation(['finance', 'common'])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between p-5 border-b border-border bg-card">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                <h3 className="font-bold text-base text-foreground">{t('finance.filter_title', 'Filter Ledger Records')}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-card">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('finance.status_col', 'Status')}</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                >
                  <option value="">{t('finance.all_statuses', 'All Statuses')}</option>
                  <option value="approved">{t('finance.status_approved', 'Approved')}</option>
                  <option value="pending">{t('finance.status_pending', 'Pending')}</option>
                  <option value="rejected">{t('finance.status_rejected', 'Rejected')}</option>
                  <option value="active">{t('finance.status_active', 'Active')}</option>
                  <option value="inactive">{t('finance.status_inactive', 'Inactive')}</option>
                  <option value="open">{t('finance.status_open', 'Open Till')}</option>
                  <option value="closed">{t('finance.status_closed', 'Closed Till')}</option>
                </select>
              </div>

              {activeTab === 'expenses' && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('finance.category_col', 'Category')}</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2 cursor-pointer"
                  >
                    <option value="">{t('finance.all_categories', 'All Categories')}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('finance.from_date', 'From Date')}</label>
                <input
                  type="date"
                  value={filterDateStart}
                  onChange={(e) => setFilterDateStart(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('finance.to_date', 'To Date')}</label>
                <input
                  type="date"
                  value={filterDateEnd}
                  onChange={(e) => setFilterDateEnd(e.target.value)}
                  className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('finance.min_amount', 'Min Amount')}</label>
                  <input
                    type="number"
                    value={filterAmountMin}
                    onChange={(e) => setFilterAmountMin(e.target.value)}
                    placeholder="0"
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('finance.max_amount', 'Max Amount')}</label>
                  <input
                    type="number"
                    value={filterAmountMax}
                    onChange={(e) => setFilterAmountMax(e.target.value)}
                    placeholder="99999"
                    className="form-input rounded-xl text-sm w-full bg-card text-foreground border-border py-2"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border transition-colors"
              >
                <RotateCcw size={13} />
                <span>{t('common.reset', 'Reset Filters')}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs"
              >
                {t('common.apply', 'Apply Filters')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FinanceFilterDrawer
