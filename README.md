# 🛍️ KHPosCommerce (Enterprise Omnichannel POS & E-Commerce)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?style=flat&logo=flutter&logoColor=white)](https://flutter.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io)

An enterprise-grade, high-performance unified commerce platform designed for multi-store retail, warehouse distribution networks, and digital e-commerce storefronts.

---

## 🌟 Highlights & Key Features

- 🏢 **Multi-Location Warehouse Inventory**: Real-time stock ledgers, atomic stock updates, inter-warehouse transfers, stock adjustments, and cycle count audits (Opname).
- ⚡ **High-Speed Point of Sale (POS)**: Barcode scanning, customizable cash register shifts, split payments (Cash, ABA PayWay, KHQR, Cards), receipt printing, and offline tolerance.
- 🌐 **5-Language Internationalization (i18n)**: Native support for **Khmer (`km`)**, **English (`en`)**, **Chinese (`zh`)**, **Thai (`th`)**, and **Vietnamese (`vi`)** across the entire UI.
- 🎨 **Enterprise UI/UX Design**: Clean tabs (`WorkspaceTabs.tsx`), customizable column visibility (`ColumnSettingsPopover.tsx`), standardized filter drawers, and dark/light themes.
- 🛒 **Customer E-Commerce Storefront**: Modern web storefront with catalog browsing, shopping cart, promotions, and order tracking.
- 📱 **Mobile Flutter Application**: Mobile POS, camera barcode scanner, and Bluetooth thermal printer drivers.
- 🔒 **Security & Granular RBAC**: JWT/Sanctum bearer token authentication with granular permissions for cashiers, inventory managers, and admins.

---

## 🏛️ Clean Monorepo Directory Layout

```text
khposcommerce/
├── backendkhposcommerce/               # ⚙️ Laravel 12 REST API & Business Logic
│   ├── app/                            # Controllers, Models, Services & Domain Rules
│   ├── routes/api.php                  # API Endpoints
│   └── database/migrations             # PostgreSQL / SQLite Schemas
│
├── apps/                               # 🖥️ Web Applications
│   ├── adminkhposcommerce/             # 🖥️ React 19 Admin Dashboard & Web POS
│   └── storefrontkhposcommerce/        # 🛒 React 19 Customer E-Commerce Store
│
├── appkhposcommerce/                   # 📱 Flutter Multiplatform App (iOS, Android, Mobile POS)
│
├── docs/                               # 📚 Complete System Architecture & Specifications (Markdown)
│   ├── architecture/                   # System, Frontend, Backend & Mobile Architecture
│   ├── api/                            # REST API Standards & Endpoints Catalog
│   └── database/                       # PostgreSQL/MySQL Schema Overview & Data Dictionary
│
├── database/                           # 🗄️ Database dumps & seed archives
├── infrastructure/                     # 🚀 DevOps, Nginx Gateway & Containerization
├── scripts/                            # 🛠️ Maintenance & Deployment Scripts
├── docker-compose.yml                  # Local Docker Orchestration
└── package.json                        # Monorepo Workspace & 1-Click Dev Runner Scripts
```

---

## 🚀 Quick Start Guide (Solo Developer Friendly)

### 1. One-Time Setup

```bash
# Install root & app dependencies
npm install

# Setup Laravel Backend API
cd api
composer install
cp -n .env.example .env
php artisan key:generate
php artisan migrate --seed
cd ..
```

---

### 2. Run Applications

```bash
# ⚡ Recommended for Solo Dev: Run API + Admin/POS concurrently
npm run dev

# 🛒 Run API + Admin/POS + Storefront
npm run dev:all

# 📱 Run Flutter Mobile POS
npm run dev:mobile
```

> **Direct Access URLs:**
> - **Admin Dashboard & Web POS**: [http://localhost:5174](http://localhost:5174)
> - **Customer Storefront**: [http://localhost:5173](http://localhost:5173)
> - **Laravel API Backend**: [http://localhost:8001](http://localhost:8001)

---

### 3. Alternative: Run with Docker Compose

```bash
# Start all services with Docker
npm run docker:up

# Stop Docker services
npm run docker:down
```

---

## 📚 Documentation Index

All architectural specifications, database models, and API definitions are maintained in clean Markdown in the [**docs**](./docs/README.md) directory:

- 🏗️ [System Architecture & Overview](./docs/architecture/system-overview.md)
- ⚙️ [Backend Architecture & Patterns](./docs/architecture/backend-architecture.md)
- 🖥️ [Frontend Architecture & UI System](./docs/architecture/frontend-architecture.md)
- 📱 [Mobile App Architecture](./docs/architecture/mobile-architecture.md)
- 🔌 [API Overview & Standards](./docs/api/overview.md)
- 🔌 [API Endpoints Catalog](./docs/api/endpoints.md)
- 🗄️ [Database Schema & ERD](./docs/database/schema-overview.md)
- 🗄️ [Data Dictionary](./docs/database/data-dictionary.md)

---

## 🛡️ CI/CD & Workflows

Automated GitHub Actions workflows in `.github/workflows/`:
- `api-ci.yml`: Automated PHPUnit tests & migrations check.
- `admin-ci.yml`: Node type checks & Vite build verification for Admin & POS.
- `storefront-ci.yml`: Customer Storefront build verification.
- `mobile-ci.yml`: Flutter static analysis and tests.

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE).
