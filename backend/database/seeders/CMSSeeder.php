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

        // 7. Banners (10 records)
        $banners = [];
        $positions = ['hero', 'sidebar', 'popup', 'footer'];
        for ($i = 1; $i <= 10; $i++) {
            $banners[] = [
                'id' => $i,
                'company_id' => $companyId,
                'store_id' => $storeId,
                'title' => "Special Promo Banner $i",
                'subtitle' => "Up to 50% discount on new items!",
                'image' => "banners/promo-banner-$i.jpg",
                'mobile_image' => "banners/mobile-banner-$i.jpg",
                'link' => '/promo-' . $i,
                'position' => $positions[$i % 4],
                'sort_order' => $i,
                'starts_at' => now()->subDays(1),
                'ends_at' => now()->addDays(30),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
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
