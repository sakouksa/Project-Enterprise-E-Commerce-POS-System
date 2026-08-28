import { DatabaseTable } from '../types/docs';

export const DATABASE_TABLES: DatabaseTable[] = [
  {
    "name": "users",
    "category": "Security & Audit",
    "purpose": "Stores relational records for users entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ users ក្នុងប្រព័ន្ធ",
    "model": "Users",
    "columns": [
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "email",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for email"
      },
      {
        "name": "email_verified_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for email verified at"
      },
      {
        "name": "password",
        "type": "string",
        "nullable": false,
        "description": "Field for password"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": true,
        "description": "Field for phone"
      },
      {
        "name": "avatar",
        "type": "string",
        "nullable": true,
        "description": "Field for avatar"
      },
      {
        "name": "company_id",
        "type": "unsignedBigInteger",
        "nullable": true,
        "key": "FK",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "unsignedBigInteger",
        "nullable": true,
        "key": "FK",
        "description": "Field for branch id"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "last_login_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for last login at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/users"
    ]
  },
  {
    "name": "password_reset_tokens",
    "category": "Core System",
    "purpose": "Stores relational records for password reset tokens entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ password reset tokens ក្នុងប្រព័ន្ធ",
    "model": "PasswordResetTokens",
    "columns": [
      {
        "name": "email",
        "type": "string",
        "nullable": false,
        "description": "Field for email"
      },
      {
        "name": "token",
        "type": "string",
        "nullable": false,
        "description": "Field for token"
      },
      {
        "name": "created_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for created at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/password-reset-tokens"
    ]
  },
  {
    "name": "sessions",
    "category": "Core System",
    "purpose": "Stores relational records for sessions entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ sessions ក្នុងប្រព័ន្ធ",
    "model": "Sessions",
    "columns": [
      {
        "name": "id",
        "type": "string",
        "nullable": false,
        "key": "PK",
        "description": "Field for id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "INDEX",
        "description": "Field for user id"
      },
      {
        "name": "ip_address",
        "type": "string(45)",
        "nullable": true,
        "description": "Field for ip address"
      },
      {
        "name": "user_agent",
        "type": "text",
        "nullable": true,
        "description": "Field for user agent"
      },
      {
        "name": "payload",
        "type": "longText",
        "nullable": false,
        "description": "Field for payload"
      },
      {
        "name": "last_activity",
        "type": "integer",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for last activity"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/sessions"
    ]
  },
  {
    "name": "cache",
    "category": "Core System",
    "purpose": "Stores relational records for cache entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ cache ក្នុងប្រព័ន្ធ",
    "model": "Cache",
    "columns": [
      {
        "name": "key",
        "type": "string",
        "nullable": false,
        "description": "Field for key"
      },
      {
        "name": "value",
        "type": "mediumText",
        "nullable": false,
        "description": "Field for value"
      },
      {
        "name": "expiration",
        "type": "integer",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for expiration"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/cache"
    ]
  },
  {
    "name": "cache_locks",
    "category": "Core System",
    "purpose": "Stores relational records for cache locks entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ cache locks ក្នុងប្រព័ន្ធ",
    "model": "CacheLocks",
    "columns": [
      {
        "name": "key",
        "type": "string",
        "nullable": false,
        "description": "Field for key"
      },
      {
        "name": "owner",
        "type": "string",
        "nullable": false,
        "description": "Field for owner"
      },
      {
        "name": "expiration",
        "type": "integer",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for expiration"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/cache-locks"
    ]
  },
  {
    "name": "jobs",
    "category": "Core System",
    "purpose": "Stores relational records for jobs entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ jobs ក្នុងប្រព័ន្ធ",
    "model": "Jobs",
    "columns": [
      {
        "name": "queue",
        "type": "string",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for queue"
      },
      {
        "name": "payload",
        "type": "longText",
        "nullable": false,
        "description": "Field for payload"
      },
      {
        "name": "attempts",
        "type": "unsignedTinyInteger",
        "nullable": false,
        "description": "Field for attempts"
      },
      {
        "name": "reserved_at",
        "type": "unsignedInteger",
        "nullable": true,
        "description": "Field for reserved at"
      },
      {
        "name": "available_at",
        "type": "unsignedInteger",
        "nullable": false,
        "description": "Field for available at"
      },
      {
        "name": "created_at",
        "type": "unsignedInteger",
        "nullable": false,
        "description": "Field for created at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/jobs"
    ]
  },
  {
    "name": "job_batches",
    "category": "Core System",
    "purpose": "Stores relational records for job batches entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ job batches ក្នុងប្រព័ន្ធ",
    "model": "JobBatches",
    "columns": [
      {
        "name": "id",
        "type": "string",
        "nullable": false,
        "key": "PK",
        "description": "Field for id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "total_jobs",
        "type": "integer",
        "nullable": false,
        "description": "Field for total jobs"
      },
      {
        "name": "pending_jobs",
        "type": "integer",
        "nullable": false,
        "description": "Field for pending jobs"
      },
      {
        "name": "failed_jobs",
        "type": "integer",
        "nullable": false,
        "description": "Field for failed jobs"
      },
      {
        "name": "failed_job_ids",
        "type": "longText",
        "nullable": false,
        "description": "Field for failed job ids"
      },
      {
        "name": "options",
        "type": "mediumText",
        "nullable": true,
        "description": "Field for options"
      },
      {
        "name": "cancelled_at",
        "type": "integer",
        "nullable": true,
        "description": "Field for cancelled at"
      },
      {
        "name": "created_at",
        "type": "integer",
        "nullable": false,
        "description": "Field for created at"
      },
      {
        "name": "finished_at",
        "type": "integer",
        "nullable": true,
        "description": "Field for finished at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/job-batches"
    ]
  },
  {
    "name": "failed_jobs",
    "category": "Core System",
    "purpose": "Stores relational records for failed jobs entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ failed jobs ក្នុងប្រព័ន្ធ",
    "model": "FailedJobs",
    "columns": [
      {
        "name": "uuid",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for uuid"
      },
      {
        "name": "connection",
        "type": "text",
        "nullable": false,
        "description": "Field for connection"
      },
      {
        "name": "queue",
        "type": "text",
        "nullable": false,
        "description": "Field for queue"
      },
      {
        "name": "payload",
        "type": "longText",
        "nullable": false,
        "description": "Field for payload"
      },
      {
        "name": "exception",
        "type": "longText",
        "nullable": false,
        "description": "Field for exception"
      },
      {
        "name": "failed_at",
        "type": "timestamp",
        "nullable": false,
        "description": "Field for failed at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/failed-jobs"
    ]
  },
  {
    "name": "companies",
    "category": "Core System",
    "purpose": "Stores relational records for companies entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ companies ក្នុងប្រព័ន្ធ",
    "model": "Companies",
    "columns": [
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "slug",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for slug"
      },
      {
        "name": "email",
        "type": "string",
        "nullable": true,
        "description": "Field for email"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": true,
        "description": "Field for phone"
      },
      {
        "name": "website",
        "type": "string",
        "nullable": true,
        "description": "Field for website"
      },
      {
        "name": "address",
        "type": "text",
        "nullable": true,
        "description": "Field for address"
      },
      {
        "name": "city",
        "type": "string",
        "nullable": true,
        "description": "Field for city"
      },
      {
        "name": "province",
        "type": "string",
        "nullable": true,
        "description": "Field for province"
      },
      {
        "name": "country",
        "type": "string",
        "nullable": false,
        "default": "ID",
        "description": "Field for country"
      },
      {
        "name": "postal_code",
        "type": "string",
        "nullable": true,
        "description": "Field for postal code"
      },
      {
        "name": "tax_number",
        "type": "string",
        "nullable": true,
        "description": "Field for tax number"
      },
      {
        "name": "logo",
        "type": "string",
        "nullable": true,
        "description": "Field for logo"
      },
      {
        "name": "currency_code",
        "type": "string(10)",
        "nullable": false,
        "default": "IDR",
        "description": "Field for currency code"
      },
      {
        "name": "timezone",
        "type": "string",
        "nullable": false,
        "default": "Asia/Jakarta",
        "description": "Field for timezone"
      },
      {
        "name": "language",
        "type": "string(10)",
        "nullable": false,
        "default": "id",
        "description": "Field for language"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "settings",
        "type": "json",
        "nullable": true,
        "description": "Field for settings"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/companies"
    ]
  },
  {
    "name": "branches",
    "category": "Core System",
    "purpose": "Stores relational records for branches entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ branches ក្នុងប្រព័ន្ធ",
    "model": "Branches",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "email",
        "type": "string",
        "nullable": true,
        "description": "Field for email"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": true,
        "description": "Field for phone"
      },
      {
        "name": "address",
        "type": "text",
        "nullable": true,
        "description": "Field for address"
      },
      {
        "name": "city",
        "type": "string",
        "nullable": true,
        "description": "Field for city"
      },
      {
        "name": "province",
        "type": "string",
        "nullable": true,
        "description": "Field for province"
      },
      {
        "name": "postal_code",
        "type": "string",
        "nullable": true,
        "description": "Field for postal code"
      },
      {
        "name": "is_main",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is main"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "company_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for company id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/branches"
    ]
  },
  {
    "name": "stores",
    "category": "Core System",
    "purpose": "Stores relational records for stores entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ stores ក្នុងប្រព័ន្ធ",
    "model": "Stores",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "slug",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for slug"
      },
      {
        "name": "domain",
        "type": "string",
        "nullable": true,
        "key": "UNIQUE",
        "description": "Field for domain"
      },
      {
        "name": "email",
        "type": "string",
        "nullable": true,
        "description": "Field for email"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": true,
        "description": "Field for phone"
      },
      {
        "name": "address",
        "type": "text",
        "nullable": true,
        "description": "Field for address"
      },
      {
        "name": "logo",
        "type": "string",
        "nullable": true,
        "description": "Field for logo"
      },
      {
        "name": "banner",
        "type": "string",
        "nullable": true,
        "description": "Field for banner"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "type",
        "type": "enum(['online', 'offline', 'hybrid'])",
        "nullable": false,
        "default": "hybrid",
        "description": "Field for type"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "settings",
        "type": "json",
        "nullable": true,
        "description": "Field for settings"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/stores"
    ]
  },
  {
    "name": "warehouses",
    "category": "Core System",
    "purpose": "Stores relational records for warehouses entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ warehouses ក្នុងប្រព័ន្ធ",
    "model": "Warehouses",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "address",
        "type": "text",
        "nullable": true,
        "description": "Field for address"
      },
      {
        "name": "city",
        "type": "string",
        "nullable": true,
        "description": "Field for city"
      },
      {
        "name": "province",
        "type": "string",
        "nullable": true,
        "description": "Field for province"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": true,
        "description": "Field for phone"
      },
      {
        "name": "pic_name",
        "type": "string",
        "nullable": true,
        "description": "Field for pic name"
      },
      {
        "name": "is_main",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is main"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/warehouses"
    ]
  },
  {
    "name": "departments",
    "category": "HRM & Attendance",
    "purpose": "Stores relational records for departments entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ departments ក្នុងប្រព័ន្ធ",
    "model": "Departments",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": true,
        "description": "Field for code"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/departments"
    ]
  },
  {
    "name": "positions",
    "category": "HRM & Attendance",
    "purpose": "Stores relational records for positions entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ positions ក្នុងប្រព័ន្ធ",
    "model": "Positions",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "department_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "departments",
        "description": "Field for department id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": true,
        "description": "Field for code"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/positions"
    ]
  },
  {
    "name": "employees",
    "category": "HRM & Attendance",
    "purpose": "Stores relational records for employees entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ employees ក្នុងប្រព័ន្ធ",
    "model": "Employees",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "department_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "departments",
        "description": "Field for department id"
      },
      {
        "name": "position_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "positions",
        "description": "Field for position id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "employee_number",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for employee number"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "email",
        "type": "string",
        "nullable": true,
        "description": "Field for email"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": true,
        "description": "Field for phone"
      },
      {
        "name": "nik",
        "type": "string",
        "nullable": true,
        "description": "Field for nik"
      },
      {
        "name": "gender",
        "type": "enum(['male', 'female'])",
        "nullable": true,
        "description": "Field for gender"
      },
      {
        "name": "birth_date",
        "type": "date",
        "nullable": true,
        "description": "Field for birth date"
      },
      {
        "name": "address",
        "type": "text",
        "nullable": true,
        "description": "Field for address"
      },
      {
        "name": "photo",
        "type": "string",
        "nullable": true,
        "description": "Field for photo"
      },
      {
        "name": "join_date",
        "type": "date",
        "nullable": true,
        "description": "Field for join date"
      },
      {
        "name": "resign_date",
        "type": "date",
        "nullable": true,
        "description": "Field for resign date"
      },
      {
        "name": "status",
        "type": "enum(['active', 'inactive', 'resigned'])",
        "nullable": false,
        "default": "active",
        "description": "Field for status"
      },
      {
        "name": "basic_salary",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for basic salary"
      },
      {
        "name": "user_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for user id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/employees"
    ]
  },
  {
    "name": "attendance",
    "category": "HRM & Attendance",
    "purpose": "Stores relational records for attendance entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ attendance ក្នុងប្រព័ន្ធ",
    "model": "Attendance",
    "columns": [
      {
        "name": "employee_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "employees",
        "description": "Field for employee id"
      },
      {
        "name": "date",
        "type": "date",
        "nullable": false,
        "description": "Field for date"
      },
      {
        "name": "check_in",
        "type": "time",
        "nullable": true,
        "description": "Field for check in"
      },
      {
        "name": "check_out",
        "type": "time",
        "nullable": true,
        "description": "Field for check out"
      },
      {
        "name": "status",
        "type": "enum(['present', 'absent', 'late', 'leave', 'holiday'])",
        "nullable": false,
        "default": "present",
        "description": "Field for status"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/attendance"
    ]
  },
  {
    "name": "payrolls",
    "category": "HRM & Attendance",
    "purpose": "Stores relational records for payrolls entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ payrolls ក្នុងប្រព័ន្ធ",
    "model": "Payrolls",
    "columns": [
      {
        "name": "employee_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "employees",
        "description": "Field for employee id"
      },
      {
        "name": "period_month",
        "type": "string(7)",
        "nullable": false,
        "description": "Field for period month"
      },
      {
        "name": "working_days",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for working days"
      },
      {
        "name": "present_days",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for present days"
      },
      {
        "name": "basic_salary",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for basic salary"
      },
      {
        "name": "allowances",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for allowances"
      },
      {
        "name": "deductions",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for deductions"
      },
      {
        "name": "overtime_pay",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for overtime pay"
      },
      {
        "name": "net_salary",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for net salary"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'approved', 'paid'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      },
      {
        "name": "paid_at",
        "type": "date",
        "nullable": true,
        "description": "Field for paid at"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/payrolls"
    ]
  },
  {
    "name": "categories",
    "category": "Product Catalog",
    "purpose": "Stores relational records for categories entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ categories ក្នុងប្រព័ន្ធ",
    "model": "Categories",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "parent_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "categories",
        "description": "Field for parent id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "slug",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for slug"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "image",
        "type": "string",
        "nullable": true,
        "description": "Field for image"
      },
      {
        "name": "sort_order",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for sort order"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/categories"
    ]
  },
  {
    "name": "brands",
    "category": "Product Catalog",
    "purpose": "Stores relational records for brands entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ brands ក្នុងប្រព័ន្ធ",
    "model": "Brands",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "slug",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for slug"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "logo",
        "type": "string",
        "nullable": true,
        "description": "Field for logo"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "company_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for company id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/brands"
    ]
  },
  {
    "name": "units",
    "category": "Product Catalog",
    "purpose": "Stores relational records for units entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ units ក្នុងប្រព័ន្ធ",
    "model": "Units",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "symbol",
        "type": "string(20)",
        "nullable": false,
        "description": "Field for symbol"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/units"
    ]
  },
  {
    "name": "taxes",
    "category": "Product Catalog",
    "purpose": "Stores relational records for taxes entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ taxes ក្នុងប្រព័ន្ធ",
    "model": "Taxes",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "rate",
        "type": "decimal(8, 4)",
        "nullable": false,
        "description": "Field for rate"
      },
      {
        "name": "type",
        "type": "enum(['percentage', 'fixed'])",
        "nullable": false,
        "default": "percentage",
        "description": "Field for type"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/taxes"
    ]
  },
  {
    "name": "attributes",
    "category": "Product Catalog",
    "purpose": "Stores relational records for attributes entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ attributes ក្នុងប្រព័ន្ធ",
    "model": "Attributes",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "type",
        "type": "enum(['select', 'color', 'button', 'text'])",
        "nullable": false,
        "default": "select",
        "description": "Field for type"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/attributes"
    ]
  },
  {
    "name": "attribute_values",
    "category": "Product Catalog",
    "purpose": "Stores relational records for attribute values entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ attribute values ក្នុងប្រព័ន្ធ",
    "model": "AttributeValues",
    "columns": [
      {
        "name": "attribute_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "attributes",
        "description": "Field for attribute id"
      },
      {
        "name": "value",
        "type": "string",
        "nullable": false,
        "description": "Field for value"
      },
      {
        "name": "color_code",
        "type": "string(10)",
        "nullable": true,
        "description": "Field for color code"
      },
      {
        "name": "sort_order",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for sort order"
      },
      {
        "name": "attribute_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for attribute id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/attribute-values"
    ]
  },
  {
    "name": "products",
    "category": "Product Catalog",
    "purpose": "Stores relational records for products entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ products ក្នុងប្រព័ន្ធ",
    "model": "Products",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "category_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "categorys",
        "description": "Field for category id"
      },
      {
        "name": "brand_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "brands",
        "description": "Field for brand id"
      },
      {
        "name": "unit_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "units",
        "description": "Field for unit id"
      },
      {
        "name": "tax_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "taxs",
        "description": "Field for tax id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "slug",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for slug"
      },
      {
        "name": "sku",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for sku"
      },
      {
        "name": "barcode",
        "type": "string",
        "nullable": true,
        "key": "UNIQUE",
        "description": "Field for barcode"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "short_description",
        "type": "text",
        "nullable": true,
        "description": "Field for short description"
      },
      {
        "name": "cost_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for cost price"
      },
      {
        "name": "selling_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for selling price"
      },
      {
        "name": "compare_price",
        "type": "decimal(15, 2)",
        "nullable": true,
        "description": "Field for compare price"
      },
      {
        "name": "weight",
        "type": "decimal(10, 3)",
        "nullable": true,
        "description": "Field for weight"
      },
      {
        "name": "length",
        "type": "decimal(10, 2)",
        "nullable": true,
        "description": "Field for length"
      },
      {
        "name": "width",
        "type": "decimal(10, 2)",
        "nullable": true,
        "description": "Field for width"
      },
      {
        "name": "height",
        "type": "decimal(10, 2)",
        "nullable": true,
        "description": "Field for height"
      },
      {
        "name": "has_variants",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for has variants"
      },
      {
        "name": "track_inventory",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for track inventory"
      },
      {
        "name": "low_stock_threshold",
        "type": "integer",
        "nullable": false,
        "default": "5",
        "description": "Field for low stock threshold"
      },
      {
        "name": "status",
        "type": "enum(['active', 'inactive', 'draft', 'archived'])",
        "nullable": false,
        "default": "active",
        "description": "Field for status"
      },
      {
        "name": "is_featured",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is featured"
      },
      {
        "name": "is_digital",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is digital"
      },
      {
        "name": "sold_count",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for sold count"
      },
      {
        "name": "view_count",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for view count"
      },
      {
        "name": "rating_avg",
        "type": "decimal(3, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for rating avg"
      },
      {
        "name": "rating_count",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for rating count"
      },
      {
        "name": "meta_title",
        "type": "string",
        "nullable": true,
        "description": "Field for meta title"
      },
      {
        "name": "meta_description",
        "type": "text",
        "nullable": true,
        "description": "Field for meta description"
      },
      {
        "name": "meta_keywords",
        "type": "string",
        "nullable": true,
        "description": "Field for meta keywords"
      },
      {
        "name": "slug",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for slug"
      },
      {
        "name": "sku",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for sku"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/products"
    ]
  },
  {
    "name": "product_images",
    "category": "Product Catalog",
    "purpose": "Stores relational records for product images entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ product images ក្នុងប្រព័ន្ធ",
    "model": "ProductImages",
    "columns": [
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "image",
        "type": "string",
        "nullable": false,
        "description": "Field for image"
      },
      {
        "name": "alt_text",
        "type": "string",
        "nullable": true,
        "description": "Field for alt text"
      },
      {
        "name": "sort_order",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for sort order"
      },
      {
        "name": "is_primary",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is primary"
      },
      {
        "name": "product_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for product id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/product-images"
    ]
  },
  {
    "name": "product_variants",
    "category": "Product Catalog",
    "purpose": "Stores relational records for product variants entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ product variants ក្នុងប្រព័ន្ធ",
    "model": "ProductVariants",
    "columns": [
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "sku",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for sku"
      },
      {
        "name": "barcode",
        "type": "string",
        "nullable": true,
        "key": "UNIQUE",
        "description": "Field for barcode"
      },
      {
        "name": "cost_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for cost price"
      },
      {
        "name": "selling_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for selling price"
      },
      {
        "name": "compare_price",
        "type": "decimal(15, 2)",
        "nullable": true,
        "description": "Field for compare price"
      },
      {
        "name": "weight",
        "type": "decimal(10, 3)",
        "nullable": true,
        "description": "Field for weight"
      },
      {
        "name": "image",
        "type": "string",
        "nullable": true,
        "description": "Field for image"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "product_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for product id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/product-variants"
    ]
  },
  {
    "name": "product_variant_values",
    "category": "Product Catalog",
    "purpose": "Stores relational records for product variant values entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ product variant values ក្នុងប្រព័ន្ធ",
    "model": "ProductVariantValues",
    "columns": [
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "attribute_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "attributes",
        "description": "Field for attribute id"
      },
      {
        "name": "attribute_value_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "attribute_values",
        "description": "Field for attribute value id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/product-variant-values"
    ]
  },
  {
    "name": "product_prices",
    "category": "Product Catalog",
    "purpose": "Stores relational records for product prices entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ product prices ក្នុងប្រព័ន្ធ",
    "model": "ProductPrices",
    "columns": [
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "price_type",
        "type": "string",
        "nullable": false,
        "description": "Field for price type"
      },
      {
        "name": "min_qty",
        "type": "integer",
        "nullable": false,
        "default": "1",
        "description": "Field for min qty"
      },
      {
        "name": "price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for price"
      },
      {
        "name": "currency_code",
        "type": "string(10)",
        "nullable": false,
        "default": "IDR",
        "description": "Field for currency code"
      },
      {
        "name": "start_date",
        "type": "date",
        "nullable": true,
        "description": "Field for start date"
      },
      {
        "name": "end_date",
        "type": "date",
        "nullable": true,
        "description": "Field for end date"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/product-prices"
    ]
  },
  {
    "name": "inventories",
    "category": "Inventory & Warehouse",
    "purpose": "Stores relational records for inventories entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ inventories ក្នុងប្រព័ន្ធ",
    "model": "Inventories",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "warehouse_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "warehouses",
        "description": "Field for warehouse id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for quantity"
      },
      {
        "name": "reserved_quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for reserved quantity"
      },
      {
        "name": "available_quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "description": "Field for available quantity"
      },
      {
        "name": "reorder_point",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "5",
        "description": "Field for reorder point"
      },
      {
        "name": "reorder_qty",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "10",
        "description": "Field for reorder qty"
      },
      {
        "name": "product_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for product id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/inventories"
    ]
  },
  {
    "name": "inventory_movements",
    "category": "Inventory & Warehouse",
    "purpose": "Stores relational records for inventory movements entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ inventory movements ក្នុងប្រព័ន្ធ",
    "model": "InventoryMovements",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "warehouse_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "warehouses",
        "description": "Field for warehouse id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "reference_type",
        "type": "string",
        "nullable": true,
        "description": "Field for reference type"
      },
      {
        "name": "reference_id",
        "type": "unsignedBigInteger",
        "nullable": true,
        "key": "FK",
        "description": "Field for reference id"
      },
      {
        "name": "type",
        "type": "enum(['in', 'out', 'transfer_in', 'transfer_out', 'adjustment', 'opname'])",
        "nullable": false,
        "description": "Field for type"
      },
      {
        "name": "quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "description": "Field for quantity"
      },
      {
        "name": "quantity_before",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for quantity before"
      },
      {
        "name": "quantity_after",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for quantity after"
      },
      {
        "name": "unit_cost",
        "type": "decimal(15, 2)",
        "nullable": true,
        "description": "Field for unit cost"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "created_at",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for created at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/inventory-movements"
    ]
  },
  {
    "name": "stock_adjustments",
    "category": "Inventory & Warehouse",
    "purpose": "Stores relational records for stock adjustments entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ stock adjustments ក្នុងប្រព័ន្ធ",
    "model": "StockAdjustments",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "warehouse_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "warehouses",
        "description": "Field for warehouse id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "reference_number",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for reference number"
      },
      {
        "name": "date",
        "type": "date",
        "nullable": false,
        "description": "Field for date"
      },
      {
        "name": "type",
        "type": "enum(['addition', 'subtraction', 'recount'])",
        "nullable": false,
        "description": "Field for type"
      },
      {
        "name": "reason",
        "type": "text",
        "nullable": true,
        "description": "Field for reason"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'approved', 'cancelled'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      },
      {
        "name": "approved_by",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for approved by"
      },
      {
        "name": "approved_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for approved at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/stock-adjustments"
    ]
  },
  {
    "name": "stock_adjustment_items",
    "category": "Inventory & Warehouse",
    "purpose": "Stores relational records for stock adjustment items entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ stock adjustment items ក្នុងប្រព័ន្ធ",
    "model": "StockAdjustmentItems",
    "columns": [
      {
        "name": "stock_adjustment_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "stock_adjustments",
        "description": "Field for stock adjustment id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "quantity_before",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for quantity before"
      },
      {
        "name": "quantity_adjusted",
        "type": "decimal(15, 4)",
        "nullable": false,
        "description": "Field for quantity adjusted"
      },
      {
        "name": "quantity_after",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for quantity after"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "stock_adjustment_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for stock adjustment id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/stock-adjustment-items"
    ]
  },
  {
    "name": "stock_transfers",
    "category": "Inventory & Warehouse",
    "purpose": "Stores relational records for stock transfers entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ stock transfers ក្នុងប្រព័ន្ធ",
    "model": "StockTransfers",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "from_warehouse_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "warehouses",
        "description": "Field for from warehouse id"
      },
      {
        "name": "to_warehouse_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "warehouses",
        "description": "Field for to warehouse id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "reference_number",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for reference number"
      },
      {
        "name": "date",
        "type": "date",
        "nullable": false,
        "description": "Field for date"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'in_transit', 'received', 'cancelled'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      },
      {
        "name": "shipped_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for shipped at"
      },
      {
        "name": "received_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for received at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/stock-transfers"
    ]
  },
  {
    "name": "stock_transfer_items",
    "category": "Inventory & Warehouse",
    "purpose": "Stores relational records for stock transfer items entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ stock transfer items ក្នុងប្រព័ន្ធ",
    "model": "StockTransferItems",
    "columns": [
      {
        "name": "stock_transfer_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "stock_transfers",
        "description": "Field for stock transfer id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "quantity_requested",
        "type": "decimal(15, 4)",
        "nullable": false,
        "description": "Field for quantity requested"
      },
      {
        "name": "quantity_sent",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for quantity sent"
      },
      {
        "name": "quantity_received",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for quantity received"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "stock_transfer_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for stock transfer id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/stock-transfer-items"
    ]
  },
  {
    "name": "stock_opnames",
    "category": "Inventory & Warehouse",
    "purpose": "Stores relational records for stock opnames entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ stock opnames ក្នុងប្រព័ន្ធ",
    "model": "StockOpnames",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "warehouse_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "warehouses",
        "description": "Field for warehouse id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "reference_number",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for reference number"
      },
      {
        "name": "date",
        "type": "date",
        "nullable": false,
        "description": "Field for date"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'counting', 'done', 'cancelled'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      },
      {
        "name": "completed_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for completed at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/stock-opnames"
    ]
  },
  {
    "name": "stock_opname_items",
    "category": "Inventory & Warehouse",
    "purpose": "Stores relational records for stock opname items entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ stock opname items ក្នុងប្រព័ន្ធ",
    "model": "StockOpnameItems",
    "columns": [
      {
        "name": "stock_opname_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "stock_opnames",
        "description": "Field for stock opname id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "system_quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for system quantity"
      },
      {
        "name": "physical_quantity",
        "type": "decimal(15, 4)",
        "nullable": true,
        "description": "Field for physical quantity"
      },
      {
        "name": "difference",
        "type": "decimal(15, 4)",
        "nullable": true,
        "description": "Field for difference"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "stock_opname_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for stock opname id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/stock-opname-items"
    ]
  },
  {
    "name": "suppliers",
    "category": "Procurement & Purchasing",
    "purpose": "Stores relational records for suppliers entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ suppliers ក្នុងប្រព័ន្ធ",
    "model": "Suppliers",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "email",
        "type": "string",
        "nullable": true,
        "description": "Field for email"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": true,
        "description": "Field for phone"
      },
      {
        "name": "fax",
        "type": "string",
        "nullable": true,
        "description": "Field for fax"
      },
      {
        "name": "address",
        "type": "text",
        "nullable": true,
        "description": "Field for address"
      },
      {
        "name": "city",
        "type": "string",
        "nullable": true,
        "description": "Field for city"
      },
      {
        "name": "province",
        "type": "string",
        "nullable": true,
        "description": "Field for province"
      },
      {
        "name": "country",
        "type": "string",
        "nullable": true,
        "description": "Field for country"
      },
      {
        "name": "postal_code",
        "type": "string",
        "nullable": true,
        "description": "Field for postal code"
      },
      {
        "name": "tax_number",
        "type": "string",
        "nullable": true,
        "description": "Field for tax number"
      },
      {
        "name": "bank_name",
        "type": "string",
        "nullable": true,
        "description": "Field for bank name"
      },
      {
        "name": "bank_account_number",
        "type": "string",
        "nullable": true,
        "description": "Field for bank account number"
      },
      {
        "name": "bank_account_name",
        "type": "string",
        "nullable": true,
        "description": "Field for bank account name"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "company_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for company id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/suppliers"
    ]
  },
  {
    "name": "supplier_contacts",
    "category": "Procurement & Purchasing",
    "purpose": "Stores relational records for supplier contacts entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ supplier contacts ក្នុងប្រព័ន្ធ",
    "model": "SupplierContacts",
    "columns": [
      {
        "name": "supplier_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "suppliers",
        "description": "Field for supplier id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "title",
        "type": "string",
        "nullable": true,
        "description": "Field for title"
      },
      {
        "name": "email",
        "type": "string",
        "nullable": true,
        "description": "Field for email"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": true,
        "description": "Field for phone"
      },
      {
        "name": "is_primary",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is primary"
      },
      {
        "name": "supplier_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for supplier id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/supplier-contacts"
    ]
  },
  {
    "name": "purchases",
    "category": "Procurement & Purchasing",
    "purpose": "Stores relational records for purchases entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ purchases ក្នុងប្រព័ន្ធ",
    "model": "Purchases",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "warehouse_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "warehouses",
        "description": "Field for warehouse id"
      },
      {
        "name": "supplier_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "suppliers",
        "description": "Field for supplier id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "reference_number",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for reference number"
      },
      {
        "name": "date",
        "type": "date",
        "nullable": false,
        "description": "Field for date"
      },
      {
        "name": "due_date",
        "type": "date",
        "nullable": true,
        "description": "Field for due date"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'ordered', 'partial', 'received', 'cancelled'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      },
      {
        "name": "payment_status",
        "type": "enum(['unpaid', 'partial', 'paid'])",
        "nullable": false,
        "default": "unpaid",
        "description": "Field for payment status"
      },
      {
        "name": "subtotal",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for subtotal"
      },
      {
        "name": "tax_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for tax amount"
      },
      {
        "name": "discount_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount amount"
      },
      {
        "name": "shipping_cost",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for shipping cost"
      },
      {
        "name": "grand_total",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for grand total"
      },
      {
        "name": "paid_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for paid amount"
      },
      {
        "name": "due_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for due amount"
      },
      {
        "name": "currency_code",
        "type": "string(10)",
        "nullable": false,
        "default": "IDR",
        "description": "Field for currency code"
      },
      {
        "name": "exchange_rate",
        "type": "decimal(15, 6)",
        "nullable": false,
        "default": "1",
        "description": "Field for exchange rate"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "supplier_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for supplier id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/purchases"
    ]
  },
  {
    "name": "purchase_items",
    "category": "Procurement & Purchasing",
    "purpose": "Stores relational records for purchase items entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ purchase items ក្នុងប្រព័ន្ធ",
    "model": "PurchaseItems",
    "columns": [
      {
        "name": "purchase_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "purchases",
        "description": "Field for purchase id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "description": "Field for quantity"
      },
      {
        "name": "quantity_received",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for quantity received"
      },
      {
        "name": "unit_cost",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for unit cost"
      },
      {
        "name": "discount_percent",
        "type": "decimal(8, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount percent"
      },
      {
        "name": "discount_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount amount"
      },
      {
        "name": "tax_percent",
        "type": "decimal(8, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for tax percent"
      },
      {
        "name": "tax_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for tax amount"
      },
      {
        "name": "subtotal",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for subtotal"
      },
      {
        "name": "total",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for total"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "purchase_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for purchase id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/purchase-items"
    ]
  },
  {
    "name": "purchase_returns",
    "category": "Procurement & Purchasing",
    "purpose": "Stores relational records for purchase returns entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ purchase returns ក្នុងប្រព័ន្ធ",
    "model": "PurchaseReturns",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "purchase_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "purchases",
        "description": "Field for purchase id"
      },
      {
        "name": "supplier_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "suppliers",
        "description": "Field for supplier id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "reference_number",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for reference number"
      },
      {
        "name": "date",
        "type": "date",
        "nullable": false,
        "description": "Field for date"
      },
      {
        "name": "total_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for total amount"
      },
      {
        "name": "reason",
        "type": "text",
        "nullable": true,
        "description": "Field for reason"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'approved', 'cancelled'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/purchase-returns"
    ]
  },
  {
    "name": "purchase_return_items",
    "category": "Procurement & Purchasing",
    "purpose": "Stores relational records for purchase return items entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ purchase return items ក្នុងប្រព័ន្ធ",
    "model": "PurchaseReturnItems",
    "columns": [
      {
        "name": "purchase_return_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "purchase_returns",
        "description": "Field for purchase return id"
      },
      {
        "name": "purchase_item_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "purchase_items",
        "description": "Field for purchase item id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "description": "Field for quantity"
      },
      {
        "name": "unit_cost",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for unit cost"
      },
      {
        "name": "total",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for total"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "purchase_return_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for purchase return id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/purchase-return-items"
    ]
  },
  {
    "name": "customer_groups",
    "category": "Core System",
    "purpose": "Stores relational records for customer groups entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ customer groups ក្នុងប្រព័ន្ធ",
    "model": "CustomerGroups",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "discount_percent",
        "type": "decimal(8, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount percent"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/customer-groups"
    ]
  },
  {
    "name": "customers",
    "category": "Core System",
    "purpose": "Stores relational records for customers entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ customers ក្នុងប្រព័ន្ធ",
    "model": "Customers",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "customer_group_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "customer_groups",
        "description": "Field for customer group id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "email",
        "type": "string",
        "nullable": true,
        "description": "Field for email"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": true,
        "description": "Field for phone"
      },
      {
        "name": "gender",
        "type": "enum(['male', 'female', 'other'])",
        "nullable": true,
        "description": "Field for gender"
      },
      {
        "name": "birth_date",
        "type": "date",
        "nullable": true,
        "description": "Field for birth date"
      },
      {
        "name": "photo",
        "type": "string",
        "nullable": true,
        "description": "Field for photo"
      },
      {
        "name": "total_spent",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for total spent"
      },
      {
        "name": "order_count",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for order count"
      },
      {
        "name": "loyalty_points",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for loyalty points"
      },
      {
        "name": "tax_number",
        "type": "string",
        "nullable": true,
        "description": "Field for tax number"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "user_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for user id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/customers"
    ]
  },
  {
    "name": "customer_addresses",
    "category": "Core System",
    "purpose": "Stores relational records for customer addresses entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ customer addresses ក្នុងប្រព័ន្ធ",
    "model": "CustomerAddresses",
    "columns": [
      {
        "name": "customer_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "customers",
        "description": "Field for customer id"
      },
      {
        "name": "label",
        "type": "string",
        "nullable": false,
        "description": "Field for label"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "phone",
        "type": "string",
        "nullable": false,
        "description": "Field for phone"
      },
      {
        "name": "address",
        "type": "text",
        "nullable": false,
        "description": "Field for address"
      },
      {
        "name": "city",
        "type": "string",
        "nullable": false,
        "description": "Field for city"
      },
      {
        "name": "province",
        "type": "string",
        "nullable": false,
        "description": "Field for province"
      },
      {
        "name": "country",
        "type": "string",
        "nullable": false,
        "default": "ID",
        "description": "Field for country"
      },
      {
        "name": "postal_code",
        "type": "string",
        "nullable": false,
        "description": "Field for postal code"
      },
      {
        "name": "latitude",
        "type": "decimal(10, 8)",
        "nullable": true,
        "description": "Field for latitude"
      },
      {
        "name": "longitude",
        "type": "decimal(11, 8)",
        "nullable": true,
        "description": "Field for longitude"
      },
      {
        "name": "is_default",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is default"
      },
      {
        "name": "customer_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for customer id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/customer-addresses"
    ]
  },
  {
    "name": "payment_methods",
    "category": "Finance & Accounting",
    "purpose": "Stores relational records for payment methods entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ payment methods ក្នុងប្រព័ន្ធ",
    "model": "PaymentMethods",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "type",
        "type": "enum(['cash', 'bank_transfer', 'credit_card', 'debit_card', 'ewallet', 'qris', 'other'])",
        "nullable": false,
        "description": "Field for type"
      },
      {
        "name": "logo",
        "type": "string",
        "nullable": true,
        "description": "Field for logo"
      },
      {
        "name": "config",
        "type": "json",
        "nullable": true,
        "description": "Field for config"
      },
      {
        "name": "fee_percent",
        "type": "decimal(8, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for fee percent"
      },
      {
        "name": "fee_fixed",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for fee fixed"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "available_pos",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for available pos"
      },
      {
        "name": "available_online",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for available online"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/payment-methods"
    ]
  },
  {
    "name": "sales",
    "category": "Sales & POS",
    "purpose": "Stores relational records for sales entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ sales ក្នុងប្រព័ន្ធ",
    "model": "Sales",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "store_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "stores",
        "description": "Field for store id"
      },
      {
        "name": "warehouse_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "warehouses",
        "description": "Field for warehouse id"
      },
      {
        "name": "customer_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "customers",
        "description": "Field for customer id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "invoice_number",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for invoice number"
      },
      {
        "name": "date",
        "type": "dateTime",
        "nullable": false,
        "description": "Field for date"
      },
      {
        "name": "status",
        "type": "enum(['pending', 'completed', 'cancelled', 'refunded'])",
        "nullable": false,
        "default": "completed",
        "description": "Field for status"
      },
      {
        "name": "subtotal",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for subtotal"
      },
      {
        "name": "tax_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for tax amount"
      },
      {
        "name": "discount_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount amount"
      },
      {
        "name": "grand_total",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for grand total"
      },
      {
        "name": "paid_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for paid amount"
      },
      {
        "name": "change_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for change amount"
      },
      {
        "name": "currency_code",
        "type": "string(10)",
        "nullable": false,
        "default": "IDR",
        "description": "Field for currency code"
      },
      {
        "name": "payment_method_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "payment_methods",
        "description": "Field for payment method id"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "customer_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for customer id"
      },
      {
        "name": "invoice_number",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for invoice number"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/sales"
    ]
  },
  {
    "name": "sale_items",
    "category": "Sales & POS",
    "purpose": "Stores relational records for sale items entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ sale items ក្នុងប្រព័ន្ធ",
    "model": "SaleItems",
    "columns": [
      {
        "name": "sale_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "sales",
        "description": "Field for sale id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "product_name",
        "type": "string",
        "nullable": false,
        "description": "Field for product name"
      },
      {
        "name": "sku",
        "type": "string",
        "nullable": false,
        "description": "Field for sku"
      },
      {
        "name": "quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "description": "Field for quantity"
      },
      {
        "name": "unit_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for unit price"
      },
      {
        "name": "discount_percent",
        "type": "decimal(8, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount percent"
      },
      {
        "name": "discount_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount amount"
      },
      {
        "name": "tax_percent",
        "type": "decimal(8, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for tax percent"
      },
      {
        "name": "tax_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for tax amount"
      },
      {
        "name": "subtotal",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for subtotal"
      },
      {
        "name": "total",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for total"
      },
      {
        "name": "sale_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for sale id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/sale-items"
    ]
  },
  {
    "name": "sale_returns",
    "category": "Sales & POS",
    "purpose": "Stores relational records for sale returns entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ sale returns ក្នុងប្រព័ន្ធ",
    "model": "SaleReturns",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "sale_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "sales",
        "description": "Field for sale id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "reference_number",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for reference number"
      },
      {
        "name": "date",
        "type": "dateTime",
        "nullable": false,
        "description": "Field for date"
      },
      {
        "name": "total_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for total amount"
      },
      {
        "name": "refund_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for refund amount"
      },
      {
        "name": "refund_method",
        "type": "enum(['cash', 'store_credit', 'original_payment'])",
        "nullable": false,
        "default": "cash",
        "description": "Field for refund method"
      },
      {
        "name": "reason",
        "type": "text",
        "nullable": true,
        "description": "Field for reason"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'approved', 'cancelled'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/sale-returns"
    ]
  },
  {
    "name": "sale_return_items",
    "category": "Sales & POS",
    "purpose": "Stores relational records for sale return items entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ sale return items ក្នុងប្រព័ន្ធ",
    "model": "SaleReturnItems",
    "columns": [
      {
        "name": "sale_return_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "sale_returns",
        "description": "Field for sale return id"
      },
      {
        "name": "sale_item_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "sale_items",
        "description": "Field for sale item id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "description": "Field for quantity"
      },
      {
        "name": "unit_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for unit price"
      },
      {
        "name": "total",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for total"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "sale_return_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for sale return id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/sale-return-items"
    ]
  },
  {
    "name": "cash_registers",
    "category": "Sales & POS",
    "purpose": "Stores relational records for cash registers entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ cash registers ក្នុងប្រព័ន្ធ",
    "model": "CashRegisters",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "store_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "stores",
        "description": "Field for store id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/cash-registers"
    ]
  },
  {
    "name": "cash_register_transactions",
    "category": "Sales & POS",
    "purpose": "Stores relational records for cash register transactions entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ cash register transactions ក្នុងប្រព័ន្ធ",
    "model": "CashRegisterTransactions",
    "columns": [
      {
        "name": "cash_register_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "cash_registers",
        "description": "Field for cash register id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "type",
        "type": "enum(['open', 'close', 'cash_in', 'cash_out', 'sale', 'refund'])",
        "nullable": false,
        "description": "Field for type"
      },
      {
        "name": "amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for amount"
      },
      {
        "name": "balance_before",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for balance before"
      },
      {
        "name": "balance_after",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for balance after"
      },
      {
        "name": "reference_type",
        "type": "string",
        "nullable": true,
        "description": "Field for reference type"
      },
      {
        "name": "reference_id",
        "type": "unsignedBigInteger",
        "nullable": true,
        "key": "FK",
        "description": "Field for reference id"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/cash-register-transactions"
    ]
  },
  {
    "name": "shipping_methods",
    "category": "Settings & Shipping",
    "purpose": "Stores relational records for shipping methods entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ shipping methods ក្នុងប្រព័ន្ធ",
    "model": "ShippingMethods",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "provider",
        "type": "string",
        "nullable": true,
        "description": "Field for provider"
      },
      {
        "name": "base_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for base price"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/shipping-methods"
    ]
  },
  {
    "name": "shipping_zones",
    "category": "Settings & Shipping",
    "purpose": "Stores relational records for shipping zones entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ shipping zones ក្នុងប្រព័ន្ធ",
    "model": "ShippingZones",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "countries",
        "type": "json",
        "nullable": true,
        "description": "Field for countries"
      },
      {
        "name": "provinces",
        "type": "json",
        "nullable": true,
        "description": "Field for provinces"
      },
      {
        "name": "cities",
        "type": "json",
        "nullable": true,
        "description": "Field for cities"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/shipping-zones"
    ]
  },
  {
    "name": "shipping_rates",
    "category": "Settings & Shipping",
    "purpose": "Stores relational records for shipping rates entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ shipping rates ក្នុងប្រព័ន្ធ",
    "model": "ShippingRates",
    "columns": [
      {
        "name": "shipping_method_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "shipping_methods",
        "description": "Field for shipping method id"
      },
      {
        "name": "shipping_zone_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "shipping_zones",
        "description": "Field for shipping zone id"
      },
      {
        "name": "min_weight",
        "type": "decimal(10, 3)",
        "nullable": false,
        "default": "0",
        "description": "Field for min weight"
      },
      {
        "name": "max_weight",
        "type": "decimal(10, 3)",
        "nullable": true,
        "description": "Field for max weight"
      },
      {
        "name": "price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for price"
      },
      {
        "name": "estimated_days_min",
        "type": "integer",
        "nullable": true,
        "description": "Field for estimated days min"
      },
      {
        "name": "estimated_days_max",
        "type": "integer",
        "nullable": true,
        "description": "Field for estimated days max"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/shipping-rates"
    ]
  },
  {
    "name": "carts",
    "category": "E-Commerce & Orders",
    "purpose": "Stores relational records for carts entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ carts ក្នុងប្រព័ន្ធ",
    "model": "Carts",
    "columns": [
      {
        "name": "store_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "stores",
        "description": "Field for store id"
      },
      {
        "name": "customer_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "customers",
        "description": "Field for customer id"
      },
      {
        "name": "session_id",
        "type": "string",
        "nullable": true,
        "key": "FK",
        "description": "Field for session id"
      },
      {
        "name": "currency_code",
        "type": "string(10)",
        "nullable": false,
        "default": "IDR",
        "description": "Field for currency code"
      },
      {
        "name": "session_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for session id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/carts"
    ]
  },
  {
    "name": "cart_items",
    "category": "E-Commerce & Orders",
    "purpose": "Stores relational records for cart items entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ cart items ក្នុងប្រព័ន្ធ",
    "model": "CartItems",
    "columns": [
      {
        "name": "cart_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "carts",
        "description": "Field for cart id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "default": "1",
        "description": "Field for quantity"
      },
      {
        "name": "unit_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for unit price"
      },
      {
        "name": "cart_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for cart id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/cart-items"
    ]
  },
  {
    "name": "wishlists",
    "category": "E-Commerce & Orders",
    "purpose": "Stores relational records for wishlists entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ wishlists ក្នុងប្រព័ន្ធ",
    "model": "Wishlists",
    "columns": [
      {
        "name": "customer_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "customers",
        "description": "Field for customer id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/wishlists"
    ]
  },
  {
    "name": "orders",
    "category": "E-Commerce & Orders",
    "purpose": "Stores relational records for orders entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ orders ក្នុងប្រព័ន្ធ",
    "model": "Orders",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "store_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "stores",
        "description": "Field for store id"
      },
      {
        "name": "customer_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "customers",
        "description": "Field for customer id"
      },
      {
        "name": "warehouse_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "warehouses",
        "description": "Field for warehouse id"
      },
      {
        "name": "order_number",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for order number"
      },
      {
        "name": "status",
        "type": "enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'])",
        "nullable": false,
        "default": "pending",
        "description": "Field for status"
      },
      {
        "name": "payment_status",
        "type": "enum(['unpaid', 'partial', 'paid', 'refunded'])",
        "nullable": false,
        "default": "unpaid",
        "description": "Field for payment status"
      },
      {
        "name": "fulfillment_status",
        "type": "enum(['unfulfilled', 'partial', 'fulfilled'])",
        "nullable": false,
        "default": "unfulfilled",
        "description": "Field for fulfillment status"
      },
      {
        "name": "shipping_name",
        "type": "string",
        "nullable": true,
        "description": "Field for shipping name"
      },
      {
        "name": "shipping_phone",
        "type": "string",
        "nullable": true,
        "description": "Field for shipping phone"
      },
      {
        "name": "shipping_address",
        "type": "text",
        "nullable": true,
        "description": "Field for shipping address"
      },
      {
        "name": "shipping_city",
        "type": "string",
        "nullable": true,
        "description": "Field for shipping city"
      },
      {
        "name": "shipping_province",
        "type": "string",
        "nullable": true,
        "description": "Field for shipping province"
      },
      {
        "name": "shipping_country",
        "type": "string",
        "nullable": true,
        "description": "Field for shipping country"
      },
      {
        "name": "shipping_postal_code",
        "type": "string",
        "nullable": true,
        "description": "Field for shipping postal code"
      },
      {
        "name": "shipping_method_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "shipping_methods",
        "description": "Field for shipping method id"
      },
      {
        "name": "shipping_cost",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for shipping cost"
      },
      {
        "name": "subtotal",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for subtotal"
      },
      {
        "name": "tax_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for tax amount"
      },
      {
        "name": "discount_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount amount"
      },
      {
        "name": "grand_total",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for grand total"
      },
      {
        "name": "paid_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for paid amount"
      },
      {
        "name": "coupon_code",
        "type": "string",
        "nullable": true,
        "description": "Field for coupon code"
      },
      {
        "name": "currency_code",
        "type": "string(10)",
        "nullable": false,
        "default": "IDR",
        "description": "Field for currency code"
      },
      {
        "name": "exchange_rate",
        "type": "decimal(15, 6)",
        "nullable": false,
        "default": "1",
        "description": "Field for exchange rate"
      },
      {
        "name": "customer_notes",
        "type": "text",
        "nullable": true,
        "description": "Field for customer notes"
      },
      {
        "name": "admin_notes",
        "type": "text",
        "nullable": true,
        "description": "Field for admin notes"
      },
      {
        "name": "customer_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for customer id"
      },
      {
        "name": "order_number",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for order number"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/orders"
    ]
  },
  {
    "name": "order_items",
    "category": "E-Commerce & Orders",
    "purpose": "Stores relational records for order items entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ order items ក្នុងប្រព័ន្ធ",
    "model": "OrderItems",
    "columns": [
      {
        "name": "order_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "orders",
        "description": "Field for order id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "product_name",
        "type": "string",
        "nullable": false,
        "description": "Field for product name"
      },
      {
        "name": "product_sku",
        "type": "string",
        "nullable": false,
        "description": "Field for product sku"
      },
      {
        "name": "product_image",
        "type": "string",
        "nullable": true,
        "description": "Field for product image"
      },
      {
        "name": "quantity",
        "type": "decimal(15, 4)",
        "nullable": false,
        "description": "Field for quantity"
      },
      {
        "name": "unit_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for unit price"
      },
      {
        "name": "discount_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount amount"
      },
      {
        "name": "tax_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for tax amount"
      },
      {
        "name": "subtotal",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for subtotal"
      },
      {
        "name": "total",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for total"
      },
      {
        "name": "order_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for order id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/order-items"
    ]
  },
  {
    "name": "order_status_histories",
    "category": "E-Commerce & Orders",
    "purpose": "Stores relational records for order status histories entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ order status histories ក្នុងប្រព័ន្ធ",
    "model": "OrderStatusHistories",
    "columns": [
      {
        "name": "order_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "orders",
        "description": "Field for order id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "status",
        "type": "string",
        "nullable": false,
        "description": "Field for status"
      },
      {
        "name": "comment",
        "type": "text",
        "nullable": true,
        "description": "Field for comment"
      },
      {
        "name": "notify_customer",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for notify customer"
      },
      {
        "name": "order_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for order id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/order-status-histories"
    ]
  },
  {
    "name": "shipments",
    "category": "E-Commerce & Orders",
    "purpose": "Stores relational records for shipments entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ shipments ក្នុងប្រព័ន្ធ",
    "model": "Shipments",
    "columns": [
      {
        "name": "order_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "orders",
        "description": "Field for order id"
      },
      {
        "name": "shipping_method_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "shipping_methods",
        "description": "Field for shipping method id"
      },
      {
        "name": "tracking_number",
        "type": "string",
        "nullable": true,
        "description": "Field for tracking number"
      },
      {
        "name": "carrier",
        "type": "string",
        "nullable": true,
        "description": "Field for carrier"
      },
      {
        "name": "status",
        "type": "enum(['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'])",
        "nullable": false,
        "default": "pending",
        "description": "Field for status"
      },
      {
        "name": "shipped_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for shipped at"
      },
      {
        "name": "delivered_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for delivered at"
      },
      {
        "name": "order_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for order id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/shipments"
    ]
  },
  {
    "name": "payments",
    "category": "Finance & Accounting",
    "purpose": "Stores relational records for payments entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ payments ក្នុងប្រព័ន្ធ",
    "model": "Payments",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "payment_method_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "payment_methods",
        "description": "Field for payment method id"
      },
      {
        "name": "payable_type",
        "type": "string",
        "nullable": false,
        "description": "Field for payable type"
      },
      {
        "name": "payable_id",
        "type": "unsignedBigInteger",
        "nullable": false,
        "key": "FK",
        "description": "Field for payable id"
      },
      {
        "name": "transaction_id",
        "type": "string",
        "nullable": true,
        "key": "UNIQUE",
        "description": "Field for transaction id"
      },
      {
        "name": "reference_number",
        "type": "string",
        "nullable": true,
        "description": "Field for reference number"
      },
      {
        "name": "amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for amount"
      },
      {
        "name": "fee_amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for fee amount"
      },
      {
        "name": "currency_code",
        "type": "string(10)",
        "nullable": false,
        "default": "IDR",
        "description": "Field for currency code"
      },
      {
        "name": "status",
        "type": "enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'])",
        "nullable": false,
        "default": "pending",
        "description": "Field for status"
      },
      {
        "name": "gateway_response",
        "type": "json",
        "nullable": true,
        "description": "Field for gateway response"
      },
      {
        "name": "paid_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for paid at"
      },
      {
        "name": "notes",
        "type": "text",
        "nullable": true,
        "description": "Field for notes"
      },
      {
        "name": "status",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for status"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/payments"
    ]
  },
  {
    "name": "transactions",
    "category": "Finance & Accounting",
    "purpose": "Stores relational records for transactions entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ transactions ក្នុងប្រព័ន្ធ",
    "model": "Transactions",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "payment_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "payments",
        "description": "Field for payment id"
      },
      {
        "name": "type",
        "type": "string",
        "nullable": false,
        "description": "Field for type"
      },
      {
        "name": "amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for amount"
      },
      {
        "name": "description",
        "type": "string",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "reference_type",
        "type": "string",
        "nullable": true,
        "description": "Field for reference type"
      },
      {
        "name": "reference_id",
        "type": "unsignedBigInteger",
        "nullable": true,
        "key": "FK",
        "description": "Field for reference id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/transactions"
    ]
  },
  {
    "name": "coupons",
    "category": "Marketing & Promotions",
    "purpose": "Stores relational records for coupons entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ coupons ក្នុងប្រព័ន្ធ",
    "model": "Coupons",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "type",
        "type": "enum(['percentage', 'fixed', 'free_shipping'])",
        "nullable": false,
        "default": "percentage",
        "description": "Field for type"
      },
      {
        "name": "value",
        "type": "decimal(15, 2)",
        "nullable": false,
        "default": "0",
        "description": "Field for value"
      },
      {
        "name": "min_purchase",
        "type": "decimal(15, 2)",
        "nullable": true,
        "description": "Field for min purchase"
      },
      {
        "name": "max_discount",
        "type": "decimal(15, 2)",
        "nullable": true,
        "description": "Field for max discount"
      },
      {
        "name": "usage_limit",
        "type": "integer",
        "nullable": true,
        "description": "Field for usage limit"
      },
      {
        "name": "usage_limit_per_customer",
        "type": "integer",
        "nullable": true,
        "description": "Field for usage limit per customer"
      },
      {
        "name": "used_count",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for used count"
      },
      {
        "name": "starts_at",
        "type": "dateTime",
        "nullable": true,
        "description": "Field for starts at"
      },
      {
        "name": "expires_at",
        "type": "dateTime",
        "nullable": true,
        "description": "Field for expires at"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      },
      {
        "name": "company_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for company id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/coupons"
    ]
  },
  {
    "name": "coupon_products",
    "category": "Marketing & Promotions",
    "purpose": "Stores relational records for coupon products entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ coupon products ក្នុងប្រព័ន្ធ",
    "model": "CouponProducts",
    "columns": [
      {
        "name": "coupon_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "coupons",
        "description": "Field for coupon id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/coupon-products"
    ]
  },
  {
    "name": "flash_sales",
    "category": "Marketing & Promotions",
    "purpose": "Stores relational records for flash sales entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ flash sales ក្នុងប្រព័ន្ធ",
    "model": "FlashSales",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "starts_at",
        "type": "dateTime",
        "nullable": false,
        "description": "Field for starts at"
      },
      {
        "name": "ends_at",
        "type": "dateTime",
        "nullable": false,
        "description": "Field for ends at"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/flash-sales"
    ]
  },
  {
    "name": "flash_sale_products",
    "category": "Marketing & Promotions",
    "purpose": "Stores relational records for flash sale products entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ flash sale products ក្នុងប្រព័ន្ធ",
    "model": "FlashSaleProducts",
    "columns": [
      {
        "name": "flash_sale_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "flash_sales",
        "description": "Field for flash sale id"
      },
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "product_variant_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "product_variants",
        "description": "Field for product variant id"
      },
      {
        "name": "flash_price",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for flash price"
      },
      {
        "name": "discount_percent",
        "type": "decimal(8, 4)",
        "nullable": false,
        "default": "0",
        "description": "Field for discount percent"
      },
      {
        "name": "quota",
        "type": "integer",
        "nullable": true,
        "description": "Field for quota"
      },
      {
        "name": "sold_count",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for sold count"
      },
      {
        "name": "flash_sale_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for flash sale id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/flash-sale-products"
    ]
  },
  {
    "name": "promotions",
    "category": "Marketing & Promotions",
    "purpose": "Stores relational records for promotions entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ promotions ក្នុងប្រព័ន្ធ",
    "model": "Promotions",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "type",
        "type": "enum(['buy_x_get_y', 'bundle', 'percentage', 'fixed', 'free_item'])",
        "nullable": false,
        "description": "Field for type"
      },
      {
        "name": "conditions",
        "type": "json",
        "nullable": true,
        "description": "Field for conditions"
      },
      {
        "name": "rewards",
        "type": "json",
        "nullable": true,
        "description": "Field for rewards"
      },
      {
        "name": "starts_at",
        "type": "dateTime",
        "nullable": true,
        "description": "Field for starts at"
      },
      {
        "name": "ends_at",
        "type": "dateTime",
        "nullable": true,
        "description": "Field for ends at"
      },
      {
        "name": "priority",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for priority"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/promotions"
    ]
  },
  {
    "name": "banners",
    "category": "CMS & Content",
    "purpose": "Stores relational records for banners entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ banners ក្នុងប្រព័ន្ធ",
    "model": "Banners",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "store_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "stores",
        "description": "Field for store id"
      },
      {
        "name": "title",
        "type": "string",
        "nullable": false,
        "description": "Field for title"
      },
      {
        "name": "subtitle",
        "type": "string",
        "nullable": true,
        "description": "Field for subtitle"
      },
      {
        "name": "image",
        "type": "string",
        "nullable": false,
        "description": "Field for image"
      },
      {
        "name": "mobile_image",
        "type": "string",
        "nullable": true,
        "description": "Field for mobile image"
      },
      {
        "name": "link",
        "type": "string",
        "nullable": true,
        "description": "Field for link"
      },
      {
        "name": "position",
        "type": "enum(['hero', 'sidebar', 'popup', 'footer'])",
        "nullable": false,
        "default": "hero",
        "description": "Field for position"
      },
      {
        "name": "sort_order",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for sort order"
      },
      {
        "name": "starts_at",
        "type": "dateTime",
        "nullable": true,
        "description": "Field for starts at"
      },
      {
        "name": "ends_at",
        "type": "dateTime",
        "nullable": true,
        "description": "Field for ends at"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/banners"
    ]
  },
  {
    "name": "product_reviews",
    "category": "Product Catalog",
    "purpose": "Stores relational records for product reviews entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ product reviews ក្នុងប្រព័ន្ធ",
    "model": "ProductReviews",
    "columns": [
      {
        "name": "product_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "products",
        "description": "Field for product id"
      },
      {
        "name": "customer_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "customers",
        "description": "Field for customer id"
      },
      {
        "name": "order_item_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "order_items",
        "description": "Field for order item id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "email",
        "type": "string",
        "nullable": true,
        "description": "Field for email"
      },
      {
        "name": "rating",
        "type": "unsignedTinyInteger",
        "nullable": false,
        "description": "Field for rating"
      },
      {
        "name": "title",
        "type": "string",
        "nullable": true,
        "description": "Field for title"
      },
      {
        "name": "body",
        "type": "text",
        "nullable": false,
        "description": "Field for body"
      },
      {
        "name": "status",
        "type": "enum(['pending', 'approved', 'rejected'])",
        "nullable": false,
        "default": "pending",
        "description": "Field for status"
      },
      {
        "name": "is_verified_purchase",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is verified purchase"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/product-reviews"
    ]
  },
  {
    "name": "review_images",
    "category": "Core System",
    "purpose": "Stores relational records for review images entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ review images ក្នុងប្រព័ន្ធ",
    "model": "ReviewImages",
    "columns": [
      {
        "name": "product_review_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "product_reviews",
        "description": "Field for product review id"
      },
      {
        "name": "image",
        "type": "string",
        "nullable": false,
        "description": "Field for image"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/review-images"
    ]
  },
  {
    "name": "expense_categories",
    "category": "Finance & Accounting",
    "purpose": "Stores relational records for expense categories entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ expense categories ក្នុងប្រព័ន្ធ",
    "model": "ExpenseCategories",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": true,
        "description": "Field for code"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/expense-categories"
    ]
  },
  {
    "name": "expenses",
    "category": "Finance & Accounting",
    "purpose": "Stores relational records for expenses entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ expenses ក្នុងប្រព័ន្ធ",
    "model": "Expenses",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "expense_category_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "expense_categorys",
        "description": "Field for expense category id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "reference_number",
        "type": "string",
        "nullable": true,
        "description": "Field for reference number"
      },
      {
        "name": "title",
        "type": "string",
        "nullable": false,
        "description": "Field for title"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "amount",
        "type": "decimal(15, 2)",
        "nullable": false,
        "description": "Field for amount"
      },
      {
        "name": "date",
        "type": "date",
        "nullable": false,
        "description": "Field for date"
      },
      {
        "name": "receipt",
        "type": "string",
        "nullable": true,
        "description": "Field for receipt"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'approved', 'rejected', 'paid'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/expenses"
    ]
  },
  {
    "name": "currencies",
    "category": "Settings & Shipping",
    "purpose": "Stores relational records for currencies entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ currencies ក្នុងប្រព័ន្ធ",
    "model": "Currencies",
    "columns": [
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string(10)",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "symbol",
        "type": "string(10)",
        "nullable": false,
        "description": "Field for symbol"
      },
      {
        "name": "exchange_rate",
        "type": "decimal(15, 6)",
        "nullable": false,
        "default": "1",
        "description": "Field for exchange rate"
      },
      {
        "name": "is_default",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is default"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/currencies"
    ]
  },
  {
    "name": "languages",
    "category": "Settings & Shipping",
    "purpose": "Stores relational records for languages entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ languages ក្នុងប្រព័ន្ធ",
    "model": "Languages",
    "columns": [
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string(10)",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "flag",
        "type": "string",
        "nullable": true,
        "description": "Field for flag"
      },
      {
        "name": "direction",
        "type": "enum(['ltr', 'rtl'])",
        "nullable": false,
        "default": "ltr",
        "description": "Field for direction"
      },
      {
        "name": "is_default",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is default"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/languages"
    ]
  },
  {
    "name": "countries",
    "category": "Settings & Shipping",
    "purpose": "Stores relational records for countries entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ countries ក្នុងប្រព័ន្ធ",
    "model": "Countries",
    "columns": [
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string(5)",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "phone_code",
        "type": "string(10)",
        "nullable": true,
        "description": "Field for phone code"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/countries"
    ]
  },
  {
    "name": "provinces",
    "category": "Settings & Shipping",
    "purpose": "Stores relational records for provinces entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ provinces ក្នុងប្រព័ន្ធ",
    "model": "Provinces",
    "columns": [
      {
        "name": "country_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "countrys",
        "description": "Field for country id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "code",
        "type": "string",
        "nullable": true,
        "description": "Field for code"
      },
      {
        "name": "country_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for country id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/provinces"
    ]
  },
  {
    "name": "cities",
    "category": "Settings & Shipping",
    "purpose": "Stores relational records for cities entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ cities ក្នុងប្រព័ន្ធ",
    "model": "Cities",
    "columns": [
      {
        "name": "province_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "provinces",
        "description": "Field for province id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "type",
        "type": "string",
        "nullable": true,
        "description": "Field for type"
      },
      {
        "name": "postal_code",
        "type": "string",
        "nullable": true,
        "description": "Field for postal code"
      },
      {
        "name": "province_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for province id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/cities"
    ]
  },
  {
    "name": "settings",
    "category": "Settings & Shipping",
    "purpose": "Stores relational records for settings entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ settings ក្នុងប្រព័ន្ធ",
    "model": "Settings",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "key",
        "type": "string",
        "nullable": false,
        "description": "Field for key"
      },
      {
        "name": "value",
        "type": "longText",
        "nullable": true,
        "description": "Field for value"
      },
      {
        "name": "type",
        "type": "string",
        "nullable": false,
        "default": "string",
        "description": "Field for type"
      },
      {
        "name": "group",
        "type": "string",
        "nullable": false,
        "default": "general",
        "description": "Field for group"
      },
      {
        "name": "is_public",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is public"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/settings"
    ]
  },
  {
    "name": "blog_categories",
    "category": "CMS & Content",
    "purpose": "Stores relational records for blog categories entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ blog categories ក្នុងប្រព័ន្ធ",
    "model": "BlogCategories",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "slug",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for slug"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/blog-categories"
    ]
  },
  {
    "name": "blog_tags",
    "category": "CMS & Content",
    "purpose": "Stores relational records for blog tags entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ blog tags ក្នុងប្រព័ន្ធ",
    "model": "BlogTags",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "slug",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for slug"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/blog-tags"
    ]
  },
  {
    "name": "blogs",
    "category": "CMS & Content",
    "purpose": "Stores relational records for blogs entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ blogs ក្នុងប្រព័ន្ធ",
    "model": "Blogs",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "blog_category_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "blog_categorys",
        "description": "Field for blog category id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "title",
        "type": "string",
        "nullable": false,
        "description": "Field for title"
      },
      {
        "name": "slug",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for slug"
      },
      {
        "name": "excerpt",
        "type": "text",
        "nullable": true,
        "description": "Field for excerpt"
      },
      {
        "name": "content",
        "type": "longText",
        "nullable": true,
        "description": "Field for content"
      },
      {
        "name": "featured_image",
        "type": "string",
        "nullable": true,
        "description": "Field for featured image"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'published', 'archived'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      },
      {
        "name": "published_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for published at"
      },
      {
        "name": "view_count",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for view count"
      },
      {
        "name": "meta_title",
        "type": "string",
        "nullable": true,
        "description": "Field for meta title"
      },
      {
        "name": "meta_description",
        "type": "text",
        "nullable": true,
        "description": "Field for meta description"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/blogs"
    ]
  },
  {
    "name": "blog_blog_tag",
    "category": "CMS & Content",
    "purpose": "Stores relational records for blog blog tag entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ blog blog tag ក្នុងប្រព័ន្ធ",
    "model": "BlogBlogTag",
    "columns": [
      {
        "name": "blog_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "blogs",
        "description": "Field for blog id"
      },
      {
        "name": "blog_tag_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "blog_tags",
        "description": "Field for blog tag id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/blog-blog-tag"
    ]
  },
  {
    "name": "pages",
    "category": "CMS & Content",
    "purpose": "Stores relational records for pages entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ pages ក្នុងប្រព័ន្ធ",
    "model": "Pages",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "title",
        "type": "string",
        "nullable": false,
        "description": "Field for title"
      },
      {
        "name": "slug",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for slug"
      },
      {
        "name": "content",
        "type": "longText",
        "nullable": true,
        "description": "Field for content"
      },
      {
        "name": "status",
        "type": "enum(['draft', 'published'])",
        "nullable": false,
        "default": "draft",
        "description": "Field for status"
      },
      {
        "name": "meta_title",
        "type": "string",
        "nullable": true,
        "description": "Field for meta title"
      },
      {
        "name": "meta_description",
        "type": "text",
        "nullable": true,
        "description": "Field for meta description"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/pages"
    ]
  },
  {
    "name": "faqs",
    "category": "CMS & Content",
    "purpose": "Stores relational records for faqs entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ faqs ក្នុងប្រព័ន្ធ",
    "model": "Faqs",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "question",
        "type": "string",
        "nullable": false,
        "description": "Field for question"
      },
      {
        "name": "answer",
        "type": "text",
        "nullable": false,
        "description": "Field for answer"
      },
      {
        "name": "category",
        "type": "string",
        "nullable": true,
        "description": "Field for category"
      },
      {
        "name": "sort_order",
        "type": "integer",
        "nullable": false,
        "default": "0",
        "description": "Field for sort order"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/faqs"
    ]
  },
  {
    "name": "media",
    "category": "Core System",
    "purpose": "Stores relational records for media entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ media ក្នុងប្រព័ន្ធ",
    "model": "Media",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "file_name",
        "type": "string",
        "nullable": false,
        "description": "Field for file name"
      },
      {
        "name": "mime_type",
        "type": "string",
        "nullable": true,
        "description": "Field for mime type"
      },
      {
        "name": "path",
        "type": "string",
        "nullable": false,
        "description": "Field for path"
      },
      {
        "name": "disk",
        "type": "string",
        "nullable": false,
        "default": "public",
        "description": "Field for disk"
      },
      {
        "name": "size",
        "type": "unsignedBigInteger",
        "nullable": false,
        "default": "0",
        "description": "Field for size"
      },
      {
        "name": "type",
        "type": "string",
        "nullable": false,
        "default": "image",
        "description": "Field for type"
      },
      {
        "name": "conversions",
        "type": "json",
        "nullable": true,
        "description": "Field for conversions"
      },
      {
        "name": "company_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for company id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/media"
    ]
  },
  {
    "name": "notification_logs",
    "category": "Notifications",
    "purpose": "Stores relational records for notification logs entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ notification logs ក្នុងប្រព័ន្ធ",
    "model": "NotificationLogs",
    "columns": [
      {
        "name": "notification_id",
        "type": "unsignedBigInteger",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for notification id"
      },
      {
        "name": "user_id",
        "type": "unsignedBigInteger",
        "nullable": true,
        "key": "INDEX",
        "description": "Field for user id"
      },
      {
        "name": "channel",
        "type": "string(50)",
        "nullable": false,
        "default": "database",
        "key": "INDEX",
        "description": "Field for channel"
      },
      {
        "name": "status",
        "type": "string(30)",
        "nullable": false,
        "default": "pending",
        "description": "Field for status"
      },
      {
        "name": "response",
        "type": "text",
        "nullable": true,
        "description": "Field for response"
      },
      {
        "name": "sent_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for sent at"
      },
      {
        "name": "notification_id",
        "type": "foreign",
        "nullable": false,
        "key": "FK",
        "description": "Field for notification id"
      },
      {
        "name": "user_id",
        "type": "foreign",
        "nullable": false,
        "key": "FK",
        "description": "Field for user id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/notification-logs"
    ]
  },
  {
    "name": "login_histories",
    "category": "Security & Audit",
    "purpose": "Stores relational records for login histories entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ login histories ក្នុងប្រព័ន្ធ",
    "model": "LoginHistories",
    "columns": [
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "ip_address",
        "type": "string(45)",
        "nullable": true,
        "description": "Field for ip address"
      },
      {
        "name": "user_agent",
        "type": "string",
        "nullable": true,
        "description": "Field for user agent"
      },
      {
        "name": "device",
        "type": "string",
        "nullable": true,
        "description": "Field for device"
      },
      {
        "name": "browser",
        "type": "string",
        "nullable": true,
        "description": "Field for browser"
      },
      {
        "name": "platform",
        "type": "string",
        "nullable": true,
        "description": "Field for platform"
      },
      {
        "name": "success",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for success"
      },
      {
        "name": "user_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for user id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/login-histories"
    ]
  },
  {
    "name": "audit_logs",
    "category": "Security & Audit",
    "purpose": "Stores relational records for audit logs entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ audit logs ក្នុងប្រព័ន្ធ",
    "model": "AuditLogs",
    "columns": [
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "event",
        "type": "string",
        "nullable": false,
        "description": "Field for event"
      },
      {
        "name": "auditable_type",
        "type": "string",
        "nullable": false,
        "description": "Field for auditable type"
      },
      {
        "name": "auditable_id",
        "type": "unsignedBigInteger",
        "nullable": false,
        "key": "FK",
        "description": "Field for auditable id"
      },
      {
        "name": "old_values",
        "type": "json",
        "nullable": true,
        "description": "Field for old values"
      },
      {
        "name": "new_values",
        "type": "json",
        "nullable": true,
        "description": "Field for new values"
      },
      {
        "name": "url",
        "type": "string",
        "nullable": true,
        "description": "Field for url"
      },
      {
        "name": "ip_address",
        "type": "string(45)",
        "nullable": true,
        "description": "Field for ip address"
      },
      {
        "name": "user_agent",
        "type": "string",
        "nullable": true,
        "description": "Field for user agent"
      },
      {
        "name": "user_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for user id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/audit-logs"
    ]
  },
  {
    "name": "personal_access_tokens",
    "category": "Security & Audit",
    "purpose": "Stores relational records for personal access tokens entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ personal access tokens ក្នុងប្រព័ន្ធ",
    "model": "PersonalAccessTokens",
    "columns": [
      {
        "name": "tokenable",
        "type": "morphs",
        "nullable": false,
        "description": "Field for tokenable"
      },
      {
        "name": "name",
        "type": "text",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "token",
        "type": "string(64)",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for token"
      },
      {
        "name": "abilities",
        "type": "text",
        "nullable": true,
        "description": "Field for abilities"
      },
      {
        "name": "last_used_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for last used at"
      },
      {
        "name": "expires_at",
        "type": "timestamp",
        "nullable": true,
        "key": "INDEX",
        "description": "Field for expires at"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/personal-access-tokens"
    ]
  },
  {
    "name": "shifts",
    "category": "HRM & Attendance",
    "purpose": "Stores relational records for shifts entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ shifts ក្នុងប្រព័ន្ធ",
    "model": "Shifts",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "start_time",
        "type": "time",
        "nullable": false,
        "default": "08:00:00",
        "description": "Field for start time"
      },
      {
        "name": "end_time",
        "type": "time",
        "nullable": false,
        "default": "17:00:00",
        "description": "Field for end time"
      },
      {
        "name": "break_minutes",
        "type": "integer",
        "nullable": false,
        "default": "60",
        "description": "Field for break minutes"
      },
      {
        "name": "late_grace_minutes",
        "type": "integer",
        "nullable": false,
        "default": "10",
        "description": "Field for late grace minutes"
      },
      {
        "name": "max_check_in_time",
        "type": "time",
        "nullable": true,
        "description": "Field for max check in time"
      },
      {
        "name": "min_check_out_time",
        "type": "time",
        "nullable": true,
        "description": "Field for min check out time"
      },
      {
        "name": "max_overtime_minutes",
        "type": "integer",
        "nullable": false,
        "default": "240",
        "description": "Field for max overtime minutes"
      },
      {
        "name": "working_days",
        "type": "json",
        "nullable": true,
        "description": "Field for working days"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/shifts"
    ]
  },
  {
    "name": "employee_devices",
    "category": "HRM & Attendance",
    "purpose": "Stores relational records for employee devices entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ employee devices ក្នុងប្រព័ន្ធ",
    "model": "EmployeeDevices",
    "columns": [
      {
        "name": "employee_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "employees",
        "description": "Field for employee id"
      },
      {
        "name": "device_id",
        "type": "string",
        "nullable": false,
        "key": "FK",
        "description": "Field for device id"
      },
      {
        "name": "device_name",
        "type": "string",
        "nullable": true,
        "description": "Field for device name"
      },
      {
        "name": "device_platform",
        "type": "enum(['android', 'ios', 'web'])",
        "nullable": false,
        "default": "android",
        "description": "Field for device platform"
      },
      {
        "name": "device_ip",
        "type": "string",
        "nullable": true,
        "description": "Field for device ip"
      },
      {
        "name": "is_locked",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is locked"
      },
      {
        "name": "last_used_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for last used at"
      },
      {
        "name": "device_id",
        "type": "index",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for device id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/employee-devices"
    ]
  },
  {
    "name": "attendance_qr_sessions",
    "category": "HRM & Attendance",
    "purpose": "Stores relational records for attendance qr sessions entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ attendance qr sessions ក្នុងប្រព័ន្ធ",
    "model": "AttendanceQrSessions",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "branchs",
        "description": "Field for branch id"
      },
      {
        "name": "shift_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "shifts",
        "description": "Field for shift id"
      },
      {
        "name": "qr_token",
        "type": "text",
        "nullable": false,
        "description": "Field for qr token"
      },
      {
        "name": "random_uuid",
        "type": "uuid",
        "nullable": false,
        "description": "Field for random uuid"
      },
      {
        "name": "secret_signature",
        "type": "string",
        "nullable": false,
        "description": "Field for secret signature"
      },
      {
        "name": "qr_expired_at",
        "type": "timestamp",
        "nullable": false,
        "description": "Field for qr expired at"
      },
      {
        "name": "interval_seconds",
        "type": "integer",
        "nullable": false,
        "default": "30",
        "description": "Field for interval seconds"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/attendance-qr-sessions"
    ]
  },
  {
    "name": "jwt_refresh_tokens",
    "category": "Security & Audit",
    "purpose": "Stores relational records for jwt refresh tokens entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ jwt refresh tokens ក្នុងប្រព័ន្ធ",
    "model": "JwtRefreshTokens",
    "columns": [
      {
        "name": "user_id",
        "type": "foreignId",
        "nullable": false,
        "key": "FK",
        "references": "users",
        "description": "Field for user id"
      },
      {
        "name": "token",
        "type": "string(255)",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for token"
      },
      {
        "name": "device",
        "type": "string",
        "nullable": true,
        "description": "Field for device"
      },
      {
        "name": "browser",
        "type": "string",
        "nullable": true,
        "description": "Field for browser"
      },
      {
        "name": "os",
        "type": "string",
        "nullable": true,
        "description": "Field for os"
      },
      {
        "name": "ip_address",
        "type": "string(45)",
        "nullable": true,
        "description": "Field for ip address"
      },
      {
        "name": "expires_at",
        "type": "timestamp",
        "nullable": false,
        "description": "Field for expires at"
      },
      {
        "name": "revoked",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for revoked"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/jwt-refresh-tokens"
    ]
  },
  {
    "name": "notifications",
    "category": "Notifications",
    "purpose": "Stores relational records for notifications entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ notifications ក្នុងប្រព័ន្ធ",
    "model": "Notifications",
    "columns": [
      {
        "name": "company_id",
        "type": "unsignedBigInteger",
        "nullable": true,
        "key": "INDEX",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "unsignedBigInteger",
        "nullable": true,
        "key": "INDEX",
        "description": "Field for branch id"
      },
      {
        "name": "type",
        "type": "string(50)",
        "nullable": false,
        "default": "system",
        "key": "INDEX",
        "description": "Field for type"
      },
      {
        "name": "title",
        "type": "string",
        "nullable": false,
        "description": "Field for title"
      },
      {
        "name": "message",
        "type": "text",
        "nullable": false,
        "description": "Field for message"
      },
      {
        "name": "icon",
        "type": "string(100)",
        "nullable": true,
        "description": "Field for icon"
      },
      {
        "name": "color",
        "type": "string(50)",
        "nullable": true,
        "description": "Field for color"
      },
      {
        "name": "priority",
        "type": "string(20)",
        "nullable": false,
        "default": "normal",
        "key": "INDEX",
        "description": "Field for priority"
      },
      {
        "name": "image",
        "type": "string",
        "nullable": true,
        "description": "Field for image"
      },
      {
        "name": "action_url",
        "type": "string",
        "nullable": true,
        "description": "Field for action url"
      },
      {
        "name": "reference_type",
        "type": "string(100)",
        "nullable": true,
        "key": "INDEX",
        "description": "Field for reference type"
      },
      {
        "name": "reference_id",
        "type": "string(100)",
        "nullable": true,
        "key": "INDEX",
        "description": "Field for reference id"
      },
      {
        "name": "created_by",
        "type": "unsignedBigInteger",
        "nullable": true,
        "description": "Field for created by"
      },
      {
        "name": "expires_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for expires at"
      },
      {
        "name": "is_global",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is global"
      },
      {
        "name": "status",
        "type": "string(30)",
        "nullable": false,
        "default": "sent",
        "key": "INDEX",
        "description": "Field for status"
      },
      {
        "name": "company_id",
        "type": "foreign",
        "nullable": false,
        "key": "FK",
        "description": "Field for company id"
      },
      {
        "name": "branch_id",
        "type": "foreign",
        "nullable": false,
        "key": "FK",
        "description": "Field for branch id"
      },
      {
        "name": "created_by",
        "type": "foreign",
        "nullable": false,
        "description": "Field for created by"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/notifications"
    ]
  },
  {
    "name": "notification_users",
    "category": "Notifications",
    "purpose": "Stores relational records for notification users entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ notification users ក្នុងប្រព័ន្ធ",
    "model": "NotificationUsers",
    "columns": [
      {
        "name": "notification_id",
        "type": "unsignedBigInteger",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for notification id"
      },
      {
        "name": "user_id",
        "type": "unsignedBigInteger",
        "nullable": false,
        "key": "INDEX",
        "description": "Field for user id"
      },
      {
        "name": "is_read",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is read"
      },
      {
        "name": "read_at",
        "type": "timestamp",
        "nullable": true,
        "description": "Field for read at"
      },
      {
        "name": "is_archived",
        "type": "boolean",
        "nullable": false,
        "default": "false",
        "description": "Field for is archived"
      },
      {
        "name": "notification_id",
        "type": "foreign",
        "nullable": false,
        "key": "FK",
        "description": "Field for notification id"
      },
      {
        "name": "user_id",
        "type": "foreign",
        "nullable": false,
        "key": "FK",
        "description": "Field for user id"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/notification-users"
    ]
  },
  {
    "name": "notification_templates",
    "category": "Notifications",
    "purpose": "Stores relational records for notification templates entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ notification templates ក្នុងប្រព័ន្ធ",
    "model": "NotificationTemplates",
    "columns": [
      {
        "name": "code",
        "type": "string(100)",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for code"
      },
      {
        "name": "name",
        "type": "string",
        "nullable": false,
        "description": "Field for name"
      },
      {
        "name": "title_template",
        "type": "string",
        "nullable": false,
        "description": "Field for title template"
      },
      {
        "name": "message_template",
        "type": "text",
        "nullable": false,
        "description": "Field for message template"
      },
      {
        "name": "icon",
        "type": "string(100)",
        "nullable": true,
        "description": "Field for icon"
      },
      {
        "name": "color",
        "type": "string(50)",
        "nullable": true,
        "description": "Field for color"
      },
      {
        "name": "type",
        "type": "string(50)",
        "nullable": false,
        "default": "system",
        "key": "INDEX",
        "description": "Field for type"
      },
      {
        "name": "priority",
        "type": "string(20)",
        "nullable": false,
        "default": "normal",
        "description": "Field for priority"
      },
      {
        "name": "is_active",
        "type": "boolean",
        "nullable": false,
        "default": "true",
        "description": "Field for is active"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/notification-templates"
    ]
  },
  {
    "name": "security_settings",
    "category": "Security & Audit",
    "purpose": "Stores relational records for security settings entity",
    "purposeKh": "តារាងសម្រាប់គ្រប់គ្រងទិន្នន័យ security settings ក្នុងប្រព័ន្ធ",
    "model": "SecuritySettings",
    "columns": [
      {
        "name": "company_id",
        "type": "foreignId",
        "nullable": true,
        "key": "FK",
        "references": "companys",
        "description": "Field for company id"
      },
      {
        "name": "key",
        "type": "string",
        "nullable": false,
        "key": "UNIQUE",
        "description": "Field for key"
      },
      {
        "name": "value",
        "type": "json",
        "nullable": true,
        "description": "Field for value"
      },
      {
        "name": "description",
        "type": "text",
        "nullable": true,
        "description": "Field for description"
      }
    ],
    "relationships": [],
    "usedByFrontend": [
      "admin-dashboard",
      "customer-website",
      "mobile_app"
    ],
    "usedByApi": [
      "/api/v1/security-settings"
    ]
  }
];
