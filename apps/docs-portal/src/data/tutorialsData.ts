import { TutorialVideo } from '../types/docs';

export const TUTORIAL_VIDEOS: TutorialVideo[] = [
  {
    id: 'tut-1',
    title: 'POS Cashier Masterclass: Opening Register to KHQR Sale',
    titleKh: 'មេរៀនបង្រៀនគិតលុយតាម POS៖ ចាប់ពីបើកវេន រហូតដល់ស្កេន KHQR',
    category: 'POS & Cashier',
    duration: '6:15 mins',
    difficulty: 'Beginner',
    status: 'coming_soon',
    description: 'Learn how to open your daily cash register drawer session, scan products using USB barcode scanners, select customers, generate instant KHQR payments, and print 80mm thermal receipts.',
    descriptionKh: 'រៀនពីរបៀបបើកវេនកុងទ័រប្រាក់ប្រចាំថ្ងៃ, ស្កេនទំនិញដោយប្រើកាំភ្លើង Barcode, ជ្រើសរើសអតិថិជន, បង្កើត QR Code បាគង (KHQR) ដើម្បីគិតលុយ, និងបោះពុម្ពវិក្កយបត្រ។',
    learningObjectives: [
      'Understand cash register opening float entries',
      'Scan products using hardware barcode scanners and camera',
      'Select payment methods (Cash, Card, KHQR Bakong)',
      'Issue thermal receipts and close cashier shift'
    ],
    learningObjectivesKh: [
      'យល់ដឹងពីការបើកវេន និងបញ្ចូលប្រាក់ដើមគ្រា',
      'របៀបស្កេនទំនិញដោយប្រើកាំភ្លើង Barcode និងកាមេរ៉ា',
      'ជ្រើសរើសវិធីសាស្ត្រទូទាត់ (សាច់ប្រាក់, កាត, KHQR)',
      'បោះពុម្ពវិក្កយបត្រខ្នាតតូច និងបិទវេនកុងទ័រប្រាក់'
    ],
    stepByStepNotes: [
      '1. Open POS -> Click Open Register -> Enter Opening Cash Float ($50.00)',
      '2. Focus cursor on Search/Barcode input -> Scan product barcode',
      '3. Adjust quantity (+ / -) or apply line item discount percentage',
      '4. Click Payment -> Select KHQR -> Show customer dynamic QR code',
      '5. Upon payment beep -> System auto-prints receipt and pops cash drawer'
    ],
    stepByStepNotesKh: [
      '១. បើកម៉ឺនុយ POS -> ចុច "Open Register" -> បញ្ចូលប្រាក់ដើមគ្រា ($50.00)',
      '២. ដាក់ Cursor លើប្រអប់ Barcode -> ស្កេនទំនិញបញ្ចូលកន្ត្រក',
      '៣. កែប្រែចំនួន (+ / -) ឬដាក់ភាគរយបញ្ចុះតម្លៃលើមុខទំនិញ',
      '៤. ចុច "Payment" -> ជ្រើសរើស KHQR -> បង្ហាញ QR Code ឱ្យអតិថិជនស្កេន',
      '៥. នៅពេលទូទាត់ជោគជ័យ -> ប្រព័ន្ធព្រីនវិក្កយបត្រ និងបើកថតតុប្រាក់ស្វ័យប្រវត្តិ'
    ],
    videoScript: [
      { step: 1, action: 'Open Cash Register', narrationKh: 'ជំហានទី ១៖ នៅពេលចាប់ផ្តើមវេនការងារ សូមចូលទៅកាន់ POS រួចចុច "Open Register" និងវាយបញ្ចូលប្រាក់ដើមគ្រា។', narrationEn: 'Step 1: At the start of your shift, navigate to POS, click "Open Register", and enter your opening cash float.' },
      { step: 2, action: 'Scan Barcode', narrationKh: 'ជំហានទី ២៖ យកកាំភ្លើងស្កេនមកបាញ់លើ Barcode ផលិតផល ទំនិញនឹងបង្ហាញលើអេក្រង់ភ្លាមៗ។', narrationEn: 'Step 2: Point your barcode scanner at the product barcode; the item will be instantly added to the active sale cart.' },
      { step: 3, action: 'Select KHQR Payment', narrationKh: 'ជំហានទី ៣៖ ចុចលើប៊ូតុង "Pay with KHQR" ដើម្បីឱ្យប្រព័ន្ធបង្កើត QR Code តាមចំនួនទឹកប្រាក់ជាក់ស្តែង។', narrationEn: 'Step 3: Click "Pay with KHQR" to render the dynamic Bakong QR code matching the exact cart total.' },
      { step: 4, action: 'Complete and Print Receipt', narrationKh: 'ជំហានទី ៤៖ បន្ទាប់ពីទទួលបានប្រាក់ជោគជ័យ ចុច "Print Receipt" ដើម្បីព្រីនវិក្កយបត្រ 80mm ជូនអតិថិជន។', narrationEn: 'Step 4: Once payment confirms, click "Print Receipt" to generate the 80mm thermal receipt.' }
    ],
    relatedDocsPath: '/modules/pos'
  },
  {
    id: 'tut-2',
    title: 'Product Creation & Variant Matrix Configuration',
    titleKh: 'ការបង្កើតផលិតផល និងការកំណត់ជម្រើស Variant (ទំហំ/ពណ៌)',
    category: 'Product Catalog',
    duration: '8:30 mins',
    difficulty: 'Intermediate',
    status: 'coming_soon',
    description: 'Complete walkthrough on creating simple and variable products, generating attribute matrix combinations (Size, Color), uploading WebP media images, and generating barcodes.',
    descriptionKh: 'មគ្គុទ្ទេសក៍ពេញលេញស្តីពីការបង្កើតទំនិញទូទៅ និងទំនិញមានជម្រើសច្រើន (Variants), បង្កើតបន្សំទំហំ/ពណ៌, ផ្ទុករូបភាព WebP និងបង្កើត Barcode។',
    learningObjectives: [
      'Create master product with SKU, category, brand, and unit',
      'Generate multi-attribute variant matrix with distinct pricing',
      'Upload and optimize responsive WebP images',
      'Print barcode label sheets for shelf tagging'
    ],
    learningObjectivesKh: [
      'បង្កើតទំនិញគោលជាមួយ SKU, Category, Brand និងខ្នាត',
      'បង្កើតបន្សំ Variant ច្រើនទំហំ/ពណ៌ ជាមួយតម្លៃផ្សេងៗគ្នា',
      'ផ្ទុកឡើង និងបង្រួមរូបភាពជាទម្រង់ WebP',
      'បោះពុម្ពតែម Barcode សម្រាប់បិទលើធ្នើរតាំងទំនិញ'
    ],
    stepByStepNotes: [
      '1. Navigate to Products -> Click "Add Product"',
      '2. Fill Name, SKU, Category, Brand, Base Cost and Price',
      '3. Under Variations tab, select "Attributes: Size, Color"',
      '4. Click "Generate Matrix" to create all SKU permutations',
      '5. Upload gallery images and click Save'
    ],
    stepByStepNotesKh: [
      '១. ចូលទៅកាន់ Products -> ចុច "Add Product"',
      '២. បំពេញឈ្មោះ, SKU, Category, Brand, ថ្លៃដើម និងតម្លៃលក់',
      '៣. ក្នុងផ្ទាំង Variations ជ្រើសរើស Attribute ដូចជា Size, Color',
      '៤. ចុច "Generate Matrix" ដើម្បីឱ្យប្រព័ន្ធបង្កើតបន្សំទាំងអស់',
      '៥. ផ្ទុករូបភាពស្អាតៗឡើង រួចចុច "Save"'
    ],
    videoScript: [
      { step: 1, action: 'Open Product Form', narrationKh: 'ជំហានទី ១៖ ចូលទៅកាន់ Products រួចចុចលើប៊ូតុង "Create Product"។', narrationEn: 'Step 1: Go to Products and click the "Create Product" button.' },
      { step: 2, action: 'Fill SKU and Pricing', narrationKh: 'ជំហានទី ២៖ បញ្ចូលឈ្មោះផលិតផល លេខកូដ SKU ថ្លៃដើមទិញចូល និងតម្លៃលក់ចេញ។', narrationEn: 'Step 2: Enter the product name, SKU code, cost price, and selling price.' },
      { step: 3, action: 'Add Variant Attributes', narrationKh: 'ជំហានទី ៣៖ បន្ថែមជម្រើសទំហំ Size (S, M, L) និងពណ៌ Color (Red, Blue) រួចចុចបង្កើត Matrix។', narrationEn: 'Step 3: Add size attributes (S, M, L) and colors (Red, Blue), then generate the variant matrix.' },
      { step: 4, action: 'Save and Verify on Storefront', narrationKh: 'ជំហានទី ៤៖ ចុច Save នោះផលិតផលនឹងបង្ហាញភ្លាមៗលើ POS និង Website។', narrationEn: 'Step 4: Save the product and immediately verify its availability on both POS and Storefront.' }
    ],
    relatedDocsPath: '/modules/products'
  },
  {
    id: 'tut-3',
    title: 'Procurement Workflow: Purchase Order to Warehouse Receiving',
    titleKh: 'លំហូរទិញទំនិញចូលឃ្លាំង៖ ចាប់ពីចេញប័ណ្ណ PO រហូតដល់ទទួលទំនិញចូលស្តុក',
    category: 'Procurement',
    duration: '5:45 mins',
    difficulty: 'Intermediate',
    status: 'coming_soon',
    description: 'Learn how to create a Purchase Order to suppliers, submit for managerial approval, receive delivered goods at the warehouse, and verify automatic inventory balance increments.',
    descriptionKh: 'រៀនពីរបៀបបង្កើតប័ណ្ណបញ្ជាទិញ (PO) ទៅអ្នកផ្គត់ផ្គង់, ស្នើសុំការអនុម័តពី Manager, ទទួលទំនិញជាក់ស្តែងចូលឃ្លាំង និងផ្ទៀងផ្ទាត់ការកើនឡើងនៃស្តុក។',
    learningObjectives: [
      'Draft Purchase Order with supplier and delivery warehouse',
      'Execute approval workflow',
      'Perform partial and full physical stock receiving',
      'Audit inventory movement ledger'
    ],
    learningObjectivesKh: [
      'បង្កើតប័ណ្ណបញ្ជាទិញ (PO) ជាមួយអ្នកផ្គត់ផ្គង់ និងឃ្លាំងគោលដៅ',
      'ដំណើរការអនុម័តប័ណ្ណទិញដោយ Manager',
      'ទទួលទំនិញជាក់ស្តែងចូលឃ្លាំង (Receive Stock)',
      'ពិនិត្យមើលកំណត់ត្រាចលនាស្តុកដែលកើនឡើង'
    ],
    stepByStepNotes: [
      '1. Purchases -> Create Purchase Order -> Select Supplier & Warehouse',
      '2. Add items with supplier unit costs -> Save as Draft or Ordered',
      '3. Manager reviews and clicks "Approve"',
      '4. When truck arrives -> Warehouse staff clicks "Receive Stock"',
      '5. System updates inventory quantities and moving average costs'
    ],
    stepByStepNotesKh: [
      '១. ចូលទៅ Purchases -> ចុច "Create Purchase" -> ជ្រើសរើស Supplier និងឃ្លាំង',
      '២. បញ្ចូលមុខទំនិញ និងថ្លៃដើមទិញ -> រក្សាទុកជា Ordered',
      '៣. Manager ពិនិត្យតម្លៃ រួចចុច "Approve"',
      '៤. នៅពេលទំនិញដឹកមកដល់ -> បុគ្គលិកឃ្លាំងចុច "Receive Stock"',
      '៥. ស្តុកឃ្លាំងនឹងកើនឡើងភ្លាមៗដោយស្វ័យប្រវត្តិ'
    ],
    videoScript: [
      { step: 1, action: 'Create PO', narrationKh: 'ជំហានទី ១៖ បង្កើតប័ណ្ណបញ្ជាទិញដោយជ្រើសរើសក្រុមហ៊ុនផ្គត់ផ្គង់ និងឃ្លាំងដែលត្រូវទទួលទំនិញ។', narrationEn: 'Step 1: Create a purchase order by selecting the vendor and target destination warehouse.' },
      { step: 2, action: 'Receive Goods', narrationKh: 'ជំហានទី ២៖ នៅពេលទំនិញមកដល់ឃ្លាំង បុគ្គលិកចុចលើប៊ូតុង "Receive Stock" ដើម្បីបង្កើនចំនួនស្តុក។', narrationEn: 'Step 2: When items arrive at the warehouse, staff clicks "Receive Stock" to increment physical inventory.' }
    ],
    relatedDocsPath: '/modules/purchases'
  },
  {
    id: 'tut-4',
    title: 'Inter-Warehouse Stock Transfer & Opname Reconciliation',
    titleKh: 'ការផ្ទេរទំនិញឆ្លងឃ្លាំង និងការរាប់ស្តុកជាក់ស្តែង (Stock Opname)',
    category: 'Inventory',
    duration: '7:10 mins',
    difficulty: 'Advanced',
    status: 'coming_soon',
    description: 'Step-by-step training on initiating inter-warehouse transfers, tracking in-transit items, confirming delivery at destination, and executing physical stock opname cycle counts with barcode verification.',
    descriptionKh: 'មេរៀនស្តីពីការផ្ទេរទំនិញពីឃ្លាំងមួយទៅឃ្លាំងមួយទៀត, ការតាមដានទំនិញកំពុងធ្វើដំណើរ (In-Transit), និងការរាប់ស្តុកជាក់ស្តែង (Stock Opname) ដើម្បីកែសម្រួលចំនួនស្តុកឱ្យត្រូវគ្នា។',
    learningObjectives: [
      'Initiate multi-item stock transfers between branch warehouses',
      'Accept and reconcile transferred shipments',
      'Conduct barcode-driven physical stock opnames',
      'Generate inventory discrepancy variance reports'
    ],
    learningObjectivesKh: [
      'បង្កើតសំណើផ្ទេរទំនិញឆ្លងឃ្លាំង',
      'ទទួល និងផ្ទៀងផ្ទាត់ទំនិញដែលបានផ្ទេរមកដល់',
      'រាប់ស្តុកជាក់ស្តែងដោយស្កេន Barcode (Stock Opname)',
      'ទាញយករបាយការណ៍ប្រៀបធៀបស្តុកជាក់ស្តែង និងស្តុកក្នុងប្រព័ន្ធ'
    ],
    stepByStepNotes: [
      '1. Inventory -> Stock Transfers -> Create Transfer (Source -> Destination)',
      '2. Dispatch items -> Status becomes "In-Transit"',
      '3. Destination warehouse clicks "Confirm Receipt" upon delivery',
      '4. For audits: Inventory -> Stock Opname -> Scan barcodes -> Finalize Adjustment'
    ],
    stepByStepNotesKh: [
      '១. ចូលទៅ Inventory -> Stock Transfers -> បង្កើតការផ្ទេរទំនិញ (ឃ្លាំងដើម -> ឃ្លាំងគោលដៅ)',
      '២. ផ្ញើទំនិញចេញ -> ស្ថានភាពក្លាយជា "In-Transit"',
      '៣. ឃ្លាំងគោលដៅចុច "Confirm Receipt" នៅពេលទំនិញមកដល់',
      '៤. សម្រាប់សវនកម្មស្តុក៖ ចូល Stock Opname -> ស្កេន Barcode រាប់ចំនួន -> អនុម័តកែសម្រួល'
    ],
    videoScript: [
      { step: 1, action: 'Create Stock Transfer', narrationKh: 'ជំហានទី ១៖ ជ្រើសរើសឃ្លាំងដើម និងឃ្លាំងគោលដៅ រួចបញ្ចូលទំនិញដែលត្រូវផ្ទេរ។', narrationEn: 'Step 1: Choose the origin and destination warehouses and specify the transfer items.' },
      { step: 2, action: 'Confirm Receipt', narrationKh: 'ជំហានទី ២៖ ឃ្លាំងគោលដៅត្រួតពិនិត្យទំនិញ រួចចុច "Confirm Receipt" ដើម្បីបញ្ចប់ការផ្ទេរ។', narrationEn: 'Step 2: Destination warehouse verifies the goods and clicks "Confirm Receipt" to complete the transfer.' }
    ],
    relatedDocsPath: '/modules/inventory'
  },
  {
    id: 'tut-5',
    title: 'Dynamic QR Attendance & Geofenced Mobile Clock-In',
    titleKh: 'ការស្កេនវត្តមានតាម Dynamic QR Code និង GPS Geofencing លើទូរស័ព្ទ',
    category: 'HR & Attendance',
    duration: '4:50 mins',
    difficulty: 'Beginner',
    status: 'coming_soon',
    description: 'Learn how to set up the rotating dynamic QR kiosk display at your office reception, register employee mobile devices, and clock in using GPS geofenced mobile scanning.',
    descriptionKh: 'រៀនពីរបៀបដំឡើងផ្ទាំង QR Code វត្តមាននៅកន្លែងធ្វើការ, ចុះឈ្មោះទូរស័ព្ទបុគ្គលិក (Device Pairing), និងស្កេនវត្តមានចូលធ្វើការដោយមានការផ្ទៀងផ្ទាត់ទីតាំង GPS។',
    learningObjectives: [
      'Launch dynamic QR session on front desk kiosk tablet',
      'Bind employee smartphone UUID in employee devices table',
      'Scan dynamic QR with Flutter Mobile App within 50m geofence radius',
      'View personal timesheet and late arrival logs'
    ],
    learningObjectivesKh: [
      'បើកផ្ទាំង QR Kiosk វិលជុំលើ Tablet នៅមាត់ទ្វារការិយាល័យ',
      'ភ្ជាប់ទូរស័ព្ទបុគ្គលិកទៅកាន់គណនីក្នុងប្រព័ន្ធ',
      'ស្កេនវត្តមានតាម Mobile App ក្នុងរង្វង់ ៥០ ម៉ែត្រនៃសាខា',
      'មើលប្រវត្តិវត្តមាន និងនាទីមកយឺតលើទូរស័ព្ទផ្ទាល់ខ្លួន'
    ],
    stepByStepNotes: [
      '1. Admin opens Attendance -> Kiosk Display -> Dynamic QR refreshes every 15s',
      '2. Employee opens Flutter Mobile App -> Authenticates with Fingerprint',
      '3. Point mobile camera at Kiosk QR -> GPS and Device UUID are validated',
      '4. Clock-in success notification displayed -> Hours logged to payroll'
    ],
    stepByStepNotesKh: [
      '១. បើកទំព័រ Attendance -> Kiosk Display -> QR Code ផ្លាស់ប្តូររៀងរាល់ ១៥ វិនាទី',
      '២. បុគ្គលិកបើក Mobile App -> ស្កេនមេដៃ Login ចូល',
      '៣. ស្កេន QR Code លើ Kiosk -> ប្រព័ន្ធត្រួតពិនិត្យ GPS និងទូរស័ព្ទ',
      '៤. ទទួលសារជោគជ័យ -> ម៉ោងធ្វើការត្រូវបានកត់ត្រាចូលប្រព័ន្ធប្រាក់ខែ'
    ],
    videoScript: [
      { step: 1, action: 'Display Kiosk QR', narrationKh: 'ជំហានទី ១៖ បើកផ្ទាំង Kiosk នៅមុខការិយាល័យដើម្បីបង្ហាញ Dynamic QR Code។', narrationEn: 'Step 1: Open the Kiosk display mode at the office reception to render the dynamic QR code.' },
      { step: 2, action: 'Scan with Mobile', narrationKh: 'ជំហានទី ២៖ បុគ្គលិកបើក App ទូរស័ព្ទដៃ រួចបាញ់ស្កេន QR Code ដើម្បីកត់ត្រាវត្តមានចូលធ្វើការ។', narrationEn: 'Step 2: Employee opens the mobile app and scans the QR code to clock in.' }
    ],
    relatedDocsPath: '/modules/attendance'
  },
  {
    id: 'tut-6',
    title: 'Automated Monthly Payroll Calculation & Payslip Export',
    titleKh: 'ការគណនាប្រាក់បៀវត្សរ៍ប្រចាំខែស្វ័យប្រវត្តិ និងការទាញយក PDF Payslip',
    category: 'Payroll',
    duration: '6:40 mins',
    difficulty: 'Intermediate',
    status: 'coming_soon',
    description: 'Learn how to generate monthly payroll across all departments, auto-deduct attendance penalties, calculate overtime, apply bonuses, approve salary batches, and issue PDF payslips.',
    descriptionKh: 'រៀនពីរបៀបគណនាប្រាក់ខែបុគ្គលិកទាំងអស់ដោយស្វ័យប្រវត្តិ, កាត់ប្រាក់មកយឺត/អវត្តមានពី Attendance, គណនាប្រាក់ថែមម៉ោង, អនុម័តតារាងប្រាក់ខែ និងចេញប័ណ្ណបើកប្រាក់ខែ (PDF Payslip)។',
    learningObjectives: [
      'Generate department salary calculations with 1-click batch processing',
      'Audit attendance penalties and overtime hours',
      'Apply custom performance bonuses and allowances',
      'Disburse salaries and release downloadable PDF payslips'
    ],
    learningObjectivesKh: [
      'គណនាប្រាក់ខែបុគ្គលិកតាមដេប៉ាតឺម៉ង់ដោយចុចតែ ១ ប៊ូតុង',
      'ត្រួតពិនិត្យប្រាក់កាត់វត្តមាន និងប្រាក់ថែមម៉ោង (OT)',
      'បន្ថែមប្រាក់ឧបត្ថម្ភ និងប្រាក់លើកទឹកចិត្ត',
      'អនុម័តបើកប្រាក់ខែ និងបញ្ចេញឯកសារ PDF Payslip'
    ],
    stepByStepNotes: [
      '1. Payroll -> Click "Generate Payroll" -> Select Month & Year',
      '2. System pulls base salary + allowances - attendance deductions - tax',
      '3. Review line items and make adjustments if necessary',
      '4. Click "Approve Batch" -> Mark as Paid',
      '5. Employees receive payslip notification in mobile app'
    ],
    stepByStepNotesKh: [
      '១. ចូលទៅ Payroll -> ចុច "Generate Payroll" -> ជ្រើសរើសខែ និងឆ្នាំ',
      '២. ប្រព័ន្ធបូកប្រាក់ខែគោល + ប្រាក់ឧបត្ថម្ភ - ប្រាក់កាត់វត្តមាន - ពន្ធ',
      '៣. ពិនិត្យមើលតួលេខ និងកែសម្រួលបន្ថែមបើចាំបាច់',
      '៤. ចុច "Approve Batch" -> ប្តូរស្ថានភាពទៅជា "Paid"',
      '៥. បុគ្គលិកទទួលបានការជូនដំណឹង និងអាចទាញយក Payslip មើលបាន'
    ],
    videoScript: [
      { step: 1, action: 'Generate Payroll Batch', narrationKh: 'ជំហានទី ១៖ ជ្រើសរើសខែដែលត្រូវបើកប្រាក់ខែ រួចចុច "Generate Payroll"។', narrationEn: 'Step 1: Select the target payroll month and click "Generate Payroll".' },
      { step: 2, action: 'Approve and Release', narrationKh: 'ជំហានទី ២៖ ពិនិត្យមើលតួលេខសរុប រួចចុច "Approve" ដើម្បីបញ្ចេញប័ណ្ណបើកប្រាក់ខែ។', narrationEn: 'Step 2: Audit the consolidated figures and click "Approve" to release employee payslips.' }
    ],
    relatedDocsPath: '/modules/payroll'
  }
];
