import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { END_TO_END_FLOW } from '../data/architectureData';
import { CodeBlock } from '../components/common/CodeBlock';
import { Workflow, ArrowDown } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'end-to-end-summary', label: 'End-to-End Flow Summary' },
    { id: 'step-by-step', label: 'Detailed 7-Phase Execution' },
    { id: 'data-transformation', label: 'Payload Data Transformation' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'How the Whole System Works' }]} />

        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
            <Workflow className="w-3.5 h-3.5" />
            <span>Complete Lifecycle Walkthrough</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'របៀបដែលប្រព័ន្ធទាំងមូលដំណើរការ (How It Works)' : 'How the Whole System Works (End-to-End)'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'ពន្យល់ពីដំណើរការតាំងពីដើមរហូតដល់ចប់៖ ចាប់ពីអតិថិជនបើកគេហទំព័រទិញទំនិញ -> ស្កេន KHQR -> កាត់ស្តុកឃ្លាំង -> ផ្ញើដំណឹង Admin -> វេចខ្ចប់ និងដឹកជញ្ជូន។'
              : 'Complete journey trace from customer storefront shopping cart, dynamic KHQR banking checkout, atomic inventory deduction, Telegram notification, and warehouse fulfillment.'}
          </p>
        </div>

        {/* 7-Step Interactive Flow Timeline */}
        <section id="step-by-step" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-mono font-bold">01</span>
            <span>{language === 'km' ? 'លំហូរដំណើរការ ៧ ដំណាក់កាល' : 'Seven-Phase Complete Lifecycle'}</span>
          </h2>

          <div className="space-y-4">
            {END_TO_END_FLOW.map((step, idx) => {
              const isLast = idx === END_TO_END_FLOW.length - 1;
              return (
                <div key={idx} className="relative">
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-brand-500/40 transition-colors shadow-sm dark:shadow-lg">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/20 border border-brand-200 dark:border-brand-500/40 flex items-center justify-center text-xs font-mono font-bold text-brand-700 dark:text-brand-300 shrink-0">
                      0{step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {language === 'km' ? step.titleKh : step.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-700 dark:text-brand-400 border border-slate-200 dark:border-slate-700 font-bold uppercase">
                          {step.layer}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {!isLast && (
                    <div className="flex justify-center my-2">
                      <ArrowDown className="w-4 h-4 text-slate-400 dark:text-slate-600 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Data Transformation Code Example */}
        <section id="data-transformation" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-mono font-bold">02</span>
            <span>Data Payload Transformation Example</span>
          </h2>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-4 shadow-sm">
            <p>
              ឧទាហរណ៍ Payload JSON ដែលត្រូវបានបញ្ជូនពី Customer Frontend ទៅកាន់ `POST /api/v1/store/orders`៖
            </p>
            <CodeBlock
              language="json"
              filename="Storefront Checkout Request"
              code={`{
  "customer_name": "Sokha Chan",
  "customer_phone": "012345678",
  "shipping_address": "#45, St 2004, Phnom Penh",
  "payment_method_code": "KHQR",
  "items": [
    {
      "product_id": 14,
      "product_variant_id": 38,
      "quantity": 2,
      "unit_price": 25.00
    }
  ],
  "shipping_fee": 1.50,
  "discount_amount": 0.00,
  "total_amount": 51.50
}`}
            />
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
