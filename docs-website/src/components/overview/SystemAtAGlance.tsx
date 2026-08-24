import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShoppingBag,
  Smartphone,
  Radio,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Layers,
  Cpu,
  Database,
  Lock,
  Zap,
  Globe,
  Terminal
} from 'lucide-react';

export const SystemAtAGlance: React.FC = () => {
  const { language } = useDocs();
  const [selectedApp, setSelectedApp] = useState<'admin' | 'store' | 'mobile' | 'backend'>('admin');

  const apps = [
    {
      id: 'admin' as const,
      name: 'Admin Dashboard',
      nameKh: 'ផ្ទាំងគ្រប់គ្រង Admin (React 19)',
      badge: 'Management Core',
      port: 'Port 5173',
      liveUrl: 'http://localhost:5173',
      guidePath: '/admin-guide',
      icon: Shield,
      color: 'border-blue-500/40 bg-blue-500/5 text-blue-600 dark:text-blue-400',
      pillColor: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
      tagline: 'Enterprise management interface with 258 pages for full operations.',
      taglineKh: 'ផ្ទាំងបញ្ជាប្រតិបត្តិការសហគ្រាស ២៥៨ ទំព័រ សម្រាប់គ្រប់គ្រងហាង ស្តុក បុគ្គលិក និងហិរញ្ញវត្ថុ។',
      targetUsers: ['Super Admin', 'Branch Manager', 'Accountant', 'HR Specialist', 'Cashier'],
      techStack: ['React 19', 'Vite 8', 'TypeScript', 'Ant Design 5', 'Tailwind CSS', 'TanStack Query', 'Zustand', 'i18next'],
      verifiedStats: '258 Verified Page Components • 169 Spatie RBAC Nodes • 48 Interactive Reports',
      keyModules: [
        'Multi-Branch POS Terminal',
        'Multi-Warehouse Inventory Ledger',
        'Procurement & Purchase Orders',
        'Dynamic QR Kiosk Attendance',
        'Automated Cambodian Tax & Payroll',
        'Spatie RBAC User & Role Matrix',
        '48 Reporting & Export Engines',
        'Multi-Disk S3/MinIO Media Manager'
      ]
    },
    {
      id: 'store' as const,
      name: 'Customer Storefront',
      nameKh: 'គេហទំព័រអតិថិជន (React 19)',
      badge: 'E-Commerce Store',
      port: 'Port 5174',
      liveUrl: 'http://localhost:5174',
      guidePath: '/customer-guide',
      icon: ShoppingBag,
      color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400',
      pillColor: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
      tagline: 'High-converting responsive storefront with instant search & Bakong KHQR checkout.',
      taglineKh: 'គេហទំព័រទិញទំនិញទំនើប រហ័សទាន់ចិត្ត កន្ត្រកទំនិញ និងទូទាត់បាគង KHQR ស្វ័យប្រវត្តិ។',
      targetUsers: ['Online Shoppers', 'B2B Wholesale Clients', 'Registered Customers'],
      techStack: ['React 19', 'Vite 8', 'Tailwind CSS', 'TanStack Query', 'Zustand Cart', 'React Helmet Async'],
      verifiedStats: '28 Audited Pages • Real-Time Stock Availability • Dynamic SEO Tags',
      keyModules: [
        'Interactive Product Catalog & Filtering',
        'Fuzzy Real-time Search Engine',
        'Persistent Shopping Cart & Wishlist',
        'Bakong KHQR Dynamic Payment Checkout',
        'Customer Profile & Order History Tracking',
        'Product Reviews & Rating Submissions',
        'Coupon & Promo Code Verification',
        'Multi-Language Storefront (5 Locales)'
      ]
    },
    {
      id: 'mobile' as const,
      name: 'Flutter Mobile Terminal',
      nameKh: 'កម្មវិធីទូរស័ព្ទដៃ (Flutter 3.24)',
      badge: 'Mobile & Offline POS',
      port: 'iOS / Android',
      liveUrl: '',
      guidePath: '/mobile-guide',
      icon: Smartphone,
      color: 'border-purple-500/40 bg-purple-500/5 text-purple-600 dark:text-purple-400',
      pillColor: 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
      tagline: 'Native staff terminal with offline Hive NoSQL sync & biometric authentication.',
      taglineKh: 'កម្មវិធីទូរស័ព្ទដៃដើរលើ iOS និង Android សម្រាប់ស្កេនវត្តមាន គិតលុយ និងស្តុកទំនិញ។',
      targetUsers: ['Cashiers', 'Field Sales Reps', 'Warehouse Staff', 'Employees'],
      techStack: ['Flutter 3.24', 'Dart 3.2', 'Riverpod', 'Hive NoSQL', 'Dio HTTP', 'Mobile Scanner', 'Local Auth'],
      verifiedStats: '69 Dart Files • Offline-First Resilient Architecture • Biometric Fingerprint/FaceID',
      keyModules: [
        'Mobile POS Barcode Scanner Checkout',
        'Dynamic QR Attendance Clock-In/Out',
        'GPS Geofencing Anti-Spoofing Check',
        'Offline NoSQL Product Cache & Sync',
        'Bluetooth/WiFi ESC/POS Thermal Printing',
        'Biometric Terminal Screen Unlocking',
        'Inter-Branch Stock Transfer Scanner',
        'Sales Performance Charts (FLChart)'
      ]
    },
    {
      id: 'backend' as const,
      name: 'Laravel REST Backend',
      nameKh: 'ម៉ាស៊ីនកណ្តាល Backend (Laravel 12)',
      badge: 'Central Business Engine',
      port: 'Port 8000',
      liveUrl: 'http://localhost:8000/api/documentation',
      guidePath: '/api',
      icon: Radio,
      color: 'border-brand-500/40 bg-brand-500/5 text-brand-600 dark:text-brand-400',
      pillColor: 'bg-brand-100 dark:bg-brand-500/20 text-brand-800 dark:text-brand-300 border-brand-200 dark:border-brand-500/30',
      tagline: 'High-speed REST API engine powering atomic transactions & multi-tenant isolation.',
      taglineKh: 'បេះដូងកណ្តាលនៃប្រព័ន្ធ គ្រប់គ្រង Business Logic, DB Transactions, 759 REST APIs និង PostgreSQL 18។',
      targetUsers: ['Backend Developers', 'System Integrators', 'DevOps Engineers'],
      techStack: ['Laravel 12', 'PHP 8.2+', 'PostgreSQL 18', 'Redis 7', 'Spatie RBAC', 'Sanctum/JWT', 'DomPDF'],
      verifiedStats: '759 REST API Endpoints • 74 Controllers • 99 PostgreSQL Tables • 89 Eloquent Models',
      keyModules: [
        'Atomic Row-Locking Checkout Engine',
        'Bakong KHQR Webhook & Polling Broker',
        'Spatie RBAC Multi-Branch Scoping',
        'Database Image Binary Storage Seeder',
        'Multi-Disk MediaLibrary (S3/MinIO/Local)',
        'Redis Queues & Background Workers',
        'DomPDF & Excel Streaming Reports',
        'Telescope Telemetry & Query Auditing'
      ]
    }
  ];

  const currentApp = apps.find((a) => a.id === selectedApp) || apps[0];
  const CurrentIcon = currentApp.icon;

  return (
    <section id="system-at-a-glance" className="mb-14 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-mono font-bold">
              01
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              System at a Glance
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'កម្មវិធីស្នូលទាំង ៤ នៃប្រព័ន្ធ (4 Core Applications)' : '4 Core Applications Overview'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl font-normal">
            {language === 'km'
              ? 'ជ្រើសរើសកម្មវិធីនីមួយៗដើម្បីស្វែងយល់ពីតួនាទី បច្ចេកវិទ្យា អ្នកប្រើប្រាស់ និងសមាសភាគសំខាន់ៗដែលត្រូវបានដំឡើងពិតប្រាកដ'
              : 'Click through the 4 client and backend applications to inspect their purpose, verified stack, users, and core modules.'}
          </p>
        </div>
      </div>

      {/* 4 App Selectors Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {apps.map((app) => {
          const Icon = app.icon;
          const isSelected = selectedApp === app.id;
          return (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              className={`p-4 sm:p-5 rounded-3xl border text-left transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'border-brand-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-brand-500/20'
                  : 'border-slate-200/90 dark:border-slate-800/90 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl border ${app.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${app.pillColor}`}>
                    {app.port}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                  {language === 'km' ? app.nameKh : app.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                  {language === 'km' ? app.taglineKh : app.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                <span>{language === 'km' ? 'ពិនិត្យលម្អិត' : 'Inspect Specs'}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected App Detailed Deep-Dive Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl backdrop-blur-xl space-y-6">
        {/* Header with quick links */}
        <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl border ${currentApp.color} flex items-center justify-center shrink-0`}>
              <CurrentIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'km' ? currentApp.nameKh : currentApp.name}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${currentApp.pillColor}`}>
                  {currentApp.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                {currentApp.verifiedStats}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={currentApp.guidePath}
              className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>{language === 'km' ? 'អានសៀវភៅណែនាំពេញលេញ' : 'Read Full Guide'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {currentApp.liveUrl && (
              <a
                href={currentApp.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl transition-all inline-flex items-center gap-1"
              >
                <span>Live</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* 3 Columns: Target Users, Tech Stack, Key Verified Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Col 1: Target Users */}
          <div className="space-y-3">
            <div className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-500" />
              <span>Target User Roles</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentApp.targetUsers.map((user, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {user}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-2">
              {language === 'km'
                ? 'សិទ្ធិប្រើប្រាស់ត្រូវបានការពារយ៉ាងតឹងរ៉ឹងដោយ Spatie RBAC និង Branch Scoping'
                : 'Access is strictly enforced via Spatie RBAC policies and branch data scoping.'}
            </p>
          </div>

          {/* Col 2: Verified Tech Stack */}
          <div className="space-y-3">
            <div className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              <span>Audited Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentApp.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Col 3: Key Modules */}
          <div className="space-y-3">
            <div className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              <span>Core Implemented Capabilities</span>
            </div>
            <div className="space-y-1.5">
              {currentApp.keyModules.map((mod, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{mod}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
