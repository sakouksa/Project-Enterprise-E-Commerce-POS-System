# 🛍️ Enterprise Omnichannel E-Commerce & Point of Sale (POS) Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?style=flat&logo=flutter&logoColor=white)](https://flutter.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io)

An enterprise-grade, high-performance omnichannel commerce platform designed for multi-store retail, warehouse distribution networks, and digital e-commerce storefronts.

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

## 🏛️ Monorepo Directory Layout

```text
Project-Enterprise-E-Commerce-POS-System/
├── apps/                               # 📱 All Client & Web Applications
│   ├── storefront/                     # React 19 + TypeScript + Vite (Customer E-Commerce)
│   ├── admin-portal/                   # React 19 + TypeScript + Vite (Admin & Web POS)
│   ├── mobile-pos/                     # Flutter Multiplatform App (iOS, Android, POS Terminal)
│   └── docs-portal/                    # Interactive Engineering Documentation Web Portal
│
├── services/                           # ⚙️ Backend Services & APIs
│   └── core-api/                       # Laravel 12 REST API Engine, PostgreSQL 16, Redis Queues
│
├── infrastructure/                     # 🚀 DevOps, Gateway & Containerization
│   └── docker/                         # Nginx Master Gateway & SSL Configurations
│
├── database/                           # 🗄️ Database dumps & seed archives
├── docs/                               # 📚 System Architecture & Engineering Specifications
│   ├── architecture/                   # System, Frontend, Backend & Mobile Architecture
│   ├── api/                            # REST API Standards & Endpoints Catalog
│   └── database/                       # PostgreSQL/MySQL Schema Overview & Data Dictionary
│
├── scripts/                            # 🛠️ Deployment, Backup & Automation Scripts
│
├── .github/                            # 🤖 GitHub Actions CI/CD & Templates
│   ├── workflows/                      # CI workflows for Core API, Admin, Storefront, Mobile
│   ├── ISSUE_TEMPLATE/                 # Bug report & Feature request templates
│   └── pull_request_template.md
│
├── docker-compose.yml                  # Root Development Docker Orchestration
├── docker-compose.staging.yml          # Staging Docker Orchestration
├── docker-compose.prod.yml             # Production Docker Orchestration
└── package.json                        # Monorepo Workspace & Runner Scripts
```

---

## 🚀 Quick Start Guide

### Option 1: Monorepo Root Commands (Fastest)

```bash
# Install dependencies across all apps
npm install

# Run Core API, Admin Portal, and Storefront simultaneously
npm run dev

# Run everything including the Documentation Portal
npm run dev:all
```

---

### Option 2: Run with Docker Compose (Recommended)

```bash
# 1. Start all backend and database containers
docker compose up -d

# 2. Initialize Laravel Core API
docker compose exec app composer install
docker compose exec app cp .env.example .env
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed

# 3. Access applications:
# - Storefront:       http://localhost:5173
# - Admin Portal:     http://localhost:5174
# - Core API Backend: http://localhost:8000
```

---

### Option 3: Local Manual Setup

#### 1. Backend Core API (Laravel)
```bash
cd services/core-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

#### 2. Admin Portal & POS (React 19)
```bash
cd apps/admin-portal
npm install
npm run dev
# Running at: http://localhost:5174
```

#### 3. Customer Storefront (React 19)
```bash
cd apps/storefront
npm install
npm run dev
# Running at: http://localhost:5173
```

#### 4. Mobile POS App (Flutter)
```bash
cd apps/mobile-pos
flutter pub get
flutter run
```

#### 5. Documentation Portal
```bash
cd apps/docs-portal
npm install
npm run dev
# Running at: http://localhost:5175
```

---

## 📚 Documentation Index

For in-depth architecture diagrams, data models, and API specifications, consult the [**Documentation Hub**](./docs/README.md):

- 🏗️ [System Architecture & Overview](./docs/architecture/system-overview.md)
- ⚙️ [Backend Architecture & Patterns](./docs/architecture/backend-architecture.md)
- 🖥️ [Frontend Architecture & UI System](./docs/architecture/frontend-architecture.md)
- 📱 [Mobile App Architecture](./docs/architecture/mobile-architecture.md)
- 🔌 [API Overview & Standards](./docs/api/overview.md)
- 🔌 [API Endpoints Catalog](./docs/api/endpoints.md)
- 🗄️ [Database Schema & ERD](./docs/database/schema-overview.md)
- 🗄️ [Data Dictionary](./docs/database/data-dictionary.md)

---

## 🛡️ CI/CD & Contribution Guidelines

- **Pull Request Template**: See [`.github/pull_request_template.md`](./.github/pull_request_template.md).
- **Issue Templates**: Bug reports and feature suggestions in [`.github/ISSUE_TEMPLATE/`](./.github/ISSUE_TEMPLATE/).
- **Automated CI Workflows**:
  - `core-api-ci.yml`: Automated PHPUnit tests, migrations check, and PHP 8.2/8.3 matrix testing.
  - `admin-portal-ci.yml`: Node 20/22 type checks & Vite build verification.
  - `storefront-ci.yml`: Storefront build verification.
  - `mobile-pos-ci.yml`: Flutter static analysis and tests.

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE).
