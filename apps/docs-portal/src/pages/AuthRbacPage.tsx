import React, { useState, useMemo } from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { PERMISSION_NODES } from '../data/permissionsData';
import { KeyRound, ShieldCheck, Check, X, Search } from 'lucide-react';

export const AuthRbacPage: React.FC = () => {
  const { language } = useDocs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  const domains = useMemo(() => {
    const set = new Set(PERMISSION_NODES.map(p => p.domain));
    return ['ALL', ...Array.from(set).sort()];
  }, []);

  const filteredPerms = useMemo(() => {
    return PERMISSION_NODES.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDomain = selectedDomain === 'ALL' || p.domain === selectedDomain;
      return matchSearch && matchDomain;
    });
  }, [searchQuery, selectedDomain]);

  const tocItems = [
    { id: 'jwt-auth-flow', label: 'JWT Dual-Token Flow' },
    { id: 'permission-matrix', label: '84-Node Permission Matrix' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'Authentication & RBAC' }]} />

        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Spatie Role-Based Access Control</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'ការផ្ទៀងផ្ទាត់សិទ្ធិ និងតារាង Spatie RBAC Matrix' : 'Authentication & Spatie RBAC Matrix'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'ស្ថាបត្យកម្មសុវត្ថិភាព JWT Dual Token, Silent Refresh, Multi-Tenant Scoping, និងតារាងសិទ្ធិប្រើប្រាស់ពេញលេញសម្រាប់តួនាទីទាំង ៦ ក្នុងប្រព័ន្ធ។'
              : 'Cryptographic JWT authentication lifecycle, token rotation mechanics, multi-tenant company isolation, and granular Spatie permission assignment matrix.'}
          </p>
        </div>

        {/* 1. JWT Flow */}
        <section id="jwt-auth-flow" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>JWT Dual-Token Authentication Lifecycle</span>
          </h2>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed shadow-2xs">
            <p>
              ប្រព័ន្ធមិនប្រើប្រាស់ State លើ Server ឡើយ ដោយប្រើ <strong>Stateless Cryptographic JWT</strong>៖
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li><strong>User Login:</strong> `POST /api/v1/auth/login` validates credentials with Bcrypt and returns `access_token` (15 min) + `refresh_token` (30 days).</li>
              <li><strong>Bearer Authorization:</strong> Client passes `Authorization: Bearer &lt;access_token&gt;` in all API requests.</li>
              <li><strong>Silent Token Refresh:</strong> Before access token expires, client dispatches `POST /api/v1/auth/refresh` to rotate tokens seamlessly without user interaction.</li>
            </ol>
          </div>
        </section>

        {/* 2. Permission Matrix Table */}
        <section id="permission-matrix" className="mb-12">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Granular Spatie Permission Matrix</span>
            </h2>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {filteredPerms.length} permissions listed
            </div>
          </div>

          {/* Search bar & domain filter */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search permission node (e.g. sale.create, product.delete)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {domains.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDomain(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                    selectedDomain === d
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-3 shadow-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3">Permission Node</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3 text-center">Super Admin</th>
                  <th className="py-2.5 px-3 text-center">Admin</th>
                  <th className="py-2.5 px-3 text-center">Manager</th>
                  <th className="py-2.5 px-3 text-center">Cashier</th>
                  <th className="py-2.5 px-3 text-center">Warehouse</th>
                  <th className="py-2.5 px-3 text-center">Customer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredPerms.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">{p.name}</td>
                    <td className="py-2.5 px-3 text-brand-600 dark:text-brand-400">{p.domain}</td>
                    <td className="py-2.5 px-3 text-center">
                      {p.roles.super_admin ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 dark:text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {p.roles.admin ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 dark:text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {p.roles.manager ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 dark:text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {p.roles.cashier ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 dark:text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {p.roles.warehouse_staff ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 dark:text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {p.roles.customer ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-400 dark:text-slate-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
