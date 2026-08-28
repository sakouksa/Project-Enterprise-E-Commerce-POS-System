import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { ShieldCheck, ShoppingBag, Smartphone, Cpu, ExternalLink, Layers, ArrowRight } from 'lucide-react';

export const PlatformGrid: React.FC = () => {
  const { t } = useDocs();

  const platforms = [
    {
      id: 'admin',
      icon: ShieldCheck,
      title: t.platformAdminTitle,
      description: t.platformAdminDesc,
      docsPath: '/admin-guide',
      liveUrl: 'http://localhost:5173',
      tech: ['React 19', 'Vite 8', 'TailwindCSS', 'Zustand', 'Lucide'],
      badge: '258 Admin Components',
      color: 'border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
    },
    {
      id: 'store',
      icon: ShoppingBag,
      title: t.platformStoreTitle,
      description: t.platformStoreDesc,
      docsPath: '/customer-guide',
      liveUrl: 'http://localhost:5174',
      tech: ['React 19', 'Vite 8', 'TailwindCSS', 'Bakong KHQR'],
      badge: '28 Store Pages',
      color: 'border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'mobile',
      icon: Smartphone,
      title: t.platformMobileTitle,
      description: t.platformMobileDesc,
      docsPath: '/mobile-guide',
      tech: ['Flutter 3.24', 'Dart 3', 'Riverpod', 'GoRouter', 'Dio'],
      badge: 'iOS & Android Ready',
      color: 'border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'backend',
      icon: Cpu,
      title: t.platformBackendTitle,
      description: t.platformBackendDesc,
      docsPath: '/developer-guide',
      liveUrl: 'http://localhost:8000',
      tech: ['Laravel 12', 'PHP 8.2', 'PostgreSQL 18', 'Redis 7', 'Spatie RBAC'],
      badge: '759 Audited REST APIs',
      color: 'border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-md dark:shadow-2xl transition-colors duration-200">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
            {t.platformBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {t.platformTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            {t.platformSubtitle}
          </p>
        </div>

        <Link
          to="/ecosystem"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        >
          <span>View Ecosystem Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div
              key={platform.id}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80 hover:border-brand-500/50 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-slate-100 shadow-2xs group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {platform.title}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {platform.badge}
                      </span>
                    </div>
                  </div>

                  {platform.liveUrl && (
                    <a
                      href={platform.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                      title={`Open live portal on ${platform.liveUrl}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live App</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {platform.description}
                </p>

                {/* Tech Badges */}
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {platform.tech.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-2xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                <Link
                  to={platform.docsPath}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Documentation Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Layers className="w-4 h-4 text-slate-400 opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
