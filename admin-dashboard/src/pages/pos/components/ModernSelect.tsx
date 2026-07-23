import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'
import { sound } from '@/utils/sound'

export interface SelectOption {
  value: string | number
  label: string
  icon?: React.ReactNode
  badge?: string
}

interface ModernSelectProps {
  value: string | number
  onChange: (value: any) => void
  options: SelectOption[]
  icon?: React.ReactNode
  placeholder?: string
  className?: string
  buttonClassName?: string
  align?: 'left' | 'right'
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  value,
  onChange,
  options,
  icon,
  placeholder = 'Select option...',
  className = '',
  buttonClassName = '',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filterText, setFilterText] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOpt = options.find((o) => String(o.value) === String(value)) || options[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(filterText.toLowerCase())
  )

  const alignPositionClass = align === 'right' ? 'right-0' : 'left-0'

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          sound.playClick()
          setIsOpen(!isOpen)
          setFilterText('')
        }}
        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 hover:border-primary/50 hover:bg-accent/40 text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs active:scale-98 ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {icon && <span className="text-primary shrink-0">{icon}</span>}
          {selectedOpt?.icon && <span className="shrink-0">{selectedOpt.icon}</span>}
          <span className="truncate text-foreground font-extrabold">{selectedOpt?.label || placeholder}</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-muted-foreground shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className={`absolute ${alignPositionClass} top-full mt-2 z-[100] min-w-[220px] max-w-[320px] w-max bg-card border border-border rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5 dark:ring-white/10`}>
          
          {/* Quick Search if list > 5 items */}
          {options.length > 5 && (
            <div className="relative mb-1 px-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search..."
                className="w-full bg-muted/40 border border-border/60 rounded-xl pl-8 pr-2 py-1 text-xs focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">No options found</div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value)
                const badgeText = typeof opt.badge === 'object' && opt.badge !== null
                  ? (opt.badge as any).name || (opt.badge as any).label || ''
                  : (opt.badge || '')

                return (
                  <button
                    key={`${opt.value}-${idx}`}
                    type="button"
                    onClick={() => {
                      sound.playSuccess()
                      onChange(opt.value)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-black shadow-xs'
                        : 'text-foreground hover:bg-primary/10 hover:text-primary font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="truncate">{typeof opt.label === 'string' ? opt.label : String(opt.label || '')}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {badgeText && (
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          {badgeText}
                        </span>
                      )}
                      {isSelected && <Check size={14} className="shrink-0" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>

        </div>
      )}
    </div>
  )
}
