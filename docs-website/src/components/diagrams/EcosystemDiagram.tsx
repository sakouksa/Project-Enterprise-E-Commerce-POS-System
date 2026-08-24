import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { Layers, Database, Smartphone, ShoppingCart, HardDrive, Bell, RefreshCw, Cpu } from 'lucide-react';

export const EcosystemDiagram: React.FC = () => {
  const { language } = useDocs();
  const [selectedNode, setSelectedNode] = useState<string>('backend');

  const titles: Record<string, string> = {
    km: 'បណ្តាញទំនាក់ទំនងនៃប្រព័ន្ធអេកូឡូស៊ីទាំងមូល',
    en: 'System Ecosystem & Communication Network',
    th: 'ระบบนิเวศน์และเครือข่ายการสื่อสารของระบบ',
    vi: 'Hệ sinh thái & Mạng lưới Giao tiếp Toàn hệ thống',
    zh: '全系统生态网络与实时通信架构',
  };

  const badgeLabels: Record<string, string> = {
    km: 'សមកាលកម្មទិន្នន័យពេលវេលាជាក់ស្តែង',
    en: 'Real-Time System Interconnects',
    th: 'การเชื่อมต่อระบบแบบเรียลไทม์',
    vi: 'Kết nối Hệ thống Thời gian thực',
    zh: '全系统实时通信互联网络',
  };

  const hintLabels: Record<string, string> = {
    km: 'ចុចលើសមាសភាគណាមួយដើម្បីមើលផ្លូវតភ្ជាប់ទិន្នន័យ',
    en: 'Click any ecosystem component node to view communication paths',
    th: 'คลิกโหนดเพื่อดูเส้นทางการสื่อสารของข้อมูล',
    vi: 'Nhấp vào bất kỳ thành phần nào để xem đường truyền dữ liệu',
    zh: '点击任意生态节点查看其上下游调用关系与通信拓扑',
  };

  const nodes: Record<string, { title: string; titleKh: string; desc: string; descKh: string; icon: any; color: string; connections: string[] }> = {
    admin: {
      title: 'Admin Dashboard (React 19)',
      titleKh: 'ផ្ទាំងគ្រប់គ្រង Admin Dashboard',
      desc: 'Central management console for store managers, accountants, and super admins. Dispatches REST requests with JWT authentication.',
      descKh: 'ផ្ទាំងគ្រប់គ្រងកណ្តាលសម្រាប់ Admin, Manager និងគណនេយ្យករ។ ភ្ជាប់ API ជាមួយ JWT Authentication។',
      icon: Layers,
      color: '#0E8CEB',
      connections: ['backend', 'pos']
    },
    storefront: {
      title: 'Customer Storefront (React 19)',
      titleKh: 'គេហទំព័រអតិថិជន Customer Storefront',
      desc: 'High-speed e-commerce catalog, shopping cart, and checkout interface with real-time KHQR payment.',
      descKh: 'គេហទំព័រទិញទំនិញអនឡាញ កន្ត្រកទំនិញ និងទូទាត់ប្រាក់តាម KHQR។',
      icon: ShoppingCart,
      color: '#10B981',
      connections: ['backend']
    },
    mobile: {
      title: 'Flutter Mobile Terminal',
      titleKh: 'កម្មវិធីទូរស័ព្ទ Mobile App (Flutter)',
      desc: 'Mobile POS and staff terminal with biometric security, dynamic QR attendance clock-in, and local Hive offline cache.',
      descKh: 'កម្មវិធីទូរស័ព្ទដៃសម្រាប់បុគ្គលិកស្កេនវត្តមាន គិតលុយ និងស្តុកទំនិញ។',
      icon: Smartphone,
      color: '#8B5CF6',
      connections: ['backend']
    },
    backend: {
      title: 'Laravel 12 REST API Hub',
      titleKh: 'ម៉ាស៊ីនកណ្តាល Laravel 12 Backend API',
      desc: 'Single source of truth for business logic, atomic DB transactions, multi-tenant RBAC, and event queues.',
      descKh: 'បេះដូងកណ្តាលនៃប្រព័ន្ធ គ្រប់គ្រង Business Logic, DB Transactions, និងសិទ្ធិ Spatie RBAC។',
      icon: Cpu,
      color: '#EC4899',
      connections: ['database', 'redis', 'storage', 'queue']
    },
    database: {
      title: 'PostgreSQL Relational DB (99 Tables)',
      titleKh: 'មូលដ្ឋានទិន្នន័យ PostgreSQL (៩៩ តារាង)',
      desc: 'Relational ACID persistence with strict foreign key constraints, indexes, and row-level locking for inventory integrity.',
      descKh: 'ផ្ទុកទិន្នន័យស្នូលទាំងអស់ មាន Foreign Key និង Row-Level Lock ការពារស្តុក។',
      icon: Database,
      color: '#6366F1',
      connections: ['backend']
    },
    redis: {
      title: 'Redis In-Memory Cache & Lock',
      titleKh: 'ប្រព័ន្ធចងចាំ Redis Cache & Mutex Lock',
      desc: 'Sub-millisecond query cache for catalog, session store, and concurrency mutex locks during checkout.',
      descKh: 'បង្កើនល្បឿនទាញយកទិន្នន័យ និងចាក់សោរការពារការដណ្តើមទិញទំនិញជាន់គ្នា។',
      icon: RefreshCw,
      color: '#F59E0B',
      connections: ['backend']
    },
    storage: {
      title: 'S3 / MinIO Media Storage',
      titleKh: 'ឃ្លាំងផ្ទុកមេឌៀ MinIO / S3 Object Storage',
      desc: 'Unified object storage handling product images, WebP responsive derivatives, and generated PDF reports/receipts.',
      descKh: 'ផ្ទុករូបភាពផលិតផល WebP និងឯកសារ PDF វិក្កយបត្រ/របាយការណ៍។',
      icon: HardDrive,
      color: '#14B8A6',
      connections: ['backend']
    },
    queue: {
      title: 'Async Job Workers & Notifications',
      titleKh: 'ប្រព័ន្ធការងារ Background Worker & ដំណឹង',
      desc: 'Background queues handling Telegram alerts, customer transactional emails, and automated payroll jobs.',
      descKh: 'ដំណើរការផ្ញើសារ Telegram Bot, Email អតិថិជន និងការងារធ្ងន់ៗ។',
      icon: Bell,
      color: '#EF4444',
      connections: ['backend']
    }
  };

  const current = nodes[selectedNode] || nodes.backend;
  const CurrentIcon = current.icon;

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 md:p-8 shadow-md dark:shadow-2xl my-8 backdrop-blur-xl transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            {badgeLabels[language] || badgeLabels.en}
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {titles[language] || titles.en}
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          {hintLabels[language] || hintLabels.en}
        </div>
      </div>

      {/* Nodes Network Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {Object.entries(nodes).map(([key, item]) => {
          const Icon = item.icon;
          const isSelected = key === selectedNode;
          return (
            <button
              key={key}
              onClick={() => setSelectedNode(key)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-600/15 shadow-md scale-[1.03]'
                  : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-2xs" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
              </div>
              <div className={`text-xs font-bold truncate ${isSelected ? 'text-brand-700 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                {item.title.split(' ')[0]} {item.title.split(' ')[1] || ''}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-start gap-4 flex-wrap md:flex-nowrap shadow-inner">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${current.color}20`, color: current.color }}>
          <CurrentIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{language === 'km' ? current.titleKh : current.title}</h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {selectedNode.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">{language === 'km' ? current.descKh : current.desc}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-semibold">Communicates with:</span>
            {current.connections.map((target, idx) => (
              <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-600 dark:text-brand-400 shadow-2xs">
                → {nodes[target]?.title.split(' ')[0] || target}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
