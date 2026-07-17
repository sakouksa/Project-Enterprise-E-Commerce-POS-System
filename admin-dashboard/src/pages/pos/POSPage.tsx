import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, ShoppingCart, Tag, Check, RefreshCw, Trash2, ArrowRight } from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'

interface Product {
  id: number
  name: string
  sku: string
  selling_price: number
}

interface CartItem {
  product: Product
  quantity: number
}

const POSPage: React.FC = () => {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])

  const toast = useToast()

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['pos-products', search],
    queryFn: () => api.get('/products', { params: { search, per_page: 20 } }).then(r => r.data.data),
  })

  const checkoutMutation = useMutation({
    mutationFn: (payload: any) => api.post('/pos/sales', payload),
    onSuccess: () => {
      toast.success('Sale transaction recorded successfully!')
      setCart([])
      qc.invalidateQueries({ queryKey: ['sales'] })
    },
    onError: () => {
      toast.error('Checkout transaction failed.')
    },
  })

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId))
      return
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity: qty } : item
    ))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.product.selling_price * item.quantity), 0)
  const tax = subtotal * 0.11 // 11% PPN
  const total = subtotal + tax

  const handleCheckout = () => {
    if (cart.length === 0) return

    checkoutMutation.mutate({
      customer_id: 1, // Walk-in Default Customer
      cash_register_id: 1,
      payment_method_id: 1,
      subtotal: subtotal,
      tax_amount: tax,
      discount_amount: 0,
      grand_total: total,
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.selling_price,
        total: item.product.selling_price * item.quantity
      }))
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-8rem)]">
      {/* Product Catalog Grid */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {/* Search */}
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Scan barcode or type SKU/product name..."
              className="form-input pl-9"
            />
          </div>
        </div>

        {/* Product Cards */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(productsData ?? []).map((p: Product) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-card hover:bg-muted border border-border rounded-xl p-4 text-left
                             transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 flex flex-col justify-between h-32 group"
                >
                  <div>
                    <h4 className="font-semibold text-sm text-foreground line-clamp-2">{p.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{p.sku}</p>
                  </div>
                  <p className="font-bold text-sm text-primary mt-2">Rp {p.selling_price.toLocaleString('id-ID')}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POS Cart Sidebar */}
      <div className="lg:col-span-4 bg-card rounded-xl border border-border flex flex-col overflow-hidden shadow-sm h-full">
        {/* Cart Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <ShoppingCart size={18} className="text-muted-foreground" />
            Active Cart
          </h3>
          <span className="badge-primary text-xs font-bold">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <ShoppingCart size={36} className="mb-2 opacity-30" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm font-semibold text-foreground truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Rp {item.product.selling_price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center border border-border rounded hover:bg-muted text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center border border-border rounded hover:bg-muted text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation summary */}
        <div className="p-4 bg-muted/30 border-t border-border space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax (11% PPN)</span>
            <span>Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-foreground font-bold text-base pt-2 border-t border-border">
            <span>Total Payable</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkoutMutation.isPending}
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-white
                       bg-gradient-primary rounded-xl hover:opacity-95 disabled:opacity-50 shadow-md transition-opacity"
          >
            {checkoutMutation.isPending ? 'Processing...' : 'Place Order'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default POSPage
