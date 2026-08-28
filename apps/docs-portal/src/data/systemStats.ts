export interface SystemStats {
  databaseTablesCount: number;
  eloquentModelsCount: number;
  apiEndpointsCount: number;
  adminPagesCount: number;
  customerPagesCount: number;
  mobileFilesCount: number;
  migrationsCount: number;
  seedersCount: number;
  languagesCount: number;
  rolesCount: number;
  permissionsCount: number;
  reportsCount: number;
  modulesCount: number;
}

export const REAL_SYSTEM_STATS: SystemStats = {
  databaseTablesCount: 99,
  eloquentModelsCount: 89,
  apiEndpointsCount: 759,
  adminPagesCount: 258,
  customerPagesCount: 28,
  mobileFilesCount: 69,
  migrationsCount: 36,
  seedersCount: 19,
  languagesCount: 5,
  rolesCount: 6,
  permissionsCount: 84,
  reportsCount: 48,
  modulesCount: 32,
};

export const TECH_STACK_DATA = {
  backend: [
    { name: 'Laravel Framework', version: '12.x', purpose: 'Core Enterprise REST API & Business Service Engine', tag: 'Core Backend' },
    { name: 'PHP', version: '8.2+', purpose: 'Strict typed server-side execution runtime', tag: 'Language' },
    { name: 'Laravel Sanctum + JWT', version: '4.x / 6.x', purpose: 'Dual token authentication (Access Token + Refresh Token)', tag: 'Security' },
    { name: 'Spatie Permission', version: '6.x', purpose: 'Role-Based Access Control (RBAC) with dynamic guard check', tag: 'Security' },
    { name: 'Spatie MediaLibrary', version: '11.x', purpose: 'Unified multi-disk image/media processing & storage', tag: 'Storage' },
    { name: 'Spatie ActivityLog', version: '4.x', purpose: 'Automated audit trail and compliance tracking', tag: 'Auditing' },
    { name: 'Laravel DomPDF', version: '3.x', purpose: 'Server-side invoice, receipt & reports PDF generation', tag: 'Export' },
    { name: 'Maatwebsite Excel', version: '3.1.x', purpose: 'Fast Excel/CSV data import and export streaming', tag: 'Export' },
    { name: 'Intervention Image', version: '3.x', purpose: 'WebP image optimization, thumbnailing & watermark', tag: 'Media' },
    { name: 'Laravel Telescope', version: '5.x', purpose: 'Real-time telemetry, query inspector & request monitoring', tag: 'DevOps' },
  ],
  adminDashboard: [
    { name: 'React', version: '19.2.x', purpose: 'Modern component-driven administrative user interface', tag: 'Frontend' },
    { name: 'Vite', version: '8.1.x', purpose: 'Ultra-fast HMR and optimized production bundler', tag: 'Build' },
    { name: 'TypeScript', version: '6.0.x', purpose: 'Complete end-to-end type safety & code integrity', tag: 'Language' },
    { name: 'Ant Design', version: '6.5.x', purpose: 'Enterprise design system, data tables & modal dialogs', tag: 'UI Library' },
    { name: 'Tailwind CSS', version: '3.4.x', purpose: 'Utility-first modern styling & custom responsive layouts', tag: 'Styling' },
    { name: 'TanStack React Query', version: '5.101.x', purpose: 'Server-state caching, optimistic updates & auto-refetch', tag: 'State' },
    { name: 'Zustand', version: '5.0.x', purpose: 'Lightweight client state for auth, cart, POS and theme', tag: 'State' },
    { name: 'Framer Motion', version: '12.4.x', purpose: 'Smooth micro-animations and route transitions', tag: 'Animation' },
    { name: 'ZXing & HTML5-QRCode', version: '0.23.x', purpose: 'High-speed camera & laser barcode/QR scanner integration', tag: 'Hardware' },
    { name: 'i18next', version: '26.3.x', purpose: 'Dynamic 5-language localization (KM, EN, TH, VI, ZH)', tag: 'Localization' },
  ],
  customerWebsite: [
    { name: 'React', version: '19.2.x', purpose: 'High-converting responsive storefront UI', tag: 'Frontend' },
    { name: 'Vite', version: '8.1.x', purpose: 'Modern bundle optimization & fast client rendering', tag: 'Build' },
    { name: 'Tailwind CSS', version: '3.4.x', purpose: 'Custom e-commerce UI design system', tag: 'Styling' },
    { name: 'TanStack React Query', version: '5.101.x', purpose: 'Storefront catalog & product search caching', tag: 'State' },
    { name: 'Zustand', version: '5.0.x', purpose: 'Persistent shopping cart, wishlist & auth session', tag: 'State' },
    { name: 'React Helmet Async', version: '2.0.x', purpose: 'Complete dynamic OpenGraph & SEO metadata injection', tag: 'SEO' },
    { name: 'i18next', version: '26.3.x', purpose: 'Multi-lingual customer storefront interface', tag: 'Localization' },
  ],
  mobileApp: [
    { name: 'Flutter SDK', version: '3.2.x', purpose: 'Cross-platform native mobile terminal (iOS & Android)', tag: 'Mobile Core' },
    { name: 'Dart', version: '3.2.x', purpose: 'AOT compiled fast mobile client logic', tag: 'Language' },
    { name: 'Flutter Riverpod', version: '2.5.x', purpose: 'Compile-safe dependency injection and reactive state', tag: 'State' },
    { name: 'Dio Client', version: '5.4.x', purpose: 'Resilient HTTP client with retry interceptors & auth refresh', tag: 'Network' },
    { name: 'Hive Flutter', version: '1.1.x', purpose: 'Ultra-fast NoSQL local cache for offline POS & sync', tag: 'Offline DB' },
    { name: 'Local Auth', version: '2.1.x', purpose: 'Biometric fingerprint & Face ID terminal unlocking', tag: 'Security' },
    { name: 'Mobile Scanner', version: '5.1.x', purpose: 'Real-time hardware barcode & QR product checkout', tag: 'Hardware' },
    { name: 'FL Chart', version: '0.68.x', purpose: 'Interactive sales performance & inventory chart widgets', tag: 'Charts' },
    { name: 'Printing & Share Plus', version: '5.13.x', purpose: 'Direct Bluetooth/WiFi thermal ESC/POS receipt printing', tag: 'Hardware' },
  ],
  infraDatabase: [
    { name: 'PostgreSQL', version: '18+', purpose: 'ACID-compliant relational database with foreign key constraints', tag: 'Database' },
    { name: 'Redis', version: '7.x', purpose: 'High-speed in-memory cache, session store & queue broker', tag: 'Cache / Queue' },
    { name: 'MinIO / S3 Storage', version: 'Latest', purpose: 'S3-compatible distributed object storage for media files', tag: 'Storage' },
    { name: 'Docker & Compose', version: 'v2', purpose: 'Containerized multi-service orchestration (Prod / Staging)', tag: 'DevOps' },
    { name: 'Nginx Reverse Proxy', version: '1.25+', purpose: 'TLS/SSL termination, gzip/brotli compression, rate limiting', tag: 'Web Server' },
  ]
};
