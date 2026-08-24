/**
 * Global Enterprise Docs Configuration & Constants
 * Matching admin-dashboard standards
 */

export const APP_CONFIG = {
  appName: 'Enterprise E-Commerce + POS System',
  appNameKh: 'ប្រព័ន្ធសហគ្រាស E-Commerce + POS',
  version: 'v1.1.0',
  releaseDate: 'August 2026',
  author: 'Enterprise Architecture Team',
  backendUrl: 'http://localhost:8000',
  adminUrl: 'http://localhost:5173',
  customerUrl: 'http://localhost:5174',
  docsUrl: 'http://localhost:5175',
  githubUrl: 'https://github.com/sakouksa/Project-Enterprise-E-Commerce-POS-System',
  apiPrefix: '/api/v1',
  defaultLanguage: 'km' as const,
  supportedLanguages: ['km', 'en', 'th', 'vi', 'zh'] as const,
} as const;

export const PORTS_CONFIG = [
  { name: 'Laravel REST Backend', port: 8000, tech: 'PHP 8.2 / Laravel 12', url: 'http://localhost:8000', status: 'live' },
  { name: 'Admin Dashboard', port: 5173, tech: 'React 19 / Vite 8', url: 'http://localhost:5173', status: 'live' },
  { name: 'Customer Storefront', port: 5174, tech: 'React 19 / Vite 8', url: 'http://localhost:5174', status: 'live' },
  { name: 'Documentation Portal', port: 5175, tech: 'React 19 / Vite 6', url: 'http://localhost:5175', status: 'live' },
  { name: 'PostgreSQL Database', port: 5432, tech: 'PostgreSQL 18 Alpine', url: 'localhost:5432', status: 'live' },
  { name: 'Redis Cache & Lock', port: 6379, tech: 'Redis 7 Alpine', url: 'localhost:6379', status: 'live' },
] as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
