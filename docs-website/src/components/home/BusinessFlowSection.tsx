import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { Truck, MonitorCheck, ShoppingCart, Users, ArrowRight, CheckCircle2, ChevronRight, Workflow } from 'lucide-react';

export const BusinessFlowSection: React.FC = () => {
  const { t } = useDocs();
  const [selectedFlow, setSelectedFlow] = useState<number>(0);

  const flows = [
    {
      id: 'pos',
      icon: MonitorCheck,
      title: t.flowPosTitle,
      subtitle: t.flowPosDesc,
      docsPath: '/modules/pos',
      steps: [
        { num: '01', title: 'Scan Barcode / Search', actor: 'Cashier', detail: 'Instant sub-second product lookup and variant price match', code: 'Product::where("barcode", $code)->firstOrFail()' },
        { num: '02', title: 'Dynamic KHQR Generation', actor: 'Bakong Engine', detail: 'Generates real-time EMVCo payload with transaction amount', code: 'BakongService::generateKHQR($invoiceId, $usdAmount)' },
        { num: '03', title: 'Atomic Inventory Deduction', actor: 'PostgreSQL Lock', detail: 'Executes selectForUpdate to ensure zero negative stock races', code: 'DB::transaction(fn() => $stock->decrement($qty))' },
        { num: '04', title: '80mm Thermal Receipt Kick', actor: 'ESC/POS Printer', detail: 'Sends raw ESC/POS commands and triggers cash drawer open', code: 'EscposPrinter::cutAndOpenDrawer($receiptPayload)' },
      ],
    },
    {
      id: 'purchase',
      icon: Truck,
      title: t.flowPurchaseTitle,
      subtitle: t.flowPurchaseDesc,
      docsPath: '/modules/purchases',
      steps: [
        { num: '01', title: 'Supplier PO Creation', actor: 'Procurement Officer', detail: 'Drafts purchase order with supplier quotation terms and costs', code: 'PurchaseOrder::create($purchaseData)' },
        { num: '02', title: 'Goods Receipt Inspection', actor: 'Warehouse Receiver', detail: 'Scans incoming lot numbers, expiry dates, and unit quantities', code: 'PurchaseItem::where("po_id", $id)->update(["received" => true])' },
        { num: '03', title: 'Stock Ledger Increment', actor: 'Inventory Engine', detail: 'Increases warehouse balance and logs immutable stock movements', code: 'InventoryMovement::recordInflow($warehouseId, $sku, $qty)' },
        { num: '04', title: 'Accounts Payable Update', actor: 'Finance Ledger', detail: 'Credits supplier payable ledger and updates inventory valuation', code: 'AccountLedger::postJournalEntry("AP", $supplierId, $total)' },
      ],
    },
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      title: t.flowEcommerceTitle,
      subtitle: t.flowEcommerceDesc,
      docsPath: '/customer-guide',
      steps: [
        { num: '01', title: 'Browse & Add to Cart', actor: 'Online Customer', detail: 'Cart item reservation stored in Redis with 15-minute TTL', code: 'Redis::setex("cart:".$userId, 900, json_encode($items))' },
        { num: '02', title: 'Checkout & Address Select', actor: 'Customer Frontend', detail: 'Validates delivery zone distance, shipping fee, and tax rules', code: 'DeliveryZoneService::calculateRate($lat, $lng, $weight)' },
        { num: '03', title: 'Payment Webhook Verify', actor: 'Payment Gateway', detail: 'Validates HMAC signature and confirms online payment authorization', code: 'PaymentWebhook::verifyHmacSignature($request->getContent())' },
        { num: '04', title: 'Order Fulfillment & Dispatch', actor: 'Warehouse Staff', detail: 'Picks items from shelf, prints shipping label, and notifies customer', code: 'Order::where("id", $orderId)->update(["status" => "dispatched"])' },
      ],
    },
    {
      id: 'hrm',
      icon: Users,
      title: t.flowHrmTitle,
      subtitle: t.flowHrmDesc,
      docsPath: '/modules/attendance',
      steps: [
        { num: '01', title: 'Dynamic QR Scan Check-in', actor: 'Employee Mobile', detail: 'Scans dynamic rotating QR code with GPS geofencing verification', code: 'AttendanceService::validateScan($qrToken, $empGpsCoord)' },
        { num: '02', title: 'Shift & Overtime Tally', actor: 'HR Engine', detail: 'Calculates regular hours, late deductions, and approved overtime', code: 'ShiftService::calculateWorkedHours($clockIn, $clockOut)' },
        { num: '03', title: 'Auto Payroll Generation', actor: 'Payroll Controller', detail: 'Computes base wage, allowances, tax withholdings, and net salary', code: 'PayrollService::generateMonthlyPayslips($periodMonth)' },
        { num: '04', title: 'Electronic Pay Slip Dispatch', actor: 'Notification Queue', detail: 'Delivers PDF pay slips directly to employee mobile app inbox', code: 'PaySlipNotification::dispatch($employeeUser, $pdfUrl)' },
      ],
    },
  ];

  const current = flows[selectedFlow];

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-md dark:shadow-2xl transition-colors duration-200">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            {t.flowBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
            {t.flowTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            {t.flowSubtitle}
          </p>
        </div>

        <Link
          to="/how-it-works"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        >
          <span>Full Workflow Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tab Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {flows.map((flow, idx) => {
          const Icon = flow.icon;
          const isSelected = selectedFlow === idx;
          return (
            <button
              key={flow.id}
              onClick={() => setSelectedFlow(idx)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-500/15 shadow-sm font-bold'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-brand-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs truncate ${isSelected ? 'text-brand-900 dark:text-brand-200' : 'text-slate-700 dark:text-slate-300'}`}>
                {flow.title.split('(')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Workflow Steps */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 shadow-inner">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800/80 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{current.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{current.subtitle}</p>
          </div>
          <Link
            to={current.docsPath}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Read Flow Specs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {current.steps.map((step, sIdx) => (
            <div
              key={sIdx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-black text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20">
                    Step {step.num}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {step.actor}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">{step.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{step.detail}</p>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-emerald-400 border border-slate-800 truncate select-all">
                <code>{step.code}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
