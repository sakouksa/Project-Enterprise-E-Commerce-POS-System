import React, { useState } from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { ARCHITECTURE_LAYERS } from '../data/architectureData';
import { REAL_SYSTEM_STATS } from '../data/systemStats';
import { Link } from 'react-router-dom';
import {
  Layers,
  ShieldCheck,
  Database,
  Radio,
  Sparkles,
  Cpu,
  CheckCircle2,
  Lock,
  QrCode,
  Zap,
  Server,
  Building,
  ArrowRight,
  Code2,
  Smartphone,
  ShoppingBag,
  ExternalLink,
  Award
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const { language } = useDocs();
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-1-clients');

  const tocItems = [
    { id: 'architectural-strengths', label: language === 'km' ? '១. ចំណុចខ្លាំងនៃស្ថាបត្យកម្ម' : '1. Architectural Strengths' },
    { id: 'interactive-blueprint', label: language === 'km' ? '២. ប្លង់ស្ថាបត្យកម្ម ៦ ស្រទាប់' : '2. 6-Tier Architecture Blueprint' },
    { id: 'deep-dive-layers', label: language === 'km' ? '៣. វិភាគស្រទាប់នីមួយៗលម្អិត' : '3. Layer-by-Layer Deep Dive' },
    { id: 'service-pattern-code', label: language === 'km' ? '៤. គំរូកូដ Clean Service Pattern' : '4. Clean Service Pattern' },
    { id: 'related-portals', label: language === 'km' ? '៥. ឯកសារបច្ចេកទេសពាក់ព័ន្ធ' : '5. Related Portals' },
  ];

  const architecturalStrengths = [
    {
      icon: Database,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
      titleKh: 'Single Source of Truth (PostgreSQL 18)',
      titleEn: 'Unified Single PostgreSQL 18 Database',
      descKh: 'កម្មវិធីទាំង ៤ (Admin, Storefront, Mobile, Backend) ដំណើរការលើ Database រួមតែមួយ គ្មានបញ្ហាទិន្នន័យយឺតយ៉ាវ ឬជាន់គ្នាដូចប្រព័ន្ធដែលបែកខ្ញែកឡើយ។',
      descEn: 'All 4 client applications connect to a single relational PostgreSQL 18 core, eliminating data synchronization drift.'
    },
    {
      icon: Lock,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
      titleKh: 'Zero Race-Condition Concurrency Engine',
      titleEn: 'Pessimistic Row-Level Locking',
      descKh: 'ប្រើប្រាស់ PostgreSQL Row-Level Lock (`lockForUpdate`) ក្នុង `DB::transaction()` ការពារការលក់លើសស្តុក (Over-selling) ក្នុងពេលមានការកុម្ម៉ង់ច្រើនដំណាលគ្នា។',
      descEn: 'PostgreSQL row-level locks via `selectForUpdate` prevent inventory over-selling during peak concurrent sales.'
    },
    {
      icon: Smartphone,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
      titleKh: 'Offline-First Mobile Resilience (Flutter Hive)',
      titleEn: 'Offline-First Mobile Terminal',
      descKh: 'Flutter Mobile POS រក្សាទុកទិន្នន័យក្នុង Hive NoSQL អាចគិតលុយ និងចេញវិក្កយបត្របានធម្មតាពេលដាច់ Internet និង Sync ចូល Server ដោយស្វ័យប្រវត្តិតាម Idempotency UUID។',
      descEn: 'Flutter app caches catalog in Hive NoSQL, allowing offline cashier sales with automatic idempotent sync upon reconnection.'
    },
    {
      icon: QrCode,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30',
      titleKh: 'National Bakong KHQR EMVCo Native',
      titleEn: 'Native Bakong KHQR Gateway',
      descKh: 'បង្កើតកូដទូទាត់ប្រាក់បាគង KHQR Dynamic តាមស្តង់ដារ EMVCo CRC-16 ក្នុងរយៈពេលក្រោម ១ វិនាទី ជាមួយ Webhook និង Long-polling ផ្ទៀងផ្ទាត់ស្វ័យប្រវត្តិ។',
      descEn: 'Sub-second EMVCo CRC-16 dynamic KHQR payment generation with automated webhook callback verification.'
    },
    {
      icon: ShieldCheck,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30',
      titleKh: 'Spatie RBAC & Multi-Branch Scoping',
      titleEn: '169 Permissions & Tenant Scoping',
      descKh: 'ប្រព័ន្ធគ្រប់គ្រងសិទ្ធិ ១៦៩ កម្រិត និង Eloquent Global Scope (`WHERE branch_id = ?`) ធានាថាបុគ្គលិកមើលឃើញតែទិន្នន័យសាខារបស់ខ្លួនប៉ុណ្ណោះ។',
      descEn: '169 Spatie permission nodes paired with global branch scoping prevent unauthorized horizontal data access.'
    },
    {
      icon: Sparkles,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30',
      titleKh: 'Anti-Fraud Dynamic QR Attendance Kiosk',
      titleEn: 'Cryptographic Anti-Fraud Attendance',
      descKh: 'កូដ QR វត្តមានប្តូររៀងរាល់ ១៥ វិនាទី ផ្ទៀងផ្ទាត់កូដសម្គាល់ Hardware Device UUID និងទីតាំង GPS ១០០ ម៉ែត្រ ការពារការថតរូបស្កេនជំនួស ១០០%។',
      descEn: '15-second rotating dynamic QR paired with mobile device UUID matching and 100m GPS geofencing prevents fraud.'
    }
  ];

  const activeLayer = ARCHITECTURE_LAYERS.find(l => l.id === activeLayerId) || ARCHITECTURE_LAYERS[0];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0 space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <Breadcrumb items={[{ label: language === 'km' ? 'ស្ថាបត្យកម្មប្រព័ន្ធ' : 'System Architecture' }]} />

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Enterprise 6-Tier Architecture</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
              PostgreSQL 18 Core
            </span>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-mono">
              Laravel 12 Engine
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {language === 'km' ? 'ស្ថាបត្យកម្មប្រព័ន្ធ ៦ ស្រទាប់ (6-Tier Architecture)' : 'Enterprise 6-Tier Architecture'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-4xl">
            {language === 'km'
              ? 'ការវិភាគស្ថាបត្យកម្មវិស្វកម្មកម្រិតខ្ពស់ដែលតភ្ជាប់ Frontends ទាំង ៣ ទៅកាន់ម៉ាស៊ីនកណ្តាល Laravel 12 និង Database PostgreSQL 18 តែមួយ ប្រកបដោយភាពរលូន សុវត្ថិភាព និងល្បឿនលឿន។'
              : 'Comprehensive architectural breakdown of the 6 distinct layers connecting the 3 client frontends to the single Laravel 12 backend engine and PostgreSQL 18 relational database.'}
          </p>

          {/* Quick Verified Metrics Bar */}
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
                6
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                {language === 'km' ? 'ស្រទាប់ស្ថាបត្យកម្ម' : 'Architectural Layers'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Architectural Strengths & Praise */}
        <section id="architectural-strengths" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-brand-600 dark:text-brand-400 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>ENTERPRISE ENGINEERING EXCELLENCE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? '១. សមិទ្ធផល & ចំណុចខ្លាំងនៃស្ថាបត្យកម្ម (Architectural Highlights)' : '1. Key Architectural Achievements'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'km'
                ? 'ចំណុចលេចធ្លោនៃការរចនាប្រព័ន្ធដែលធានាបាននូវស្ថិរភាព សុវត្ថិភាពទិន្នន័យ និងល្បឿនប្រតិបត្តិការកម្រិតសហគ្រាស'
                : 'Pioneering design decisions that deliver enterprise-grade performance, strict ACID reliability, and seamless multi-channel scale.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architecturalStrengths.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-sm hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className={`w-10 h-10 rounded-2xl border ${item.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {language === 'km' ? item.titleKh : item.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {language === 'km' ? item.descKh : item.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Interactive 6-Tier Blueprint Explorer */}
        <section id="interactive-blueprint" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? '២. ប្លង់ស្ថាបត្យកម្ម ៦ ស្រទាប់ (6-Tier Architecture Blueprint)' : '2. 6-Tier Architecture Blueprint'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'km'
                ? 'ចុចលើស្រទាប់នីមួយៗខាងក្រោមដើម្បីពិនិត្យមើលសមាសធាតុ និងបច្ចេកវិទ្យាលម្អិត'
                : 'Click any layer below to inspect its core components, technical responsibilities, and code implementation.'}
            </p>
          </div>

          {/* Layer Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {ARCHITECTURE_LAYERS.map((layer) => {
              const isActive = layer.id === activeLayerId;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayerId(layer.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
                    isActive
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-500/15 shadow-sm ring-1 ring-brand-500/20'
                      : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                      isActive ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                    }`}>
                      0{layer.number}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                  </div>
                  <div className={`text-xs font-bold truncate w-full ${isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {language === 'km' ? layer.nameKh.split(' ')[0] : layer.name.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Layer Details Card */}
          <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
                  LAYER 0{activeLayer.number} ARCHITECTURAL SPEC
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {language === 'km' ? activeLayer.nameKh : activeLayer.name}
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeLayer.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {language === 'km' ? activeLayer.descriptionKh : activeLayer.description}
            </p>

            {/* Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {activeLayer.components.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1 text-xs"
                >
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{comp.name}</span>
                  </div>
                  <div className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                    {language === 'km' ? comp.roleKh : comp.role}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-normal leading-relaxed">
                    {comp.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Layer-by-Layer Deep Dive */}
        <section id="deep-dive-layers" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? '៣. វិភាគស្រទាប់នីមួយៗលម្អិត (Layer-by-Layer Deep Dive)' : '3. Layer-by-Layer Detailed Analysis'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'km'
                ? 'ស្វែងយល់ពីតួនាទីលម្អិត និងបច្ចេកវិទ្យាដែលបានប្រើប្រាស់ក្នុងស្រទាប់ទាំង ៦'
                : 'Detailed technical specification and role of every single architectural layer.'}
            </p>
          </div>

          <div className="space-y-4">
            {ARCHITECTURE_LAYERS.map((layer) => (
              <div
                key={layer.id}
                className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-brand-200 dark:border-brand-500/30">
                      0{layer.number}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {language === 'km' ? layer.nameKh : layer.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {layer.technologies.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {language === 'km' ? layer.descriptionKh : layer.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {layer.components.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-xs">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{c.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{language === 'km' ? c.roleKh : c.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Clean Service Pattern Code Sample */}
        <section id="service-pattern-code" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? '៤. គំរូកូដ Clean Service Pattern & DB Row Lock' : '4. Clean Service Pattern & Row Locking'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'km'
                ? 'ឧទាហរណ៍នៃ `PosSaleService.php` ដែលបង្ហាញពីការកាត់ស្តុកដោយសុវត្ថិភាពតាម `DB::transaction()` និង `lockForUpdate()`'
                : 'Audited codebase implementation of transactional stock deduction with pessimistic concurrency locks.'}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-5 sm:p-6 overflow-hidden space-y-3">
            <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-slate-800">
              <span className="text-brand-400 font-bold">backend/app/Services/Sales/POSService.php</span>
              <span className="text-slate-500">PostgreSQL 18 Transaction</span>
            </div>

            <pre className="text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`namespace App\\Services\\Sales;

use App\\Models\\Sales\\Sale;
use App\\Models\\Inventory\\Inventory;
use App\\Models\\POS\\CashRegister;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Validation\\ValidationException;

class POSService
{
    /**
     * Process an in-store POS checkout atomically with row-level stock locks.
     */
    public function checkout(array $data, int $userId): Sale
    {
        return DB::transaction(function () use ($data, $userId) {
            // 1. Lock active cash drawer shift to prevent concurrency race
            $register = CashRegister::where('id', $data['cash_register_id'])
                ->where('status', 'open')
                ->lockForUpdate()
                ->firstOrFail();

            // 2. Validate and atomically deduct stock balance
            foreach ($data['items'] as $item) {
                $inventory = Inventory::where('product_variant_id', $item['variant_id'])
                    ->where('warehouse_id', $data['warehouse_id'])
                    ->lockForUpdate() // PostgreSQL SELECT ... FOR UPDATE
                    ->firstOrFail();

                if ($inventory->quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock for SKU: {$item['sku']}"
                    ]);
                }

                $inventory->decrement('quantity', $item['quantity']);
            }

            // 3. Persist Sale record, payment, and ledger
            $sale = Sale::create([
                'invoice_number' => $this->generateInvoice($data['branch_id']),
                'total_amount'   => $data['total_amount'],
                'payment_method' => $data['payment_method'], // CASH, KHQR
                'created_by'     => $userId,
            ]);

            return $sale;
        });
    }
}`}
            </pre>
          </div>
        </section>

        {/* Section 5: Related Documentation Portals */}
        <section id="related-portals" className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? '៥. ឯកសារបច្ចេកទេសពាក់ព័ន្ធ (Related Documentation Portals)' : '5. Related Portals'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'km'
                ? 'ជ្រើសរើសច្រកទ្វារឯកសារដែលអ្នកចង់ស្វែងយល់លម្អិតបន្ត'
                : 'Continue exploring the technical documentation portals.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/overview"
              className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 hover:shadow-md transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {language === 'km' ? 'ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ' : 'System Overview'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {language === 'km' ? 'សង្ខេបកម្មវិធីទាំង ៤ និងលំហូរទិន្នន័យ។' : '4 connected clients overview.'}
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
