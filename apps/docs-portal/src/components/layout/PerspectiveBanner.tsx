import React from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { UserPerspective } from '../../types/docs';
import { Shield, ShoppingCart, Code, Building, Sparkles } from 'lucide-react';

export const PerspectiveBanner: React.FC = () => {
  const { perspective, setPerspective, t } = useDocs();

  const perspectives: { id: UserPerspective; label: string; icon: any }[] = [
    { id: 'all', label: t.allPerspectives, icon: Sparkles },
    { id: 'admin', label: t.perspectiveAdmin, icon: Shield },
    { id: 'cashier', label: t.perspectiveCashier, icon: ShoppingCart },
    { id: 'warehouse', label: t.perspectiveWarehouse, icon: Building },
    { id: 'developer', label: t.perspectiveDeveloper, icon: Code },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/90 border border-slate-200/80 dark:border-slate-800/80 flex-wrap transition-colors duration-200 shadow-2xs">
      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-2.5 pr-1.5 whitespace-nowrap">
        {t.perspectiveLabel}
      </span>
      <div className="flex items-center gap-1.5 flex-wrap flex-1">
        {perspectives.map((p) => {
          const Icon = p.icon;
          const isActive = perspective === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPerspective(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 font-bold border border-brand-500/40 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/50 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
