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
│
├── admin-dashboard/        # React 18 + TypeScript + Vite (Admin & Web POS)
│
├── backend/                # Laravel 11 REST API, MySQL 8, Redis Queues
│
├── customer-website/       # Customer E-Commerce Web Storefront
│
├── mobile_app/             # Flutter Multiplatform App (iOS, Android, Mobile POS)
│
├── docs/                   # Complete Engineering Documentation
│   ├── architecture/       # System, Frontend, Backend & Mobile Architecture
│   ├── api/                # REST API Standards & Endpoints Catalog
│   └── database/           # MySQL Schema Overview & Data Dictionary
│
├── .github/                # GitHub Actions CI/CD & Issue/PR Templates
│   ├── workflows/          # CI workflows for Backend, Admin, Web, and Mobile
│   ├── ISSUE_TEMPLATE/     # Bug report & Feature request templates
│   └── pull_request_template.md
│
├── docker-compose.yml      # Multi-container orchestration (PHP, Nginx, MySQL, Redis)
└── README.md               # Root Documentation
```

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd Project-Enterprise-E-Commerce-POS-System

# 2. Start all backend services (PHP, Nginx, MySQL, Redis, Queue, Scheduler)
docker compose up -d

# 3. Initialize Laravel backend
docker compose exec app composer install
docker compose exec app cp .env.example .env
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed

# 4. Start the Admin Dashboard
cd admin-dashboard
npm install
npm run dev

# 5. Start the Customer Website
cd ../customer-website
npm install
npm run dev
```

---

### Option 2: Local Manual Setup

#### 1. Backend (Laravel API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

#### 2. Admin Dashboard & POS
```bash
cd admin-dashboard
npm install
npm run dev
# Running at: http://localhost:5173
```

#### 3. Customer Website
```bash
cd customer-website
npm install
npm run dev
# Running at: http://localhost:5174
```

#### 4. Mobile App (Flutter)
```bash
cd mobile_app
flutter pub get
flutter run
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
  - `backend-ci.yml`: Automated PHPUnit tests, migrations check, and PHP 8.2/8.3 matrix testing.
  - `admin-dashboard-ci.yml`: Node 20/22 type checks & Vite build verification.
  - `customer-website-ci.yml`: Storefront build verification.
  - `mobile-app-ci.yml`: Flutter static analysis and tests.

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE).
