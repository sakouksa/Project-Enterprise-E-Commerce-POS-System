import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { CodeBlock } from '../components/common/CodeBlock';
import { Code2 } from 'lucide-react';

export const DeveloperGuidePage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'dev-prerequisites', label: 'Prerequisites & Tooling' },
    { id: 'local-setup', label: 'Local Development Setup (1-Command)' },
    { id: 'db-migrations-seeders', label: 'Database Migrations & Seeders' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'Developer Guide' }]} />

        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer & Contributor Handbook</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'មគ្គុទ្ទេសក៍អ្នកអភិវឌ្ឍន៍ (Developer & Engineering Guide)' : 'Developer & Engineering Guide'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'មគ្គុទ្ទេសក៍ដំឡើងប្រព័ន្ធក្នុង Localhost, ពាក្យបញ្ជាសំខាន់ៗ, ការដំណើរការ Migrations/Seeders, ស្តង់ដារកូដ, និងស្ថាបត្យកម្ម Service Pattern។'
              : 'Complete engineering guide detailing local environment setup, concurrently executing all sub-projects, seeding test data, coding guidelines, and deployment practices.'}
          </p>
        </div>

        {/* 1. Prerequisites */}
        <section id="dev-prerequisites" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-mono font-bold">01</span>
            <span>Prerequisites & Requirements</span>
          </h2>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2 shadow-2xs">
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>PHP:</strong> &gt;= 8.2 with `pdo_pgsql`, `mbstring`, `gd`, `bcmath`, `redis` extensions</li>
              <li><strong>Node.js:</strong> &gt;= 20.x with `npm` or `pnpm`</li>
              <li><strong>Database:</strong> PostgreSQL 18+</li>
              <li><strong>Redis:</strong> 7.x (Optional for local dev, mandatory for prod queue)</li>
              <li><strong>Composer:</strong> &gt;= 2.6</li>
            </ul>
          </div>
        </section>

        {/* 2. 1-Command Local Setup */}
        <section id="local-setup" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">02</span>
            <span>Single-Command Local Environment Setup</span>
          </h2>
          <div className="space-y-4">
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
              នៅក្នុង Root directory នៃគម្រោង ដំណើរការ `npm run dev` ដែលនឹង Boot គ្រប់ Sub-projects ទាំងអស់ក្នុងពេលដំណាលគ្នា៖
            </p>
            <CodeBlock
              language="bash"
              filename="Terminal (Workspace Root)"
              code={`# 1. Install root dependencies
npm install

# 2. Run All 3 Projects Concurrently
npm run dev

# Output:
# [BACKEND]  Laravel development server started on http://127.0.0.1:8000
# [ADMIN]    VITE v8.1.1 ready in 240 ms -> http://localhost:5173/
# [CUSTOMER] VITE v8.1.1 ready in 180 ms -> http://localhost:5174/`}
            />
          </div>
        </section>

        {/* 3. Migrations & Seeders */}
        <section id="db-migrations-seeders" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-mono font-bold">03</span>
            <span>Database Migrations & Seeders</span>
          </h2>
          <div className="space-y-4">
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
              រៀបចំតារាងទាំង ៩៩ និងទិន្នន័យគំរូ (Products, Users, Roles, RBAC, Images):
            </p>
            <CodeBlock
              language="bash"
              filename="Terminal (backend/ directory)"
              code={`cd backend

# Run all 36 migrations and 19 seeders cleanly
php artisan migrate:fresh --seed

# Output includes:
# - Roles and permissions seeded (Super Admin, Admin, Manager, Cashier, Warehouse)
# - Real product catalog seeded with 50+ embedded images (DatabaseImageSeeder)
# - Company, branches, warehouses, departments, and shifts`}
            />
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
