import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { InteractiveERD } from '../components/diagrams/InteractiveERD';
import { Network } from 'lucide-react';

export const ERDiagramPage: React.FC = () => {
  const { language } = useDocs();

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { label: 'Database', path: '/database' },
          { label: 'Interactive ER Diagram' }
        ]}
      />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-semibold mb-3">
          <Network className="w-3.5 h-3.5" />
          <span>Fullscreen Relational Canvas</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'ដ្យាក្រាមទំនាក់ទំនងទិន្នន័យ ER Diagram ពេញលេញ' : 'Dedicated Entity-Relationship Diagram (ERD)'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {language === 'km'
            ? 'ស្វែងយល់ពីទំនាក់ទំនងរវាង Company, Branch, Warehouse, Products, Inventory, Sales, Purchases, Employees, Attendance, និង Spatie Permissions។'
            : 'Interactive visual exploration of the 99 database entities and their relational foreign key mapping.'}
        </p>
      </div>

      <InteractiveERD />
    </div>
  );
};
