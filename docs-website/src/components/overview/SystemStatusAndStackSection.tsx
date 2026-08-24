import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { TECH_STACK_DATA } from '../../data/systemStats';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Shield,
  Zap,
  Server,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';

export const SystemStatusAndStackSection: React.FC = () => {
  const { language } = useDocs();
  const [activeTab, setActiveTab] = useState<'stack' | 'folders' | 'security' | 'status'>('status');

  const subsystems = [
    { name: 'PostgreSQL Relational DB', nameKh: 'មូលដ្ឋានទិន្នន័យ PostgreSQL 18', status: 'implemented', notes: '99 tables, 36 migrations, foreign keys, row locks' },
    { name: 'Laravel REST API Hub', nameKh: 'ម៉ាស៊ីនកណ្តាល Laravel 12 REST API', status: 'implemented', notes: '759 endpoints across 74 controller domains' },
    { name: 'Admin Dashboard (React 19)', nameKh: 'ផ្ទាំងគ្រប់គ្រង Admin (React 19)', status: 'implemented', notes: '258 page components with Ant Design & TanStack Query' },
    { name: 'Customer Storefront (React 19)', nameKh: 'គេហទំព័រអតិថិជន (React 19)', status: 'implemented', notes: '28 storefront pages with persistent cart & search' },
    { name: 'Flutter Mobile Terminal', nameKh: 'កម្មវិធីទូរស័ព្ទដៃ (Flutter 3.24)', status: 'implemented', notes: '69 Dart files with offline Hive cache & camera scanner' },
    { name: 'Bakong KHQR Payment Gateway', nameKh: 'ការទូទាត់បាគង KHQR Dynamic', status: 'implemented', notes: 'Sub-second dynamic QR generation & webhook verification' },
    { name: 'Dynamic QR Attendance & GPS', nameKh: 'វត្តមានស្កេន Dynamic QR & GPS', status: 'implemented', notes: '15s rotating dynamic tokens with device UUID binding' },
    { name: 'Automated Cambodian Payroll', nameKh: 'ការគណនាប្រាក់ខែ & ពន្ធកម្ពុជា', status: 'implemented', notes: 'Progressive tax brackets, NSSF, OT, and DomPDF payslips' },
    { name: 'Spatie RBAC & Multi-Branch', nameKh: 'សិទ្ធិ Spatie RBAC & ញែកទិន្នន័យសាខា', status: 'implemented', notes: '169 permission nodes, 6 roles, tenant query scopes' },
    { name: 'Multi-Lingual Localization', nameKh: 'ប្រព័ន្ធ ៥ ភាសា (i18n)', status: 'implemented', notes: '100% localized in KM, EN, TH, VI, ZH' },
    { name: 'Docker Compose Production', nameKh: 'ការដាក់ដំណើរការតាម Docker Compose', status: 'implemented', notes: 'Multi-service orchestration: Nginx, PHP-FPM, PG18, Redis7' },
    { name: 'AI Product Recommendation Engine', nameKh: 'ប្រព័ន្ធ AI ណែនាំទំនិញ', status: 'planned', notes: 'Planned for v2.0.0 roadmap (Q4 2026)' },
  ];

  const folders = [
    { path: 'admin-dashboard/', role: 'Administrative Portal', tech: 'React 19 • Vite 8 • Ant Design • Tailwind', desc: 'Contains 258 management pages for POS, inventory, employees, and settings.' },
    { path: 'backend/', role: 'Central Business Engine', tech: 'Laravel 12 • PHP 8.2 • PostgreSQL 18 • Redis 7', desc: 'Encapsulates 759 REST APIs, 89 Eloquent models, Spatie RBAC, and services.' },
    { path: 'customer-website/', role: 'Omnichannel Storefront', tech: 'React 19 • Vite 8 • Tailwind CSS', desc: 'Contains 28 high-converting customer shopping pages and KHQR checkout.' },
    { path: 'mobile_app/', role: 'Native Mobile Terminal', tech: 'Flutter 3.24 • Dart 3.2 • Riverpod • Hive', desc: 'Cross-platform mobile POS, dynamic QR attendance, and offline sync.' },
    { path: 'docs-website/', role: 'Enterprise Knowledgebase', tech: 'React 19 • Vite 6 • Tailwind CSS', desc: 'Official system whitepaper, 759 API routes, 99 tables, and tutorials.' }
  ];

  const securityControls = [
    { title: 'Cryptographic JWT Authentication', desc: '15-minute access tokens paired with rotating database-hashed refresh tokens.' },
    { title: '169 Granular Spatie RBAC Nodes', desc: 'Strict role hierarchy (Super Admin, Manager, Cashier, Warehouse, Accountant, HR).' },
    { title: 'Multi-Branch Tenant Scoping', desc: 'Global Eloquent query scopes prevent horizontal cross-branch data leaks.' },
    { title: 'Row-Level Database Locking', desc: 'PostgreSQL `lockForUpdate` guarantees atomic non-negative stock deductions.' },
    { title: 'SQL Injection Prevention', desc: 'PDO prepared statements and strict parameter binding across all Eloquent queries.' },
    { title: 'Activity Log Compliance Auditing', desc: 'Spatie ActivityLog writes immutable logs for all transactional modifications.' }
  ];

  return (
    <section id="system-status-and-stack" className="mb-14 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">
            08
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Audit & Infrastructure
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'ស្ថានភាពប្រព័ន្ធ & ហេដ្ឋារចនាសម្ព័ន្ធ (System Status & Stack)' : 'System Status, Monorepo & Infrastructure'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl font-normal">
          {language === 'km'
            ? 'ពិនិត្យមើលស្ថានភាពជាក់ស្តែងនៃអនុប្រព័ន្ធទាំង ១១ រចនាសម្ព័ន្ធ Monorepo និងវិធានការសន្តិសុខដែលត្រូវបានផ្ទៀងផ្ទាត់'
            : 'Audit manifest of the 11 verified subsystems, folder structure, security controls, and containerized deployment topology.'}
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'status'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Subsystem Status Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('folders')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'folders'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Monorepo Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Performance Controls</span>
        </button>
      </div>

      {/* Tab 1: Subsystem Status Matrix */}
      {activeTab === 'status' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {language === 'km' ? 'តារាងស្ថានភាពអនុប្រព័ន្ធដែលបានផ្ទៀងផ្ទាត់ (Audit Scorecard)' : 'Verified Subsystem Audit Scorecard'}
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              11/12 Implemented
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {subsystems.map((sub, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {language === 'km' ? sub.nameKh : sub.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {sub.notes}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    sub.status === 'implemented'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                      : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30'
                  }`}
                >
                  {sub.status === 'implemented' ? '✅ Implemented' : '🔵 Planned Roadmap'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Monorepo Folders */}
      {activeTab === 'folders' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
            Monorepo Workspace Directory Map
          </h3>
          <div className="space-y-3">
            {folders.map((f, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-600 dark:text-brand-400 text-sm">
                      {f.path}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {f.role}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {f.desc}
                  </p>
                </div>
                <div className="font-mono text-[10px] text-slate-500 shrink-0">
                  {f.tech}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security Controls */}
      {activeTab === 'security' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
            Verified Security & Concurrency Controls
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {securityControls.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1 text-xs"
              >
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{sec.title}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed pl-5">
                  {sec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
