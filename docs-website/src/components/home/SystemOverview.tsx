import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { MonitorCheck, ShoppingBag, Smartphone, Cpu, Database, Server, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

export const SystemOverview: React.FC = () => {
  const { t } = useDocs();

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              System Blueprint
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
            {t.systemOverviewTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {t.systemOverviewSubtitle}
          </p>
        </div>

        <Link
          to="/architecture"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors shrink-0"
        >
          <span>{t.exploreArchitecture}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Simplified Architecture Flow Layout */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Row 1: Frontend Clients */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/admin-guide"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 hover:border-brand-500/50 transition-all flex items-center gap-3 shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MonitorCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">Admin Dashboard</div>
              <div className="text-[11px] font-mono text-slate-500">React 19 (Port 5173)</div>
            </div>
          </Link>

          <Link
            to="/customer-guide"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 hover:border-emerald-500/50 transition-all flex items-center gap-3 shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">Customer Website</div>
              <div className="text-[11px] font-mono text-slate-500">React 19 (Port 5174)</div>
            </div>
          </Link>

          <Link
            to="/mobile-guide"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 hover:border-purple-500/50 transition-all flex items-center gap-3 shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">Flutter Mobile</div>
              <div className="text-[11px] font-mono text-slate-500">Flutter 3.24 (iOS / Android)</div>
            </div>
          </Link>
        </div>

        {/* Direction Indicator */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span>HTTPS REST JSON • JWT Authentication • Spatie 169 Permissions</span>
          </div>
        </div>

        {/* Row 2: Laravel 12 Backend Engine */}
        <Link
          to="/api"
          className="block p-4 sm:p-5 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-emerald-50/60 dark:from-brand-950/30 dark:via-sky-950/20 dark:to-emerald-950/30 hover:border-brand-500/60 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">Laravel 12 REST Core Engine</div>
                <div className="text-xs text-brand-700 dark:text-brand-300 font-mono">PHP 8.2 • 74 Controller Domains • Atomic Row-Level Stock Locking</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-brand-100 dark:bg-brand-500/20 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
              759 Active Endpoints
            </span>
          </div>
        </Link>

        {/* Direction Indicator */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ACID Transactions • Row-Lock Isolation • Redis Caching</span>
          </div>
        </div>

        {/* Row 3: Data Tier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/database"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 hover:border-purple-500/50 transition-all flex items-center gap-3 shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">PostgreSQL 18 Database</div>
              <div className="text-[11px] font-mono text-slate-500">99 Relational Tables • 36 Migrations</div>
            </div>
          </Link>

          <Link
            to="/tech-stack"
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 hover:border-amber-500/50 transition-all flex items-center gap-3 shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Server className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">Redis 7 Cache & Queues</div>
              <div className="text-[11px] font-mono text-slate-500">In-Memory Stock Locks & Asynchronous Jobs</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
