/**
 * Global Documentation Data & Query Service
 * Standardized data service matching admin-dashboard architecture
 */

import { ENTERPRISE_MODULES } from '../data/modulesData';
import { DATABASE_TABLES } from '../data/databaseSchemaData';
import { API_ROUTES } from '../data/apiRoutesData';
import { PERMISSION_NODES } from '../data/permissionsData';
import { TUTORIAL_VIDEOS } from '../data/tutorialsData';
import { REAL_SYSTEM_STATS } from '../data/systemStats';
import { filterByQuery } from '../utils/search';
import { EnterpriseModule, DatabaseTable, ApiRoute, PermissionNode, TutorialVideo } from '../types/docs';

export const docsService = {
  // Modules
  getAllModules(): EnterpriseModule[] {
    return ENTERPRISE_MODULES;
  },

  getModuleById(id: string): EnterpriseModule | undefined {
    return ENTERPRISE_MODULES.find((m) => m.id.toLowerCase() === id.toLowerCase());
  },

  searchModules(query: string, category: string = 'all'): EnterpriseModule[] {
    let list = ENTERPRISE_MODULES;
    if (category !== 'all') {
      list = list.filter((m) => m.category === category);
    }
    if (!query) return list;
    return filterByQuery(list, query, ['id', 'name', 'nameKh', 'overview', 'overviewKh']);
  },

  // Database Tables
  getAllTables(): DatabaseTable[] {
    return DATABASE_TABLES;
  },

  getTableByName(name: string): DatabaseTable | undefined {
    return DATABASE_TABLES.find((t) => t.name.toLowerCase() === name.toLowerCase());
  },

  searchTables(query: string, category: string = 'All'): DatabaseTable[] {
    let list = DATABASE_TABLES;
    if (category !== 'All') {
      list = list.filter((t) => t.category === category);
    }
    if (!query) return list;
    return filterByQuery(list, query, ['name', 'model', 'category', 'purpose', 'purposeKh']);
  },

  // APIs
  getAllApis(): ApiRoute[] {
    return API_ROUTES;
  },

  searchApis(query: string, method: string = 'ALL', module: string = 'ALL'): ApiRoute[] {
    let list = API_ROUTES;
    if (method !== 'ALL') {
      list = list.filter((a) => a.method === method);
    }
    if (module !== 'ALL') {
      list = list.filter((a) => a.module === module);
    }
    if (!query) return list;
    return filterByQuery(list, query, ['path', 'controller', 'action', 'summary', 'summaryKh', 'permission']);
  },

  // Permissions & RBAC
  getAllPermissions(): PermissionNode[] {
    return PERMISSION_NODES;
  },

  searchPermissions(query: string, domain: string = 'ALL'): PermissionNode[] {
    let list = PERMISSION_NODES;
    if (domain !== 'ALL') {
      list = list.filter((p) => p.domain === domain);
    }
    if (!query) return list;
    return filterByQuery(list, query, ['id', 'name', 'domain', 'description', 'descriptionKh']);
  },

  // Tutorials
  getAllTutorials(): TutorialVideo[] {
    return TUTORIAL_VIDEOS;
  },

  getTutorialById(id: string): TutorialVideo | undefined {
    return TUTORIAL_VIDEOS.find((t) => t.id === id);
  },

  // Stats
  getSystemStats() {
    return REAL_SYSTEM_STATS;
  },
};
