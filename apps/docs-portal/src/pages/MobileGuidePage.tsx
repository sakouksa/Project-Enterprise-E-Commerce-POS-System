import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { Smartphone, Fingerprint, QrCode, WifiOff, Printer, FileText, Shield } from 'lucide-react';

export const MobileGuidePage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'mobile-overview', label: 'Flutter Mobile Architecture' },
    { id: 'biometric-auth', label: 'Biometric Login & Device Pairing' },
    { id: 'offline-hive', label: 'Hive Local Offline Caching' },
    { id: 'qr-attendance', label: 'Dynamic QR Attendance Scanner' },
    { id: 'mobile-pos', label: 'Mobile POS & Thermal Printing' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'Flutter Mobile App Guide' }]} />

        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-semibold mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Cross-Platform Flutter Native Terminal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'សៀវភៅណែនាំកម្មវិធីទូរស័ព្ទ Flutter Mobile App (៦៩ Files)' : 'Flutter Mobile Terminal & App Guide (69 Files)'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'មគ្គុទ្ទេសក៍ប្រតិបត្តិការ និងបច្ចេកទេសនៃកម្មវិធីទូរស័ព្ទដៃ Flutter 3.2 សម្រាប់បុគ្គលិកស្កេនវត្តមាន, គិតលុយចល័ត (Mobile POS), និងមើលរបាយការណ៍។'
              : 'Complete architectural and user guide for the cross-platform Flutter application powering on-the-go management, QR attendance, mobile POS, and offline caching.'}
          </p>
        </div>

        {/* 1. Mobile Overview */}
        <section id="mobile-overview" className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-mono font-bold">01</span>
            <span>{language === 'km' ? 'លក្ខណៈបច្ចេកទេសនៃ Mobile App' : 'Mobile Application Architecture'}</span>
          </h2>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 shadow-2xs">
            <p>
              កម្មវិធីទូរស័ព្ទដៃត្រូវបានបង្កើតឡើងដោយ <strong>Flutter 3.2+ / Dart 3.2+</strong> ជាមួយស្ថាបត្យកម្ម <strong>Feature-First Architecture</strong> ដូចជា៖
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4">
              {[
                { title: 'Biometric Local Auth', icon: Fingerprint, desc: 'ស្កេនមេដៃ / Face ID ដោះសោរ' },
                { title: 'Dynamic QR Attendance', icon: QrCode, desc: 'ស្កេនវត្តមានជាមួយ Geofencing' },
                { title: 'Hive Local Offline Cache', icon: WifiOff, desc: 'គិតលុយ និងរក្សាទុកទិន្នន័យពេលដាច់ Net' },
                { title: 'Mobile ESC/POS Printing', icon: Printer, desc: 'ព្រីនវិក្កយបត្រតាម Bluetooth' },
                { title: 'Riverpod State Management', icon: Shield, desc: 'គ្រប់គ្រង State ប្រកបដោយសុវត្ថិភាព' },
                { title: 'FL Chart Dashboard', icon: FileText, desc: 'ក្រាហ្វិកស្ថិតិចំណូលលក់ចល័ត' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
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
