import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { Radio, ArrowRight, Copy, Check, Terminal, Code2 } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

export const ApiPreview: React.FC = () => {
  const { t } = useDocs();
  const [copied, setCopied] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);

  const sampleEndpoints = [
    {
      method: 'POST',
      path: '/api/v1/pos/orders',
      title: 'POS Checkout Order Creation',
      desc: 'Atomic cashier order with instant Bakong KHQR dynamic QR generation and row-level stock lock.',
      req: `{
  "branch_id": 1,
  "payment_method": "khqr_bakong",
  "currency": "USD",
  "items": [
    { "product_id": 104, "variant_id": 312, "quantity": 2, "unit_price": 14.50 }
  ]
}`,
      res: `{
  "status": "success",
  "order_id": "ORD-2026-8891",
  "total_amount": 29.00,
  "khqr_payload": "00020101021229300018bakong@dev9995303840...",
  "stock_locked": true
}`,
    },
    {
      method: 'GET',
      path: '/api/v1/products',
      title: 'Master Catalog & Variants',
      desc: 'Retrieve paginated products with category filters, variant Cartesian matrices, and WebP assets.',
      req: `GET /api/v1/products?category_id=4&page=1&per_page=15`,
      res: `{
  "current_page": 1,
  "data": [
    {
      "id": 104,
      "sku": "PROD-TSHIRT-BLK-L",
      "name": "Enterprise Cotton Tee",
      "price_usd": 14.50,
      "variants_count": 6
    }
  ],
  "total": 142
}`,
    },
    {
      method: 'POST',
      path: '/api/v1/attendance/check-in',
      title: 'Dynamic QR Anti-Spoof Check-In',
      desc: 'Employee QR attendance scan with HMAC dynamic token verification and branch geofencing.',
      req: `{
  "qr_token": "hmac_rotating_e8a91f3c",
  "latitude": 11.5564,
  "longitude": 104.9282
}`,
      res: `{
  "status": "verified",
  "employee_id": "EMP-042",
  "check_in_time": "2026-08-24T08:00:15Z",
  "geofence_status": "inside_perimeter"
}`,
    },
  ];

  const current = sampleEndpoints[selectedEndpoint];

  const handleCopy = () => {
    copyToClipboard(current.req + '\n\n' + current.res);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              Developer APIs
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
            {t.apiPreviewTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {t.apiPreviewSubtitle}
          </p>
        </div>

        <Link
          to="/api"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors shrink-0"
        >
          <span>{t.exploreApi}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Endpoint Selector List */}
        <div className="lg:col-span-5 space-y-2.5">
          {sampleEndpoints.map((ep, idx) => {
            const isSelected = selectedEndpoint === idx;
            return (
              <button
                key={ep.path}
                onClick={() => setSelectedEndpoint(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-slate-800/90 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                      ep.method === 'POST'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {ep.path}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-0.5">
                  {ep.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {ep.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Code Snippet Box */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950 text-slate-200 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-bold text-slate-200">{current.method} {current.path}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 font-mono text-xs space-y-3 overflow-x-auto">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">// Request Payload</div>
              <pre className="text-emerald-400 whitespace-pre-wrap">{current.req}</pre>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">// Response (200 OK)</div>
              <pre className="text-sky-300 whitespace-pre-wrap">{current.res}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
