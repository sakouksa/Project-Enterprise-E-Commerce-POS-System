import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import {
  Sparkles,
  MousePointer,
  Send,
  Lock,
  Cpu,
  Database,
  RefreshCw,
  Printer,
  QrCode,
  ArrowRight,
  Code2,
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';

export const FeatureLifecycleTracingSection: React.FC = () => {
  const { language } = useDocs();
  const [selectedFeature, setSelectedFeature] = useState<'product' | 'sale' | 'transfer'>('sale');
  const [activeSimulation, setActiveSimulation] = useState<string>('pos-khqr');

  const featureLifecycles = {
    product: {
      name: 'Product Catalog Lifecycle',
      nameKh: 'វដ្តជីវិតផលិតផល (Product Lifecycle)',
      dbTable: 'products (PostgreSQL 18)',
      model: 'App\\Models\\Product\\Product',
      service: 'App\\Services\\Product\\ProductService',
      controller: 'App\\Http\\Controllers\\Api\\V1\\Product\\ProductController',
      resource: 'App\\Http\\Resources\\Product\\ProductResource',
      route: 'POST /api/v1/products',
      queryHook: 'useProductMutation() / useProductsQuery()',
      uiComponent: '<ProductFormModal /> / <ProductCard />',
      steps: [
        { layer: '1. PostgreSQL 18', detail: '`products` table defines schema: `name`, `sku`, `price`, `cost_price`, `barcode`, `category_id`.' },
        { layer: '2. Eloquent Model', detail: '`Product.php` defines `$casts`, `$fillable`, `category()`, `inventories()`, and global company scope.' },
        { layer: '3. Service Layer', detail: '`ProductService.php` optimizes images via Intervention Image and initializes warehouse inventory rows.' },
        { layer: '4. Controller & FormRequest', detail: '`StoreProductRequest` validates unique SKU; controller calls service and returns `ProductResource`.' },
        { layer: '5. REST API', detail: '`POST /api/v1/products` returns HTTP 201 with standardized `{ success: true, data: {...} }`.' },
        { layer: '6. TanStack Query', detail: '`useProductsQuery()` in React 19 invalidates product lists; updates cache optimistically.' },
        { layer: '7. React 19 UI', detail: '`<ProductCard />` in Storefront and `<ProductTable />` in Admin Dashboard re-render instantaneously.' }
      ]
    },
    sale: {
      name: 'POS Sale & KHQR Checkout Lifecycle',
      nameKh: 'វដ្តជីវិតការលក់ POS & KHQR',
      dbTable: 'sales, sale_items, payments, inventories',
      model: 'App\\Models\\Sales\\Sale, App\\Models\\Inventory\\Inventory',
      service: 'App\\Services\\Sales\\POSService & BakongService',
      controller: 'App\\Http\\Controllers\\Api\\V1\\POS\\POSController',
      resource: 'App\\Http\\Resources\\Sales\\SaleResource',
      route: 'POST /api/v1/pos/checkout',
      queryHook: 'useCheckoutMutation() (TanStack Query)',
      uiComponent: '<POSRegisterScreen /> & <ReceiptPrintModal />',
      steps: [
        { layer: '1. PostgreSQL 18', detail: 'PostgreSQL row-level lock (`selectForUpdate`) isolates inventory rows exclusively.' },
        { layer: '2. Eloquent Models', detail: '`Sale`, `SaleItem`, `Payment`, and `InventoryMovement` models instantiated inside transaction.' },
        { layer: '3. Service Layer', detail: '`POSService` validates shift status, calculates taxes, discounts, and calls `BakongService` for KHQR.' },
        { layer: '4. Controller & FormRequest', detail: '`CheckoutRequest` enforces non-empty cart; `POSController` executes transaction.' },
        { layer: '5. REST API', detail: '`POST /api/v1/pos/checkout` returns HTTP 201 with invoice number and QR string.' },
        { layer: '6. State Cache', detail: 'Zustand cart empties; TanStack Query invalidates low stock alerts and register drawer balance.' },
        { layer: '7. React 19 UI', detail: 'Receipt modal appears; WebUSB ESC/POS thermal command fires to print 80mm ticket.' }
      ]
    },
    transfer: {
      name: 'Inter-Branch Stock Transfer Lifecycle',
      nameKh: 'វដ្តជីវិតការផ្ទេរស្តុកឆ្លងសាខា',
      dbTable: 'stock_transfers, stock_transfer_items, inventories',
      model: 'App\\Models\\Inventory\\StockTransfer',
      service: 'App\\Services\\Inventory\\StockTransferService',
      controller: 'App\\Http\\Controllers\\Api\\V1\\Inventory\\StockTransferController',
      resource: 'App\\Http\\Resources\\Inventory\\StockTransferResource',
      route: 'POST /api/v1/inventory/transfers',
      queryHook: 'useStockTransferMutation()',
      uiComponent: '<StockTransferModal /> & <TransferList />',
      steps: [
        { layer: '1. PostgreSQL 18', detail: 'Source warehouse balance decremented; transit balance tracked in `stock_transfers`.' },
        { layer: '2. Eloquent Models', detail: '`StockTransfer` records from_warehouse_id, to_warehouse_id, and status (`in_transit`).' },
        { layer: '3. Service Layer', detail: '`StockTransferService` verifies source stock availability and writes immutable ledger records.' },
        { layer: '4. Controller', detail: '`StockTransferController` enforces manager authorization before dispatching.' },
        { layer: '5. REST API', detail: '`POST /api/v1/inventory/transfers` responds with transfer manifest payload.' },
        { layer: '6. Query Cache', detail: 'React Query syncs transfer queues across both source and destination branch views.' },
        { layer: '7. UI Render', detail: 'Destination warehouse keeper receives in-transit alert ready for barcode scan receiving.' }
      ]
    }
  };

  const simulations = [
    {
      id: 'pos-khqr',
      title: 'Click: "Pay with Bakong KHQR"',
      titleKh: 'ចុច: "ទូទាត់ជាមួយបាគង KHQR"',
      icon: QrCode,
      cascade: [
        { step: '1. React 19 Event', detail: 'Cashier clicks button; `<POSCheckoutModal />` locks submit button and fires Axios POST.' },
        { step: '2. Sanctum Auth & Spatie', detail: 'Sanctum checks Bearer JWT; Spatie checks `pos.checkout` permission.' },
        { step: '3. POSService & Bakong', detail: 'Calculates VAT, moving average COGS, and generates EMVCo CRC-16 QR payload string.' },
        { step: '4. PostgreSQL 18 Transaction', detail: 'Runs `DB::transaction` with `lockForUpdate` on inventory; commits sale and ledger.' },
        { step: '5. UI & Hardware Trigger', detail: 'Displays dynamic QR on screen; WebUSB prints 80mm ESC/POS thermal receipt.' }
      ]
    },
    {
      id: 'dynamic-attendance',
      title: 'Click: "Scan Dynamic Attendance QR"',
      titleKh: 'ចុច: "ស្កេនវត្តមាន Dynamic QR"',
      icon: Sparkles,
      cascade: [
        { step: '1. Flutter Mobile Scan', detail: 'Employee scans 15s rotating QR on kiosk tablet using camera barcode scanner.' },
        { step: '2. GPS & UUID Validation', detail: 'App sends GPS lat/long and hardware device UUID alongside encrypted QR token.' },
        { step: '3. AttendanceService Verify', detail: 'Backend checks token expiry (<15s), device binding, and GPS 100m geofence radius.' },
        { step: '4. PostgreSQL Attendance Log', detail: 'Writes check-in record into `attendances`; calculates late penalty minutes.' },
        { step: '5. Mobile UI Confirmation', detail: 'App plays sound chime; shows verified check-in badge and updates shift hours.' }
      ]
    },
    {
      id: 'stock-transfer',
      title: 'Click: "Dispatch Stock Transfer"',
      titleKh: 'ចុច: "បញ្ជូនការផ្ទេរស្តុក"',
      icon: RefreshCw,
      cascade: [
        { step: '1. Admin Form Submit', detail: 'Warehouse keeper enters SKUs and selects destination warehouse B.' },
        { step: '2. Stock Availability Check', detail: 'Backend locks source warehouse rows and verifies non-negative stock invariants.' },
        { step: '3. Transfer Manifest Created', detail: 'Status set to `in_transit`; source balance decremented immediately.' },
        { step: '4. Notification Trigger', detail: 'Database notification dispatched to destination branch manager.' },
        { step: '5. Destination UI Ready', detail: 'Destination portal shows pending transfer ready for barcode scanning receipt.' }
      ]
    }
  ];

  const currentFeature = featureLifecycles[selectedFeature];
  const activeSim = simulations.find((s) => s.id === activeSimulation) || simulations[0];

  return (
    <section id="feature-tracing" className="mb-14 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-mono font-bold">
            07
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Full-Stack Traceability
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'របៀបដែលមុខងារមួយធ្វើដំណើរឆ្លងកាត់ប្រព័ន្ធ (Feature Tracing)' : 'How One Feature Travels Through the System'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl font-normal">
          {language === 'km'
            ? 'ផែនទីបង្ហាញផ្លូវសម្រាប់អ្នកអភិវឌ្ឍន៍ថ្មី៖ ស្វែងយល់ពីរបៀបដែលទិន្នន័យផ្លាស់ទីពី Database → Model → Service → Controller → API → UI'
            : 'Essential architectural guide for developers: Trace the exact code files, classes, and database mutations that power core capabilities.'}
        </p>
      </div>

      {/* Feature Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['sale', 'product', 'transfer'] as const).map((feat) => (
          <button
            key={feat}
            onClick={() => setSelectedFeature(feat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedFeature === feat
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {featureLifecycles[feat].name}
          </button>
        ))}
      </div>

      {/* Feature Tracing Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-brand-600 dark:text-brand-400">
              End-to-End Architectural Trace
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? currentFeature.nameKh : currentFeature.name}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
            {currentFeature.route}
          </span>
        </div>

        {/* Stack File Coordinates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80">
            <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">PostgreSQL Table</div>
            <div className="text-purple-600 dark:text-purple-400 font-bold truncate">{currentFeature.dbTable}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80">
            <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Service Class</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold truncate">{currentFeature.service.split('\\').pop()}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80">
            <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Controller Action</div>
            <div className="text-blue-600 dark:text-blue-400 font-bold truncate">{currentFeature.controller.split('\\').pop()}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80">
            <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Frontend UI Component</div>
            <div className="text-brand-600 dark:text-brand-400 font-bold truncate">{currentFeature.uiComponent}</div>
          </div>
        </div>

        {/* Step-by-Step Code Chain */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold font-mono uppercase text-slate-400">
            Execution Flow Sequence
          </div>
          <div className="space-y-2">
            {currentFeature.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs"
              >
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400 shrink-0 w-36">
                  {step.layer}
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-normal">
                  {step.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Simulation: "What Happens When a User Clicks?" */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                Interactive Developer Simulator
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {language === 'km' ? 'តើមានអ្វីកើតឡើងនៅពេលអ្នកប្រើចុចប៊ូតុង? (Action Simulator)' : 'What Happens When a User Clicks?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Click any simulated UI button below to trace the resulting cascade through network, controllers, locking, and hardware.
            </p>
          </div>

          {/* Simulation Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {simulations.map((sim) => {
              const Icon = sim.icon;
              const isSelected = activeSimulation === sim.id;
              return (
                <button
                  key={sim.id}
                  onClick={() => setActiveSimulation(sim.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? sim.titleKh : sim.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cascade Flow for Active Simulation */}
        <div className="space-y-2.5">
          {activeSim.cascade.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/20">
                0{idx + 1}
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {item.step}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
