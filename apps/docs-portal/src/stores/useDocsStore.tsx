import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPerspective } from '../types/docs';
import { Language, TRANSLATIONS } from '../locales/translations';

interface DocsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  perspective: UserPerspective;
  setPerspective: (p: UserPerspective) => void;
  theme: 'dark' | 'light' | 'system';
  setTheme: (t: 'dark' | 'light' | 'system') => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  t: typeof TRANSLATIONS['km'];
}

const DocsContext = createContext<DocsContextType | null>(null);

export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('docs_lang') as Language) || 'km';
  });

  const [perspective, setPerspectiveState] = useState<UserPerspective>(() => {
    return (localStorage.getItem('docs_perspective') as UserPerspective) || 'all';
  });

  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('docs_theme') as 'dark' | 'light' | 'system') || 'dark';
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('docs_lang', lang);
  };

  const setPerspective = (p: UserPerspective) => {
    setPerspectiveState(p);
    localStorage.setItem('docs_perspective', p);
  };

  const setTheme = (t: 'dark' | 'light' | 'system') => {
    setThemeState(t);
    localStorage.setItem('docs_theme', t);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Global Keyboard Shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS.km;

  return (
    <DocsContext.Provider
      value={{
        language,
        setLanguage,
        perspective,
        setPerspective,
        theme,
        setTheme,
        searchOpen,
        setSearchOpen,
        searchQuery,
        setSearchQuery,
        t,
      }}
    >
      {children}
    </DocsContext.Provider>
  );
};

export const useDocs = () => {
  const context = useContext(DocsContext);
  if (!context) throw new Error('useDocs must be used within a DocsProvider');
  return context;
};
