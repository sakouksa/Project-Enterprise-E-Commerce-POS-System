import React, { useState, useMemo } from 'react';
import { docsService } from '../../services/docsService';
import { useDocs } from '../../stores/useDocsStore';
import { Database, Search, Key, Link as LinkIcon } from 'lucide-react';
import { DatabaseTable } from '../../types/docs';
import { useDebounce } from '../../hooks/useDebounce';

export const InteractiveERD: React.FC = () => {
  const { language } = useDocs();
  const allTables = useMemo(() => docsService.getAllTables(), []);
  const [selectedTable, setSelectedTable] = useState<DatabaseTable>(allTables[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 150);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set(allTables.map(t => t.category));
    return ['All', ...Array.from(set).sort()];
  }, [allTables]);

  const filteredTables = useMemo(() => {
    return docsService.searchTables(debouncedSearch, selectedCategory);
  }, [debouncedSearch, selectedCategory]);

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 md:p-8 shadow-md dark:shadow-2xl my-8 backdrop-blur-xl transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
            Interactive Schema & ERD Explorer
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {language === 'km' ? 'ដ្យាក្រាមទំនាក់ទំនងទិន្នន័យ ៩៩ តារាង (Interactive ERD)' : 'Interactive Database Entity-Relationship Diagram (99 Tables)'}
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Showing {filteredTables.length} of {allTables.length} tables
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search table or Eloquent model..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm font-bold'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Split: Table List & Column Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Table List */}
        <div className="lg:col-span-4 max-h-[550px] overflow-y-auto pr-2 space-y-2">
          {filteredTables.map((table) => {
            const isSelected = table.name === selectedTable.name;
            return (
              <div
                key={table.name}
                onClick={() => setSelectedTable(table)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-600/15 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {table.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {table.columns.length} cols
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>Model: <code className="text-emerald-600 dark:text-emerald-400 font-semibold">{table.model}</code></span>
                  <span className="text-[10px] text-slate-500">{table.category}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Column Schema Inspector */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/90 p-6 overflow-hidden flex flex-col shadow-inner">
          <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h4 className="text-lg font-mono font-black text-slate-900 dark:text-slate-100">{selectedTable.name}</h4>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
                  {selectedTable.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {language === 'km' ? selectedTable.purposeKh : selectedTable.purpose}
              </p>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Model: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedTable.model}</span>
            </div>
          </div>

          {/* Schema Table */}
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-white/60 dark:bg-slate-900/60 sticky top-0">
                  <th className="py-2.5 px-3">Column Name</th>
                  <th className="py-2.5 px-3">Data Type</th>
                  <th className="py-2.5 px-3">Key / Constraint</th>
                  <th className="py-2.5 px-3">Nullable</th>
                  <th className="py-2.5 px-3">Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {selectedTable.columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {col.key === 'PK' && <Key className="w-3 h-3 text-amber-500" />}
                      {col.key === 'FK' && <LinkIcon className="w-3 h-3 text-brand-600 dark:text-brand-400" />}
                      <span>{col.name}</span>
                    </td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">{col.type}</td>
                    <td className="py-2 px-3">
                      {col.key ? (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          col.key === 'PK' ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30' :
                          col.key === 'FK' ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {col.key} {col.references ? `→ ${col.references}` : ''}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {col.nullable ? <span className="text-amber-600 dark:text-amber-400 font-semibold">YES</span> : <span className="text-slate-400 dark:text-slate-500">NO</span>}
                    </td>
                    <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{col.default !== undefined ? col.default : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
