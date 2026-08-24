<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Company\Company;
use App\Models\Company\Store;

class UpdateBannersSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = Company::value('id') ?? 1;
        $storeId = Store::value('id') ?? 1;

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

        foreach ($bannersData as $b) {
            DB::table('banners')->updateOrInsert(
                ['id' => $b['id']],
                array_merge($b, [
                    'company_id' => $companyId,
                    'store_id' => $storeId,
                    'starts_at' => now()->subDays(1),
                    'ends_at' => now()->addDays(60),
                    'is_active' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ])
            );
        }
    }
}
