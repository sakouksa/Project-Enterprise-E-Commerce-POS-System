import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { TECH_STACK_DATA } from '../../data/systemStats';
import { Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TechStackSection: React.FC = () => {
  const { t } = useDocs();
  const [selectedCat, setSelectedCat] = useState<keyof typeof TECH_STACK_DATA | 'all'>('all');

  const categories: { id: keyof typeof TECH_STACK_DATA | 'all'; label: string }[] = [
    { id: 'all', label: 'All Technologies' },
    { id: 'backend', label: 'Backend Engine (Laravel 12)' },
    { id: 'adminDashboard', label: 'Admin Dashboard (React 19)' },
    { id: 'customerWebsite', label: 'Customer Store (React 19)' },
    { id: 'mobileApp', label: 'Mobile App (Flutter 3.24)' },
    { id: 'infraDatabase', label: 'Database & Infra' },
  ];

  const items = selectedCat === 'all'
    ? [
        ...TECH_STACK_DATA.backend,
        ...TECH_STACK_DATA.adminDashboard,
        ...TECH_STACK_DATA.customerWebsite,
        ...TECH_STACK_DATA.mobileApp,
        ...TECH_STACK_DATA.infraDatabase,
      ]
    : TECH_STACK_DATA[selectedCat];

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-md dark:shadow-2xl transition-colors duration-200">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
            Audited & Verified
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {t.techStackTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            {t.techStackSubtitle}
          </p>
        </div>

        <Link
          to="/tech-stack"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        >
          <span>Complete Tech Stack</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCat === cat.id
                ? 'bg-brand-600 text-white shadow-sm font-bold'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Verified Techs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 hover:border-brand-500/50 transition-all flex items-start gap-3 group shadow-2xs"
          >
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0 group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{item.name}</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/20">
                  {item.version}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2">
                {item.purpose}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
