# 📘 OptaPOS Enterprise Documentation Portal
### Unified Technical & Architectural Documentation Hub for Enterprise E-Commerce + POS System

Welcome to the official developer and engineering documentation for **OptaPOS (Project-Enterprise-E-Commerce + POS-System)**.

---

## 🎯 What is OptaPOS?

**OptaPOS** is an enterprise-grade retail, e-commerce, multi-warehouse inventory, and workforce management platform engineered with a **Single Source of Truth** architecture on **Laravel 12** and **PostgreSQL 18**.

```
+---------------------------------------------------------------------------------------------------------------+
|                                      OPTAPOS 4 CONNECTED CLIENT PLATFORMS                                     |
+---------------------------------------------------------------------------------------------------------------+
|  1. 🛡️ Admin Dashboard (React 19)   | 2. 🛍️ Customer Storefront (React 19) | 3. 📱 Mobile POS (Flutter 3.24)  |
|     Port 5173 • 258 Management Pages |    Port 5174 • 28 Customer Pages    |    iOS / Android • Offline-First |
+---------------------------------------------------------------------------------------------------------------+
|                                            ▼ (759 REST APIs via HTTPS/WSS)                                    |
+---------------------------------------------------------------------------------------------------------------+
|  4. ⚙️ Central Backend Hub (Laravel 12 on PHP 8.2 • Port 8000)                                                |
|     Dual JWT Auth • Spatie RBAC (169 Nodes) • Atomic Transactions • Service-Repository Pattern                |
+---------------------------------------------------------------------------------------------------------------+
|                                            ▼ (PostgreSQL Wire Protocol & Redis IPC)                           |
+---------------------------------------------------------------------------------------------------------------+
|  💾 PostgreSQL 18 Alpine (99 Tables • 36 Migrations)  |  ⚡ Redis 7 (In-Memory Cache, Queues, KHQR Cache)      |
+---------------------------------------------------------------------------------------------------------------+
```

---

## 🧭 Where Should I Start? (Role-Based Onboarding Guide)

Select your role to jump directly to the relevant documentation sections:

| Role | Primary Goal | Recommended Starting Path |
|---|---|---|
| 🚀 **New Developer** | Clone repo, setup local Docker, understand system topology | [01-Developer Onboarding](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/tutorials/01-developer-onboarding.md) ➜ [System Overview](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/project-overview/01-system-overview.md) |
| ⚙️ **Backend Developer** | Laravel 12 services, 759 REST APIs, Eloquent models, Spatie RBAC | [Backend Architecture](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/applications/backend/README.md) ➜ [API Reference](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/api/README.md) |
| 💻 **Frontend Developer** | React 19 Admin (AntD) or Customer Storefront (Tailwind, Zustand) | [Admin Dashboard](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/applications/admin-dashboard/README.md) ➜ [Customer Website](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/applications/customer-website/README.md) |
| 📱 **Flutter Developer** | Mobile POS cashier app, Hive offline sync, Barcode & KHQR flow | [Mobile App Docs](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/applications/mobile-app/README.md) ➜ [POS Subsystem](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/pos/README.md) |
| 🗄️ **Database Architect** | 99 Tables schema, indexes, atomic row-locks, migrations | [Database Architecture](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/database/README.md) ➜ [Table Reference](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/database/01-naming-conventions.md) |
| 🚢 **DevOps Engineer** | Docker Compose, Vercel SPA routing, Render backend, Redis & SSL | [DevOps Manual](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/devops/README.md) ➜ [Local Docker Dev](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/devops/local-development-docker.md) |
| 🧪 **QA & Test Engineer** | Business workflows, edge cases, KHQR validation, rate limits | [Testing Strategy](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/team-guidelines/README.md) ➜ [Troubleshooting](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/troubleshooting/README.md) |
| 👔 **Business / Product Owner** | Module workflows, multi-warehouse costing, Cambodian payroll | [Business Domains](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/business-domains/products/README.md) ➜ [System Status](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/docs/project-overview/07-system-status.md) |

---

## 🗂️ Documentation Directory Sitemap

```
docs/
├── README.md                                # This Master Hub
├── project-overview/                        # Vision, Scope, Status, Glossary (8 docs)
├── architecture/                            # 6-Tier Blueprint, Auth, Data Flows (15 docs)
├── applications/                            # Application-specific setup & deep dives
│   ├── admin-dashboard/                     # React 19 + Ant Design 5 (258 Pages)
│   ├── customer-website/                    # React 19 + Tailwind CSS + SEO (28 Pages)
│   ├── mobile-app/                          # Flutter 3.24 + Riverpod + Hive Cache
│   └── backend/                             # Laravel 12 on PHP 8.2 (759 REST APIs)
├── business-domains/                        # 10 Core Enterprise Business Domains
│   ├── products/                            # Products, Variants, SKUs, Attributes
│   ├── inventory/                           # Warehouses, Movements, Stock Transfers
│   ├── purchasing/                          # Suppliers, Purchase Orders, Receiving
│   ├── sales/                               # POS Orders, Invoices, Split Payments
│   ├── customers/                           # Groups, Loyalty Points, Credit Limits
│   ├── employees/                           # Staff, Leave, Attendance, Tax Payroll
│   ├── finance/                             # Accounts, Expenses, Cash Registers
│   ├── notifications/                       # DB, Broadcast, Push Notifications
│   └── reporting/                           # Sales, Stock, Tax, P&L Analytics
├── pos/                                     # High-Speed POS Terminal Subsystem (8 docs)
├── database/                                # PostgreSQL 18 (99 Tables) Schema Reference
├── api/                                     # 759 REST APIs Reference & Endpoints
├── security/                                # Dual JWT, Spatie RBAC (169 Nodes), Data Isolation
├── devops/                                  # Docker, Vercel, Render, PostgreSQL 18, Redis 7
├── troubleshooting/                         # RCA, Error Codes & Common Issue Resolution
├── tutorials/                               # Step-by-step practical guides & walkthroughs
└── team-guidelines/                         # Coding standards, PR rules, Git branching
```

---

## ⚡ Quick Start (Local Environment Setup)

```bash
# 1. Clone repository
git clone https://github.com/sakouksa/Project-Enterprise-E-Commerce-POS-System.git
cd Project-Enterprise-E-Commerce-POS-System

# 2. Launch PostgreSQL 18 & Redis 7 via Docker
docker-compose up -d postgres redis

# 3. Start Laravel 12 Backend API
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve --port=8000

# 4. Start React 19 Admin Dashboard (Port 5173)
cd ../admin-dashboard && npm install && npm run dev

# 5. Start React 19 Customer Website (Port 5174)
cd ../customer-website && npm install && npm run dev

# 6. Start Documentation Portal (Port 5175)
cd ../docs-website && npm install && npm run dev
```
