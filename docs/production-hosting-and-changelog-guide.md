# 🏢 មគ្គុទ្ទេសក៍លម្អិតស្ដីពី៖ ការកែលម្អប្រព័ន្ធ និងការរៀបចំ Hosting មួយជំហានម្តងៗ
# (Comprehensive Production Hosting & Full System Changelog Guide)

> **គម្រោង (Project):** Enterprise E-Commerce + POS System  
> **ឯកសារសម្រាប់ (Target Audience):** Software Engineers, DevOps Engineers, System Administrators, និង Junior Developers  
> **ភាសា (Language):** ភាសាខ្មែរ (Khmer) លាយជាមួយ English Technical Terms ដើម្បីងាយស្រួលយល់ និងអនុវត្តជាក់ស្ដែង ១០០%។

---

# តារាងមាតិកា (Table of Contents)

1. [ផ្នែកទី ១៖ របាយការណ៍លម្អិតនៃការកែលម្អទាំងអស់ដែលបានធ្វើ (Full System Changelog)](#ផ្នែកទី-១-របាយការណ៍លម្អិតនៃការកែលម្អទាំងអស់ដែលបានធ្វើ)
   - [១.១. ការធ្វើ Full Technical SEO Audit & Google Search Optimization](#១១-ការធ្វើ-full-technical-seo-audit--google-search-optimization)
   - [១.២. ការធ្វើ Global DRY Refactor & Master Reusable Components](#១២-ការធ្វើ-global-dry-refactor--master-reusable-components)
   - [១.៣. ស្ថាបត្យកម្ម Clean Architecture & Modular App Layer](#១៣-ស្ថាបត្យកម្ម-clean-architecture--modular-app-layer)
   - [១.៤. ការដំឡើង Brand Logo & Favicon Suite ផ្លូវការ](#១៤-ការដំឡើង-brand-logo--favicon-suite-ផ្លូវការ)
2. [ផ្នែកទី ២៖ ស្ថាបត្យកម្ម Hosting និងលំហូរទិន្នន័យ (System Hosting Topology)](#ផ្នែកទី-២-ស្ថាបត្យកម្ម-hosting-និងលំហូរទិន្នន័យ)
3. [ផ្នែកទី ៣៖ ការជ្រើសរើសទំហំ Server និង Cloud Provider (Hardware Sizing Matrix)](#ផ្នែកទី-៣-ការជ្រើសរើសទំហំ-server-និង-cloud-provider)
4. [ផ្នែកទី ៤៖ មគ្គុទ្ទេសក៍ Hosting លើ VPS / Dedicated Linux Server (Docker Production)](#ផ្នែកទី-៤-មគ្គុទ្ទេសក៍-hosting-លើ-vps--dedicated-linux-server)
   - [ជំហានទី ១៖ ការតភ្ជាប់ SSH និងការពង្រឹងសុវត្ថិភាព Server (Hardening & Firewall)](#ជំហានទី-១-ការតភ្ជាប់-ssh-និងការពង្រឹងសុវត្ថិភាព-server)
   - [ជំហានទី ២៖ ការដំឡើង Docker Engine & Docker Compose](#ជំហានទី-២-ការដំឡើង-docker-engine--docker-compose)
   - [ជំហានទី ៣៖ ការចង Domain Name & DNS Records (A Records)](#ជំហានទី-៣-ការចង-domain-name--dns-records)
   - [ជំហានទី ៤៖ ការ Clone Code និងការកំណត់ Environment Variables (.env)](#ជំហានទី-៤-ការ-clone-code-និងការកំណត់-environment-variables)
   - [ជំហានទី ៥៖ ការដំឡើង SSL/TLS Certificate ដោយឥតគិតថ្លៃ (Let's Encrypt)](#ជំហានទី-៥-ការដំឡើង-ssltls-certificate-ដោយឥតគិតថ្លៃ)
   - [ជំហានទី ៦៖ ការ Launch Docker Production Containers](#ជំហានទី-៦-ការ-launch-docker-production-containers)
   - [ជំហានទី ៧៖ Database Migration, Initial Seeding & Production Cache](#ជំហានទី-៧-database-migration-initial-seeding--production-cache)
   - [ជំហានទី ៨៖ ការរៀបចំ Cron Job (Scheduler) និង Queue Worker](#ជំហានទី-៨-ការរៀបចំ-cron-job-និង-queue-worker)
   - [ជំហានទី ៩៖ របៀប Update Code ថ្មីដោយមិនបាច់បិទ Website (Zero-Downtime Deploy)](#ជំហានទី-៩-របៀប-update-code-ថ្មីដោយមិនបាច់បិទ-website)
   - [ជំហានទី ១០៖ ប្រព័ន្ធ Backup Database ដោយស្វ័យប្រវត្តិ](#ជំហានទី-១០-ប្រព័ន្ធ-backup-database-ដោយស្វ័យប្រវត្តិ)
5. [ផ្នែកទី ៥៖ មគ្គុទ្ទេសក៍ Hosting លើ Serverless Cloud (Vercel + Render / Railway)](#ផ្នែកទី-៥-មគ្គុទ្ទេសក៍-hosting-លើ-serverless-cloud)
   - [៥.១. ការ Deploy Customer Website លើ Vercel](#៥១-ការ-deploy-customer-website-លើ-vercel)
   - [៥.២. ការ Deploy Admin Dashboard & POS លើ Vercel](#៥២-ការ-deploy-admin-dashboard--pos-លើ-vercel)
   - [៥.៣. ការ Deploy Laravel Backend + PostgreSQL + Redis លើ Render / Railway](#៥៣-ការ-deploy-laravel-backend--postgresql--redis-លើ-render--railway)
6. [ផ្នែកទី ៦៖ បញ្ហាដែលជួបញឹកញាប់ និងវិធីដោះស្រាយ (Troubleshooting & FAQs)](#ផ្នែកទី-៦-បញ្ហាដែលជួបញឹកញាប់-និងវិធីដោះស្រាយ)

---

# ផ្នែកទី ១៖ របាយការណ៍លម្អិតនៃការកែលម្អទាំងអស់ដែលបានធ្វើ

## ១.១. ការធ្វើ Full Technical SEO Audit & Google Search Optimization

### 🔴 បញ្ហាចាស់ (Previous Problems):
* Website ដំណើរការជា Single Page Application (SPA) ដោយគ្មាន XML Sitemap ពិតប្រាកដ ឬ robots.txt dynamic ចេញពី Database។ Google Crawlers មិនអាចស្វែងរកទំព័រទំនិញថ្មីៗបានលឿនឡើយ។
* គ្មាន Structured Data (Schema.org JSON-LD) ធ្វើឱ្យ Google Search មិនអាចបង្ហាញ Rich Snippets ដូចជា តម្លៃទំនិញ ($), ចំនួនផ្កាយ Rating (⭐), និងស្ថានភាពមានក្នុងស្តុក (In Stock)។
* Social Media Sharing (Facebook, Telegram, Twitter) បង្ហាញតែរូបភាពទទេ ឬអក្សរ Default គ្មានភាពទាក់ទាញ។

### 🟢 ដំណោះស្រាយដែលបានបង្កើត និងកែសម្រួល (Fixes Implemented):
1. **Backend Dynamic XML Sitemap & Robots Engine:**
   * បង្កើត [`backend/app/Http/Controllers/Api/SeoController.php`](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/backend/app/Http/Controllers/Api/SeoController.php) ដែលភ្ជាប់ជាមួយ Route `/sitemap.xml` និង `/robots.txt`។
   * ទាញយកបញ្ជី Products, Categories, Brands, និង Blog Articles ពិតប្រាកដចេញពី PostgreSQL Database ដោយស្វ័យប្រវត្តិ ព្រមទាំងដាក់ `lastmod`, `changefreq: daily`, និង `priority: 0.9`។
   * កំណត់ `robots.txt` ឱ្យ Googlebot ចូល Crawl ទំព័រសាធារណៈ និង Disallow ផ្លូវឯកជន (`/cart`, `/checkout`, `/account/`, `/auth/`)។
2. **SEO Engine ស្ដង់ដារ (`src/components/seo/SEOHead.tsx`):**
   * បង្កើត Dynamic Canonical URL Generator ដើម្បីការពារបញ្ហា Duplicate Content Penalty ពី Google Search។
   * OpenGraph & Twitter Card Meta Tags ជាមួយ Locale Mapping ស្វ័យប្រវត្តិ (`km_KH`, `en_US`, `th_TH`, `vi_VN`, `zh_CN`)។
   * **៧ ប្រភេទ Structured Data Schemas (JSON-LD):**
     1. `Product` Schema (ឈ្មោះទំនិញ, តម្លៃ, រូបិយប័ណ្ណ, SKU, Stock Status, Brand, និង Reviews Rating)
     2. `BreadcrumbList` Schema (ឋានានុក្រមទំព័រ)
     3. `FAQPage` Schema (សំណួរ-ចម្លើយលើទំព័រ FAQ)
     4. `Article` Schema (សម្រាប់អត្ថបទបច្ចេកវិទ្យា និង Blog)
     5. `WebSite` Schema (ភ្ជាប់ជាមួយ Sitelinks Searchbox)
     6. `Organization` Schema (ឈ្មោះក្រុមហ៊ុន, Logo, Hotlines, អាសយដ្ឋាន)
     7. `LocalBusiness` / `Store` Schema (Geo-coordinates និងម៉ោងបើកធ្វើការ)។

---

## ១.២. ការធ្វើ Global DRY Refactor & Master Reusable Components

### 🔴 បញ្ហាចាស់ (Previous Problems):
* មាន Product Card ចំនួន ២ ដាច់ដោយឡែកពីគ្នា (`CustomerProductCard.tsx` និង `ProductCard.tsx`) ដែលសរសេរកូដ Wishlist, Cart, Currency format, និង Discount math ស្ទួនៗគ្នា។
* មាន Section ចំនួន ៨ លើ Homepage (Featured, Arrivals, Deals, Best Sellers, etc.) ដែលជាកូដ Copy-Paste ដូចគ្នា ៩៩%។

### 🟢 ដំណោះស្រាយដែលបានបង្កើត និងកែសម្រួល (Fixes Implemented):
1. **Master `ProductCard.tsx`** ([`src/components/ecommerce/ProductCard.tsx`](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/customer-website/src/components/ecommerce/ProductCard.tsx)):
   * បង្រួបបង្រួមជា Master Component តែមួយគត់ដែល Support 4 Variants៖
     * `default`: កាតទំនិញស្ដង់ដារសម្រាប់ Grid លើ Homepage និង Catalog
     * `compact`: កាតទំហំតូចសម្រាប់ Sidebar និង Drawer
     * `featured`: កាតទំហំធំសម្រាប់ Flash Sale Banners
     * `horizontal`: កាតទម្រង់ផ្តេកសម្រាប់ List View Mode និង Cart / Wishlist
2. **Master `ProductSection.tsx`** ([`src/components/ecommerce/ProductSection.tsx`](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/customer-website/src/components/ecommerce/ProductSection.tsx)):
   * បង្រួញ Section ទាំង ៨ ឱ្យមកប្រើ Reusable Master Component ដោយគ្រាន់តែបញ្ជូន Props ខ្លីៗ។
3. **Shared Presentation & Domain Components:**
   * `<ProductPrice />`: គណនាបញ្ចុះតម្លៃ, Strikethrough compare price, និងប្តូររូបិយប័ណ្ណតាម Settings។
   * `<RatingStars />`: បង្ហាញផ្កាយ Rating ៥ និងចំនួន Reviews។
   * `<WishlistButton />`: ប៊ូតុងបេះដូង Wishlist ជាមួយ Optimistic UI Animation។
   * `<AddToCartButton />`: ប៊ូតុង Add to Cart ជាមួយ Loading Spinner និង "Added!" Feedback។
   * `<OrderStatusBadge />` & `<StockBadge />`: Badge បង្ហាញស្ថានភាព Order និងកម្រិតស្តុក។
   * `<ImageWithFallback />`: Lazy Image Component ដែលមាន Skeleton Placeholder និង Fallback កាលណារូបភាព Error។
   * `<EmptyState />` & `<ErrorState />`: បង្ហាញផ្ទាំង Empty Cart, Empty Wishlist, No Orders, No Search Results ដោយស្វ័យប្រវត្តិ។
4. **UI Design System Primitives (`src/components/ui/`):**
   * `Button.tsx`, `Badge.tsx`, `Card.tsx`, `Input.tsx`, `Skeleton.tsx`, `Spinner.tsx`។

---

## ១.៣. ស្ថាបត្យកម្ម Clean Architecture & Modular App Layer

### 🔴 បញ្ហាចាស់ (Previous Problems):
* `App.tsx` ផ្ទុកកូដ 172 បន្ទាត់លាយបញ្ចូលគ្នាទាំង Routing, React Query, Theme Sync, Route Guards និង Lazy Routes ទាំងអស់។
* API Client ស្ថិតនៅ ២ កន្លែង (`src/api/client.ts` និង `src/lib/api.ts`) ធ្វើឱ្យ Developer ថ្មីពិបាកដឹងថាគួរ Import ពីណា។

### 🟢 ដំណោះស្រាយដែលបានបង្កើត និងកែសម្រួល (Fixes Implemented):
* បង្កើត **Application Root Layer** ស្ដង់ដារ (`src/app/`):
  * `src/app/providers/QueryProvider.tsx`: TanStack React Query Client Setup
  * `src/app/providers/ThemeProvider.tsx`: Dark/Light System Theme Synchronization
  * `src/app/providers/FaviconProvider.tsx`: Dynamic Favicon Synchronization
  * `src/app/router/RouteGuards.tsx`: `ProtectedRoute` (សម្រាប់ Account) និង `GuestRoute` (សម្រាប់ Login/Register)
  * `src/app/router/routes.tsx`: Lazy-loaded Page Routes Declarations
  * `src/app/router/AppRouter.tsx`: Main Route Tree
  * `src/app/App.tsx`: Clean Root Composition Component
* បង្កើត **Custom Domain Hooks (`src/hooks/`)**: `useAddToCart.ts`, `useWishlist.ts`, `useInfiniteProducts.ts`, `useSearch.ts`
* បង្កើត **Centralized API Services (`src/services/`)**: `cartService.ts`, `wishlistService.ts`, `orderService.ts`, `productService.ts`, `authService.ts`
* បង្កើត **Centralized Query Keys (`src/constants/queryKeys.ts`)**។

---

## ១.៤. ការដំឡើង Brand Logo & Favicon Suite ផ្លូវការ

### 🔴 បញ្ហាចាស់ (Previous Problems):
* លើ Browser Tab និង Google Search លោត Icon ពណ៌ស្វាយរបស់ Vite (Default Icon)។

### 🟢 ដំណោះស្រាយដែលបានបង្កើត និងកែសម្រួល (Fixes Implemented):
* បង្កើត Icon ផ្លូវការរបស់ **NexTech Enterprise (ពណ៌ក្រហម Rounded Emblem)** គ្រប់ទំហំស្ដង់ដារពិភពលោក៖
  1. `public/favicon.svg`: Scalable Vector Icon កម្រិតច្បាស់ខ្ពស់
  2. `public/favicon.ico`: Multi-size (16x16, 32x32, 48x48, 64x64) សម្រាប់ Windows Taskbar & Google Search
  3. `public/favicon-48x48.png`, `favicon-32x32.png`, `favicon-16x16.png`
  4. `public/apple-touch-icon.png` (180x180 សម្រាប់ Apple Safari & iOS Home Screen)
  5. `public/android-chrome-192x192.png` & `512x512.png` (សម្រាប់ Android PWA)
  6. `public/site.webmanifest`: កំណត់ PWA Name និង Theme Color `#e11d48`
  7. `FaviconProvider.tsx`: ធ្វើបច្ចុប្បន្នភាព Icon លើ Tab ដោយស្វ័យប្រវត្តិកាលណា Admin ប្តូរ Logo ក្នុង Backend។

---

# ផ្នែកទី ២៖ ស្ថាបត្យកម្ម Hosting និងលំហូរទិន្នន័យ (System Hosting Topology)

ប្រព័ន្ធនេះត្រូវបានរចនាឡើងជា **Decoupled Omnichannel Architecture** ដែលបំបែក Frontend, Backend, Database, និង Mobile App ចេញពីគ្នាដើម្បីធានា High Performance, High Availability និង Scalability៖

```
                                  [ INTERNET CLIENTS ]
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │                            │                            │
        [ Web Browsers ]             [ Admin / POS ]             [ Flutter Mobile ]
               │                            │                            │
               ▼                            ▼                            │
      https://www.example.com      https://admin.example.com             │
               │                            │                            │
               ▼                            ▼                            │
       [ Customer SPA ]             [ Admin / POS SPA ]                  │
       (React 19 + Vite)            (React 19 + Vite)                    │
               │                            │                            │
               └───────────────────┬────────┘                            │
                                   │                                     │
                                   ▼                                     ▼
                        https://api.example.com                https://api.example.com/api/v1
                                   │
                                   ▼
                       [ Nginx Reverse Proxy Gateway ]
                       (SSL Offloading / Port 80 & 443)
                                   │
                                   ▼
                    [ Laravel 12 API (PHP 8.3-FPM) ]
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
         [ PostgreSQL 16 DB ]            [ Redis 7 In-Memory ]
         (Persistent Storage)            (Cache, Session, Queues)
```

### តួនាទីរបស់ផ្នែកនីមួយៗ (Component Responsibilities):
1. **Customer Storefront (`www.example.com`):** Static Single Page Application (SPA) បង្កើតដោយ React 19 + Vite + Tailwind CSS។
2. **Admin Dashboard & POS (`admin.example.com`):** SPA សម្រាប់គ្រប់គ្រងទំនិញ, ស្តុក, ការបញ្ជាទិញ, បុគ្គលិក, របាយការណ៍ និងការលក់ POS។
3. **Laravel Backend API (`api.example.com`):** REST API ទទួលខុសត្រូវលើ Business Logic, Auth (Sanctum), Payment, Inventory Pessimistic Locking, និង Data Validation។
4. **PostgreSQL 16 Database:** រក្សាទុកទិន្នន័យ Transactional ទាំងអស់ (ACID compliant)។
5. **Redis 7:** គ្រប់គ្រង Cache, User Sessions, និង Background Job Queues (Emails, Invoices, Stock Sync)។

---

# ផ្នែកទី ៣៖ ការជ្រើសរើសទំហំ Server និង Cloud Provider

| កម្រិតអាជីវកម្ម (Tier) | ចំនួន POS & Daily Orders | ទំហំ Server ដែលណែនាំ (Recommended Specs) | Cloud Providers សមស្រប | តម្លៃប៉ាន់ស្មាន/ខែ |
| :--- | :--- | :--- | :--- | :--- |
| **Starter Tier** | 1 - 5 POS Terminals<br>< 1,000 Orders/day | **4 vCPUs, 8 GB RAM, 80 GB NVMe SSD** | Hetzner CPX31 / DigitalOcean Droplet | **$25 - $45 / mo** |
| **Standard Enterprise** | 5 - 25 POS Terminals<br>5,000+ Orders/day | **8 vCPUs, 16 GB RAM, 160 GB NVMe SSD** | Hetzner CPX41 / AWS EC2 c6i.xlarge | **$60 - $120 / mo** |
| **High Scale / Multi-Branch** | 25+ POS Terminals<br>20,000+ Orders/day | **16 vCPUs, 32 GB RAM, Managed DB Cluster** | AWS (EC2 + RDS Postgres + ElastiCache) | **$200 - $450 / mo** |

> [!TIP]
> **អនុសាសន៍ល្អបំផុតសម្រាប់តម្លៃ និងល្បឿន:** ប្រើ **Hetzner Cloud (CPX31 / CPX41)** ឬ **DigitalOcean** ប្រសិនបើចង់បាន Server ឯករាជ្យដែលមានតម្លៃសមរម្យ និងល្បឿន CPU ខ្ពស់។

---

# ផ្នែកទី ៤៖ មគ្គុទ្ទេសក៍ Hosting លើ VPS / Dedicated Linux Server (Docker Production)

នេះជាវិធីសាស្រ្តចម្បងដែល **Enterprise-Ready ១០០%** ព្រោះវាមាន Nginx Gateway, PostgreSQL 16, Redis 7, និង SSL Certificate រួចជាស្រេចក្នុង Docker Containers។

---

### ជំហានទី ១៖ ការតភ្ជាប់ SSH និងការពង្រឹងសុវត្ថិភាព Server

1. **តភ្ជាប់ចូលទៅកាន់ Server តាមរយៈ Terminal (Mac/Linux) ឬ PowerShell/PuTTY (Windows):**
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

2. **Update ប្រព័ន្ធប្រតិបត្តិការ Ubuntu ឱ្យឡើងកំណែចុងក្រោយ:**
   ```bash
   apt update && apt upgrade -y
   apt install -y curl wget git ufw htop unzip software-properties-common nano ca-certificates gnupg
   ```

3. **បង្កើត Deployer User ថ្មី (មិនប្រើ Root ដោយផ្ទាល់ដើម្បីសុវត្ថិភាព):**
   ```bash
   adduser deployer
   usermod -aG sudo deployer
   ```

4. **កំណត់ UFW Firewall (ការពារ Hacker មិនឱ្យ Scan ឃើញ Database):**
   ```bash
   # អនុញ្ញាតតែ Port ដែលចាំបាច់បំផុត
   ufw allow 22/tcp    # SSH Management
   ufw allow 80/tcp    # HTTP (Let's Encrypt & HTTPS Redirect)
   ufw allow 443/tcp   # HTTPS (Web, Admin, Mobile API Traffic)
   
   # បើកដំណើរការ Firewall
   ufw enable
   ufw status verbose
   ```

---

### ជំហានទី ២៖ ការដំឡើង Docker Engine & Docker Compose

ដំណើរការ Command ផ្លូវការរបស់ Docker៖

```bash
# ទាញយក និងដំឡើង Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# ផ្ដល់សិទ្ធិឱ្យ User deployer អាច run docker ដោយមិនបាច់វាយ sudo
usermod -aG docker deployer

# ពិនិត្យមើល Version
docker --version
docker compose version
```

---

### ជំហានទី ៣៖ ការចង Domain Name & DNS Records

ចូលទៅកាន់ផ្ទាំងគ្រប់គ្រង Domain របស់អ្នក (ឧ. **Cloudflare**, **Namecheap**, **GoDaddy**) រួចបង្កើត **A Records** ដូចខាងក្រោម៖

| Record Type | Host / Name | Value / IP Address | TTL | ពន្យល់ |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (ឬ `example.com`) | `YOUR_SERVER_IP` | Auto | ទំព័រដើម Customer Website |
| **A** | `www` | `YOUR_SERVER_IP` | Auto | Customer Website Subdomain |
| **A** | `admin` | `YOUR_SERVER_IP` | Auto | ផ្ទាំងគ្រប់គ្រង Admin & POS |
| **A** | `api` | `YOUR_SERVER_IP` | Auto | Laravel REST API Gateway |

> [!IMPORTANT]
> ប្រសិនបើអ្នកប្រើ Cloudflare សូមបិទ **Proxy (ជ្រើសរើស DNS Only - ពពកពណ៌ប្រផេះ)** ជាបណ្ដោះអាសន្នសិន ដើម្បីឱ្យ Let's Encrypt Certbot អាចផ្ទៀងផ្ទាត់ SSL Certificate បានជោគជ័យ។ ក្រោយពេលបាន SSL ហើយ អ្នកអាចបើក Proxy ឡើងវិញបាន។

---

### ជំហានទី ៤៖ ការ Clone Code និងការកំណត់ Environment Variables

1. **ចូលទៅកាន់ Folder `/var/www` និង Clone Repository:**
   ```bash
   cd /var/www
   git clone https://github.com/sakouksa/Project-Enterprise-E-Commerce-POS-System.git enterprise-pos
   cd enterprise-pos
   git checkout develop
   ```

2. **រៀបចំឯកសារ `backend/.env.production`:**
   ```bash
   cp backend/.env.example backend/.env.production
   nano backend/.env.production
   ```

   **គំរូការកំណត់ក្នុង `backend/.env.production` (ត្រូវប្តូរ Domain និង Password ជាក់ស្តែង):**
   ```env
   APP_NAME="NexTech Enterprise"
   APP_ENV=production
   APP_KEY=base64:GENERATE_YOUR_OWN_KEY_HERE
   APP_DEBUG=false
   APP_URL=https://api.example.com

   FRONTEND_URL=https://www.example.com
   ADMIN_URL=https://admin.example.com

   LOG_CHANNEL=daily
   LOG_LEVEL=error

   # ─── PostgreSQL Database ─────────────────────────────────────────────
   DB_CONNECTION=pgsql
   DB_HOST=postgres
   DB_PORT=5432
   DB_DATABASE=enterprise_pos_prod
   DB_USERNAME=pos_admin
   DB_PASSWORD=SuperStrongPassword_9988!

   # ─── Redis Cache & Queue ─────────────────────────────────────────────
   CACHE_STORE=redis
   QUEUE_CONNECTION=redis
   SESSION_DRIVER=redis
   REDIS_HOST=redis
   REDIS_PASSWORD=RedisStrongAuth_7766!
   REDIS_PORT=6379

   # ─── Sanctum & Session Domains ───────────────────────────────────────
   SANCTUM_STATEFUL_DOMAINS=admin.example.com,www.example.com,example.com
   SESSION_DOMAIN=.example.com

   # ─── Mail Settings (SMTP) ────────────────────────────────────────────
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS="support@example.com"
   MAIL_FROM_NAME="NexTech Enterprise"
   ```

3. **រៀបចំឯកសារ `.env.production` សម្រាប់ Customer Website & Admin Dashboard:**
   ```bash
   # Customer Website Environment
   cat << 'EOF' > customer-website/.env.production
   VITE_API_BACKEND_URL=https://api.example.com
   VITE_STORE_API_URL=https://api.example.com/api/v1/store
   VITE_SITE_URL=https://www.example.com
   EOF

   # Admin Dashboard Environment
   cat << 'EOF' > admin-dashboard/.env.production
   VITE_API_BACKEND_URL=https://api.example.com
   VITE_API_URL=https://api.example.com/api/v1
   EOF
   ```

---

### ជំហានទី ៥៖ ការដំឡើង SSL/TLS Certificate ដោយឥតគិតថ្លៃ (Let's Encrypt)

ដំឡើង Certbot និងស្នើសុំ SSL Certificate សម្រាប់ Domains ទាំងអស់៖

```bash
apt install -y certbot

# ស្នើសុំ SSL មួយដងបានគ្រប់ Subdomains
certbot certonly --standalone \
  -d example.com \
  -d www.example.com \
  -d admin.example.com \
  -d api.example.com \
  --non-interactive \
  --agree-tos \
  -m admin@example.com
```

* SSL Files នឹងត្រូវរក្សាទុកនៅ៖ `/etc/letsencrypt/live/example.com/fullchain.pem` និង `privkey.pem`។

---

### ជំហានទី ៦៖ ការ Launch Docker Production Containers

ដំណើរការ Build Docker Containers ទាំងអស់៖

```bash
# Build Production Images
docker compose -f docker-compose.prod.yml build

# ចាប់ផ្ដើមដំណើរការ Containers ទាំងអស់ក្នុង Background
docker compose -f docker-compose.prod.yml up -d

# ពិនិត្យមើលថាតើ Containers ទាំងអស់ដំណើរការល្អដែរឬទេ
docker compose -f docker-compose.prod.yml ps
```

---

### ជំហានទី ៧៖ Database Migration, Initial Seeding & Production Cache

ដំណើរការ Commands ទាំងនេះនៅក្នុង Backend Container៖

```bash
# 1. បង្កើត Tables ទាំងអស់ក្នុង PostgreSQL
docker compose -f docker-compose.prod.yml exec backend php artisan migrate --force

# 2. បញ្ចូល Seed Data (Super Admin, Roles, Default Categories, Store Settings)
docker compose -f docker-compose.prod.yml exec backend php artisan db:seed --force

# 3. បង្កើត Symlink សម្រាប់ Public Uploads (រូបភាពទំនិញ និង Logo)
docker compose -f docker-compose.prod.yml exec backend php artisan storage:link

# 4. Cache Config, Routes, Views, Events សម្រាប់ High Performance
docker compose -f docker-compose.prod.yml exec backend php artisan config:cache
docker compose -f docker-compose.prod.yml exec backend php artisan route:cache
docker compose -f docker-compose.prod.yml exec backend php artisan view:cache
docker compose -f docker-compose.prod.yml exec backend php artisan event:cache
```

---

### ជំហានទី ៨៖ ការរៀបចំ Cron Job (Scheduler) និង Queue Worker

1. **ដំឡើង Task Scheduler ក្នុង Host Server:**
   ```bash
   crontab -e
   ```
   បន្ថែមបន្ទាត់នេះនៅខាងក្រោមបង្អស់៖
   ```bash
   * * * * * cd /var/www/enterprise-pos && docker compose -f docker-compose.prod.yml exec -T backend php artisan schedule:run >> /dev/null 2>&1
   ```
   * នេះធ្វើឱ្យ Laravel ដំណើរការការងារអូតូម៉ាទិកដូចជា៖ ការ Cancel Unpaid Orders, ការគណនា Daily Sales Summary, និងការ Clear Expired Tokens។

2. **Queue Worker:**
   * Container `worker` ក្នុង `docker-compose.prod.yml` បានរៀបចំស្រេចដើម្បីដំណើរការ `php artisan queue:work redis --sleep=3 --tries=3` ដោយស្វ័យប្រវត្តិនូវរាល់ Emails, Notifications, និង Export Jobs។

---

### ជំហានទី ៩៖ របៀប Update Code ថ្មីដោយមិនបាច់បិទ Website (Zero-Downtime Deploy)

រាល់ពេលដែលអ្នកបាន Push កូដថ្មីឡើង GitHub រួចរាល់ អ្នកគ្រាន់តែ Login ចូល Server រួចដំណើរការ Script នេះ៖

```bash
cd /var/www/enterprise-pos

# 1. ទាញយកកូដថ្មីពី GitHub
git pull origin develop

# 2. Rebuild Container images ថ្មី
docker compose -f docker-compose.prod.yml build

# 3. Restart Container ដោយមិនបិទប្រព័ន្ធ (Zero Downtime)
docker compose -f docker-compose.prod.yml up -d --no-deps

# 4. Run database migrations និង Refresh Cache
docker compose -f docker-compose.prod.yml exec backend php artisan migrate --force
docker compose -f docker-compose.prod.yml exec backend php artisan optimize:clear
docker compose -f docker-compose.prod.yml exec backend php artisan optimize
```

---

### ជំហានទី ១០៖ ប្រព័ន្ធ Backup Database ដោយស្វ័យប្រវត្តិ

បង្កើត Script សម្រាប់ Backup Database រៀងរាល់យប់ម៉ោង ១២ អធ្រាត្រ៖

1. បង្កើត file `/var/www/enterprise-pos/scripts/backup-db.sh`:
   ```bash
   mkdir -p /var/www/enterprise-pos/backups
   cat << 'EOF' > /var/www/enterprise-pos/scripts/backup-db.sh
   #!/bin/bash
   BACKUP_DIR="/var/www/enterprise-pos/backups"
   DATE=$(date +"%Y-%m-%d_%H-%M-%S")
   FILENAME="$BACKUP_DIR/db_backup_$DATE.sql.gz"

   docker compose -f /var/www/enterprise-pos/docker-compose.prod.yml exec -T postgres pg_dump -U pos_admin enterprise_pos_prod | gzip > $FILENAME

   # លុប Backup ចាស់ៗដែលលើសពី ៣០ ថ្ងៃ
   find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -delete
   echo "Backup completed: $FILENAME"
   EOF

   chmod +x /var/www/enterprise-pos/scripts/backup-db.sh
   ```

2. ដាក់ក្នុង Cron Job (`crontab -e`):
   ```bash
   0 0 * * * /var/www/enterprise-pos/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1
   ```

---

# ផ្នែកទី ៥៖ មគ្គុទ្ទេសក៍ Hosting លើ Serverless Cloud (Vercel + Render / Railway)

ជម្រើសនេះគឺសម្រាប់អ្នកដែលចង់ប្រើ Platform-as-a-Service (PaaS) ដោយមិនចង់គ្រប់គ្រង Linux VPS Server ដោយខ្លួនឯង។

---

### ៥.១. ការ Deploy Customer Website លើ Vercel

1. ចូលទៅកាន់គេហទំព័រ [Vercel](https://vercel.com) រួចចុច **Add New...** → **Project**។
2. ជ្រើសរើស GitHub Repository `Project-Enterprise-E-Commerce-POS-System`។
3. កំណត់ Settings៖
   * **Project Name**: `nextech-customer-store`
   * **Framework Preset**: `Vite`
   * **Root Directory**: ចុច Edit រួចជ្រើសរើស folder `customer-website`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. **Environment Variables**:
   * `VITE_API_BACKEND_URL`: `https://your-api.onrender.com` (ឬ API Domain របស់អ្នក)
   * `VITE_STORE_API_URL`: `https://your-api.onrender.com/api/v1/store`
   * `VITE_SITE_URL`: `https://www.yourdomain.com`
5. ចុច **Deploy**។
6. បន្ទាប់ពី Deploy ចប់ ចូលទៅកាន់ **Settings** → **Domains** → បន្ថែម `www.yourdomain.com` និង `yourdomain.com` រួចកំណត់ CNAME ក្នុង DNS តាមការណែនាំរបស់ Vercel។

---

### ៥.២. ការ Deploy Admin Dashboard & POS លើ Vercel

1. ក្នុង Vercel ចុច **Add New...** → **Project** → ជ្រើសរើស Repo ដដែល។
2. កំណត់ Settings៖
   * **Project Name**: `nextech-admin-pos`
   * **Framework Preset**: `Vite`
   * **Root Directory**: `admin-dashboard`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. **Environment Variables**:
   * `VITE_API_BACKEND_URL`: `https://your-api.onrender.com`
   * `VITE_API_URL`: `https://your-api.onrender.com/api/v1`
4. ចុច **Deploy**។
5. ចូលទៅកាន់ **Settings** → **Domains** → បន្ថែម Subdomain `admin.yourdomain.com`។

---

### ៥.៣. ការ Deploy Laravel Backend + PostgreSQL + Redis លើ Render / Railway

1. **បង្កើត PostgreSQL Database (លើ Render.com ឬ Supabase/Neon):**
   * ចូល Render.com → ចុច **New** → **PostgreSQL**។
   * កំណត់ Database Name: `enterprise_pos`។
   * ចម្លង `Internal Database URL` សម្រាប់ប្រើប្រាស់។
2. **បង្កើត Redis Instance (លើ Render.com ឬ Upstash Redis):**
   * ចុច **New** → **Redis** → ចម្លង `Internal Redis URL`។
3. **បង្កើត Web Service សម្រាប់ Laravel Backend:**
   * ចុច **New** → **Web Service** → ជ្រើសរើស GitHub Repo។
   * **Root Directory**: `backend`
   * **Environment**: `Docker` (Render នឹងរកឃើញ `backend/docker/Dockerfile.prod` ដោយស្វ័យប្រវត្តិ)
   * **Environment Variables**:
     ```env
     APP_NAME="NexTech Enterprise"
     APP_ENV=production
     APP_KEY=base64:YOUR_GENERATED_APP_KEY
     APP_DEBUG=false
     APP_URL=https://api.yourdomain.com
     DB_CONNECTION=pgsql
     DATABASE_URL=postgresql://user:password@hostname:5432/dbname
     REDIS_URL=redis://default:password@hostname:6379
     CACHE_STORE=redis
     QUEUE_CONNECTION=redis
     SESSION_DRIVER=redis
     FRONTEND_URL=https://www.yourdomain.com
     ADMIN_URL=https://admin.yourdomain.com
     SANCTUM_STATEFUL_DOMAINS=admin.yourdomain.com,www.yourdomain.com,yourdomain.com
     SESSION_DOMAIN=.yourdomain.com
     ```
4. **Run Database Migration លើ Render:**
   * ចូលទៅកាន់ Web Service ក្នុង Render Dashboard → ចុចផ្ទាំង **Shell** → វាយ command:
     ```bash
     php artisan migrate --force
     php artisan db:seed --force
     php artisan storage:link
     ```
5. **ភ្ជាប់ Custom Domain:** ចូលទៅ **Settings** → **Custom Domains** → បន្ថែម `api.yourdomain.com`។

---

# ផ្នែកទី ៦៖ បញ្ហាដែលជួបញឹកញាប់ និងវិធីដោះស្រាយ (Troubleshooting & FAQs)

### ១. បញ្ហា CORS Error (`Access-Control-Allow-Origin`)
* **មូលហេតុ:** Frontend ផ្ញើ Request ពី Domain ផ្សេងដែលមិនទាន់បានចុះឈ្មោះក្នុង Backend CORS Config។
* **ដំណោះស្រាយ:** បើក file `backend/config/cors.php` ឬ `backend/.env.production` រួចពិនិត្យមើល `FRONTEND_URL` និង `ADMIN_URL` ថាបានដាក់ Domain ត្រឹមត្រូវ ឧ. `https://www.yourdomain.com,https://admin.yourdomain.com`។

### ២. បញ្ហា Error 500 (Internal Server Error)
* **មូលហេតុ:** បាត់បង់ `APP_KEY` ឬ Permissions លើ folder `storage/` និង `bootstrap/cache/` មិនត្រឹមត្រូវ។
* **ដំណោះស្រាយ:**
  ```bash
  docker compose exec backend php artisan key:generate --force
  docker compose exec backend chmod -R 775 storage bootstrap/cache
  docker compose exec backend chown -R www-data:www-data storage bootstrap/cache
  ```

### ៣. បញ្ហា Refresh Page លើ Frontend ហើយចេញ Error 404 (SPA Routing Issue)
* **មូលហេតុ:** Nginx ឬ Web Server មិនបានបញ្ជូនផ្លូវ Route ទៅកាន់ `index.html`។
* **ដំណោះស្រាយ:** នៅក្នុង Nginx Config ត្រូវតែមាន `try_files $uri $uri/ /index.html;` (ដែលយើងបានរៀបចំរួចរាល់នៅក្នុង `docker-compose.prod.yml` និង `vercel.json`)។

### ៤. បញ្ហា Upload រូបភាពទំនិញធំៗមិនចូល (`413 Request Entity Too Large`)
* **ដំណោះស្រាយ:** នៅក្នុង Nginx Gateway Config កំណត់ `client_max_body_size 64M;` និងក្នុង `php.ini` កំណត់ `upload_max_filesize = 64M` និង `post_max_size = 64M`។

---

## 🎯 សេចក្ដីសន្និដ្ឋាន (Conclusion)

ឯកសារនេះផ្ដល់នូវការណែនាំគ្រប់ជ្រុងជ្រោយបំផុតតាំងពីកម្រិត **Architecture, Codebase Audit, Security Hardening, Docker Compose Setup, Database Optimizations, SSL Encryption, រហូតដល់ Zero-Downtime Deployment និង Backup Procedures**។ គ្រប់ Developer ទាំងអស់អាចធ្វើតាមការណែនាំនេះមួយជំហានម្តងៗដើម្បីដាក់ឱ្យដំណើរការប្រព័ន្ធបានយ៉ាងរលូន ១០០% ដោយគ្មានបញ្ហារាំងស្ទះឡើយ!
