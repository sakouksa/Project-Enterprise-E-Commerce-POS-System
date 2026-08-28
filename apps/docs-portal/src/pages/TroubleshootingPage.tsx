import React, { useState } from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { AlertTriangle, Search, CheckCircle2 } from 'lucide-react';

export const TroubleshootingPage: React.FC = () => {
  const { language } = useDocs();
  const [searchQuery, setSearchQuery] = useState('');

  const issues = [
    {
      code: 'ERR_INSUFFICIENT_STOCK',
      category: 'POS / Checkout',
      problem: 'Cannot complete checkout: "Insufficient stock for SKU [SKU_CODE]"',
      problemKh: 'មិនអាចគិតលុយបាន៖ ស្តុកមិនគ្រប់គ្រាន់សម្រាប់មុខទំនិញ',
      cause: 'Requested quantity exceeds real-time warehouse inventory balance or another cashier deducted stock concurrently.',
      causeKh: 'ចំនួនដែលត្រូវលក់លើសពីចំនួនស្តុកជាក់ស្តែង ឬមានអ្នកផ្សេងកាត់ស្តុកមុន។',
      solution: 'Perform stock transfer from central warehouse to local store branch, or perform a Stock Opname adjustment.',
      solutionKh: 'ធ្វើការផ្ទេរស្តុកពីឃ្លាំងកណ្តាល ឬធ្វើការកែសម្រួលចំនួនស្តុកក្នុងម៉ូឌុល Inventory Adjustments។'
    },
    {
      code: 'ERR_CASH_REGISTER_CLOSED',
      category: 'POS Terminal',
      problem: 'Cannot open POS terminal or process sales: "No active shift found"',
      problemKh: 'មិនអាចគិតលុយបានដោយសារមិនទាន់បើកវេនថតលុយ (Shift)',
      cause: 'The logged-in cashier has not opened a shift drawer with initial opening cash.',
      causeKh: 'អ្នកគិតលុយមិនទាន់បានចុច "Open Shift" និងបញ្ចូលលុយដើមគ្រា។',
      solution: 'Navigate to POS -> Cash Registers -> Click "Open Shift" and enter the starting float amount.',
      solutionKh: 'ចូលទៅកាន់ម៉ូឌុល POS -> ចុច "Open Shift" ហើយបញ្ចូលចំនួនទឹកប្រាក់ដើមគ្រាក្នុងថតលុយ។'
    },
    {
      code: 'ERR_KHQR_SOCKET_TIMEOUT',
      category: 'Payment Gateway',
      problem: 'KHQR payment modal is stuck in "Waiting for Bakong payment confirmation"',
      problemKh: 'ការទូទាត់បាគង KHQR ជាប់គាំងរង់ចាំ',
      cause: 'Bakong API webhook was delayed or customer scanned with incorrect amount.',
      causeKh: 'Webhook ពីបាគងមានភាពយឺតយ៉ាវ ឬអតិថិជនមិនទាន់បានចុច Confirm លើ App ធនាគារ។',
      solution: 'Click the "Manual Verify" button on POS to trigger direct REST check to Bakong server, or switch to Cash.',
      solutionKh: 'ចុចប៊ូតុង "Manual Verify" លើអេក្រង់ POS ដើម្បីឱ្យ Server សួរទៅបាគងដោយផ្ទាល់ ឬប្តូរទៅបង់លុយសុទ្ធ។'
    },
    {
      code: 'ERR_ATTENDANCE_OUT_OF_BOUNDS',
      category: 'HR Attendance',
      problem: 'Mobile attendance clock-in rejected: "GPS location outside branch radius"',
      problemKh: 'ស្កេនវត្តមានមិនចូលដោយសារនៅក្រៅបរិវេណហាង (GPS Out of Bounds)',
      cause: 'Employee mobile device GPS accuracy is low or staff is farther than branch geofence radius (e.g. 50 meters).',
      causeKh: 'បុគ្គលិកនៅឆ្ងាយជាងចម្ងាយដែលក្រុមហ៊ុនបានកំណត់ (ឧទាហរណ៍ ៥០ ម៉ែត្រ)។',
      solution: 'Ensure mobile location services are set to High Accuracy, or branch manager can submit a Manual Attendance Request.',
      solutionKh: 'បើក GPS ឱ្យបានច្បាស់ ឬឱ្យប្រធានសាខាធ្វើសំណើកែវត្តមានដោយដៃ (Manual Request)។'
    },
    {
      code: 'ERR_TOKEN_EXPIRED',
      category: 'Authentication',
      problem: 'API returns HTTP 401 Unauthorized / Token Expired',
      problemKh: 'គណនីដាច់ Session / Token អស់សុពលភាព',
      cause: 'JWT Access token expired (after 15 minutes) and refresh token rotation failed.',
      causeKh: 'Access token ហួសកំណត់ ១៥ នាទី ហើយមិនអាចបន្តដោយស្វ័យប្រវត្តិ។',
      solution: 'Re-authenticate by logging in again, or ensure client application is sending correct `refresh_token` payload.',
      solutionKh: 'ធ្វើការ Login ចូលម្តងទៀតដើម្បីទទួលបាន Token ថ្មី។'
    },
    {
      code: 'ERR_DATABASE_DEADLOCK',
      category: 'PostgreSQL Database',
      problem: 'HTTP 500: "Deadlock found when trying to get lock; try restarting transaction"',
      problemKh: 'ការកាត់ទិន្នន័យជាន់គ្នាក្នុង Database (Deadlock)',
      cause: 'Two concurrent transactions locked tables in reverse order during simultaneous bulk updates.',
      causeKh: 'ប្រតិបត្តិការពីរទាញយក Lock តារាងបញ្ច្រាសគ្នា។',
      solution: 'Laravel PosSaleService handles automatic transaction retry (`DB::transaction(..., 5)`). Check PostgreSQL log.',
      solutionKh: 'ប្រព័ន្ធមានមុខងារ Retry ដោយស្វ័យប្រវត្តិ។ ពិនិត្យមើល postgresql.log បន្ថែម។'
    }
  ];

  const filteredIssues = issues.filter(i => 
    i.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: 'Troubleshooting & Runbook' }]} />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Production Runbook & Error Matrix</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'បញ្ជីកំហុសញឹកញាប់ និងវិធីដោះស្រាយ (Troubleshooting Runbook)' : 'System Troubleshooting & Operations Runbook'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {language === 'km'
            ? 'កាតាឡុកកំហុសបច្ចេកទេស កូដ Error មូលហេតុ និងជំហានដោះស្រាយជាក់ស្តែងសម្រាប់ក្រុម IT Support និងប្រធានសាខា។'
            : 'Detailed diagnostic matrix of error codes, root cause breakdowns, and actionable resolution steps.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search error code or problem keyword..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
        />
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((item, idx) => (
          <div key={idx} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                {item.code}
              </span>
              <span className="text-xs font-mono text-slate-500">{item.category}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {language === 'km' ? item.problemKh : item.problem}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                <div className="font-bold text-slate-700 dark:text-slate-400 mb-1">Root Cause / មូលហេតុ:</div>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed">{language === 'km' ? item.causeKh : item.cause}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Actionable Solution / វិធីដោះស្រាយ:</span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed">{language === 'km' ? item.solutionKh : item.solution}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
