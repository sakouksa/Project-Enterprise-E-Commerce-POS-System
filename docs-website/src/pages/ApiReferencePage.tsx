import React, { useState, useMemo } from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { CodeBlock } from '../components/common/CodeBlock';
import { Radio, Search, Lock, ChevronDown, ChevronRight } from 'lucide-react';
import { docsService } from '../services/docsService';
import { useDebounce } from '../hooks/useDebounce';

export const ApiReferencePage: React.FC = () => {
  const { language } = useDocs();
  const allApis = useMemo(() => docsService.getAllApis(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 150);
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(allApis[0]?.id || null);

  const methods = ['ALL', 'GET', 'POST', 'PUT', 'DELETE'];

  const filteredRoutes = useMemo(() => {
    return docsService.searchApis(debouncedSearch, selectedMethod, selectedModule);
  }, [debouncedSearch, selectedMethod, selectedModule]);

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'API Reference (759 Endpoints)' }]} />

        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
            <Radio className="w-3.5 h-3.5" />
            <span>759 Audited Laravel REST Endpoints</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'ឯកសារយោង REST API (៧៥៩ Endpoints)' : 'Interactive REST API Reference'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'កាតាឡុក API ផ្លូវការទាំងអស់នៃប្រព័ន្ធ ចែកតាម ៧៤ Controller Domains ជាមួយគំរូ Request/Response, Status Codes, និងសិទ្ធិ Spatie Permissions។'
              : 'Complete reference for all 759 routes extracted from Laravel route:list, grouped by 74 domain modules.'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by path, controller, or action..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
            />
          </div>

          {/* Method Filters */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            {methods.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  selectedMethod === m
                    ? m === 'GET' ? 'bg-sky-600 text-white' :
                      m === 'POST' ? 'bg-emerald-600 text-white' :
                      m === 'PUT' ? 'bg-amber-600 text-white' :
                      m === 'DELETE' ? 'bg-rose-600 text-white' :
                      'bg-brand-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Showing {filteredRoutes.length} of {allApis.length} APIs
          </div>
        </div>

        {/* Endpoints List */}
        <div className="space-y-3">
          {filteredRoutes.slice(0, 100).map((api) => {
            const isExpanded = expandedId === api.id;
            return (
              <div
                key={api.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition-all shadow-2xs hover:shadow-sm"
              >
                {/* Collapsed Header Bar */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : api.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold shrink-0 ${
                      api.method === 'GET' ? 'bg-sky-50 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30' :
                      api.method === 'POST' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' :
                      api.method === 'PUT' ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30' :
                      'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                    }`}>
                      {api.method}
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{api.path}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                      {api.controller}@{api.action}
                    </span>
                    {api.auth ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/20">
                        <Lock className="w-3 h-3" /> Auth
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        Public
                      </span>
                    )}
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/80 space-y-4">
                    <div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">Description</div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">{language === 'km' ? api.summaryKh : api.summary}</p>
                    </div>

                    {api.permission && (
                      <div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">Required Spatie Permission</div>
                        <code className="text-xs px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 font-mono font-semibold">
                          {api.permission}
                        </code>
                      </div>
                    )}

                    {/* Example curl code */}
                    <div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">cURL Example</div>
                      <CodeBlock
                        language="bash"
                        code={`curl -X ${api.method} "http://localhost:8000${api.path}" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer <YOUR_JWT_ACCESS_TOKEN>"`}
                      />
                    </div>

                    {/* Response Sample */}
                    <div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">200 OK Response Schema</div>
                      <CodeBlock
                        language="json"
                        code={JSON.stringify(api.responseSample, null, 2)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
