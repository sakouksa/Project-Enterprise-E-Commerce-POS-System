import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { MonitorCheck, ShieldCheck, Code2, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export const QuickStartSection: React.FC = () => {
  const { t } = useDocs();

  const roleCards = [
    {
      id: 'business',
      icon: MonitorCheck,
      title: t.roleBusinessTitle,
      description: t.roleBusinessDesc,
      cta: t.roleBusinessCta,
      path: '/modules/pos',
      color: 'from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      badge: 'Cashier & Ops',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    },
    {
      id: 'admin',
      icon: ShieldCheck,
      title: t.roleAdminTitle,
      description: t.roleAdminDesc,
      cta: t.roleAdminCta,
      path: '/admin-guide',
      color: 'from-brand-500/10 via-brand-500/5 to-sky-500/10 border-brand-200 dark:border-brand-500/30 text-brand-600 dark:text-brand-400',
      badge: '258 Pages',
      badgeColor: 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-500/30',
    },
    {
      id: 'dev',
      icon: Code2,
      title: t.roleDevTitle,
      description: t.roleDevDesc,
      cta: t.roleDevCta,
      path: '/developer-guide',
      color: 'from-purple-500/10 via-purple-500/5 to-indigo-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
      badge: '759 APIs & Schema',
      badgeColor: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    },
    {
      id: 'student',
      icon: GraduationCap,
      title: t.roleStudentTitle,
      description: t.roleStudentDesc,
      cta: t.roleStudentCta,
      path: '/how-it-works',
      color: 'from-amber-500/10 via-amber-500/5 to-orange-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400',
      badge: 'Learning Path',
      badgeColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.quickStartBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {t.quickStartTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {t.quickStartSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              to={card.path}
              className={`p-6 rounded-3xl border bg-white dark:bg-slate-900/70 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between group shadow-xs backdrop-blur-xl ${card.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors leading-snug">
                  {card.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-normal">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {card.cta}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
