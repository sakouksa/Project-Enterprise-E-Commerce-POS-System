import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw,
  Plus, Minus, Share2, Check, ChevronRight, MessageSquare
} from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import Spinner from '@/components/ui/Spinner'
import { useSettingsStore, useWishlistStore } from '@/stores'
import { useCartStore } from '@/stores/cartStore'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [product, setProduct]           = useState<any>(null)
  const [loading, setLoading]           = useState(true)
  const [activeImage, setActiveImage]   = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity]         = useState(1)
  const [activeTab, setActiveTab]       = useState<'desc' | 'specs' | 'reviews'>('desc')
  const [addingCart, setAddingCart]     = useState(false)
  const [addedCart, setAddedCart]       = useState(false)

  const { formatPrice } = useSettingsStore()
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore()
  const setCart  = useCartStore((s) => s.setCart)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        const prod = data.data
        setProduct(prod)
        if (prod.images?.length) {
          setActiveImage(prod.images[0].url)
        }
        if (prod.variants?.length) {
          setSelectedVariant(prod.variants[0])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-site py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link to="/products" className="btn-primary">Browse All Products</Link>
      </div>
    )
  }

  const inWishlist = wishlistItems.includes(product.id)
  const currentPrice = selectedVariant ? selectedVariant.selling_price : product.selling_price
  const comparePrice = selectedVariant ? selectedVariant.compare_price : product.compare_price

  const handleAddToCart = async (buyNow = false) => {
    setAddingCart(true)
    try {
      const { data } = await api.post('/cart/add', {
        product_id: product.id,
        product_variant_id: selectedVariant?.id || null,
        quantity,
      })
      setCart(data.data)
      setAddedCart(true)
      setTimeout(() => setAddedCart(false), 2000)

      if (buyNow) {
        navigate('/checkout')
      }
    } catch {
      // Error
    } finally {
      setAddingCart(false)
    }
  }

  const handleToggleWishlist = async () => {
    if (inWishlist) {
      removeWishlist(product.id)
      try { await api.delete(`/wishlist/product/${product.id}`) } catch {}
    } else {
      addWishlist(product.id)
      try { await api.post('/wishlist/add', { product_id: product.id }) } catch {}
    }
  }

  return (
    <div className="container-site py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gray-900 dark:hover:text-white">Products</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/category/${product.category.slug}`} className="hover:text-gray-900 dark:hover:text-white">{product.category.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</span>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* ── Left: Image Gallery ───────────────────────────────────── */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
            <img
              src={activeImage || product.images?.[0]?.url || '/placeholder.png'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount_percent > 0 && (
              <span className="absolute top-4 left-4 badge-discount px-3 py-1 text-xs font-bold rounded-xl shadow-sm">
                -{product.discount_percent}% OFF
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={cn(
                    'w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer',
                    activeImage === img.url ? 'border-blue-600 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Info ───────────────────────────────────── */}
        <div className="space-y-6">
          <div>
            {product.brand && (
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {product.brand.name}
              </span>
            )}
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white font-display mt-1">
              {product.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {product.rating_summary?.average || '4.8'}
                </span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-semibold text-gray-500">
                {product.rating_summary?.total || 14} Customer Reviews
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-blue-600 font-display">
              {formatPrice(currentPrice)}
            </span>
            {comparePrice && comparePrice > currentPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Variants Selector */}
          {product.variants?.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Option / Variant
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                      selectedVariant?.id === v.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                    )}
                  >
                    {v.name} ({formatPrice(v.selling_price)})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl p-1 bg-white dark:bg-gray-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm min-w-[36px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={cn(
                  'p-3 rounded-xl border transition-all cursor-pointer',
                  inWishlist
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                )}
              >
                <Heart className={cn('w-5 h-5', inWishlist && 'fill-current')} />
              </button>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={addingCart}
                className="btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                {addedCart ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                {addedCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => handleAddToCart(true)}
                className="btn bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>100% Genuine</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <RefreshCw className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>30-Day Return</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Tabs (Description, Specifications, Reviews) ─────────────── */}
      <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800">
          {(['desc', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'py-3 text-sm font-bold border-b-2 transition-colors capitalize cursor-pointer',
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {tab === 'desc' ? 'Description' : 'Customer Reviews'}
            </button>
          ))}
        </div>

        {activeTab === 'desc' && (
          <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description || 'No detailed description available for this product.'}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Customer Reviews</h3>
            {product.reviews?.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((rev: any) => (
                  <div key={rev.id} className="card p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{rev.name}</div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn('w-3 h-3', i < rev.rating ? 'fill-current' : 'text-gray-300')} />
                        ))}
                      </div>
                    </div>
                    {rev.title && <div className="font-semibold text-xs text-gray-800 dark:text-gray-200">{rev.title}</div>}
                    <p className="text-xs text-gray-600 dark:text-gray-400">{rev.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No customer reviews yet.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Related Products ────────────────────────────────────────── */}
      {product.related_products?.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="section-title">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {product.related_products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
