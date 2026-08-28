import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { PlayCircle, Clock, Globe, ArrowRight, Video, Sparkles } from 'lucide-react';

export const TutorialPreview: React.FC = () => {
  const { t } = useDocs();

  const tutorials = [
    {
      id: 'tut-1',
      title: 'Full System Architecture & Omnichannel Walkthrough',
      desc: 'Complete high-level overview of how React Admin, Customer Storefront, Flutter, and Laravel interact.',
      duration: '12:45',
      difficulty: 'Beginner',
      language: 'Khmer & English',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      path: '/tutorials',
    },
    {
      id: 'tut-2',
      title: 'POS Terminal Cashier Checkout & Bakong KHQR',
      desc: 'Step-by-step cashier sales process, barcode scanner, dynamic KHQR code generation, and 80mm thermal receipt.',
      duration: '08:30',
      difficulty: 'Intermediate',
      language: 'Khmer & English',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=600&q=80',
      path: '/tutorials',
    },
    {
      id: 'tut-3',
      title: 'Procurement Flow: Supplier PO to Multi-Warehouse Stock',
      desc: 'Creating purchase orders, goods receiving confirmation, and automated stock balance updates.',
      duration: '10:15',
      difficulty: 'Intermediate',
      language: 'Khmer & English',
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      path: '/tutorials',
    },
    {
      id: 'tut-4',
      title: 'Developer Deep Dive: 759 REST APIs & Row-Level Locks',
      desc: 'Inspecting JWT middleware, Spatie RBAC matrix, and atomic database transaction isolation.',
      duration: '18:20',
      difficulty: 'Advanced',
      language: 'English',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      path: '/tutorials',
    },
  ];

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              Interactive Videos
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {t.tutorialsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t.tutorialsSubtitle}
          </p>
        </div>

        <Link
          to="/tutorials"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs"
        >
          <span>View All Tutorials</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tutorials.map((tut) => (
          <Link
            key={tut.id}
            to={tut.path}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden hover:border-purple-500/50 hover:shadow-lg transition-all group flex flex-col justify-between shadow-2xs"
          >
            <div>
              {/* Thumbnail with Overlay */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                <img
                  src={tut.thumbnail}
                  alt={tut.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white font-semibold">
                  <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    <Clock className="w-3 h-3" />
                    <span>{tut.duration}</span>
                  </span>
                  <span className="bg-purple-600/90 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {tut.difficulty}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                  {tut.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tut.desc}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>{tut.language}</span>
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <span>Watch</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
