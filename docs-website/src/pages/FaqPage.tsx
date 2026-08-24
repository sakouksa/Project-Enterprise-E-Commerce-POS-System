import React, { useState } from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { HelpCircle, ChevronDown, ChevronRight, Search } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { language } = useDocs();
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does POS and Storefront share the same database and stock balances?',
      qKh: 'តើប្រព័ន្ធ POS និងគេហទំព័រប្រើប្រាស់ស្តុក និង Database រួមគ្នាដែរឬទេ?',
      a: 'Yes, both the React Admin Dashboard/POS, React Customer Storefront, and Flutter Mobile App connect to the exact same PostgreSQL database instance through the unified Laravel REST API. Stock deductions are completely synchronized in real time with row-level locks.',
      aKh: 'បាទ/ចាស! ប្រព័ន្ធទាំងមូលប្រើប្រាស់ Database PostgreSQL តែមួយ និង Laravel API តែមួយ ធានាថារាល់ពេលលក់ដាច់នៅ POS ឬលើ Website ស្តុកនឹងត្រូវបានកាត់ស្មើគ្នាភ្លាមៗ។'
    },
    {
      q: 'How does the Bakong KHQR dynamic payment integration work?',
      qKh: 'តើការទូទាត់បាគង KHQR ដំណើរការដូចម្តេច?',
      a: 'When an order is created, the system generates a dynamic EMVCo-compliant KHQR payload with the exact order total and unique transaction reference. Once the customer scans and approves the transfer in their mobile banking app, Bakong webhook sends a confirmation to Laravel API, instantly transitioning order status to "Paid".',
      aKh: 'នៅពេលបង្កើតការបញ្ជាទិញ ប្រព័ន្ធបង្កើតកូដ KHQR ដែលមានចំនួនទឹកប្រាក់ត្រឹមត្រូវ។ ពេលអតិថិជនស្កេនទូទាត់ជោគជ័យ ប្រព័ន្ធបាគងនឹងផ្ញើ Webhook មកបញ្ជាក់ ហើយប្រព័ន្ធផ្លាស់ប្តូរស្ថានភាពជា "Paid" ភ្លាមៗ។'
    },
    {
      q: 'Can the mobile app work offline without internet connectivity?',
      qKh: 'តើកម្មវិធី Mobile App អាចប្រើប្រាស់បានទេនៅពេលគ្មានអ៊ីនធឺណិត?',
      a: 'Yes, the Flutter mobile terminal utilizes Hive local NoSQL storage to cache products, customers, and temporary sales offline. When internet connectivity is restored, cached transactions are automatically synchronized with the primary database via idempotent batch sync APIs.',
      aKh: 'អាចដំណើរការបាន! កម្មវិធីទូរស័ព្ទ Flutter ប្រើប្រាស់ Hive Cache ដើម្បីរក្សាទុកទិន្នន័យផលិតផល និងការលក់ក្នុងទូរស័ព្ទដៃ ហើយនឹង Sync ចូល Server វិញដោយស្វ័យប្រវត្តិពេលមានអ៊ីនធឺណិត។'
    },
    {
      q: 'How does dynamic QR code attendance prevent buddy punching?',
      qKh: 'តើវត្តមាន Dynamic QR ការពារការស្កេនជំនួសគ្នាដោយរបៀបណា?',
      a: 'The attendance QR code displayed on the store terminal rotates every 15 seconds with a cryptographic timestamp token. When staff scan it with their mobile app, the backend verifies both the token freshness and the staff mobile GPS coordinates against the store branch radius.',
      aKh: 'QR Code វត្តមានដែលបង្ហាញលើកញ្ចក់អេក្រង់ហាង ផ្លាស់ប្តូររៀងរាល់ ១៥ វិនាទីម្តង ព្រមទាំងផ្ទៀងផ្ទាត់ទីតាំង GPS របស់ទូរស័ព្ទបុគ្គលិកជាមួយទីតាំងសាខាហាង ធ្វើឱ្យមិនអាចស្កេនជំនួសគ្នាបានឡើយ។'
    },
    {
      q: 'How is multi-tenancy and data isolation enforced?',
      qKh: 'តើប្រព័ន្ធធានាសុវត្ថិភាពទិន្នន័យរវាងក្រុមហ៊ុន និងសាខានីមួយៗដោយរបៀបណា?',
      a: 'Every major business model utilizes global query scopes (e.g. `where company_id = ?`) and Spatie permission guards, ensuring users can only access data belonging to their assigned company, branch, and warehouse hierarchy.',
      aKh: 'រាល់ទិន្នន័យទាំងអស់មាន Company Scoping និងសិទ្ធិ Spatie RBAC ច្បាស់លាស់ ធានាថាបុគ្គលិកសាខាមួយមិនអាចមើលឃើញទិន្នន័យរបស់សាខាផ្សេងដោយគ្មានការអនុញ្ញាត។'
    }
  ];

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.qKh.includes(searchQuery) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: 'Frequently Asked Questions' }]} />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Architecture & Operations FAQ</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'សំណួរដែលសួរញឹកញាប់ (FAQ)' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {language === 'km'
            ? 'ចម្លើយចំពោះសំណួរស្នូលទាក់ទងនឹងស្ថាបត្យកម្មប្រព័ន្ធ, សុវត្ថិភាពទិន្នន័យ, ការទូទាត់ប្រាក់ KHQR, និងការដំណើរការ Offline។'
            : 'Answers to the most critical architectural, operational, and financial questions regarding the system.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search question keyword..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
        />
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition-all shadow-2xs hover:shadow-xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <span className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                  {language === 'km' ? faq.qKh : faq.q}
                </span>
                {isOpen ? <ChevronDown className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4 bg-slate-50/50 dark:bg-slate-950/50">
                  {language === 'km' ? faq.aKh : faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
