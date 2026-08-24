import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useSettingsStore } from '@/stores'
import PageTransition from '@/components/common/PageTransition'
import api from '@/lib/api'

const CartPage: React.FC = () => {
  const { items, subtotal, total, coupon_code, discount, setCart, applyCoupon, clearCoupon } = useCartStore()
  const { formatPrice } = useSettingsStore()
  const navigate = useNavigate()

  const [couponInput, setCouponInput]     = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError]     = useState<string | null>(null)
  const [updatingId, setUpdatingId]       = useState<number | null>(null)

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    setUpdatingId(itemId)
    try {
      const { data } = await api.put('/cart/update', {
        items: [{ item_id: itemId, quantity: newQty }]
      })
      setCart(data.data)
    } catch {} finally { setUpdatingId(null) }
  }

  const handleRemove = async (itemId: number) => {
    setUpdatingId(itemId)
    try {
      const { data } = await api.delete('/cart/remove', { data: { item_id: itemId } })
      setCart(data.data)
    } catch {} finally { setUpdatingId(null) }
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
      setCouponError(err.response?.data?.message || 'Invalid coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-site py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold font-display">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Before proceeding to checkout you must add some items to your cart.
        </p>
        <Link to="/products" className="btn-primary inline-flex">Explore Catalog</Link>
      </div>
    )
  }

  return (
    <PageTransition className="container-site py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
          Shopping Cart ({items.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">Review your items before proceeding to checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.product?.image || '/placeholder.png'}
                    alt={item.product?.name}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{item.product?.name}</h4>
                    {item.variant && <p className="text-xs text-gray-500">Variant: {item.variant.name}</p>}
                    <div className="text-xs font-bold text-blue-600 mt-1 sm:hidden">
                      {formatPrice(item.variant?.selling_price ?? item.product?.selling_price ?? 0)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Price */}
                  <div className="text-sm font-bold text-gray-900 dark:text-white hidden sm:block">
                    {formatPrice(item.variant?.selling_price ?? item.product?.selling_price ?? 0)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-0.5 bg-white dark:bg-gray-800">
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold px-2">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal & Delete */}
                  <div className="text-sm font-bold text-blue-600 min-w-[70px] text-right">
                    {formatPrice((item.variant?.selling_price ?? item.product?.selling_price ?? 0) * item.quantity)}
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white font-display border-b border-gray-100 dark:border-gray-800 pb-3">
              Order Summary
            </h3>

            {/* Coupon Code */}
            {coupon_code ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-xs text-emerald-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" /> Applied: <strong>{coupon_code}</strong>
                </div>
                <button onClick={clearCoupon} className="underline text-emerald-800">Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="input py-2 text-xs flex-1"
                />
                <button type="submit" disabled={couponLoading} className="btn-secondary py-2 text-xs">
                  Apply
                </button>
              </form>
            )}
            {couponError && <p className="text-xs text-red-500">{couponError}</p>}

            {/* Price Calculations */}
            <div className="space-y-2 text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              {discount ? (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-800">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center gap-3 text-xs text-blue-700 dark:text-blue-300">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>Guaranteed Safe & Secure Checkout with SSL Encryption</span>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default CartPage
