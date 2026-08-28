import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { REAL_SYSTEM_STATS } from '../../data/systemStats';
import { Database, Layers, Radio, ShieldCheck, ShoppingBag, Sparkles, CheckCircle2, ArrowRight, Shield } from 'lucide-react';

export const ProjectStats: React.FC = () => {
  const { t, language } = useDocs();

  const stats = [
    {
      title: t.metricDbTables,
      value: REAL_SYSTEM_STATS.databaseTablesCount,
      sub: language === 'km' ? '36 Migrations ពិត' : '36 Verified Migrations',
      tech: 'PostgreSQL 18',
      icon: Database,
      color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/30',
      badgeColor: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    },
    {
      title: t.metricModels,
      value: REAL_SYSTEM_STATS.eloquentModelsCount,
      sub: language === 'km' ? 'ស្រទាប់ Domain Entities' : 'Domain Entity Layer',
      tech: 'PHP 8.2 Engine',
      icon: Layers,
      color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/30',
      badgeColor: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    },
    {
      title: t.metricApis,
      value: REAL_SYSTEM_STATS.apiEndpointsCount,
      sub: language === 'km' ? '74 Controller Domains' : '74 Controller Domains',
      tech: 'REST JSON',
      icon: Radio,
      color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/30',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    },
    {
      title: t.metricAdminPages,
      value: REAL_SYSTEM_STATS.adminPagesCount,
      sub: language === 'km' ? 'React 19 Components' : 'React 19 Components',
      tech: 'Admin Portal',
      icon: ShieldCheck,
      color: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200/80 dark:border-sky-500/30',
      badgeColor: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30',
    },
    {
      title: t.metricCustomerPages,
      value: REAL_SYSTEM_STATS.customerPagesCount,
      sub: language === 'km' ? 'Storefront & Checkout' : 'Store & Checkout',
      tech: 'Customer Store',
      icon: ShoppingBag,
      color: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200/80 dark:border-teal-500/30',
      badgeColor: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/30',
    },
    {
      title: t.metricLanguages,
      value: REAL_SYSTEM_STATS.languagesCount,
      sub: 'KM, EN, TH, VI, ZH',
      tech: 'i18n Locales',
      icon: Sparkles,
      color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/30',
      badgeColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 p-5 sm:p-7 md:p-8 backdrop-blur-xl shadow-sm dark:shadow-xl transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-mono">
              {language === 'km' ? 'ផ្ទៀងផ្ទាត់លើកូដពិត (Audited Codebase)' : 'Audited Codebase Metrics'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {t.statsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'km'
              ? 'ទិន្នន័យស្ថិតិទាំងអស់ត្រូវបានដកស្រង់ចេញពីកូដប្រភពផ្ទាល់ គ្មានទិន្នន័យក្លែងក្លាយឡើយ'
              : 'All metrics are directly extracted from actual source code files with zero simulated mock data.'}
          </p>
        </div>

        <Link
          to="/stats"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors shrink-0 shadow-2xs"
        >
          <span>{t.statsViewScorecard}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 6 Metric Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 hover:border-brand-500/40 hover:bg-white dark:hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-xl border ${stat.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${stat.badgeColor}`}>
                    {stat.tech}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight mb-1">
                  {stat.value}
                </div>

                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight mb-1">
                  {stat.title}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60 truncate">
                {stat.sub}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
