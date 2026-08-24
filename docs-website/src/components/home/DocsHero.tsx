import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { Sparkles, ArrowRight, Layers, ShieldCheck, ShoppingBag, Smartphone, Cpu, ExternalLink } from 'lucide-react';

export const DocsHero: React.FC = () => {
  const { t } = useDocs();

  const platforms = [
    {
      name: t.adminDashboard,
      tech: 'React 19 • Vite 8',
      badge: 'Port 5173',
      icon: ShieldCheck,
      path: '/admin-guide',
      liveUrl: 'http://localhost:5173',
      color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/30',
      badgeColor: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    },
    {
      name: t.customerWebsite,
      tech: 'React 19 • Tailwind',
      badge: 'Port 5174',
      icon: ShoppingBag,
      path: '/customer-guide',
      liveUrl: 'http://localhost:5174',
      color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/30',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    },
    {
      name: t.mobileApp,
      tech: 'Flutter 3.24 • Riverpod',
      badge: 'iOS / Android',
      icon: Smartphone,
      path: '/mobile-guide',
      color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/30',
      badgeColor: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    },
    {
      name: 'Backend Engine',
      tech: 'Laravel 12 • PostgreSQL 18',
      badge: '759 APIs',
      icon: Cpu,
      path: '/api',
      liveUrl: 'http://localhost:8000/api/documentation',
      color: 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200/80 dark:border-brand-500/30',
      badgeColor: 'bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-500/30',
    },
  ];

  return (
    <section className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/85 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-sm dark:shadow-xl backdrop-blur-md transition-colors duration-200">
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-500/10 dark:bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left 7 Cols: Hero Intro & Actions */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{t.heroOfficialBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Enterprise E-Commerce <br />
            <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-emerald-600 dark:from-brand-400 dark:via-sky-300 dark:to-emerald-400 bg-clip-text text-transparent">
              + High-Speed POS System
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
            {t.heroDescription}
          </p>

          {/* 2 Primary CTAs */}
          <div className="flex items-center gap-3 flex-wrap pt-1">
            <Link
              to="/overview"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{t.ctaExplore}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/architecture"
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-2xs hover:border-brand-500/30"
            >
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>{t.heroArchitectureBtn}</span>
            </Link>
          </div>
        </div>

        {/* Right 5 Cols: 4 Clean Connected Platform Cards */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/70 p-4 sm:p-5 shadow-inner space-y-2.5">
            <div className="flex items-center justify-between px-1 pb-1 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t.heroConnectedPlatforms}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">{t.heroUnifiedCore}</span>
            </div>

            <div className="space-y-2">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.name}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:border-brand-500/50 hover:shadow-sm transition-all flex items-center justify-between group"
                  >
                    <Link to={p.path} className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-lg border ${p.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 truncate">
                          {p.tech}
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open Live App"
                          className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
