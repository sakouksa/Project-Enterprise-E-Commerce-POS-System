import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Layers, Database, Radio, AlertTriangle, BookOpen, ChevronRight } from 'lucide-react';
import { useDocs } from '../../stores/useDocsStore';
import { ENTERPRISE_MODULES } from '../../data/modulesData';
import { API_ROUTES } from '../../data/apiRoutesData';
import { DATABASE_TABLES } from '../../data/databaseSchemaData';
import { TROUBLESHOOTING_ITEMS } from '../../data/troubleshootingData';
import { TUTORIAL_VIDEOS } from '../../data/tutorialsData';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useDebounce } from '../../hooks/useDebounce';

export const CommandPalette: React.FC = () => {
  const { searchOpen, setSearchOpen, language, t } = useDocs();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 150);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Global keyboard shortcuts
  useKeyPress('k', (e) => {
    e.preventDefault();
    setSearchOpen(!searchOpen);
  }, { meta: true });

  useKeyPress('Escape', () => {
    if (searchOpen) setSearchOpen(false);
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [
        { type: 'Page', title: 'Executive Overview', subtitle: 'ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ', path: '/overview', icon: BookOpen },
        { type: 'Page', title: 'System Architecture', subtitle: 'ស្ថាបត្យកម្មប្រព័ន្ធ ៦ ស្រទាប់', path: '/architecture', icon: Layers },
        { type: 'Page', title: 'High-Speed POS Terminal', subtitle: 'ប្រព័ន្ធគិតលុយរហ័ស POS', path: '/modules/pos', icon: Layers },
        { type: 'Page', title: 'Interactive ER Diagram', subtitle: 'ដ្យាក្រាម ERD ៩៩ តារាង', path: '/database/er-diagram', icon: Database },
        { type: 'Page', title: '759 API Explorer', subtitle: 'ឯកសារ API 759 Endpoints', path: '/api', icon: Radio },
      ];
    }

    const q = debouncedQuery.toLowerCase();
    const results: Array<{ type: string; title: string; subtitle?: string; path: string; icon: any }> = [];

    // 1. Search Modules
    ENTERPRISE_MODULES.forEach(m => {
      if (m.name.toLowerCase().includes(q) || m.nameKh.includes(q) || m.id.includes(q)) {
        results.push({
          type: 'Module',
          title: language === 'km' ? m.nameKh : m.name,
          subtitle: `Module: ${m.id} (${m.category})`,
          path: `/modules/${m.id}`,
          icon: Layers
        });
      }
    });

    // 2. Search API Routes
    API_ROUTES.slice(0, 150).forEach(api => {
      if (api.path.toLowerCase().includes(q) || api.controller.toLowerCase().includes(q) || api.summary.toLowerCase().includes(q)) {
        results.push({
          type: 'API Endpoint',
          title: `${api.method} ${api.path}`,
          subtitle: `${api.controller}@${api.action}`,
          path: `/api?search=${encodeURIComponent(api.path)}`,
          icon: Radio
        });
      }
    });

    // 3. Search Database Tables
    DATABASE_TABLES.forEach(db => {
      if (db.name.toLowerCase().includes(q) || db.model.toLowerCase().includes(q)) {
        results.push({
          type: 'Database Table',
          title: db.name,
          subtitle: `Model: ${db.model} (${db.category})`,
          path: `/database?table=${db.name}`,
          icon: Database
        });
      }
    });

    // 4. Search Troubleshooting
    TROUBLESHOOTING_ITEMS.forEach(err => {
      if (err.code.toLowerCase().includes(q) || err.title.toLowerCase().includes(q) || err.titleKh.includes(q)) {
        results.push({
          type: 'Error Code',
          title: err.code,
          subtitle: language === 'km' ? err.titleKh : err.title,
          path: `/troubleshooting?id=${err.id}`,
          icon: AlertTriangle
        });
      }
    });

    // 5. Search Tutorials
    TUTORIAL_VIDEOS.forEach(tut => {
      if (tut.title.toLowerCase().includes(q) || tut.titleKh.includes(q)) {
        results.push({
          type: 'Tutorial',
          title: language === 'km' ? tut.titleKh : tut.title,
          subtitle: `${tut.category} - ${tut.duration}`,
          path: `/tutorials?id=${tut.id}`,
          icon: BookOpen
        });
      }
    });

    return results.slice(0, 20);
  }, [debouncedQuery, language]);

  const handleSelect = (path: string) => {
    setSearchOpen(false);
    navigate(path);
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <Search className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm md:text-base focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              {language === 'km' ? 'មិនមានលទ្ធផលផ្គូផ្គងនឹងពាក្យស្វែងរកនេះទេ' : 'No matching results found'}
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-brand-500/10 dark:bg-brand-600/20 text-brand-700 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">{item.title}</div>
                      {item.subtitle && <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item.type}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-xs">↑</kbd> <kbd className="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-xs">↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded shadow-xs">↵</kbd> Select</span>
          </div>
          <span className="font-medium text-slate-600 dark:text-slate-400">Enterprise Real System Index</span>
        </div>
      </div>
    </div>
  );
};
