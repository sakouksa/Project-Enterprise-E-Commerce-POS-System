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

        // 3. Blog Posts / Blogs (10 records)
        $blogs = [];
        for ($i = 1; $i <= 10; $i++) {
            $title = "Top $i tips for successful Business Management";
            $blogs[] = [
                'id' => $i,
                'company_id' => $companyId,
                'blog_category_id' => rand(1, 10),
                'user_id' => 1,
                'title' => $title,
                'slug' => strtolower(str_replace(' ', '-', $title)) . '-' . $i,
                'excerpt' => "A brief summary preview of the article tip $i.",
                'content' => "<p>Detailed HTML content body for top business management tips article $i.</p>",
                'featured_image' => "blogs/featured-post-$i.jpg",
                'status' => 'published',
                'published_at' => now()->subDays(10 - $i),
                'view_count' => rand(50, 1000),
                'meta_title' => "Top $i Business Management Tips",
                'meta_description' => "Learn how to optimize retail workflows with our top $i business management recommendations.",
                'created_at' => now()->subDays(10 - $i),
                'updated_at' => now()->subDays(10 - $i),
            ];
        }
        DB::table('blogs')->insert($blogs);

        // 4. Blog Post Tags Pivot
        $postTags = [];
        for ($i = 1; $i <= 10; $i++) {
            $postTags[] = [
                'blog_id' => $i,
                'blog_tag_id' => rand(1, 10),
            ];
        }
        DB::table('blog_blog_tag')->insert($postTags);

        // 5. Pages (10 records)
        $pages = [];
        $pageTitles = ['About Us', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Refund Policy', 'FAQ', 'Careers', 'Developer API', 'Affiliate Program', 'Press Kit'];
        foreach ($pageTitles as $i => $title) {
            $pages[] = [
                'id' => $i + 1,
                'company_id' => $companyId,
                'title' => $title,
                'slug' => strtolower(str_replace(' ', '-', $title)),
                'content' => "<h1>$title</h1><p>Full content page of our legal or information text regarding $title.</p>",
                'status' => 'published',
                'meta_title' => "$title | Enterprise POS",
                'meta_description' => "Read details about our company $title conditions and details.",
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('pages')->insert($pages);

        // 6. FAQs (10 records)
        $faqs = [];
        for ($i = 1; $i <= 10; $i++) {
            $faqs[] = [
                'company_id' => $companyId,
                'question' => "Frequently Asked Question number $i?",
                'answer' => "This is a detailed answer explaining the workflow or policy details for FAQ $i.",
                'category' => $i <= 5 ? 'General' : 'Technical',
                'sort_order' => $i,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('faqs')->insert($faqs);

        // 7. Banners (10 records with real high-res project-matching imagery)
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
    }
}
