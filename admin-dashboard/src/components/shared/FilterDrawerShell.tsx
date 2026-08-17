/**
 * FilterDrawerShell — Global reusable shell for all filter drawers.
 * Provides consistent animated backdrop + drawer panel + header + footer.
 * Each filter drawer wraps its content in <FilterDrawerShell>.
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FilterDrawerShellProps {
  isOpen: boolean
  onClose: () => void
  onReset: () => void
  title: string
  activeCount?: number
  children: React.ReactNode
  applyLabel?: string
  resetLabel?: string
}

export const FilterDrawerShell: React.FC<FilterDrawerShellProps> = ({
  isOpen,
  onClose,
  onReset,
  title,
  activeCount = 0,
  children,
  applyLabel,
  resetLabel,
}) => {
  const { t } = useTranslation(['common', 'buttons', 'forms'])

  const resolvedApplyLabel = applyLabel ?? t('common.applyFilters', t('buttons.apply', 'Apply Filters'))
  const resolvedResetLabel = resetLabel ?? t('common.reset', t('buttons.reset', 'Reset'))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                  <Filter size={15} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground leading-tight">{title}</h3>
                  {activeCount > 0 && (
                    <span className="text-[11px] font-semibold text-primary">
                      {t('common.filters_active_count', { count: activeCount, defaultValue: t('common.filters_active', { count: activeCount, defaultValue: `${activeCount} filter${activeCount !== 1 ? 's' : ''} active` }) })}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {children}
            </div>

            {/* Footer */}
            <div className="px-4 py-3.5 border-t border-border shrink-0 flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl border border-border transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>{resolvedResetLabel}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs text-center cursor-pointer"
              >
                {resolvedApplyLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilterDrawerShell
