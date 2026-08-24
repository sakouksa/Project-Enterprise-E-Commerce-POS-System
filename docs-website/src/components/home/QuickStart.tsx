import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { UserCheck, ShieldCheck, Code2, GraduationCap, ArrowRight } from 'lucide-react';

export const QuickStart: React.FC = () => {
  const { t } = useDocs();

  const roleCards = [
    {
      title: t.roleBusinessTitle,
      desc: t.roleBusinessDesc,
      cta: t.roleBusinessCta,
      path: '/user-guide',
      icon: UserCheck,
      color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/20',
      badge: t.badgeStepByStep,
    },
    {
      title: t.roleAdminTitle,
      desc: t.roleAdminDesc,
      cta: t.roleAdminCta,
      path: '/admin-guide',
      icon: ShieldCheck,
      color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20',
      badge: t.badgeAdminOps,
    },
    {
      title: t.roleDevTitle,
      desc: t.roleDevDesc,
      cta: t.roleDevCta,
      path: '/developer-guide',
      icon: Code2,
      color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/20',
      badge: t.badgeApisSchemas,
    },
    {
      title: t.roleStudentTitle,
      desc: t.roleStudentDesc,
      cta: t.roleStudentCta,
      path: '/overview',
      icon: GraduationCap,
      color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/20',
      badge: t.badgeArchWalkthrough,
    },
  ];

  return (
    <section className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
            {t.quickStartBadge}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {t.quickStartTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {t.quickStartSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.path}
              className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 hover:border-brand-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-2xl border ${card.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                <span>{card.cta}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
