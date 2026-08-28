import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { REAL_SYSTEM_STATS } from '../data/systemStats';
import { MetricCard } from '../components/common/MetricCard';
import { Database, Layers, Radio, ShieldCheck, ShoppingBag, Sparkles, CheckCircle2, BarChart2 } from 'lucide-react';

export const StatisticsPage: React.FC = () => {
  const { language } = useDocs();

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: 'System Statistics & Audit' }]} />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Real Inspect Scorecard</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'ស្ថិតិគម្រោងពិតប្រាកដ (Real System Scorecard)' : 'Real System Statistics & Codebase Audit'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {language === 'km'
            ? 'ស្ថិតិជាក់ស្តែងដែលបានរាប់ និងត្រួតពិនិត្យដោយផ្ទាល់ពីកូដនៃគម្រោង មិនមានទិន្នន័យក្លែងក្លាយឡើយ។'
            : 'Audited metric breakdown directly extracted from the codebase filesystem, migrations, route registers, and UI component trees.'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Database Tables"
          value={REAL_SYSTEM_STATS.databaseTablesCount}
          subtitle="36 Migrations"
          icon={Database}
          color="purple"
          badge="Postgres"
        />
        <MetricCard
          title="Eloquent Models"
          value={REAL_SYSTEM_STATS.eloquentModelsCount}
          subtitle="Domain Entity Layers"
          icon={Layers}
          color="brand"
          badge="PHP 8.2"
        />
        <MetricCard
          title="API Endpoints"
          value={REAL_SYSTEM_STATS.apiEndpointsCount}
          subtitle="74 Controller Domains"
          icon={Radio}
          color="emerald"
          badge="REST API"
        />
        <MetricCard
          title="Admin Pages"
          value={REAL_SYSTEM_STATS.adminPagesCount}
          subtitle="React 19 Components"
          icon={ShieldCheck}
          color="brand"
          badge="Vite 8"
        />
        <MetricCard
          title="Customer Pages"
          value={REAL_SYSTEM_STATS.customerPagesCount}
          subtitle="Storefront & Checkout"
          icon={ShoppingBag}
          color="emerald"
          badge="Tailwind"
        />
        <MetricCard
          title="Languages"
          value={REAL_SYSTEM_STATS.languagesCount}
          subtitle="KM, EN, TH, VI, ZH"
          icon={Sparkles}
          color="amber"
          badge="i18n"
        />
      </div>

      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Audit Verification Manifest</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 mb-1">Backend Architecture:</div>
            <div className="text-slate-900 dark:text-slate-100 font-bold">Laravel 12.x on PHP 8.2+</div>
            <div className="text-slate-600 dark:text-slate-400 mt-1">Spatie Permissions: 84 Granular nodes across 6 roles</div>
            <div className="text-slate-600 dark:text-slate-400">Total Migrations: 36 migration files executed</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 mb-1">Frontend Engineering:</div>
            <div className="text-slate-900 dark:text-slate-100 font-bold">React 19 + TypeScript + Vite 8.x</div>
            <div className="text-slate-600 dark:text-slate-400 mt-1">Admin Dashboard: 258 component files</div>
            <div className="text-slate-600 dark:text-slate-400">Mobile Terminal: Flutter 3.2+ with Hive local cache</div>
          </div>
        </div>
      </div>
    </div>
  );
};
