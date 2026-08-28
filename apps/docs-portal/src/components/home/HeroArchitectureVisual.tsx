import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, Smartphone, Cpu, Database, Server, ArrowRight, Layers, Lock, Zap } from 'lucide-react';
import { useDocs } from '../../stores/useDocsStore';

export const HeroArchitectureVisual: React.FC = () => {
  const { language } = useDocs();

  const clientLayers = [
    {
      id: 'admin',
      name: language === 'km' ? 'Admin Dashboard' : language === 'zh' ? '管理后台' : language === 'th' ? 'แดชบอร์ด Admin' : language === 'vi' ? 'Bảng Admin' : 'Admin Dashboard',
      tech: 'React 19',
      port: ':5173',
      icon: ShieldCheck,
      path: '/admin-guide',
      badgeColor: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
      iconBg: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/30',
    },
    {
      id: 'store',
      name: language === 'km' ? 'Customer Store' : language === 'zh' ? '客户商城' : language === 'th' ? 'หน้าร้านค้า' : language === 'vi' ? 'Trang Khách' : 'Customer Store',
      tech: 'React 19',
      port: ':5174',
      icon: ShoppingBag,
      path: '/customer-guide',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/30',
    },
    {
      id: 'mobile',
      name: language === 'km' ? 'Mobile App' : language === 'zh' ? 'Flutter移动端' : language === 'th' ? 'แอปมือถือ' : language === 'vi' ? 'App Di Động' : 'Mobile App',
      tech: 'Flutter 3',
      port: 'iOS / Android',
      icon: Smartphone,
      path: '/mobile-guide',
      badgeColor: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
      iconBg: 'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/30',
    },
  ];

  return (
    <div className="relative w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 p-4 sm:p-5 lg:p-6 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-all duration-200 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
            {language === 'km' ? 'ស្ថាបត្យកម្មប្រព័ន្ធរួម ៣ ជាន់' : 'Unified 3-Tier Architecture'}
          </span>
        </div>
        <Link
          to="/architecture"
          className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>{language === 'km' ? '៦ ស្រទាប់' : '6 Layers'}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {/* Tier 1: Frontend Clients (3 platforms) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-brand-600 dark:text-brand-400" />
              <span>{language === 'km' ? 'Client Frontends' : 'Frontend Clients'}</span>
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[9px]">Tier 1</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {clientLayers.map((client) => {
              const Icon = client.icon;
              return (
                <Link
                  key={client.id}
                  to={client.path}
                  className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 hover:border-brand-500/50 hover:bg-white dark:hover:bg-slate-900/90 transition-all flex flex-col items-center text-center group shadow-2xs"
                >
                  <div className={`w-7 h-7 rounded-lg border ${client.iconBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-bold text-[11px] text-slate-900 dark:text-slate-100 leading-tight">
                    {client.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {client.tech}
                  </div>
                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded mt-1 border ${client.badgeColor}`}>
                    {client.port}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Connector */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <span>HTTPS REST • JWT Auth</span>
          </div>
        </div>

        {/* Tier 2: Laravel 12 Backend Engine */}
        <Link
          to="/api"
          className="block p-3 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-50/50 via-sky-50/30 to-emerald-50/50 dark:from-brand-950/30 dark:via-sky-950/20 dark:to-emerald-950/30 hover:border-brand-500/60 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100">Laravel 12 REST Engine</div>
                <div className="text-[9px] font-mono text-brand-700 dark:text-brand-300">PHP 8.2 • 74 Controllers</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-500/20 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
              759 APIs
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-slate-600 dark:text-slate-300 text-center">
            <span className="bg-white/80 dark:bg-slate-900/80 py-0.5 rounded border border-brand-200/50 dark:border-brand-500/20">169 RBAC</span>
            <span className="bg-white/80 dark:bg-slate-900/80 py-0.5 rounded border border-brand-200/50 dark:border-brand-500/20">Row-Lock</span>
            <span className="bg-white/80 dark:bg-slate-900/80 py-0.5 rounded border border-brand-200/50 dark:border-brand-500/20">Queues</span>
          </div>
        </Link>

        {/* Connector */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ACID DB • In-Memory Cache</span>
          </div>
        </div>

        {/* Tier 3: PostgreSQL 18 & Redis 7 */}
        <div className="grid grid-cols-2 gap-1.5">
          <Link
            to="/database"
            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 hover:border-purple-500/50 transition-all flex items-center gap-2 group shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-500/15 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 text-left">
              <div className="font-bold text-[11px] text-slate-900 dark:text-slate-100">PostgreSQL 18</div>
              <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400">99 Tables</div>
            </div>
          </Link>

          <Link
            to="/tech-stack"
            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 hover:border-amber-500/50 transition-all flex items-center gap-2 group shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Server className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 text-left">
              <div className="font-bold text-[11px] text-slate-900 dark:text-slate-100">Redis 7</div>
              <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400">Cache & Locks</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
