import React from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { TableOfContents } from '../components/layout/TableOfContents';
import { ArchitectureDiagram } from '../components/diagrams/ArchitectureDiagram';
import { CodeBlock } from '../components/common/CodeBlock';
import { Layers, ShieldCheck, Database, Radio, Sparkles, Cpu, HardDrive, Bell } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const { language } = useDocs();

  const tocItems = [
    { id: 'interactive-explorer', label: '6-Layer Interactive Diagram' },
    { id: 'layer-1-presentation', label: 'Layer 1: Presentation & Frontends' },
    { id: 'layer-2-ingress', label: 'Layer 2: API Gateway & Ingress' },
    { id: 'layer-3-controllers', label: 'Layer 3: Controller & Request Validation' },
    { id: 'layer-4-domain', label: 'Layer 4: Domain & Service Logic' },
    { id: 'layer-5-persistence', label: 'Layer 5: PostgreSQL & Redis Persistence' },
    { id: 'layer-6-external', label: 'Layer 6: External Integrations & Storage' },
    { id: 'code-pattern', label: 'Clean Architecture Code Sample' },
  ];

  return (
    <div className="flex items-start gap-8 pb-16">
      <div className="flex-1 min-w-0">
        <Breadcrumb items={[{ label: 'System Architecture' }]} />

        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Data Flow</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {language === 'km' ? 'ស្ថាបត្យកម្មប្រព័ន្ធ ៦ ស្រទាប់ (6-Layer Architecture)' : 'System 6-Layer Architecture & Pipeline'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            {language === 'km' 
              ? 'ការវិភាគស្ថាបត្យកម្មកូដកម្រិតជ្រៅពី Presentation Layer រហូតដល់ PostgreSQL Database & Redis Cache រួមទាំង Service Pattern និង Clean Code Guidelines។'
              : 'End-to-end technical breakdown of the 6 distinct architectural layers powering high-concurrency retail transactions and cross-channel sync.'}
          </p>
        </div>

        {/* Section 0: Interactive Explorer */}
        <section id="interactive-explorer">
          <ArchitectureDiagram />
        </section>

        {/* Layer 1 */}
        <section id="layer-1-presentation" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-mono font-bold">L1</span>
            <span>Layer 1: Presentation & Frontends (Client Applications)</span>
          </h2>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 shadow-2xs">
            <p>
              ស្រទាប់ Presentation រួមមាន Client Apps ចំនួន ៣ ដែលរៀបចំឡើងដាច់ដោយឡែកពីគ្នា (Decoupled Frontends)៖
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-400">
              <li><strong>Admin Dashboard (`admin-dashboard`):</strong> បង្កើតឡើងដោយ React 19 + TypeScript + Ant Design v5 + Tailwind CSS សម្រាប់ Super Admin, Branch Manager និង Cashier គ្រប់គ្រងទូទៅ។</li>
              <li><strong>Customer Storefront (`customer-website`):</strong> បង្កើតឡើងដោយ React 19 + Tailwind CSS + Lucide Icons សម្រាប់អតិថិជនទិញទំនិញអនឡាញ កន្ត្រកទំនិញ និងទូទាត់ប្រាក់ KHQR។</li>
              <li><strong>Mobile POS Terminal (`mobile_app`):</strong> បង្កើតឡើងដោយ Flutter 3.2+ / Dart 3.2+ គាំទ្រការស្កេនមេដៃ (Biometrics), ស្កេនវត្តមាន QR, និងការគិតលុយពេលគ្មានអ៊ីនធឺណិត (Offline Hive Cache)។</li>
            </ul>
          </div>
        </section>

        {/* Layer 2 */}
        <section id="layer-2-ingress" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">L2</span>
            <span>Layer 2: API Gateway, Ingress & Security Middleware</span>
          </h2>
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 shadow-2xs">
            <p>
              រាល់ HTTP Request ទាំងអស់ដែលចូលមកកាន់ `http://localhost:8000/api/v1/*` ត្រូវឆ្លងកាត់ Pipeline សុវត្ថិភាព៖
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-400">
              <li><strong>CORS & Security Headers:</strong> អនុញ្ញាតតែ Origin ដែលបានចុះបញ្ជីក្នុង `.env` (Port 5173, 5174, 5175)។</li>
              <li><strong>Rate Limiting:</strong> `throttle:api` (កំណត់ 60 requests/min សម្រាប់ Public និង 120 requests/min សម្រាប់ Authenticated)។</li>
              <li><strong>Sanctum / JWT Authentication:</strong> ផ្ទៀងផ្ទាត់ Cryptographic Signature នៃ Bearer Token ក្នុង Header។</li>
              <li><strong>Spatie RBAC Check:</strong> ត្រួតពិនិត្យថា Role របស់ User មាន Permission ដូចជា `sale.create` ឬ `inventory.transfer` ឬអត់។</li>
            </ol>
          </div>
        </section>

        {/* Code Pattern */}
        <section id="code-pattern" className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <span>Clean Architecture: Service & Repository Pattern Example</span>
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Controller ក្នុង Laravel ដើរតួត្រឹមតែជា HTTP Orchestrator ប៉ុណ្ណោះ រីឯ Business Logic ស្នូល និង DB Transactions ត្រូវបានសរសេរក្នុង <strong>Service Classes</strong> ដើម្បីភាពងាយស្រួលក្នុង Unit Testing និង Reusability៖
            </p>
            <CodeBlock
              language="php"
              filename="app/Services/PosSaleService.php"
              code={`namespace App\\Services;

use App\\Models\\Sale;
use App\\Models\\Inventory;
use App\\Models\\CashRegister;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Validation\\ValidationException;

class PosSaleService
{
    /**
     * Complete an in-store POS transaction atomically with inventory lock.
     */
    public function processSale(array $data, int $userId): Sale
    {
        return DB::transaction(function () use ($data, $userId) {
            // 1. Lock active cash register drawer
            $register = CashRegister::where('id', $data['cash_register_id'])
                ->where('status', 'open')
                ->lockForUpdate()
                ->firstOrFail();

            // 2. Validate and deduct inventory with row-level locks
            foreach ($data['items'] as $item) {
                $inventory = Inventory::where('product_variant_id', $item['variant_id'])
                    ->where('warehouse_id', $data['warehouse_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($inventory->quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock for SKU: {$item['sku']}"
                    ]);
                }

                $inventory->decrement('quantity', $item['quantity']);
            }

            // 3. Persist Sale Record & Line Items
            $sale = Sale::create([
                'invoice_number' => $this->generateInvoiceNumber($data['branch_id']),
                'customer_id'    => $data['customer_id'] ?? null,
                'total_amount'   => $data['total_amount'],
                'paid_amount'    => $data['paid_amount'],
                'payment_method' => $data['payment_method'], // CASH, KHQR, CARD
                'created_by'     => $userId,
            ]);

            return $sale;
        });
    }
}`}
            />
          </div>
        </section>
      </div>

      <TableOfContents items={tocItems} />
    </div>
  );
};
