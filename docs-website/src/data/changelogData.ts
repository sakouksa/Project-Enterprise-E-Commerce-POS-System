export interface ReleaseVersion {
  version: string;
  releaseDate: string;
  badge: 'Current Release' | 'Previous Release' | 'Planned Roadmap';
  title: string;
  titleKh: string;
  highlights: { type: 'feature' | 'fix' | 'refactor' | 'security' | 'docs'; desc: string; descKh: string }[];
}

export const CHANGELOG_DATA: ReleaseVersion[] = [
  {
    version: 'v1.1.0',
    releaseDate: 'August 2026',
    badge: 'Current Release',
    title: 'Enterprise High-Speed POS & Global Media Architecture Release',
    titleKh: 'កំណែទម្រង់ Enterprise POS ល្បឿនលឿន និងស្ថាបត្យកម្ម Media កណ្តាល',
    highlights: [
      { type: 'feature', desc: 'Added National Bank of Cambodia Bakong KHQR dynamic payment generation & instant webhook verification.', descKh: 'បញ្ចូលមុខងារបង្កើត KHQR Dynamic តាមស្តង់ដារធនាគារជាតិ និងផ្ទៀងផ្ទាត់ការបង់ប្រាក់ស្វ័យប្រវត្តិ។' },
      { type: 'feature', desc: 'Implemented Dynamic QR Kiosk Attendance with hardware device UUID binding and GPS geofencing.', descKh: 'ដំឡើងប្រព័ន្ធកត់ត្រាវត្តមាន Dynamic QR លើ Kiosk ជាមួយការចងភ្ជាប់ Device និង GPS Geofencing។' },
      { type: 'security', desc: 'Multi-Tenant Spatie RBAC integration with 80+ granular permission nodes and JWT silent refresh rotation.', descKh: 'ពង្រឹងសុវត្ថិភាព Spatie RBAC ជាង ៨០ សិទ្ធិ និងប្រព័ន្ធ Silent Refresh Token។' },
      { type: 'feature', desc: 'Unified DatabaseImageSeeder embedding 50+ real product photos directly in database.', descKh: 'បញ្ចូលរូបភាពផលិតផលពិតជាង ៥០ សន្លឹកចូល Database ដោយស្វ័យប្រវត្តិ។' },
      { type: 'docs', desc: 'Complete enterprise documentation portal and interactive developer user guide release.', descKh: 'បញ្ចេញគេហទំព័រមគ្គុទ្ទេសក៍ និងឯកសារបណ្តុះបណ្តាលផ្លូវការពេញលេញ។' }
    ]
  },
  {
    version: 'v1.0.0',
    releaseDate: 'January 2026',
    badge: 'Previous Release',
    title: 'Initial Monorepo Architecture Foundation',
    titleKh: 'ស្ថាបត្យកម្មគ្រឹះ Monorepo ដំបូង',
    highlights: [
      { type: 'feature', desc: 'Initial Laravel 12 Backend API, React Admin Dashboard, and React Customer Storefront.', descKh: 'បង្កើតប្រព័ន្ធ Backend, ផ្ទាំង Admin Dashboard និងគេហទំព័រទិញទំនិញដំបូង។' },
      { type: 'feature', desc: 'Initial 99 Relational Database Tables, 36 Migrations, and Core Product Catalog.', descKh: 'រៀបចំព្រាងតារាងទិន្នន័យ ៩៩ តារាង និងកាតាឡុកទំនិញដំបូង។' }
    ]
  },
  {
    version: 'v2.0.0-Roadmap',
    releaseDate: 'Q4 2026 (Planned)',
    badge: 'Planned Roadmap',
    title: 'AI Product Recommendations & Automated Multi-Carrier Logistics Integration',
    titleKh: 'ផែនការអនាគត៖ ប្រព័ន្ធ AI ណែនាំទំនិញ និងការភ្ជាប់ក្រុមហ៊ុនដឹកជញ្ជូនស្វ័យប្រវត្តិ',
    highlights: [
      { type: 'feature', desc: 'AI-driven personalized product recommendations and cross-selling on storefront.', descKh: 'បំពាក់ AI សម្រាប់ណែនាំទំនិញដែលត្រូវចិត្តអតិថិជនលើគេហទំព័រ។' },
      { type: 'feature', desc: 'Automated API integration with local courier shipping services (J&T Express, Virak Buntham).', descKh: 'ភ្ជាប់ API ស្វ័យប្រវត្តិជាមួយក្រុមហ៊ុនដឹកជញ្ជូនក្នុងស្រុក។' }
    ]
  }
];
