import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Zap, Flame, Sparkles, TrendingUp,
  ShieldCheck, Truck, Clock, Tag, ChevronRight, Award
} from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import Spinner from '@/components/ui/Spinner'
import api from '@/lib/api'

interface HomepageData {
  banners: Array<{ id: number; title: string; subtitle?: string; image?: string; link?: string; button_text?: string }>
  flash_sale?: { id: number; name: string; ends_at?: string; products: Array<any> }
  featured_products: Array<any>
  best_sellers: Array<any>
  new_arrivals: Array<any>
  top_categories: Array<{ id: number; name: string; slug: string; image?: string; product_count?: number }>
  top_brands: Array<{ id: number; name: string; slug: string; logo?: string; product_count?: number }>
  blog_preview: Array<any>
}

const HomePage: React.FC = () => {
  const [data, setData]       = useState<HomepageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeBanner, setActiveBanner] = useState(0)

  useEffect(() => {
    api.get('/homepage')
      .then(({ data }) => setData(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Auto banner slide
  useEffect(() => {
    if (!data?.banners?.length) return
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % data.banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [data?.banners])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  const defaultBanners = [
    {
      id: 1,
      title: 'Next-Gen Electronics & Smart Devices',
      subtitle: 'Up to 40% OFF on Flagship Smartphones, Laptops & Accessories',
      image: 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?auto=format&fit=crop&w=1200&q=80',
      link: '/products',
      button_text: 'Shop Tech Deals',
    },
    {
      id: 2,
      title: 'Premium Fashion & Modern Lifestyle',
      subtitle: 'Exclusive New Season Collection Arrived for Men & Women',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      link: '/products',
      button_text: 'Explore Collection',
    },
  ]

  const banners = data?.banners?.length ? data.banners : defaultBanners

  return (
    <div className="space-y-12 lg:space-y-16 pb-16">

      {/* ── 1. Hero Banner Slider ────────────────────────────────────── */}
      <section className="container-site pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[420px] lg:min-h-[500px] flex items-center bg-gray-900 text-white">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === activeBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image with Dark Overlay */}
              <img
                src={banner.image || defaultBanners[0].image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent" />

              {/* Banner Content */}
              <div className="relative h-full container-site flex flex-col justify-center max-w-xl p-8 lg:p-12 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: idx === activeBanner ? 1 : 0, y: idx === activeBanner ? 0 : 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5" /> Featured Special
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display leading-tight">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="text-sm sm:text-base text-gray-300 mt-2 font-normal">
                      {banner.subtitle}
                    </p>
                  )}
                  <div className="pt-4 flex items-center gap-3">
                    <Link to={banner.link || '/products'} className="btn-primary btn-lg text-sm shadow-xl">
                      {banner.button_text || 'Shop Now'} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeBanner ? 'bg-blue-500 w-8' : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Top Categories Grid ──────────────────────────────────── */}
      <section className="container-site">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our wide selection of authentic products</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(data?.top_categories?.length ? data.top_categories : [
            { id: 1, name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', product_count: 140 },
            { id: 2, name: 'Apparel & Wear', slug: 'apparel', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80', product_count: 95 },
            { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80', product_count: 78 },
            { id: 4, name: 'Beauty & Care', slug: 'beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80', product_count: 64 },
            { id: 5, name: 'Sports & Fitness', slug: 'sports', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80', product_count: 52 },
            { id: 6, name: 'Books & Stationery', slug: 'books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80', product_count: 88 },
          ]).map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="card-hover p-4 text-center group flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden mb-3 group-hover:scale-110 transition-transform duration-300">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-gray-400 mt-0.5">{cat.product_count || 50}+ items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Flash Sale Banner ────────────────────────────────────── */}
      {data?.flash_sale && data.flash_sale.products?.length > 0 && (
        <section className="container-site">
          <div className="card p-6 lg:p-8 bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 text-white border-0 rounded-3xl shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Flame className="w-7 h-7 fill-current animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white font-display">
                    {data.flash_sale.name || 'Limited-Time Flash Sale'}
                  </h2>
                  <p className="text-xs lg:text-sm text-red-100">Massive price drops on selected items — Hurry!</p>
                </div>
              </div>

              <Link to="/products?sort=deals" className="btn bg-white text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl shadow-md">
                View All Deals
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.flash_sale.products.slice(0, 4).map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Featured Products ────────────────────────────────────── */}
      <section className="container-site">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Hand-picked top quality items selected by our experts</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(data?.featured_products?.length ? data.featured_products : [
            { id: 101, name: 'Wireless Noise-Canceling Headphones', slug: 'headphones', selling_price: 199.99, compare_price: 249.99, is_featured: true, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', category: 'Electronics' },
            { id: 102, name: 'Smart Fitness Watch Series 9', slug: 'smartwatch', selling_price: 299.00, compare_price: 349.00, is_featured: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', category: 'Electronics' },
            { id: 103, name: 'Ultra-Slim Mechanical Keyboard', slug: 'keyboard', selling_price: 129.50, compare_price: 159.00, is_featured: true, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', category: 'Accessories' },
            { id: 104, name: 'Ergonomic Executive Office Chair', slug: 'office-chair', selling_price: 249.00, compare_price: 299.00, is_featured: true, image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1273?auto=format&fit=crop&w=600&q=80', category: 'Home' },
            { id: 105, name: 'Professional Camera Lens 50mm', slug: 'camera-lens', selling_price: 499.00, compare_price: 549.00, is_featured: true, image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=600&q=80', category: 'Photography' },
            { id: 106, name: 'Minimalist Leather Backpack', slug: 'leather-backpack', selling_price: 89.00, compare_price: 119.00, is_featured: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', category: 'Apparel' },
          ]).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* ── 5. Promotional Promo Banner Split ───────────────────────── */}
      <section className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 lg:p-10 flex flex-col justify-between min-h-[240px]">
            <div className="space-y-2 z-10 max-w-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Special Offer</span>
              <h3 className="text-2xl font-bold font-display">Upgrade Your Home Setup</h3>
              <p className="text-xs text-blue-200">Save up to $150 on premium monitors & ergonomics.</p>
            </div>
            <div className="pt-4 z-10">
              <Link to="/products?category=electronics" className="btn-primary btn-sm">Shop Now</Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 to-pink-900 text-white p-8 lg:p-10 flex flex-col justify-between min-h-[240px]">
            <div className="space-y-2 z-10 max-w-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">New Arrivals</span>
              <h3 className="text-2xl font-bold font-display">Fresh Urban Fashion</h3>
              <p className="text-xs text-purple-200">Modern minimalist apparel designed for comfort.</p>
            </div>
            <div className="pt-4 z-10">
              <Link to="/products?category=apparel" className="btn bg-white text-purple-900 hover:bg-purple-50 btn-sm font-bold">Explore Style</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Best Sellers Grid ────────────────────────────────────── */}
      <section className="container-site">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">Most popular products loved by thousands of customers</p>
          </div>
          <Link to="/products?sort=best_sellers" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(data?.best_sellers?.length ? data.best_sellers : [
            { id: 201, name: 'Portable Bluetooth Speaker', slug: 'speaker', selling_price: 79.99, compare_price: 99.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80', category: 'Audio' },
            { id: 202, name: 'Stainless Steel Water Bottle 1L', slug: 'water-bottle', selling_price: 24.99, compare_price: 34.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80', category: 'Fitness' },
            { id: 203, name: '4K Ultra HD Action Camera', slug: 'action-camera', selling_price: 149.00, compare_price: 189.00, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80', category: 'Electronics' },
            { id: 204, name: 'Organic Coffee Beans 1kg', slug: 'coffee-beans', selling_price: 19.99, compare_price: 24.99, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80', category: 'Grocery' },
            { id: 205, name: 'Wireless Charging Pad 15W', slug: 'wireless-charger', selling_price: 29.99, compare_price: 39.99, image: 'https://images.unsplash.com/photo-1622445268465-843d63d6b38f?auto=format&fit=crop&w=600&q=80', category: 'Accessories' },
            { id: 206, name: 'Minimalist Desk Lamp LED', slug: 'desk-lamp', selling_price: 45.00, compare_price: 59.00, image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=600&q=80', category: 'Home' },
          ]).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* ── 7. Top Brands ───────────────────────────────────────────── */}
      <section className="container-site">
        <div className="card p-6 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
          <h3 className="text-center font-bold text-gray-500 uppercase tracking-widest text-xs mb-6">
            Official Brand Partners
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 items-center opacity-70">
            {['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Logitech'].map((brand) => (
              <div key={brand} className="text-center font-extrabold text-lg sm:text-xl text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default HomePage
