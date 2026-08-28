import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { ShoppingBag, Search, Heart, ShoppingCart, CreditCard, Truck, ShieldCheck } from 'lucide-react';

export const CustomerGuidePage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'storefront-overview', label: 'Storefront Experience' },
    { id: 'catalog-search', label: 'Catalog Browsing & Search' },
    { id: 'cart-checkout', label: 'Cart, Wishlist & KHQR Checkout' },
    { id: 'order-tracking', label: 'Real-Time Order Tracking' },
    { id: 'account-portal', label: 'Customer Account & Address Book' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'Customer Store Guide' }]} />

        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Storefront & Customer Journey</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'សៀវភៅណែនាំគេហទំព័រអតិថិជន (Customer Storefront)' : 'Customer Storefront User Guide'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'មគ្គុទ្ទេសក៍ពន្យល់ពីបទពិសោធន៍ទិញទំនិញអនឡាញរបស់អតិថិជន៖ ការស្វែងរកទំនិញ, ការដាក់ក្នុងកន្ត្រក, ការទូទាត់ប្រាក់តាម KHQR, និងការតាមដានទំនិញដឹកជញ្ជូន។'
              : 'Complete walkthrough of the e-commerce customer experience across product discovery, wishlist, shopping cart, KHQR payment processing, and parcel tracking.'}
          </p>
        </div>

        {/* 1. Storefront Experience */}
        <section id="storefront-overview" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">01</span>
            <span>{language === 'km' ? 'លក្ខណៈពិសេសនៃគេហទំព័រទិញទំនិញ' : 'Storefront Highlights'}</span>
          </h2>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 shadow-2xs">
            <p>
              គេហទំព័រអតិថិជន (Port 5174) ត្រូវបានបង្កើតឡើងដោយ <strong>React 19, Tailwind CSS, និង Zustand</strong> ដែលមានល្បឿនលឿន និងងាយស្រួលប្រើប្រាស់លើគ្រប់ទូរស័ព្ទដៃ និងកុំព្យូទ័រ។
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
              {[
                { title: 'Instant Catalog Search', icon: Search, desc: 'ស្វែងរកទំនិញតាមឈ្មោះ ម៉ាក និងប្រភេទ' },
                { title: 'Wishlist & Cart Sync', icon: ShoppingCart, desc: 'រក្សាទុកទំនិញក្នុងកន្ត្រក និង Wishlist' },
                { title: 'Dynamic KHQR Checkout', icon: CreditCard, desc: 'ស្កេនទូទាត់បាគងភ្លាមៗ គ្មានការរង់ចាំ' },
                { title: 'Live Order Tracking', icon: Truck, desc: 'វាយលេខវិក្កយបត្រដើម្បីមើលស្ថានភាពដឹក' },
                { title: 'Multi-Address Book', icon: ShieldCheck, desc: 'រក្សាទុកអាសយដ្ឋានដឹកជញ្ជូនច្រើនកន្លែង' },
                { title: 'Customer Reviews & Ratings', icon: Heart, desc: 'ដាក់ពិន្ទុ និងសរសេរ Review លើទំនិញ' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
