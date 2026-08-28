import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { StatusBadge } from '../components/common/StatusBadge';
import { Boxes, Search, ArrowRight } from 'lucide-react';
import { docsService } from '../services/docsService';
import { useDebounce } from '../hooks/useDebounce';

export const ModulesIndexPage: React.FC = () => {
  const { language } = useDocs();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 200);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'core', label: 'Core & System' },
    { id: 'catalog', label: 'Product Catalog' },
    { id: 'sales', label: 'Sales & POS' },
    { id: 'inventory', label: 'Inventory & Stock' },
    { id: 'procurement', label: 'Procurement' },
    { id: 'hrm', label: 'HR & Attendance' },
    { id: 'finance', label: 'Finance & Taxes' },
    { id: 'marketing', label: 'Marketing & CMS' },
    { id: 'settings', label: 'Settings & Security' },
  ];

  const filteredModules = useMemo(() => {
    return docsService.searchModules(debouncedSearch, selectedCategory);
  }, [debouncedSearch, selectedCategory]);

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: 'System Modules' }]} />

      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
            <Boxes className="w-3.5 h-3.5" />
            <span>Enterprise Module Explorer</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'កាតាឡុកម៉ូឌុលទាំង ៣២ នៃប្រព័ន្ធ' : 'Complete 32 System Modules Directory'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'ម៉ូឌុលនីមួយៗមានឯកសារលម្អិតពីគោលបំណង, មុខងារ, តារាងទិន្នន័យ, API Endpoints, តក្កវិជ្ជាអាជីវកម្ម, លំហូរ "អ្វីដែលកើតឡើងនៅក្រោយប៊ូតុង", និង Video Script។'
              : 'Every single enterprise module comes with detailed technical specs, schema relations, API endpoints, business rules, "Behind the Button" flows, and training video scripts.'}
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-600 dark:text-brand-400 font-bold shadow-2xs">
          {filteredModules.length} Modules Found
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search module by name, slug or keyword..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-sm font-bold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((module) => (
          <Link
            key={module.id}
            to={`/modules/${module.id}`}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/90 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-950 text-brand-700 dark:text-brand-400 border border-slate-200 dark:border-slate-800">
                  {module.id}
                </span>
                <StatusBadge status={module.status} size="sm" />
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors mb-1">
                {language === 'km' ? module.nameKh : module.name}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                {language === 'km' ? module.overviewKh : module.overview}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                {module.databaseTables.length} tables • {module.backendApis.length} APIs
              </span>
              <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Specs <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
