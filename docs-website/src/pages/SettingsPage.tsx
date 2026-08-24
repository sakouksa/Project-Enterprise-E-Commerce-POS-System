import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { Settings, Sliders, Globe, Lock, HardDrive, Key } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'settings-matrix', label: 'System Settings Hierarchy' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'System Settings & Config' }]} />

        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
            <Settings className="w-3.5 h-3.5" />
            <span>Multi-Tenant Dynamic Configuration</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'ការកំណត់ប្រព័ន្ធ និងសុវត្ថិភាព (Settings & Configurations)' : 'System Settings & Config Reference'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'ការកំណត់ទូទៅ រូបិយប័ណ្ណ អត្រាពន្ធ VAT ការតភ្ជាប់ម៉ាស៊ីនព្រីន POS ការកំណត់ Bakong KHQR និងការគ្រប់គ្រង Backup មូលដ្ឋានទិន្នន័យ។'
              : 'Multi-tenant runtime settings architecture stored in the database key-value store with cached Redis resolution.'}
          </p>
        </div>

        {/* Matrix */}
        <section id="settings-matrix" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {[
            { title: 'Company & Branding', icon: Globe, desc: 'Logo, Company name, Tax ID, Currency (USD / KHR exchange rate)' },
            { title: 'POS Hardware & Printing', icon: Sliders, desc: 'Receipt paper width (58mm/80mm), Cash drawer kick trigger' },
            { title: 'Bakong KHQR Gateway', icon: Key, desc: 'Bakong merchant ID, dynamic QR expiration time, secret key' },
            { title: 'Security & Dual-Token', icon: Lock, desc: 'Access token TTL (15m), Refresh token TTL (30d), Max login attempts' },
            { title: 'Storage & MinIO S3', icon: HardDrive, desc: 'S3 buckets, WebP compression ratio, Max upload file size limit' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs">
                <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
