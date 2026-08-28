import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { TECH_STACK_DATA } from '../data/systemStats';
import { Cpu, CheckCircle2, Shield, Smartphone, Layers, Database } from 'lucide-react';

export const TechStackPage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'backend-stack', label: 'Backend Framework & Libraries' },
    { id: 'admin-stack', label: 'Admin Dashboard Stack' },
    { id: 'customer-stack', label: 'Customer Storefront Stack' },
    { id: 'mobile-stack', label: 'Flutter Mobile App Stack' },
    { id: 'infra-stack', label: 'Database & Infrastructure' },
  ];

  const renderTechTable = (items: typeof TECH_STACK_DATA.backend) => (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-4 shadow-sm">
      <table className="w-full text-left text-xs font-mono">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <th className="py-2.5 px-3">Technology / Package</th>
            <th className="py-2.5 px-3">Version</th>
            <th className="py-2.5 px-3">Category</th>
            <th className="py-2.5 px-3">Purpose & Architectural Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
              <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{item.name}</span>
              </td>
              <td className="py-2.5 px-3 text-brand-600 dark:text-brand-400 font-semibold">{item.version}</td>
              <td className="py-2.5 px-3">
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {item.tag}
                </span>
              </td>
              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-sans text-xs">{item.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'Technology Stack' }]} />

        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Audited Production Technologies</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'បច្ចេកវិទ្យា និងបណ្ណាល័យដែលប្រើប្រាស់ពិតប្រាកដ' : 'Real Production Technology Stack'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'រាយនាមបច្ចេកវិទ្យា កំណែ Version និងបណ្ណាល័យដែលបានដំឡើងពិតប្រាកដក្នុងគម្រោង ដោយមិនមានការបង្កើតឈ្មោះក្លែងក្លាយឡើយ។'
              : 'Complete inventory of real inspected packages, libraries, and frameworks installed in the backend composer.json, frontend package.json, and Flutter pubspec.yaml.'}
          </p>
        </div>

        {/* Backend Stack */}
        <section id="backend-stack" className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-pink-500" />
            <span>1. Laravel 12 Backend & PHP 8.2+ Dependencies</span>
          </h2>
          {renderTechTable(TECH_STACK_DATA.backend)}
        </section>

        {/* Admin Dashboard Stack */}
        <section id="admin-stack" className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>2. React 19 Admin Dashboard Dependencies</span>
          </h2>
          {renderTechTable(TECH_STACK_DATA.adminDashboard)}
        </section>

        {/* Customer Website Stack */}
        <section id="customer-stack" className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            <span>3. React 19 Customer Storefront Dependencies</span>
          </h2>
          {renderTechTable(TECH_STACK_DATA.customerWebsite)}
        </section>

        {/* Mobile App Stack */}
        <section id="mobile-stack" className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-500" />
            <span>4. Flutter 3.2+ Mobile Terminal Dependencies</span>
          </h2>
          {renderTechTable(TECH_STACK_DATA.mobileApp)}
        </section>

        {/* Database & Infrastructure */}
        <section id="infra-stack" className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <span>5. Database, Cache, Storage & DevOps Infrastructure</span>
          </h2>
          {renderTechTable(TECH_STACK_DATA.infraDatabase)}
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
