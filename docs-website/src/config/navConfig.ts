/**
 * Global Navigation Configuration
 * Standardized navigation definitions across the Documentation Platform
 */

import {
  Home,
  FileText,
  Layers,
  Network,
  Cpu,
  Workflow,
  Boxes,
  Shield,
  ShoppingBag,
  Smartphone,
  Code2,
  Database,
  Radio,
  KeyRound,
  FileBarChart,
  Video,
  AlertTriangle,
  HelpCircle,
  History,
  Activity,
  Info,
  Package,
  MonitorCheck,
  Truck,
  Clock,
  Banknote,
} from 'lucide-react';
import { Translations } from '../locales/translations';

export interface NavItem {
  path: string;
  labelKey: keyof Translations;
  icon: any;
  badge?: string;
}

export interface NavSection {
  titleKey: keyof Translations;
  links: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    titleKey: 'navSecArchitecture',
    links: [
      { path: '/', labelKey: 'navHome', icon: Home },
      { path: '/overview', labelKey: 'navOverview', icon: FileText },
      { path: '/architecture', labelKey: 'navArchitecture', icon: Layers, badge: '6 Layers' },
      { path: '/ecosystem', labelKey: 'navEcosystem', icon: Network },
      { path: '/tech-stack', labelKey: 'navTechStack', icon: Cpu },
      { path: '/how-it-works', labelKey: 'navHowItWorks', icon: Workflow, badge: 'Key Flow' },
    ],
  },
  {
    titleKey: 'navSecCoreModules',
    links: [
      { path: '/modules', labelKey: 'navModules', icon: Boxes, badge: '32' },
      { path: '/modules/pos', labelKey: 'posCardTitle', icon: MonitorCheck, badge: 'KHQR' },
      { path: '/modules/products', labelKey: 'productCardTitle', icon: Package },
      { path: '/modules/inventory', labelKey: 'inventoryCardTitle', icon: Boxes },
      { path: '/modules/purchases', labelKey: 'modPurchases', icon: Truck },
      { path: '/modules/attendance', labelKey: 'modAttendance', icon: Clock },
      { path: '/modules/payroll', labelKey: 'modPayroll', icon: Banknote },
      { path: '/modules/roles-permissions', labelKey: 'modRbac', icon: Shield },
    ],
  },
  {
    titleKey: 'navSecRoleManuals',
    links: [
      { path: '/admin-guide', labelKey: 'navAdminGuide', icon: Shield, badge: '258 Pages' },
      { path: '/customer-guide', labelKey: 'navCustomerGuide', icon: ShoppingBag },
      { path: '/mobile-guide', labelKey: 'navMobileGuide', icon: Smartphone },
      { path: '/developer-guide', labelKey: 'navDevGuide', icon: Code2 },
    ],
  },
  {
    titleKey: 'navSecApiData',
    links: [
      { path: '/database', labelKey: 'navDatabase', icon: Database, badge: '99 Tables' },
      { path: '/database/er-diagram', labelKey: 'navERD', icon: Network },
      { path: '/api', labelKey: 'navApi', icon: Radio, badge: '759' },
      { path: '/auth-rbac', labelKey: 'navAuthRbac', icon: KeyRound },
      { path: '/reports', labelKey: 'navReports', icon: FileBarChart, badge: '48' },
    ],
  },
  {
    titleKey: 'navSecTraining',
    links: [
      { path: '/tutorials', labelKey: 'navTutorials', icon: Video },
      { path: '/troubleshooting', labelKey: 'navTroubleshooting', icon: AlertTriangle, badge: 'Errors' },
      { path: '/faq', labelKey: 'navFaq', icon: HelpCircle },
      { path: '/changelog', labelKey: 'navChangelog', icon: History },
      { path: '/stats', labelKey: 'navStats', icon: Activity },
      { path: '/about', labelKey: 'navAbout', icon: Info },
    ],
  },
];
