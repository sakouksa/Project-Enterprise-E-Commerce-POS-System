import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { GitCommit, Sparkles, CheckCircle2 } from 'lucide-react';

export const ChangelogPage: React.FC = () => {
  const { language } = useDocs();

  const releases = [
    {
      version: 'v1.1.0',
      date: 'August 2026',
      badge: 'Current Release',
      changes: [
        'Added full Light & Dark mode support across all portals with persistent Zustand theme store and system-preference auto-detection.',
        'Integrated dynamic Bakong KHQR EMVCo payment webhook with sub-second polling verification.',
        'Added Flutter 3.2 mobile terminal with offline Hive NoSQL storage and biometric local authentication.',
        'Added dynamic rotating QR code attendance with geofencing GPS verification radius.'
      ]
    },
    {
      version: 'v1.0.0',
      date: 'July 2026',
      badge: 'Initial Production',
      changes: [
        'Core monorepo release unifying React 19 Admin Dashboard, Customer Storefront, and Laravel 12 REST API.',
        'Audited 99 PostgreSQL relational tables with Spatie RBAC 84-node permission matrix.',
        'Built 48 reporting engines with live Excel and DomPDF streaming exports.',
        'Full localization across 5 languages: Khmer, English, Thai, Vietnamese, and Chinese.'
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: 'System Changelog' }]} />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
          <GitCommit className="w-3.5 h-3.5" />
          <span>Release History & Upgrades</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'ប្រវត្តិនៃការអភិវឌ្ឍ និងកំណែប្រែ (Changelog)' : 'Release Notes & System Changelog'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {language === 'km'
            ? 'កត់ត្រារាល់ការកែលម្អ មុខងារថ្មីៗ និងការជួសជុលកំហុសក្នុងកំណែនីមួយៗនៃប្រព័ន្ធ។'
            : 'Detailed log of architectural updates, feature additions, and security improvements.'}
        </p>
      </div>

      <div className="space-y-6">
        {releases.map((rel, idx) => (
          <div key={idx} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">{rel.version}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  {rel.badge}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">{rel.date}</span>
            </div>

            <ul className="space-y-2 text-xs md:text-sm text-slate-700 dark:text-slate-300">
              {rel.changes.map((c, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
