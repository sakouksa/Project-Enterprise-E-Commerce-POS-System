import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { useTranslation } from 'react-i18next'

const ThemeSwitcher: React.FC = () => {
  const { themeMode, updateThemeMode } = useThemeStore()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const modes = [
    { id: 'light', label: t('common.light', 'Light'), icon: <Sun className="w-4 h-4" /> },
    { id: 'dark', label: t('common.dark', 'Dark'), icon: <Moon className="w-4 h-4" /> },
    { id: 'system', label: t('common.system', 'System'), icon: <Monitor className="w-4 h-4" /> },
  ] as const

  const activeMode = modes.find((m) => m.id === themeMode) ?? modes[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/30 transition-all duration-200"
        title={t('common.theme', 'Theme')}
      >
        {activeMode.icon}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-xl shadow-xl z-50 p-1 backdrop-blur-md"
          >
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  updateThemeMode(mode.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150
                  ${
                    themeMode === mode.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeSwitcher
