import { FaqItem } from '../types/docs';

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    questionKh: 'តើប្រព័ន្ធ Enterprise E-Commerce + POS System នេះជាអ្វី?',
    questionEn: 'What is the Enterprise E-Commerce + POS System?',
    answerKh: 'ប្រព័ន្ធនេះគឺជា Enterprise Platform រួមបញ្ចូលគ្នាទាំង E-Commerce Storefront, POS Terminal ក្នុងហាង, ការគ្រប់គ្រងស្តុកពហុឃ្លាំង, ការបញ្ជាទិញទំនិញចូល (Purchasing), ធនធានមនុស្ស (HRM & Attendance QR), ការបើកប្រាក់ខែ (Payroll), និងហិរញ្ញវត្ថុ ចូលទៅក្នុង Laravel Backend តែមួយ។',
    answerEn: 'It is a unified enterprise platform combining customer storefront, high-speed retail POS, multi-branch inventory, procurement, dynamic QR attendance, automated payroll, and financial reports into a single unified Laravel backend and PostgreSQL database.',
    relatedPath: '/overview'
  },
  {
    id: 'faq-2',
    category: 'POS & Cashier',
    questionKh: 'តើប្រព័ន្ធ POS អាចដំណើរការបានដែរឬទេ ប្រសិនបើដាច់អ៊ីនធឺណិតបណ្តោះអាសន្ន?',
    questionEn: 'Does the POS terminal support offline operation during network loss?',
    answerKh: 'នៅលើ Flutter Mobile App មានបំពាក់ Hive Local NoSQL Database ដែលអនុញ្ញាតឱ្យរក្សាទុកប្រតិបត្តិការលក់ក្នុងទូរស័ព្ទ និងធ្វើសមកាលកម្ម (Sync) ស្វ័យប្រវត្តិកាលណាមានអ៊ីនធឺណិតឡើងវិញ។',
    answerEn: 'Yes, the Flutter mobile terminal utilizes Hive local NoSQL storage to queue offline transactions and synchronize atomically with the backend once internet connectivity is restored.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-3',
    category: 'POS & Cashier',
    questionKh: 'តើការទូទាត់តាម KHQR ដំណើរការយ៉ាងដូចម្តេច?',
    questionEn: 'How does instant KHQR Bakong payment processing work?',
    answerKh: 'នៅពេល Cashier ចុចជ្រើសរើស KHQR ប្រព័ន្ធនឹងបង្កើត Dynamic QR Code តាមស្តង់ដារធនាគារជាតិនៃកម្ពុជា ជាមួយចំនួនទឹកប្រាក់ជាក់លាក់។ នៅពេលអតិថិជនស្កេនបង់ប្រាក់តាម App ធនាគារណាមួយ ប្រព័ន្ធនឹងទទួលបាន Webhook បញ្ជាក់ និងព្រីនវិក្កយបត្រភ្លាមៗ។',
    answerEn: 'When the cashier selects KHQR, the backend generates an NBC Bakong-compliant dynamic QR code encoding the exact cart amount. Once the customer scans and approves the transfer in any banking app, the payment gateway webhook notifies the terminal and triggers receipt printing.',
    relatedPath: '/modules/pos'
  },
  {
    id: 'faq-4',
    category: 'Warehouse & Stock',
    questionKh: 'តើស្តុកទំនិញកើនឡើងនៅពេលណា ពេលទិញទំនិញចូល?',
    questionEn: 'When does inventory quantity actually increase during purchasing?',
    answerKh: 'ស្តុកក្នុងឃ្លាំងនឹងមិនទាន់កើនឡើងទេនៅពេលចេញប័ណ្ណបញ្ជាទិញ (Draft/Ordered)។ ស្តុកនឹងកើនឡើងជាក់ស្តែងតែនៅពេលដែលបុគ្គលិកឃ្លាំងចុច "Receive Stock" ឬប្តូរស្ថានភាពទៅជា "Received" ប៉ុណ្ណោះ។',
    answerEn: 'Inventory quantities do NOT increase when a Purchase Order is drafted or ordered. Stock only increases when warehouse staff explicitly performs the "Receive Stock" inspection action, creating an immutable movement ledger entry.',
    relatedPath: '/modules/purchases'
  },
  {
    id: 'faq-5',
    category: 'HR & Payroll',
    questionKh: 'តើធ្វើដូចម្តេចដើម្បីការពារបុគ្គលិកកុំឱ្យស្កេនវត្តមានជំនួសគ្នា?',
    questionEn: 'How does the attendance system prevent buddy punching (proxy clock-in)?',
    answerKh: 'ប្រព័ន្ធការពារតាម ៣ ស្រទាប់៖ ១. QR Code លើ Kiosk ផ្លាស់ប្តូររៀងរាល់ ១៥ វិនាទី ២. ចងភ្ជាប់ Device UUID ទូរស័ព្ទបុគ្គលិក ៣. ផ្ទៀងផ្ទាត់ទីតាំង GPS Geofencing ក្នុងរង្វង់ ៥០ ម៉ែត្រនៃសាខា។',
    answerEn: 'The system uses a 3-layer security mechanism: 1. Expiring dynamic QR codes refreshing every 15s on the kiosk, 2. Hardware device UUID binding registered per employee, 3. GPS Geofence radius verification at the branch location.',
    relatedPath: '/modules/attendance'
  },
  {
    id: 'faq-6',
    category: 'Developer & Sysadmin',
    questionKh: 'តើត្រូវរៀបចំ Local Development ដោយរបៀបណា?',
    questionEn: 'How do developers set up the local development environment?',
    answerKh: 'អ្នកគ្រាន់តែ Clone repository រួចដំណើរការ `npm run dev` ក្នុង Root folder ដែលនឹង Start Backend (Port 8000), Admin Dashboard (Port 5173), និង Customer Website (Port 5174) ព្រមគ្នា។',
    answerEn: 'Clone the repository and run `npm run dev` in the root workspace. This concurrently boots the Laravel Backend (port 8000), React Admin Dashboard (port 5173), and Customer Website (port 5174).',
    relatedPath: '/developer-guide'
  }
];
