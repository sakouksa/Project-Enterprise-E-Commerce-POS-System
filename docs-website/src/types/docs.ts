export type FeatureStatus = 'implemented' | 'partial' | 'planned' | 'broken' | 'experimental';

export type UserPerspective = 
  | 'all'
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'cashier'
  | 'warehouse'
  | 'accountant'
  | 'hr'
  | 'sales'
  | 'support'
  | 'customer'
  | 'developer'
  | 'sysadmin'
  | 'new_member'
  | 'student'
  | 'business_owner';

export interface ModuleDoc {
  id: string;
  name: string;
  nameKh: string;
  category: 'core' | 'catalog' | 'inventory' | 'sales' | 'procurement' | 'hrm' | 'finance' | 'cms' | 'marketing' | 'settings' | 'security' | 'notifications' | 'orders';
  icon: string;
  status: FeatureStatus;
  overview: string;
  overviewKh: string;
  purpose: string;
  purposeKh: string;
  targetUsers: string[];
  mainFeatures: { title: string; titleKh: string; status: FeatureStatus; desc: string; descKh: string }[];
  databaseTables: string[];
  models: string[];
  frontendPages: string[];
  mobileScreens?: string[];
  backendApis: { method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; path: string; description: string; auth: boolean; permission?: string }[];
  businessRules: { title: string; titleKh: string; rule: string; ruleKh: string }[];
  workflowSteps: { step: number; title: string; titleKh: string; desc: string; descKh: string; actor: string }[];
  permissionsRequired: string[];
  validationRules: { field: string; rules: string; description: string }[];
  reportsAvailable: string[];
  notificationsTriggered: string[];
  commonErrors: { code: string; problem: string; solution: string }[];
  troubleshooting: { issue: string; cause: string; solution: string }[];
  behindTheButton?: {
    actionName: string;
    steps: {
      layer: 'UI / Frontend' | 'API Request' | 'Middleware / Auth' | 'Controller' | 'Service Layer' | 'DB Transaction' | 'Event / Queue' | 'UI Response';
      detail: string;
      codeSnippet?: string;
    }[];
  };
  videoScript?: {
    title: string;
    duration: string;
    steps: { order: number; action: string; narrationKh: string; narrationEn: string }[];
  };
}

export type EnterpriseModule = ModuleDoc;

export interface ApiEndpoint {
  id: string;
  module: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  summaryKh: string;
  controller: string;
  action: string;
  auth: boolean;
  permission?: string;
  queryParams?: { name: string; type: string; required: boolean; description: string }[];
  bodyParams?: { name: string; type: string; required: boolean; description: string }[];
  responseSample: any;
  statusCodes: { code: number; description: string }[];
}

export type ApiRoute = ApiEndpoint;

export interface DatabaseTable {
  name: string;
  category: string;
  purpose: string;
  purposeKh: string;
  model: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    default?: string;
    key?: 'PK' | 'FK' | 'INDEX' | 'UNIQUE';
    references?: string;
    description: string;
  }[];
  relationships: {
    type: 'belongsTo' | 'hasMany' | 'hasOne' | 'belongsToMany' | 'morphMany';
    targetTable: string;
    targetModel: string;
    foreignKey: string;
  }[];
  usedByFrontend: string[];
  usedByApi: string[];
}

export interface PermissionNode {
  id: string;
  name: string;
  guard: string;
  domain: string;
  description: string;
  descriptionKh: string;
  roles: {
    super_admin: boolean;
    admin: boolean;
    manager: boolean;
    cashier: boolean;
    warehouse_staff: boolean;
    customer: boolean;
  };
}

export interface TutorialVideo {
  id: string;
  title: string;
  titleKh: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'ready' | 'coming_soon';
  description: string;
  descriptionKh: string;
  learningObjectives: string[];
  learningObjectivesKh: string[];
  stepByStepNotes: string[];
  stepByStepNotesKh: string[];
  videoScript: { step: number; action: string; narrationKh: string; narrationEn: string }[];
  relatedDocsPath: string;
}

export interface TroubleshootingItem {
  id: string;
  code: string;
  title: string;
  titleKh: string;
  category: 'auth' | 'network' | 'pos' | 'database' | 'inventory' | 'mobile' | 'server';
  problem: string;
  problemKh: string;
  cause: string;
  causeKh: string;
  howToCheck: string;
  howToCheckKh: string;
  solution: string;
  solutionKh: string;
  prevention: string;
  preventionKh: string;
  codeSnippet?: string;
}

export interface FaqItem {
  id: string;
  category: 'General' | 'Admin' | 'POS & Cashier' | 'Warehouse & Stock' | 'Accounting & Finance' | 'HR & Payroll' | 'Customer' | 'Developer & Sysadmin';
  questionKh: string;
  questionEn: string;
  answerKh: string;
  answerEn: string;
  relatedPath?: string;
}
