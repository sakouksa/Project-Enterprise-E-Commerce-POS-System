import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Check, RotateCcw, SlidersHorizontal, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'

export interface ColumnOption {
  key: string
  label: string
}

interface ColumnSettingsPopoverProps {
  columns: ColumnOption[]
  visibleColumns: Record<string, boolean>
  onChange: (updated: Record<string, boolean>) => void
  title?: string
  className?: string
}

export const ColumnSettingsPopover: React.FC<ColumnSettingsPopoverProps> = ({
  columns,
  visibleColumns,
  onChange,
  title,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useThemeStore()
  const { t } = useTranslation(['products', 'common'])

  const hiddenCount = columns.filter((col) => visibleColumns[col.key] === false).length

  const handleToggle = (key: string) => {
    onChange({
      ...visibleColumns,
      [key]: !visibleColumns[key],
    })
  }

  const handleShowAll = () => {
    const next: Record<string, boolean> = {}
    columns.forEach((col) => {
      next[col.key] = true
    })
    onChange(next)
  }

  const handleReset = () => {
    const next: Record<string, boolean> = {}
    columns.forEach((col) => {
      next[col.key] = true
    })
    onChange(next)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 w-10 rounded-xl border transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer flex items-center justify-center relative shrink-0 ${
          hiddenCount > 0
            ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/15'
            : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/80'
        }`}
        title={t('products.toggleColumns', 'Column Settings')}
      >
        <Settings size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-primary' : ''}`} />
        {hiddenCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-75">
            {hiddenCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl z-50 p-3 space-y-2.5 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal size={13} className="text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    {title || t('products.toggleColumns', 'Column Visibility')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleShowAll}
                  className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Eye size={11} />
                  <span>{t('products.showAll', 'Show All')}</span>
                </button>
              </div>

              {/* Column Checkboxes List */}
              <div className="space-y-1 max-h-60 overflow-y-auto pr-0.5 custom-scrollbar">
                {columns.map((col) => {
                  const isChecked = visibleColumns[col.key] !== false
                  return (
                    <label
                      key={col.key}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer select-none transition-all duration-150 ${
                        isChecked
                          ? 'bg-primary/5 text-foreground hover:bg-primary/10'
                          : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-primary border-primary text-primary-foreground shadow-2xs'
                              : 'border-border bg-background'
                          }`}
                        >
                          {isChecked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span className="truncate">{col.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggle(col.key)}
                        className="sr-only"
                      />
                    </label>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {columns.filter((c) => visibleColumns[c.key] !== false).length} / {columns.length} {t('products.visible', 'Visible')}
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw size={10} />
                  <span>{t('common.reset', 'Reset')}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ColumnSettingsPopover
