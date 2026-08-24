import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { NAV_SECTIONS } from '../../config/navConfig';

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onLinkClick }) => {
  const { t } = useDocs();
  const location = useLocation();

  return (
    <aside className={`w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto p-4 transition-colors duration-200 ${className}`}>
      <div className="space-y-6">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-3 mb-2 font-mono">
              {t[section.titleKey]}
            </div>
            <div className="space-y-1">
              {section.links.map((link, lIdx) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <NavLink
                    key={lIdx}
                    to={link.path}
                    onClick={onLinkClick}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-bold border border-brand-500/30 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
                      <span className="truncate">{t[link.labelKey] || link.path}</span>
                    </div>

                    {link.badge && (
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive 
                          ? 'bg-brand-500/20 text-brand-800 dark:text-brand-200' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
