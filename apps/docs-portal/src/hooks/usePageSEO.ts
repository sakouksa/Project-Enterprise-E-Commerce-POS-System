import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDocs } from '../stores/useDocsStore';

const PAGE_SEO_MAP: Record<string, { title: string; desc: string }> = {
  '/': {
    title: 'OptaPOS — Enterprise Architecture & Documentation Portal',
    desc: 'Official technical documentation, 6-tier architecture blueprint, and manuals for OptaPOS Enterprise System.'
  },
  '/overview': {
    title: 'System Overview & Executive Blueprint | OptaPOS Docs',
    desc: 'Executive summary, key statistics, business highlights, and enterprise engineering capabilities.'
  },
  '/architecture': {
    title: '6-Tier Architecture & Engineering Blueprint | OptaPOS Docs',
    desc: 'Deep-dive into the 6-layer decoupled architecture: Presentation, Gateway, Auth, Services, Database, and DevOps.'
  },
  '/ecosystem': {
    title: 'System Ecosystem & Connected Clients | OptaPOS Docs',
    desc: 'Topology of 4 connected platforms: React 19 Admin, Storefront, Flutter Mobile POS, and Laravel 12 Hub.'
  },
  '/how-it-works': {
    title: 'End-to-End System Workflow | OptaPOS Docs',
    desc: 'Interactive step-by-step walkthrough of order processing, KHQR payments, inventory locking, and sync.'
  },
  '/tech-stack': {
    title: 'Technology Stack & Infrastructure Matrix | OptaPOS Docs',
    desc: 'Full specification of React 19, Flutter 3.24, Laravel 12, PostgreSQL 18, Redis 7, and Tailwind CSS.'
  },
  '/database': {
    title: 'PostgreSQL 18 Database Schema (99 Tables) | OptaPOS Docs',
    desc: 'Interactive schema explorer with 99 PostgreSQL 18 tables, relationships, indexes, and constraints.'
  },
  '/api': {
    title: '759 REST APIs Reference & Documentation | OptaPOS Docs',
    desc: 'Comprehensive API reference for 759 endpoints across 74 Laravel 12 controllers with request/response schemas.'
  },
  '/admin-guide': {
    title: 'Administrator & Operations Manual | OptaPOS Docs',
    desc: 'Guide for branch management, role permissions, inventory auditing, procurement, and payroll.'
  },
  '/customer-guide': {
    title: 'Customer E-Commerce Storefront Guide | OptaPOS Docs',
    desc: 'User manual for browsing catalog, multi-currency cart, Bakong KHQR checkout, and order tracking.'
  },
  '/mobile-guide': {
    title: 'Flutter Mobile POS Terminal Guide | OptaPOS Docs',
    desc: 'Manual for mobile cashiers, offline transaction queuing, barcode scanning, and receipt printing.'
  },
  '/developer-guide': {
    title: 'Developer Guide & Contribution Manual | OptaPOS Docs',
    desc: 'Local environment setup, Docker Compose commands, coding standards, and deployment pipelines.'
  },
  '/faq': {
    title: '50+ Enterprise Architecture FAQs | OptaPOS Docs',
    desc: 'Technical questions and enterprise problem-solving answers for architects and developers.'
  },
  '/troubleshooting': {
    title: 'System Troubleshooting & Diagnostic Matrix | OptaPOS Docs',
    desc: 'Diagnostic procedures, common error resolution, and database tuning guides.'
  },
  '/security': {
    title: 'Security, Dual JWT & Spatie RBAC Matrix | OptaPOS Docs',
    desc: 'Security architecture, 169 permissions, role hierarchy, rate limiting, and data encryption.'
  },
};

export const usePageSEO = () => {
  const { pathname } = useLocation();
  const { language } = useDocs();

  useEffect(() => {
    const seo = PAGE_SEO_MAP[pathname] || {
      title: 'OptaPOS — Enterprise Documentation Portal',
      desc: 'Official technical manual and enterprise architecture documentation for OptaPOS.'
    };

    // Update Document Title
    document.title = seo.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.desc);

    // Update OpenGraph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.desc);

    // Update OpenGraph URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://optapos-docs.vercel.app${pathname}`);

  }, [pathname, language]);
};
