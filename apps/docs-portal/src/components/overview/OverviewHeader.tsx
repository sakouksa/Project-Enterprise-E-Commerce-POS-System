import React from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { REAL_SYSTEM_STATS } from '../../data/systemStats';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  FileText,
  CheckCircle2,
  Database,
  Layers,
  Radio,
  ShieldCheck,
  Sparkles,
  Calendar,
  Tag,
  Activity
} from 'lucide-react';

export const OverviewHeader: React.FC = () => {
  const { language, t } = useDocs();

  const titleMap = {
    km: 'ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធសហគ្រាស (System Overview)',
    en: 'Enterprise System Architecture & Executive Overview',
    th: 'ภาพรวมสถาปัตยกรรมระบบระดับองค์กร (System Overview)',
    vi: 'Tổng quan Kiến trúc Hệ thống Doanh nghiệp',
    zh: '企业级全渠道系统架构与执行总览 (System Overview)',
  };

  const subtitleMap = {
    km: 'មគ្គុទ្ទេសក៍ស្ថាបត្យកម្មកម្រិតសហគ្រាស ពន្យល់លម្អិតអំពីស្ថាបត្យកម្មប្រព័ន្ធ កម្មវិធីទាំង ៤ លំហូរទិន្នន័យ តក្កវិជ្ជាអាជីវកម្ម ឃ្លាំងទិន្នន័យ PostgreSQL 18, ម៉ាស៊ីនកណ្តាល Laravel 12 និងរបៀបដែលប្រព័ន្ធដំណើរការរួមគ្នា។',
    en: 'Understand the multi-tier architecture, 4 core applications, unified data flow, business domain workflows, PostgreSQL 18 schema, and Laravel 12 backend engine behind the Enterprise E-Commerce + POS Platform.',
    th: 'ทำความเข้าใจสถาปัตยกรรมแบบหลายชั้น 4 แอปพลิเคชันหลัก การไหลของข้อมูล เวิร์กโฟลว์ธุรกิจ ฐานข้อมูล PostgreSQL 18 และแบ็กเอนด์ Laravel 12',
    vi: 'Tìm hiểu kiến trúc đa tầng, 4 ứng dụng cốt lõi, luồng dữ liệu, quy trình kinh doanh, cơ sở dữ liệu PostgreSQL 18 và Laravel 12.',
    zh: '深入理解企业级全渠道零售系统的多层架构、4大核心应用、数据全生命周期流向、核心业务逻辑闭环、PostgreSQL 18数据库与Laravel 12中枢引擎。',
  };

  return (
    <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
      <Breadcrumb items={[{ label: language === 'km' ? 'ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ' : 'Executive Overview' }]} />

      {/* Eyebrow & Metadata Chips */}
      <div className="flex items-center gap-2 flex-wrap mb-4 mt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold font-mono">
          <FileText className="w-3.5 h-3.5" />
          <span>System Architecture Whitepaper</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-bold">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>v1.0.0 Production Ready</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-[11px] font-mono">
          <Tag className="w-3 h-3" />
          <span>Laravel 12 • PostgreSQL 18</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[11px] font-mono">
          <Calendar className="w-3 h-3" />
          <span>Audited: August 2026</span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
        {titleMap[language] || titleMap.en}
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 max-w-4xl leading-relaxed font-normal">
        {subtitleMap[language] || subtitleMap.en}
      </p>

      {/* Quick Verified Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {REAL_SYSTEM_STATS.databaseTablesCount}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            {t.metricDbTables}
          </div>
          <div className="text-[9px] font-mono text-purple-600 dark:text-purple-400 mt-1">
            36 Migrations
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {REAL_SYSTEM_STATS.eloquentModelsCount}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            {t.metricModels}
          </div>
          <div className="text-[9px] font-mono text-blue-600 dark:text-blue-400 mt-1">
            Eloquent Entities
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {REAL_SYSTEM_STATS.apiEndpointsCount}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            {t.metricApis}
          </div>
          <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            74 Controllers
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {REAL_SYSTEM_STATS.adminPagesCount}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            {t.metricAdminPages}
          </div>
          <div className="text-[9px] font-mono text-sky-600 dark:text-sky-400 mt-1">
            React 19 + AntD
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {REAL_SYSTEM_STATS.customerPagesCount}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            {t.metricCustomerPages}
          </div>
          <div className="text-[9px] font-mono text-teal-600 dark:text-teal-400 mt-1">
            React 19 Store
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center">
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
            5
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            i18n Locales
          </div>
          <div className="text-[9px] font-mono text-amber-600 dark:text-amber-400 mt-1">
            KM, EN, TH, VI, ZH
          </div>
        </div>
      </div>
    </div>
  );
};
