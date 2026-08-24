# 📖 មគ្គុទ្ទេសក៍លម្អិត៖ ការកែលម្អប្រព័ន្ធ និងការរៀបចំ Hosting មួយជំហានម្តងៗ
# (Full System Changelog & Step-by-Step Hosting Guide)

---

# ផ្នែកទី ១៖ របាយការណ៍លម្អិតនៃការកែលម្អទាំងអស់ដែលបានធ្វើ (Full System Audit & Fixes Changelog)

ឯកសារនេះកត់ត្រាការងារបច្ចេកទេសទាំងអស់ដែលត្រូវបាន Audit, Refactor, Optimize និងដំឡើងលើ **Project-Enterprise-E-Commerce + POS-System**៖

---

## ១. ការធ្វើ Technical SEO Audit, Structured Data & Google Indexing
* **បញ្ហាចាស់ (Previous Issue):**
  * Website ដំណើរការជា Client-Side SPA ដោយគ្មាន XML Sitemap ពិតប្រាកដ ឬ robots.txt dynamic ចេញពី Database ឡើយ។
  * ស្លាក Meta Tags (Title, Description, OpenGraph) មិនមានភាពស៊ីសង្វាក់គ្នា និងបាត់បង់ Rich Snippets លើ Google Search។
* **ដំណោះស្រាយ និងការកែលម្អ (Fixes Implemented):**
  1. **បង្កើត Backend `SeoController.php`** ([`backend/app/Http/Controllers/Api/SeoController.php`](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/backend/app/Http/Controllers/Api/SeoController.php)):
     * បង្កើត Dynamic XML Sitemap (`/sitemap.xml`) ដែលទាញ Products, Categories, Brands, Blog posts ចេញពី PostgreSQL Database ដោយស្វ័យប្រវត្តិ ព្រមទាំងកំណត់ `lastmod`, `changefreq`, និង `priority` ត្រឹមត្រូវ។
     * បង្កើត Dynamic `/robots.txt` ដែលផ្ដល់សិទ្ធិឱ្យ Googlebot ចូល Crawl ទំព័រសាធារណៈ និង Disallow ទំព័រឯកជន (`/cart`, `/checkout`, `/account/`, `/auth/`) ព្រមទាំងភ្ជាប់ Sitemap URL ត្រឹមត្រូវ។
  2. **បង្កើតម៉ូឌុល SEO ស្ដង់ដារ `SEOHead.tsx`** ([`src/components/seo/SEOHead.tsx`](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/customer-website/src/components/seo/SEOHead.tsx)):
     * Canonical URL Normalization ដើម្បីការពារ Duplicate Content penalty ពី Google។
     * OpenGraph & Twitter Cards ជាមួយ Locale Mapping (`km_KH`, `en_US`, `th_TH`, `vi_VN`, `zh_CN`)។
     * **7 JSON-LD Structured Data Schemas:**
       * `Product` Schema (ឈ្មោះ, តម្លៃ, រូបិយប័ណ្ណ, Stock Status, Brand, Rating)
       * `BreadcrumbList` Schema
       * `FAQPage` Schema (សម្រាប់ទំព័រ FAQs)
       * `Article` Schema (សម្រាប់ Blog Posts)
       * `WebSite` Schema (ជាមួយ Sitelinks SearchBox Action)
       * `Organization` Schema (ឈ្មោះក្រុមហ៊ុន, Logo, Hotlines, អាសយដ្ឋាន)
       * `LocalBusiness` / `Store` Schema (Geo coordinates, ម៉ោងបើកធ្វើការ)

---

## ២. ការធ្វើ Global DRY Refactor & Component Standardization
* **បញ្ហាចាស់ (Previous Issue):**
  * មាន Product Card ស្ទួនគ្នា (`components/product/ProductCard.tsx` និង `components/storefront/CustomerProductCard.tsx`)។
  * មាន Section ចំនួន ៨ ដែលជាកូដ Copy-Paste ដូចគ្នា ៩៩% (Featured, Arrivals, Deals, Sellers, etc.)។
* **ដំណោះស្រាយ និងការកែលម្អ (Fixes Implemented):**
  1. **Master `ProductCard.tsx`** ([`src/components/ecommerce/ProductCard.tsx`](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/customer-website/src/components/ecommerce/ProductCard.tsx)):
     * បង្រួបបង្រួមជា Master Component តែមួយគត់ដែល Support 4 Variants (`default`, `compact`, `featured`, `horizontal` សម្រាប់ Table/List View)។
     * ភ្ជាប់ជាមួយ `<ProductPrice />`, `<RatingStars />`, `<WishlistButton />`, `<AddToCartButton />`, `<ImageWithFallback />` ដោយស្វ័យប្រវត្តិ។
  2. **Master `ProductSection.tsx`** ([`src/components/ecommerce/ProductSection.tsx`](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/customer-website/src/components/ecommerce/ProductSection.tsx)):
     * បង្រួញ Section ទាំង ៨ ឱ្យមកប្រើ Reusable Master Section Wrapper។
  3. **UI Design System Primitives (`src/components/ui/`)**:
     * `Button.tsx`, `Badge.tsx`, `Card.tsx`, `Input.tsx`, `Skeleton.tsx`, `Spinner.tsx`។
  4. **Domain Components (`src/components/ecommerce/`)**:
     * `ProductPrice.tsx`, `RatingStars.tsx`, `OrderStatusBadge.tsx`, `StockBadge.tsx`, `CategoryCard.tsx`, `BrandCard.tsx`, `CouponCard.tsx`។

---

## ៣. ស្ថាបត្យកម្ម Clean Architecture & Application Layer (`src/app/`)
* **បញ្ហាចាស់ (Previous Issue):**
  * `App.tsx` ផ្ទុកកូដ 172 បន្ទាត់លាយឡំ Router, QueryClient, Theme effect, Route Guards និង 30+ Lazy routes។
* **ដំណោះស្រាយ និងការកែលម្អ (Fixes Implemented):**
  * បង្កើត `src/app/providers/` (`QueryProvider.tsx`, `ThemeProvider.tsx`, `FaviconProvider.tsx`)។
  * បង្កើត `src/app/router/` (`AppRouter.tsx`, `RouteGuards.tsx`, `routes.tsx`)។
  * បង្កើត Custom Domain Hooks: `useWishlist.ts`, `useAddToCart.ts`, `useInfiniteProducts.ts`, `useSearch.ts`។
  * បង្កើត Centralized Query Keys: `src/constants/queryKeys.ts`។
  * បង្កើត API Services: `cartService.ts`, `wishlistService.ts`, `orderService.ts`, `productService.ts`។

---

## ៤. ការរៀបចំ Branded Logo & Multi-Format Favicon Suite
* **បញ្ហាចាស់ (Previous Issue):**
  * Browser Tab និង Google Search បង្ហាញ Default Vite Lightning Logo (ពណ៌ស្វាយ)។
* **ដំណោះស្រាយ និងការកែលម្អ (Fixes Implemented):**
  * បង្កើត Icon ផ្លូវការរបស់ **NexTech Enterprise** (ពណ៌ក្រហម Rounded Emblem) គ្រប់ទម្រង់៖
    * `public/favicon.svg` (High-definition Vector)
    * `public/favicon.ico` (Multi-size: 16x16, 32x32, 48x48, 64x64)
    * `public/favicon-48x48.png`, `favicon-32x32.png`, `favicon-16x16.png`
    * `public/apple-touch-icon.png` (180x180 សម្រាប់ iOS)
    * `public/android-chrome-192x192.png` & `512x512.png` (សម្រាប់ Android PWA)
    * `public/site.webmanifest` (PWA configuration)
    * `FaviconProvider.tsx` សម្រាប់ Dynamic update តាម Backend Admin Logo។

---

# ផ្នែកទី ២៖ មគ្គុទ្ទេសក៍ Hosting & Deployment មួយជំហានម្តងៗ (Step-by-Step Hosting Guide)

ប្រព័ន្ធនេះមានជម្រើស Hosting ចម្បងចំនួន ២ ដែលត្រូវបានណែនាំ៖
* **ជម្រើសទី ១ (អនុសាសន៍ខ្ពស់បំផុតសម្រាប់ Enterprise):** VPS / Dedicated Cloud Server (Ubuntu 24.04 LTS + Docker + Nginx + Let's Encrypt SSL)
* **ជម្រើសទី ២ (សម្រាប់ Serverless / Jamstack):** Vercel (Frontend SPA) + Render/Railway (Backend & Database)

---

## 🚀 ជម្រើសទី ១៖ ការដាក់ដំណើរការលើ VPS / Dedicated Server (Docker Compose)

### ជំហានទី ១៖ ការរៀបចំ Server & សុវត្ថិភាព (Server Hardening)

1. **ចូលទៅកាន់ Server តាមរយៈ SSH:**
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

2. **Update ប្រព័ន្ធប្រតិបត្តិការ Ubuntu:**
   ```bash
   apt update && apt upgrade -y
   apt install -y curl wget git ufw htop unzip software-properties-common
   ```

3. **កំណត់ Firewall (UFW) ការពារ Port សម្ងាត់:**
   ```bash
   # អនុញ្ញាតតែ Port ចាំបាច់
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP
   ufw allow 443/tcp   # HTTPS
   
   # បើកដំណើរការ Firewall
   ufw enable
   ufw status
   ```
   > [!IMPORTANT]
   > មិនត្រូវបើក Port `5432` (PostgreSQL) ឬ `6379` (Redis) ទៅកាន់ Public Internet ឡើយ។ Container ទាំងអស់ទាក់ទងគ្នាតាមរយៈ Docker Private Network ផ្ទៃក្នុង។

---

### ជំហានទី ២៖ ដំឡើង Docker Engine & Docker Compose

```bash
# ដំឡើង Docker ផ្លូវការ
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# ពិនិត្យមើល Version
docker --version
docker compose version
```

---

### ជំហានទី ៣៖ កំណត់ DNS Records នៅលើ Domain Provider (Cloudflare / Namecheap / GoDaddy)

បង្កើត **A Records** ចង្អុលទៅកាន់ Server IP របស់អ្នក៖

| Type | Name / Host | Target / Value | TTL | Note |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (ឬ `example.com`) | `YOUR_SERVER_IP` | Auto / 1 min | ទំព័រដើម Customer Website |
| **A** | `www` | `YOUR_SERVER_IP` | Auto / 1 min | Customer Website Subdomain |
| **A** | `admin` | `YOUR_SERVER_IP` | Auto / 1 min | Admin Dashboard & POS |
| **A** | `api` | `YOUR_SERVER_IP` | Auto / 1 min | Laravel REST API Backend |

---

### ជំហានទី ៤៖ Clone Source Code និងរៀបចំ `.env.production`

1. **Clone Git Repository មកកាន់ Server:**
   ```bash
   cd /var/www
   git clone https://github.com/sakouksa/Project-Enterprise-E-Commerce-POS-System.git enterprise-pos
   cd enterprise-pos
   git checkout develop
   ```

2. **បង្កើត និងកែប្រែ Environment Variables:**
   ```bash
   # Backend .env
   cp backend/.env.example backend/.env.production
   nano backend/.env.production
   ```

   **គំរូកំណត់ក្នុង `backend/.env.production`:**
   ```env
   APP_NAME="NexTech Enterprise"
   APP_ENV=production
   APP_KEY=base64:YOUR_GENERATED_APP_KEY
   APP_DEBUG=false
   APP_URL=https://api.example.com

   FRONTEND_URL=https://www.example.com
   ADMIN_URL=https://admin.example.com

   LOG_CHANNEL=daily
   LOG_LEVEL=error

   DB_CONNECTION=pgsql
   DB_HOST=postgres
   DB_PORT=5432
   DB_DATABASE=enterprise_pos_prod
   DB_USERNAME=pos_admin
   DB_PASSWORD=SuperStrongSecretPassword123!

   CACHE_STORE=redis
   QUEUE_CONNECTION=redis
   SESSION_DRIVER=redis
   REDIS_HOST=redis
   REDIS_PASSWORD=RedisSecretPassword456!
   REDIS_PORT=6379

   SANCTUM_STATEFUL_DOMAINS=admin.example.com,www.example.com,example.com
   SESSION_DOMAIN=.example.com
   ```

3. **រៀបចំ Environment សម្រាប់ Customer Website & Admin Dashboard:**
   ```bash
   # Customer Website
   cat << 'EOF' > customer-website/.env.production
   VITE_API_BACKEND_URL=https://api.example.com
   VITE_STORE_API_URL=https://api.example.com/api/v1/store
   VITE_SITE_URL=https://www.example.com
   EOF

   # Admin Dashboard
   cat << 'EOF' > admin-dashboard/.env.production
   VITE_API_BACKEND_URL=https://api.example.com
   VITE_API_URL=https://api.example.com/api/v1
   EOF
   ```

---

### ជំហានទី ៥៖ បង្កើត SSL/TLS Certificates ដោយឥតគិតថ្លៃ (Let's Encrypt Certbot)

```bash
apt install -y certbot

# ស្នើសុំ SSL សម្រាប់ Domains ទាំងអស់
certbot certonly --standalone -d example.com -d www.example.com -d admin.example.com -d api.example.com --non-interactive --agree-tos -m admin@example.com
```
* Certificates នឹងត្រូវរក្សាទុកក្នុង `/etc/letsencrypt/live/example.com/`។

---

### ជំហានទី ៦៖ Build និង Launch Production Containers តាម Docker

```bash
# Build Production Images (Optimized Multi-Stage Builds)
docker compose -f docker-compose.prod.yml build

# ចាប់ផ្ដើមដំណើរការ Containers ទាំងអស់ក្នុង Background
docker compose -f docker-compose.prod.yml up -d
```

---

### ជំហានទី ៧៖ Database Migration, Seeding & Optimization Commands

ដំណើរការ Commands ខាងក្រោមនៅក្នុង Backend Container៖

```bash
# 1. បង្កើត Tables ក្នុង PostgreSQL
docker compose -f docker-compose.prod.yml exec backend php artisan migrate --force

# 2. បញ្ចូល Initial Seed Data (Admin Account, Settings, Roles, Categories)
docker compose -f docker-compose.prod.yml exec backend php artisan db:seed --force

# 3. បង្កើត Symlink សម្រាប់ Public Image Storage
docker compose -f docker-compose.prod.yml exec backend php artisan storage:link

# 4. Cache Config, Routes, Views សម្រាប់ High Performance
docker compose -f docker-compose.prod.yml exec backend php artisan config:cache
docker compose -f docker-compose.prod.yml exec backend php artisan route:cache
docker compose -f docker-compose.prod.yml exec backend php artisan view:cache
docker compose -f docker-compose.prod.yml exec backend php artisan event:cache
```

---

### ជំហានទី ៨៖ រៀបចំ Cron Scheduler & Queue Workers

1. **ដំឡើង Laravel Task Scheduling (Cron):**
   ```bash
   crontab -e
   ```
   បន្ថែមបន្ទាត់នេះនៅចុងបញ្ចប់៖
   ```bash
   * * * * * cd /var/www/enterprise-pos && docker compose -f docker-compose.prod.yml exec -T backend php artisan schedule:run >> /dev/null 2>&1
   ```

2. **Background Queue Worker:**
   * Container `worker` នៅក្នុង `docker-compose.prod.yml` ដំណើរការ `php artisan queue:work redis --sleep=3 --tries=3` ដោយស្វ័យប្រវត្តិនូវរាល់ Email, Notifications, និង Export Tasks។

---

### ជំហានទី ៩៖ របៀប Update Code ថ្មីទៅកាន់ Server (Zero-Downtime Deploy)

រាល់ពេលអ្នក Push កូដថ្មីឡើង GitHub អ្នកគ្រាន់តែ run command នេះនៅលើ Server៖

```bash
cd /var/www/enterprise-pos
git pull origin develop

# Rebuild និង Restart ដោយរលូន
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d --no-deps

# Run Migrations & Clear Cache
docker compose -f docker-compose.prod.yml exec backend php artisan migrate --force
docker compose -f docker-compose.prod.yml exec backend php artisan optimize:clear
docker compose -f docker-compose.prod.yml exec backend php artisan optimize
```

---

## ☁️ ជម្រើសទី ២៖ ការដាក់ដំណើរការលើ Vercel (Frontends) + Render / Railway (Backend)

ប្រសិនបើអ្នកមិនចង់គ្រប់គ្រង Linux VPS ដោយខ្លួនឯង អ្នកអាចប្រើ Cloud Platforms ដូចខាងក្រោម៖

### ១. Deploy Customer Website លើ Vercel
1. ចូលទៅកាន់ [vercel.com](https://vercel.com) → ចុច **Add New Project** → ជ្រើសរើស GitHub Repo `Project-Enterprise-E-Commerce-POS-System`។
2. កំណត់ **Root Directory**: `customer-website`
3. កំណត់ **Framework Preset**: `Vite`
4. **Environment Variables**:
   * `VITE_API_BACKEND_URL`: `https://your-api.onrender.com`
   * `VITE_STORE_API_URL`: `https://your-api.onrender.com/api/v1/store`
   * `VITE_SITE_URL`: `https://www.yourdomain.com`
5. ចុច **Deploy**។
6. បន្ថែម Custom Domain ក្នុង Vercel Settings → Domains (`www.yourdomain.com`)។

### ២. Deploy Admin Dashboard លើ Vercel
1. ចុច **Add New Project** → ជ្រើសរើស Repo ដដែល។
2. កំណត់ **Root Directory**: `admin-dashboard`
3. **Environment Variables**:
   * `VITE_API_BACKEND_URL`: `https://your-api.onrender.com`
   * `VITE_API_URL`: `https://your-api.onrender.com/api/v1`
4. ចុច **Deploy** → បន្ថែម Custom Domain (`admin.yourdomain.com`)។

### ៣. Deploy Laravel Backend លើ Render.com ឬ Railway.app
1. បង្កើត **PostgreSQL Database** លើ Render/Railway → ចម្លង `Internal Database URL`។
2. បង្កើត **Redis Instance** លើ Render/Railway → ចម្លង `Internal Redis URL`។
3. បង្កើត **Web Service** សម្រាប់ Laravel Backend:
   * **Root Directory**: `backend`
   * **Environment**: `Docker` (ប្រើ [`backend/docker/Dockerfile.prod`](file:///Users/macbook/Workspace/projects/showcase/Project-Enterprise-E-Commerce-POS-System/backend/docker/Dockerfile.prod))
   * **Environment Variables**:
     * `APP_KEY`: បង្កើតពី local `php artisan key:generate --show`
     * `DB_CONNECTION`: `pgsql`
     * `DATABASE_URL`: `postgresql://user:pass@host/dbname`
     * `REDIS_URL`: `redis://default:pass@host:6379`
     * `FRONTEND_URL`: `https://www.yourdomain.com`
     * `ADMIN_URL`: `https://admin.yourdomain.com`
4. បន្ថែម Custom Domain ក្នុង Render Settings (`api.yourdomain.com`)។
