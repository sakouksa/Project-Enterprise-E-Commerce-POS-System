import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import {
  Truck,
  CreditCard,
  ShoppingBag,
  Package,
  Users,
  Bell,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Database,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

export const BusinessWorkflowsSection: React.FC = () => {
  const { language } = useDocs();
  const [activeFlowId, setActiveFlowId] = useState<string>('purchase');

  const flows = [
    {
      id: 'purchase',
      name: '1. Procurement & Purchase Flow',
      nameKh: '១. លំហូរការបញ្ជាទិញចូល (PO)',
      icon: Truck,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
      description: 'How goods are requested, approved, received into warehouses, and paid to suppliers.',
      descriptionKh: 'ដំណើរការបញ្ជាទិញពីអ្នកផ្គត់ផ្គង់ អនុម័ត PO ទទួលទំនិញចូលឃ្លាំង និងទូទាត់ប្រាក់។',
      steps: [
        { num: '01', title: 'Supplier Selection', titleKh: 'ជ្រើសរើសអ្នកផ្គត់ផ្គង់', desc: 'Select registered vendor and payment credit terms.' },
        { num: '02', title: 'PO Draft Creation', titleKh: 'បង្កើតពង្រាង PO', desc: 'Add line items with cost prices, expected delivery dates.' },
        { num: '03', title: 'Approval & Ordering', titleKh: 'អនុម័ត និងបញ្ជូន PO', desc: 'Manager approves PO; status updates to `ordered`.' },
        { num: '04', title: 'Goods Receiving', titleKh: 'ទទួលទំនិញចូលឃ្លាំង', desc: 'Warehouse inspects delivery (supports partial receiving).' },
        { num: '05', title: 'Stock Increment & COGS', titleKh: 'កើនស្តុក & គណនាថ្លៃដើម', desc: 'Database increments `inventories` and recalculates Moving Average Cost.' },
        { num: '06', title: 'Movement Ledger Record', titleKh: 'កត់ត្រាចលនាស្តុក', desc: 'Writes immutable audit record to `inventory_movements` table.' },
        { num: '07', title: 'Accounts Payable & Report', titleKh: 'ទូទាត់ប្រាក់ & របាយការណ៍', desc: 'Accountant records payment installment; updates purchase reports.' }
      ],
      tablesChanged: ['purchases', 'purchase_items', 'inventories', 'inventory_movements', 'supplier_payments'],
      keyInvariants: 'Negative inventory prevention; atomic updates to both stock balance and moving average unit cost.'
    },
    {
      id: 'pos',
      name: '2. Retail POS Checkout Flow',
      nameKh: '២. លំហូរគិតលុយរហ័ស POS',
      icon: CreditCard,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
      description: 'Sub-second in-store cashier sale with Bakong KHQR and row-level stock locking.',
      descriptionKh: 'ការលក់រហ័សនៅបញ្ជរគិតលុយ ស្កេនបាគូដ បង្កើតបាគង KHQR និងចាក់សោរស្តុក។',
      steps: [
        { num: '01', title: 'Open Shift Register', titleKh: 'បើកកុងទ័រប្រាក់ Shift', desc: 'Cashier logs starting cash drawer balance.' },
        { num: '02', title: 'Barcode/QR Scan', titleKh: 'ស្កេនបារកូដ / ស្វែងរកទំនិញ', desc: 'Instant camera/laser scan adds SKU directly to cart.' },
        { num: '03', title: 'Tax & Discount Rules', titleKh: 'គណនាពន្ធ & បញ្ចុះតម្លៃ', desc: 'Calculates VIP discounts, promotions, and VAT.' },
        { num: '04', title: 'Bakong Dynamic KHQR', titleKh: 'បង្កើត Dynamic KHQR', desc: 'Generates sub-second EMVCo QR with real-time polling.' },
        { num: '05', title: 'Atomic Row-Locking DB', titleKh: 'ចាក់សោរ និងកាត់ស្តុក', desc: 'PostgreSQL `lockForUpdate` decrements stock balance.' },
        { num: '06', title: '80mm Thermal Receipt', titleKh: 'ព្រីនវិក្កយបត្រ 80mm', desc: 'Prints bilingual receipt and opens cash drawer via RJ11 pulse.' }
      ],
      tablesChanged: ['sales', 'sale_items', 'payments', 'cash_registers', 'inventories', 'inventory_movements'],
      keyInvariants: 'Zero race-condition over-selling via PostgreSQL row-level locks and atomic transactions.'
    },
    {
      id: 'ecommerce',
      name: '3. E-Commerce Storefront Flow',
      nameKh: '៣. លំហូរទិញទំនិញអនឡាញ',
      icon: ShoppingBag,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
      description: 'Online customer product discovery, cart, KHQR checkout, and delivery tracking.',
      descriptionKh: 'អតិថិជនស្វែងរកទំនិញ កន្ត្រកទំនិញ បញ្ជាទិញ និងតាមដានការដឹកជញ្ជូន។',
      steps: [
        { num: '01', title: 'Browse & Fuzzy Search', titleKh: 'ស្វែងរក និងច្រោះទំនិញ', desc: 'Real-time category, brand, and price filter.' },
        { num: '02', title: 'Persistent Cart State', titleKh: 'រក្សាទុកកន្ត្រកទំនិញ', desc: 'Zustand persistent local storage syncs with backend.' },
        { num: '03', title: 'Checkout & Delivery Info', titleKh: 'បំពេញអាសយដ្ឋានដឹកជញ្ជូន', desc: 'Customer selects shipping address and courier.' },
        { num: '04', title: 'KHQR Payment Gateway', titleKh: 'ទូទាត់តាម KHQR', desc: 'Scans QR on banking app; webhook verifies transaction.' },
        { num: '05', title: 'Order & Warehouse Dispatch', titleKh: 'បង្កើត Order & រៀបចំទំនិញ', desc: 'Order enters pending status for warehouse packing.' },
        { num: '06', title: 'Live Order Tracking', titleKh: 'តាមដានស្ថានភាពកញ្ចប់ទំនិញ', desc: 'Customer monitors order status in account portal.' }
      ],
      tablesChanged: ['orders', 'order_items', 'carts', 'wishlists', 'payments', 'inventories'],
      keyInvariants: 'Temporary 15-min inventory reservations prevent checkout collisions.'
    },
    {
      id: 'inventory-life',
      name: '4. Inventory Lifecycle & Transfers',
      nameKh: '៤. វដ្តជីវិតស្តុក & ការផ្ទេរឆ្លងឃ្លាំង',
      icon: Package,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
      description: 'Stock IN, Stock OUT, inter-branch transfers, adjustments, and cycle count opname.',
      descriptionKh: 'ការនាំស្តុកចូល នាំស្តុកចេញ ផ្ទេរស្តុកឆ្លងសាខា និងរាប់ស្តុកជាក់ស្តែង។',
      steps: [
        { num: '01', title: 'Stock IN (PO / Return)', titleKh: 'ស្តុកចូល (ទិញចូល/ប្តូរ)', desc: 'Increases balance upon verified receipt.' },
        { num: '02', title: 'Stock OUT (POS / Order)', titleKh: 'ស្តុកចេញ (លក់/បញ្ជូន)', desc: 'Decrements balance atomically on sale checkout.' },
        { num: '03', title: 'Inter-Branch Transfer', titleKh: 'ផ្ទេរស្តុកឆ្លងសាខា', desc: 'Transfers deduct source immediately; hold in transit until dest receives.' },
        { num: '04', title: 'Stock Adjustments (+/-)', titleKh: 'កែសម្រួលស្តុក (ខូច/បាត់)', desc: 'Audited manual corrections with mandatory manager reason notes.' },
        { num: '05', title: 'Cycle Count Opname', titleKh: 'រាប់ស្តុកជាក់ស្តែង Opname', desc: 'Physical barcode audit reconciles system ledger discrepancies.' }
      ],
      tablesChanged: ['inventories', 'inventory_movements', 'stock_transfers', 'stock_adjustments'],
      keyInvariants: 'Every quantity variation is audited with timestamp, user_id, and immutable movement reason.'
    },
    {
      id: 'customer-data',
      name: '5. Customer Data & Privacy Flow',
      nameKh: '៥. ទិន្នន័យអតិថិជន & ភាពឯកជន',
      icon: Users,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30',
      description: 'Strict customer ownership isolation across orders, wishlist, addresses, and reviews.',
      descriptionKh: 'ការគ្រប់គ្រងទិន្នន័យអតិថិជន និងការពារឯកជនភាពមិនឱ្យលេចធ្លាយឆ្លងគ្នា។',
      steps: [
        { num: '01', title: 'Registration & JWT', titleKh: 'ចុះឈ្មោះ & បង្កើត JWT', desc: 'Customer registers with encrypted Bcrypt password.' },
        { num: '02', title: 'Profile & Saved Addresses', titleKh: 'ព័ត៌មានផ្ទាល់ខ្លួន & អាសយដ្ឋាន', desc: 'Customer maintains multiple delivery locations.' },
        { num: '03', title: 'Order History Isolation', titleKh: 'ប្រវត្តិបញ្ជាទិញផ្ទាល់ខ្លួន', desc: 'Backend queries strictly enforce `where user_id = auth()->id()`.' },
        { num: '04', title: 'Reviews & Wishlist', titleKh: 'ការវាយតម្លៃ & បញ្ជីទំនិញពេញចិត្ត', desc: 'Authenticated reviews require verified purchase badge.' }
      ],
      tablesChanged: ['customers', 'users', 'customer_addresses', 'orders', 'wishlists', 'reviews'],
      keyInvariants: 'Customer A cannot query or mutate Customer B records under any circumstances.'
    },
    {
      id: 'notifications',
      name: '6. Enterprise Notification Flow',
      nameKh: '៦. លំហូរប្រព័ន្ធជូនដំណឹង',
      icon: Bell,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30',
      description: 'How low-stock alerts, new orders, and approval events dispatch across multiple channels.',
      descriptionKh: 'ការផ្ញើសារដាស់តឿនស្តុកទាប ការបញ្ជាទិញថ្មី តាមប្រព័ន្ធ In-App, Email, និង Webhook។',
      steps: [
        { num: '01', title: 'Business Event Fired', titleKh: 'ព្រឹត្តិការណ៍អាជីវកម្មកើតឡើង', desc: 'E.g., `LowStockDetected`, `NewOrderPlaced`, `POApproved`.' },
        { num: '02', title: 'Notification Service', titleKh: 'សេវាកម្មចាត់ចែងការជូនដំណឹង', desc: 'Resolves recipient users, channels, and localized message templates.' },
        { num: '03', title: 'In-App Database Bell', titleKh: 'កត់ត្រាក្នុង Database Bell', desc: 'Stores notification in `notifications` table for real-time header bell.' },
        { num: '04', title: 'Async Email & Push', titleKh: 'ផ្ញើ Email & Push Notification', desc: 'Redis queue dispatches HTML emails and FCM push payloads asynchronously.' }
      ],
      tablesChanged: ['notifications', 'activity_log', 'jobs'],
      keyInvariants: 'Notification failures do not block primary database transactions.'
    },
    {
      id: 'reporting',
      name: '7. 48 Reporting & Export Flow',
      nameKh: '៧. លំហូរ ៤៨ របាយការណ៍ & Export',
      icon: BarChart3,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30',
      description: 'How raw PostgreSQL transactional ledgers aggregate into interactive charts, Excel, and DomPDF.',
      descriptionKh: 'ការប្រមូលផ្តុំទិន្នន័យពី PostgreSQL 18 បង្ហាញជាក្រាហ្វិក និង Export ជា Excel/PDF។',
      steps: [
        { num: '01', title: 'Transactional Source', titleKh: 'ទិន្នន័យប្រតិបត្តិការស្នូល', desc: 'Millions of rows in sales, purchases, inventory, and payroll.' },
        { num: '02', title: 'Indexed SQL Aggregation', titleKh: 'ការបូកសរុបតាម SQL Index', desc: 'PostgreSQL executes optimized grouped queries with date bounds.' },
        { num: '03', title: 'REST API & TanStack Cache', titleKh: 'បញ្ជូនតាម API & Cache', desc: 'Frontend caches report responses to enable instantaneous tab switching.' },
        { num: '04', title: 'Interactive Charts', titleKh: 'បង្ហាញក្រាហ្វិក Recharts/FLChart', desc: 'Renders revenue breakdown, margins, and stock velocity curves.' },
        { num: '05', title: 'Streaming Excel / DomPDF', titleKh: 'ទាញយក Excel / PDF ផ្លូវការ', desc: 'Server streams formatted binary sheets and bilingual DomPDF invoices.' }
      ],
      tablesChanged: ['sales', 'purchases', 'inventories', 'payrolls', 'expenses'],
      keyInvariants: 'Read-only aggregations with pagination and streaming memory limits.'
    }
  ];

  const currentFlow = flows.find((f) => f.id === activeFlowId) || flows[0];
  const CurrentIcon = currentFlow.icon;

  return (
    <section id="business-workflows" className="mb-14 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-mono font-bold">
            06
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Operational Workflows
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'លំហូរការងារអាជីវកម្មស្នូលទាំង ៧ (7 Core Business Flows)' : '7 End-to-End Business Workflows'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl font-normal">
          {language === 'km'
            ? 'ជ្រើសរើសលំហូរការងារខាងក្រោមដើម្បីស្វែងយល់ពីរបៀបដែលការបញ្ជាទិញចូល ការលក់ POS ស្តុកឃ្លាំង វត្តមាន និងរបាយការណ៍ដំណើរការជាក់ស្តែង'
            : 'Select any operational workflow to trace its sequence of events, database tables modified, and architectural invariants.'}
        </p>
      </div>

      {/* Horizontal Workflow Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {flows.map((flow) => {
          const Icon = flow.icon;
          const isActive = activeFlowId === flow.id;
          return (
            <button
              key={flow.id}
              onClick={() => setActiveFlowId(flow.id)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'km' ? flow.nameKh : flow.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Workflow Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl border ${currentFlow.color} flex items-center justify-center shrink-0`}>
              <CurrentIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {language === 'km' ? currentFlow.nameKh : currentFlow.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'km' ? currentFlow.descriptionKh : currentFlow.description}
              </p>
            </div>
          </div>
        </div>

        {/* Step Progression Visual */}
        <div className="space-y-3">
          <div className="text-xs font-bold font-mono uppercase text-slate-400">
            Step-by-Step Sequence
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {currentFlow.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-2 group hover:border-brand-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold text-xs flex items-center justify-center border border-brand-200 dark:border-brand-500/20">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Step {idx + 1}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {language === 'km' ? step.titleKh : step.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tables & Invariants Footnote */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
            <div className="text-[11px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-500" />
              <span>PostgreSQL 18 Tables Mutated</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentFlow.tablesChanged.map((tbl, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20"
                >
                  {tbl}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
            <div className="text-[11px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Core Architectural Invariant</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {currentFlow.keyInvariants}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
