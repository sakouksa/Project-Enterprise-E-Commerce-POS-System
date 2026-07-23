import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSettingsStore, useWishlistStore } from '@/stores'
import { useCartStore } from '@/stores/cartStore'
import api from '@/lib/api'

export interface ProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    sku?: string
    selling_price: number
    compare_price?: number
    discount_pct?: number
    is_featured?: boolean
    image?: string
    category?: string
    brand?: string
    rating_avg?: number
    review_count?: number
  }
  className?: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { formatPrice } = useSettingsStore()
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore()
  const setCart = useCartStore((s) => s.setCart)
  const toggleCart = useCartStore((s) => s.toggleOpen)

  const [addingCart, setAddingCart] = useState(false)
  const [addedCart, setAddedCart] = useState(false)

  const inWishlist = wishlistItems.includes(product.id)

  const discount = product.discount_pct || (
    product.compare_price && product.compare_price > product.selling_price
      ? Math.round(((product.compare_price - product.selling_price) / product.compare_price) * 100)
      : 0
  )

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAddingCart(true)

    try {
      const { data } = await api.post('/cart/add', {
        product_id: product.id,
        quantity: 1,
      })
      setCart(data.data)
      setAddedCart(true)
      setTimeout(() => setAddedCart(false), 1500)
    } catch {
      // Error handling
    } finally {
      setAddingCart(false)
    }
  }

  return (
    <div className={cn('product-card group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col', className)}>
      {/* ── Image & Badges ────────────────────────────────────────────── */}
      <div className="product-card-image relative aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image || '/images/placeholder-product.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discount > 0 && (
            <span className="badge-discount px-2.5 py-1 text-[11px] font-bold rounded-lg shadow-sm">
              -{discount}%
            </span>
          )}
          {product.is_featured && (
            <span className="badge-primary px-2.5 py-1 text-[11px] font-bold rounded-lg shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            'absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm z-10',
            inWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
          )}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
        </button>

        {/* Quick Add Overlay Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={handleAddToCart}
            disabled={addingCart}
            className={cn(
              'w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer',
              addedCart
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-gray-900 hover:bg-gray-900 dark:hover:bg-white'
            )}
          >
            {addedCart ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Info ──────────────────────────────────────────────────────── */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          {product.category && (
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {product.category}
            </div>
          )}

          {/* Title */}
          <Link
            to={`/products/${product.slug}`}
            className="font-medium text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        <div className="pt-3">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3 h-3',
                    i < Math.floor(product.rating_avg || 4.5) ? 'fill-current' : 'text-gray-200 dark:text-gray-700'
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium ml-1">
              ({product.review_count || 12})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900 dark:text-white font-display">
              {formatPrice(product.selling_price)}
            </span>
            {product.compare_price && product.compare_price > product.selling_price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
