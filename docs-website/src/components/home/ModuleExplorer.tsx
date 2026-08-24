import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { StatusBadge } from '../common/StatusBadge';
import {
  Package,
  MonitorCheck,
  Boxes,
  Truck,
  ShoppingCart,
  Users,
  QrCode,
  DollarSign,
  FileBarChart,
  Bell,
  ShieldCheck,
  Settings,
  ArrowRight
} from 'lucide-react';

export const ModuleExplorer: React.FC = () => {
  const { t } = useDocs();

  const coreModules = [
    { id: 'products', name: 'Products & Variants', desc: 'Master catalog, Cartesian variants, WebP pipeline & barcodes.', icon: Package, status: 'implemented' as const, path: '/modules/products' },
    { id: 'pos', name: 'POS Terminal (KHQR)', desc: 'Sub-second cashier checkout, Bakong QR generation & 80mm receipts.', icon: MonitorCheck, status: 'implemented' as const, path: '/modules/pos' },
    { id: 'inventory', name: 'Multi-Warehouse Inventory', desc: 'Real-time multi-branch stock, transfers, loss write-offs & opname.', icon: Boxes, status: 'implemented' as const, path: '/modules/inventory' },
    { id: 'purchases', name: 'Purchases & Procurement', desc: 'Supplier POs, goods receiving notes & automated balance updates.', icon: Truck, status: 'implemented' as const, path: '/modules/purchases' },
    { id: 'sales', name: 'Sales & Orders Engine', desc: 'Omnichannel order management, refunds & discount coupons.', icon: ShoppingCart, status: 'implemented' as const, path: '/modules/sales' },
    { id: 'customers', name: 'Customers & CRM', desc: 'Customer profiles, loyalty tier points & purchase histories.', icon: Users, status: 'implemented' as const, path: '/modules/customers' },
    { id: 'attendance', name: 'Dynamic QR Attendance', desc: 'Anti-spoofing dynamic rotating QR check-in & geofencing.', icon: QrCode, status: 'implemented' as const, path: '/modules/attendance' },
    { id: 'payroll', name: 'Automated Payroll', desc: 'Salary computation, OT bonuses, deductions & electronic payslips.', icon: DollarSign, status: 'partial' as const, path: '/modules/payroll' },
    { id: 'reports', name: '48 Financial Reports', desc: 'P&L statements, tax summaries, stock valuation & PDF exports.', icon: FileBarChart, status: 'implemented' as const, path: '/reports' },
    { id: 'notifications', name: 'Notifications & Alerts', desc: 'Telegram bot webhooks, email alerts & inventory low-stock alerts.', icon: Bell, status: 'implemented' as const, path: '/modules/notifications' },
    { id: 'rbac', name: 'Users & Spatie RBAC', desc: '169 granular permissions, role matrix & branch isolation.', icon: ShieldCheck, status: 'implemented' as const, path: '/auth-rbac' },
    { id: 'settings', name: 'Multi-Store Settings', desc: 'Company profiles, tax rates, currencies (USD/KHR) & printing configs.', icon: Settings, status: 'implemented' as const, path: '/modules/settings' },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              {t.coreCapabilitiesBadge}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
            {t.coreCapabilitiesTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Core business capabilities with audited implementation statuses
          </p>
        </div>

        <Link
          to="/modules"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors shrink-0"
        >
          <span>{t.exploreAllModules}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {coreModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.id}
              to={mod.path}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 hover:border-brand-500/50 hover:bg-white dark:hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <StatusBadge status={mod.status} size="sm" />
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                  {mod.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {mod.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                <span>View Documentation</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
