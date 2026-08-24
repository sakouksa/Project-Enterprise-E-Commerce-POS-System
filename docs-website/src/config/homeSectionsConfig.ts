/**
 * Home Page Section Ordering & Visibility Configuration
 * Modular and flexible system matching master prompt specifications
 */

export interface HomeSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export const HOME_SECTIONS_CONFIG: HomeSectionConfig[] = [
  { id: 'hero', name: 'Hero Banner', enabled: true, order: 1 },
  { id: 'search', name: 'Search-First Bar', enabled: true, order: 2 },
  { id: 'quick-start', name: 'Quick Start Roles', enabled: true, order: 3 },
  { id: 'platforms', name: 'Platform Overview', enabled: true, order: 4 },
  { id: 'stats', name: 'Project Statistics', enabled: true, order: 5 },
  { id: 'system-overview', name: 'System Overview & Architecture', enabled: true, order: 6 },
  { id: 'modules', name: 'Module Explorer (12)', enabled: true, order: 7 },
  { id: 'business-flows', name: 'Interactive Business Workflows', enabled: true, order: 8 },
  { id: 'learning', name: 'Learning Center', enabled: true, order: 9 },
  { id: 'tutorials', name: 'Featured Video Tutorials', enabled: true, order: 10 },
  { id: 'api-preview', name: 'API Documentation Preview', enabled: true, order: 11 },
  { id: 'database-preview', name: 'Database Schema Preview', enabled: true, order: 12 },
  { id: 'security', name: 'Enterprise Security Architecture', enabled: true, order: 13 },
  { id: 'categories', name: 'Documentation Portals', enabled: true, order: 14 },
  { id: 'faq', name: 'Role-Based FAQs', enabled: true, order: 15 },
];
