import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Info, Award, Heart, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language } = useDocs();

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: 'About the System' }]} />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
          <Info className="w-3.5 h-3.5" />
          <span>System Information & Heritage</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'អំពីគម្រោងសហគ្រាស E-Commerce + POS' : 'About the Enterprise E-Commerce + POS System'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {language === 'km'
            ? 'គម្រោងនេះត្រូវបានរចនា និងសាងសង់ឡើងដើម្បីដោះស្រាយបញ្ហាជាក់ស្តែងនៃអាជីវកម្មលក់រាយ និងលក់ដុំក្នុងយុគសម័យឌីជីថល។'
            : 'Engineered from first principles to provide a single, unified, high-performance retail and wholesale backbone.'}
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Enterprise Omnichannel Standards</h2>
            <p className="text-xs text-slate-500">Engineered with Clean Architecture & Domain-Driven Design</p>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          The <strong>Project-Enterprise-E-Commerce-POS-System</strong> delivers an unmatched omnichannel retail experience. By combining real-time database locks, automated Bakong KHQR dynamic settlement, multi-warehouse FIFO valuation, and offline-capable mobile terminals, enterprises can run multiple physical branches and online channels with zero stock desynchronization.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase font-mono mb-1">Architecture</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Decoupled Monorepo</div>
            <div className="text-xs text-slate-500 mt-0.5">React + Flutter + Laravel</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono mb-1">Security</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">JWT & Spatie RBAC</div>
            <div className="text-xs text-slate-500 mt-0.5">84 Granular Nodes</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase font-mono mb-1">Data Model</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">PostgreSQL Relational</div>
            <div className="text-xs text-slate-500 mt-0.5">99 Tables & Redis Cache</div>
          </div>
        </div>
      </div>
    </div>
  );
};
