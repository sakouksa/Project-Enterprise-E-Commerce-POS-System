import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';

export const HomeFaqSection: React.FC = () => {
  const { t } = useDocs();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: t.faq1Q,
      a: t.faq1A,
    },
    {
      q: t.faq2Q,
      a: t.faq2A,
    },
    {
      q: t.faq3Q,
      a: t.faq3A,
    },
    {
      q: t.faq4Q,
      a: t.faq4A,
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 p-6 md:p-8 backdrop-blur-xl shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
            {t.answersOnDemand}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {t.faqSectionTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            {t.faqSectionSubtitle}
          </p>
        </div>

        <Link
          to="/faq"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors shrink-0 shadow-2xs"
        >
          <span>{t.allFaqsBtn}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white dark:hover:bg-slate-900/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 border border-brand-200 dark:border-brand-500/20">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
