import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Menu, ExternalLink, Shield, ShoppingBag, Layers, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useDocs } from '../../stores/useDocsStore';
import { Language } from '../../locales/translations';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { language, setLanguage, setSearchOpen, t } = useDocs();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; nativeName: string; flag: string }[] = [
    { code: 'km', label: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭' },
    { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'th', label: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', label: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', label: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors duration-200">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 max-w-7xl mx-auto gap-2 sm:gap-4">
        {/* Left: Mobile Drawer Trigger & Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-brand-500/20 via-brand-600/10 to-emerald-500/20 border border-brand-500/30 dark:border-brand-500/40 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm group-hover:scale-105 group-hover:shadow-md group-hover:shadow-brand-500/20 transition-all duration-200">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap">
                  {t.siteTitle.split('&')[0]}
                  <span className="text-brand-600 dark:text-brand-400 font-extrabold">
                    {t.siteTitle.includes('&') ? `& ${t.siteTitle.split('&')[1]}` : ''}
                  </span>
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t.headerLiveBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-[280px] lg:max-w-md font-normal leading-tight">
                {t.siteSubtitle}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search Button (Cmd+K) */}
        <div className="flex-1 max-w-sm lg:max-w-md hidden md:block">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200 transition-all text-xs shadow-2xs group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">{t.searchPlaceholder}</span>
            </div>
            <kbd className="font-mono text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-2xs shrink-0 ml-2">
              {t.searchShortcut}
            </kbd>
          </button>
        </div>

        {/* Right: Actions (Language, Theme, External Portals) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Clean 5-Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                langMenuOpen
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-2xs'
              }`}
              aria-label="Select language"
              aria-expanded={langMenuOpen}
            >
              <span className="text-sm leading-none">{currentLang.flag}</span>
              <span className="font-bold text-[11px] uppercase tracking-wider">{currentLang.code}</span>
              <span className="hidden lg:inline text-slate-500 dark:text-slate-400 font-normal">
                ({currentLang.nativeName})
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                  {t.languageSelect}
                </div>
                {languages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all ${
                        isSelected
                          ? 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{lang.flag}</span>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{lang.nativeName}</div>
                          <div className="text-[10px] text-slate-400">{lang.label} ({lang.code.toUpperCase()})</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Standard Theme Switcher */}
          <ThemeSwitcher />

          {/* Live App Portals Shortcuts */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            {/* Admin Dashboard link */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              title="Open Live React 19 Admin Dashboard (Port 5173)"
            >
              <div className="relative flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="hidden md:inline">{t.headerAdminBtn}</span>
              <span className="md:hidden">Admin</span>
              <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
            </a>

            {/* Customer Website link */}
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              title="Open Live React 19 Customer Storefront (Port 5174)"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="hidden md:inline">{t.headerStoreBtn}</span>
              <span className="md:hidden">Store</span>
              <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
