import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useDocs } from '../stores/useDocsStore';
import { ENTERPRISE_MODULES } from '../data/modulesData';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { StatusBadge } from '../components/common/StatusBadge';
import { BehindTheButton } from '../components/common/BehindTheButton';
import {
  Database,
  Radio,
  Workflow,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Video,
  Lock,
} from 'lucide-react';

export const ModuleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useDocs();

  const module = ENTERPRISE_MODULES.find(m => m.id === id);

  if (!module) {
    return <Navigate to="/modules" replace />;
  }

  const tocItems = [
    { id: 'overview-purpose', label: 'Overview & Purpose' },
    { id: 'features-list', label: 'Feature Matrix' },
    { id: 'database-tables', label: 'Database Tables & Models' },
    { id: 'backend-apis', label: 'Backend API Endpoints' },
    { id: 'business-rules', label: 'Core Business Rules' },
    { id: 'workflow-steps', label: 'Step-by-Step Workflow' },
    ...(module.behindTheButton ? [{ id: 'behind-the-button', label: 'Behind the Button' }] : []),
    ...(module.videoScript ? [{ id: 'video-script', label: 'Video Tutorial Script' }] : []),
    { id: 'troubleshooting', label: 'Troubleshooting & Errors' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb
          items={[
            { label: 'Modules', path: '/modules' },
            { label: module.name }
          ]}
        />

        {/* Module Header */}
        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
                MODULE: {module.id.toUpperCase()}
              </span>
              <span className="text-xs uppercase font-semibold text-slate-500">
                Category: {module.category}
              </span>
            </div>
            <StatusBadge status={module.status} size="lg" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? module.nameKh : module.name}
          </h1>

          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 mt-3 leading-relaxed max-w-4xl">
            {language === 'km' ? module.overviewKh : module.overview}
          </p>

          {/* Quick Target Users & Permissions bar */}
          <div className="flex items-center gap-2 mt-4 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Target Users:</span>
            {module.targetUsers.map((user, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
                {user}
              </span>
            ))}
          </div>
        </div>

        {/* 1. Overview & Purpose */}
        <section id="overview-purpose" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>{language === 'km' ? 'គោលបំណង និងការប្រើប្រាស់ (Purpose)' : 'Purpose & Objectives'}</span>
          </h2>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-sm text-slate-700 dark:text-slate-200 leading-relaxed shadow-2xs">
            {language === 'km' ? module.purposeKh : module.purpose}
          </div>
        </section>

        {/* 2. Feature Matrix */}
        <section id="features-list" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>{language === 'km' ? 'មុខងារសំខាន់ៗនៃម៉ូឌុល (Features Matrix)' : 'Key Features Matrix'}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {module.mainFeatures.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {language === 'km' ? feat.titleKh : feat.title}
                  </h4>
                  <StatusBadge status={feat.status} size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'km' ? feat.descKh : feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Database Tables & Models */}
        <section id="database-tables" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>{language === 'km' ? 'តារាងទិន្នន័យ & Eloquent Models' : 'Database Tables & Eloquent Models'}</span>
          </h2>
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Database Tables</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {module.databaseTables.map((table, idx) => (
                    <Link
                      key={idx}
                      to={`/database?table=${table}`}
                      className="px-2.5 py-1 rounded-xl text-xs font-mono bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 hover:bg-purple-100 dark:hover:bg-purple-500/20 flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Database className="w-3 h-3" />
                      <span>{table}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Eloquent Models</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {module.models.map((m, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl text-xs font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 shadow-2xs">
                      App\Models\{m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Backend APIs */}
        <section id="backend-apis" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>{language === 'km' ? 'បណ្តាញ REST API Endpoints' : 'Backend REST API Endpoints'}</span>
          </h2>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-3 shadow-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Endpoint Path</th>
                  <th className="py-2.5 px-3">Permission Required</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {module.backendApis.map((api, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        api.method === 'GET' ? 'bg-sky-50 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30' :
                        api.method === 'POST' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' :
                        api.method === 'PUT' ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30' :
                        'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                      }`}>
                        {api.method}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">{api.path}</td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      {api.permission ? <code className="text-purple-600 dark:text-purple-400 font-semibold">{api.permission}</code> : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-sans">{api.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. Core Business Rules */}
        <section id="business-rules" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>{language === 'km' ? 'តក្កវិជ្ជា និងលក្ខខណ្ឌអាជីវកម្ម (Business Rules)' : 'Core Business Rules'}</span>
          </h2>
          <div className="space-y-3">
            {module.businessRules.map((rule, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {language === 'km' ? rule.titleKh : rule.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'km' ? rule.ruleKh : rule.rule}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Step-by-Step Workflow */}
        <section id="workflow-steps" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>{language === 'km' ? 'លំហូរប្រតិបត្តិការមួយជំហានម្តងៗ (Workflow)' : 'Operational Workflow'}</span>
          </h2>
          <div className="space-y-3">
            {module.workflowSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-2xs">
                <div className="w-7 h-7 rounded-xl bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-400 flex items-center justify-center text-xs font-mono font-bold shrink-0 shadow-2xs">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {language === 'km' ? step.titleKh : step.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      Actor: {step.actor}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {language === 'km' ? step.descKh : step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Behind the Button */}
        {module.behindTheButton && (
          <section id="behind-the-button" className="mb-12">
            <BehindTheButton
              actionName={module.behindTheButton.actionName}
              steps={module.behindTheButton.steps}
            />
          </section>
        )}

        {/* 8. Video Tutorial Script */}
        {module.videoScript && (
          <section id="video-script" className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>{language === 'km' ? 'អត្ថបទសំឡេងសម្រាប់វីដេអូបង្រៀន (Video Script)' : 'Training Video Narrator Script'}</span>
            </h2>
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4 shadow-2xs">
              <div className="text-xs font-mono text-brand-600 dark:text-brand-400 font-bold mb-2">
                Video Title: {module.videoScript.title} ({module.videoScript.duration})
              </div>
              <div className="space-y-3">
                {module.videoScript.steps.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 mb-1">
                      Step {s.order}: {s.action}
                    </div>
                    <div className="text-xs text-slate-900 dark:text-slate-200 font-medium">🇰🇭 {s.narrationKh}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5">🇬🇧 {s.narrationEn}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. Troubleshooting */}
        <section id="troubleshooting" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>{language === 'km' ? 'កំហុសញឹកញាប់ និងវិធីដោះស្រាយ (Troubleshooting)' : 'Common Errors & Troubleshooting'}</span>
          </h2>
          <div className="space-y-3">
            {module.commonErrors.map((err, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5 shadow-2xs">
                <div className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 mb-1">
                  Error Code {err.code}: {err.problem}
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Solution: </span>
                  {err.solution}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
