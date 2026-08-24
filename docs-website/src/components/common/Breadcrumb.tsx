import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />
            {item.path && !isLast ? (
              <Link to={item.path} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 dark:text-slate-200 font-semibold truncate">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
