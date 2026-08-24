import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { FileBarChart, Download, TrendingUp, DollarSign, Boxes, Users } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'reports-overview', label: 'Reports Hub Overview' },
  ];

  const reportCategories = [
    {
      title: 'Sales & Invoicing Reports (14 Types)',
      icon: TrendingUp,
      color: 'text-brand-600 dark:text-brand-400',
      reports: [
        'Daily Sales Summary by Branch',
        'Sales by Product Category & Brand',
        'Cashier Sales Velocity & Drawer Audit',
        'POS Hourly Peak Sales Breakdown',
        'Sales Tax Collected Summary (VAT)',
        'Customer Group Purchase Velocity',
        'Sales Return & Refund Analysis'
      ]
    },
    {
      title: 'Inventory & Warehouse Reports (12 Types)',
      icon: Boxes,
      color: 'text-purple-600 dark:text-purple-400',
      reports: [
        'Multi-Warehouse Inventory Valuation (FIFO)',
        'Low Stock & Out-of-Stock Alert Matrix',
        'Stock Movement Audit History Log',
        'Inter-Warehouse Stock Transfer In-Transit',
        'Stock Opname Discrepancy Reconciliation',
        'Dead Stock & Slow Movers Analysis'
      ]
    },
    {
      title: 'Procurement & Supplier Reports (8 Types)',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      reports: [
        'Purchase Order Status & Receiving History',
        'Supplier Accounts Payable Ledger',
        'Supplier Defective Return & Debit Notes',
        'Purchase Price Variance by SKU'
      ]
    },
    {
      title: 'HR & Payroll Reports (14 Types)',
      icon: Users,
      color: 'text-amber-600 dark:text-amber-400',
      reports: [
        'Monthly Employee Timesheet & Attendance Audit',
        'Late Arrival & Absenteeism Penalties',
        'Monthly Department Salary Disbursement',
        'Individual PDF Payslip Archive'
      ]
    }
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: '48 Reports Hub' }]} />

        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
            <FileBarChart className="w-3.5 h-3.5" />
            <span>48 Comprehensive Reporting Engines</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'មជ្ឈមណ្ឌលរបាយការណ៍ ៤៨ ប្រភេទ (Reports Center)' : '48 Comprehensive Business Reports Hub'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'ប្រព័ន្ធបង្កើតរបាយការណ៍វិភាគលម្អិតសម្រាប់ថ្នាក់ដឹកនាំ គណនេយ្យករ និងអ្នកគ្រប់គ្រងឃ្លាំង គាំទ្រការទាញយកជា PDF (DomPDF), Excel (Maatwebsite), CSV និងការបោះពុម្ពភ្លាមៗ។'
              : 'Detailed operational and financial calculation specifications for all 48 backend reporting endpoints with streaming Excel and PDF generation.'}
          </p>
        </div>

        {/* Categories Grid */}
        <section id="reports-overview" className="space-y-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{cat.title}</h3>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {cat.reports.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Download className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>PDF • XLSX • CSV Supported</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
