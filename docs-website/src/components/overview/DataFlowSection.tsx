import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import {
  MousePointer,
  Layout,
  Send,
  Lock,
  ShieldCheck,
  CheckSquare,
  Cpu,
  Cog,
  KeyRound,
  Database,
  FileJson,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Code2,
  ChevronRight
} from 'lucide-react';

interface DataFlowNode {
  id: number;
  name: string;
  nameKh: string;
  category: 'client' | 'network' | 'security' | 'backend' | 'database' | 'response';
  icon: any;
  simpleDesc: Record<string, string>;
  techDesc: Record<string, string>;
  codeExample: string;
}

export const DataFlowSection: React.FC = () => {
  const { language } = useDocs();
  const [activeNodeId, setActiveNodeId] = useState<number>(1);

  const flowNodes: DataFlowNode[] = [
    {
      id: 1,
      name: '1. User Action',
      nameKh: '១. សកម្មភាពអ្នកប្រើប្រាស់',
      category: 'client',
      icon: MousePointer,
      simpleDesc: {
        km: 'អ្នកគិតលុយស្កេនបាគូដផលិតផល ឬចុចប៊ូតុង "Pay with KHQR" នៅលើផ្ទាំង POS។',
        en: 'Cashier scans a barcode with camera/laser or clicks "Pay with KHQR" button on POS.'
      },
      techDesc: {
        km: 'DOM Event (onClick / onScan) ត្រូវបាន Trigger នៅក្នុង React 19 Component ដោយប្រមូល State ពី Zustand Cart។',
        en: 'React 19 event handler dispatches action reading cart items, tax, discounts, and customer ID from Zustand.'
      },
      codeExample: `// POS Checkout Handler
const handleCheckout = async () => {
  const payload = {
    branch_id: currentBranch.id,
    warehouse_id: currentWarehouse.id,
    customer_id: selectedCustomer?.id,
    items: cartItems.map(i => ({ product_id: i.id, quantity: i.qty, price: i.price })),
    payment_method: 'bakong_khqr'
  };
  await mutateAsync(payload);
};`
    },
    {
      id: 2,
      name: '2. Frontend Component',
      nameKh: '២. សមាសភាគ Frontend',
      category: 'client',
      icon: Layout,
      simpleDesc: {
        km: 'ផ្ទាំងអេក្រង់ POS ឬ E-Commerce Storefront រៀបចំទិន្នន័យកន្ត្រកទំនិញចូលជាកញ្ចប់ JSON។',
        en: 'The React 19 or Flutter UI bundles the cart payload into a typed JSON request body.'
      },
      techDesc: {
        km: 'សមាសភាគប្រើ TanStack React Query `useMutation` ជាមួយ Optimistic UI ដើម្បីទប់ស្កាត់ការចុចទ្វេដង (Double Submit)។',
        en: 'Component invokes TanStack Query mutation with debounce and loading spinlock to prevent race submissions.'
      },
      codeExample: `// TanStack React Query Mutation
export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: (data: CheckoutPayload) => api.post('/v1/pos/checkout', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });
};`
    },
    {
      id: 3,
      name: '3. API Request (HTTPS)',
      nameKh: '៣. សំណើ API តាម HTTPS',
      category: 'network',
      icon: Send,
      simpleDesc: {
        km: 'កម្មវិធីផ្ញើសំណើ HTTP POST ទៅកាន់ម៉ាស៊ីនកណ្តាល Laravel 12 តាម Port 8000 ជាមួយ Access Token។',
        en: 'HTTP POST request is dispatched to Laravel 12 REST endpoint over TLS with Bearer Token in header.'
      },
      techDesc: {
        km: 'Axios Interceptor បញ្ចូល `Authorization: Bearer <token>` និង `Accept-Language: km` ដោយស្វ័យប្រវត្តិ។',
        en: 'Axios request interceptor attaches Bearer JWT token, multi-lingual Accept-Language, and Tenant sub-domain.'
      },
      codeExample: `POST /api/v1/pos/checkout HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...
Accept: application/json
Accept-Language: km
Content-Type: application/json`
    },
    {
      id: 4,
      name: '4. Authentication Layer',
      nameKh: '៤. ការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ (JWT)',
      category: 'security',
      icon: Lock,
      simpleDesc: {
        km: 'ប្រព័ន្ធពិនិត្យមើលថាតើ Token ត្រឹមត្រូវ និងមិនទាន់ផុតកំណត់ដែរឬទេ។',
        en: 'Backend cryptographically validates the JWT access token and resolves authenticated user.'
      },
      techDesc: {
        km: 'Laravel Sanctum / Firebase PHP-JWT Middleware ផ្ទៀងផ្ទាត់ Signature ជាមួយ Secret Key និង Resolver User Model។',
        en: 'Auth middleware extracts user_id, tenant company_id, and branch_id from cryptographic JWT claims.'
      },
      codeExample: `// Route Definition with Sanctum Guard
Route::middleware(['auth:sanctum', 'tenant.scope'])->group(function () {
    Route::post('/pos/checkout', [POSController::class, 'checkout']);
});`
    },
    {
      id: 5,
      name: '5. Authorization (Spatie RBAC)',
      nameKh: '៥. ការផ្ទៀងផ្ទាត់សិទ្ធិ (RBAC)',
      category: 'security',
      icon: ShieldCheck,
      simpleDesc: {
        km: 'ពិនិត្យថាតើអ្នកប្រើប្រាស់មានសិទ្ធិ "pos.checkout" ក្នុងការគិតលុយដែរឬទេ។',
        en: 'Validates if the user role (Cashier / Manager) possesses the "pos.checkout" permission.'
      },
      techDesc: {
        km: 'Spatie Permission Middleware ពិនិត្យ Guard Name និង Permission Node ក្នុងតារាង `model_has_permissions`។',
        en: 'Spatie RBAC policy validates user role hierarchy across 169 granular permission nodes in PostgreSQL.'
      },
      codeExample: `// In Controller Constructor / Policy
public function checkout(CheckoutRequest $request)
{
    $this->authorize('pos.checkout');
    // ...
}`
    },
    {
      id: 6,
      name: '6. Form Request Validation',
      nameKh: '៦. ការត្រួតពិនិត្យទិន្នន័យ (Validation)',
      category: 'backend',
      icon: CheckSquare,
      simpleDesc: {
        km: 'ពិនិត្យមើលថាតើបរិមាណទំនិញ ឃ្លាំង និងតម្លៃត្រឹមត្រូវតាមលក្ខខណ្ឌអាជីវកម្ម។',
        en: 'Validates payload structure, non-negative quantities, existing branch IDs, and price integrity.'
      },
      techDesc: {
        km: 'Laravel FormRequest `CheckoutRequest` ដំណើរការ Rules មុនពេល Controller ត្រូវបាន Execute។',
        en: 'FormRequest applies strict type constraints; returns HTTP 422 with localized error messages upon failure.'
      },
      codeExample: `class CheckoutRequest extends FormRequest {
    public function rules(): array {
        return [
            'warehouse_id' => 'required|exists:warehouses,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
        ];
    }
}`
    },
    {
      id: 7,
      name: '7. Controller Domain',
      nameKh: '៧. Controller Domain',
      category: 'backend',
      icon: Cpu,
      simpleDesc: {
        km: 'Controller ទទួលយកទិន្នន័យដែលបានផ្ទៀងផ្ទាត់ ហើយហៅ Service ទៅអនុវត្តការងារ។',
        en: 'The controller accepts validated DTO parameters and delegates execution to the business service layer.'
      },
      techDesc: {
        km: 'អនុវត្តតាម Thin Controller, Rich Service Pattern ដើម្បីកុំឱ្យ Logic កកកុញក្នុង Controller។',
        en: 'Adheres to Clean Architecture: keeps HTTP routing thin while delegating orchestration to POSService.'
      },
      codeExample: `public function checkout(CheckoutRequest $request, POSService $posService): JsonResponse
{
    $sale = $posService->processCheckout($request->validated(), auth()->user());
    return response()->json(new SaleResource($sale), 201);
}`
    },
    {
      id: 8,
      name: '8. Business Service Logic',
      nameKh: '៨. សេវាកម្មតក្កវិជ្ជាអាជីវកម្ម',
      category: 'backend',
      icon: Cog,
      simpleDesc: {
        km: 'គណនាបញ្ចុះតម្លៃ ពន្ធ ថ្លៃដើមទំនិញ COGS និងបង្កើតកូដ KHQR សម្រាប់ការទូទាត់។',
        en: 'Calculates progressive tax, line item discounts, moving average COGS, and generates KHQR payload.'
      },
      techDesc: {
        km: 'Encapsulates complex math, Bakong EMVCo CRC calculation, and multi-warehouse balance checks.',
        en: 'Enforces business invariance: prevents sale of archived products and validates cash drawer shifts.'
      },
      codeExample: `// POSService.php
$taxAmount = ($subtotal - $discount) * ($taxRate / 100);
$totalAmount = ($subtotal - $discount) + $taxAmount;
$khqrPayload = $this->bakongService->generateDynamicKHQR($totalAmount, 'USD', $invoiceNo);`
    },
    {
      id: 9,
      name: '9. Database Transaction & Row-Lock',
      nameKh: '៩. DB Transaction & ចាក់សោរបន្ទាត់ទិន្នន័យ',
      category: 'database',
      icon: KeyRound,
      simpleDesc: {
        km: 'ចាក់សោរបន្ទាត់ទំនិញក្នុងស្តុក (Row-level lock) ដើម្បីការពារកុំឱ្យអ្នកផ្សេងទិញកាត់ស្តុកជាន់គ្នាក្នុងពេលតែមួយ។',
        en: 'Initiates ACID transaction with PostgreSQL "lockForUpdate" to prevent race condition over-selling.'
      },
      techDesc: {
        km: 'ប្រើ `DB::transaction()` រួមជាមួយ `select ... for update` ធានាភាព Atomic 100%។ បើបរិមាណមិនគ្រប់ នឹង Rollback ភ្លាម។',
        en: 'Wraps all inserts/updates in a single transaction; rolls back immediately if any SKU quantity < requested.'
      },
      codeExample: `DB::transaction(function () use ($data, $user) {
    // Lock inventory rows exclusively
    $inventory = Inventory::where('warehouse_id', $data['warehouse_id'])
        ->where('product_id', $item['product_id'])
        ->lockForUpdate()
        ->firstOrFail();

    if ($inventory->quantity < $item['quantity']) {
        throw new InsufficientStockException("Out of stock!");
    }
    $inventory->decrement('quantity', $item['quantity']);
});`
    },
    {
      id: 10,
      name: '10. PostgreSQL 18 Persistence',
      nameKh: '១០. រក្សាទុកក្នុង PostgreSQL 18',
      category: 'database',
      icon: Database,
      simpleDesc: {
        km: 'ទិន្នន័យត្រូវបានសរសេរចូលតារាង sales, sale_items, payments, និង inventory_movements។',
        en: 'Records are committed to sales, sale_items, payments, and immutable inventory_movements ledger.'
      },
      techDesc: {
        km: 'Foreign key constraints, composite B-tree indexes, និង SoftDeletes ត្រូវបានអនុវត្តដោយស្វ័យប្រវត្តិ។',
        en: 'Database enforces relational foreign key integrity, index updates, and writes audit log triggers.'
      },
      codeExample: `INSERT INTO sales (invoice_number, total_amount, branch_id, ...) VALUES (...);
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (...);
INSERT INTO inventory_movements (product_id, warehouse_id, type, qty) VALUES (..., 'OUT', 2);`
    },
    {
      id: 11,
      name: '11. API Resource Transformation',
      nameKh: '១១. បំលែងទិន្នន័យជា API Resource',
      category: 'response',
      icon: FileJson,
      simpleDesc: {
        km: 'Laravel រៀបចំទិន្នន័យលក់ជាទម្រង់ JSON ស្អាត ដោយលាក់លេខកូដសម្ងាត់ ឬព័ត៌មានដែលមិនចាំបាច់។',
        en: 'Transforms Eloquent models into sanitized, predictable API response DTOs.'
      },
      techDesc: {
        km: '`SaleResource` បញ្ចូល Eager Loaded Relationships (customer, cashier, branch) ដើម្បីការពារ N+1 Queries។',
        en: 'JsonResource masks internal column names, formats currencies (KHR/USD), and structures ISO-8601 timestamps.'
      },
      codeExample: `class SaleResource extends JsonResource {
    public function toArray($request): array {
        return [
            'id' => $this->id,
            'invoice_no' => $this->invoice_number,
            'total' => (float)$this->total_amount,
            'khqr_string' => $this->khqr_string,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}`
    },
    {
      id: 12,
      name: '12. JSON Response (HTTP 201)',
      nameKh: '១២. ការឆ្លើយតប JSON (HTTP 201)',
      category: 'response',
      icon: CheckCircle2,
      simpleDesc: {
        km: 'ម៉ាស៊ីនបម្រើផ្ញើវិក្កយបត្រ និងកូដ KHQR ត្រឡប់មកកាន់ Frontend វិញក្នុងពេលក្រោម ១ វិនាទី។',
        en: 'The backend returns a standard JSON envelope `{ success: true, data: {...} }` with HTTP 201 Created.'
      },
      techDesc: {
        km: 'Response Header រួមមាន ETag និង Timing metrics ដើម្បីឱ្យ Browser អាច Cache តាមការចាំបាច់។',
        en: 'Payload is gzip/brotli compressed by Nginx reverse proxy before transmission over HTTP/2 connection.'
      },
      codeExample: `HTTP/1.1 201 Created
Content-Type: application/json
{
  "success": true,
  "message": "Sale completed successfully",
  "data": {
    "invoice_no": "INV-2026-00891",
    "total": 45.50,
    "status": "completed"
  }
}`
    },
    {
      id: 13,
      name: '13. Frontend State Cache Update',
      nameKh: '១៣. ធ្វើបច្ចុប្បន្នភាព State & Cache',
      category: 'client',
      icon: RefreshCw,
      simpleDesc: {
        km: 'កម្មវិធី React / Flutter ធ្វើបច្ចុប្បន្នភាពចំនួនស្តុក និងសម្អាតកន្ត្រកទំនិញដោយស្វ័យប្រវត្តិ។',
        en: 'TanStack Query / Zustand automatically clears the cart and invalidates low-stock cache keys.'
      },
      techDesc: {
        km: '`queryClient.invalidateQueries()` ធ្វើឱ្យទំព័រ Dashboard និង Inventory Table ទាញយកទិន្នន័យថ្មីភ្លាមៗ។',
        en: 'Reactive store clears active cart state and optimistically updates sales reports and cashier drawer totals.'
      },
      codeExample: `// Invalidate stale caches
queryClient.invalidateQueries({ queryKey: ['inventory-list'] });
queryClient.invalidateQueries({ queryKey: ['dashboard-kpi'] });
useCartStore.getState().clearCart();`
    },
    {
      id: 14,
      name: '14. UI Render & Hardware Trigger',
      nameKh: '១៤. បង្ហាញលទ្ធផល & បញ្ជា Hardware',
      category: 'client',
      icon: Sparkles,
      simpleDesc: {
        km: 'បង្ហាញវិក្កយបត្រជោគជ័យ ចាក់សម្លេង Beep និងបញ្ជាម៉ាស៊ីនព្រីនវិក្កយបត្រ 80mm ESC/POS ដោយស្វ័យប្រវត្តិ។',
        en: 'Renders successful receipt dialog, plays audio confirmation beep, and fires 80mm thermal receipt print.'
      },
      techDesc: {
        km: 'Triggers WebUSB / WebBluetooth ESC/POS thermal command for receipt printing and opens cash drawer via RJ11 pulse.',
        en: 'Invokes browser print API or native Flutter Bluetooth ESC/POS stream; plays WebAudio sound chime.'
      },
      codeExample: `// Audio beep & receipt print
playCheckoutChime();
printEscPosThermalReceipt(receiptData);
openCashDrawerPulse();`
    }
  ];

  const activeNode = flowNodes.find((n) => n.id === activeNodeId) || flowNodes[0];
  const ActiveIcon = activeNode.icon;

  return (
    <section id="data-flow" className="mb-14 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
            03
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Data Movement Lifecycle
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'លំហូរទិន្នន័យ ១៤ ជំហានកាត់តាមប្រព័ន្ធ (14-Step Data Flow)' : '14-Step End-to-End Data Flow'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl font-normal">
          {language === 'km'
            ? 'ចុចលើជំហាននីមួយៗខាងក្រោម ដើម្បីស្វែងយល់ពីរបៀបដែលទិន្នន័យធ្វើដំណើរពីការចុចលើ UI រហូតដល់ PostgreSQL 18 និងត្រឡប់មកវិញ'
            : 'Click through each step in the end-to-end data lifecycle to trace how a user transaction flows through network, auth, controllers, locking, database, and hardware triggers.'}
        </p>
      </div>

      {/* Horizontal Flow Stepper Bar */}
      <div className="p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 shadow-sm backdrop-blur-xl overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max pb-1">
          {flowNodes.map((node, idx) => {
            const isSelected = activeNodeId === node.id;
            const Icon = node.icon;
            return (
              <React.Fragment key={node.id}>
                <button
                  onClick={() => setActiveNodeId(node.id)}
                  className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-500/30'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{language === 'km' ? node.nameKh : node.name}</span>
                </button>
                {idx < flowNodes.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Node Detail Card with Simple + Technical Split */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl backdrop-blur-xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <ActiveIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Step 0{activeNode.id} of 14 • Category: {activeNode.category.toUpperCase()}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {language === 'km' ? activeNode.nameKh : activeNode.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={activeNode.id === 1}
              onClick={() => setActiveNodeId((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              Previous Step
            </button>
            <button
              disabled={activeNode.id === flowNodes.length}
              onClick={() => setActiveNodeId((prev) => Math.min(flowNodes.length, prev + 1))}
              className="px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 disabled:opacity-40 transition-colors"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* 2-Tier Content: Simple Explanation (Beginner) vs Technical (Developer) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level 1: Simple Beginner Explanation */}
          <div className="p-5 rounded-2xl border border-blue-200/80 dark:border-blue-500/20 bg-blue-50/40 dark:bg-blue-500/5 space-y-2">
            <div className="text-xs font-bold font-mono uppercase text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <span>💡 Simple Explanation (តួនាទីសង្ខេបសម្រាប់អ្នកទូទៅ)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {activeNode.simpleDesc[language] || activeNode.simpleDesc['en'] || activeNode.simpleDesc['km']}
            </p>
          </div>

          {/* Level 2: Deep Technical Explanation */}
          <div className="p-5 rounded-2xl border border-purple-200/80 dark:border-purple-500/20 bg-purple-50/40 dark:bg-purple-500/5 space-y-2">
            <div className="text-xs font-bold font-mono uppercase text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>⚙️ Technical Specification (កម្រិតវិស្វករអភិវឌ្ឍន៍)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {activeNode.techDesc[language] || activeNode.techDesc['en'] || activeNode.techDesc['km']}
            </p>
          </div>
        </div>

        {/* Real Code Example from the Codebase */}
        <div className="space-y-2">
          <div className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-brand-500" />
            <span>Audited Project Code Snippet</span>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
            <code>{activeNode.codeExample}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};
