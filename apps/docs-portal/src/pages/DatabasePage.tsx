import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { InteractiveERD } from '../components/diagrams/InteractiveERD';
import { Database, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DatabasePage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'erd-explorer', label: 'Interactive 99-Table Explorer' },
    { id: 'database-design-rules', label: 'Relational Design & Indexing Rules' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'Database (99 Tables)' }]} />

        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-semibold mb-3">
              <Database className="w-3.5 h-3.5" />
              <span>99 Relational Database Tables</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {language === 'km' ? 'វចនានុក្រមតារាងទិន្នន័យ ៩៩ តារាង (Database Reference)' : 'Database Reference & Schema Dictionary'}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              {language === 'km'
                ? 'ឯកសារលម្អិតនៃគ្រប់តារាងទិន្នន័យទាំងអស់ ជាមួយ Column Types, Foreign Keys, Indexes, និងទំនាក់ទំនង Entity-Relationship។'
                : 'Complete dictionary of all 99 inspected PostgreSQL tables from 36 database migrations, including column types, indexes, and foreign keys.'}
            </p>
          </div>

          <Link
            to="/database/er-diagram"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all"
          >
            <Network className="w-4 h-4" />
            <span>Open Dedicated ERD Canvas</span>
          </Link>
        </div>

        {/* Interactive ERD component */}
        <section id="erd-explorer">
          <InteractiveERD />
        </section>

        {/* Design Rules */}
        <section id="database-design-rules" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-mono font-bold">01</span>
            <span>Relational Design, Indexing & Audit Rules</span>
          </h2>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed shadow-2xs">
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Foreign Key Cascades:</strong> All child relations (`sale_items`, `purchase_items`, `order_items`) maintain strict `cascadeOnDelete()` or soft deletes.</li>
              <li><strong>Indexed Foreign Keys:</strong> `company_id`, `branch_id`, `warehouse_id`, `product_id`, `customer_id` columns are explicitly indexed for rapid multi-tenant filtering.</li>
              <li><strong>Immutable Ledgers:</strong> Transaction tables (`inventory_movements`, `cash_register_transactions`, `audit_logs`) are append-only.</li>
            </ul>
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
