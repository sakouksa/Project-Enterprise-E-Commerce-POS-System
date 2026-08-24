import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star, Check, Sparkles, Scale } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, getImageUrl } from '@/lib/utils'
import { useSettingsStore, useWishlistStore, useCompareStore } from '@/stores'
import { useCartStore } from '@/stores/cartStore'
import api from '@/lib/api'

export interface ProductItem {
  id: number
  name: string
  slug: string
  sku?: string
  selling_price: number
  compare_price?: number
  discount_pct?: number
  is_featured?: boolean
  has_variants?: boolean
  stock?: number
  rating_avg?: number
  rating_count?: number
  image?: string | null
  category?: string
  category_slug?: string
  brand?: string
  brand_slug?: string
  flash_price?: number
  quota?: number
  sold_count?: number
  price?: number
}

export interface CustomerProductCardProps {
  product: ProductItem
  className?: string
  aspectRatio?: 'square' | 'video'
}

export const CustomerProductCard = React.memo<CustomerProductCardProps>(({
  product,
  className,
  aspectRatio = 'square',
}) => {
  const { t } = useTranslation()
  const { formatPrice, convertPrice } = useSettingsStore()
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore()
  const { addItem: addCompare, removeItem: removeCompare, has: inCompare } = useCompareStore()
  const setCart = useCartStore((s) => s.setCart)

  const [addingCart, setAddingCart] = useState(false)
  const [addedCart, setAddedCart] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const inWishlist = wishlistItems.includes(product.id)
  const isComparing = inCompare(product.id)

  const activePrice = product.flash_price ?? product.selling_price ?? product.price ?? 0
  const comparePrice = product.compare_price

  const discount = product.discount_pct || (
    comparePrice && comparePrice > activePrice
      ? Math.round(((comparePrice - activePrice) / comparePrice) * 100)
      : 0
  )

  const isOutOfStock = product.stock !== undefined && product.stock <= 0

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeWishlist(product.id)
      try { await api.delete(`/wishlist/product/${product.id}`) } catch {}
    } else {
      addWishlist(product.id)
      try { await api.post('/wishlist/add', { product_id: product.id }) } catch {}
    }
  }

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isComparing) {
      removeCompare(product.id)
    } else {
      addCompare(product.id)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || addingCart) return

    setAddingCart(true)
    try {
      const { data } = await api.post('/cart/add', {
        product_id: product.id,
        quantity: 1,
      })
      if (data?.data) {
        setCart(data.data)
      }
      setAddedCart(true)
      setTimeout(() => setAddedCart(false), 2000)
    } catch {
      // Graceful error fallback
    } finally {
      setAddingCart(false)
    }
  }

  const defaultPlaceholder = '/images/placeholder-product.png'

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-xs hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 flex flex-col',
        className
      )}
    >
      {/* ── Image & Badges ────────────────────────────────────────────── */}
      <div
        className={cn(
          'relative bg-slate-50 dark:bg-slate-950/80 overflow-hidden p-2',
          aspectRatio === 'square' ? 'aspect-square' : 'aspect-[4/3]'
        )}
      >
        <Link to={`/products/${product.slug}`} className="relative block w-full h-full rounded-2xl overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/60 animate-pulse rounded-2xl" />
          )}
          <img
            src={getImageUrl(product.image) || defaultPlaceholder}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageLoaded(true)
              ;(e.target as HTMLImageElement).src = defaultPlaceholder
            }}
            className={cn(
              'w-full h-full object-contain group-hover:scale-108 transition-all duration-500',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white text-[10px] font-black shadow-md tracking-tight">
              -{discount}% {t('product.off')}
            </span>
          )}
          {product.is_featured && (
            <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold shadow-md tracking-tight flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> {t('product.featured')}
            </span>
          )}
        </div>

        {/* Top Right Actions: Wishlist & Compare */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm',
              inWishlist
                ? 'bg-rose-500 text-white shadow-rose-500/30'
                : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-rose-500'
            )}
            title={inWishlist ? t('product.remove_wishlist') : t('product.add_to_wishlist')}
            aria-label="Wishlist"
          >
            <Heart className={cn('w-4 h-4 transition-transform active:scale-125', inWishlist && 'fill-current')} />
          </button>

          {/* Compare Button */}
          <button
            onClick={handleToggleCompare}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm',
              isComparing
                ? 'bg-purple-600 text-white shadow-purple-600/30'
                : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-purple-600'
            )}
            title={isComparing ? 'Remove from Compare' : 'Add to Compare'}
            aria-label="Compare"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-10 hidden sm:block">
          <button
            onClick={handleAddToCart}
            disabled={addingCart || isOutOfStock}
            className={cn(
              'w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xl transition-all duration-200 cursor-pointer backdrop-blur-md',
              isOutOfStock
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : addedCart
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white'
            )}
          >
            {isOutOfStock ? (
              t('product.out_of_stock')
            ) : addedCart ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce" /> {t('product.added')}
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> {addingCart ? t('product.adding') : t('product.quick_add')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Details & Pricing ────────────────────────────────────────── */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Brand & SKU */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
            <span className="truncate max-w-[130px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {product.brand || product.category || 'GENUINE'}
            </span>
            {product.sku && (
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                {product.sku.slice(-6)}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.slug}`}
            className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3 h-3',
                    i < Math.floor(product.rating_avg || 4.8)
                      ? 'fill-current'
                      : 'text-slate-200 dark:text-slate-700'
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-medium ml-0.5">
              ({product.rating_count || 12})
            </span>
          </div>

          {/* Price Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-display">
                {formatPrice(convertPrice(activePrice))}
              </span>
              {comparePrice && comparePrice > activePrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(convertPrice(comparePrice))}
                </span>
              )}
            </div>

            {/* Mobile Quick Add Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingCart || isOutOfStock}
              className={cn(
                'sm:hidden w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-sm',
                addedCart ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white active:scale-95'
              )}
              aria-label="Add to Cart"
            >
              {addedCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

CustomerProductCard.displayName = 'CustomerProductCard'

export default CustomerProductCard

