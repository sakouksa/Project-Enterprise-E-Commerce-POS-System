import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { Shield } from 'lucide-react';

export const AdminGuidePage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'admin-overview', label: 'Admin Dashboard Overview' },
    { id: 'navigation-structure', label: 'Sidebar Navigation Structure' },
    { id: 'action-lifecycle', label: 'What Happens When You Save/Delete' },
    { id: 'bulk-actions', label: 'Bulk Actions & Filtering' },
    { id: 'exports-audit', label: 'Data Exports & Audit Trail' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'Admin Guide' }]} />

        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Dashboard Manual</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'សៀវភៅណែនាំផ្ទាំងគ្រប់គ្រង Admin Dashboard (២៥៨ ទំព័រ)' : 'Admin Dashboard User Manual (258 Pages)'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'មគ្គុទ្ទេសក៍ប្រតិបត្តិការពេញលេញសម្រាប់ Super Admin, Branch Manager និងបុគ្គលិកគ្រប់គ្រងទូទៅ។ ពន្យល់ពីគ្រប់ប៊ូតុង គ្រប់ Field និងលទ្ធផលក្រោយពេលចុច Save/Approve/Delete។'
              : 'Complete operational manual covering every administrative section, form field, action button, and audit consequence across the 258 React dashboard components.'}
          </p>
        </div>

        {/* 1. Admin Overview */}
        <section id="admin-overview" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-mono font-bold">01</span>
            <span>{language === 'km' ? 'រចនាសម្ព័ន្ធផ្ទាំងគ្រប់គ្រង Admin' : 'Admin Dashboard Architecture'}</span>
          </h2>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 shadow-2xs">
            <p>
              ផ្ទាំង Admin Dashboard ត្រូវបានបង្កើតឡើងដោយ <strong>React 19 + TypeScript + Ant Design + Tailwind CSS</strong> មានលក្ខណៈពិសេស៖
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-slate-600 dark:text-slate-400">
              <li><strong>Optimistic Updates:</strong> ប្រើ TanStack Query v5 ធ្វើឱ្យ UI ឆ្លើយតបភ្លាមៗដោយមិនបាច់រង់ចាំ Network។</li>
              <li><strong>Multi-Branch Scoping:</strong> Admin អាចប្តូរសាខាបានភ្លាមៗពី Top Header។</li>
              <li><strong>Spatie RBAC Guard:</strong> ប៊ូតុង និងម៉ឺនុយណាដែលគណនីគ្មានសិទ្ធិ នឹងត្រូវលាក់ដោយស្វ័យប្រវត្តិ។</li>
            </ul>
          </div>
        </section>

        {/* 2. Action Lifecycle */}
        <section id="action-lifecycle" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">02</span>
            <span>{language === 'km' ? 'តើមានអ្វីកើតឡើងនៅពេលចុច Save / Delete / Approve?' : 'Action Execution Lifecycles'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-2xs">
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">When You Click "Save"</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Frontend validates with Zod &rarr; Sends POST/PUT API &rarr; Laravel FormRequest validates &rarr; Eloquent persists record &rarr; Spatie ActivityLog writes audit entry &rarr; UI shows green success notification.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-2xs">
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-2">When You Click "Approve"</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Permission check (`purchase.approve` / `payroll.approve`) &rarr; Status flag changes &rarr; DB Transaction executes side-effects (e.g. stock increment) &rarr; Async Notification fired to branch team.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-2xs">
              <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2">When You Click "Delete"</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Confirmation Modal pops up &rarr; SoftDeletes trait sets `deleted_at` timestamp &rarr; Record disappears from active view and is safely moved to <strong>Recycle Bin</strong> for restoration.
              </p>
            </div>
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
