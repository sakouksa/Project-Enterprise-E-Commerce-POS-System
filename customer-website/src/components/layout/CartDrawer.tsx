import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useSettingsStore } from '@/stores'
import api from '@/lib/api'
import { getImageUrl } from '@/lib/utils'

const CartDrawer: React.FC = () => {
  const { isOpen, setOpen, items, subtotal, total, coupon_code, discount, setCart, applyCoupon, clearCoupon } = useCartStore()
  const { formatPrice } = useSettingsStore()
  const navigate = useNavigate()

  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    setUpdatingId(itemId)
    try {
      const { data } = await api.put('/cart/update', {
        items: [{ item_id: itemId, quantity: newQty }]
      })
      setCart(data.data)
    } catch {
      // Error handled
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemove = async (itemId: number) => {
    setUpdatingId(itemId)
    try {
      const { data } = await api.delete('/cart/remove', { data: { item_id: itemId } })
      setCart(data.data)
    } catch {
      // Error handled
    } finally {
      setUpdatingId(null)
    }
  }

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError(null)

    try {
      const { data } = await api.post('/cart/apply-coupon', { code: couponInput.trim() })
      applyCoupon(data.data.coupon.code, data.data.discount)
      setCouponInput('')
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Failed to apply coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white font-display text-lg">
                  Shopping Cart ({items.length})
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Your cart is empty</h4>
                  <p className="text-xs text-gray-500 max-w-xs mb-6">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <button
                    onClick={() => { setOpen(false); navigate('/products') }}
                    className="btn-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
                      <img
                        src={getImageUrl(item.product?.image)}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/images/placeholder-product.png' }}
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                          {item.product?.name}
                        </h4>
                        {item.variant && (
                          <span className="text-xs text-gray-500">Variant: {item.variant.name}</span>
                        )}
                        <div className="text-sm font-bold text-blue-600 mt-1">
                          {formatPrice(item.variant?.selling_price ?? item.product?.selling_price ?? 0)}
                        </div>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                            disabled={updatingId === item.id}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-400"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-2 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                            disabled={updatingId === item.id}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-600 dark:text-gray-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-3">
                {/* Coupon form */}
                {coupon_code ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      Coupon applied: <span className="font-bold">{coupon_code}</span>
                    </div>
                    <button onClick={clearCoupon} className="text-emerald-800 hover:underline">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo / Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="input py-1.5 text-xs flex-1"
                    />
                    <button type="submit" disabled={couponLoading} className="btn-secondary py-1.5 text-xs">
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-xs text-red-500">{couponError}</p>}

                {/* Subtotals */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
                  </div>
                  {discount ? (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span>Estimated Total</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="btn-secondary text-center text-xs py-3"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
                    className="btn-primary text-center text-xs py-3 flex items-center justify-center gap-1"
                  >
                    Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
