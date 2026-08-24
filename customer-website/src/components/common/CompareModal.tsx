import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scale,
  X,
  Trash2,
  ShoppingCart,
  Star,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useCompareStore, useSettingsStore } from '@/stores'
import { useCartStore } from '@/stores/cartStore'
import api from '@/lib/api'
import { Link } from 'react-router-dom'
import { getImageUrl } from '@/lib/utils'
import type { ProductItem } from '@/components/storefront/CustomerProductCard'

interface CompareModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, clear } = useCompareStore()
  const { formatPrice } = useSettingsStore()
  const setCart = useCartStore((s) => s.setCart)
  const toggleCart = useCartStore((s) => s.toggleOpen)

  // Fetch product details for items in compare
  const { data: products = [], isLoading } = useQuery<ProductItem[]>({
    queryKey: ['compare-products', items],
    queryFn: async () => {
      if (items.length === 0) return []
      const res = await api.get('/products', { params: { per_page: 50 } })
      const all: ProductItem[] = res.data?.data?.items || res.data?.data || []
      return all.filter((p) => items.includes(p.id))
    },
    enabled: isOpen && items.length > 0,
  })

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-transparent dark:from-gray-800/50 dark:via-gray-800/30 dark:to-transparent flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white font-display">
                  Product Comparison ({items.length}/4)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Compare technical specifications, price, and ratings side-by-side
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clear}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
            {items.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto text-gray-400">
                  <Scale className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  No products added to comparison
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Click the compare button (⚖️) on any product card in our catalog to compare up to 4 devices.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Remove Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove from compare"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image */}
                      <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 p-2 flex items-center justify-center">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => { e.currentTarget.src = '/images/placeholder-product.png' }}
                        />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          {product.brand || 'Genuine Tech'}
                        </div>
                        <Link
                          to={`/products/${product.slug}`}
                          onClick={onClose}
                          className="text-xs font-bold text-gray-900 dark:text-white hover:text-blue-600 line-clamp-2"
                        >
                          {product.name}
                        </Link>
                      </div>

                      {/* Price & Rating */}
                      <div className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between">
                        <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                          {formatPrice(product.selling_price || product.price || 0)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{product.rating_avg?.toFixed(1) || '4.8'}</span>
                        </div>
                      </div>

                      {/* Specifications Summary */}
                      <div className="text-[11px] space-y-1.5 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category:</span>
                          <span className="font-semibold">{product.category || 'Tech'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Availability:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">In Stock</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Warranty:</span>
                          <span className="font-semibold">1-Year Official</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.post('/cart/add', {
                            product_id: product.id,
                            quantity: 1,
                          })
                          if (res.data?.data) {
                            setCart(res.data.data)
                          }
                          toggleCart()
                        } catch {}
                        onClose()
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CompareModal
