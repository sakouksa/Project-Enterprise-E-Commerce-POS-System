import React from 'react';
import { AlignLeft, ArrowUp } from 'lucide-react';
import { useDocs } from '../../stores/useDocsStore';

export interface TocItem {
  id: string;
  label: string;
  level?: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const { language } = useDocs();

  if (!items || items.length === 0) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-64 shrink-0 hidden xl:block sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto pl-6 border-l border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-4 font-mono">
        <AlignLeft className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
        <span>{language === 'km' ? 'មាតិកាលើទំព័រនេះ' : 'On This Page'}</span>
      </div>

      <nav className="space-y-2 text-xs">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors py-1 truncate ${
              item.level === 2 ? 'pl-3 text-[11px] text-slate-500' : 'font-medium'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>{language === 'km' ? 'ត្រឡប់ទៅខាងលើ' : 'Back to Top'}</span>
        </button>
      </div>
    </div>
  );
};
