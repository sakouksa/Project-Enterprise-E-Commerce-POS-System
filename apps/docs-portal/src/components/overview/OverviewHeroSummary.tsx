import React from 'react';
import { useDocs } from '../../stores/useDocsStore';
import {
  ShoppingBag,
  CreditCard,
  Package,
  Truck,
  Users,
  DollarSign,
  BarChart3,
  Bell,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewHeroSummary: React.FC = () => {
  const { language } = useDocs();

  const businessPillars = [
    { icon: ShoppingBag, name: 'E-Commerce', nameKh: 'លក់ទំនិញអនឡាញ', desc: 'Online Storefront & Cart' },
    { icon: CreditCard, name: 'POS Terminal', nameKh: 'គិតលុយរហ័ស POS', desc: 'Bakong KHQR & Barcode' },
    { icon: Package, name: 'Multi-Warehouse', nameKh: 'ស្តុកពហុឃ្លាំង', desc: 'Stock Ledger & Transfers' },
    { icon: Truck, name: 'Purchasing', nameKh: 'ការបញ្ជាទិញចូល PO', desc: 'Suppliers & Receiving' },
    { icon: Users, name: 'HR & Attendance', nameKh: 'វត្តមាន Dynamic QR', desc: 'Anti-Fraud & GPS Fence' },
    { icon: DollarSign, name: 'Payroll & Tax', nameKh: 'បើកប្រាក់ខែ & ពន្ធ', desc: 'Cambodian Tax & NSSF' },
    { icon: BarChart3, name: '48 Reports', nameKh: '៤៨ របាយការណ៍', desc: 'Excel & PDF Export' },
    { icon: Bell, name: 'Notifications', nameKh: 'ប្រព័ន្ធជូនដំណឹង', desc: 'DB, Email, Webhooks' },
  ];

  return (
    <div className="space-y-8 mb-14">
      {/* Hero Highlight Card */}
      <div className="relative rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-50/60 via-sky-50/30 to-emerald-50/40 dark:from-brand-950/40 dark:via-slate-900/80 dark:to-emerald-950/30 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-sm backdrop-blur-md">
        {/* Glow Circles */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-brand-500/10 dark:bg-brand-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
            <span className="text-xs font-bold font-mono tracking-wider uppercase text-brand-700 dark:text-brand-300">
              {language === 'km' ? 'បេសកកម្ម និងស្ថាបត្យកម្មស្នូល' : 'Mission & Core Proposition'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
            {language === 'km'
              ? 'វេទិកាសហគ្រាសតែមួយ បម្រើបទពិសោធន៍អាជីវកម្មច្រើនច្រកទ្វារ'
              : 'One Enterprise Platform, Multiple Connected Business Experiences'}
          </h2>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-4xl leading-relaxed font-normal">
            {language === 'km'
              ? 'ប្រព័ន្ធនេះត្រូវបានរចនាឡើងដើម្បីបង្រួបបង្រួមគ្រប់ប្រតិបត្តិការសហគ្រាសទាំងអស់ចូលក្នុង Data Engine តែមួយគត់ (Laravel 12 + PostgreSQL 18)៖ ការលក់ទំនិញអនឡាញ (E-Commerce), ការគិតលុយរហ័សនៅហាងផ្ទាល់ (POS Terminal), ស្តុកឃ្លាំងពហុសាខា, ការបញ្ជាទិញចូល, ការកត់ត្រាវត្តមានបុគ្គលិកតាម Dynamic QR, និងការបើកប្រាក់បៀវត្សរ៍ ដោយមិនចាំបាច់ប្រើកម្មវិធីដាច់ដោយឡែកពីគ្នាឡើយ។'
              : 'Engineered as a single, zero-drift monorepo unifying high-speed POS cashiering with Bakong KHQR, multi-warehouse inventory ledgers, procurement, customer e-commerce, dynamic anti-fraud QR attendance, and automated payroll on a single Laravel 12 & PostgreSQL 18 backend engine.'}
          </p>

          {/* 8 Connected Business Pillars Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {businessPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 flex items-center gap-2.5 shadow-2xs group hover:border-brand-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 border border-brand-200/60 dark:border-brand-500/20 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {language === 'km' ? pillar.nameKh : pillar.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {pillar.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Problem vs Solution Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pain points of fragmented legacy systems */}
        <div className="p-6 rounded-3xl border border-rose-200/90 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-500/5 space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-rose-700 dark:text-rose-400 text-sm">
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
            <span>{language === 'km' ? 'បញ្ហាប្រព័ន្ធចាស់ៗដាច់ដោយឡែក (Fragmented Legacy Pain)' : 'Fragmented Legacy Disconnects'}</span>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Over-Selling & Negative Stock:</strong> E-Commerce និង POS ប្រើ Database ដាច់ដោយឡែកពីគ្នា នាំឱ្យលក់ទំនិញជាន់គ្នាញឹកញាប់ និងខុសស្តុក។</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Manual Slip Checking:</strong> គ្មានប្រព័ន្ធស្កេនទូទាត់ Bakong KHQR ស្វ័យប្រវត្តិនាំឱ្យបុគ្គលិកចំណាយពេលឆែក Slip យូរ និងប្រឈមនឹងការក្លែងបន្លំ Fake Slip។</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Attendance Buddy Punching:</strong> បុគ្គលិកផ្ញើរូបថត QR ឱ្យគ្នាស្កេនជំនួស ឬកត់ត្រាវត្តមានលើសៀវភៅដៃ បង្កឱ្យបាត់បង់តម្លាភាព។</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Manual Payroll Math:</strong> គណនាប្រាក់ខែ និងកាត់ពន្ធកម្ពុជាតាម Excel មានកំហុសច្រើន និងចំណាយពេលរាប់ថ្ងៃរាល់ចុងខែ។</span>
            </li>
          </ul>
        </div>

        {/* Our Unified Architectural Solution */}
        <div className="p-6 rounded-3xl border border-emerald-200/90 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-500/5 space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>{language === 'km' ? 'ដំណោះស្រាយសហគ្រាសរួម (Our Unified Architecture)' : 'Our Unified Enterprise Architecture'}</span>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Atomic Row-Locking:</strong> កាត់ស្តុកភ្លាមៗទាំង Online និង POS តាម Database Transactions (`selectForUpdate`) ធានាស្តុកត្រឹមត្រូវ ១០០%។</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Instant Bakong KHQR Engine:</strong> បង្កើត Dynamic QR Code ភ្លាមៗលើ POS ជាមួយ Webhook & Polling ផ្ទៀងផ្ទាត់ការបង់ប្រាក់ក្នុងកម្រិត Sub-second។</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Anti-Fraud Dynamic QR:</strong> QR Code ប្តូរកូដសម្ងាត់រៀងរាល់ ១៥ វិនាទី បូករួមនឹងការចងភ្ជាប់ Device Hardware UUID និង GPS Geofencing។</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Automated Payroll & Tax Engine:</strong> គណនាប្រាក់បៀវត្សរ៍ ពន្ធកម្ពុជាតាមកាំពន្ធ ថែមម៉ោង OT និងបេឡាជាតិ របបសន្តិសុខសង្គម (ប.ស.ស) ស្វ័យប្រវត្តិ។</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
