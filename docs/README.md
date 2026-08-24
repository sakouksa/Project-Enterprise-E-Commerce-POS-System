# 📚 Enterprise E-Commerce & POS System Documentation Hub

Welcome to the comprehensive technical documentation for the **Enterprise E-Commerce & POS System**. This platform is an enterprise-grade omnichannel solution combining high-throughput Point of Sale (POS), multi-warehouse inventory management, customer e-commerce storefront, and native mobile applications powered by a robust modular Laravel backend.

---

## 🗂️ Complete Documentation Index

### 1. 🏗️ Architecture & Core Design
- [**Master Architecture & Teaching Guide (២១ ផ្នែកពេញលេញ)**](./enterprise-pos-architecture-and-teaching-guide.md): ឯកសារវិភាគស្ថាបត្យកម្មប្រព័ន្ធពេញលេញ និងមេរៀនបង្រៀន ១០ ដំណាក់កាលសម្រាប់ Junior ដល់ Senior Architect។
- [**Image Storage & Media Architecture**](./image-storage.md): ឯកសារណែនាំស្តង់ដារគ្រប់គ្រង Media Storage, Public HTTPS URLs, និង Universal Fallback Engine។
- [**System Overview & Architecture**](./architecture/system-overview.md): High-level system architecture, monorepo topology, micro-service/modular monolith design, communication flows, and core technology stack.
- [**Backend Architecture**](./architecture/backend-architecture.md): Laravel 11 modular structure, DDD patterns, Event-Driven Architecture, Redis caching, job queues, and security.
- [**Frontend Architecture**](./architecture/frontend-architecture.md): React 18 + TypeScript + Vite Admin & POS, Workspace Tabs, 5-Language i18n system (`km`, `en`, `zh`, `th`, `vi`), and state management.
- [**Mobile Architecture**](./architecture/mobile-architecture.md): Flutter cross-platform architecture, offline-first sync, camera barcode scanning, and hardware thermal printing.

### 2. 🗺️ Data Mapping & Security
- [**Database ↔ Backend ↔ Frontend Mapping**](./database-mapping.md): Detailed mapping of DB tables to Eloquent models, API payloads, and frontend form fields, with field mismatch resolutions.
- [**Authentication & Session Management**](./authentication.md): Laravel Sanctum, JWT refresh tokens, multi-device revocation, and Manager Override PINs.
- [**Authorization & RBAC Matrix**](./authorization.md): Roles, permissions, route middleware, and UI permission guards.

### 3. ⚡ Business Workflows & Transaction Lifecycles
- [**Point of Sale (POS) Flow**](./pos-flow.md): Shift open/close, barcode lookup, cart taxes, split tenders, pessimistic stock locking (`FOR UPDATE`), and thermal receipts.
- [**Inventory & Multi-Warehouse Flow**](./inventory-flow.md): Multi-warehouse tracking, stock movements ledger, inter-warehouse transfers, stock adjustments, and Opname cycle counts.
- [**Purchase & Procurement Flow**](./purchase-flow.md): Supplier management, purchase orders, goods receiving notes (GRN), and atomic stock incrementation.
- [**Sales & Order Fulfillment Flow**](./sales-flow.md): E-commerce order lifecycle, tracking, carrier assignments, invoices, and customer refunds.
- [**Analytics & Financial Reports**](./reports.md): Sales revenue, profit calculations, inventory valuation (Cost vs Retail), COGS, and turnover metrics.
- [**Enterprise Notifications**](./notifications.md): Multichannel alerts, notification templates, and user notification preferences.
- [**5-Language Internationalization (i18n)**](./i18n.md): Localization guide for Khmer (`km`), English (`en`), Chinese (`zh`), Thai (`th`), and Vietnamese (`vi`).

### 4. 🗄️ Database & REST API Specifications
- [**API Overview & Standards**](./api/overview.md): Authentication headers, standard JSON envelopes, pagination, rate limiting, and HTTP error codes.
- [**API Endpoints Catalog**](./api/endpoints.md): Complete list of RESTful API endpoints.
- [**Database Schema Overview**](./database/schema-overview.md): MySQL 8 ERD diagram, indexing, foreign keys, and soft deletes.
- [**Data Dictionary**](./database/data-dictionary.md): Comprehensive table-by-table column specification.

### 5. 🚀 Operations & Development
- [**Full System Changelog & Step-by-Step Hosting Guide**](./production-hosting-and-changelog-guide.md): Comprehensive report of all system fixes, technical SEO, DRY refactors, and full VPS / Vercel / Render hosting walkthrough.
- [**Production Deployment Guide**](./deployment.md): Docker Compose setup, Nginx reverse proxy, production optimization, and SSL.
- [**Hosting & Sizing Guide**](./hosting.md): Cloud provider recommendations, sizing matrix, and network security.
- [**Customer Website Architecture**](../customer-website/docs/customer-website-architecture.md): Frontend architecture, data flow, and component rules.
- [**Customer Website Developer Guide**](../customer-website/docs/customer-website-developer-guide.md): Onboarding handbook with step-by-step recipes.
- [**Local Development Guide**](./development-guide.md): Monorepo setup, environment variables, Artisan commands, and database seeding.
- [**Git Workflow & PR Standards**](./git-workflow.md): Branching strategy, Conventional Commits, and pull request checklist.
- [**Troubleshooting & FAQ**](./troubleshooting.md): Solutions for database connectivity, CORS, cache issues, and thermal printer fonts.

---

## 🚀 Quick Reference & Key Ports

| Service / App | Directory | Framework / Language | Default Port |
| :--- | :--- | :--- | :--- |
| **Backend REST API** | `backend/` | PHP 8.2+ / Laravel 11 / Nginx | `http://localhost:8000` or `8001` |
| **Admin Dashboard & POS** | `admin-dashboard/` | React 18 / TypeScript / Vite | `http://localhost:5173` |
| **Customer Storefront** | `customer-website/` | React / Vite / Tailwind CSS | `http://localhost:5174` |
| **Mobile Application** | `mobile_app/` | Flutter 3.x / Dart | Android / iOS / Web / macOS |
| **MySQL Database** | `database/` | MySQL 8.0 | `localhost:3306` |
| **Redis Cache & Queue** | `docker-compose.yml` | Redis 7.x Alpine | `localhost:6379` |

---

## 🌐 Supported Locales (i18n)

1. 🇰🇭 **Khmer (`km`)** - Default locale
2. 🇺🇸 **English (`en`)**
3. 🇨🇳 **Chinese (`zh`)**
4. 🇹🇭 **Thai (`th`)**
5. 🇻🇳 **Vietnamese (`vi`)**
