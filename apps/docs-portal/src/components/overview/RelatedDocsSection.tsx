import React from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { Link } from 'react-router-dom';
import {
  Layers,
  Database,
  Radio,
  ShoppingBag,
  Shield,
  Code2,
  Smartphone,
  Video,
  ArrowRight
} from 'lucide-react';

export const RelatedDocsSection: React.FC = () => {
  const { language } = useDocs();

  const links = [
    {
      title: '6-Tier Architecture',
      titleKh: 'ស្ថាបត្យកម្ម ៦ ស្រទាប់',
      desc: 'Deep dive into Presentation, Gateway, Business, Persistence, and DevOps layers.',
      descKh: 'ស្វែងយល់លម្អិតពីស្រទាប់ទាំង ៦ និងលំហូរតក្កវិជ្ជាអាជីវកម្ម។',
      path: '/architecture',
      icon: Layers,
      color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30'
    },
    {
      title: 'PostgreSQL 18 Database',
      titleKh: 'វចនានុក្រមទិន្នន័យ ៩៩ តារាង',
      desc: 'Interactive schema explorer, foreign keys, row-level locks, and ER diagram.',
      descKh: 'តារាងទិន្នន័យ ៩៩ តារាង និងដ្យាក្រាម ERD អន្តរកម្មពិតប្រាកដ។',
      path: '/database',
      icon: Database,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30'
    },
    {
      title: '759 REST API Explorer',
      titleKh: 'ឯកសារ 759 REST APIs',
      desc: 'Interactive Swagger-style API explorer with Request/Response schemas and RBAC nodes.',
      descKh: 'ឯកសារ API ពេញលេញ ជាមួយគំរូ Request/Response និងការផ្ទៀងផ្ទាត់សិទ្ធិ។',
      path: '/api',
      icon: Radio,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
    },
    {
      title: 'POS & Retail User Guide',
      titleKh: 'សៀវភៅណែនាំប្រតិបត្តិការ POS',
      desc: 'Cashier manual for barcode scanning, Bakong KHQR checkout, and shift audits.',
      descKh: 'មគ្គុទ្ទេសក៍ប្រតិបត្តិការលក់ POS ស្កេនបាគូដ បង្កើត KHQR និងកុងទ័រប្រាក់។',
      path: '/user-guide',
      icon: ShoppingBag,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30'
    },
    {
      title: 'React 19 Admin Guide',
      titleKh: 'សៀវភៅណែនាំ Admin ២៥៨ ទំព័រ',
      desc: 'Administrative handbook covering 258 pages, role access, and store settings.',
      descKh: 'សៀវភៅណែនាំគ្រប់គ្រង Admin Dashboard ២៥៨ ទំព័រ និងសិទ្ធិបុគ្គលិក។',
      path: '/admin-guide',
      icon: Shield,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
    },
    {
      title: 'Developer Setup Guide',
      titleKh: 'មគ្គុទ្ទេសក៍អ្នកអភិវឌ្ឍន៍ Dev',
      desc: 'Single-command setup with Docker Compose, migrations, seeders, and Telescope.',
      descKh: 'ការដំឡើងប្រព័ន្ធមូលដ្ឋាន ដំណើរការ Docker ៣៦ Migrations និង Seeder។',
      path: '/developer-guide',
      icon: Code2,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30'
    },
    {
      title: 'Flutter Mobile App Guide',
      titleKh: 'មគ្គុទ្ទេសក៍កម្មវិធីទូរស័ព្ទដៃ',
      desc: 'Riverpod architecture, offline Hive NoSQL sync, and biometric authentication.',
      descKh: 'ស្ថាបត្យកម្ម Flutter 3.24 ផ្ទុកទិន្នន័យ Offline និងស្កេនវត្តមាន QR។',
      path: '/mobile-guide',
      icon: Smartphone,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30'
    },
    {
      title: 'Hands-on Video Tutorials',
      titleKh: 'មជ្ឈមណ្ឌលវីដេអូបង្រៀន',
      desc: 'Video training center with step-by-step narration scripts in Khmer and English.',
      descKh: 'វីដេអូបង្រៀនជាក់ស្តែង ជាមួយសាច់រឿងបង្រៀនជាភាសាខ្មែរ និងអង់គ្លេស។',
      path: '/tutorials',
      icon: Video,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30'
    }
  ];

  return (
    <section id="related-documentation" className="mb-14 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono font-bold">
            09
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Navigation Map
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'ស្វែងយល់ឯកសារបច្ចេកទេសបន្ត (Continue Exploring)' : 'Explore Related Documentation Portals'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl font-normal">
          {language === 'km'
            ? 'ជ្រើសរើសច្រកទ្វារឯកសារដែលអ្នកចង់ស្វែងយល់លម្អិតបន្ត'
            : 'Select any documentation portal below to dive into detailed implementation guides, schema dictionaries, and API references.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((link, idx) => {
          const Icon = link.icon;
          return (
            <Link
              key={idx}
              to={link.path}
              className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 hover:border-brand-500/50 hover:shadow-md transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className={`w-10 h-10 rounded-2xl border ${link.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {language === 'km' ? link.titleKh : link.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === 'km' ? link.descKh : link.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                <span>{language === 'km' ? 'បើកមើល' : 'Explore Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
