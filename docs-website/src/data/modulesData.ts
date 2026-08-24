import { ModuleDoc } from '../types/docs';

export const ENTERPRISE_MODULES: ModuleDoc[] = [
  {
    "id": "dashboard",
    "name": "Executive Dashboard & Analytics",
    "nameKh": "ផ្ទាំងគ្រប់គ្រងទូទៅ និងការវិភាគទិន្នន័យ (Executive Dashboard)",
    "category": "core",
    "icon": "LayoutDashboard",
    "status": "implemented",
    "overview": "Central administrative dashboard providing real-time multi-branch revenue KPIs, top-selling product metrics, inventory stock alert counters, and recent order transactions across online storefront and POS terminals.",
    "overviewKh": "ផ្ទាំងគ្រប់គ្រងកណ្តាលសម្រាប់តាមដាន KPI ចំណូលលក់តាមសាខានីមួយៗ, ផលិតផលលក់ដាច់បំផុត, ការជូនដំណឹងស្តុកទាប, និងប្រតិបត្តិការបញ្ជាទិញថ្មីៗទាំងពី E-Commerce និង POS Terminal។",
    "purpose": "Gives executives, branch managers, and business owners instantaneous visibility into cross-channel sales performance, low stock warnings, cash register statuses, and pending fulfillment tasks without running manual reports.",
    "purposeKh": "ជួយឱ្យម្ចាស់អាជីវកម្ម និងអ្នកគ្រប់គ្រងមើលឃើញស្ថានភាពលក់តាមពេលវេលាជាក់ស្តែង (Real-time), ការដាស់តឿនស្តុកជិតអស់, ស្ថានភាពកុងទ័រប្រាក់ និងការងារដែលត្រូវរៀបចំបញ្ជូនភ្លាមៗ។",
    "targetUsers": [
      "Super Admin",
      "Branch Manager",
      "Accountant",
      "Business Owner"
    ],
    "mainFeatures": [
      {
        "title": "Multi-Branch Sales Ticker",
        "titleKh": "តារាងតាមដានចំណូលតាមសាខា",
        "status": "implemented",
        "desc": "Real-time sales revenue, cost of goods sold (COGS), gross profit, and net margins.",
        "descKh": "បង្ហាញចំណូលសរុប ថ្លៃដើមទំនិញ (COGS) និងប្រាក់ចំណេញដុលតាមពេលវេលាជាក់ស្តែង។"
      },
      {
        "title": "Low Stock Alert Badge",
        "titleKh": "ការដាស់តឿនទំនិញជិតអស់ពីស្តុក",
        "status": "implemented",
        "desc": "Instant calculation of items below safety threshold across warehouses.",
        "descKh": "រាប់ចំនួនទំនិញដែលនៅសល់ក្រោម Safety Stock ក្នុងឃ្លាំងទាំងអស់។"
      },
      {
        "title": "Top Performing Products Chart",
        "titleKh": "ក្រាហ្វិកផលិតផលលក់ដាច់បំផុត",
        "status": "implemented",
        "desc": "Visual Recharts breakdown of highest velocity SKUs and revenue contribution.",
        "descKh": "បង្ហាញតារាងក្រាហ្វិកផលិតផលដែលមានការបញ្ជាទិញច្រើនជាងគេ។"
      },
      {
        "title": "Recent Transaction Stream",
        "titleKh": "បញ្ជីប្រតិបត្តិការលក់ថ្មីៗ",
        "status": "implemented",
        "desc": "Unified stream of latest POS checkouts and online web orders.",
        "descKh": "បង្ហាញការលក់ចុងក្រោយទាំងពី POS ផ្ទាល់ និងគេហទំព័រអនឡាញ។"
      }
    ],
    "databaseTables": [
      "sales",
      "orders",
      "inventories",
      "products",
      "cash_registers"
    ],
    "models": [
      "Sales/Sale",
      "Order/Order",
      "Inventory/Inventory",
      "Product/Product",
      "POS/CashRegister"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/dashboard/DashboardPage.tsx"
    ],
    "mobileScreens": [
      "mobile_app/lib/features/home/presentation/home_screen.dart"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/dashboard/stats",
        "description": "Fetch consolidated revenue, order count, and customer metrics",
        "auth": true
      },
      {
        "method": "GET",
        "path": "/api/v1/dashboard/charts",
        "description": "Fetch time-series chart data for sales velocity and profit trends",
        "auth": true
      },
      {
        "method": "GET",
        "path": "/api/v1/dashboard/inventory-alerts",
        "description": "Fetch warehouse inventory alerts and out-of-stock items",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Branch Scoping",
        "titleKh": "ការកំណត់វិសាលភាពសាខា",
        "rule": "Non-super-admin users only see aggregated stats for their assigned branch.",
        "ruleKh": "អ្នកប្រើប្រាស់ដែលមិនមែនជា Super Admin អាចមើលឃើញតែទិន្នន័យនៃសាខាដែលខ្លួនត្រូវបានចាត់តាំងប៉ុណ្ណោះ។"
      },
      {
        "title": "Cache Invalidation",
        "titleKh": "ការធ្វើបច្ចុប្បន្នភាព Cache",
        "rule": "Dashboard analytics query results are cached in Redis with a 60-second TTL and evicted on new POS sale or purchase receipt.",
        "ruleKh": "ទិន្នន័យវិភាគ Dashboard ត្រូវបាន Cache ក្នុង Redis រយៈពេល ៦០ វិនាទី និង Update ភ្លាមៗនៅពេលមានការលក់ ឬការទទួលទំនិញចូលស្តុក។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Authenticate User",
        "titleKh": "ចូលគណនីប្រព័ន្ធ",
        "desc": "User signs into admin dashboard with credentials and branch context.",
        "descKh": "បុគ្គលិកវាយបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់ដើម្បីចូលទៅកាន់ប្រព័ន្ធ។",
        "actor": "Authenticated Staff"
      },
      {
        "step": 2,
        "title": "Fetch Metric Batch",
        "titleKh": "ទាញយកទិន្នន័យស្ថិតិ",
        "desc": "Client executes TanStack Query to parallel fetch dashboard stats, chart series, and alerts.",
        "descKh": "ផ្ទាំង Admin ទាញយកទិន្នន័យស្ថិតិ ក្រាហ្វិក និងការដាស់តឿនក្នុងពេលដំណាលគ្នា។",
        "actor": "React Dashboard UI"
      },
      {
        "step": 3,
        "title": "Render Live KPIs",
        "titleKh": "បង្ហាញទិន្នន័យលើអេក្រង់",
        "desc": "Interactive KPI cards, date range filter picker, and branch selector render dynamically.",
        "descKh": "បង្ហាញផ្ទាំងស្ថិតិ កាលបរិច្ឆេទចម្រោះ និងជម្រើសជ្រើសរើសសាខា។",
        "actor": "System"
      }
    ],
    "permissionsRequired": [
      "report.view"
    ],
    "validationRules": [
      {
        "field": "branch_id",
        "rules": "nullable|integer|exists:branches,id",
        "description": "Optional branch filter"
      },
      {
        "field": "date_range",
        "rules": "nullable|in:today,yesterday,7days,30days,this_month,this_year",
        "description": "Predefined aggregation interval"
      }
    ],
    "reportsAvailable": [
      "Executive Sales Summary",
      "Branch Performance Comparison"
    ],
    "notificationsTriggered": [
      "Low Stock Warning Alert",
      "Daily Sales Milestone Target Reached"
    ],
    "commonErrors": [
      {
        "code": "401",
        "problem": "Dashboard returns 401 Unauthorized",
        "solution": "Check if JWT access token has expired or Authorization Bearer header is missing."
      },
      {
        "code": "504",
        "problem": "Dashboard stats loading timeout",
        "solution": "Ensure Redis cache service is running and indexed DB views are properly optimized."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Statistics show zero revenue despite completed POS sales",
        "cause": "User is scoped to a branch with no sales or date filter is set to past date without transactions.",
        "solution": "Switch branch filter to \"All Branches\" or reset date filter to \"Today\"."
      }
    ],
    "behindTheButton": {
      "actionName": "Refresh Dashboard Statistics",
      "steps": [
        {
          "layer": "UI / Frontend",
          "detail": "User clicks date range picker or branch switcher in Dashboard header."
        },
        {
          "layer": "API Request",
          "detail": "TanStack Query dispatches GET /api/v1/dashboard/stats?branch_id=1&period=today"
        },
        {
          "layer": "Middleware / Auth",
          "detail": "AuthTokenMiddleware validates JWT signature and extracts user company/branch scope."
        },
        {
          "layer": "Controller",
          "detail": "DashboardController@stats invokes DashboardMetricsService::calculateSummary()"
        },
        {
          "layer": "Service Layer",
          "detail": "DashboardMetricsService queries Redis cache; on cache-miss executes SQL aggregation queries with eager loaded relations."
        },
        {
          "layer": "UI Response",
          "detail": "Returns JSON payload { total_sales: 14250.00, orders_count: 87, low_stock: 12 }. React updates UI with smooth Framer Motion number transitions."
        }
      ]
    },
    "videoScript": {
      "title": "How to Navigate and Read the Executive Dashboard",
      "duration": "3:45 mins",
      "steps": [
        {
          "order": 1,
          "action": "Open Admin Dashboard",
          "narrationKh": "សូមបើកកម្មវិធី Admin Dashboard រួចសម្លឹងមើលផ្ទាំង Dashboard មេ។",
          "narrationEn": "Open the Admin Dashboard and look at the primary metrics section."
        },
        {
          "order": 2,
          "action": "Inspect KPI Cards",
          "narrationKh": "ពិនិត្យមើលកាតចំនួនលក់សរុប ប្រាក់ចំណេញ និងចំនួនវិក្កយបត្រថ្ងៃនេះ។",
          "narrationEn": "Review the KPI cards showing today's total revenue, profit margins, and invoice count."
        },
        {
          "order": 3,
          "action": "Filter by Branch",
          "narrationKh": "ជ្រើសរើសសាខាដែលអ្នកចង់មើលទិន្នន័យ ដើម្បីប្រៀបធៀបចំណូលលក់ជាក់ស្តែង។",
          "narrationEn": "Select your specific branch from the dropdown to compare localized performance."
        }
      ]
    }
  },
  {
    "id": "pos",
    "name": "High-Speed POS Terminal",
    "nameKh": "ប្រព័ន្ធគិតលុយរហ័ស (High-Speed POS Terminal)",
    "category": "sales",
    "icon": "MonitorCheck",
    "status": "implemented",
    "overview": "Touch-optimized, ultra-responsive Point of Sale (POS) terminal built for retail cashiers. Features instant barcode scanning, QR payments via KHQR (Bakong), multi-currency calculation, cash drawer management, receipt printing, and real-time inventory deduction.",
    "overviewKh": "ប្រព័ន្ធគិតលុយល្បឿនលឿនសម្រាប់អ្នកគិតលុយ (Cashier) គាំទ្រការស្កេន Barcode លើកុំព្យូទ័រ/ទូរស័ព្ទ, ទូទាត់តាម KHQR (Bakong), គិតលុយជាប្រាក់រៀល និងដុល្លារ, បើក/បិទវេនកុងទ័រប្រាក់, បោះពុម្ពវិក្កយបត្រ និងកាត់ស្តុកស្វ័យប្រវត្តិ។",
    "purpose": "Accelerates in-store checkout queues, eliminates cashier human calculation errors, supports local payment schemes like KHQR, and maintains 100% accurate stock records between physical stores and e-commerce warehouse.",
    "purposeKh": "ជួយកាត់បន្ថយការតម្រង់ជួររង់ចាំយូរ គិតប្រាក់បានត្រឹមត្រូវ ១០០% គាំទ្រការស្កេនទូទាត់ KHQR របស់ធនាគារជាតិ និងធ្វើសមកាលកម្មស្តុកទំនិញភ្លាមៗរវាងហាង និងឃ្លាំងកណ្តាល។",
    "targetUsers": [
      "Cashier",
      "Store Manager",
      "Supervisor",
      "Sales Staff"
    ],
    "mainFeatures": [
      {
        "title": "Barcode & QR Camera Scanner",
        "titleKh": "ការស្កេន Barcode & QR Code រហ័ស",
        "status": "implemented",
        "desc": "Supports USB laser scanners, Bluetooth scanners, and HTML5 camera video scan with automatic item insertion to cart.",
        "descKh": "គាំទ្រកាំភ្លើងស្កេន Barcode, ម៉ាស៊ីនស្កេនប៊្លូធូស និងកាមេរ៉ាស្កេនលើទូរស័ព្ទ/Tablet។"
      },
      {
        "title": "Instant KHQR Dynamic Payment",
        "titleKh": "ការបង្កើត QR Code បាគង (KHQR) ស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Generates dynamic National Bank of Cambodia compliant Bakong KHQR code with exact dollar/riel amount and automatic payment verification webhook.",
        "descKh": "បង្កើត KHQR តាមស្តង់ដារធនាគារជាតិនៃកម្ពុជា ជាមួយចំនួនទឹកប្រាក់ជាក់លាក់ និងផ្ទៀងផ្ទាត់ការបង់ប្រាក់ស្វ័យប្រវត្តិ។"
      },
      {
        "title": "Cash Register Shift Management",
        "titleKh": "ការគ្រប់គ្រងវេនកុងទ័រប្រាក់ (Cash Register)",
        "status": "implemented",
        "desc": "Open shift with starting cash float, log cash in/out transactions, and close shift with discrepancy calculation.",
        "descKh": "បើកវេនជាមួយប្រាក់ដើមគ្រា (Float), កត់ត្រាការដក/ដាក់ប្រាក់ និងបិទវេនជាមួយការប្រៀបធៀបប្រាក់ជាក់ស្តែង។"
      },
      {
        "title": "Thermal Receipt Printing (ESC/POS)",
        "titleKh": "ការបោះពុម្ពវិក្កយបត្រលើម៉ាស៊ីន Thermal 80mm/58mm",
        "status": "implemented",
        "desc": "Configurable thermal receipt template with store logo, branch tax number, barcode, and QR code verification link.",
        "descKh": "ទម្រង់វិក្កយបត្រខ្នាតតូច 80mm/58mm ជាមួយ Logo ហាង លេខសម្គាល់ពន្ធ និង Barcode វិក្កយបត្រ។"
      },
      {
        "title": "Product Variants & Attribute Picker",
        "titleKh": "ការជ្រើសរើសទំហំ ពណ៌ និងជម្រើសទំនិញ",
        "status": "implemented",
        "desc": "Modal dialog to quickly pick size, color, storage, and IMEI/serial numbers before adding to sale cart.",
        "descKh": "ផ្ទាំងជ្រើសរើស Option ទំនិញ (ទំហំ ពណ៌ ឬលេខ IMEI) យ៉ាងរលូន។"
      }
    ],
    "databaseTables": [
      "sales",
      "sale_items",
      "cash_registers",
      "cash_register_transactions",
      "inventories",
      "inventory_movements",
      "payments",
      "payment_methods"
    ],
    "models": [
      "Sales/Sale",
      "Sales/SaleItem",
      "POS/CashRegister",
      "POS/CashRegisterTransaction",
      "Inventory/Inventory",
      "Inventory/InventoryMovement",
      "Payment/Payment"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/pos/POSPage.tsx",
      "admin-dashboard/src/pages/pos/CashRegisterPage.tsx"
    ],
    "mobileScreens": [
      "mobile_app/lib/features/pos/presentation/pos_screen.dart"
    ],
    "backendApis": [
      {
        "method": "POST",
        "path": "/api/v1/pos/sales",
        "description": "Process atomic POS checkout and stock deduction",
        "auth": true,
        "permission": "sale.create"
      },
      {
        "method": "GET",
        "path": "/api/v1/pos/products",
        "description": "High-speed indexed product catalog search for POS terminal",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/pos/cash-registers/open",
        "description": "Open new cash register session with initial opening float balance",
        "auth": true,
        "permission": "cash_register.manage"
      },
      {
        "method": "POST",
        "path": "/api/v1/pos/cash-registers/close",
        "description": "Close active register session, audit drawer cash and generate Z-Report",
        "auth": true,
        "permission": "cash_register.manage"
      },
      {
        "method": "POST",
        "path": "/api/v1/pos/sales/{id}/receipt",
        "description": "Generate ESC/POS raw printer thermal commands or PDF receipt",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Negative Stock Prevention",
        "titleKh": "ហាមឃាត់ការលក់លើសចំនួនស្តុកជាក់ស្តែង",
        "rule": "System throws 422 Unprocessable Entity if warehouse stock quantity is less than requested cart quantity unless allow_backorder setting is enabled.",
        "ruleKh": "ប្រព័ន្ធនឹងបដិសេធប្រតិបត្តិការ ប្រសិនបើស្តុកជាក់ស្តែងក្នុងឃ្លាំងមិនគ្រប់គ្រាន់តាមចំនួនដែលចង់លក់។"
      },
      {
        "title": "Atomic Inventory Movement",
        "titleKh": "ការកាត់ស្តុកក្នុង DB Transaction តែមួយ",
        "rule": "Sale record creation and inventory decrement must occur inside DB::transaction() with row-level locking (lockForUpdate) to prevent race conditions during concurrent checkouts.",
        "ruleKh": "ការកត់ត្រាការលក់ និងការដកស្តុកត្រូវធ្វើឡើងក្នុង DB Transaction តែមួយ ជាមួយ Row Lock ដើម្បីការពារការដណ្តើមស្តុកគ្នា។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Cash Register Session",
        "titleKh": "បើកវេនកុងទ័រប្រាក់",
        "desc": "Cashier opens register drawer, enters opening cash float (e.g., $100.00 / 400,000 KHR).",
        "descKh": "អ្នកគិតលុយបើកវេន ដោយបញ្ចូលចំនួនប្រាក់ដើមគ្រាដែលមានក្នុងថតតុ។",
        "actor": "Cashier"
      },
      {
        "step": 2,
        "title": "Select Customer & Branch",
        "titleKh": "ជ្រើសរើសអតិថិជន និងសាខា",
        "desc": "Default Walk-in Customer is auto-selected or cashier searches customer by phone/name to award loyalty points.",
        "descKh": "ជ្រើសរើសអតិថិជនទូទៅ ឬស្វែងរកឈ្មោះ/លេខទូរស័ព្ទអតិថិជនសមាជិក។",
        "actor": "Cashier"
      },
      {
        "step": 3,
        "title": "Scan or Search Items",
        "titleKh": "ស្កេន ឬស្វែងរកទំនិញ",
        "desc": "Cashier scans barcode with USB scanner or types SKU/name; items are added directly to the active cart with tax and discount calculation.",
        "descKh": "ស្កេន Barcode ឬវាយឈ្មោះទំនិញ ដើម្បីបញ្ចូលទៅក្នុងកន្រ្តកលក់។",
        "actor": "Cashier"
      },
      {
        "step": 4,
        "title": "Choose Payment Method & Pay",
        "titleKh": "ជ្រើសរើសវិធីសាស្ត្រទូទាត់ប្រាក់",
        "desc": "Cashier chooses Cash (with change calculator), Card, or generates Bakong Dynamic KHQR.",
        "descKh": "ជ្រើសរើសការទូទាត់ជាសាច់ប្រាក់ ឬស្កេន KHQR។",
        "actor": "Cashier & Customer"
      },
      {
        "step": 5,
        "title": "Print Receipt & Complete",
        "titleKh": "បោះពុម្ពវិក្កយបត្រ និងបញ្ចប់",
        "desc": "System saves sale, decrements warehouse inventory, logs inventory movement, fires sale event, and triggers 80mm thermal receipt print.",
        "descKh": "ប្រព័ន្ធរក្សាទុកការលក់ កាត់ស្តុកឃ្លាំង និងបញ្ជាម៉ាស៊ីនព្រីនឱ្យចេញវិក្កយបត្រភ្លាមៗ។",
        "actor": "System"
      }
    ],
    "permissionsRequired": [
      "sale.create",
      "sale.view",
      "cash_register.view",
      "cash_register.manage",
      "payment.process"
    ],
    "validationRules": [
      {
        "field": "warehouse_id",
        "rules": "required|integer|exists:warehouses,id",
        "description": "Warehouse where stock will be decremented"
      },
      {
        "field": "items",
        "rules": "required|array|min:1",
        "description": "Array of items being purchased"
      },
      {
        "field": "items.*.product_id",
        "rules": "required|integer|exists:products,id",
        "description": "Product ID"
      },
      {
        "field": "items.*.quantity",
        "rules": "required|numeric|min:0.01",
        "description": "Quantity to sell"
      },
      {
        "field": "payments",
        "rules": "required|array|min:1",
        "description": "Payment breakdown (Cash, KHQR, Card)"
      }
    ],
    "reportsAvailable": [
      "Daily Cash Register Z-Report",
      "Hourly Sales Velocity Report",
      "Cashier Sales Breakdown"
    ],
    "notificationsTriggered": [
      "Sale Completed Telegram Notification",
      "Low Stock Threshold Reached Warning"
    ],
    "commonErrors": [
      {
        "code": "422",
        "problem": "Insufficient stock in selected warehouse",
        "solution": "Verify warehouse inventory balance or perform a stock transfer before completing checkout."
      },
      {
        "code": "400",
        "problem": "No active cash register session",
        "solution": "Cashier must open a cash register session before initiating POS transactions."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Barcode scanner does not input product into POS",
        "cause": "Scanner is not configured in HID keyboard wedge mode or carriage return suffix is disabled.",
        "solution": "Scan the configuration barcode in scanner user manual to enable \"Suffix Carriage Return / Enter\"."
      }
    ],
    "behindTheButton": {
      "actionName": "Complete POS Checkout (\"Checkout\" Button)",
      "steps": [
        {
          "layer": "UI / Frontend",
          "detail": "Cashier clicks \"Complete Sale\" button ($45.50 total)."
        },
        {
          "layer": "API Request",
          "detail": "POS Client sends POST /api/v1/pos/sales with payload containing warehouse_id, customer_id, items array, discount, and payment records."
        },
        {
          "layer": "Middleware / Auth",
          "detail": "JWT validation verifies user identity, role, and permission \"sale.create\"."
        },
        {
          "layer": "Controller",
          "detail": "POSController@store validates payload against StorePOSSaleRequest."
        },
        {
          "layer": "Service Layer",
          "detail": "Invokes POSService::processCheckout() wrapped in DB::beginTransaction()."
        },
        {
          "layer": "DB Transaction",
          "detail": "1. Creates `sales` record. 2. Creates `sale_items`. 3. Executes `inventories.quantity = quantity - items.qty` with lockForUpdate(). 4. Inserts `inventory_movements` record (type: sale). 5. Inserts `payments` record. 6. Updates `cash_registers` drawer balance."
        },
        {
          "layer": "Event / Queue",
          "detail": "Dispatches `SaleCompletedEvent` which sends Telegram bot receipt alert and pushes WebSocket update to Admin Dashboard."
        },
        {
          "layer": "UI Response",
          "detail": "Returns 201 Created with invoice number \"INV-202608-00142\". POS UI displays success modal and auto-triggers thermal printer dialog."
        }
      ]
    },
    "videoScript": {
      "title": "Mastering the POS Terminal: From Register Open to KHQR Checkout",
      "duration": "5:20 mins",
      "steps": [
        {
          "order": 1,
          "action": "Open Cash Drawer Session",
          "narrationKh": "ជំហានទី ១៖ ចុចលើប៊ូតុង \"Open Register\" រួចបញ្ចូលប្រាក់ដើមគ្រា $50.00 ក្នុងថតតុ។",
          "narrationEn": "Step 1: Click \"Open Register\" and enter opening cash float of $50.00."
        },
        {
          "order": 2,
          "action": "Scan Barcode Items",
          "narrationKh": "ជំហានទី ២៖ យកកាំភ្លើងស្កេន Barcode មកបាញ់លើប្រអប់ផលិតផល ទំនិញនឹងលោតចូលកន្ត្រកភ្លាមៗ។",
          "narrationEn": "Step 2: Use the barcode scanner to scan items into the cart automatically."
        },
        {
          "order": 3,
          "action": "Generate KHQR and Pay",
          "narrationKh": "ជំហានទី ៣៖ ចុចជ្រើសរើស KHQR ដើម្បីឱ្យអេក្រង់បង្ហាញ QR Code ឱ្យអតិថិជនស្កេនបង់ប្រាក់។",
          "narrationEn": "Step 3: Select KHQR payment method to display the Bakong dynamic QR code."
        },
        {
          "order": 4,
          "action": "Print Receipt and Complete",
          "narrationKh": "ជំហានទី ៤៖ បន្ទាប់ពីទូទាត់ជោគជ័យ ចុច \"Print Receipt\" ដើម្បីព្រីនវិក្កយបត្រជូនអតិថិជន។",
          "narrationEn": "Step 4: Once paid, click \"Print Receipt\" to issue the 80mm thermal receipt."
        }
      ]
    }
  },
  {
    "id": "products",
    "name": "Product Catalog & Variant Matrix",
    "nameKh": "ការគ្រប់គ្រងកាតាឡុកផលិតផល និងជម្រើស Variant (Products)",
    "category": "catalog",
    "icon": "Package",
    "status": "implemented",
    "overview": "Comprehensive enterprise product information management (PIM) supporting simple products, variable products with multi-dimensional variants (Size, Color, Material), multi-tier pricing, SKU/Barcode generation, WebP image uploads, SEO meta tags, and inventory tracking.",
    "overviewKh": "ប្រព័ន្ធគ្រប់គ្រងផលិតផលកម្រិតសហគ្រាស (PIM) គាំទ្រទាំងទំនិញទូទៅ (Simple) និងទំនិញមានជម្រើសច្រើន (Variable Variants ដូចជាទំហំ ពណ៌ ប្រភេទ), តម្លៃលក់រាយ/ដុំ, បង្កើត Barcode ស្វ័យប្រវត្តិ, រូបភាព WebP, និង SEO។",
    "purpose": "Centralizes the master catalog across all online channels, mobile apps, and physical POS stores ensuring uniform pricing, descriptions, and SKU specifications.",
    "purposeKh": "ប្រមូលផ្តុំទិន្នន័យផលិតផលតែមួយកន្លែង ដើម្បីធានាថាតម្លៃ រូបភាព ការពណ៌នា និងកូដទំនិញមានភាពដូចគ្នាទាំងអស់លើ Website, Mobile App និង POS។",
    "targetUsers": [
      "Admin",
      "Product Manager",
      "Catalog Specialist",
      "Marketing Team"
    ],
    "mainFeatures": [
      {
        "title": "Multi-Variant Matrix Generator",
        "titleKh": "ការបង្កើតបន្សំ Variant ដោយស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Automatic Cartesian product generation for variant combinations with distinct SKUs, barcodes, and price overrides.",
        "descKh": "បង្កើតបន្សំ Variant ស្វ័យប្រវត្តិ (ឧ. Size M-Red, L-Black) ជាមួយ SKU និងតម្លៃដាច់ដោយឡែក។"
      },
      {
        "title": "Multi-Image WebP Media Gallery",
        "titleKh": "វិចិត្រសាលរូបភាព WebP ច្រើនសន្លឹក",
        "status": "implemented",
        "desc": "Drag-and-drop image upload with automated WebP conversion, thumbnail generation, and primary image flag.",
        "descKh": "ផ្ទុករូបភាពឡើងដោយអូសទម្លាក់ (Drag & Drop) ជាមួយការបម្លែងជា WebP និង Thumbnail ស្វ័យប្រវត្តិ។"
      },
      {
        "title": "Barcode (EAN-13 / Code-128) Engine",
        "titleKh": "ម៉ាស៊ីនបង្កើត និងបោះពុម្ព Barcode",
        "status": "implemented",
        "desc": "Generates standardized SVG/PNG barcodes and printable barcode sticker sheets for physical labelling.",
        "descKh": "បង្កើត និងព្រីនតែម Barcode សម្រាប់បិទលើកញ្ចប់ផលិតផល។"
      },
      {
        "title": "SEO Metadata & OpenGraph Tags",
        "titleKh": "ការកំណត់ទិន្នន័យ SEO & Social Share",
        "status": "implemented",
        "desc": "Custom meta title, description, schema markup (Product JSON-LD), and social media share images.",
        "descKh": "កំណត់ Meta Title, Meta Description និង Rich Snippet JSON-LD សម្រាប់ Google Search។"
      }
    ],
    "databaseTables": [
      "products",
      "product_variants",
      "product_variant_values",
      "product_images",
      "product_prices",
      "categories",
      "brands",
      "units",
      "taxes",
      "attributes",
      "attribute_values"
    ],
    "models": [
      "Product/Product",
      "Product/ProductVariant",
      "Product/ProductImage",
      "Product/ProductPrice",
      "Product/Category",
      "Product/Brand",
      "Product/Unit",
      "Product/Tax",
      "Product/Attribute"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/products/ProductListPage.tsx",
      "admin-dashboard/src/pages/products/ProductCreatePage.tsx",
      "admin-dashboard/src/pages/products/ProductEditPage.tsx"
    ],
    "mobileScreens": [
      "mobile_app/lib/features/product/presentation/product_list_screen.dart"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/products",
        "description": "Paginated product list with search, category, brand, and stock filters",
        "auth": false
      },
      {
        "method": "POST",
        "path": "/api/v1/products",
        "description": "Create master product with images, variants, and pricing",
        "auth": true,
        "permission": "product.create"
      },
      {
        "method": "PUT",
        "path": "/api/v1/products/{id}",
        "description": "Update product specifications and variant combinations",
        "auth": true,
        "permission": "product.update"
      },
      {
        "method": "DELETE",
        "path": "/api/v1/products/{id}",
        "description": "Soft-delete product and send to Recycle Bin",
        "auth": true,
        "permission": "product.delete"
      },
      {
        "method": "POST",
        "path": "/api/v1/products/{id}/barcode",
        "description": "Generate printable barcode labels sheet",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "SKU Uniqueness",
        "titleKh": "ភាពដាច់ដោយឡែកនៃលេខកូដ SKU",
        "rule": "Every product and variant must have a globally unique SKU per company tenant.",
        "ruleKh": "រាល់ផលិតផល និង Variant ត្រូវតែមានលេខកូដ SKU មិនជាន់គ្នាដាច់ខាត។"
      },
      {
        "title": "Price Hierarchy",
        "titleKh": "ឋានានុក្រមតម្លៃលក់",
        "rule": "If a variant does not specify a custom price, it inherits the base product price automatically.",
        "ruleKh": "ប្រសិនបើ Variant មិនបានកំណត់តម្លៃផ្ទាល់ខ្លួន វានឹងយកតម្លៃគោលរបស់មេផលិតផលដោយស្វ័យប្រវត្តិ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Navigate to Add Product",
        "titleKh": "ចូលទៅកាន់ទំព័របង្កើតទំនិញ",
        "desc": "Admin opens Products menu and clicks \"Create Product\" button.",
        "descKh": "ចូលទៅកាន់ម៉ឺនុយ Products រួចចុចលើប៊ូតុង \"Create Product\"។",
        "actor": "Product Manager"
      },
      {
        "step": 2,
        "title": "Fill Basic Information",
        "titleKh": "បំពេញព័ត៌មានទូទៅ",
        "desc": "Enter Name, SKU, Category, Brand, Unit, Tax, and Base Cost/Selling Price.",
        "descKh": "បំពេញឈ្មោះ, លេខកូដ SKU, ប្រភេទ Category, ម៉ាក Brand, ខ្នាត និងតម្លៃលក់។",
        "actor": "Product Manager"
      },
      {
        "step": 3,
        "title": "Configure Variations",
        "titleKh": "កំណត់ជម្រើស Variants (ប្រសិនបើមាន)",
        "desc": "Select attributes (e.g. Size: S, M, L; Color: Blue, Red) to generate matrix.",
        "descKh": "ជ្រើសរើស Attribute ដើម្បីឱ្យប្រព័ន្ធបង្កើតបន្សំ Variant ស្វ័យប្រវត្តិ។",
        "actor": "Product Manager"
      },
      {
        "step": 4,
        "title": "Upload Product Media",
        "titleKh": "ផ្ទុករូបភាពផលិតផល",
        "desc": "Upload high-resolution images; system compresses and creates WebP responsive sizes.",
        "descKh": "ផ្ទុករូបភាពស្អាតៗឡើង ប្រព័ន្ធនឹងបង្រួមទំហំរូបភាពជា WebP ដោយស្វ័យប្រវត្តិ។",
        "actor": "Product Manager"
      },
      {
        "step": 5,
        "title": "Save & Publish",
        "titleKh": "រក្សាទុក និងផ្សព្វផ្សាយ",
        "desc": "Submit form. Product becomes immediately available on POS and Customer storefront.",
        "descKh": "ចុចរក្សាទុក ផលិតផលនឹងបង្ហាញភ្លាមៗលើ POS និងគេហទំព័រលក់អនឡាញ។",
        "actor": "System"
      }
    ],
    "permissionsRequired": [
      "product.view",
      "product.create",
      "product.update",
      "product.delete"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Product title"
      },
      {
        "field": "sku",
        "rules": "required|string|max:100|unique:products,sku",
        "description": "Unique Stock Keeping Unit"
      },
      {
        "field": "price",
        "rules": "required|numeric|min:0",
        "description": "Base selling price"
      },
      {
        "field": "category_id",
        "rules": "required|integer|exists:categories,id",
        "description": "Product category"
      }
    ],
    "reportsAvailable": [
      "Product Sales Velocity Report",
      "Dead Stock & Slow Movers Report"
    ],
    "notificationsTriggered": [
      "New Product Published Notification"
    ],
    "commonErrors": [
      {
        "code": "422",
        "problem": "The SKU has already been taken",
        "solution": "Provide a unique SKU code or use the auto-generate SKU button."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Product image does not display after upload",
        "cause": "Storage symlink is broken or S3/MinIO credentials are not configured.",
        "solution": "Run `php artisan storage:link` in backend container or check MEDIA_DISK in .env."
      }
    ]
  },
  {
    "id": "inventory",
    "name": "Multi-Warehouse Inventory Control",
    "nameKh": "ការគ្រប់គ្រងស្តុកឃ្លាំងពហុសាខា (Inventory & Warehouses)",
    "category": "inventory",
    "icon": "Boxes",
    "status": "implemented",
    "overview": "Enterprise multi-warehouse inventory engine tracking stock quantities, cost valuation (FIFO/Average Cost), stock movements, inter-warehouse transfers, loss/damage adjustments, and physical stock opname counts.",
    "overviewKh": "ម៉ាស៊ីនគ្រប់គ្រងស្តុកពហុឃ្លាំងកម្រិតសហគ្រាស តាមដានចំនួនស្តុកជាក់ស្តែង តម្លៃសរុបនៃស្តុក (Inventory Valuation) លំហូរចលនាទំនិញ (Movement History) ការផ្ទេរទំនិញឆ្លងឃ្លាំង ការកែតម្រូវស្តុកខូចខាត និងការរាប់ស្តុកជាក់ស្តែង (Stock Opname)។",
    "purpose": "Eliminates phantom inventory, prevents out-of-stock lost sales, enforces audit compliance, and provides 100% visibility of stock levels across all branches.",
    "purposeKh": "ការពារបញ្ហាបាត់បង់ទំនិញពីស្តុក ដឹងច្បាស់ពីចំនួនទំនិញនៅសល់តាមឃ្លាំងនីមួយៗ និងមានប្រវត្តិកត់ត្រាច្បាស់លាស់គ្រប់ពេលដែលទំនិញចេញ-ចូល។",
    "targetUsers": [
      "Warehouse Manager",
      "Stock Controller",
      "Branch Manager",
      "Auditor"
    ],
    "mainFeatures": [
      {
        "title": "Real-Time Multi-Warehouse Stock Grid",
        "titleKh": "តារាងតាមដានស្តុកតាមឃ្លាំងជាក់ស្តែង",
        "status": "implemented",
        "desc": "Displays available, reserved, and incoming stock per warehouse location.",
        "descKh": "បង្ហាញចំនួនទំនិញមានក្នុងស្តុក ទំនិញដែលបានកក់ និងទំនិញកំពុងធ្វើដំណើរចូល។"
      },
      {
        "title": "Inter-Warehouse Stock Transfers",
        "titleKh": "ការផ្ទេរទំនិញឆ្លងឃ្លាំង (Stock Transfers)",
        "status": "implemented",
        "desc": "Multi-step workflow: Draft -> In-Transit -> Received with discrepancy checking.",
        "descKh": "ដំណើរការផ្ទេរទំនិញមាន ៣ ដំណាក់កាល៖ បង្កើតសំណើ -> កំពុងដឹកជញ្ជូន -> ទទួលចូលឃ្លាំងគោលដៅ។"
      },
      {
        "title": "Stock Adjustment & Loss Write-Off",
        "titleKh": "ការកែសម្រួលស្តុកខូចខាត ឬបាត់បង់ (Stock Adjustments)",
        "status": "implemented",
        "desc": "Record stock damage, expiry, or variance with mandatory reason codes and manager approvals.",
        "descKh": "កត់ត្រាចំនួនទំនិញខូច ហួសដឺឡេ ឬបាត់បង់ ដោយមានហេតុផលច្បាស់លាស់ និងការអនុម័តពី Manager។"
      },
      {
        "title": "Physical Stock Opname / Cycle Counting",
        "titleKh": "ការរាប់ស្តុកជាក់ស្តែងតាមកាលកំណត់ (Stock Opname)",
        "status": "implemented",
        "desc": "Batch audit tool allowing barcode scanning to reconcile physical counts against system records.",
        "descKh": "ឧបករណ៍រាប់ស្តុកជាក់ស្តែងដោយស្កេន Barcode ដើម្បីប្រៀបធៀបជាមួយចំនួនក្នុងប្រព័ន្ធ។"
      }
    ],
    "databaseTables": [
      "inventories",
      "inventory_movements",
      "warehouses",
      "stock_transfers",
      "stock_transfer_items",
      "stock_adjustments",
      "stock_adjustment_items",
      "stock_opnames",
      "stock_opname_items"
    ],
    "models": [
      "Inventory/Inventory",
      "Inventory/InventoryMovement",
      "Company/Warehouse",
      "Inventory/StockTransfer",
      "Inventory/StockAdjustment",
      "Inventory/StockOpname"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/inventory/InventoryListPage.tsx",
      "admin-dashboard/src/pages/inventory/StockTransferPage.tsx",
      "admin-dashboard/src/pages/inventory/StockAdjustmentPage.tsx",
      "admin-dashboard/src/pages/inventory/StockOpnamePage.tsx"
    ],
    "mobileScreens": [
      "mobile_app/lib/features/inventory/presentation/inventory_screen.dart"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/inventories",
        "description": "Query inventory levels with warehouse and low stock filters",
        "auth": true,
        "permission": "inventory.view"
      },
      {
        "method": "POST",
        "path": "/api/v1/stock-transfers",
        "description": "Initiate inter-warehouse stock transfer",
        "auth": true,
        "permission": "inventory.transfer"
      },
      {
        "method": "POST",
        "path": "/api/v1/stock-transfers/{id}/receive",
        "description": "Confirm receipt of transferred items at destination warehouse",
        "auth": true,
        "permission": "inventory.transfer"
      },
      {
        "method": "POST",
        "path": "/api/v1/stock-adjustments",
        "description": "Record inventory adjustment or write-off",
        "auth": true,
        "permission": "inventory.adjust"
      },
      {
        "method": "POST",
        "path": "/api/v1/stock-opnames",
        "description": "Create and finalize physical stock audit count",
        "auth": true,
        "permission": "inventory.opname"
      }
    ],
    "businessRules": [
      {
        "title": "Immutable Stock Movement Audit Trail",
        "titleKh": "កំណត់ត្រាចលនាស្តុកមិនអាចលុបបាន (Immutable Ledger)",
        "rule": "Every inventory change MUST create an associated `inventory_movements` record storing previous_qty, change_qty, new_qty, movement_type, and reference_id.",
        "ruleKh": "រាល់ពេលចំនួនស្តុកមានការប្រែប្រួល ប្រព័ន្ធត្រូវតែបង្កើតកំណត់ត្រា `inventory_movements` ជានិច្ច មិនអាចកែប្រែ ឬលុបបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Purchase Receipt",
        "titleKh": "ទទួលទំនិញពីការបញ្ជាទិញ (Purchase)",
        "desc": "Goods arrive -> Warehouse staff inspects -> Stock quantity increases -> Inventory Movement type \"purchase\".",
        "descKh": "ទំនិញមកដល់ឃ្លាំង -> បុគ្គលិកត្រួតពិនិត្យ -> ចំនួនស្តុកកើនឡើង -> កត់ត្រាចលនាស្តុកប្រភេទ Purchase។",
        "actor": "Warehouse Staff"
      },
      {
        "step": 2,
        "title": "POS / Online Sale",
        "titleKh": "ការលក់ទំនិញចេញ (POS / Sale)",
        "desc": "Customer checks out -> Stock quantity decrements immediately -> Inventory Movement type \"sale\".",
        "descKh": "អតិថិជនទិញទំនិញ -> ចំនួនស្តុកត្រូវកាត់ចេញភ្លាមៗ -> កត់ត្រាចលនាស្តុកប្រភេទ Sale។",
        "actor": "Cashier / Customer"
      },
      {
        "step": 3,
        "title": "Stock Transfer",
        "titleKh": "ការផ្ទេរទំនិញឆ្លងឃ្លាំង (Transfer)",
        "desc": "Source warehouse dispatches -> Items in-transit -> Destination warehouse confirms -> Quantities balanced.",
        "descKh": "ឃ្លាំងដើមផ្ញើទំនិញចេញ -> ទំនិញកំពុងធ្វើដំណើរ -> ឃ្លាំងគោលដៅទទួល -> ចំនួនស្តុកត្រូវបានកែសម្រួល។",
        "actor": "Warehouse Staff"
      }
    ],
    "permissionsRequired": [
      "inventory.view",
      "inventory.adjust",
      "inventory.transfer",
      "inventory.opname"
    ],
    "validationRules": [
      {
        "field": "source_warehouse_id",
        "rules": "required|integer|exists:warehouses,id",
        "description": "Origin warehouse"
      },
      {
        "field": "destination_warehouse_id",
        "rules": "required|integer|exists:warehouses,id|different:source_warehouse_id",
        "description": "Destination warehouse"
      }
    ],
    "reportsAvailable": [
      "Warehouse Inventory Valuation Report",
      "Stock Movement Audit History Report",
      "Stock Adjustment Summary"
    ],
    "notificationsTriggered": [
      "Stock Transfer Dispatched Alert",
      "Stock Opname Discrepancy Flag"
    ],
    "commonErrors": [
      {
        "code": "422",
        "problem": "Insufficient stock in source warehouse for transfer",
        "solution": "Check active available quantity in source warehouse before initiating transfer."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Inventory quantity does not match physical shelf count",
        "cause": "Unrecorded damaged items or theft.",
        "solution": "Perform a Stock Opname session to adjust system quantity to physical count with reason notes."
      }
    ]
  },
  {
    "id": "purchases",
    "name": "Procurement & Purchase Orders",
    "nameKh": "ការបញ្ជាទិញទំនិញចូល និងការគ្រប់គ្រងអ្នកផ្គត់ផ្គង់ (Purchases & Suppliers)",
    "category": "procurement",
    "icon": "Truck",
    "status": "implemented",
    "overview": "End-to-end procurement and purchase management system covering supplier management, Purchase Orders (PO), approval workflows, partial/full stock receiving, purchase returns, and accounts payable reconciliation.",
    "overviewKh": "ប្រព័ន្ធគ្រប់គ្រងការទិញទំនិញចូលឃ្លាំងពីអ្នកផ្គត់ផ្គង់ (Suppliers) ចាប់ពីការបង្កើតប័ណ្ណបញ្ជាទិញ (Purchase Order), ការអនុម័តប័ណ្ណទិញ, ការទទួលទំនិញចូលឃ្លាំង (Receive Stock), ការបង្វិលទំនិញខូច (Purchase Returns) និងការទូទាត់ប្រាក់ថ្លៃទំនិញ។",
    "purpose": "Streamlines supply chain procurement, prevents unauthorized purchasing, automates warehouse stock increase upon delivery, and manages supplier credit balances.",
    "purposeKh": "ជួយគ្រប់គ្រងលំហូរទិញទំនិញចូលឱ្យមានរបៀបរៀបរយ ការពារការទិញទំនិញខុសគោលដៅ បង្កើនស្តុកស្វ័យប្រវត្តិនៅពេលទទួលទំនិញ និងតាមដានបំណុលអ្នកផ្គត់ផ្គង់។",
    "targetUsers": [
      "Purchasing Manager",
      "Procurement Officer",
      "Accountant",
      "Warehouse Staff"
    ],
    "mainFeatures": [
      {
        "title": "Purchase Order Lifecycle",
        "titleKh": "វដ្តដំណើរការនៃប័ណ្ណបញ្ជាទិញ (PO)",
        "status": "implemented",
        "desc": "Statuses: Draft -> Ordered -> Partial Received -> Received -> Cancelled.",
        "descKh": "ស្ថានភាពប័ណ្ណទិញ៖ សេចក្តីព្រាង (Draft) -> បានបញ្ជាទិញ -> ទទួលទំនិញបានខ្លះ -> ទទួលគ្រប់ចំនួន -> បានលុបចោល។"
      },
      {
        "title": "Stock Receiving & Inspection Engine",
        "titleKh": "ការទទួលទំនិញចូលឃ្លាំងជាក់ស្តែង",
        "status": "implemented",
        "desc": "Receive items partially or fully; automatically increments warehouse inventory and logs purchase movements.",
        "descKh": "ទទួលទំនិញគ្រប់ ឬមិនទាន់គ្រប់ចំនួន ប្រព័ន្ធនឹងបង្កើនចំនួនស្តុកឃ្លាំងដោយស្វ័យប្រវត្តិ។"
      },
      {
        "title": "Supplier Directory & Balance Tracking",
        "titleKh": "បញ្ជីអ្នកផ្គត់ផ្គង់ និងការតាមដានបំណុល",
        "status": "implemented",
        "desc": "Track supplier contact info, payment terms, outstanding payables, and historical purchase orders.",
        "descKh": "គ្រប់គ្រងព័ត៌មានអ្នកផ្គត់ផ្គង់ លក្ខខណ្ឌទូទាត់ និងបំណុលដែលត្រូវសង។"
      },
      {
        "title": "Purchase Returns & Debit Notes",
        "titleKh": "ការបង្វិលទំនិញត្រឡប់ទៅអ្នកផ្គត់ផ្គង់វិញ",
        "status": "implemented",
        "desc": "Return damaged/expired goods back to supplier, decrement stock, and adjust supplier ledger.",
        "descKh": "បង្វិលទំនិញខូចគុណភាពត្រឡប់ទៅវិញ កាត់បន្ថយស្តុក និងកាត់កងបំណុល។"
      }
    ],
    "databaseTables": [
      "purchases",
      "purchase_items",
      "suppliers",
      "supplier_contacts",
      "purchase_returns",
      "purchase_return_items",
      "inventories",
      "inventory_movements"
    ],
    "models": [
      "Purchase/Purchase",
      "Purchase/PurchaseItem",
      "Supplier/Supplier",
      "Purchase/PurchaseReturn",
      "Inventory/Inventory"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/purchases/PurchaseListPage.tsx",
      "admin-dashboard/src/pages/purchases/PurchaseCreatePage.tsx",
      "admin-dashboard/src/pages/purchases/PurchaseDetailPage.tsx",
      "admin-dashboard/src/pages/suppliers/SupplierListPage.tsx"
    ],
    "mobileScreens": [
      "mobile_app/lib/features/purchase/presentation/purchase_list_screen.dart"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/purchases",
        "description": "List purchase orders with status and supplier filters",
        "auth": true,
        "permission": "purchase.view"
      },
      {
        "method": "POST",
        "path": "/api/v1/purchases",
        "description": "Create new purchase order draft or ordered",
        "auth": true,
        "permission": "purchase.create"
      },
      {
        "method": "POST",
        "path": "/api/v1/purchases/{id}/approve",
        "description": "Approve purchase order for ordering",
        "auth": true,
        "permission": "purchase.approve"
      },
      {
        "method": "POST",
        "path": "/api/v1/purchases/{id}/receive",
        "description": "Receive physical stock at warehouse and increment inventory",
        "auth": true,
        "permission": "purchase.update"
      },
      {
        "method": "POST",
        "path": "/api/v1/purchase-returns",
        "description": "Process purchase return of damaged goods to vendor",
        "auth": true,
        "permission": "purchase.create"
      }
    ],
    "businessRules": [
      {
        "title": "Stock Increase on Receive",
        "titleKh": "ការបង្កើនស្តុកនៅពេលទទួលទំនិញ",
        "rule": "Inventory quantities only increase when purchase status changes to \"received\" or through explicit receive action.",
        "ruleKh": "ស្តុកឃ្លាំងកើនឡើងតែនៅពេលដែលស្ថានភាពប័ណ្ណទិញត្រូវបានផ្លាស់ប្តូរទៅជា \"Received\" ឬតាមរយៈការចុចទទួលទំនិញប៉ុណ្ណោះ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Create Purchase Order (PO)",
        "titleKh": "បង្កើតប័ណ្ណបញ្ជាទិញ (PO)",
        "desc": "Procurement officer creates PO specifying supplier, warehouse, items, quantities, and agreed unit costs.",
        "descKh": "បុគ្គលិកទិញទំនិញបង្កើតប័ណ្ណ PO ដោយជ្រើសរើសអ្នកផ្គត់ផ្គង់ ឃ្លាំង និងចំនួនទំនិញ។",
        "actor": "Procurement Officer"
      },
      {
        "step": 2,
        "title": "Approve Purchase Order",
        "titleKh": "អនុម័តប័ណ្ណបញ្ជាទិញ",
        "desc": "Manager reviews PO cost, terms, and budget allocation, then clicks \"Approve\".",
        "descKh": "អ្នកគ្រប់គ្រងត្រួតពិនិត្យតម្លៃ និងថវិកា រួចចុចអនុម័តប័ណ្ណទិញ។",
        "actor": "Manager"
      },
      {
        "step": 3,
        "title": "Receive Physical Stock",
        "titleKh": "ទទួលទំនិញចូលឃ្លាំង",
        "desc": "Warehouse staff inspects delivered shipment, verifies batch counts, and clicks \"Receive Stock\".",
        "descKh": "បុគ្គលិកឃ្លាំងរាប់ទំនិញដែលបានដឹកមកដល់ រួចចុច \"Receive Stock\" ក្នុងប្រព័ន្ធ។",
        "actor": "Warehouse Staff"
      },
      {
        "step": 4,
        "title": "Inventory Updated & Movement Logged",
        "titleKh": "ស្តុកត្រូវបានកើនឡើងដោយស្វ័យប្រវត្តិ",
        "desc": "System increases warehouse inventory quantities, calculates new moving average cost, and creates inventory movement record.",
        "descKh": "ប្រព័ន្ធបង្កើនស្តុកឃ្លាំង គណនាថ្លៃដើមមធ្យមថ្មី និងកត់ត្រាចលនាស្តុក។",
        "actor": "System"
      }
    ],
    "permissionsRequired": [
      "purchase.view",
      "purchase.create",
      "purchase.update",
      "purchase.delete",
      "purchase.approve",
      "supplier.view",
      "supplier.create"
    ],
    "validationRules": [
      {
        "field": "supplier_id",
        "rules": "required|integer|exists:suppliers,id",
        "description": "Target supplier"
      },
      {
        "field": "warehouse_id",
        "rules": "required|integer|exists:warehouses,id",
        "description": "Destination warehouse"
      },
      {
        "field": "items",
        "rules": "required|array|min:1",
        "description": "Purchase order line items"
      }
    ],
    "reportsAvailable": [
      "Supplier Purchase Summary Report",
      "Purchase Order Status Tracking Report"
    ],
    "notificationsTriggered": [
      "Purchase Order Approved Alert",
      "Stock Received at Warehouse Alert"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "User does not have permission to approve purchase orders",
        "solution": "Ensure user has role Manager or Super Admin with `purchase.approve` permission."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Stock did not increase after saving purchase",
        "cause": "Purchase was saved in \"Draft\" or \"Ordered\" status rather than \"Received\".",
        "solution": "Open the purchase details and click \"Receive Stock\" action."
      }
    ]
  },
  {
    "id": "attendance",
    "name": "Dynamic QR & Geofenced Attendance",
    "nameKh": "ការគ្រប់គ្រងវត្តមានតាម QR Code & Geofencing (Attendance)",
    "category": "hrm",
    "icon": "Clock",
    "status": "implemented",
    "overview": "High-security mobile attendance and time-tracking system utilizing expiring dynamic QR code sessions, employee device hardware binding, geofencing GPS coordinates, shift schedule matching, and late/early departure calculation.",
    "overviewKh": "ប្រព័ន្ធកត់ត្រាវត្តមានបុគ្គលិកកម្រិតខ្ពស់ តាមរយៈការស្កេន Dynamic QR Code ដែលផ្លាស់ប្តូររៀងរាល់ប៉ុន្មានវិនាទី, ចងភ្ជាប់ Device សម្គាល់ទូរស័ព្ទបុគ្គលិក (Device Binding), ពិនិត្យទីតាំង GPS (Geofencing), និងគណនាម៉ោងធ្វើការ យឺត ឬចេញមុនដោយស្វ័យប្រវត្តិ។",
    "purpose": "Eliminates buddy-punching (proxy attendance), enforces geofence presence at physical branch offices, and feeds accurate real-time attendance hours directly into automated payroll.",
    "purposeKh": "ការពារការស្កេនវត្តមានជំនួសគ្នា ធានាថាបុគ្គលិកមកដល់ទីតាំងសាខាពិតប្រាកដ និងបញ្ជូនទិន្នន័យម៉ោងធ្វើការទៅកាន់ប្រព័ន្ធបើកប្រាក់ខែ (Payroll) ដោយស្វ័យប្រវត្តិ។",
    "targetUsers": [
      "HR Manager",
      "Branch Manager",
      "All Employees"
    ],
    "mainFeatures": [
      {
        "title": "Expiring Dynamic QR Code Sessions",
        "titleKh": "QR Code វត្តមានផ្លាស់ប្តូរស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Kiosk display generates new QR session every 15 seconds to prevent screenshot sharing.",
        "descKh": "អេក្រង់ Kiosk បង្ហាញ QR Code ដែលផ្លាស់ប្តូររៀងរាល់ ១៥ វិនាទី ការពារការថតរូបផ្ញើឱ្យគ្នា។"
      },
      {
        "title": "Device UUID Hardware Binding",
        "titleKh": "ការចងភ្ជាប់ទូរស័ព្ទបុគ្គលិក (Device Binding)",
        "status": "implemented",
        "desc": "Restricts clock-in to employee registered smartphone device ID stored in employee_devices table.",
        "descKh": "អនុញ្ញាតឱ្យបុគ្គលិកស្កេនវត្តមានបានតែលើទូរស័ព្ទផ្ទាល់ខ្លួនដែលបានចុះឈ្មោះក្នុងប្រព័ន្ធប៉ុណ្ណោះ។"
      },
      {
        "title": "GPS Geofencing Verification",
        "titleKh": "ការផ្ទៀងផ្ទាត់ទីតាំង GPS Geofencing",
        "status": "implemented",
        "desc": "Validates mobile coordinates within branch allowable radius (e.g. 50 meters).",
        "descKh": "ពិនិត្យមើលរយៈកម្ពស់ និងរយៈបណ្តោយ GPS ថាស្ថិតក្នុងរង្វង់ ៥០ ម៉ែត្រនៃសាខា។"
      },
      {
        "title": "Shift Management & Late Tracking",
        "titleKh": "ការគ្រប់គ្រងវេនការងារ និងតាមដានការមកយឺត",
        "status": "implemented",
        "desc": "Compares clock-in timestamp against shift schedule to compute late minutes and overtime.",
        "descKh": "ប្រៀបធៀបម៉ោងស្កេនជាមួយម៉ោងវេនការងារ ដើម្បីគណនានាទីមកយឺត ឬថែមម៉ោង (OT)។"
      }
    ],
    "databaseTables": [
      "attendance",
      "attendance_qr_sessions",
      "employee_devices",
      "shifts",
      "employees",
      "departments"
    ],
    "models": [
      "Employee/Attendance",
      "Employee/AttendanceQrSession",
      "Employee/EmployeeDevice",
      "Employee/Shift",
      "Employee/Employee"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/employees/AttendancePage.tsx",
      "admin-dashboard/src/pages/employees/ShiftListPage.tsx"
    ],
    "mobileScreens": [
      "mobile_app/lib/features/attendance/presentation/attendance_screen.dart"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/attendance/qr-session",
        "description": "Generate active dynamic QR session token for kiosk display",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/attendance/scan-qr",
        "description": "Employee mobile scans dynamic QR to clock-in/clock-out",
        "auth": true
      },
      {
        "method": "GET",
        "path": "/api/v1/attendance/my-history",
        "description": "Fetch employee personal attendance log and timesheet",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/attendance/manual-entry",
        "description": "HR admin manual attendance correction with reason",
        "auth": true,
        "permission": "attendance.create"
      }
    ],
    "businessRules": [
      {
        "title": "Dynamic QR TTL",
        "titleKh": "សុពលភាពនៃ QR Code វត្តមាន",
        "rule": "QR attendance tokens expire within 30 seconds; expired tokens return 410 Gone.",
        "ruleKh": "កូដ QR វត្តមានមានសុពលភាពត្រឹម ៣០ វិនាទីប៉ុណ្ណោះ ប្រសិនបើហួសពេលប្រព័ន្ធនឹងបដិសេធ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Display Dynamic QR Kiosk",
        "titleKh": "បង្ហាញផ្ទាំង QR Kiosk នៅកន្លែងធ្វើការ",
        "desc": "Tablet or monitor at office front desk displays live rotating QR code.",
        "descKh": "ដាក់ Tablet ឬអេក្រង់នៅមាត់ទ្វារការិយាល័យ ដើម្បីបង្ហាញ QR Code វិលជុំ។",
        "actor": "Office Kiosk"
      },
      {
        "step": 2,
        "title": "Open Mobile App & Scan",
        "titleKh": "បើក Mobile App រួចស្កេន",
        "desc": "Employee opens Flutter mobile app, authenticates with fingerprint, and scans dynamic QR.",
        "descKh": "បុគ្គលិកបើកកម្មវិធីទូរស័ព្ទ ស្កេនមេដៃ រួចបាញ់ស្កេន QR Code លើ Tablet។",
        "actor": "Employee"
      },
      {
        "step": 3,
        "title": "Validate Geofence & Device",
        "titleKh": "ប្រព័ន្ធផ្ទៀងផ្ទាត់ GPS និងទូរស័ព្ទ",
        "desc": "Backend verifies device UUID, GPS radius, and QR token authenticity.",
        "descKh": "ប្រព័ន្ធត្រួតពិនិត្យថាទូរស័ព្ទ និងទីតាំង GPS ត្រឹមត្រូវពិតប្រាកដ។",
        "actor": "Backend API"
      },
      {
        "step": 4,
        "title": "Record Attendance Timestamp",
        "titleKh": "កត់ត្រាម៉ោងវត្តមានជោគជ័យ",
        "desc": "Creates attendance entry (clock_in / clock_out) with late calculation and sends push confirmation.",
        "descKh": "កត់ត្រាម៉ោងចូល/ចេញ គណនានាទីយឺត និងផ្ញើដំណឹងជូនដំណឹងជោគជ័យ។",
        "actor": "System"
      }
    ],
    "permissionsRequired": [
      "attendance.view",
      "attendance.create",
      "attendance.update",
      "attendance.delete"
    ],
    "validationRules": [
      {
        "field": "qr_token",
        "rules": "required|string",
        "description": "Dynamic QR token from kiosk"
      },
      {
        "field": "latitude",
        "rules": "required|numeric",
        "description": "GPS latitude coordinate"
      },
      {
        "field": "longitude",
        "rules": "required|numeric",
        "description": "GPS longitude coordinate"
      },
      {
        "field": "device_id",
        "rules": "required|string",
        "description": "Unique device identifier"
      }
    ],
    "reportsAvailable": [
      "Monthly Employee Timesheet Report",
      "Late & Absenteeism Summary Report"
    ],
    "notificationsTriggered": [
      "Clock-in Success Notification",
      "Late Arrival Manager Alert"
    ],
    "commonErrors": [
      {
        "code": "422",
        "problem": "Device UUID is not authorized for this employee",
        "solution": "Contact HR administrator to register or reset device pairing."
      },
      {
        "code": "422",
        "problem": "You are outside the branch geofence boundary",
        "solution": "Ensure you are physically present at the office and GPS location is enabled."
      }
    ],
    "troubleshooting": [
      {
        "issue": "App shows \"Location Permission Denied\"",
        "cause": "Smartphone GPS permissions are disabled for the app.",
        "solution": "Go to phone Settings -> Apps -> POS & E-Commerce -> Permissions -> Location -> Allow while using app."
      }
    ]
  },
  {
    "id": "payroll",
    "name": "Automated Payroll & Salary Processing",
    "nameKh": "ការគ្រប់គ្រងប្រាក់បៀវត្សរ៍ និងការបើកប្រាក់ខែ (Payroll)",
    "category": "hrm",
    "icon": "Banknote",
    "status": "implemented",
    "overview": "Automated employee compensation engine supporting base salary computation, attendance deduction syncing, overtime pay multipliers, allowances, bonus incentives, tax withholding, and bulk PDF payslip generation.",
    "overviewKh": "ម៉ាស៊ីនគណនាប្រាក់បៀវត្សរ៍បុគ្គលិកស្វ័យប្រវត្តិ គណនាប្រាក់ខែគោល កាត់ប្រាក់មកយឺត/អវត្តមានពីប្រព័ន្ធ Attendance, គណនាប្រាក់ថែមម៉ោង (OT), ប្រាក់ឧបត្ថម្ភ, ប្រាក់រង្វាន់លើកទឹកចិត្ត, ពន្ធលើប្រាក់បៀវត្សរ៍ និងបង្កើតប័ណ្ណបើកប្រាក់ខែ (PDF Payslip)។",
    "purpose": "Eliminates complex manual spreadsheet salary calculations, enforces transparent attendance-linked deductions, and generates audit-ready financial payroll summaries.",
    "purposeKh": "លុបបំបាត់ការគណនាប្រាក់ខែដោយដៃលើ Excel ដែលងាយខុសឆ្គង គណនាត្រូវតាមទិន្នន័យវត្តមានពិតប្រាកដ និងចេញប័ណ្ណបើកប្រាក់ខែជូនបុគ្គលិកច្បាស់លាស់។",
    "targetUsers": [
      "HR Manager",
      "Accountant",
      "Finance Director",
      "Employee"
    ],
    "mainFeatures": [
      {
        "title": "One-Click Monthly Payroll Generation",
        "titleKh": "ការបង្កើតតារាងប្រាក់ខែប្រចាំខែដោយ ១ ចុច",
        "status": "implemented",
        "desc": "Auto-calculates net pay for all active employees based on approved attendance and overtime records.",
        "descKh": "គណនាប្រាក់ខែសុទ្ធសម្រាប់បុគ្គលិកទាំងអស់ក្នុងពេលតែមួយ ដោយទាញយកទិន្នន័យពី Attendance។"
      },
      {
        "title": "Attendance-Linked Deductions",
        "titleKh": "ការកាត់ប្រាក់ខែតាមទិន្នន័យវត្តមាន",
        "status": "implemented",
        "desc": "Calculates hourly/daily rate deductions for unapproved absences and excess late arrivals.",
        "descKh": "កាត់ប្រាក់បៀវត្សរ៍តាមចំនួនថ្ងៃអវត្តមាន ឬនាទីមកយឺតដោយស្វ័យប្រវត្តិ។"
      },
      {
        "title": "Allowances & Bonus Allocations",
        "titleKh": "ប្រាក់ឧបត្ថម្ភ និងប្រាក់លើកទឹកចិត្ត",
        "status": "implemented",
        "desc": "Configure recurring and one-off allowances (Transport, Housing, Meal, Performance Bonus).",
        "descKh": "កំណត់ប្រាក់ឧបត្ថម្ភការធ្វើដំណើរ ថ្លៃស្នាក់នៅ ថ្លៃម្ហូប និងប្រាក់ Incentive តាមការលក់។"
      },
      {
        "title": "Individual PDF Payslips",
        "titleKh": "ប័ណ្ណបើកប្រាក់ខែទម្រង់ PDF (Payslip)",
        "status": "implemented",
        "desc": "Generates secure downloadable PDF payslip with full earnings and deduction breakdown.",
        "descKh": "បង្កើតឯកសារ PDF Payslip លម្អិត ដែលបុគ្គលិកអាចទាញយកមើលតាម Mobile App បាន។"
      }
    ],
    "databaseTables": [
      "payrolls",
      "employees",
      "attendance",
      "departments",
      "positions"
    ],
    "models": [
      "Employee/Payroll",
      "Employee/Employee",
      "Employee/Attendance",
      "Employee/Department"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/employees/PayrollPage.tsx"
    ],
    "mobileScreens": [
      "mobile_app/lib/features/payroll/presentation/payroll_list_screen.dart"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/payrolls",
        "description": "List payroll batches by month and department",
        "auth": true,
        "permission": "payroll.view"
      },
      {
        "method": "POST",
        "path": "/api/v1/payrolls/generate",
        "description": "Batch process salary calculations for selected month",
        "auth": true,
        "permission": "payroll.create"
      },
      {
        "method": "POST",
        "path": "/api/v1/payrolls/{id}/approve",
        "description": "Approve payroll batch for disbursement",
        "auth": true,
        "permission": "payroll.update"
      },
      {
        "method": "GET",
        "path": "/api/v1/payrolls/{id}/payslip",
        "description": "Generate and download individual employee PDF payslip",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Approval Lock",
        "titleKh": "ការចាក់សោរបន្ទាប់ពីអនុម័ត",
        "rule": "Once a payroll batch is marked as \"Approved\" or \"Paid\", it becomes locked against modifications unless explicitly unlocked by Super Admin.",
        "ruleKh": "នៅពេលតារាងប្រាក់ខែត្រូវបាន \"Approved\" ឬ \"Paid\" វានឹងត្រូវចាក់សោរមិនឱ្យកែប្រែបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Select Payroll Month",
        "titleKh": "ជ្រើសរើសខែដែលត្រូវគិតប្រាក់ខែ",
        "desc": "HR selects year, month, and department to process.",
        "descKh": "HR ជ្រើសរើសខែ ឆ្នាំ និងផ្នែកដែលត្រូវបើកប្រាក់ខែ។",
        "actor": "HR Manager"
      },
      {
        "step": 2,
        "title": "Execute Auto-Calculation",
        "titleKh": "ដំណើរការគណនាស្វ័យប្រវត្តិ",
        "desc": "System calculates base salary + overtime + allowances - attendance deductions - tax.",
        "descKh": "ប្រព័ន្ធបូកប្រាក់ខែគោល + ថែមម៉ោង + ប្រាក់ឧបត្ថម្ភ - ប្រាក់កាត់វត្តមាន - ពន្ធ។",
        "actor": "System"
      },
      {
        "step": 3,
        "title": "Review & Adjust",
        "titleKh": "ត្រួតពិនិត្យ និងកែសម្រួល",
        "desc": "Accountant verifies numbers, adds manual adjustments if necessary, and submits for approval.",
        "descKh": "គណនេយ្យករត្រួតពិនិត្យឡើងវិញ និងបញ្ជូនទៅកាន់នាយកហិរញ្ញវត្ថុដើម្បីអនុម័ត។",
        "actor": "Accountant"
      },
      {
        "step": 4,
        "title": "Disburse & Release Payslips",
        "titleKh": "បើកប្រាក់ខែ និងបញ្ចេញ Payslip",
        "desc": "Approve batch -> Mark paid -> Employees receive push notification and can view PDF payslip in Mobile App.",
        "descKh": "អនុម័ត -> បុគ្គលិកទទួលបានការជូនដំណឹង និងអាចទាញយក PDF Payslip មើលក្នុងទូរស័ព្ទ។",
        "actor": "Finance Director"
      }
    ],
    "permissionsRequired": [
      "payroll.view",
      "payroll.create",
      "payroll.update",
      "payroll.delete"
    ],
    "validationRules": [
      {
        "field": "month",
        "rules": "required|integer|between:1,12",
        "description": "Target payroll month"
      },
      {
        "field": "year",
        "rules": "required|integer|min:2020",
        "description": "Target payroll year"
      }
    ],
    "reportsAvailable": [
      "Monthly Payroll Disbursement Summary",
      "Department Salary Expenditure Comparison"
    ],
    "notificationsTriggered": [
      "Payroll Generated Notification",
      "Salary Payslip Available Alert"
    ],
    "commonErrors": [
      {
        "code": "422",
        "problem": "Payroll for this month and department has already been generated",
        "solution": "View the existing payroll batch or delete it if unapproved before re-generating."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Overtime hours not reflected in payroll",
        "cause": "Overtime requests in attendance module were not marked as \"Approved\".",
        "solution": "Approve pending overtime requests in Attendance module before running payroll calculation."
      }
    ]
  },
  {
    "id": "roles-permissions",
    "name": "Multi-Tenant RBAC & Permissions",
    "nameKh": "ការគ្រប់គ្រងតួនាទី និងសិទ្ធិប្រើប្រាស់ (Roles & Permissions)",
    "category": "security",
    "icon": "ShieldCheck",
    "status": "implemented",
    "overview": "Fine-grained Role-Based Access Control (RBAC) powered by Spatie Laravel Permission. Supports multi-tenant isolation, 80+ distinct permission nodes, dynamic UI guard checks, and audit logging for security compliance.",
    "overviewKh": "ប្រព័ន្ធគ្រប់គ្រងសិទ្ធិប្រើប្រាស់កម្រិតខ្ពស់ (RBAC) ដោយប្រើ Spatie Laravel Permission គាំទ្រសិទ្ធិចំនួនជាង ៨០ ថ្នាំង (Permission Nodes) បែងចែកតួនាទីច្បាស់លាស់ និងការពារទិន្នន័យតាមសាខា។",
    "purpose": "Guarantees that employees and external users only have access to authorized pages, actions, and branch data matching their assigned organizational duties.",
    "purposeKh": "ធានាថាមន្ត្រីបុគ្គលិកនីមួយៗអាចមើលឃើញ និងប្រើប្រាស់បានតែមុខងារ និងទិន្នន័យណាដែលអនុញ្ញាតតាមតួនាទីរបស់ខ្លួនប៉ុណ្ណោះ។",
    "targetUsers": [
      "Super Admin",
      "Security Administrator"
    ],
    "mainFeatures": [
      {
        "title": "80+ Granular Permission Nodes",
        "titleKh": "សិទ្ធិប្រើប្រាស់លម្អិតជាង ៨០ មុខងារ",
        "status": "implemented",
        "desc": "Granular permissions covering view, create, update, delete, approve, export, and manage actions across all 32 modules.",
        "descKh": "សិទ្ធិគ្របដណ្តប់លើការមើល បង្កើត កែប្រែ លុប អនុម័ត និងទាញយករបាយការណ៍លើគ្រប់ Module ទាំងអស់។"
      },
      {
        "title": "Dynamic Frontend & Backend Guarding",
        "titleKh": "ការការពារទាំង Frontend និង Backend",
        "status": "implemented",
        "desc": "Backend middleware blocks unauthorized HTTP requests while React/Flutter UI conditionally hides forbidden buttons and routes.",
        "descKh": "Backend Middleware បដិសេធ API ខុសសិទ្ធិ រីឯ Frontend លាក់ប៊ូតុង និងទំព័រដែលគ្មានសិទ្ធិដោយស្វ័យប្រវត្តិ។"
      },
      {
        "title": "Multi-Tenant Company Scoping",
        "titleKh": "ការបែងចែកទិន្នន័យតាមក្រុមហ៊ុន/សាខា",
        "status": "implemented",
        "desc": "Global Eloquent scopes enforce that queries automatically filter by tenant `company_id` and `branch_id`.",
        "descKh": "រាល់ Query ក្នុងប្រព័ន្ធត្រូវបានកំណត់ឱ្យទាញយកទិន្នន័យត្រូវតាម `company_id` និង `branch_id`។"
      }
    ],
    "databaseTables": [
      "roles",
      "permissions",
      "model_has_roles",
      "model_has_permissions",
      "role_has_permissions",
      "users"
    ],
    "models": [
      "User"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/roles/RoleListPage.tsx",
      "admin-dashboard/src/pages/permissions/PermissionListPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/roles",
        "description": "List all system roles and their assigned permissions",
        "auth": true,
        "permission": "role.view"
      },
      {
        "method": "POST",
        "path": "/api/v1/roles",
        "description": "Create new custom role with selected permissions matrix",
        "auth": true,
        "permission": "role.create"
      },
      {
        "method": "PUT",
        "path": "/api/v1/roles/{id}",
        "description": "Update role permissions and description",
        "auth": true,
        "permission": "role.update"
      },
      {
        "method": "GET",
        "path": "/api/v1/permissions",
        "description": "List all available permission nodes grouped by domain",
        "auth": true,
        "permission": "permission.view"
      }
    ],
    "businessRules": [
      {
        "title": "Super Admin Immutability",
        "titleKh": "ការការពារតួនាទី Super Admin",
        "rule": "The `super_admin` role automatically bypasses all permission checks and cannot be deleted or restricted.",
        "ruleKh": "តួនាទី `super_admin` មានសិទ្ធិទាំងអស់ក្នុងប្រព័ន្ធដោយស្វ័យប្រវត្តិ និងមិនអាចលុបបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Create Custom Role",
        "titleKh": "បង្កើតតួនាទីថ្មី",
        "desc": "Admin enters role name (e.g., \"Shift Supervisor\") and selects specific permission checkboxes.",
        "descKh": "បញ្ចូលឈ្មោះតួនាទីថ្មី រួចគូសធីកលើសិទ្ធិដែលចង់ផ្តល់ឱ្យ។",
        "actor": "Super Admin"
      },
      {
        "step": 2,
        "title": "Assign Role to User",
        "titleKh": "ប្រគល់តួនាទីឱ្យបុគ្គលិក",
        "desc": "Open User Profile, select role from dropdown, and assign branch/warehouse scope.",
        "descKh": "ចូលទៅកាន់គណនីបុគ្គលិក រួចជ្រើសរើសតួនាទី និងសាខាដែលត្រូវគ្រប់គ្រង។",
        "actor": "Super Admin"
      },
      {
        "step": 3,
        "title": "Automatic Access Enforcement",
        "titleKh": "ប្រព័ន្ធកំណត់សិទ្ធិភ្លាមៗ",
        "desc": "User logs in; JWT token contains roles and permissions list; UI unlocks corresponding features.",
        "descKh": "បុគ្គលិក Login ចូលប្រព័ន្ធ ផ្ទាំងបញ្ជា និងប៊ូតុងនឹងបើកឱ្យប្រើតាមសិទ្ធិដែលទទួលបាន។",
        "actor": "System"
      }
    ],
    "permissionsRequired": [
      "role.view",
      "role.create",
      "role.update",
      "role.delete",
      "user.view",
      "user.update"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:100|unique:roles,name",
        "description": "Role identifier name"
      },
      {
        "field": "permissions",
        "rules": "required|array|min:1",
        "description": "Array of permission string identifiers"
      }
    ],
    "reportsAvailable": [
      "Role & Permission Assignment Audit Matrix"
    ],
    "notificationsTriggered": [
      "Role Permission Updated Security Alert"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "User does not have the right permissions",
        "solution": "Assign the missing permission node to the user's role or update role assignment."
      }
    ],
    "troubleshooting": [
      {
        "issue": "User still sees permission error after admin granted role",
        "cause": "Frontend cached permissions in Zustand or JWT token has not been refreshed.",
        "solution": "User should log out and log back in, or trigger the refresh token endpoint."
      }
    ]
  },
  {
    "id": "orders",
    "name": "E-Commerce Orders & Fulfillment",
    "nameKh": "ការគ្រប់គ្រងការបញ្ជាទិញអនឡាញ (E-Commerce Orders & Fulfillment)",
    "category": "sales",
    "icon": "ShoppingBag",
    "status": "implemented",
    "overview": "Full-featured online order processing engine handling storefront shopping carts, multi-step checkout, KHQR and card payments, order status state machine (Pending -> Processing -> Shipped -> Delivered -> Completed), shipment tracking numbers, and returns.",
    "overviewKh": "ប្រព័ន្ធគ្រប់គ្រងការបញ្ជាទិញទំនិញតាមគេហទំព័រ និងទូរស័ព្ទ ចាប់ពីការដាក់ទំនិញក្នុងកន្ត្រក ការទូទាត់ប្រាក់ ការតាមដានស្ថានភាពបញ្ជាទិញ (Pending -> Processing -> Shipped -> Delivered) និងការផ្ញើលេខ Tracking ដឹកជញ្ជូន។",
    "purpose": "Provides customers with a seamless online purchasing journey while giving warehouse operations clear picking, packing, and dispatch workflows.",
    "purposeKh": "ជួយឱ្យអតិថិជនបញ្ជាទិញទំនិញបានងាយស្រួល និងជួយឱ្យក្រុមការងារឃ្លាំងរៀបចំវេចខ្ចប់ទំនិញ និងបញ្ជូនទៅកាន់អតិថិជនបានលឿន និងត្រឹមត្រូវ។",
    "targetUsers": [
      "Online Customer",
      "Order Fulfillment Staff",
      "Warehouse Dispatcher",
      "Customer Support"
    ],
    "mainFeatures": [
      {
        "title": "Multi-Step Order State Machine",
        "titleKh": "ដំណាក់កាលដំណើរការនៃការបញ្ជាទិញ",
        "status": "implemented",
        "desc": "Strict state transition rules preventing invalid status jumps and tracking status history.",
        "descKh": "ដំណើរការផ្លាស់ប្តូរស្ថានភាពបញ្ជាទិញយ៉ាងត្រឹមត្រូវ និងកត់ត្រាប្រវត្តិរាល់ពេលមានការផ្លាស់ប្តូរ។"
      },
      {
        "title": "Integrated Shipment Dispatching",
        "titleKh": "ការភ្ជាប់ប្រព័ន្ធដឹកជញ្ជូន និងលេខ Tracking",
        "status": "implemented",
        "desc": "Assign shipping courier method, record tracking number, and calculate delivery fee by weight/zone.",
        "descKh": "ជ្រើសរើសក្រុមហ៊ុនដឹកជញ្ជូន កត់ត្រាលេខ Tracking និងគណនាថ្លៃដឹកតាមទម្ងន់ និងតំបន់។"
      },
      {
        "title": "Customer Order Tracking Portal",
        "titleKh": "ទំព័រតាមដានទំនិញសម្រាប់អតិថិជន",
        "status": "implemented",
        "desc": "Public and authenticated tracking page with live status timeline and delivery estimates.",
        "descKh": "ទំព័រឱ្យអតិថិជនវាយលេខកូដវិក្កយបត្រ ដើម្បីមើលស្ថានភាពដឹកជញ្ជូនជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "orders",
      "order_items",
      "order_status_histories",
      "shipments",
      "shipping_methods",
      "shipping_rates",
      "payments",
      "customers"
    ],
    "models": [
      "Order/Order",
      "Order/OrderItem",
      "Order/OrderStatusHistory",
      "Order/Shipment",
      "Customer/Customer"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/orders/OrderListPage.tsx",
      "admin-dashboard/src/pages/orders/OrderDetailPage.tsx",
      "customer-website/src/pages/TrackOrderPage.tsx"
    ],
    "mobileScreens": [
      "mobile_app/lib/features/cart/presentation/cart_screen.dart"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/orders",
        "description": "List customer orders with status, date, and payment filters",
        "auth": true,
        "permission": "order.view"
      },
      {
        "method": "POST",
        "path": "/api/v1/store/orders",
        "description": "Customer storefront checkout creating new order",
        "auth": false
      },
      {
        "method": "PUT",
        "path": "/api/v1/orders/{id}/status",
        "description": "Update order status (Processing, Shipped, Delivered)",
        "auth": true,
        "permission": "order.manage"
      },
      {
        "method": "POST",
        "path": "/api/v1/orders/{id}/refund",
        "description": "Process customer refund and stock return",
        "auth": true,
        "permission": "order.refund"
      }
    ],
    "businessRules": [
      {
        "title": "Stock Reservation & Deduction",
        "titleKh": "ការកាត់ស្តុកនៅពេលបញ្ជាទិញ",
        "rule": "When online order payment is confirmed, warehouse stock is immediately decremented to prevent overselling.",
        "ruleKh": "នៅពេលការទូទាត់ប្រាក់ជោគជ័យ ស្តុកក្នុងឃ្លាំងនឹងត្រូវកាត់ចេញភ្លាមៗ ដើម្បីកុំឱ្យជាន់គ្នាជាមួយអ្នកដទៃ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Customer Checkout",
        "titleKh": "អតិថិជនបញ្ជាទិញទំនិញ",
        "desc": "Customer selects items, enters shipping address, and pays via KHQR.",
        "descKh": "អតិថិជនជ្រើសរើសទំនិញ បំពេញអាសយដ្ឋានដឹកជញ្ជូន និងបង់ប្រាក់តាម KHQR។",
        "actor": "Online Customer"
      },
      {
        "step": 2,
        "title": "Admin Receives & Confirms",
        "titleKh": "ហាងទទួលការបញ្ជាទិញ",
        "desc": "Admin sees new order badge on dashboard and changes status to \"Processing\".",
        "descKh": "បុគ្គលិកទទួលដំណឹងលើ Dashboard រួចប្តូរស្ថានភាពទៅ \"Processing\"។",
        "actor": "Fulfillment Staff"
      },
      {
        "step": 3,
        "title": "Packing & Shipping",
        "titleKh": "វេចខ្ចប់ និងប្រគល់ឱ្យអ្នកដឹកជញ្ជូន",
        "desc": "Warehouse packs goods, enters courier tracking number, and changes status to \"Shipped\".",
        "descKh": "ឃ្លាំងវេចខ្ចប់ទំនិញ បញ្ចូលលេខ Tracking និងប្តូរស្ថានភាពទៅ \"Shipped\"។",
        "actor": "Warehouse Dispatcher"
      },
      {
        "step": 4,
        "title": "Delivered & Completed",
        "titleKh": "អតិថិជនទទួលបានទំនិញ",
        "desc": "Courier delivers package -> Order status marked \"Delivered\" -> Customer receives delivery SMS/Email.",
        "descKh": "អ្នកដឹកប្រគល់ទំនិញដល់ដៃ -> ប្តូរស្ថានភាពទៅ \"Delivered\" -> អតិថិជនទទួលបានសារជូនដំណឹង។",
        "actor": "Courier / System"
      }
    ],
    "permissionsRequired": [
      "order.view",
      "order.manage",
      "order.refund"
    ],
    "validationRules": [
      {
        "field": "shipping_address_id",
        "rules": "required|integer",
        "description": "Customer delivery address ID"
      },
      {
        "field": "payment_method_id",
        "rules": "required|integer|exists:payment_methods,id",
        "description": "Payment gateway method"
      }
    ],
    "reportsAvailable": [
      "E-Commerce Sales & Conversion Rate Report",
      "Fulfillment Lead Time Report"
    ],
    "notificationsTriggered": [
      "New Web Order Admin Notification",
      "Order Shipped Customer Email/SMS"
    ],
    "commonErrors": [
      {
        "code": "422",
        "problem": "One or more items in your cart are currently out of stock",
        "solution": "Adjust item quantities or select available product variants."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Order status remains \"Pending\" after customer paid with KHQR",
        "cause": "Bank webhook callback was delayed or network failed during confirmation.",
        "solution": "Check payment transaction in Payment Gateway dashboard and click \"Verify Payment\" button."
      }
    ]
  },
  {
    "id": "categories",
    "name": "Product Categories & Taxonomy",
    "nameKh": "ការគ្រប់គ្រងប្រភេទផលិតផល (Categories)",
    "category": "catalog",
    "icon": "FolderTree",
    "status": "implemented",
    "overview": "Complete enterprise management module for Product Categories & Taxonomy, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការគ្រប់គ្រងប្រភេទផលិតផល (Categories) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Product Categories & Taxonomy.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Product Categories & Taxonomy",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការគ្រប់គ្រងប្រភេទផលិតផល (Categories)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Product Categories & Taxonomy records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "categories"
    ],
    "models": [
      "Product"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/categories/ProductPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/categories",
        "description": "Fetch list of Product Categories & Taxonomy with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/categories",
        "description": "Create new Product Categories & Taxonomy entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/categories/{id}",
        "description": "Update existing Product Categories & Taxonomy entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/categories/{id}",
        "description": "Delete Product Categories & Taxonomy entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Product Categories & Taxonomy",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការគ្រប់គ្រងប្រភេទផលិតផល (Categories)",
        "desc": "Navigate to Product Categories & Taxonomy from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "categorie.view",
      "categorie.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Product Categories & Taxonomy Summary Report"
    ],
    "notificationsTriggered": [
      "Product Categories & Taxonomy Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "brands",
    "name": "Brand & Manufacturer Directory",
    "nameKh": "ការគ្រប់គ្រងម៉ាកទំនិញ (Brands)",
    "category": "catalog",
    "icon": "Tag",
    "status": "implemented",
    "overview": "Complete enterprise management module for Brand & Manufacturer Directory, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការគ្រប់គ្រងម៉ាកទំនិញ (Brands) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Brand & Manufacturer Directory.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Brand & Manufacturer Directory",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការគ្រប់គ្រងម៉ាកទំនិញ (Brands)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Brand & Manufacturer Directory records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "brands"
    ],
    "models": [
      "Brand"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/brands/BrandPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/brands",
        "description": "Fetch list of Brand & Manufacturer Directory with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/brands",
        "description": "Create new Brand & Manufacturer Directory entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/brands/{id}",
        "description": "Update existing Brand & Manufacturer Directory entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/brands/{id}",
        "description": "Delete Brand & Manufacturer Directory entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Brand & Manufacturer Directory",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការគ្រប់គ្រងម៉ាកទំនិញ (Brands)",
        "desc": "Navigate to Brand & Manufacturer Directory from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "brand.view",
      "brand.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Brand & Manufacturer Directory Summary Report"
    ],
    "notificationsTriggered": [
      "Brand & Manufacturer Directory Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "units",
    "name": "Measurement Units & Conversions",
    "nameKh": "ខ្នាតរង្វាស់ និងការបម្លែង (Units)",
    "category": "catalog",
    "icon": "Ruler",
    "status": "implemented",
    "overview": "Complete enterprise management module for Measurement Units & Conversions, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ខ្នាតរង្វាស់ និងការបម្លែង (Units) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Measurement Units & Conversions.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Measurement Units & Conversions",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ខ្នាតរង្វាស់ និងការបម្លែង (Units)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Measurement Units & Conversions records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "units"
    ],
    "models": [
      "Measurement"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/units/MeasurementPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/units",
        "description": "Fetch list of Measurement Units & Conversions with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/units",
        "description": "Create new Measurement Units & Conversions entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/units/{id}",
        "description": "Update existing Measurement Units & Conversions entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/units/{id}",
        "description": "Delete Measurement Units & Conversions entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Measurement Units & Conversions",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ខ្នាតរង្វាស់ និងការបម្លែង (Units)",
        "desc": "Navigate to Measurement Units & Conversions from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "unit.view",
      "unit.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Measurement Units & Conversions Summary Report"
    ],
    "notificationsTriggered": [
      "Measurement Units & Conversions Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "taxes",
    "name": "Tax Rates & VAT Management",
    "nameKh": "ការគ្រប់គ្រងអត្រាពន្ធ និងអាករ (Taxes)",
    "category": "finance",
    "icon": "Receipt",
    "status": "implemented",
    "overview": "Complete enterprise management module for Tax Rates & VAT Management, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការគ្រប់គ្រងអត្រាពន្ធ និងអាករ (Taxes) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Tax Rates & VAT Management.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Tax Rates & VAT Management",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការគ្រប់គ្រងអត្រាពន្ធ និងអាករ (Taxes)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Tax Rates & VAT Management records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "taxes"
    ],
    "models": [
      "Tax"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/taxes/TaxPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/taxes",
        "description": "Fetch list of Tax Rates & VAT Management with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/taxes",
        "description": "Create new Tax Rates & VAT Management entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/taxes/{id}",
        "description": "Update existing Tax Rates & VAT Management entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/taxes/{id}",
        "description": "Delete Tax Rates & VAT Management entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Tax Rates & VAT Management",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការគ្រប់គ្រងអត្រាពន្ធ និងអាករ (Taxes)",
        "desc": "Navigate to Tax Rates & VAT Management from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "taxe.view",
      "taxe.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Tax Rates & VAT Management Summary Report"
    ],
    "notificationsTriggered": [
      "Tax Rates & VAT Management Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "attributes",
    "name": "Product Attributes & Specs",
    "nameKh": "លក្ខណៈពិសេសនៃទំនិញ (Attributes)",
    "category": "catalog",
    "icon": "Sliders",
    "status": "implemented",
    "overview": "Complete enterprise management module for Product Attributes & Specs, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ លក្ខណៈពិសេសនៃទំនិញ (Attributes) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Product Attributes & Specs.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Product Attributes & Specs",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ លក្ខណៈពិសេសនៃទំនិញ (Attributes)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Product Attributes & Specs records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "attributes"
    ],
    "models": [
      "Product"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/attributes/ProductPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/attributes",
        "description": "Fetch list of Product Attributes & Specs with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/attributes",
        "description": "Create new Product Attributes & Specs entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/attributes/{id}",
        "description": "Update existing Product Attributes & Specs entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/attributes/{id}",
        "description": "Delete Product Attributes & Specs entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Product Attributes & Specs",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ លក្ខណៈពិសេសនៃទំនិញ (Attributes)",
        "desc": "Navigate to Product Attributes & Specs from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "attribute.view",
      "attribute.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Product Attributes & Specs Summary Report"
    ],
    "notificationsTriggered": [
      "Product Attributes & Specs Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "warehouses",
    "name": "Warehouse Facilities & Locations",
    "nameKh": "ទីតាំងឃ្លាំងស្តុកទំនិញ (Warehouses)",
    "category": "inventory",
    "icon": "Warehouse",
    "status": "implemented",
    "overview": "Complete enterprise management module for Warehouse Facilities & Locations, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ទីតាំងឃ្លាំងស្តុកទំនិញ (Warehouses) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Warehouse Facilities & Locations.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Warehouse Facilities & Locations",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ទីតាំងឃ្លាំងស្តុកទំនិញ (Warehouses)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Warehouse Facilities & Locations records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "warehouses"
    ],
    "models": [
      "Warehouse"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/warehouses/WarehousePage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/warehouses",
        "description": "Fetch list of Warehouse Facilities & Locations with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/warehouses",
        "description": "Create new Warehouse Facilities & Locations entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/warehouses/{id}",
        "description": "Update existing Warehouse Facilities & Locations entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/warehouses/{id}",
        "description": "Delete Warehouse Facilities & Locations entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Warehouse Facilities & Locations",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ទីតាំងឃ្លាំងស្តុកទំនិញ (Warehouses)",
        "desc": "Navigate to Warehouse Facilities & Locations from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "warehouse.view",
      "warehouse.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Warehouse Facilities & Locations Summary Report"
    ],
    "notificationsTriggered": [
      "Warehouse Facilities & Locations Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "stock-movements",
    "name": "Stock Movement Ledger & Audit",
    "nameKh": "ប្រវត្តិចលនាស្តុកទំនិញ (Stock Movements)",
    "category": "inventory",
    "icon": "History",
    "status": "implemented",
    "overview": "Complete enterprise management module for Stock Movement Ledger & Audit, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ប្រវត្តិចលនាស្តុកទំនិញ (Stock Movements) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Stock Movement Ledger & Audit.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Stock Movement Ledger & Audit",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ប្រវត្តិចលនាស្តុកទំនិញ (Stock Movements)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Stock Movement Ledger & Audit records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "stock_movements"
    ],
    "models": [
      "Stock"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/stock-movements/StockPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/stock-movements",
        "description": "Fetch list of Stock Movement Ledger & Audit with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/stock-movements",
        "description": "Create new Stock Movement Ledger & Audit entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/stock-movements/{id}",
        "description": "Update existing Stock Movement Ledger & Audit entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/stock-movements/{id}",
        "description": "Delete Stock Movement Ledger & Audit entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Stock Movement Ledger & Audit",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ប្រវត្តិចលនាស្តុកទំនិញ (Stock Movements)",
        "desc": "Navigate to Stock Movement Ledger & Audit from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "stock_movement.view",
      "stock_movement.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Stock Movement Ledger & Audit Summary Report"
    ],
    "notificationsTriggered": [
      "Stock Movement Ledger & Audit Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "stock-transfers",
    "name": "Inter-Warehouse Stock Transfers",
    "nameKh": "ការផ្ទេរទំនិញឆ្លងឃ្លាំង (Stock Transfers)",
    "category": "inventory",
    "icon": "ArrowLeftRight",
    "status": "implemented",
    "overview": "Complete enterprise management module for Inter-Warehouse Stock Transfers, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការផ្ទេរទំនិញឆ្លងឃ្លាំង (Stock Transfers) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Inter-Warehouse Stock Transfers.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Inter-Warehouse Stock Transfers",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការផ្ទេរទំនិញឆ្លងឃ្លាំង (Stock Transfers)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Inter-Warehouse Stock Transfers records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "stock_transfers"
    ],
    "models": [
      "Inter-Warehouse"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/stock-transfers/Inter-WarehousePage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/stock-transfers",
        "description": "Fetch list of Inter-Warehouse Stock Transfers with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/stock-transfers",
        "description": "Create new Inter-Warehouse Stock Transfers entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/stock-transfers/{id}",
        "description": "Update existing Inter-Warehouse Stock Transfers entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/stock-transfers/{id}",
        "description": "Delete Inter-Warehouse Stock Transfers entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Inter-Warehouse Stock Transfers",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការផ្ទេរទំនិញឆ្លងឃ្លាំង (Stock Transfers)",
        "desc": "Navigate to Inter-Warehouse Stock Transfers from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "stock_transfer.view",
      "stock_transfer.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Inter-Warehouse Stock Transfers Summary Report"
    ],
    "notificationsTriggered": [
      "Inter-Warehouse Stock Transfers Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "stock-adjustments",
    "name": "Stock Adjustment & Write-Off",
    "nameKh": "ការកែសម្រួលស្តុក (Stock Adjustments)",
    "category": "inventory",
    "icon": "ClipboardCheck",
    "status": "implemented",
    "overview": "Complete enterprise management module for Stock Adjustment & Write-Off, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការកែសម្រួលស្តុក (Stock Adjustments) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Stock Adjustment & Write-Off.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Stock Adjustment & Write-Off",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការកែសម្រួលស្តុក (Stock Adjustments)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Stock Adjustment & Write-Off records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "stock_adjustments"
    ],
    "models": [
      "Stock"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/stock-adjustments/StockPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/stock-adjustments",
        "description": "Fetch list of Stock Adjustment & Write-Off with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/stock-adjustments",
        "description": "Create new Stock Adjustment & Write-Off entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/stock-adjustments/{id}",
        "description": "Update existing Stock Adjustment & Write-Off entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/stock-adjustments/{id}",
        "description": "Delete Stock Adjustment & Write-Off entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Stock Adjustment & Write-Off",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការកែសម្រួលស្តុក (Stock Adjustments)",
        "desc": "Navigate to Stock Adjustment & Write-Off from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "stock_adjustment.view",
      "stock_adjustment.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Stock Adjustment & Write-Off Summary Report"
    ],
    "notificationsTriggered": [
      "Stock Adjustment & Write-Off Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "stock-opnames",
    "name": "Physical Inventory Cycle Counting",
    "nameKh": "ការរាប់ស្តុកជាក់ស្តែង (Stock Opname)",
    "category": "inventory",
    "icon": "Scan",
    "status": "implemented",
    "overview": "Complete enterprise management module for Physical Inventory Cycle Counting, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការរាប់ស្តុកជាក់ស្តែង (Stock Opname) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Physical Inventory Cycle Counting.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Physical Inventory Cycle Counting",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការរាប់ស្តុកជាក់ស្តែង (Stock Opname)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Physical Inventory Cycle Counting records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "stock_opnames"
    ],
    "models": [
      "Physical"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/stock-opnames/PhysicalPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/stock-opnames",
        "description": "Fetch list of Physical Inventory Cycle Counting with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/stock-opnames",
        "description": "Create new Physical Inventory Cycle Counting entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/stock-opnames/{id}",
        "description": "Update existing Physical Inventory Cycle Counting entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/stock-opnames/{id}",
        "description": "Delete Physical Inventory Cycle Counting entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Physical Inventory Cycle Counting",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការរាប់ស្តុកជាក់ស្តែង (Stock Opname)",
        "desc": "Navigate to Physical Inventory Cycle Counting from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "stock_opname.view",
      "stock_opname.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Physical Inventory Cycle Counting Summary Report"
    ],
    "notificationsTriggered": [
      "Physical Inventory Cycle Counting Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "purchase-returns",
    "name": "Purchase Returns & Debit Notes",
    "nameKh": "ការបង្វិលទំនិញទិញត្រឡប់ (Purchase Returns)",
    "category": "procurement",
    "icon": "RotateCcw",
    "status": "implemented",
    "overview": "Complete enterprise management module for Purchase Returns & Debit Notes, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការបង្វិលទំនិញទិញត្រឡប់ (Purchase Returns) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Purchase Returns & Debit Notes.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Purchase Returns & Debit Notes",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការបង្វិលទំនិញទិញត្រឡប់ (Purchase Returns)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Purchase Returns & Debit Notes records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "purchase_returns"
    ],
    "models": [
      "Purchase"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/purchase-returns/PurchasePage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/purchase-returns",
        "description": "Fetch list of Purchase Returns & Debit Notes with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/purchase-returns",
        "description": "Create new Purchase Returns & Debit Notes entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/purchase-returns/{id}",
        "description": "Update existing Purchase Returns & Debit Notes entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/purchase-returns/{id}",
        "description": "Delete Purchase Returns & Debit Notes entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Purchase Returns & Debit Notes",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការបង្វិលទំនិញទិញត្រឡប់ (Purchase Returns)",
        "desc": "Navigate to Purchase Returns & Debit Notes from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "purchase_return.view",
      "purchase_return.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Purchase Returns & Debit Notes Summary Report"
    ],
    "notificationsTriggered": [
      "Purchase Returns & Debit Notes Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "suppliers",
    "name": "Supplier Directory & Contacts",
    "nameKh": "បញ្ជីអ្នកផ្គត់ផ្គង់ (Suppliers)",
    "category": "procurement",
    "icon": "Users",
    "status": "implemented",
    "overview": "Complete enterprise management module for Supplier Directory & Contacts, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ បញ្ជីអ្នកផ្គត់ផ្គង់ (Suppliers) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Supplier Directory & Contacts.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Supplier Directory & Contacts",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ បញ្ជីអ្នកផ្គត់ផ្គង់ (Suppliers)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Supplier Directory & Contacts records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "suppliers"
    ],
    "models": [
      "Supplier"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/suppliers/SupplierPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/suppliers",
        "description": "Fetch list of Supplier Directory & Contacts with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/suppliers",
        "description": "Create new Supplier Directory & Contacts entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/suppliers/{id}",
        "description": "Update existing Supplier Directory & Contacts entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/suppliers/{id}",
        "description": "Delete Supplier Directory & Contacts entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Supplier Directory & Contacts",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ បញ្ជីអ្នកផ្គត់ផ្គង់ (Suppliers)",
        "desc": "Navigate to Supplier Directory & Contacts from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "supplier.view",
      "supplier.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Supplier Directory & Contacts Summary Report"
    ],
    "notificationsTriggered": [
      "Supplier Directory & Contacts Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "sales",
    "name": "Sales Invoices & Credit Notes",
    "nameKh": "វិក្កយបត្រលក់ និងការទូទាត់ (Sales Invoices)",
    "category": "sales",
    "icon": "ReceiptText",
    "status": "implemented",
    "overview": "Complete enterprise management module for Sales Invoices & Credit Notes, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ វិក្កយបត្រលក់ និងការទូទាត់ (Sales Invoices) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Sales Invoices & Credit Notes.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Sales Invoices & Credit Notes",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ វិក្កយបត្រលក់ និងការទូទាត់ (Sales Invoices)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Sales Invoices & Credit Notes records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "sales"
    ],
    "models": [
      "Sales"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/sales/SalesPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/sales",
        "description": "Fetch list of Sales Invoices & Credit Notes with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/sales",
        "description": "Create new Sales Invoices & Credit Notes entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/sales/{id}",
        "description": "Update existing Sales Invoices & Credit Notes entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/sales/{id}",
        "description": "Delete Sales Invoices & Credit Notes entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Sales Invoices & Credit Notes",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ វិក្កយបត្រលក់ និងការទូទាត់ (Sales Invoices)",
        "desc": "Navigate to Sales Invoices & Credit Notes from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "sale.view",
      "sale.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Sales Invoices & Credit Notes Summary Report"
    ],
    "notificationsTriggered": [
      "Sales Invoices & Credit Notes Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "payments",
    "name": "Payment Gateways & KHQR Processing",
    "nameKh": "ច្រកទូទាត់ប្រាក់ និង KHQR (Payments)",
    "category": "finance",
    "icon": "CreditCard",
    "status": "implemented",
    "overview": "Complete enterprise management module for Payment Gateways & KHQR Processing, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ច្រកទូទាត់ប្រាក់ និង KHQR (Payments) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Payment Gateways & KHQR Processing.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Payment Gateways & KHQR Processing",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ច្រកទូទាត់ប្រាក់ និង KHQR (Payments)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Payment Gateways & KHQR Processing records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "payments"
    ],
    "models": [
      "Payment"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/payments/PaymentPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/payments",
        "description": "Fetch list of Payment Gateways & KHQR Processing with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/payments",
        "description": "Create new Payment Gateways & KHQR Processing entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/payments/{id}",
        "description": "Update existing Payment Gateways & KHQR Processing entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/payments/{id}",
        "description": "Delete Payment Gateways & KHQR Processing entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Payment Gateways & KHQR Processing",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ច្រកទូទាត់ប្រាក់ និង KHQR (Payments)",
        "desc": "Navigate to Payment Gateways & KHQR Processing from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "payment.view",
      "payment.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Payment Gateways & KHQR Processing Summary Report"
    ],
    "notificationsTriggered": [
      "Payment Gateways & KHQR Processing Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "customers",
    "name": "Customer Directory & CRM",
    "nameKh": "ការគ្រប់គ្រងអតិថិជន (Customers & CRM)",
    "category": "core",
    "icon": "UserCheck",
    "status": "implemented",
    "overview": "Complete enterprise management module for Customer Directory & CRM, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការគ្រប់គ្រងអតិថិជន (Customers & CRM) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Customer Directory & CRM.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Customer Directory & CRM",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការគ្រប់គ្រងអតិថិជន (Customers & CRM)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Customer Directory & CRM records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "customers"
    ],
    "models": [
      "Customer"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/customers/CustomerPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/customers",
        "description": "Fetch list of Customer Directory & CRM with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/customers",
        "description": "Create new Customer Directory & CRM entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/customers/{id}",
        "description": "Update existing Customer Directory & CRM entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/customers/{id}",
        "description": "Delete Customer Directory & CRM entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Customer Directory & CRM",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការគ្រប់គ្រងអតិថិជន (Customers & CRM)",
        "desc": "Navigate to Customer Directory & CRM from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "customer.view",
      "customer.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Customer Directory & CRM Summary Report"
    ],
    "notificationsTriggered": [
      "Customer Directory & CRM Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "customer-groups",
    "name": "Customer Groups & Tier Discounts",
    "nameKh": "ក្រុមអតិថិជន និងការបញ្ចុះតម្លៃ (Customer Groups)",
    "category": "core",
    "icon": "UsersRound",
    "status": "implemented",
    "overview": "Complete enterprise management module for Customer Groups & Tier Discounts, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ក្រុមអតិថិជន និងការបញ្ចុះតម្លៃ (Customer Groups) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Customer Groups & Tier Discounts.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Customer Groups & Tier Discounts",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ក្រុមអតិថិជន និងការបញ្ចុះតម្លៃ (Customer Groups)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Customer Groups & Tier Discounts records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "customer_groups"
    ],
    "models": [
      "Customer"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/customer-groups/CustomerPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/customer-groups",
        "description": "Fetch list of Customer Groups & Tier Discounts with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/customer-groups",
        "description": "Create new Customer Groups & Tier Discounts entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/customer-groups/{id}",
        "description": "Update existing Customer Groups & Tier Discounts entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/customer-groups/{id}",
        "description": "Delete Customer Groups & Tier Discounts entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Customer Groups & Tier Discounts",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ក្រុមអតិថិជន និងការបញ្ចុះតម្លៃ (Customer Groups)",
        "desc": "Navigate to Customer Groups & Tier Discounts from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "customer_group.view",
      "customer_group.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Customer Groups & Tier Discounts Summary Report"
    ],
    "notificationsTriggered": [
      "Customer Groups & Tier Discounts Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "employees",
    "name": "Employee Directory & Profiles",
    "nameKh": "បុគ្គលិក និងរចនាសម្ព័ន្ធស្ថាប័ន (Employees)",
    "category": "hrm",
    "icon": "Briefcase",
    "status": "implemented",
    "overview": "Complete enterprise management module for Employee Directory & Profiles, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ បុគ្គលិក និងរចនាសម្ព័ន្ធស្ថាប័ន (Employees) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Employee Directory & Profiles.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Employee Directory & Profiles",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ បុគ្គលិក និងរចនាសម្ព័ន្ធស្ថាប័ន (Employees)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Employee Directory & Profiles records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "employees"
    ],
    "models": [
      "Employee"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/employees/EmployeePage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/employees",
        "description": "Fetch list of Employee Directory & Profiles with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/employees",
        "description": "Create new Employee Directory & Profiles entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/employees/{id}",
        "description": "Update existing Employee Directory & Profiles entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/employees/{id}",
        "description": "Delete Employee Directory & Profiles entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Employee Directory & Profiles",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ បុគ្គលិក និងរចនាសម្ព័ន្ធស្ថាប័ន (Employees)",
        "desc": "Navigate to Employee Directory & Profiles from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "employee.view",
      "employee.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Employee Directory & Profiles Summary Report"
    ],
    "notificationsTriggered": [
      "Employee Directory & Profiles Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "departments",
    "name": "Departments & Organizational Units",
    "nameKh": "ដេប៉ាតឺម៉ង់ និងផ្នែក (Departments)",
    "category": "hrm",
    "icon": "Building2",
    "status": "implemented",
    "overview": "Complete enterprise management module for Departments & Organizational Units, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ដេប៉ាតឺម៉ង់ និងផ្នែក (Departments) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Departments & Organizational Units.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Departments & Organizational Units",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ដេប៉ាតឺម៉ង់ និងផ្នែក (Departments)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Departments & Organizational Units records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "departments"
    ],
    "models": [
      "Departments"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/departments/DepartmentsPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/departments",
        "description": "Fetch list of Departments & Organizational Units with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/departments",
        "description": "Create new Departments & Organizational Units entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/departments/{id}",
        "description": "Update existing Departments & Organizational Units entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/departments/{id}",
        "description": "Delete Departments & Organizational Units entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Departments & Organizational Units",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ដេប៉ាតឺម៉ង់ និងផ្នែក (Departments)",
        "desc": "Navigate to Departments & Organizational Units from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "department.view",
      "department.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Departments & Organizational Units Summary Report"
    ],
    "notificationsTriggered": [
      "Departments & Organizational Units Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "positions",
    "name": "Job Positions & Designations",
    "nameKh": "មុខតំណែងការងារ (Positions)",
    "category": "hrm",
    "icon": "Award",
    "status": "implemented",
    "overview": "Complete enterprise management module for Job Positions & Designations, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ មុខតំណែងការងារ (Positions) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Job Positions & Designations.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Job Positions & Designations",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ មុខតំណែងការងារ (Positions)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Job Positions & Designations records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "positions"
    ],
    "models": [
      "Job"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/positions/JobPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/positions",
        "description": "Fetch list of Job Positions & Designations with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/positions",
        "description": "Create new Job Positions & Designations entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/positions/{id}",
        "description": "Update existing Job Positions & Designations entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/positions/{id}",
        "description": "Delete Job Positions & Designations entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Job Positions & Designations",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ មុខតំណែងការងារ (Positions)",
        "desc": "Navigate to Job Positions & Designations from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "position.view",
      "position.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Job Positions & Designations Summary Report"
    ],
    "notificationsTriggered": [
      "Job Positions & Designations Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "finance",
    "name": "Expense Tracking & Cash Flow",
    "nameKh": "ការគ្រប់គ្រងចំណាយ និងហិរញ្ញវត្ថុ (Expenses & Finance)",
    "category": "finance",
    "icon": "Wallet",
    "status": "implemented",
    "overview": "Complete enterprise management module for Expense Tracking & Cash Flow, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការគ្រប់គ្រងចំណាយ និងហិរញ្ញវត្ថុ (Expenses & Finance) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Expense Tracking & Cash Flow.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Expense Tracking & Cash Flow",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការគ្រប់គ្រងចំណាយ និងហិរញ្ញវត្ថុ (Expenses & Finance)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Expense Tracking & Cash Flow records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "finance"
    ],
    "models": [
      "Expense"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/finance/ExpensePage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/finance",
        "description": "Fetch list of Expense Tracking & Cash Flow with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/finance",
        "description": "Create new Expense Tracking & Cash Flow entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/finance/{id}",
        "description": "Update existing Expense Tracking & Cash Flow entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/finance/{id}",
        "description": "Delete Expense Tracking & Cash Flow entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Expense Tracking & Cash Flow",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការគ្រប់គ្រងចំណាយ និងហិរញ្ញវត្ថុ (Expenses & Finance)",
        "desc": "Navigate to Expense Tracking & Cash Flow from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "finance.view",
      "finance.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Expense Tracking & Cash Flow Summary Report"
    ],
    "notificationsTriggered": [
      "Expense Tracking & Cash Flow Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "reports",
    "name": "Enterprise Analytics & 48 Reports",
    "nameKh": "មជ្ឈមណ្ឌលរបាយការណ៍ ៤៨ ប្រភេទ (Reports Center)",
    "category": "core",
    "icon": "FileBarChart",
    "status": "implemented",
    "overview": "Complete enterprise management module for Enterprise Analytics & 48 Reports, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ មជ្ឈមណ្ឌលរបាយការណ៍ ៤៨ ប្រភេទ (Reports Center) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Enterprise Analytics & 48 Reports.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Enterprise Analytics & 48 Reports",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ មជ្ឈមណ្ឌលរបាយការណ៍ ៤៨ ប្រភេទ (Reports Center)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Enterprise Analytics & 48 Reports records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "reports"
    ],
    "models": [
      "Enterprise"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/reports/EnterprisePage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/reports",
        "description": "Fetch list of Enterprise Analytics & 48 Reports with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/reports",
        "description": "Create new Enterprise Analytics & 48 Reports entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/reports/{id}",
        "description": "Update existing Enterprise Analytics & 48 Reports entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/reports/{id}",
        "description": "Delete Enterprise Analytics & 48 Reports entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Enterprise Analytics & 48 Reports",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ មជ្ឈមណ្ឌលរបាយការណ៍ ៤៨ ប្រភេទ (Reports Center)",
        "desc": "Navigate to Enterprise Analytics & 48 Reports from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "report.view",
      "report.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Enterprise Analytics & 48 Reports Summary Report"
    ],
    "notificationsTriggered": [
      "Enterprise Analytics & 48 Reports Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "notifications",
    "name": "Multi-Channel Notifications Engine",
    "nameKh": "ប្រព័ន្ធជូនដំណឹងពហុបណ្តាញ (Notifications)",
    "category": "notifications",
    "icon": "Bell",
    "status": "implemented",
    "overview": "Complete enterprise management module for Multi-Channel Notifications Engine, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ប្រព័ន្ធជូនដំណឹងពហុបណ្តាញ (Notifications) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Multi-Channel Notifications Engine.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Multi-Channel Notifications Engine",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ប្រព័ន្ធជូនដំណឹងពហុបណ្តាញ (Notifications)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Multi-Channel Notifications Engine records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "notifications"
    ],
    "models": [
      "Multi-Channel"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/notifications/Multi-ChannelPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/notifications",
        "description": "Fetch list of Multi-Channel Notifications Engine with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/notifications",
        "description": "Create new Multi-Channel Notifications Engine entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/notifications/{id}",
        "description": "Update existing Multi-Channel Notifications Engine entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/notifications/{id}",
        "description": "Delete Multi-Channel Notifications Engine entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Multi-Channel Notifications Engine",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ប្រព័ន្ធជូនដំណឹងពហុបណ្តាញ (Notifications)",
        "desc": "Navigate to Multi-Channel Notifications Engine from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "notification.view",
      "notification.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Multi-Channel Notifications Engine Summary Report"
    ],
    "notificationsTriggered": [
      "Multi-Channel Notifications Engine Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "marketing",
    "name": "Flash Sales, Coupons & Promotions",
    "nameKh": "ទីផ្សារ ប្រូម៉ូសិន និងគូប៉ុង (Marketing)",
    "category": "marketing",
    "icon": "Sparkles",
    "status": "implemented",
    "overview": "Complete enterprise management module for Flash Sales, Coupons & Promotions, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ទីផ្សារ ប្រូម៉ូសិន និងគូប៉ុង (Marketing) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Flash Sales, Coupons & Promotions.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Flash Sales, Coupons & Promotions",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ទីផ្សារ ប្រូម៉ូសិន និងគូប៉ុង (Marketing)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Flash Sales, Coupons & Promotions records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "marketing"
    ],
    "models": [
      "Flash"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/marketing/FlashPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/marketing",
        "description": "Fetch list of Flash Sales, Coupons & Promotions with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/marketing",
        "description": "Create new Flash Sales, Coupons & Promotions entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/marketing/{id}",
        "description": "Update existing Flash Sales, Coupons & Promotions entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/marketing/{id}",
        "description": "Delete Flash Sales, Coupons & Promotions entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Flash Sales, Coupons & Promotions",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ទីផ្សារ ប្រូម៉ូសិន និងគូប៉ុង (Marketing)",
        "desc": "Navigate to Flash Sales, Coupons & Promotions from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "marketing.view",
      "marketing.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Flash Sales, Coupons & Promotions Summary Report"
    ],
    "notificationsTriggered": [
      "Flash Sales, Coupons & Promotions Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "cms",
    "name": "Content Management & Media Library",
    "nameKh": "ការគ្រប់គ្រងអត្ថបទ និងមេឌៀ (CMS & Blogs)",
    "category": "cms",
    "icon": "FileText",
    "status": "implemented",
    "overview": "Complete enterprise management module for Content Management & Media Library, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការគ្រប់គ្រងអត្ថបទ និងមេឌៀ (CMS & Blogs) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Content Management & Media Library.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Content Management & Media Library",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការគ្រប់គ្រងអត្ថបទ និងមេឌៀ (CMS & Blogs)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Content Management & Media Library records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "cms"
    ],
    "models": [
      "Content"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/cms/ContentPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/cms",
        "description": "Fetch list of Content Management & Media Library with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/cms",
        "description": "Create new Content Management & Media Library entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/cms/{id}",
        "description": "Update existing Content Management & Media Library entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/cms/{id}",
        "description": "Delete Content Management & Media Library entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Content Management & Media Library",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការគ្រប់គ្រងអត្ថបទ និងមេឌៀ (CMS & Blogs)",
        "desc": "Navigate to Content Management & Media Library from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "cm.view",
      "cm.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Content Management & Media Library Summary Report"
    ],
    "notificationsTriggered": [
      "Content Management & Media Library Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "shipping",
    "name": "Shipping Methods, Zones & Rates",
    "nameKh": "វិធីសាស្ត្រដឹកជញ្ជូន និងតំបន់ (Shipping)",
    "category": "settings",
    "icon": "Truck",
    "status": "implemented",
    "overview": "Complete enterprise management module for Shipping Methods, Zones & Rates, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ វិធីសាស្ត្រដឹកជញ្ជូន និងតំបន់ (Shipping) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Shipping Methods, Zones & Rates.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Shipping Methods, Zones & Rates",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ វិធីសាស្ត្រដឹកជញ្ជូន និងតំបន់ (Shipping)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Shipping Methods, Zones & Rates records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "shipping"
    ],
    "models": [
      "Shipping"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/shipping/ShippingPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/shipping",
        "description": "Fetch list of Shipping Methods, Zones & Rates with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/shipping",
        "description": "Create new Shipping Methods, Zones & Rates entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/shipping/{id}",
        "description": "Update existing Shipping Methods, Zones & Rates entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/shipping/{id}",
        "description": "Delete Shipping Methods, Zones & Rates entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Shipping Methods, Zones & Rates",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ វិធីសាស្ត្រដឹកជញ្ជូន និងតំបន់ (Shipping)",
        "desc": "Navigate to Shipping Methods, Zones & Rates from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "shipping.view",
      "shipping.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Shipping Methods, Zones & Rates Summary Report"
    ],
    "notificationsTriggered": [
      "Shipping Methods, Zones & Rates Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  },
  {
    "id": "settings",
    "name": "Company Settings & Localization",
    "nameKh": "ការកំណត់ប្រព័ន្ធទូទៅ (Settings & Localization)",
    "category": "settings",
    "icon": "Settings",
    "status": "implemented",
    "overview": "Complete enterprise management module for Company Settings & Localization, providing centralized administrative control, robust relational data storage, and automated business workflows.",
    "overviewKh": "ម៉ូឌុលគ្រប់គ្រងពេញលេញសម្រាប់ ការកំណត់ប្រព័ន្ធទូទៅ (Settings & Localization) ដែលផ្តល់នូវការគ្រប់គ្រងកណ្តាល រក្សាទុកទិន្នន័យច្បាស់លាស់ និងដំណើរការអាជីវកម្មស្វ័យប្រវត្តិ។",
    "purpose": "Ensures streamlined operations, full audit compliance, and seamless cross-module data integration for Company Settings & Localization.",
    "purposeKh": "ជួយឱ្យដំណើរការការងារមានភាពរលូន មានកំណត់ត្រាសវនកម្មច្បាស់លាស់ និងភ្ជាប់ទិន្នន័យរវាងម៉ូឌុលនានាបានត្រឹមត្រូវ។",
    "targetUsers": [
      "Admin",
      "Manager",
      "Operation Staff"
    ],
    "mainFeatures": [
      {
        "title": "Full CRUD for Company Settings & Localization",
        "titleKh": "ការគ្រប់គ្រងទិន្នន័យ ការកំណត់ប្រព័ន្ធទូទៅ (Settings & Localization)",
        "status": "implemented",
        "desc": "Create, view, update, and soft-delete Company Settings & Localization records with real-time validation.",
        "descKh": "បង្កើត មើល កែប្រែ និងលុបទិន្នន័យដោយមានការផ្ទៀងផ្ទាត់ត្រឹមត្រូវ។"
      },
      {
        "title": "Excel & PDF Export",
        "titleKh": "ការទាញយកទិន្នន័យជា Excel និង PDF",
        "status": "implemented",
        "desc": "Export filtered data records to standardized Excel spreadsheets and printable PDF tables.",
        "descKh": "ទាញយកទិន្នន័យជាតារាង Excel និង PDF តាមតម្រងដែលបានកំណត់។"
      },
      {
        "title": "Audit Trail Integration",
        "titleKh": "ការកត់ត្រាប្រវត្តិកែប្រែស្វ័យប្រវត្តិ",
        "status": "implemented",
        "desc": "Tracks who created, updated, or deleted records with Spatie ActivityLog.",
        "descKh": "កត់ត្រាអត្តសញ្ញាណអ្នកបង្កើត ឬកែប្រែទិន្នន័យតាមពេលវេលាជាក់ស្តែង។"
      }
    ],
    "databaseTables": [
      "settings"
    ],
    "models": [
      "Company"
    ],
    "frontendPages": [
      "admin-dashboard/src/pages/settings/CompanyPage.tsx"
    ],
    "backendApis": [
      {
        "method": "GET",
        "path": "/api/v1/settings",
        "description": "Fetch list of Company Settings & Localization with pagination and filters",
        "auth": true
      },
      {
        "method": "POST",
        "path": "/api/v1/settings",
        "description": "Create new Company Settings & Localization entity",
        "auth": true
      },
      {
        "method": "PUT",
        "path": "/api/v1/settings/{id}",
        "description": "Update existing Company Settings & Localization entity",
        "auth": true
      },
      {
        "method": "DELETE",
        "path": "/api/v1/settings/{id}",
        "description": "Delete Company Settings & Localization entity",
        "auth": true
      }
    ],
    "businessRules": [
      {
        "title": "Data Integrity",
        "titleKh": "សុក្រឹតភាពនៃទិន្នន័យ",
        "rule": "Cannot delete records currently referenced by active transactions or foreign keys.",
        "ruleKh": "មិនអាចលុបទិន្នន័យដែលកំពុងជាប់ទាក់ទងនឹងប្រតិបត្តិការសកម្មដទៃទៀតបានឡើយ។"
      }
    ],
    "workflowSteps": [
      {
        "step": 1,
        "title": "Open Company Settings & Localization",
        "titleKh": "ចូលទៅកាន់ម៉ឺនុយ ការកំណត់ប្រព័ន្ធទូទៅ (Settings & Localization)",
        "desc": "Navigate to Company Settings & Localization from admin sidebar menu.",
        "descKh": "ជ្រើសរើសម៉ឺនុយពី Sidebar ខាងឆ្វេង។",
        "actor": "User"
      },
      {
        "step": 2,
        "title": "Manage Records",
        "titleKh": "អនុវត្តសកម្មភាព",
        "desc": "Perform create, edit, filter, or export operations as needed.",
        "descKh": "អនុវត្តការបង្កើត កែប្រែ ឬទាញយកទិន្នន័យតាមតម្រូវការ។",
        "actor": "User"
      }
    ],
    "permissionsRequired": [
      "setting.view",
      "setting.create"
    ],
    "validationRules": [
      {
        "field": "name",
        "rules": "required|string|max:255",
        "description": "Primary entity name or title"
      }
    ],
    "reportsAvailable": [
      "Company Settings & Localization Summary Report"
    ],
    "notificationsTriggered": [
      "Company Settings & Localization Change Notification"
    ],
    "commonErrors": [
      {
        "code": "403",
        "problem": "Forbidden - User lacks required permission",
        "solution": "Request your system administrator to grant the required permission node."
      }
    ],
    "troubleshooting": [
      {
        "issue": "Record changes do not immediately appear in table",
        "cause": "Client-side query cache has not refreshed.",
        "solution": "Click table reload button to trigger TanStack Query cache invalidation."
      }
    ]
  }
];
