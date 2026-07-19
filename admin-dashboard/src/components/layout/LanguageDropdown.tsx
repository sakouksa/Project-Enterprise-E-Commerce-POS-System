import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Check } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { useTranslation } from 'react-i18next'

interface Language {
  code: 'en' | 'km' | 'th' | 'vi' | 'zh'
  name: string
  nativeName: string
  flagUrl: string
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flagUrl: 'https://flagcdn.com/w40/us.png' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flagUrl: 'https://flagcdn.com/w40/kh.png' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flagUrl: 'https://flagcdn.com/w40/th.png' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flagUrl: 'https://flagcdn.com/w40/vn.png' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flagUrl: 'https://flagcdn.com/w40/cn.png' },
]

const LanguageDropdown: React.FC = () => {
  const { language, setLanguage } = useThemeStore()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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

  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (code: typeof LANGUAGES[0]['code']) => {
    setLanguage(code)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted/50 border border-transparent hover:border-border/30 rounded-xl transition-all duration-200"
      >
        <img
          src={currentLang.flagUrl}
          alt={currentLang.name}
          className="w-5 h-3.5 object-cover rounded-sm shadow-sm border border-foreground/10 flex-shrink-0"
        />
        <span className="text-xs font-bold text-foreground hidden md:inline-block">
          {currentLang.nativeName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl z-50 p-1.5 backdrop-blur-md flex flex-col"
          >
            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('common.search_language', 'Search language...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl text-xs outline-none transition-all placeholder:text-muted-foreground"
              />
            </div>

            {/* List */}
            <div className="space-y-0.5 max-h-48 overflow-y-auto no-scrollbar">
              {filteredLanguages.length === 0 ? (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  {t('common.no_languages_found', 'No languages found')}
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = lang.code === language
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left
                        ${
                          isSelected
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={lang.flagUrl}
                          alt={lang.name}
                          className="w-5 h-3.5 object-cover rounded-sm shadow-sm border border-foreground/10 flex-shrink-0"
                        />
                        <span>{lang.nativeName}</span>
                        <span className="text-[10px] text-muted-foreground/60 font-medium">({lang.name})</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
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

export default LanguageDropdown

