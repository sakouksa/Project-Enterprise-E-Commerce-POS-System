import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';
import { Database, Network, ArrowRight, Key, Link as LinkIcon, Table } from 'lucide-react';

export const DatabasePreview: React.FC = () => {
  const { t } = useDocs();

  const coreTables = [
    { name: 'users', rows: '6 columns', desc: 'Core user profiles, password hash, branch affiliation & multi-tenant identity.', rel: '1:N orders, 1:N attendances, N:M roles' },
    { name: 'products', rows: '14 columns', desc: 'Master product catalog, category mapping, tax class, and brand metadata.', rel: '1:N product_variants, 1:N order_items' },
    { name: 'product_variants', rows: '9 columns', desc: 'Cartesian attributes (Size/Color), variant SKU, barcode & cost pricing.', rel: '1:N stocks, 1:N order_items' },
    { name: 'orders', rows: '18 columns', desc: 'POS cashier and e-commerce orders, total amounts, KHQR payment state.', rel: '1:N order_items, 1:1 invoices' },
    { name: 'stocks', rows: '8 columns', desc: 'Multi-warehouse stock balances, reserve quantities, and safety alert levels.', rel: 'N:1 branches, N:1 variants' },
    { name: 'purchases', rows: '12 columns', desc: 'Procurement orders, supplier tracking, shipping costs & receiving status.', rel: '1:N purchase_items, N:1 suppliers' },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 md:p-8 backdrop-blur-md shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              Relational Schema
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
            {t.databasePreviewTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {t.databasePreviewSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/database/er-diagram"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs"
          >
            <Network className="w-3.5 h-3.5 text-brand-500" />
            <span>Interactive ERD</span>
          </Link>

          <Link
            to="/database"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs"
          >
            <span>{t.exploreDatabase}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {coreTables.map((table) => (
          <Link
            key={table.name}
            to={`/database?table=${table.name}`}
            className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 hover:border-purple-500/50 hover:bg-white dark:hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {table.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {table.rows}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {table.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] font-mono text-slate-500 flex items-center gap-1 truncate">
              <LinkIcon className="w-3 h-3 text-purple-500 shrink-0" />
              <span className="truncate">{table.rel}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
