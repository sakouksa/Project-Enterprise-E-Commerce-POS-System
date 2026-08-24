import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import {
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Cpu,
  ExternalLink,
  Server
} from 'lucide-react';

export const DocsHero: React.FC = () => {
  const { t, language } = useDocs();

  const platforms = [
    {
      id: 'admin',
      name: language === 'km' ? 'ផ្ទាំងគ្រប់គ្រង Admin' : 'Admin Dashboard',
      tech: 'React 19 • Vite 8 • 258 Pages',
      badge: 'Port 5173',
      icon: ShieldCheck,
      path: '/admin-guide',
      liveUrl: 'http://localhost:5173',
      gradient: 'from-blue-500 to-indigo-600',
      iconShadow: 'shadow-blue-500/20',
      pillColor: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-500/30'
    },
    {
      id: 'store',
      name: language === 'km' ? 'ហាងអតិថិជន Storefront' : 'Customer Storefront',
      tech: 'React 19 • Tailwind • 28 Pages',
      badge: 'Port 5174',
      icon: ShoppingBag,
      path: '/customer-guide',
      liveUrl: 'http://localhost:5174',
      gradient: 'from-emerald-500 to-teal-600',
      iconShadow: 'shadow-emerald-500/20',
      pillColor: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-500/30'
    },
    {
      id: 'mobile',
      name: language === 'km' ? 'កម្មវិធីទូរស័ព្ទ Mobile POS' : 'Mobile Terminal',
      tech: 'Flutter 3.24 • Riverpod • Offline',
      badge: 'iOS / Android',
      icon: Smartphone,
      path: '/mobile-guide',
      gradient: 'from-purple-500 to-violet-600',
      iconShadow: 'shadow-purple-500/20',
      pillColor: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-500/30'
    },
    {
      id: 'backend',
      name: language === 'km' ? 'ម៉ាស៊ីនបម្រើ Backend Hub' : 'Backend Engine',
      tech: 'Laravel 12 • PostgreSQL 18 • 759 APIs',
      badge: 'Port 8000',
      icon: Cpu,
      path: '/api',
      liveUrl: 'http://localhost:8000/api/documentation',
      gradient: 'from-rose-500 to-brand-600',
      iconShadow: 'shadow-rose-500/20',
      pillColor: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-500/30'
    },
  ];

  return (
    <section className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/85 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-sm dark:shadow-xl backdrop-blur-md transition-colors duration-200">
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-500/10 dark:bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left 6 Cols: Hero Intro & Actions */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{t.heroOfficialBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            OptaPOS Enterprise <br />
            <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-emerald-600 dark:from-brand-400 dark:via-sky-300 dark:to-emerald-400 bg-clip-text text-transparent">
              + High-Speed POS System
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
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

        {/* Right 6 Cols: Mac-Styled 4 Connected Platforms Window */}
        <div className="lg:col-span-6 w-full">
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 shadow-xl dark:shadow-2xl shadow-slate-900/5 dark:shadow-black/50 backdrop-blur-2xl overflow-hidden transition-all">
            {/* macOS Window Titlebar */}
            <div className="h-11 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-950/60 select-none">
              {/* Traffic Light Buttons */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-2xs inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-2xs inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-2xs inline-block" />
              </div>

              {/* Centered Window Title */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono px-2">
                <Server className="w-3.5 h-3.5 text-brand-500" />
                <span>{t.heroConnectedPlatforms}</span>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>4 Active</span>
              </div>
            </div>

            {/* macOS Window Body (4 Platforms List) */}
            <div className="p-3.5 sm:p-4 space-y-2.5 bg-slate-50/40 dark:bg-slate-950/30">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 hover:border-brand-500/40 hover:bg-white dark:hover:bg-slate-900 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
                  >
                    <Link to={p.path} className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Apple-style Squircle App Icon */}
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${p.gradient} text-white flex items-center justify-center shrink-0 shadow-md ${p.iconShadow} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {p.tech}
                        </div>
                      </div>
                    </Link>

                    {/* Mac Port Pill & Action Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${p.pillColor} whitespace-nowrap`}>
                        {p.badge}
                      </span>

                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open live app"
                          className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-500/20 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          to={p.path}
                          title="View Guide"
                          className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-500/20 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 transition-colors"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* macOS Window Footer / Status Bar */}
            <div className="px-4 py-2 bg-slate-100/60 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>PostgreSQL 18 • Single Source of Truth</span>
              </span>
              <span className="text-brand-600 dark:text-brand-400 font-bold shrink-0">
                Atomic Row-Lock
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
