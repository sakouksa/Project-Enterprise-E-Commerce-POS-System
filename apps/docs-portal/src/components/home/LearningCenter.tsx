import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { BookOpen, Clock, Video, ArrowRight, GraduationCap, CheckCircle2 } from 'lucide-react';

export const LearningCenter: React.FC = () => {
  const { t } = useDocs();

  const tracks = [
    {
      id: 'basics',
      title: 'Getting Started & System Basics',
      desc: 'Understand the multi-tenant architecture, user roles, navigation, and login workflows.',
      difficulty: 'Beginner',
      time: '15 mins',
      lessons: '4 Lessons',
      hasVideo: true,
      path: '/overview',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    },
    {
      id: 'pos',
      title: 'Retail POS & Cashier Operations',
      desc: 'Master sub-second barcode scanning, Bakong KHQR dynamic payments, split bill, and thermal receipts.',
      difficulty: 'Intermediate',
      time: '25 mins',
      lessons: '6 Lessons',
      hasVideo: true,
      path: '/modules/pos',
      badgeColor: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    },
    {
      id: 'inventory',
      title: 'Multi-Warehouse Inventory & Purchases',
      desc: 'Learn purchase orders (PO), goods receiving, inter-branch stock transfers, and stock opname.',
      difficulty: 'Intermediate',
      time: '30 mins',
      lessons: '5 Lessons',
      hasVideo: true,
      path: '/modules/inventory',
      badgeColor: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
    },
    {
      id: 'dev',
      title: 'Developer Setup & Backend APIs',
      desc: 'Configure Laravel 12, PostgreSQL 18, JWT tokens, test 759 REST APIs, and compile Flutter app.',
      difficulty: 'Advanced',
      time: '45 mins',
      lessons: '8 Lessons',
      hasVideo: true,
      path: '/developer-guide',
      badgeColor: 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-500/30',
    },
  ];

  return (
    <section className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            Training & Courses
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {t.learningTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {t.learningSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tracks.map((track) => (
          <Link
            key={track.id}
            to={track.path}
            className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-brand-500/50 hover:shadow-lg transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${track.badgeColor}`}>
                  {track.difficulty}
                </span>
                {track.hasVideo && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-purple-600 dark:text-purple-400">
                    <Video className="w-3 h-3" />
                    <span>Video</span>
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2">
                {track.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {track.desc}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 py-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{track.lessons}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{track.time}</span>
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                <span>{t.learningStart}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
