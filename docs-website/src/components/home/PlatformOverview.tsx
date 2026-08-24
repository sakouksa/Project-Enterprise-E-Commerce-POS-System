import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { ShieldCheck, ShoppingBag, Smartphone, Cpu, ExternalLink, ArrowRight } from 'lucide-react';

export const PlatformOverview: React.FC = () => {
  const { t } = useDocs();

  const platforms = [
    {
      title: t.platformAdminTitle,
      desc: t.platformAdminDesc,
      tech: 'React 19 • Vite 8 • AntD',
      badge: 'Port 5173',
      icon: ShieldCheck,
      path: '/admin-guide',
      liveUrl: 'http://localhost:5173',
      color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/20',
    },
    {
      title: t.platformStoreTitle,
      desc: t.platformStoreDesc,
      tech: 'React 19 • Tailwind • Vite',
      badge: 'Port 5174',
      icon: ShoppingBag,
      path: '/customer-guide',
      liveUrl: 'http://localhost:5174',
      color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20',
    },
    {
      title: t.platformMobileTitle,
      desc: t.platformMobileDesc,
      tech: 'Flutter 3.24 • Riverpod',
      badge: 'iOS / Android',
      icon: Smartphone,
      path: '/mobile-guide',
      color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/20',
    },
    {
      title: t.platformBackendTitle,
      desc: t.platformBackendDesc,
      tech: 'Laravel 12 • PostgreSQL 18',
      badge: 'Port 8000',
      icon: Cpu,
      path: '/api',
      liveUrl: 'http://localhost:8000/api/documentation',
      color: 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200/80 dark:border-brand-500/20',
    },
  ];

  return (
    <section className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            {t.platformBadge}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {t.platformTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {t.platformSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-brand-500/40 hover:shadow-lg transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-2xl border ${p.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {p.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 mb-1.5">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {p.desc}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 py-2 border-t border-slate-100 dark:border-slate-800/80">
                  {p.tech}
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    to={p.path}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    <span>Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium"
                    >
                      <span>Live App</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
