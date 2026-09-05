<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;
use App\Models\Company\Store;

class CMSSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;
        $storeId = Store::value('id') ?? 1;

        // 1. Blog Categories (10 records)
        $blogCategories = [];
        $catNames = ['Retail Trends', 'POS Technology', 'E-Commerce Tips', 'Inventory Best Practices', 'Marketing Strategies', 'Customer Loyalty', 'Hardware Reviews', 'Software Updates', 'Business Growth', 'Security Alerts'];
        foreach ($catNames as $i => $name) {
            $blogCategories[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'name' => $name,
                'slug' => strtolower(str_replace(' ', '-', $name)),
                'description' => "Articles and guides about $name.",
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('blog_categories')->insert($blogCategories);

        // 2. Blog Tags (10 records)
        $blogTags = [];
        $tagNames = ['Retail', 'POS', 'Tech', 'Marketing', 'Inventory', 'Loyalty', 'Hardware', 'Software', 'Business', 'Security'];
        foreach ($tagNames as $i => $name) {
            $blogTags[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'name' => $name,
                'slug' => strtolower($name),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('blog_tags')->insert($blogTags);

        // 3. Blog Posts / Blogs (10 Authentic Articles)
        $articles = [
            [
                'title' => 'Omnichannel Retailing in Cambodia: Bridging Physical Stores and E-Commerce',
                'cat_id' => 1,
                'excerpt' => 'How unified inventory and cloud POS architecture are redefining customer expectations in Phnom Penh.',
                'content' => '<p>Modern retail customers expect seamless transitions between online discovery and physical store fulfillment. By integrating cloud POS systems with automated inventory synchronization across all branch locations, retailers eliminate overselling and provide frictionless checkout experiences.</p>',
            ],
            [
                'title' => 'Why Real-Time KHQR Payments are Transforming Phnom Penh Retail',
                'cat_id' => 2,
                'excerpt' => 'The Bakong national payment standard has accelerated digital adoption and reduced cash handling overhead for merchants.',
                'content' => '<p>The adoption of KHQR has reduced cash handling expenses for retail stores while offering consumers instant, secure payment processing. Real-time bank settlement reconciliation via API ensures accurate daily cash drawer closures.</p>',
            ],
            [
                'title' => 'Complete Guide to Managing Multi-Warehouse Tech Inventories in 2026',
                'cat_id' => 4,
                'excerpt' => 'Optimizing bin locations, stock transfers, and automated reorder triggers across regional depots.',
                'content' => '<p>Efficient supply chain management requires real-time visibility into stock levels across central distribution centers and retail outlet storerooms. Automated low-stock alerts prevent lost sales on high-velocity SKUs.</p>',
            ],
            [
                'title' => 'How to Choose the Best Thermal Barcode Scanner for High-Volume Checkouts',
                'cat_id' => 7,
                'excerpt' => 'A comparative analysis of 1D vs 2D omnidirectional barcode imagers in busy supermarkets and tech retail outlets.',
                'content' => '<p>High-throughput retail environments demand reliable barcode scanning capable of reading damaged labels and mobile screens. Investing in ergonomic 2D imagers drastically reduces transaction times during peak checkout hours.</p>',
            ],
            [
                'title' => 'Apple M3 Max vs Intel Core Ultra: Workstation Benchmark for Creatives',
                'cat_id' => 7,
                'excerpt' => 'In-depth testing on 4K ProRes rendering, thermal throttling, and battery efficiency for mobile developers.',
                'content' => '<p>Our lab tests compare sustained GPU workloads between Apple Silicon architecture and modern x86 mobile chips. For video editing and machine learning compilation on the go, unified memory architecture delivers unparalleled energy efficiency.</p>',
            ],
            [
                'title' => 'Top 5 Strategies to Reduce Churn and Boost Customer Lifetime Value',
                'cat_id' => 6,
                'excerpt' => 'Leveraging RFM segmentation, tiered loyalty points, and personalized re-engagement campaigns.',
                'content' => '<p>Retaining existing enterprise customers costs a fraction of acquiring new leads. Automated RFM analysis identifies at-risk accounts before they disengage, allowing proactive relationship management and customized incentive programs.</p>',
            ],
            [
                'title' => 'Setting Up Multi-Tier Wholesale Pricing for Enterprise B2B Clients',
                'cat_id' => 9,
                'excerpt' => 'Configuring volume discounts, minimum order quantities, and custom credit limits.',
                'content' => '<p>Wholesale distribution demands flexible pricing structures. Offering automated volume tiers and pre-approved Net 30 payment terms allows B2B distributors to scale their client base without manual invoice intervention.</p>',
            ],
            [
                'title' => 'Best Noise-Canceling Headphones for Remote Work and Productivity',
                'cat_id' => 7,
                'excerpt' => 'Comparing Sony WH-1000XM5 and Apple AirPods Max in open-office environments and coffee shops.',
                'content' => '<p>Active noise cancellation and microphone voice-isolation are crucial for hybrid workers attending daily video conferences. Discover which flagship ANC headphones provide the best combination of acoustic clarity and long-session comfort.</p>',
            ],
            [
                'title' => 'Camera Gear Guide: Mirrorless vs Cinema Bodies for Commercial Content',
                'cat_id' => 7,
                'excerpt' => 'Evaluating dynamic range, cooling fans, XLR audio, and autofocus reliability on professional video sets.',
                'content' => '<p>Choosing between hybrid mirrorless cameras like the Sony Alpha 7 IV and dedicated cinema bodies like the FX3 depends on production workflow requirements, cooling fan demands for extended recording, and professional audio connectivity.</p>',
            ],
            [
                'title' => 'Security Best Practices: Protecting POS Terminals from Data Breaches',
                'cat_id' => 10,
                'excerpt' => 'Network segmentation, encrypted card readers, and strict role-based access control guidelines.',
                'content' => '<p>Securing point-of-sale infrastructure requires end-to-end encryption, regular firmware patching, and granular user role permissions to protect customer financial data and maintain PCI-DSS compliance.</p>',
            ],
        ];

        DB::table('blog_blog_tag')->truncate();
        DB::table('blogs')->truncate();
        $blogs = [];
        for ($i = 1; $i <= 10; $i++) {
            $art = $articles[$i - 1];
            $blogs[] = [
                'id' => $i,
                'company_id' => $companyId,
                'blog_category_id' => $art['cat_id'],
                'user_id' => 1,
                'title' => $art['title'],
                'slug' => \Illuminate\Support\Str::slug($art['title']),
                'excerpt' => $art['excerpt'],
                'content' => $art['content'],
                'featured_image' => "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
                'status' => 'published',
                'published_at' => now()->subDays(15 - $i),
                'view_count' => rand(150, 2400),
                'meta_title' => $art['title'] . " | Official Blog",
                'meta_description' => $art['excerpt'],
                'created_at' => now()->subDays(15 - $i),
                'updated_at' => now()->subDays(15 - $i),
            ];
        }
        DB::table('blogs')->insert($blogs);

        // 4. Blog Post Tags Pivot
        $postTags = [];
        for ($i = 1; $i <= 10; $i++) {
            $postTags[] = [
                'blog_id' => $i,
                'blog_tag_id' => (($i - 1) % 10) + 1,
            ];
            $postTags[] = [
                'blog_id' => $i,
                'blog_tag_id' => (($i + 2) % 10) + 1,
            ];
        }
        DB::table('blog_blog_tag')->insert($postTags);

        // 5. Pages (10 Authentic Legal & Company Pages)
        DB::table('pages')->truncate();
        $pages = [];
        $pageTemplates = [
            ['title' => 'About Us',           'content' => '<h1>About Our Company</h1><p>We are Cambodia premier enterprise retail and consumer electronics technology provider, delivering authentic hardware, certified warranties, and omnichannel POS solutions nationwide.</p>'],
            ['title' => 'Contact Us',         'content' => '<h1>Contact Our Support Team</h1><p>Reach our Phnom Penh customer support center at support@centralpos.com or hotline +855 23 888 100. Open Monday to Saturday 8:00 AM – 6:00 PM.</p>'],
            ['title' => 'Privacy Policy',      'content' => '<h1>Privacy Policy</h1><p>We are dedicated to safeguarding your personal and transactional information with industry-standard encryption and strict data protection protocols.</p>'],
            ['title' => 'Terms of Service',   'content' => '<h1>Terms of Service</h1><p>All sales, warranty claims, and account operations are governed by our official commercial enterprise terms and Cambodian e-commerce regulations.</p>'],
            ['title' => 'Refund & Exchange',  'content' => '<h1>Refund & 7-Day Exchange Policy</h1><p>Items returned unopened in pristine condition within 7 days are eligible for exchange or store credit upon technical inspection.</p>'],
            ['title' => 'Customer FAQ',       'content' => '<h1>Frequently Asked Questions</h1><p>Browse our knowledge base for answers regarding payments, delivery timelines, warranty coverage, and B2B orders.</p>'],
            ['title' => 'Careers',            'content' => '<h1>Join Our Growing Team</h1><p>Explore exciting career opportunities in tech logistics, cloud software engineering, retail sales, and enterprise account management.</p>'],
            ['title' => 'Developer API Docs', 'content' => '<h1>Enterprise Developer API</h1><p>Integrate your external ERP or storefront with our REST API endpoints for real-time inventory, sales synchronization, and webhook events.</p>'],
            ['title' => 'Affiliate Program',  'content' => '<h1>Partner & Affiliate Program</h1><p>Earn competitive commissions by referring tech creators, business clients, and retail partners to our authorized hardware platform.</p>'],
            ['title' => 'Warranty Coverage',  'content' => '<h1>Official Manufacturer Warranty</h1><p>Every smartphone, laptop, and electronic device comes with certified official warranty service backed by local authorized repair centers.</p>'],
        ];

        foreach ($pageTemplates as $i => $pt) {
            $pages[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'title' => $pt['title'],
                'slug' => \Illuminate\Support\Str::slug($pt['title']),
                'content' => $pt['content'],
                'status' => 'published',
                'meta_title' => $pt['title'] . " | Official Central Store",
                'meta_description' => "Official documentation and policy regarding " . $pt['title'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('pages')->insert($pages);

        // 6. FAQs (10 Authentic E-Commerce & POS FAQs)
        $faqsData = [
            ['q' => 'What payment methods do you accept online and in-store?', 'a' => 'We accept ABA KHQR, ACLEDA Mobile, Wing Bank, Bakong KHQR, Cash on Delivery (COD), and Visa/Mastercard credit cards with secure processing.', 'cat' => 'Payments'],
            ['q' => 'How long does nationwide delivery take in Cambodia?',       'a' => 'Phnom Penh orders are delivered same-day or within 24 hours. Provincial orders via Virak Buntham or J&T Express take 1 to 2 business days.', 'cat' => 'Shipping'],
            ['q' => 'Are all tech products and smartphones 100% genuine?',     'a' => 'Yes, 100% of our products are brand new, original, and sourced directly from official brand distributors with valid manufacturer warranties.', 'cat' => 'Products'],
            ['q' => 'What is your return and exchange policy for defective items?','a' => 'We offer a 7-day direct exchange policy for items with manufacturer hardware defects, plus full local warranty repair service.', 'cat' => 'Warranty'],
            ['q' => 'Can I place a wholesale B2B order with Net 30 terms?',     'a' => 'Yes, verified corporate and institutional accounts can apply for credit terms and custom volume pricing by contacting our enterprise sales division.', 'cat' => 'B2B Sales'],
            ['q' => 'How does in-store pickup at Central SuperStore work?',     'a' => 'Select "Store Pickup" during checkout. You will receive an instant SMS/email notification once your package is packed and ready for collection.', 'cat' => 'Orders'],
            ['q' => 'How do I earn and redeem loyalty points on purchases?',    'a' => 'Registered customers earn 1 loyalty point for every $1 USD spent. Points can be redeemed at checkout for instant cash discounts.', 'cat' => 'Loyalty'],
            ['q' => 'Does your POS system support offline transactions and sync?','a' => 'Yes, our POS client terminal caches sales locally during internet drops and automatically syncs all data to the cloud once reconnected.', 'cat' => 'Technical'],
            ['q' => 'Can I get an official VAT Tax Invoice for my purchase?',   'a' => 'Yes, enter your registered business Tax Number (TIN) at checkout to receive an official Cambodian General Department of Taxation compliant VAT invoice.', 'cat' => 'Billing'],
            ['q' => 'What shipping carriers do you partner with for deliveries?','a' => 'We partner with Virak Buntham Logistics (VET), J&T Express Cambodia, and GrabExpress for safe, traceable parcel shipments.', 'cat' => 'Shipping'],
        ];

        DB::table('faqs')->truncate();
        $faqs = [];
        foreach ($faqsData as $i => $f) {
            $faqs[] = [
                'company_id' => $companyId,
                'question' => $f['q'],
                'answer' => $f['a'],
                'category' => $f['cat'],
                'sort_order' => $i + 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('faqs')->insert($faqs);

        // 7. Banners (10 records with 100% PRESERVED high-res sample imagery)
        $bannersData = [
            [
                'id' => 1,
                'title' => 'Next-Gen Ultra Performance Laptops',
                'subtitle' => 'Experience M3 & Intel Core Ultra performance with 4K OLED displays & all-day battery.',
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
                'link' => '/products?category=computers-laptops',
                'position' => 'hero',
                'sort_order' => 1,
            ],
            [
                'id' => 2,
                'title' => 'Immersive Spatial Studio Audio',
                'subtitle' => 'Audiophile-grade studio clarity with active noise cancellation and lossless wireless audio.',
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                'link' => '/products?category=audio-sound',
                'position' => 'hero',
                'sort_order' => 2,
            ],
            [
                'id' => 3,
                'title' => 'Ultimate Pro Gaming Battlestation Setup',
                'subtitle' => 'High-refresh RGB displays, mechanical optical switches, and ultra-fast wireless precision.',
                'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
                'link' => '/products?category=gaming-esports',
                'position' => 'hero',
                'sort_order' => 3,
            ],
            [
                'id' => 4,
                'title' => 'Precision Smart Fitness & Health Trackers',
                'subtitle' => 'Titanium sapphire chassis with biometric health sensors, ECG, and multi-day GPS tracking.',
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                'link' => '/products?category=wearables-smartwatches',
                'position' => 'hero',
                'sort_order' => 4,
            ],
            [
                'id' => 5,
                'title' => 'Flagship 5G Smartphones & Triple Cameras',
                'subtitle' => 'Up to 25% discount on titanium flagships with cinematic 4K ProRes video recording.',
                'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=1200&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80',
                'link' => '/products?category=smartphones-tablets',
                'position' => 'sidebar',
                'sort_order' => 5,
            ],
            [
                'id' => 6,
                'title' => 'Custom Mechanical Keyboards & Peripherals',
                'subtitle' => 'Hot-swappable tactile switches, CNC aluminum cases, and wireless ergonomic precision mice.',
                'image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
                'link' => '/products?category=accessories-peripherals',
                'position' => 'sidebar',
                'sort_order' => 6,
            ],
            [
                'id' => 7,
                'title' => 'Pro Mirrorless 4K Creator Cameras',
                'subtitle' => 'Full-frame sensors with dual stabilization and interchangeable cinema prime lenses.',
                'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                'link' => '/products?category=camera-photography',
                'position' => 'sidebar',
                'sort_order' => 7,
            ],
            [
                'id' => 8,
                'title' => 'Weekend Super Flash Sale — Up to 50% OFF',
                'subtitle' => 'Exclusive discounts on top tech brands. Free express nationwide delivery on orders over $50.',
                'image' => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
                'link' => '/products?sort=deals',
                'position' => 'footer',
                'sort_order' => 8,
            ],
            [
                'id' => 9,
                'title' => 'Get $20 OFF Your First Order',
                'subtitle' => 'Claim code WELCOME20 at checkout on your first genuine device purchase.',
                'image' => 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1200&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=800&q=80',
                'link' => '/products',
                'position' => 'popup',
                'sort_order' => 9,
            ],
            [
                'id' => 10,
                'title' => 'Enterprise POS Systems & Smart Barcode Scanners',
                'subtitle' => 'Dual-screen touch POS terminals with high-speed thermal printers & real-time inventory sync.',
                'image' => 'https://images.unsplash.com/photo-1556742049-0a67e5577ff0?auto=format&fit=crop&w=1600&q=80',
                'mobile_image' => 'https://images.unsplash.com/photo-1556742049-0a67e5577ff0?auto=format&fit=crop&w=800&q=80',
                'link' => '/products?category=electronics',
                'position' => 'hero',
                'sort_order' => 10,
            ],
        ];

        DB::table('banners')->truncate();
        $banners = [];
        foreach ($bannersData as $item) {
            $banners[] = array_merge($item, [
                'company_id' => $companyId,
                'store_id' => $storeId,
                'starts_at' => now()->subDays(1),
                'ends_at' => now()->addDays(60),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        DB::table('banners')->insert($banners);

        // 8. Media (10 records)
        DB::table('media')->truncate();
        $media = [];
        for ($i = 1; $i <= 10; $i++) {
            $media[] = [
                'company_id' => $companyId,
                'user_id' => 1,
                'name' => "media-file-$i",
                'file_name' => "file-$i.jpg",
                'mime_type' => 'image/jpeg',
                'path' => "media/file-$i.jpg",
                'disk' => 'public',
                'size' => rand(10000, 500000),
                'type' => 'image',
                'conversions' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('media')->insert($media);

        if (DB::getDriverName() === 'pgsql') {
            $tables = ['blog_categories', 'blog_tags', 'blogs', 'blog_blog_tag', 'pages', 'faqs', 'banners', 'media'];
            foreach ($tables as $table) {
                try {
                    DB::statement("SELECT setval('{$table}_id_seq', COALESCE((SELECT MAX(id) FROM {$table}), 0) + 1, false);");
                } catch (\Throwable $e) {}
            }
        }
    }
}
