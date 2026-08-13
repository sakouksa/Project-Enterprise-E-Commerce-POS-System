import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Sliders, X } from 'lucide-react'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

interface SuppliersFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  countryFilter: string
  setCountryFilter: (val: string) => void
  cityFilter: string
  setCityFilter: (val: string) => void
  users: any[]
  createdByFilter: string
  setCreatedByFilter: (val: string) => void
  onReset: () => void
  setPage: (page: number) => void
}

export const SuppliersFilterDrawer: React.FC<SuppliersFilterDrawerProps> = ({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  countryFilter,
  setCountryFilter,
  cityFilter,
  setCityFilter,
  users,
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
                    {t('suppliers.advancedFilters', 'Advanced Supplier Filters')}
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
                    {t('suppliers.status', 'Status')}
                  </label>
                  <ModernSelect
                    value={statusFilter}
                    onChange={(val) => { setStatusFilter(String(val)); setPage(1); }}
                    options={[
                      { value: '', label: t('common.allStatus', 'All Statuses') },
                      { value: '1', label: t('common.active', 'Active') },
                      { value: '0', label: t('common.inactive', 'Inactive') },
                    ]}
                    placeholder={t('common.allStatus', 'All Statuses')}
                  />
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('suppliers.country', 'Country')}
                  </label>
                  <input
                    type="text"
                    value={countryFilter}
                    onChange={e => { setCountryFilter(e.target.value); setPage(1); }}
                    placeholder="e.g. Cambodia, China, USA..."
                    className="form-input text-xs w-full"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('suppliers.city', 'City / Province')}
                  </label>
                  <input
                    type="text"
                    value={cityFilter}
                    onChange={e => { setCityFilter(e.target.value); setPage(1); }}
                    placeholder="e.g. Phnom Penh, Shanghai..."
                    className="form-input text-xs w-full"
                  />
                </div>

                {/* Created By User */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('suppliers.createdBy', 'Created By')}
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
