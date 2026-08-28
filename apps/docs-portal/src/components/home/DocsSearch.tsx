import React from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { Search, Command, BookOpen, Layers, Radio, Database, Video, HelpCircle, AlertTriangle } from 'lucide-react';

export const DocsSearch: React.FC = () => {
  const { t, setSearchOpen, setSearchQuery } = useDocs();

  const searchPills = [
    { label: 'Documentation', icon: BookOpen, query: 'guide' },
    { label: 'Modules (32)', icon: Layers, query: 'module' },
    { label: '759 APIs', icon: Radio, query: 'api' },
    { label: '99 Database Tables', icon: Database, query: 'database' },
    { label: 'Tutorials', icon: Video, query: 'tutorial' },
    { label: 'Troubleshooting', icon: AlertTriangle, query: 'error' },
  ];

  const handlePillClick = (query: string) => {
    setSearchQuery(query);
    setSearchOpen(true);
  };

  return (
    <section className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 p-5 sm:p-6 shadow-sm dark:shadow-xl backdrop-blur-md transition-colors duration-200">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Large Interactive Search Bar Button */}
        <button
          onClick={() => {
            setSearchQuery('');
            setSearchOpen(true);
          }}
          className="flex-1 flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-left hover:border-brand-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors shrink-0" />
            <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400 truncate">
              {t.searchBarPlaceholder}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 shadow-2xs shrink-0">
            <Command className="w-3.5 h-3.5" />
            <span>K</span>
          </div>
        </button>

        {/* Quick Search Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {searchPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <button
                key={pill.label}
                onClick={() => handlePillClick(pill.query)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/40 hover:bg-white dark:hover:bg-slate-800 transition-all whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
