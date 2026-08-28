import React, { useState, useMemo } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { ALL_ENTERPRISE_FAQS, EnterpriseFaqItem } from '../../data/enterpriseFaqs';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ChevronDown,
  Code2,
  ArrowRight,
  HelpCircle,
  Layers,
  ShoppingBag,
  CreditCard,
  Package,
  Truck,
  Users,
  DollarSign,
  Shield,
  Terminal
} from 'lucide-react';

export const OverviewFaqSection: React.FC = () => {
  const { language } = useDocs();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('architecture');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-01');

  // 9 Well-structured Categories with icons
  const categories = [
    { id: 'architecture', icon: Layers, label: { km: 'ស្ថាបត្យកម្មប្រព័ន្ធ', en: 'Architecture', th: 'สถาปัตยกรรม', vi: 'Kiến trúc', zh: '系统架构' }, color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30' },
    { id: 'pos', icon: ShoppingBag, label: { km: 'ប្រព័ន្ធគិតលុយ POS', en: 'POS & Cashier', th: 'แคชเชียร์ POS', vi: 'Thu ngân POS', zh: '极速POS' }, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' },
    { id: 'payments', icon: CreditCard, label: { km: 'ការទូទាត់ & KHQR', en: 'Payments & KHQR', th: 'การชำระเงิน', vi: 'Thanh toán', zh: '支付网关' }, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' },
    { id: 'inventory', icon: Package, label: { km: 'ស្តុកឃ្លាំងពហុសាខា', en: 'Inventory & Stock', th: 'คลังสินค้า', vi: 'Kho hàng', zh: '进销存' }, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30' },
    { id: 'procurement', icon: Truck, label: { km: 'ការបញ្ជាទិញចូល PO', en: 'Procurement', th: 'การจัดซื้อ', vi: 'Mua hàng', zh: '采购管理' }, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' },
    { id: 'hrm', icon: Users, label: { km: 'វត្តមាន Dynamic QR', en: 'HRM & Attendance', th: 'การลงเวลา HR', vi: 'Chấm công', zh: '考勤人事' }, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30' },
    { id: 'payroll', icon: DollarSign, label: { km: 'ប្រាក់បៀវត្សរ៍', en: 'Payroll & Tax', th: 'เงินเดือนและภาษี', vi: 'Tính lương', zh: '薪资核算' }, color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30' },
    { id: 'security', icon: Shield, label: { km: 'សន្តិសុខ & RBAC', en: 'Security & RBAC', th: 'ความปลอดภัย', vi: 'Bảo mật', zh: '权限安全' }, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' },
    { id: 'devops', icon: Terminal, label: { km: 'DevOps & Scaling', en: 'DevOps & Scaling', th: 'DevOps & DB', vi: 'DevOps & DB', zh: '运维部署' }, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700' },
  ];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_ENTERPRISE_FAQS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered FAQs
  const displayedFaqs = useMemo(() => {
    const isSearching = searchQuery.trim().length > 0;
    if (isSearching) {
      const qLower = searchQuery.toLowerCase();
      return ALL_ENTERPRISE_FAQS.filter((faq) => {
        const qText = (faq.q[language] || faq.q.en).toLowerCase();
        const aText = (faq.a[language] || faq.a.en).toLowerCase();
        return qText.includes(qLower) || aText.includes(qLower) || faq.id.includes(qLower);
      });
    }

    return ALL_ENTERPRISE_FAQS.filter((faq) => faq.category === activeTab);
  }, [activeTab, searchQuery, language]);

  // Helper to remove "01. ", "02. " prefixes
  const cleanQuestionTitle = (text: string) => {
    return text.replace(/^\d+\.\s*/, '');
  };

  return (
    <section id="enterprise-faqs" className="mb-14 space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl backdrop-blur-xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>52 Verified Enterprise Solutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {language === 'km' ? 'សំណួរ-ចម្លើយបច្ចេកទេស និងដោះស្រាយបញ្ហាសហគ្រាស (៥២)' : '52 Enterprise Technical Solutions & FAQs'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-normal">
              {language === 'km'
                ? 'ជ្រើសរើសប្រភេទខាងក្រោម ឬស្វែងរក ដើម្បីមើលដំណោះស្រាយបច្ចេកទេសជាក់ស្តែង ត្រឹមត្រូវ និងស៊ីជម្រៅ'
                : 'Select a domain tab or search directly to inspect production-grade engineering answers and code references.'}
            </p>
          </div>

          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shrink-0">
            {language === 'km' ? `${displayedFaqs.length} ដំណោះស្រាយ` : `${displayedFaqs.length} Solutions`}
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'km'
                ? 'ស្វែងរកសំណួរ ឬបញ្ហាបច្ចេកទេស (ឧ. Race condition, KHQR, វត្តមាន QR, ថ្លៃដើម, Docker)...'
                : 'Search technical solutions (e.g. Race condition, KHQR, Offline sync, Moving average, Docker)...'
            }
            className="w-full pl-11 pr-16 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* 9 Category Grid Tabs (Hidden when searching) */}
        {!searchQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              const count = categoryCounts[cat.id] || 0;
              const label = cat.label[language] || cat.label.en;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id);
                    const firstItem = ALL_ENTERPRISE_FAQS.find((f) => f.category === cat.id);
                    if (firstItem) setOpenFaqId(firstItem.id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                    isActive
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 shadow-sm ring-1 ring-brand-500/20'
                      : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg border ${cat.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-xs font-bold truncate ${isActive ? 'text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300'}`}>
                      {label}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-brand-600 text-white' : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* FAQ Accordion List */}
        <div className="space-y-2.5 pt-2">
          {displayedFaqs.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                {language === 'km' ? 'រកមិនឃើញសំណួរដែលត្រូវនឹងពាក្យស្វែងរកឡើយ' : 'No matching enterprise Q&A found'}
              </div>
              <div className="text-xs text-slate-500">
                {language === 'km' ? 'សូមសាកល្បងស្វែងរកជាមួយពាក្យគន្លឹះផ្សេងទៀត' : 'Try searching with another keyword.'}
              </div>
            </div>
          ) : (
            displayedFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const rawQ = faq.q[language] || faq.q.en;
              const qText = cleanQuestionTitle(rawQ);
              const aText = faq.a[language] || faq.a.en;
              const catLabel = faq.categoryLabel[language] || faq.categoryLabel.en;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'border-brand-500/50 bg-white dark:bg-slate-900/90 shadow-sm ring-1 ring-brand-500/10'
                      : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-start justify-between p-4 sm:p-4.5 text-left transition-colors gap-3"
                  >
                    <div className="space-y-1 flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {catLabel}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-brand-600 dark:text-brand-400 font-semibold">
                          {faq.role}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                        {qText}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 mt-1 ${
                        isOpen ? 'rotate-180 text-brand-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <p className="font-normal">{aText}</p>

                      {faq.technicalNote && (
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-brand-700 dark:text-brand-300 flex items-center gap-2 overflow-x-auto">
                          <Code2 className="w-3.5 h-3.5 shrink-0 text-brand-500" />
                          <span>{faq.technicalNote}</span>
                        </div>
                      )}

                      <div className="pt-1 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                        <Link to={faq.relatedPath} className="inline-flex items-center gap-1 hover:underline">
                          <span>{language === 'km' ? 'ស្វែងយល់ឯកសារម៉ូឌុលពាក់ព័ន្ធ' : 'Explore related module documentation'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
