import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { EcosystemDiagram } from '../components/diagrams/EcosystemDiagram';
import { Network } from 'lucide-react';

export const EcosystemPage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'interactive-network', label: 'Ecosystem Network Diagram' },
    { id: 'cross-channel-flow', label: 'Cross-Channel Synchronization' },
    { id: 'port-mapping', label: 'Monorepo Ports & Networking' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'System Ecosystem' }]} />

        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
            <Network className="w-3.5 h-3.5" />
            <span>Real-Time Interconnects</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'បណ្តាញទំនាក់ទំនងប្រព័ន្ធអេកូឡូស៊ី (System Ecosystem)' : 'System Ecosystem & Communication'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km'
              ? 'របៀបដែល Admin Dashboard, Customer Storefront, POS Terminal, Mobile App, Laravel Backend, PostgreSQL, Redis, MinIO, និង Queue Workers ធ្វើការរួមគ្នាដោយគ្មានភាពរអាក់រអួល។'
              : 'How the distributed frontends, unified backend, relational persistence, caches, object storage, and background worker queues communicate synchronously and asynchronously.'}
          </p>
        </div>

        <section id="interactive-network">
          <EcosystemDiagram />
        </section>

        <section id="cross-channel-flow" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-mono font-bold">01</span>
            <span>{language === 'km' ? 'សមកាលកម្មទិន្នន័យឆ្លងប៉ុស្តិ៍លក់ (Cross-Channel Sync)' : 'Cross-Channel Synchronization'}</span>
          </h2>
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 shadow-2xs">
            <p>
              នៅពេលដែលប្រតិបត្តិការលក់កើតឡើងនៅ <strong>POS Terminal</strong> (ហាងផ្ទាល់) ឬការបញ្ជាទិញតាម <strong>Customer Website</strong> (អនឡាញ)៖
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
              <li><strong>Atomic Inventory Deduction:</strong> Laravel Backend កាត់ស្តុកក្នុង `inventories` table ភ្លាមៗក្នុង DB Transaction។</li>
              <li><strong>Redis Cache Invalidation:</strong> Cache នៃផលិតផលនោះត្រូវបាន Clear ដើម្បីឱ្យ Web/App ឃើញចំនួនស្តុកថ្មីភ្លាមៗ។</li>
              <li><strong>WebSocket / Telegram Notification:</strong> Pusher/WebSocket បញ្ជូន Signal ទៅ Update អេក្រង់ Admin Dashboard រីឯ Telegram Bot ផ្ញើវិក្កយបត្រជូន Store Manager។</li>
            </ol>
          </div>
        </section>

        <section id="port-mapping" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-mono font-bold">02</span>
            <span>{language === 'km' ? 'ច្រក Network Port ក្នុង Monorepo' : 'Monorepo Local Port Mapping'}</span>
          </h2>
          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 p-4 shadow-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3">Service / Application</th>
                  <th className="py-2.5 px-3">Port</th>
                  <th className="py-2.5 px-3">Tech Stack</th>
                  <th className="py-2.5 px-3">Environment URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-brand-600 dark:text-brand-400">Laravel REST Backend</td>
                  <td className="py-2.5 px-3">8000</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">PHP 8.2 / Laravel 12</td>
                  <td className="py-2.5 px-3">http://localhost:8000</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">Admin Dashboard</td>
                  <td className="py-2.5 px-3">5173</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">React 19 / Vite 8</td>
                  <td className="py-2.5 px-3">http://localhost:5173</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-purple-600 dark:text-purple-400">Customer Storefront</td>
                  <td className="py-2.5 px-3">5174</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">React 19 / Vite 8</td>
                  <td className="py-2.5 px-3">http://localhost:5174</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">Documentation Portal</td>
                  <td className="py-2.5 px-3">5175</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">React 19 / Vite</td>
                  <td className="py-2.5 px-3">http://localhost:5175</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">PostgreSQL Database</td>
                  <td className="py-2.5 px-3">5432</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Postgres 18 Alpine</td>
                  <td className="py-2.5 px-3">localhost:5432</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">Redis Cache & Queue</td>
                  <td className="py-2.5 px-3">6379</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">Redis 7 Alpine</td>
                  <td className="py-2.5 px-3">localhost:6379</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
