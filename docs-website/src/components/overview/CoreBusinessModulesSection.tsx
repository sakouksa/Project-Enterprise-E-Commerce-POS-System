import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  CreditCard,
  Package,
  Truck,
  Users,
  DollarSign,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  Database,
  Radio,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ModuleCategory {
  id: string;
  name: string;
  nameKh: string;
  icon: any;
  color: string;
  modules: {
    id: string;
    name: string;
    nameKh: string;
    path: string;
    status: 'implemented' | 'partial' | 'planned';
    purpose: string;
    purposeKh: string;
    users: string[];
    tables: string[];
    apis: string[];
    businessRules: string[];
  }[];
}

export const CoreBusinessModulesSection: React.FC = () => {
  const { language } = useDocs();
  const [activeCategory, setActiveCategory] = useState<string>('commerce');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('products');

  const moduleCategories: ModuleCategory[] = [
    {
      id: 'commerce',
      name: 'Commerce & Catalog',
      nameKh: 'ពាណិជ្ជកម្ម & កាតាឡុកទំនិញ',
      icon: ShoppingBag,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
      modules: [
        {
          id: 'products',
          name: 'Product Master Catalog',
          nameKh: 'កាតាឡុកទំនិញមេ (Product Master)',
          path: '/modules/products',
          status: 'implemented',
          purpose: 'Manages multi-variant SKUs, barcodes, pricing tiers, categories, brands, and embedded Base64/S3 images.',
          purposeKh: 'គ្រប់គ្រងផលិតផល បារកូដ ប្រភេទ ម៉ាក តម្លៃលក់ និងរូបភាពទំនិញ។',
          users: ['Admin', 'Manager', 'Cashier', 'Customer'],
          tables: ['products', 'categories', 'brands', 'product_variants', 'media'],
          apis: ['GET /api/v1/products', 'POST /api/v1/products', 'GET /api/v1/products/{id}'],
          businessRules: [
            'SKU and Barcode must be globally unique across company catalog.',
            'Cost price is dynamically updated via Moving Average Costing on PO receiving.',
            'Archived products cannot be selected in new POS or Storefront checkouts.'
          ]
        },
        {
          id: 'storefront',
          name: 'E-Commerce Storefront',
          nameKh: 'គេហទំព័រលក់ទំនិញអនឡាញ',
          path: '/customer-guide',
          status: 'implemented',
          purpose: 'High-converting responsive customer storefront with search, persistent cart, wishlist, and KHQR payment.',
          purposeKh: 'គេហទំព័រអតិថិជន ២៨ ទំព័រ កន្ត្រកទំនិញ និងទូទាត់ប្រាក់បាគង KHQR។',
          users: ['Online Customer', 'B2B Client'],
          tables: ['orders', 'order_items', 'carts', 'wishlists', 'coupons'],
          apis: ['GET /api/v1/store/products', 'POST /api/v1/store/cart', 'POST /api/v1/store/checkout'],
          businessRules: [
            'Cart items reserve inventory temporarily for 15 minutes during checkout.',
            'Orders with pending KHQR are marked `unpaid` until Bakong webhook callback verifies.'
          ]
        }
      ]
    },
    {
      id: 'pos',
      name: 'POS & Retail Sales',
      nameKh: 'ប្រព័ន្ធគិតលុយ POS & ការលក់',
      icon: CreditCard,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
      modules: [
        {
          id: 'pos-terminal',
          name: 'High-Speed POS Terminal',
          nameKh: 'ប្រព័ន្ធគិតលុយរហ័ស POS Terminal',
          path: '/modules/pos',
          status: 'implemented',
          purpose: 'Sub-second cashier register with barcode scanning, Bakong KHQR, cash drawer shifts, and ESC/POS printing.',
          purposeKh: 'គិតលុយរហ័ស បង្កើតបាគង KHQR គ្រប់គ្រងកុងទ័រប្រាក់ និងព្រីនវិក្កយបត្រ 80mm។',
          users: ['Cashier', 'Branch Manager'],
          tables: ['sales', 'sale_items', 'payments', 'cash_registers', 'cash_register_transactions'],
          apis: ['POST /api/v1/pos/checkout', 'POST /api/v1/pos/registers/open', 'POST /api/v1/pos/registers/close'],
          businessRules: [
            'Cash register shift must be opened before processing sales transactions.',
            'Inventory is deducted atomically via PostgreSQL `selectForUpdate` row locking.',
            'Full and partial returns require manager approval override.'
          ]
        }
      ]
    },
    {
      id: 'inventory',
      name: 'Inventory & Warehouses',
      nameKh: 'ស្តុកឃ្លាំងពហុសាខា',
      icon: Package,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
      modules: [
        {
          id: 'inventory-core',
          name: 'Multi-Warehouse Inventory Ledger',
          nameKh: 'សៀវភៅតាមដានស្តុកពហុឃ្លាំង',
          path: '/modules/inventory',
          status: 'implemented',
          purpose: 'Manages physical stock balances across multiple warehouses, inter-branch transfers, adjustments, and opname.',
          purposeKh: 'គ្រប់គ្រងចំនួនស្តុកតាមឃ្លាំង ផ្ទេរស្តុកឆ្លងសាខា កែតម្រូវស្តុក និងរាប់ស្តុកជាក់ស្តែង។',
          users: ['Warehouse Keeper', 'Branch Manager', 'Accountant'],
          tables: ['inventories', 'inventory_movements', 'warehouses', 'stock_transfers', 'stock_adjustments'],
          apis: ['GET /api/v1/inventory', 'POST /api/v1/inventory/transfers', 'POST /api/v1/inventory/adjustments'],
          businessRules: [
            'Negative stock is strictly blocked at the database level.',
            'Stock transfers reduce source warehouse balance immediately; destination balance increases upon receive confirmation.',
            'Every stock alteration creates an immutable record in `inventory_movements`.'
          ]
        }
      ]
    },
    {
      id: 'purchasing',
      name: 'Procurement & POs',
      nameKh: 'ការបញ្ជាទិញចូល & PO',
      icon: Truck,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
      modules: [
        {
          id: 'purchases-core',
          name: 'Purchase Orders & Receiving',
          nameKh: 'ការបញ្ជាទិញចូល និងការទទួលទំនិញ',
          path: '/modules/purchases',
          status: 'implemented',
          purpose: 'End-to-end procurement workflow: Supplier PO creation, partial receiving, accounts payable, and COGS recalculation.',
          purposeKh: 'បង្កើត PO បញ្ជាទិញពីអ្នកផ្គត់ផ្គង់ ទទួលទំនិញចូលស្តុក និងទូទាត់ប្រាក់ថ្លៃទំនិញ។',
          users: ['Purchasing Officer', 'Warehouse Keeper', 'Accountant'],
          tables: ['purchases', 'purchase_items', 'suppliers', 'supplier_payments'],
          apis: ['GET /api/v1/purchases', 'POST /api/v1/purchases', 'POST /api/v1/purchases/{id}/receive'],
          businessRules: [
            'Goods receiving increases warehouse inventory and recalculates Moving Average Cost.',
            'POs support partial deliveries (e.g. 50 of 100 received) with status tracking.',
            'Outstanding balance is tracked until accounts payable confirms complete supplier payment.'
          ]
        }
      ]
    },
    {
      id: 'hrm',
      name: 'HR & Dynamic Attendance',
      nameKh: 'ធនធានមនុស្ស & វត្តមាន QR',
      icon: Users,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30',
      modules: [
        {
          id: 'attendance-core',
          name: 'Dynamic QR Anti-Fraud Attendance',
          nameKh: 'វត្តមានស្កេន Dynamic QR ការពារការក្លែងបន្លំ',
          path: '/modules/attendance',
          status: 'implemented',
          purpose: '15-second rotating cryptographic dynamic QR on Kiosks with device UUID binding and GPS geofencing verification.',
          purposeKh: 'កត់ត្រាវត្តមានបុគ្គលិកតាម Dynamic QR ប្តូរកូដរៀងរាល់ ១៥ វិនាទី ការពារការផ្ញើរូបថតស្កេនជំនួស។',
          users: ['All Employees', 'HR Manager'],
          tables: ['attendances', 'attendance_kiosks', 'employees', 'shifts', 'departments'],
          apis: ['POST /api/v1/attendance/kiosk/token', 'POST /api/v1/attendance/scan', 'GET /api/v1/attendance/summary'],
          businessRules: [
            'Dynamic QR expires in 15 seconds; captured photos or shared screenshots are rejected.',
            'Employee mobile device hardware UUID must match registered profile.',
            'GPS coordinates must fall within 100m radius of branch location.'
          ]
        }
      ]
    },
    {
      id: 'finance',
      name: 'Finance & Payroll',
      nameKh: 'ហិរញ្ញវត្ថុ & ប្រាក់បៀវត្សរ៍',
      icon: DollarSign,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30',
      modules: [
        {
          id: 'payroll-core',
          name: 'Automated Cambodian Tax Payroll',
          nameKh: 'ការគណនាប្រាក់បៀវត្សរ៍ និងពន្ធកម្ពុជា',
          path: '/modules/payroll',
          status: 'implemented',
          purpose: 'Computes monthly salaries, overtime multipliers, NSSF contributions, and Cambodian progressive tax brackets.',
          purposeKh: 'គណនាប្រាក់ខែស្វ័យប្រវត្តិ កាត់ពន្ធកម្ពុជា ថែមម៉ោង OT និងបេឡាជាតិ ប.ស.ស ព្រមទាំងចេញ Payslip PDF។',
          users: ['Accountant', 'HR Director', 'Employees'],
          tables: ['payrolls', 'payroll_items', 'salary_advances', 'tax_brackets', 'expenses'],
          apis: ['POST /api/v1/payroll/calculate', 'POST /api/v1/payroll/{id}/approve', 'GET /api/v1/payroll/{id}/payslip'],
          businessRules: [
            'Attendance late penalties and approved overtime hours feed directly into payroll computation.',
            'Cambodian progressive income tax brackets are applied automatically.',
            'Generates official bilingual PDF payslips via Laravel DomPDF.'
          ]
        }
      ]
    }
  ];

  const currentCategory = moduleCategories.find((c) => c.id === activeCategory) || moduleCategories[0];
  const allModules = moduleCategories.flatMap((c) => c.modules);
  const selectedModule = allModules.find((m) => m.id === selectedModuleId) || allModules[0];

  return (
    <section id="core-business-modules" className="mb-14 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-mono font-bold">
            05
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Functional Domains
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'ម៉ូឌុលអាជីវកម្មស្នូល & ច្បាប់ប្រតិបត្តិការ' : 'Core Business Modules & Domain Logic'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl font-normal">
          {language === 'km'
            ? 'ពិនិត្យមើលម៉ូឌុលអាជីវកម្មសំខាន់ៗ តារាងទិន្នន័យពាក់ព័ន្ធ REST APIs និងច្បាប់អាជីវកម្ម (Business Rules) ដែលត្រូវបានអនុវត្តក្នុងកូដ'
            : 'Explore the core enterprise modules, underlying PostgreSQL tables, representative REST endpoints, and enforced business invariants.'}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {moduleCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                if (cat.modules.length > 0) setSelectedModuleId(cat.modules[0].id);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'km' ? cat.nameKh : cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Module Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Module List for active Category */}
        <div className="lg:col-span-4 space-y-2.5">
          {currentCategory.modules.map((mod) => {
            const isSelected = selectedModuleId === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModuleId(mod.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-brand-500/20'
                    : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-white dark:hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {language === 'km' ? mod.nameKh : mod.name}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                    ✅ Implemented
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {language === 'km' ? mod.purposeKh : mod.purpose}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Module Detailed Card */}
        <div className="lg:col-span-8">
          <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
                    Module Domain Specification
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {language === 'km' ? selectedModule.nameKh : selectedModule.name}
                </h3>
              </div>

              <Link
                to={selectedModule.path}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Read Module Documentation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Purpose */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {language === 'km' ? selectedModule.purposeKh : selectedModule.purpose}
            </p>

            {/* Tables & APIs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tables */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                <div className="text-xs font-bold font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-500" />
                  <span>PostgreSQL Tables</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModule.tables.map((tbl, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20"
                    >
                      {tbl}
                    </span>
                  ))}
                </div>
              </div>

              {/* APIs */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                <div className="text-xs font-bold font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sample REST Endpoints</span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  {selectedModule.apis.map((api, idx) => (
                    <div key={idx} className="text-slate-700 dark:text-slate-300 truncate">
                      {api}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Invariant Rules */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-500" />
                <span>Enforced Business Rules (ច្បាប់អាជីវកម្ម)</span>
              </div>
              <div className="space-y-2">
                {selectedModule.businessRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
