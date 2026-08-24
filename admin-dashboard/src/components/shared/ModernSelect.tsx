import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface Option {
  value: string
  label: string
  icon?: React.ReactNode
  badge?: string
}

interface ModernSelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
  searchable?: boolean
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  className = '',
  searchable = true,
}) => {
  const { t } = useTranslation(['common', 'forms'])
  const defaultPlaceholder = placeholder ?? t('common.select_option', 'Select option')

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  // Show search input if searchable and option count is 6 or more
  const showSearch = searchable && options.length > 6

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options
    const lower = searchTerm.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(lower))
  }, [options, searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isOpen, showSearch])

  return (
    <div ref={containerRef} className={`space-y-1.5 relative ${className}`}>
      {label && (
        <label className="block text-[11px] font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-xs sm:text-[13px] font-medium rounded-xl bg-card dark:bg-slate-900/90 border transition-all h-10 min-h-[40px] px-3.5 py-2 text-foreground dark:text-slate-100 shadow-2xs cursor-pointer select-none ${
          isOpen
            ? 'border-primary ring-2 ring-primary/20 shadow-xs'
            : 'border-border/80 dark:border-slate-700/80 hover:border-primary/50 dark:hover:border-primary/60 hover:bg-accent/40 dark:hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2 truncate min-w-0 flex-1 text-left">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className={`truncate ${!selectedOption?.value && !selectedOption ? 'text-muted-foreground dark:text-slate-400 font-normal' : 'text-foreground dark:text-slate-100 font-semibold'}`}>
            {selectedOption ? selectedOption.label : defaultPlaceholder}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-muted-foreground dark:text-slate-400 transition-transform duration-200 shrink-0 ml-1.5 ${
            isOpen ? 'rotate-180 text-primary dark:text-primary' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-1.5 bg-card dark:bg-slate-900 border border-border/90 dark:border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 max-h-60 overflow-hidden flex flex-col ring-1 ring-black/5 dark:ring-white/10"
          >
            {showSearch && (
              <div className="p-1 border-b border-border/60 dark:border-slate-800 mb-1 relative shrink-0">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('common.filter_placeholder', t('common.search', 'Filter...'))}
                  className="w-full text-xs rounded-lg pl-7 pr-6 py-1.5 bg-muted/40 dark:bg-slate-800/90 border border-border/60 dark:border-slate-700 text-foreground dark:text-slate-100 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSearchTerm('')
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            )}

            <div className="overflow-y-auto space-y-0.5 max-h-48 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="py-3 px-3 text-center text-xs text-muted-foreground dark:text-slate-400">
                  {t('common.no_matching_options', 'No matching options')}
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value)
                        setIsOpen(false)
                        setSearchTerm('')
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-[13px] font-semibold rounded-xl transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-primary/15 text-primary font-bold dark:bg-primary/25 dark:text-primary dark:border dark:border-primary/30'
                          : 'text-foreground dark:text-slate-200 hover:bg-muted/60 dark:hover:bg-slate-800/90 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate min-w-0">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <span className="truncate">{opt.label}</span>
                        {opt.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-muted dark:bg-slate-800 text-muted-foreground dark:text-slate-300">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check size={14} className="text-primary dark:text-primary shrink-0 ml-2" />}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ModernSelect
