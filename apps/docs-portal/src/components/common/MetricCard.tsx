import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'brand',
  badge,
}) => {
  const colorStyles: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    brand: { 
      bg: 'bg-white dark:bg-slate-900/60', 
      border: 'border-slate-200 dark:border-brand-500/20 hover:border-brand-500/40', 
      text: 'text-brand-600 dark:text-brand-400', 
      iconBg: 'bg-brand-50 dark:bg-brand-500/10' 
    },
    emerald: { 
      bg: 'bg-white dark:bg-slate-900/60', 
      border: 'border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500/40', 
      text: 'text-emerald-600 dark:text-emerald-400', 
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10' 
    },
    purple: { 
      bg: 'bg-white dark:bg-slate-900/60', 
      border: 'border-slate-200 dark:border-purple-500/20 hover:border-purple-500/40', 
      text: 'text-purple-600 dark:text-purple-400', 
      iconBg: 'bg-purple-50 dark:bg-purple-500/10' 
    },
    amber: { 
      bg: 'bg-white dark:bg-slate-900/60', 
      border: 'border-slate-200 dark:border-amber-500/20 hover:border-amber-500/40', 
      text: 'text-amber-600 dark:text-amber-400', 
      iconBg: 'bg-amber-50 dark:bg-amber-500/10' 
    },
  };

  const current = colorStyles[color] || colorStyles.brand;

  return (
    <div className={`rounded-2xl border ${current.border} ${current.bg} p-5 transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md dark:shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${current.iconBg} flex items-center justify-center ${current.text} shadow-2xs`}>
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {badge}
          </span>
        )}
      </div>
      <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">{value}</div>
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-300 mt-1">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</div>}
    </div>
  );
};
