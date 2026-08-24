import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShieldCheck, CreditCard, Truck, Lock,
  QrCode, Building2, Banknote
} from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useSettingsStore, useAuthStore } from '@/stores'
import api from '@/lib/api'
import Spinner from '@/components/ui/Spinner'
import PageTransition from '@/components/common/PageTransition'
import SEOHead from '@/components/seo/SEOHead'
import { cn } from '@/lib/utils'

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, subtotal, total, coupon_code, reset: resetCart } = useCartStore()
  const { formatPrice } = useSettingsStore()
  const customer = useAuthStore((s) => s.customer)

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'aba_khqr' | 'acleda' | 'card' | 'cod'>('aba_khqr')
  const [shippingCost, setShippingCost]   = useState(2.00)

  // Form fields
  const [formData, setFormData] = useState({
    shipping_name:     customer?.name || '',
    shipping_phone:    customer?.phone || '',
    shipping_address:  '',
    shipping_city:     'Phnom Penh',
    shipping_country:  'Cambodia',
    customer_notes:    '',
  })

  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const grandTotal = total + shippingCost

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.shipping_name || !formData.shipping_phone || !formData.shipping_address) {
      setError('Please fill in all required shipping fields.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data } = await api.post('/cart/checkout', {
        ...formData,
        coupon_code: coupon_code || null,
        payment_method: paymentMethod,
        shipping_cost: shippingCost,
      })

      resetCart()
      navigate('/checkout/success', { state: { order: data.data } })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-site py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title="Secure Checkout"
        description="Complete your order details and checkout securely."
        canonical="/checkout"
        robots="noindex, nofollow"
      />
      <PageTransition className="container-site py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-display">
          Checkout
        </h1>
        <p className="text-xs text-gray-500 mt-1">Complete your order details below</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left Column: Shipping & Payment ───────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Shipping Address */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white font-display flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <Truck className="w-5 h-5 text-blue-600" /> Shipping Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="shipping_name"
                  required
                  value={formData.shipping_name}
                  onChange={handleChange}
                  placeholder="e.g. Sok Dara"
                  className="input"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="shipping_phone"
                  required
                  value={formData.shipping_phone}
                  onChange={handleChange}
                  placeholder="e.g. 012 345 678"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="shipping_address"
                required
                value={formData.shipping_address}
                onChange={handleChange}
                placeholder="House No, Street Name, Sangkat, Khan"
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  City / Province *
                </label>
                <select name="shipping_city" value={formData.shipping_city} onChange={handleChange} className="input">
                  <option value="Phnom Penh">Phnom Penh</option>
                  <option value="Siem Reap">Siem Reap</option>
                  <option value="Battambang">Battambang</option>
                  <option value="Sihanoukville">Sihanoukville</option>
                  <option value="Kampot">Kampot</option>
                  <option value="Kandal">Kandal</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Country
                </label>
                <input type="text" name="shipping_country" readOnly value={formData.shipping_country} className="input bg-gray-50" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                Order Notes (Optional)
              </label>
              <textarea
                name="customer_notes"
                rows={2}
                value={formData.customer_notes}
                onChange={handleChange}
                placeholder="Special delivery instructions, gate code, etc."
                className="input"
              />
            </div>
          </div>

          {/* 2. Shipping Method */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white font-display border-b border-gray-100 dark:border-gray-800 pb-3">
              Shipping Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShippingCost(2.00)}
                className={cn(
                  'p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer',
                  shippingCost === 2.00 ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                )}
              >
                <div>
                  <div className="font-semibold text-sm">Standard Delivery</div>
                  <div className="text-xs text-gray-500">1 - 2 Business Days</div>
                </div>
                <div className="font-bold text-blue-600">$2.00</div>
              </button>

              <button
                type="button"
                onClick={() => setShippingCost(4.50)}
                className={cn(
                  'p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer',
                  shippingCost === 4.50 ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                )}
              >
                <div>
                  <div className="font-semibold text-sm">Express Same Day</div>
                  <div className="text-xs text-gray-500">Delivered within 3 hours</div>
                </div>
                <div className="font-bold text-blue-600">$4.50</div>
              </button>
            </div>
          </div>

          {/* 3. Payment Gateway */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white font-display border-b border-gray-100 dark:border-gray-800 pb-3">
              Payment Gateway
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                { id: 'aba_khqr', label: 'ABA KHQR', icon: QrCode },
                { id: 'acleda',   label: 'ACLEDA',   icon: Building2 },
                { id: 'card',     label: 'Credit Card', icon: CreditCard },
                { id: 'cod',      label: 'Cash on Delivery', icon: Banknote },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  className={cn(
                    'p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer',
                    paymentMethod === id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-bold shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>

            {paymentMethod === 'aba_khqr' && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs space-y-1">
                <div className="font-bold">Scan with ABA Mobile or any Bakong KHQR App</div>
                <p>After clicking Place Order, a dynamic KHQR code will be generated for instant payment.</p>
              </div>
            )}
          </div>

        </div>

        {/* ── Right Column: Order Summary ────────────────────────────── */}
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white font-display border-b border-gray-100 dark:border-gray-800 pb-3">
              Items in Order ({items.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={item.product?.image || '/placeholder.png'} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                    <div className="truncate">
                      <div className="font-medium text-gray-900 dark:text-white truncate">{item.product?.name}</div>
                      <div className="text-gray-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {formatPrice((item.variant?.selling_price ?? item.product?.selling_price ?? 0) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping Fee</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-800">
                <span>Grand Total</span>
                <span className="text-blue-600">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              {loading ? <Spinner size="sm" /> : <Lock className="w-4 h-4" />}
              {loading ? 'Processing Order...' : `Place Order • ${formatPrice(grandTotal)}`}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>Buyer Protection: 100% Refund if order is not delivered</span>
          </div>
        </div>

      </form>
    </PageTransition>
    </>
  )
}

export default CheckoutPage
