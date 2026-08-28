import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { Bell, Database, Radio, MessageSquare } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'channels', label: 'Supported Notification Channels' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'Notifications Engine' }]} />

        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-3">
            <Bell className="w-3.5 h-3.5" />
            <span>Multi-Channel Notification System</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'ប្រព័ន្ធជូនដំណឹងពហុបណ្តាញ (Notifications Engine)' : 'Multi-Channel Notifications Engine'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'ការបញ្ជូនដំណឹងតាម Database (In-App Bell), WebSocket Broadcast (Pusher/Reverb), Telegram Bot Webhooks, Email និង Push Notifications លើទូរស័ព្ទដៃ។'
              : 'Multi-channel event-driven alerting architecture powering in-app bell counters, WebSocket broadcasts, Telegram receipts, and background transactional emails.'}
          </p>
        </div>

        {/* Channels */}
        <section id="channels" className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Supported Delivery Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs">
              <Database className="w-6 h-6 text-brand-600 dark:text-brand-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Database & In-App Bell</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Stores unread count in `notifications` and `notification_users` table with instant mark-as-read.</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs">
              <MessageSquare className="w-6 h-6 text-sky-600 dark:text-sky-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Telegram Bot Alerts</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Dispatches real-time sales receipts and low-stock alerts to branch Telegram groups.</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs">
              <Radio className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">WebSocket Live Broadcast</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Pushes instant sound beeps and counter increments to POS and Admin Dashboard.</p>
            </div>
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
