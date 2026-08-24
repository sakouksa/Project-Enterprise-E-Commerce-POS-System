import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../common/Breadcrumb';
import { TableOfContents } from '../layout/TableOfContents';
import { REAL_SYSTEM_STATS } from '../../data/systemStats';
import {
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Cpu,
  Layers,
  Database,
  Radio,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Lock,
  QrCode,
  Sparkles,
  DollarSign,
  Package,
  Users,
  ChevronDown,
  Building,
  Server,
  Zap,
  Code2
} from 'lucide-react';

export const CleanSimpleOverview: React.FC = () => {
  const { language, t } = useDocs();
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-01');

  const tocItems = [
    { id: 'four-platforms', label: language === 'km' ? '១. កម្មវិធីស្នូលទាំង ៤' : '1. 4 Core Applications' },
    { id: 'system-architecture', label: language === 'km' ? '២. ស្ថាបត្យកម្ម ៦ ស្រទាប់' : '2. 6-Tier Architecture' },
    { id: 'business-highlights', label: language === 'km' ? '៣. ដំណើរការអាជីវកម្មស្នូល' : '3. Business Highlights' },
    { id: 'security-rbac', label: language === 'km' ? '៤. សន្តិសុខ & ការបែងចែកសិទ្ធិ' : '4. Security & RBAC' },
    { id: 'core-faqs', label: language === 'km' ? '៥. សំណួរ-ចម្លើយសំខាន់ៗ' : '5. Essential FAQs' },
    { id: 'related-portals', label: language === 'km' ? '៦. ឯកសារបច្ចេកទេសពាក់ព័ន្ធ' : '6. Related Portals' },
  ];

  const platforms = [
    {
      id: 'admin',
      name: 'Admin Dashboard',
      nameKh: 'ផ្ទាំងគ្រប់គ្រង Admin (React 19)',
      tech: 'React 19 • Vite 8 • Ant Design 5',
      badge: 'Port 5173',
      icon: ShieldCheck,
      path: '/admin-guide',
      liveUrl: 'http://localhost:5173',
      color: 'from-blue-500 to-indigo-600',
      descKh: 'ផ្ទាំងគ្រប់គ្រងធុរកិច្ច ២៥៨ ទំព័រ សម្រាប់ចាត់ចែងការលក់ POS ស្តុកឃ្លាំង បុគ្គលិក និងហិរញ្ញវត្ថុ។',
      descEn: '258-page administrative hub for managing sales, multi-branch warehouses, employees, and financial reports.'
    },
    {
      id: 'store',
      name: 'Customer Storefront',
      nameKh: 'គេហទំព័រអតិថិជន (React 19)',
      tech: 'React 19 • Tailwind CSS • Zustand',
      badge: 'Port 5174',
      icon: ShoppingBag,
      path: '/customer-guide',
      liveUrl: 'http://localhost:5174',
      color: 'from-emerald-500 to-teal-600',
      descKh: 'គេហទំព័រទិញទំនិញអនឡាញ ២៨ ទំព័រ កន្ត្រកទំនិញ និងទូទាត់ប្រាក់បាគង KHQR ស្វ័យប្រវត្តិ។',
      descEn: '28-page high-converting online storefront with real-time search, persistent cart, and Bakong KHQR.'
    },
    {
      id: 'mobile',
      name: 'Mobile POS & Terminal',
      nameKh: 'កម្មវិធីទូរស័ព្ទដៃ (Flutter 3.24)',
      tech: 'Flutter 3.24 • Riverpod • Hive NoSQL',
      badge: 'iOS / Android',
      icon: Smartphone,
      path: '/mobile-guide',
      color: 'from-purple-500 to-violet-600',
      descKh: 'កម្មវិធីទូរស័ព្ទសម្រាប់គិតលុយពេលដាច់ Internet និងស្កេនវត្តមាន Dynamic QR ជាមួយ GPS។',
      descEn: 'Cross-platform mobile app for offline-first sales scanning and anti-fraud dynamic QR attendance.'
    },
    {
      id: 'backend',
      name: 'Central Backend Hub',
      nameKh: 'ម៉ាស៊ីនកណ្តាល Backend (Laravel 12)',
      tech: 'Laravel 12 • PostgreSQL 18 • Redis 7',
      badge: 'Port 8000',
      icon: Cpu,
      path: '/api',
      liveUrl: 'http://localhost:8000/api/documentation',
      color: 'from-rose-500 to-brand-600',
      descKh: 'ម៉ាស៊ីនកណ្តាលផ្តល់ 759 REST APIs, 89 Models, គ្រប់គ្រងសិទ្ធិ Spatie RBAC និងចាក់សោរស្តុក។',
      descEn: 'Central engine providing 759 REST endpoints, 89 Eloquent models, Spatie RBAC, and database row-locking.'
    }
  ];

  const architectureLayers = [
    {
      num: '01',
      nameKh: 'ស្រទាប់បង្ហាញ UI (Presentation Layer)',
      nameEn: '1. Presentation Layer (UI & Clients)',
      tech: 'React 19 (Admin & Store) • Flutter 3.24 (Mobile)',
      descKh: 'ចំណុចប្រទាក់អ្នកប្រើប្រាស់ responsive ដំណើរការលឿន ជាមួយ TanStack Query និង Ant Design 5។'
    },
    {
      num: '02',
      nameKh: 'ស្រទាប់ច្រកទ្វារ & រ៉ោត (API Gateway & Routing)',
      nameEn: '2. API Gateway & Middleware Layer',
      tech: 'Laravel 12 REST API Router • CORS • Rate Limiting',
      descKh: 'គ្រប់គ្រងរាល់ Request ពី Client ពិនិត្យសុពលភាពទិន្នន័យ (FormRequest) និងកំណត់ល្បឿន Traffic។'
    },
    {
      num: '03',
      nameKh: 'ស្រទាប់សន្តិសុខ & សិទ្ធិ (Auth & Security Layer)',
      nameEn: '3. Authentication & RBAC Layer',
      tech: 'Laravel Sanctum JWT • Spatie Permissions • GPS Geofence',
      descKh: 'ផ្ទៀងផ្ទាត់ Token JWT (15 នាទី), សិទ្ធិបុគ្គលិក ១៦៩ កម្រិត និងកូដវត្តមាន Dynamic QR (15 វិនាទី)។'
    },
    {
      num: '04',
      nameKh: 'ស្រទាប់តក្កវិជ្ជាអាជីវកម្ម (Business Logic & Services)',
      nameEn: '4. Business Services Layer',
      tech: 'POSService • InventoryService • BakongService • PayrollService',
      descKh: 'អនុវត្តច្បាប់អាជីវកម្ម គណនាថ្លៃដើម Moving Average, ពន្ធកម្ពុជា និងការកាត់ស្តុកដោយសុវត្ថិភាព។'
    },
    {
      num: '05',
      nameKh: 'ស្រទាប់ទិន្នន័យ & ឃ្លាំងសម្ងាត់ (Database & Cache)',
      nameEn: '5. Persistence & Cache Layer',
      tech: 'PostgreSQL 18 (99 Tables) • Redis 7 (Cache & Queue)',
      descKh: 'រក្សាទុកទិន្នន័យស្នូលតែមួយ (Single Source of Truth) ជាមួយ Row-Level Locking (`lockForUpdate`)។'
    },
    {
      num: '06',
      nameKh: 'ស្រទាប់ហេដ្ឋារចនាសម្ព័ន្ធ & DevOps (DevOps & Hosting)',
      nameEn: '6. Infrastructure & Deployment Layer',
      tech: 'Docker Compose • Nginx • PHP 8.2-FPM • SSL Certbot',
      descKh: 'ដំណើរការតាម Container ដាច់ដោយឡែកពីគ្នា ងាយស្រួលដំឡើង និងពង្រីកសមត្ថភាពប្រព័ន្ធ។'
    }
  ];

  const businessHighlights = [
    {
      icon: QrCode,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
      titleKh: 'ការលក់រហ័ស POS & បាគង KHQR',
      titleEn: 'High-Speed POS & Bakong KHQR',
      descKh: 'គិតលុយលឿនជាង ១ វិនាទី បង្កើត Dynamic KHQR តាមស្តង់ដារ EMVCo ព្រមទាំងចាក់សោរស្តុក (Row Lock) មិនឱ្យលក់ជាន់គ្នា។',
      descEn: 'Sub-second cashier checkout with dynamic Bakong KHQR EMVCo generation and PostgreSQL row-level stock locks.'
    },
    {
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
      titleKh: 'ស្តុកឃ្លាំង & គណនាថ្លៃដើមពិត',
      titleEn: 'Multi-Warehouse & Moving Average Costing',
      descKh: 'តាមដានស្តុកពហុឃ្លាំង ផ្ទេរស្តុកឆ្លងសាខា និងគណនាថ្លៃដើមទំនិញស្វ័យប្រវត្តិតាមរូបមន្ត Moving Average ពេលទទួល PO។',
      descEn: 'Tracks multi-warehouse stock balances, inter-branch transfers, and automatically recomputes Moving Average Cost.'
    },
    {
      icon: Sparkles,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
      titleKh: 'វត្តមានស្កេន Dynamic QR ការពារបន្លំ',
      titleEn: 'Anti-Fraud Dynamic QR Attendance',
      descKh: 'កូដ QR លើ Kiosk ប្តូររៀងរាល់ ១៥ វិនាទី ផ្ទៀងផ្ទាត់កូដម៉ាស៊ីនទូរស័ព្ទ (Device UUID) និងទីតាំង GPS ១០០ ម៉ែត្រ។',
      descEn: '15-second rotating dynamic QR with employee mobile hardware UUID matching and GPS 100m geofencing.'
    },
    {
      icon: DollarSign,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30',
      titleKh: 'ប្រាក់បៀវត្សរ៍ & ពន្ធកម្ពុជាស្វ័យប្រវត្តិ',
      titleEn: 'Automated Cambodian Tax & Payroll',
      descKh: 'គណនាប្រាក់ខែបុគ្គលិក កាត់ពន្ធតាមកាំពន្ធកម្ពុជា កាត់បេឡាជាតិ ប.ស.ស ថែមម៉ោង OT និងចេញ Payslip PDF ផ្លូវការ។',
      descEn: 'Computes monthly salaries, Cambodian progressive tax brackets, NSSF, overtime, and bilingual PDF payslips.'
    }
  ];

  const faqs = [
    {
      id: 'faq-01',
      qKh: 'តើប្រព័ន្ធដោះស្រាយបញ្ហា Race Condition និងការលក់លើសស្តុក (Over-selling) យ៉ាងដូចម្តេច?',
      qEn: 'How does the system prevent Race Conditions and inventory over-selling?',
      aKh: 'ប្រព័ន្ធប្រើប្រាស់ PostgreSQL Row-Level Lock ដោយអនុវត្ត `DB::transaction()` រួមជាមួយ `lockForUpdate()` លើតារាង `inventories`។ ក្នុងពេលដែលបញ្ជរ A កំពុងកាត់ស្តុក បញ្ជរ B ត្រូវរង់ចាំរហូតដល់ Transaction បញ្ចប់។ ប្រសិនបើស្តុកមិនគ្រប់គ្រាន់ ប្រព័ន្ធនឹងបដិសេធប្រតិបត្តិការ និង Rollback ភ្លាមៗ។',
      aEn: 'The system uses PostgreSQL row-level locks via `DB::transaction()` with `lockForUpdate()` on the `inventories` table. While Cashier A is processing a checkout, Cashier B waits until the transaction commits. If balance is insufficient, it rolls back automatically.'
    },
    {
      id: 'faq-02',
      qKh: 'តើការទូទាត់ប្រាក់បាគង KHQR Dynamic ដំណើរការ និងផ្ទៀងផ្ទាត់ដោយរបៀបណា?',
      qEn: 'How does the dynamic Bakong KHQR payment generation and verification work?',
      aKh: 'POS និង Storefront ផ្ញើសំណើទៅកាន់ `BakongService` ដើម្បីបង្កើតកូដ EMVCo CRC-16 ក្នុងរយៈពេលតិចជាង ១ វិនាទី។ នៅពេលអតិថិជនស្កេនទូទាត់លើ Mobile Banking ធនាគារនឹងផ្ញើ Webhook Callback មកបញ្ជាក់ ហើយ Frontend មានប្រព័ន្ធ Polling ជំនួយរៀងរាល់ ២ វិនាទីដើម្បីប្តូរស្ថានភាពជា Paid ភ្លាមៗ។',
      aEn: 'BakongService generates EMVCo CRC-16 QR payloads in sub-second time. Upon scanning in mobile banking, Bakong sends a webhook callback to confirm payment, paired with a 2-second frontend polling fallback.'
    },
    {
      id: 'faq-03',
      qKh: 'តើប្រព័ន្ធកត់ត្រាវត្តមានបុគ្គលិកការពារការក្លែងបន្លំ និងការផ្ញើរូបថតស្កេនជំនួសដោយរបៀបណា?',
      qEn: 'How does the Dynamic QR attendance kiosk prevent fraud and buddy-punching?',
      aKh: 'ប្រព័ន្ធការពារ ៣ ជាន់៖ ១. Dynamic QR ប្តូរកូដរៀងរាល់ ១៥ វិនាទី (រូបថតថតទុកនឹងផុតកំណត់) ២. ពិនិត្យកូដសម្គាល់ Hardware Device UUID របស់ទូរស័ព្ទបុគ្គលិក ៣. ផ្ទៀងផ្ទាត់កូអរដោនេ GPS ក្នុងរង្វង់ ១០០ ម៉ែត្រពីទីតាំងសាខា។',
      aEn: 'Employs 3-layer protection: 1. QR rotates every 15 seconds; 2. Verifies registered phone hardware UUID; 3. Validates GPS coordinates within 100m of the store.'
    },
    {
      id: 'faq-04',
      qKh: 'តើប្រព័ន្ធធានាភាពឯកជន និងការញែកទិន្នន័យឆ្លងសាខា (Branch Scoping) យ៉ាងដូចម្តេច?',
      qEn: 'How does multi-branch data isolation prevent cross-branch data leaks?',
      aKh: 'ប្រព័ន្ធប្រើប្រាស់ Global Scope ក្នុង Laravel Eloquent (`BranchScope`)។ រាល់ Query ទាំងអស់ត្រូវបានចងដោយស្វ័យប្រវត្តិនូវ `WHERE branch_id = ?` តាមគណនីបុគ្គលិក។ បុគ្គលិកនៅសាខាទី ១ មិនអាចមើលឃើញ ឬកែប្រែទិន្នន័យលក់ ឬស្តុករបស់សាខាទី ២ បានឡើយ។',
      aEn: 'Laravel Eloquent Global Scope (`BranchScope`) automatically appends `WHERE branch_id = ?` to all database queries based on the user token, ensuring strict data isolation.'
    }
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0 space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <Breadcrumb items={[{ label: language === 'km' ? 'ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ' : 'System Overview' }]} />

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold font-mono">
              System Overview & Architecture
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
              v1.0.0 Ready
            </span>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-mono">
              Laravel 12 • PostgreSQL 18
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {language === 'km' ? 'ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធសហគ្រាស' : 'Enterprise System Overview'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-4xl">
            {language === 'km'
              ? 'មគ្គុទ្ទេសក៍ស្ថាបត្យកម្មប្រព័ន្ធផ្លូវការ ពន្យល់អំពីកម្មវិធីស្នូលទាំង ៤ ស្ថាបត្យកម្ម ៦ ស្រទាប់ លំហូរទិន្នន័យ តក្កវិជ្ជាអាជីវកម្ម ឃ្លាំងទិន្នន័យ PostgreSQL 18 និងម៉ាស៊ីនកណ្តាល Laravel 12 តែមួយ។'
              : 'Comprehensive architectural guide detailing the 4 connected applications, 6-tier system architecture, business workflows, single PostgreSQL 18 database, and central Laravel 12 engine.'}
          </p>

          {/* Clean 4-Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                {REAL_SYSTEM_STATS.databaseTablesCount}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {language === 'km' ? 'តារាង PostgreSQL 18' : 'PostgreSQL 18 Tables'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                {REAL_SYSTEM_STATS.apiEndpointsCount}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {language === 'km' ? 'REST API Endpoints' : 'REST APIs'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                {REAL_SYSTEM_STATS.adminPagesCount}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {language === 'km' ? 'ទំព័រ Admin (React 19)' : 'Admin Pages (React 19)'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                4
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {language === 'km' ? 'កម្មវិធីស្នូលរួមគ្នា' : 'Connected Clients'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: 4 Connected Applications */}
        <section id="four-platforms" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? '១. កម្មវិធីស្នូលទាំង ៤ ដែលតភ្ជាប់គ្នា (4 Connected Applications)' : '1. 4 Connected Applications'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'km'
                ? 'ប្រព័ន្ធត្រូវបានរៀបចំឡើងជា ៤ កម្មវិធីផ្សេងគ្នា ប៉ុន្តែប្រើប្រាស់ Database PostgreSQL 18 និង Backend Laravel 12 តែមួយ'
                : 'Unified enterprise experience across 4 purpose-built client applications powered by a single backend.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-sm hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {p.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {language === 'km' ? p.nameKh : p.name}
                      </h3>
                      <div className="text-xs font-mono text-brand-600 dark:text-brand-400 mt-0.5">
                        {p.tech}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {language === 'km' ? p.descKh : p.descEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                    <Link
                      to={p.path}
                      className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <span>{language === 'km' ? 'អានឯកសារណែនាំ' : 'Read Guide'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: 6-Tier Architecture */}
        <section id="system-architecture" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {language === 'km' ? '២. ស្ថាបត្យកម្ម ៦ ស្រទាប់ (6-Tier Architecture)' : '2. 6-Tier Architecture'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'km'
                  ? 'ការបែងចែកទំនួលខុសត្រូវច្បាស់លាស់ពីកម្រិត User Interface រហូតដល់ Database Persistence'
                  : 'Clean separation of concerns from frontend presentation down to PostgreSQL persistence.'}
              </p>
            </div>
            <Link
              to="/architecture"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'km' ? 'មើលដ្យាក្រាមលម្អិត' : 'Deep-dive Architecture'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {architectureLayers.map((layer, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-brand-200 dark:border-brand-500/30">
                    {layer.num}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {language === 'km' ? layer.nameKh : layer.nameEn}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 font-normal mt-0.5">
                      {layer.descKh}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
                  {layer.tech}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Core Business Highlights */}
        <section id="business-highlights" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? '៣. ដំណើរការអាជីវកម្មស្នូលទាំង ៤ (Key Business Highlights)' : '3. Core Business Operations'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'km'
                ? 'ចំណុចខ្លាំងនៃប្រព័ន្ធដែលធានាដំណើរការអាជីវកម្មរលូន ត្រឹមត្រូវ និងមានសុវត្ថិភាព'
                : 'Mission-critical business workflows engineered for high-concurrency and financial accuracy.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessHighlights.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl border ${b.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                      {language === 'km' ? b.titleKh : b.titleEn}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {language === 'km' ? b.descKh : b.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Security & Permissions */}
        <section id="security-rbac" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? '៤. សន្តិសុខ & ការបែងចែកសិទ្ធិ (Security & RBAC)' : '4. Security & Access Governance'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'km'
                ? 'ប្រព័ន្ធសុវត្ថិភាពកម្រិតសហគ្រាស ការពារទិន្នន័យមិនឱ្យលេចធ្លាយ និងគ្រប់គ្រងសិទ្ធិបុគ្គលិកយ៉ាងតឹងរ៉ឹង'
                : 'Enterprise security controls ensuring granular access management and zero cross-tenant leakage.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 space-y-2 text-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {language === 'km' ? 'Dual-Token JWT Security' : 'Dual-Token JWT Security'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {language === 'km'
                  ? 'Access Token មានសុពលភាព ១៥ នាទី រួមជាមួយ Refresh Token ៣០ ថ្ងៃ (រក្សាទុកក្នុង Database Hashed) ការពារការលួច Session។'
                  : '15-minute short-lived access tokens paired with rotating 30-day database-hashed refresh tokens.'}
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 space-y-2 text-xs">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {language === 'km' ? 'Spatie RBAC ១៦៩ សិទ្ធិ' : 'Spatie RBAC (169 Nodes)'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {language === 'km'
                  ? 'បែងចែក ៦ តួនាទីច្បាស់លាស់ (Super Admin, Manager, Cashier, Warehouse, Accountant, HR) ជាមួយ ១៦៩ Permission Nodes។'
                  : '6 distinct roles mapped to 169 granular permissions for strict operational control.'}
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 space-y-2 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {language === 'km' ? 'ញែកទិន្នន័យតាមសាខា' : 'Multi-Branch Scoping'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {language === 'km'
                  ? 'Eloquent Global Scopes ចង `WHERE branch_id = ?` ស្វ័យប្រវត្តិ បុគ្គលិកសាខា A មិនអាចមើលទិន្នន័យសាខា B បានឡើយ។'
                  : 'Global query scopes automatically enforce branch isolation, preventing horizontal data leakage.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Essential Architecture FAQs */}
        <section id="core-faqs" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {language === 'km' ? '៥. សំណួរ-ចម្លើយបច្ចេកទេសសំខាន់ៗ (Essential Architecture FAQs)' : '5. Core Architectural FAQs'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'km'
                  ? 'ដំណោះស្រាយចំពោះសំណួរបច្ចេកទេសស្នូលដែលកំណត់គុណភាពនៃប្រព័ន្ធ'
                  : 'Key architectural questions answered with direct technical explanations.'}
              </p>
            </div>

            <Link
              to="/faq"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'km' ? 'មើលសំណួរទាំង ៥២ (View all 52 FAQs)' : 'Explore 52 FAQs'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'border-brand-500/50 bg-white dark:bg-slate-900 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-start justify-between p-4 sm:p-5 text-left transition-colors gap-3"
                  >
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {language === 'km' ? faq.qKh : faq.qEn}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 mt-0.5 ${
                        isOpen ? 'rotate-180 text-brand-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      <p className="font-normal">{language === 'km' ? faq.aKh : faq.aEn}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Related Portals */}
        <section id="related-portals" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? '៦. ឯកសារបច្ចេកទេសពាក់ព័ន្ធ (Related Documentation Portals)' : '6. Related Documentation Portals'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'km'
                ? 'ជ្រើសរើសច្រកទ្វារឯកសារដែលអ្នកចង់ស្វែងយល់លម្អិតបន្ត'
                : 'Continue exploring the technical documentation portals.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/architecture"
              className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {language === 'km' ? 'ស្ថាបត្យកម្ម ៦ ស្រទាប់' : '6-Tier Architecture'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {language === 'km' ? 'ស្វែងយល់លម្អិតពីស្រទាប់ទាំង ៦ និងលំហូរទិន្នន័យ។' : 'Deep dive into 6 system layers.'}
              </p>
            </Link>

            <Link
              to="/database"
              className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {language === 'km' ? 'តារាងទិន្នន័យ ៩៩' : '99 Database Tables'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {language === 'km' ? 'វចនានុក្រមទិន្នន័យ PostgreSQL 18 និង ERD។' : 'PostgreSQL 18 data dictionary.'}
              </p>
            </Link>

            <Link
              to="/api"
              className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {language === 'km' ? '759 REST APIs' : '759 REST APIs'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {language === 'km' ? 'ឯកសារ API គំរូ Request/Response និង Auth។' : 'Interactive API Explorer.'}
              </p>
            </Link>

            <Link
              to="/developer-guide"
              className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {language === 'km' ? 'មគ្គុទ្ទេសក៍ Developer' : 'Developer Guide'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {language === 'km' ? 'ការដំឡើង Docker Compose, Migrations និង Seeders។' : 'Local setup & Docker deployment.'}
              </p>
            </Link>
          </div>
        </section>
      </div>

      {/* Right Sidebar Table of Contents */}
      <TableOfContents items={tocItems} />
    </div>
  );
};
