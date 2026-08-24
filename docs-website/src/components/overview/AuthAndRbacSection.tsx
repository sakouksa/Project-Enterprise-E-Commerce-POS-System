import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { Link } from 'react-router-dom';
import {
  Shield,
  KeyRound,
  Lock,
  CheckCircle2,
  XCircle,
  Building2,
  GitBranch,
  Warehouse,
  ArrowRight,
  Fingerprint,
  RefreshCw,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

export const AuthAndRbacSection: React.FC = () => {
  const { language } = useDocs();
  const [selectedRole, setSelectedRole] = useState<'super_admin' | 'manager' | 'cashier' | 'warehouse' | 'accountant'>('cashier');

  const roleMatrices = {
    cashier: {
      name: 'Cashier (អ្នកគិតលុយ)',
      desc: 'Front-desk point-of-sale operator with restricted local register permissions.',
      allowed: [
        'POS Checkout & Cart Management (`pos.checkout`)',
        'Search Products & Barcodes (`products.view`)',
        'Create & Lookup Customers (`customers.create`)',
        'Scan Dynamic Attendance QR (`attendance.scan`)',
        'Print 80mm ESC/POS Thermal Receipts (`pos.print`)',
        'Open & Close Cash Drawer Shifts (`pos.drawer`)'
      ],
      denied: [
        'View Executive Revenue & Profit Reports (`reports.finance`)',
        'Modify Product Master Pricing or Cost (`products.edit`)',
        'Create or Modify System Users (`users.create`)',
        'Approve Procurement Purchase Orders (`purchases.approve`)',
        'Adjust Warehouse Stock Balances (`inventory.adjust`)',
        'Access Global System Settings (`settings.manage`)'
      ]
    },
    warehouse: {
      name: 'Warehouse Keeper (អ្នកគ្រប់គ្រងស្តុក)',
      desc: 'Controls physical warehouse balances, stock counts, receiving, and inter-branch transfers.',
      allowed: [
        'Receive Purchase Order Shipments (`purchases.receive`)',
        'Execute Inter-Branch Stock Transfers (`inventory.transfer`)',
        'Perform Stock Opname Cycle Counting (`inventory.opname`)',
        'Record Damaged Goods & Write-Offs (`inventory.adjust`)',
        'View Warehouse Specific Stock Ledgers (`inventory.view`)'
      ],
      denied: [
        'Process Point of Sale Checkouts (`pos.checkout`)',
        'Process Employee Payroll & Salary Payouts (`payroll.manage`)',
        'Manage Storefront Banner CMS (`cms.edit`)',
        'Delete Financial Ledger Records (`finance.delete`)'
      ]
    },
    manager: {
      name: 'Branch Manager (ប្រធានសាខា)',
      desc: 'Oversees branch operations, cashier shifts, inventory transfers, and employee attendance.',
      allowed: [
        'View Branch Sales & Revenue Dashboards (`sales.view_branch`)',
        'Approve Inter-Branch Stock Requisitions (`inventory.approve`)',
        'Manage Branch Employee Schedules & Attendance (`attendance.manage`)',
        'Authorize High-Value Sale Discounts & Returns (`sales.discount_override`)',
        'View Cashier Register Shift Audits (`pos.shift_audit`)'
      ],
      denied: [
        'Manage Global Spatie Roles & Permissions (`roles.manage`)',
        'Access Other Branches Isolated Financial Books (`tenant.cross_branch`)',
        'Configure Payment Gateway API Credentials (`settings.gateways`)'
      ]
    },
    accountant: {
      name: 'Accountant (គណនេយ្យករ)',
      desc: 'Oversees general ledger, accounts payable/receivable, payroll computations, and tax filings.',
      allowed: [
        'Calculate Monthly Payroll & Cambodian Tax (`payroll.calculate`)',
        'Generate 48 PDF & Excel Financial Reports (`reports.all`)',
        'Track Supplier Payments & Accounts Payable (`purchases.pay`)',
        'Audit Immutable Inventory Movement Ledgers (`inventory.audit`)',
        'Record Operating Expenses & Cash Inflows (`expenses.manage`)'
      ],
      denied: [
        'Directly Delete Database Transactional Logs (`db.raw_delete`)',
        'Perform Physical Cashier Checkout (`pos.checkout`)',
        'Modify User Password Credentials (`users.passwords`)'
      ]
    },
    super_admin: {
      name: 'Super Admin (អ្នកគ្រប់គ្រងជាន់ខ្ពស់)',
      desc: 'Full unrestricted governance across all companies, branches, permissions, and database tables.',
      allowed: [
        'Global Governance over 99 PostgreSQL Tables (`*`)',
        'Assign 169 Spatie Permissions across 6 Roles (`roles.manage`)',
        'Create New Tenant Companies & Branches (`branches.create`)',
        'Configure S3 Storage, MinIO, Redis, & Bakong API (`settings.all`)',
        'Audit System Telescope Telemetry & Activity Logs (`logs.view`)'
      ],
      denied: []
    }
  };

  const currentMatrix = roleMatrices[selectedRole];

  return (
    <section id="auth-and-rbac" className="mb-14 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">
            04
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Security & Access Control
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'ការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ & សិទ្ធិ Spatie RBAC' : 'Authentication & Spatie RBAC Governance'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl font-normal">
          {language === 'km'
            ? 'ប្រព័ន្ធការពារសុវត្ថិភាពច្រើនជាន់៖ Dual JWT Tokens, សិទ្ធិលម្អិត ១៦៩ មុខងារ និងការញែកទិន្នន័យដាច់ដោយឡែកតាមសាខា (Branch Scoping)'
            : 'Multi-layered enterprise security architecture: Dual cryptographic JWT tokens, 169 granular Spatie RBAC permission nodes, and strict branch-level data scoping.'}
        </p>
      </div>

      {/* 2 Grid: Dual JWT Architecture + Branch Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dual Token Auth Visual */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Dual-Token Cryptographic Auth
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300">
              Sanctum + JWT
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-slate-900 dark:text-slate-100 font-bold">
                <span>1. Short-Lived Access Token</span>
                <span className="text-brand-600 dark:text-brand-400">15 Minutes</span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Stored in memory (Zustand/Riverpod); sent with every HTTP request in `Authorization: Bearer` header.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-slate-900 dark:text-slate-100 font-bold">
                <span>2. Rotating Refresh Token</span>
                <span className="text-emerald-600 dark:text-emerald-400">30 Days (DB Hashed)</span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Stored in `personal_access_tokens` table. Automatically rotated upon token refresh; instantly revokable on logout.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-slate-900 dark:text-slate-100 font-bold">
                <span>3. Mobile Biometric Unlock</span>
                <span className="text-purple-600 dark:text-purple-400">Fingerprint / FaceID</span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Flutter `local_auth` unlocks cached credentials from secure OS hardware keychain without re-entering passwords.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Company & Branch Isolation Hierarchy */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Multi-Branch Data Isolation
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
              Tenant Scoped
            </span>
          </div>

          <div className="space-y-3">
            {/* Visual Hierarchy */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span className="font-bold">Company</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-600" />
                <span className="font-bold">Branch</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-purple-600" />
                <span className="font-bold">Warehouse</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {language === 'km'
                ? 'Eloquent Models ប្រើប្រាស់ Global Query Scope ដើម្បីច្រោះទិន្នន័យ `WHERE branch_id = ?` ដោយស្វ័យប្រវត្តិ។ បុគ្គលិកសាខា A មិនអាចមើលឃើញ ឬកែប្រែទិន្នន័យលក់ និងស្តុករបស់សាខា B បានឡើយ។'
                : 'Laravel Eloquent models inject global query scopes (`where("branch_id", $activeBranchId)`) automatically. Staff in Branch A are mathematically isolated from viewing or altering Branch B transactions.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Role Permission Matrix Inspector */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                169 Audited Spatie Permissions
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {language === 'km' ? 'តារាងផ្ទៀងផ្ទាត់សិទ្ធិតាមតួនាទី (Role Matrix)' : 'Live Role Permission Matrix Inspector'}
            </h3>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['cashier', 'warehouse', 'manager', 'accountant', 'super_admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedRole === r
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {roleMatrices[r].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Role Info Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-500/20">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-brand-900 dark:text-brand-200">
                {currentMatrix.name}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                {currentMatrix.desc}
              </div>
            </div>
          </div>
        </div>

        {/* Allowed vs Denied 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Allowed List */}
          <div className="space-y-3">
            <div className="text-xs font-bold font-mono uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Explicitly Authorized Capabilities (សិទ្ធិអនុញ្ញាត)</span>
            </div>
            <div className="space-y-2">
              {currentMatrix.allowed.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-emerald-50/40 dark:bg-emerald-500/5 border border-emerald-200/60 dark:border-emerald-500/20 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Denied List */}
          <div className="space-y-3">
            <div className="text-xs font-bold font-mono uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Strictly Prohibited & Guard Blocked (សិទ្ធិហាមឃាត់)</span>
            </div>
            {currentMatrix.denied.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center font-mono">
                Super Admin holds root bypass permissions over all system policies.
              </div>
            ) : (
              <div className="space-y-2">
                {currentMatrix.denied.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-rose-50/40 dark:bg-rose-500/5 border border-rose-200/60 dark:border-rose-500/20 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
          <span>Configured via `roles`, `permissions`, and `model_has_permissions` tables in PostgreSQL 18</span>
          <Link to="/auth-rbac" className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            <span>Explore 169 Permissions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
