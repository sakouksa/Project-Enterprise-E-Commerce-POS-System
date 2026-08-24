import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { ALL_ENTERPRISE_FAQS, EnterpriseFaqItem } from '../data/enterpriseFaqs';
import { REAL_SYSTEM_STATS } from '../data/systemStats';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Shield,
  Layers,
  Database,
  Radio,
  Cpu,
  ShoppingBag,
  Sparkles,
  Code2,
  CreditCard,
  Package,
  Truck,
  Users,
  DollarSign,
  Terminal,
  ChevronRight
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { language, t } = useDocs();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('architecture');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-01');

  // 9 Well-structured Categories with icons
  const categories = [
    { id: 'architecture', icon: Layers, label: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'Architecture', th: 'สถาปัตยกรรม', vi: 'Kiến trúc', zh: '系统架构' }, color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30' },
    { id: 'pos', icon: ShoppingBag, label: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashier', th: 'แคชเชียร์ POS', vi: 'Thu ngân POS', zh: '极速POS' }, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' },
    { id: 'payments', icon: CreditCard, label: { km: 'ការទូទាត់ & KHQR', en: 'Payments & KHQR', th: 'การชำระเงิน', vi: 'Thanh toán', zh: '支付网关' }, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' },
    { id: 'inventory', icon: Package, label: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Stock', th: 'คลังสินค้า', vi: 'Kho hàng', zh: '进销存' }, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30' },
    { id: 'procurement', icon: Truck, label: { km: 'ការបញ្ជាទិញចូល PO', en: 'Procurement', th: 'การจัดซื้อ', vi: 'Mua hàng', zh: '采购管理' }, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' },
    { id: 'hrm', icon: Users, label: { km: 'វត្តមាន Dynamic QR', en: 'HRM & Attendance', th: 'การลงเวลา HR', vi: 'Chấm công', zh: '考勤人事' }, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30' },
    { id: 'payroll', icon: DollarSign, label: { km: 'ប្រាក់បៀវត្សរ៍', en: 'Payroll & Tax', th: 'เงินเดือนและภาษี', vi: 'Tính lương', zh: '薪资核算' }, color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30' },
    { id: 'security', icon: Shield, label: { km: 'សន្តិសុខ & RBAC', en: 'Security & RBAC', th: 'ความปลอดภัย', vi: 'Bảo mật', zh: '权限安全' }, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' },
    { id: 'devops', icon: Terminal, label: { km: 'DevOps & Scaling', en: 'DevOps & Scaling', th: 'DevOps & DB', vi: 'DevOps & DB', zh: '运维部署' }, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700' },
  ];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_ENTERPRISE_FAQS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered FAQs
  const displayedFaqs = useMemo(() => {
    const isSearching = searchQuery.trim().length > 0;
    if (isSearching) {
      const qLower = searchQuery.toLowerCase();
      return ALL_ENTERPRISE_FAQS.filter((faq) => {
        const qText = (faq.q[language] || faq.q.en).toLowerCase();
        const aText = (faq.a[language] || faq.a.en).toLowerCase();
        return qText.includes(qLower) || aText.includes(qLower) || faq.id.includes(qLower);
      });
    }

    return ALL_ENTERPRISE_FAQS.filter((faq) => faq.category === activeTab);
  }, [activeTab, searchQuery, language]);

  const tocItems = [
    { id: 'what-is-the-system', label: language === 'km' ? '១. តើប្រព័ន្ធនេះជាអ្វី?' : '1. What is the System?' },
    { id: 'why-it-was-built', label: language === 'km' ? '២. ហេតុអ្វីបានជាបង្កើតឡើង?' : '2. Why It Was Built' },
    { id: 'core-capabilities', label: language === 'km' ? '៣. សមត្ថភាពស្នូលទាំង ៨' : '3. 8 Core Capabilities' },
    { id: 'monorepo-architecture', label: language === 'km' ? '៤. ស្ថាបត្យកម្ម Monorepo' : '4. Monorepo Architecture' },
    { id: 'enterprise-faqs', label: language === 'km' ? '៥. សំណួរ-ចម្លើយបច្ចេកទេស (៥០+)' : '5. 50+ Enterprise FAQs' },
  ];

  // Helper to remove "01. ", "02. " prefixes for cleaner display
  const cleanQuestionTitle = (text: string) => {
    return text.replace(/^\d+\.\s*/, '');
  };

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: language === 'km' ? 'ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ' : 'Executive Overview' }]} />

        {/* Page Title Header */}
        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3 font-mono">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Enterprise Whitepaper & Executive Overview</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធសហគ្រាស (System Overview)' : 'Enterprise System Executive Overview'}
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed font-normal">
            {language === 'km'
              ? 'មគ្គុទ្ទេសក៍ស្ថាបត្យកម្មបច្ចេកទេសកម្រិតសហគ្រាស ពន្យល់លម្អិតអំពីប្រព័ន្ធរួមបញ្ចូលគ្នានៃ E-Commerce, POS (KHQR), ស្តុកឃ្លាំងពហុសាខា, វត្តមាន Dynamic QR និងការបើកប្រាក់ខែ ព្រមទាំងសំណួរ-ចម្លើយដោះស្រាយបញ្ហាស៊ីជម្រៅជាង ៥០+ សំណួរ។'
              : 'Comprehensive technical whitepaper outlining the unified architecture, cross-channel synchronization, zero-drift monorepo, and 50+ authoritative enterprise problem-solving Q&As.'}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{REAL_SYSTEM_STATS.databaseTablesCount}</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t.metricDbTables}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{REAL_SYSTEM_STATS.eloquentModelsCount}</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t.metricModels}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{REAL_SYSTEM_STATS.apiEndpointsCount}</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t.metricApis}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">{REAL_SYSTEM_STATS.adminPagesCount}</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t.metricAdminPages}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 text-center col-span-2 sm:col-span-1">
              <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">5 Locales</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase">KM, EN, TH, VI, ZH</div>
            </div>
          </div>
        </div>

        {/* 1. What is the system */}
        <section id="what-is-the-system" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-mono font-bold">01</span>
            <span>{language === 'km' ? 'តើប្រព័ន្ធនេះជាអ្វី? (What is the System?)' : 'What is the System?'}</span>
          </h2>

          <div className="p-6 md:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/70 shadow-sm text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
            <p>
              <strong>Project-Enterprise-E-Commerce-POS-System</strong> គឺជាប្រព័ន្ធគ្រប់គ្រងសហគ្រាសកម្រិតខ្ពស់ (Enterprise Omnichannel Platform) ដែលរួមបញ្ចូលគ្នានូវ <strong>គេហទំព័រលក់ទំនិញអនឡាញ (E-Commerce Storefront)</strong>, <strong>ប្រព័ន្ធគិតលុយល្បឿនលឿននៅហាងផ្ទាល់ (High-Speed POS Terminal គាំទ្រ KHQR)</strong>, <strong>ប្រព័ន្ធគ្រប់គ្រងស្តុកឃ្លាំងពហុសាខា (Multi-Warehouse Inventory Management)</strong>, <strong>ការបញ្ជាទិញទំនិញចូល (Procurement & POs)</strong>, <strong>វត្តមានបុគ្គលិកតាម Dynamic QR Code</strong>, និង <strong>ការគណនាប្រាក់បៀវត្សរ៍ស្វ័យប្រវត្តិ (Automated Payroll Engine)</strong>។
            </p>
            <p>
              ប្រព័ន្ធទាំងមូលដំណើរការលើ <strong>Laravel 12 Backend Engine</strong> និង <strong>PostgreSQL 18 Database តែមួយ (Single Source of Truth)</strong> ធានាថារាល់ពេលមានការលក់ចេញតាម POS នៅសាខាណាមួយ ឬការទិញតាម Website ស្តុកទំនិញ និងទិន្នន័យហិរញ្ញវត្ថុនឹងត្រូវបានកាត់ (Atomic Row-Lock Deduction) ភ្លាមៗដោយគ្មានភាពយឺតយ៉ាវ ឬខុសទិន្នន័យឡើយ។
            </p>
          </div>
        </section>

        {/* 2. Why it was built */}
        <section id="why-it-was-built" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">02</span>
            <span>{language === 'km' ? 'ហេតុអ្វីបានជាប្រព័ន្ធនេះត្រូវបានបង្កើតឡើង? (Why It Was Built)' : 'Why It Was Built'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-500/5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400 text-sm">
                <XCircle className="w-5 h-5" />
                <span>Traditional Fragmented Systems (បញ្ហាប្រព័ន្ធដាច់ដោយឡែក)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <li>• <strong>Over-Selling & Discrepancies:</strong> E-Commerce និង POS នៅហាងដាច់ដោយឡែកពីគ្នា នាំឱ្យស្តុកលក់ជាន់គ្នាញឹកញាប់។</li>
                <li>• <strong>Manual Cashier Work:</strong> គ្មានប្រព័ន្ធស្កេនទូទាត់បាគង KHQR ស្វ័យប្រវត្តិនាំឱ្យបុគ្គលិកចំណាយពេលឆែក Slip យូរ និងប្រឈមនឹងការក្លែងបន្លំ Slip។</li>
                <li>• <strong>Manual Payroll & Excel:</strong> ការគិតវត្តមាន និងប្រាក់ខែបុគ្គលិកធ្វើលើ Excel ដោយដៃ មានកំហុសច្រើន និងបាត់បង់តម្លាភាព។</li>
                <li>• <strong>No Multi-Branch Visibility:</strong> ពិបាកផ្ទេរស្តុកឆ្លងសាខា និងមិនដឹងពីថ្លៃដើមទំនិញពិតប្រាកដ (Moving Average Cost)។</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-500/5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Our Unified Solution (ដំណោះស្រាយសហគ្រាសរួម)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <li>• <strong>Atomic Row-Locking:</strong> កាត់ស្តុកភ្លាមៗទាំង Online និង POS តាម Database Transactions ធានាស្តុកត្រឹមត្រូវ ១០០%។</li>
                <li>• <strong>Instant Bakong KHQR:</strong> បង្កើត Dynamic QR Code ភ្លាមៗលើ POS ជាមួយ Webhook & Polling ផ្ទៀងផ្ទាត់ស្វ័យប្រវត្តិ។</li>
                <li>• <strong>Integrated HR & Payroll:</strong> ស្កេនវត្តមាន Dynamic QR ភ្ជាប់ Geofencing គណនាប្រាក់ខែ និងកាត់ពន្ធកម្ពុជាស្វ័យប្រវត្តិ។</li>
                <li>• <strong>Multi-Tenant Multi-Branch:</strong> គ្រប់គ្រងក្រុមហ៊ុនច្រើន និងសាខាច្រើនជាមួយសិទ្ធិ Spatie RBAC ១៦៩ សិទ្ធិ។</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Core Capabilities Matrix */}
        <section id="core-capabilities" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-mono font-bold">03</span>
            <span>{language === 'km' ? 'សមត្ថភាពស្នូលទាំង ៨ នៃប្រព័ន្ធ (8 Core Capabilities)' : '8 Core Capabilities'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'High-Speed POS Terminal',
                titleKh: 'ប្រព័ន្ធគិតលុយ POS Terminal',
                desc: 'Barcode scanning, Bakong KHQR, 80mm thermal receipts, cash drawer, and cashier shifts.',
                path: '/modules/pos',
                badge: 'Retail POS'
              },
              {
                title: 'Multi-Warehouse Inventory',
                titleKh: 'ស្តុកឃ្លាំងពហុសាខា',
                desc: 'Real-time stock balance, inter-branch transfers, write-offs, and stock opname cycle counts.',
                path: '/modules/inventory',
                badge: 'Warehouses'
              },
              {
                title: 'Procurement & Purchases',
                titleKh: 'ការបញ្ជាទិញចូល & PO',
                desc: 'Requisition, purchase orders, partial/full goods receiving, and accounts payable.',
                path: '/modules/purchases',
                badge: 'Procurement'
              },
              {
                title: 'Dynamic QR Attendance',
                titleKh: 'វត្តមានតាម Dynamic QR',
                desc: '15s rotating dynamic QR codes, GPS geofencing, device hardware UUID binding.',
                path: '/modules/attendance',
                badge: 'HR & Anti-Fraud'
              },
              {
                title: 'Automated Payroll & Tax',
                titleKh: 'ប្រាក់បៀវត្សរ៍ & ពន្ធ',
                desc: 'Cambodian progressive tax brackets, NSSF deductions, overtime multipliers, and PDF payslips.',
                path: '/modules/payroll',
                badge: 'Finance HR'
              },
              {
                title: 'Customer E-Commerce',
                titleKh: 'គេហទំព័រអតិថិជន Store',
                desc: '28 audited React pages, catalog browsing, cart, checkout, and order tracking.',
                path: '/customer-guide',
                badge: 'Storefront'
              },
              {
                title: 'Spatie RBAC & Security',
                titleKh: 'សិទ្ធិ & សន្តិសុខ RBAC',
                desc: '169 granular Spatie permissions, multi-branch scoping, dual JWT tokens, and audit logs.',
                path: '/auth-rbac',
                badge: 'Security'
              },
              {
                title: '759 REST APIs & 99 Tables',
                titleKh: '759 APIs & 99 DB Tables',
                desc: 'High-speed REST API endpoints and PostgreSQL 18 schema with interactive ER diagram.',
                path: '/api',
                badge: 'Backend Core'
              }
            ].map((cap, idx) => (
              <Link
                key={idx}
                to={cap.path}
                className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 hover:border-brand-500/50 hover:shadow-md transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30 mb-3 inline-block">
                    {cap.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {language === 'km' ? cap.titleKh : cap.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {cap.desc}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                  <span>{language === 'km' ? 'អានលម្អិត' : 'View Module'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Monorepo Architecture */}
        <section id="monorepo-architecture" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-mono font-bold">04</span>
            <span>{language === 'km' ? 'ស្ថាបត្យកម្ម Monorepo នៃគម្រោង' : 'Monorepo Project Structure'}</span>
          </h2>

          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/70 shadow-sm space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              គម្រោងទាំងមូលត្រូវបានរៀបចំជា **Unified Workspace Monorepo** ដែលគ្រប់គ្រង Package និង Dependency ទាំងអស់តាមស្តង់ដាររួមតែមួយ៖
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4" />
                  <span>admin-dashboard (Port 5173)</span>
                </div>
                <div className="text-slate-500 text-[11px]">React 19 • Vite 8 • Ant Design 5 • Tailwind CSS • 258 Pages</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span>customer-website (Port 5174)</span>
                </div>
                <div className="text-slate-500 text-[11px]">React 19 • Tailwind CSS • React Query • 28 Store Pages</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>mobile_app (Flutter)</span>
                </div>
                <div className="text-slate-500 text-[11px]">Flutter 3.24 • Riverpod • Hive NoSQL • iOS & Android</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-2 mb-1">
                  <Radio className="w-4 h-4" />
                  <span>backend (Port 8000)</span>
                </div>
                <div className="text-slate-500 text-[11px]">Laravel 12 • PostgreSQL 18 • 759 REST Routes • Spatie RBAC</div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 50+ ENTERPRISE PROBLEM-SOLVING KNOWLEDGEBASE (CLEAN TABBED DESIGN) */}
        <section id="enterprise-faqs" className="mb-14">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 shadow-sm dark:shadow-xl backdrop-blur-xl space-y-6">
            {/* Clean Section Header */}
            <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>52 Verified Enterprise Solutions</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {language === 'km' ? 'សំណួរ-ចម្លើយបច្ចេកទេស និងដោះស្រាយបញ្ហាសហគ្រាស (៥២)' : '52 Enterprise Technical Solutions & FAQs'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-normal">
                  {language === 'km'
                    ? 'ជ្រើសរើសប្រភេទខាងក្រោម ឬស្វែងរក ដើម្បីមើលដំណោះស្រាយបច្ចេកទេសជាក់ស្តែង ត្រឹមត្រូវ និងស៊ីជម្រៅ'
                    : 'Select a domain tab or search directly to inspect production-grade engineering answers and code references.'}
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shrink-0">
                {language === 'km' ? `${displayedFaqs.length} ដំណោះស្រាយ` : `${displayedFaqs.length} Solutions`}
              </div>
            </div>

            {/* Clean Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'km'
                    ? 'ស្វែងរកសំណួរ ឬបញ្ហាបច្ចេកទេស (ឧ. Race condition, KHQR, វត្តមាន QR, ថ្លៃដើម, Docker)...'
                    : 'Search technical solutions (e.g. Race condition, KHQR, Offline sync, Moving average, Docker)...'
                }
                className="w-full pl-11 pr-16 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* 9 Category Grid Tabs (Hidden when searching) */}
            {!searchQuery && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeTab === cat.id;
                  const count = categoryCounts[cat.id] || 0;
                  const label = cat.label[language] || cat.label.en;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveTab(cat.id);
                        const firstItem = ALL_ENTERPRISE_FAQS.find((f) => f.category === cat.id);
                        if (firstItem) setOpenFaqId(firstItem.id);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                        isActive
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 shadow-sm ring-1 ring-brand-500/20'
                          : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg border ${cat.color} flex items-center justify-center shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-xs font-bold truncate ${isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'}`}>
                          {label}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-brand-600 text-white' : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* FAQ Accordion List for Active Category */}
            <div className="space-y-2.5 pt-2">
              {displayedFaqs.length === 0 ? (
                <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-center space-y-2">
                  <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                    {language === 'km' ? 'រកមិនឃើញសំណួរដែលត្រូវនឹងពាក្យស្វែងរកឡើយ' : 'No matching enterprise Q&A found'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'km' ? 'សូមសាកល្បងស្វែងរកជាមួយពាក្យគន្លឹះផ្សេងទៀត' : 'Try searching with another keyword.'}
                  </div>
                </div>
              ) : (
                displayedFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  const rawQ = faq.q[language] || faq.q.en;
                  const qText = cleanQuestionTitle(rawQ);
                  const aText = faq.a[language] || faq.a.en;
                  const catLabel = faq.categoryLabel[language] || faq.categoryLabel.en;

                  return (
                    <div
                      key={faq.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isOpen
                          ? 'border-brand-500/50 bg-white dark:bg-slate-900/90 shadow-sm ring-1 ring-brand-500/10'
                          : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full flex items-start justify-between p-4 sm:p-4.5 text-left transition-colors gap-3"
                      >
                        <div className="space-y-1 flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {catLabel}
                            </span>
                            <span className="text-[10px] font-mono uppercase text-brand-600 dark:text-brand-400 font-semibold">
                              {faq.role}
                            </span>
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                            {qText}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 mt-1 ${
                            isOpen ? 'rotate-180 text-brand-500' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 space-y-3">
                          <p className="font-normal">{aText}</p>

                          {faq.technicalNote && (
                            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-brand-700 dark:text-brand-300 flex items-center gap-2 overflow-x-auto">
                              <Code2 className="w-3.5 h-3.5 shrink-0 text-brand-500" />
                              <span>{faq.technicalNote}</span>
                            </div>
                          )}

                          <div className="pt-1 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                            <Link to={faq.relatedPath} className="inline-flex items-center gap-1 hover:underline">
                              <span>{language === 'km' ? 'ស្វែងយល់ឯកសារម៉ូឌុលពាក់ព័ន្ធ' : 'Explore related module documentation'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Right Sidebar Table of Contents */}
      <TableOfContents items={tocItems} />
    </div>
  );
};
