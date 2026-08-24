import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { BookOpen, Shield, Code2, Radio, Database, Video, ArrowRight } from 'lucide-react';

export const DocCategoriesSection: React.FC = () => {
  const { t } = useDocs();

  const categories = [
    {
      title: t.navUserGuide,
      description: t.docUserGuideDesc,
      icon: BookOpen,
      path: '/modules/pos',
      count: '12 Guides',
      color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/30',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    },
    {
      title: t.navAdminGuide,
      description: t.docAdminGuideDesc,
      icon: Shield,
      path: '/admin-guide',
      count: '258 Pages',
      color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/30',
      badgeColor: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    },
    {
      title: t.navDevGuide,
      description: t.docDevGuideDesc,
      icon: Code2,
      path: '/developer-guide',
      count: 'Architecture & Ops',
      color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/30',
      badgeColor: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    },
    {
      title: t.navApi,
      description: t.docApiDesc,
      icon: Radio,
      path: '/api',
      count: '759 Endpoints',
      color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-500/30',
      badgeColor: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
    },
    {
      title: t.navDatabase,
      description: t.docDatabaseDesc,
      icon: Database,
      path: '/database',
      count: '99 Tables',
      color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/30',
      badgeColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    },
    {
      title: t.navTutorials,
      description: t.docTutorialsDesc,
      icon: Video,
      path: '/tutorials',
      count: '6 Video Lessons',
      color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-500/30',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
    },
  ];

  return (
    <section className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
            Documentation Hub
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {t.docCatTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {t.docCatSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Link
              key={idx}
              to={cat.path}
              className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/70 hover:border-brand-500/50 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all flex flex-col justify-between group shadow-2xs backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-2xl border ${cat.color} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                    {cat.count}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                  {cat.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5 font-normal">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                <span>{t.exploreSection}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
