export interface ArchitectureLayer {
  id: string;
  number: number;
  name: string;
  nameKh: string;
  color: string;
  technologies: string[];
  description: string;
  descriptionKh: string;
  components: {
    name: string;
    role: string;
    roleKh: string;
    details: string;
  }[];
}

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'layer-1-clients',
    number: 1,
    name: 'Client Applications & User Interfaces',
    nameKh: 'ស្រទាប់កម្មវិធីអ្នកប្រើប្រាស់ (Client Applications Layer)',
    color: '#0E8CEB',
    technologies: ['React 19', 'Vite 8', 'TypeScript', 'TailwindCSS', 'Ant Design', 'Flutter 3.2', 'Riverpod'],
    description: 'Multiple frontends tailored to specific user roles: Single Page App (SPA) Admin Dashboard for executives and store managers, SEO-optimized responsive Customer Website for online shoppers, and high-performance Flutter Mobile App for on-the-go management and mobile POS terminal.',
    descriptionKh: 'ផ្ទាំងកម្មវិធី Frontend ចំនួន ៣ ដាច់ដោយឡែកពីគ្នា សម្រាប់អ្នកប្រើប្រាស់ផ្សេងៗគ្នា៖ Admin Dashboard សម្រាប់ថ្នាក់ដឹកនាំ និងអ្នកគ្រប់គ្រងសាខា, Customer Storefront សម្រាប់អតិថិជនទិញទំនិញអនឡាញ និង Flutter Mobile App សម្រាប់បុគ្គលិក និងទូរស័ព្ទគិតលុយចល័ត។',
    components: [
      { name: 'Admin Dashboard (React SPA)', role: 'Multi-branch enterprise administration & POS terminal', roleKh: 'ផ្ទាំងគ្រប់គ្រងសាខា ការលក់ កាតាឡុក ស្តុក និងបុគ្គលិក', details: '258 page components, Ant Design UI, Zustand client state, ZXing barcode scanner' },
      { name: 'Customer Storefront (React SSR/SPA)', role: 'High-converting online e-commerce shop', roleKh: 'គេហទំព័រទិញទំនិញអនឡាញ កន្ត្រកទំនិញ និងទូទាត់ប្រាក់', details: 'Tailwind styling, dynamic SEO meta tags, Cart & Wishlist persistence, KHQR checkout' },
      { name: 'Mobile App (Flutter Native)', role: 'Cross-platform iOS/Android terminal & staff portal', roleKh: 'កម្មវិធីទូរស័ព្ទដៃសម្រាប់បុគ្គលិកស្កេនវត្តមាន និងគិតលុយ', details: 'Riverpod state, Dio HTTP client, Hive local offline cache, Biometric local auth' }
    ]
  },
  {
    id: 'layer-2-gateway',
    number: 2,
    name: 'API Gateway & Routing Layer',
    nameKh: 'ស្រទាប់បញ្ជូន និងត្រួតពិនិត្យផ្លូវ API (API Gateway & Routing)',
    color: '#6366F1',
    technologies: ['Laravel 12 Routing', 'CORS Middleware', 'Throttle Rate Limiter', 'Locale Detector'],
    description: 'Entry gateway handling all incoming HTTP/HTTPS traffic. Enforces IP rate limiting, tenant sub-domain resolution, cross-origin resource sharing (CORS), and multi-language header parsing.',
    descriptionKh: 'ច្រកទ្វារកណ្តាលទទួលរាល់សំណើ HTTP/HTTPS ទាំងអស់ ការពារការវាយប្រហារដោយ Rate Limiter, គ្រប់គ្រង CORS និងកំណត់ភាសាតាម Header សំណើ។',
    components: [
      { name: 'Rate Limiter (60 req/min)', role: 'Protects backend against brute force & DDoS attacks', roleKh: 'ការពារម៉ាស៊ីនបម្រើពីការ Spam និង DDoS', details: 'Custom rate limits for login, checkout, and public search' },
      { name: 'CORS & Security Headers', role: 'Enforces cross-origin policies and CSP security', roleKh: 'គ្រប់គ្រងសុវត្ថិភាព Domain ឆ្លងកាត់', details: 'Allows authorized frontend origins with strict credential handling' },
      { name: 'Localization Middleware', role: 'Sets application locale from Accept-Language header', roleKh: 'កំណត់ភាសាស្វ័យប្រវត្តិតាមការស្នើសុំ', details: 'Supports KM, EN, TH, VI, ZH fallback configurations' }
    ]
  },
  {
    id: 'layer-3-security',
    number: 3,
    name: 'Security, Authentication & RBAC',
    nameKh: 'ស្រទាប់សុវត្ថិភាព និងការផ្ទៀងផ្ទាត់សិទ្ធិ (Auth & RBAC)',
    color: '#8B5CF6',
    technologies: ['Firebase PHP-JWT', 'Laravel Sanctum', 'Spatie Permission', 'Bcrypt / Argon2'],
    description: 'Dual-token authentication mechanism utilizing short-lived Access Tokens (15 min) and rotating Refresh Tokens stored in DB. Enforces multi-tenant isolation and 80+ granular Spatie permission nodes.',
    descriptionKh: 'ប្រព័ន្ធផ្ទៀងផ្ទាត់អត្តសញ្ញាណកម្រិតខ្ពស់ Dual Token (Access Token ១៥ នាទី + Refresh Token ក្នុង DB) និងប្រព័ន្ធគ្រប់គ្រងសិទ្ធិ Spatie RBAC ជាង ៨០ មុខងារ។',
    components: [
      { name: 'JWT & Sanctum Engine', role: 'Generates and verifies cryptographic signatures', roleKh: 'បង្កើត និងផ្ទៀងផ្ទាត់ហត្ថលេខា Token', details: 'Payload includes user ID, tenant company_id, branch_id, and role claims' },
      { name: 'Spatie RBAC Policy Layer', role: 'Dynamic permission validation on every controller action', roleKh: 'ត្រួតពិនិត្យសិទ្ធិមុនពេលឱ្យ Controller ដំណើរការ', details: '80+ permission nodes with Role inheritance (Super Admin, Admin, Manager, Cashier, Warehouse)' },
      { name: 'Tenant Scoping Traits', role: 'Injects global where company_id = ? scope to Eloquent', roleKh: 'ការពារមិនឱ្យលេចធ្លាយទិន្នន័យឆ្លងក្រុមហ៊ុន', details: 'Prevents horizontal data leaks between tenant organizations' }
    ]
  },
  {
    id: 'layer-4-services',
    number: 4,
    name: 'Business Logic & Service Layer',
    nameKh: 'ស្រទាប់តក្កវិជ្ជាអាជីវកម្ម (Service & Business Logic Layer)',
    color: '#EC4899',
    technologies: ['PHP 8.2 Classes', 'Service Pattern', 'Form Request Validation', 'Domain DTOs'],
    description: 'Decoupled domain services encapsulating complex business logic: POS atomic checkout, Inventory multi-warehouse balance deduction, Purchase Order reconciliation, Attendance QR verification, and Payroll math.',
    descriptionKh: 'បណ្តុំ Service ឯករាជ្យដែលផ្ទុកតក្កវិជ្ជាស្នូលនៃអាជីវកម្ម៖ ការគិតលុយ POS, ការកាត់ស្តុកឆ្លងឃ្លាំង, ការទទួលទំនិញទិញចូល, ការផ្ទៀងផ្ទាត់វត្តមាន និងការគណនាប្រាក់ខែ។',
    components: [
      { name: 'POSService & SaleService', role: 'Executes atomic checkout, tax, discount & receipt', roleKh: 'ដំណើរការគិតលុយ គណនាពន្ធ បញ្ចុះតម្លៃ និងវិក្កយបត្រ', details: 'Manages sales, sale items, payments, and cashier drawer adjustments' },
      { name: 'InventoryService', role: 'Controls multi-warehouse stock movements and transfers', roleKh: 'គ្រប់គ្រងចលនាស្តុក និងការផ្ទេរទំនិញឆ្លងឃ្លាំង', details: 'Enforces non-negative stock and writes immutable inventory movement ledgers' },
      { name: 'AttendanceService & PayrollService', role: 'Validates QR geofencing and calculates net salary', roleKh: 'ផ្ទៀងផ្ទាត់ GPS វត្តមាន និងគណនាប្រាក់បៀវត្សរ៍', details: 'Computes late penalties, OT hours, allowances, and tax withholdings' }
    ]
  },
  {
    id: 'layer-5-persistence',
    number: 5,
    name: 'Data Persistence & Caching Layer',
    nameKh: 'ស្រទាប់រក្សាទុកទិន្នន័យ និង Cache (Persistence & Cache Layer)',
    color: '#10B981',
    technologies: ['PostgreSQL 18', 'Redis 7', 'Eloquent ORM', 'DB Transactions'],
    description: 'ACID-compliant relational database with 99 tables, foreign key constraints, and row-level locking (lockForUpdate). Ultra-fast in-memory Redis cluster for session storage, query caching, and lock arbitration.',
    descriptionKh: 'ប្រព័ន្ធទិន្នន័យ Relational Database ចំនួន ៩៩ តារាង មាន Foreign Key ច្បាស់លាស់ និងការពារការដណ្តើមទិន្នន័យដោយ Row-Level Locking ព្រមទាំង Redis Cache ល្បឿនលឿន។',
    components: [
      { name: 'Relational Database (99 Tables)', role: 'Source of truth for all business records', roleKh: 'កន្លែងផ្ទុកទិន្នន័យស្នូលទាំងអស់របស់សហគ្រាស', details: '36 migrations, strict indexing, soft deletes on all transactional tables' },
      { name: 'Redis Cache & Lock Broker', role: 'Microsecond query response and concurrency mutex', roleKh: 'ផ្ទុក Cache និងចាក់សោរការពារការទិញជាន់គ្នា', details: 'Stores dashboard stats, product catalog cache, and stock mutex locks' },
      { name: 'Database Image Storage (Base64/Binary)', role: 'Embedded zero-config product & logo image storage', roleKh: 'ផ្ទុករូបភាពក្នុង Database សម្រាប់ Dev/Demo', details: 'DatabaseImageSeeder embeds 50+ real product photos directly in DB' }
    ]
  },
  {
    id: 'layer-6-async',
    number: 6,
    name: 'Async Jobs, Media & Observability',
    nameKh: 'ស្រទាប់ការងារ Async មេឌៀ និងការតាមដាន (Async, Media & DevOps)',
    color: '#F59E0B',
    technologies: ['Laravel Queue Worker', 'MinIO / S3 Storage', 'Spatie MediaLibrary', 'Laravel Telescope'],
    description: 'Background worker queues executing asynchronous jobs: PDF generation, bulk email/SMS sending, Telegram webhook alerts, WebP image transformations, and real-time query telemetry with Telescope.',
    descriptionKh: 'ប្រព័ន្ធដំណើរការការងារនៅផ្ទៃខាងក្រោយ (Background Queue)៖ បង្កើតឯកសារ PDF, ផ្ញើសារ SMS/Email, ផ្ញើដំណឹង Telegram Bot, បម្លែងរូបភាព WebP និងតាមដានបញ្ហាប្រព័ន្ធដោយ Telescope។',
    components: [
      { name: 'Queue Worker (Redis / Database)', role: 'Executes heavy background tasks asynchronously', roleKh: 'ដំណើរការការងារធ្ងន់ៗដោយមិនឱ្យ Client រង់ចាំ', details: 'Processes PDF export, bulk salary calculations, and email deliveries' },
      { name: 'MinIO / S3 Object Storage', role: 'Scalable cloud object storage for media files', roleKh: 'ផ្ទុកឯកសាររូបភាព និងវីដេអូលើ Cloud Storage', details: 'Spatie MediaLibrary integration with responsive WebP variants' },
      { name: 'Laravel Telescope & ActivityLog', role: 'Real-time telemetry and compliance audit logging', roleKh: 'តាមដានដំណើរការប្រព័ន្ធ និងកត់ត្រាសវនកម្ម', details: 'Logs HTTP requests, slow DB queries, exceptions, and user actions' }
    ]
  }
];

export const END_TO_END_FLOW = [
  { step: 1, title: 'Customer Places Web Order', titleKh: 'អតិថិជនបញ្ជាទិញទំនិញលើ Website', desc: 'Customer adds items to cart on Customer Storefront and initiates checkout.', layer: 'Client' },
  { step: 2, title: 'Instant KHQR Dynamic Code Generated', titleKh: 'បង្កើត QR Code បាគង (KHQR) ស្វ័យប្រវត្តិ', desc: 'Backend generates Bakong compliant dynamic QR with exact USD/KHR total.', layer: 'Payment' },
  { step: 3, title: 'Payment Webhook Confirmed', titleKh: 'ធនាគារបញ្ជាក់ការទូទាត់ប្រាក់ជោគជ័យ', desc: 'Payment Gateway webhook confirms transaction; order status becomes "Processing".', layer: 'Security' },
  { step: 4, title: 'Atomic Inventory Deduction', titleKh: 'កាត់ស្តុកឃ្លាំងក្នុង DB Transaction', desc: 'InventoryService decrements warehouse stock and creates immutable inventory movement log.', layer: 'Business Logic' },
  { step: 5, title: 'Telegram & Dashboard Notification', titleKh: 'ផ្ញើដំណឹងទៅកាន់ Telegram និង Admin', desc: 'Telegram Bot alerts store manager while WebSocket pushes real-time badge update to Admin Dashboard.', layer: 'Async / Queue' },
  { step: 6, title: 'Warehouse Fulfillment & Dispatch', titleKh: 'ឃ្លាំងរៀបចំវេចខ្ចប់ និងប្រគល់ឱ្យអ្នកដឹក', desc: 'Staff prints packing slip, attaches shipping barcode, and marks order as "Shipped".', layer: 'Operations' },
  { step: 7, title: 'Customer Receives Package', titleKh: 'អតិថិជនទទួលបានទំនិញ និងតាមដានជោគជ័យ', desc: 'Courier delivers parcel; order is marked "Completed" and invoice PDF is archived.', layer: 'Customer' }
];
