import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, ExternalLink } from 'lucide-react';
import { useDocs } from '../../stores/useDocsStore';
import { BrandLogo } from '../common/BrandLogo';

export const Footer: React.FC = () => {
  const { language } = useDocs();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/90 mt-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <BrandLogo size="md" />
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'km' 
                ? 'ប្រព័ន្ធគ្រប់គ្រងសហគ្រាសរួមបញ្ចូលគ្នាពេញលេញ រវាង E-Commerce, POS Terminal, ស្តុកឃ្លាំង, ការទិញទំនិញ, វត្តមាន QR និងប្រាក់បៀវត្សរ៍។'
                : 'Unified enterprise architecture combining E-Commerce, retail POS terminal, multi-warehouse inventory, procurement, QR attendance, and payroll.'}
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Audited Version: <span className="text-brand-600 dark:text-brand-400 font-semibold">v1.1.0 Enterprise</span>
            </div>
          </div>

          {/* Quick Architecture Links */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-slate-300 mb-3">Architecture & Docs</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/overview" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Executive Overview</Link></li>
              <li><Link to="/architecture" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">6-Layer Architecture</Link></li>
              <li><Link to="/ecosystem" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">System Ecosystem</Link></li>
              <li><Link to="/how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">End-to-End Workflow</Link></li>
              <li><Link to="/tech-stack" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Technology Stack</Link></li>
            </ul>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-slate-300 mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/modules/pos" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">POS Terminal (KHQR)</Link></li>
              <li><Link to="/modules/products" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Products & Variants</Link></li>
              <li><Link to="/modules/inventory" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Multi-Warehouse Inventory</Link></li>
              <li><Link to="/modules/purchases" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Procurement & POs</Link></li>
              <li><Link to="/modules/attendance" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Dynamic QR Attendance</Link></li>
            </ul>
          </div>

          {/* Live Portals */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-slate-300 mb-3">Live Systems</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <span>Admin Dashboard (Port 5173)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <span>Customer Storefront (Port 5174)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="http://localhost:8000/api/documentation" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <span>Laravel API Backend (Port 8000)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li><Link to="/troubleshooting" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Troubleshooting Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-4">
          <div>
            © 2026 OptaPOS Enterprise E-Commerce + POS System. Built for Production Excellence.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Spatie RBAC Verified
            </span>
            <span className="font-mono text-slate-500">99 Tables • 759 APIs • 5 Languages</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
