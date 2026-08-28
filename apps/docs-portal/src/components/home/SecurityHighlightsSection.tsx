import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { Shield, KeyRound, Lock, FileCheck2, Building2, Layers, ArrowRight } from 'lucide-react';

export const SecurityHighlightsSection: React.FC = () => {
  const { t } = useDocs();

  const securityFeatures = [
    {
      title: 'JWT Multi-Tenant Authentication',
      desc: 'Stateless JSON Web Tokens with automated refresh cycles and blacklisting on logout.',
      icon: KeyRound,
      badge: 'Tymon JWT',
    },
    {
      title: '169 Spatie RBAC Permission Nodes',
      desc: 'Fine-grained policy-driven access matrix across Super Admin, Admin, Cashier, and Warehouse roles.',
      icon: Lock,
      badge: 'Spatie v6',
    },
    {
      title: 'Multi-Branch Tenant Isolation',
      desc: 'Automatic global query scopes isolating warehouse inventory, orders, and cash registers per company/branch.',
      icon: Building2,
      badge: 'Tenant Scopes',
    },
    {
      title: 'Atomic Row-Level Stock Locking',
      desc: 'PostgreSQL pessimistic selectForUpdate transactions to eliminate race conditions in high-speed checkouts.',
      icon: Shield,
      badge: 'Pessimistic Lock',
    },
    {
      title: 'Comprehensive Audit Logging',
      desc: 'Immutable tracking of all create, update, delete, stock transfer, and cash balance adjustments.',
      icon: FileCheck2,
      badge: 'Audit Trail',
    },
    {
      title: 'Strict Request Validation',
      desc: 'FormRequest classes validating all inputs with sanitization and rate limiting on API endpoints.',
      icon: Layers,
      badge: 'Rate Limited',
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-md dark:shadow-2xl transition-colors duration-200">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            Enterprise Grade Protection
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {t.securityTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            {t.securitySubtitle}
          </p>
        </div>

        <Link
          to="/auth-rbac"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        >
          <span>View RBAC Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  {feat.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
