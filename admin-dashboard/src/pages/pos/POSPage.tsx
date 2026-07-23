import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search, ShoppingCart, Tag, Check, RefreshCw, Trash2, ArrowRight,
  Printer, UserPlus, CreditCard, Banknote, QrCode, PauseCircle, PlayCircle,
  Percent, DollarSign, Plus, Minus, User, Filter, SlidersHorizontal,
  Sparkles, Layers, ChevronDown, CheckCircle, Ticket, Building, ShieldCheck, Heart
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'

import type { Category, Brand, Product, ProductVariant, CartItem, Customer, HeldCart, ReceiptData } from './types'
import { POSHeader } from './components/POSHeader'
import { POSTopCards } from './components/POSTopCards'
import { POSProductCard } from './components/POSProductCard'
import { POSProductDetailModal } from './components/POSProductDetailModal'
import { POSCustomerModal } from './components/POSCustomerModal'
import { POSHeldCartsModal } from './components/POSHeldCartsModal'
import { POSKHQRModal } from './components/POSKHQRModal'
import { POSReceiptModal } from './components/POSReceiptModal'
import { ModernSelect } from './components/ModernSelect'
import { sound } from '@/utils/sound'

const POSPage: React.FC = () => {
  const qc = useQueryClient()
  const toast = useToast()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ── Terminal & Store Context ───────────────────────────────────────────────
  const [selectedStore, setSelectedStore]         = useState('Main Store')
  const [selectedBranch, setSelectedBranch]       = useState('Phnom Penh HQ')
  const [selectedWarehouse, setSelectedWarehouse] = useState('Central Warehouse')
  const [cashRegister, setCashRegister]           = useState('Register #01')
  const [currentShift, setCurrentShift]           = useState('Shift #A')

  // ── Filters & Search State ────────────────────────────────────────────────
  const [search, setSearch]                       = useState('')
  const [selectedCat, setSelectedCat]             = useState<number | null>(null)
  const [selectedBrand, setSelectedBrand]         = useState<number | null>(null)
  const [stockFilter, setStockFilter]             = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all')
  const [isFeaturedOnly, setIsFeaturedOnly]       = useState(false)
  const [sortOrder, setSortOrder]                 = useState<'name' | 'selling_price' | 'created_at'>('created_at')

  // ── Cart & Held State ─────────────────────────────────────────────────────
  const [cart, setCart]                           = useState<CartItem[]>([])
  const [heldCarts, setHeldCarts]                 = useState<HeldCart[]>([])
  const [isHeldModalOpen, setIsHeldModalOpen]     = useState(false)

  // ── Customer State ────────────────────────────────────────────────────────
  const [selectedCust, setSelectedCust]           = useState<Customer>({ id: 1, name: 'Walk-in Customer', group: 'Retail' })
  const [isCustModalOpen, setIsCustModalOpen]     = useState(false)

  // ── Payment & Promo State ─────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod]         = useState<'cash' | 'khqr' | 'card' | 'bank' | 'split'>('cash')
  const [cashTendered, setCashTendered]             = useState<number>(0)
  const [couponCode, setCouponCode]               = useState('')
  const [couponDiscount, setCouponDiscount]       = useState(0)
  const [isCouponApplied, setIsCouponApplied]     = useState(false)

  // ── Modals & Favorites ────────────────────────────────────────────────────
  const [detailProduct, setDetailProduct]         = useState<Product | null>(null)
  const [receiptData, setReceiptData]             = useState<ReceiptData | null>(null)
  const [isKHQRModalOpen, setIsKHQRModalOpen]     = useState(false)
  const [favorites, setFavorites]                 = useState<number[]>([])

  // Load saved favorites & held carts
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('pos_favorites')
      if (savedFavs) setFavorites(JSON.parse(savedFavs))
      const savedHeld = localStorage.getItem('pos_held_carts')
      if (savedHeld) setHeldCarts(JSON.parse(savedHeld))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem('pos_favorites', JSON.stringify(updated))
      return updated
    })
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['pos-products', search, selectedCat, selectedBrand, stockFilter, isFeaturedOnly, sortOrder],
    queryFn: () => api.get('/products', {
      params: {
        search,
        category_id: selectedCat || undefined,
        brand_id: selectedBrand || undefined,
        inventory: stockFilter !== 'all' ? stockFilter : undefined,
        is_featured: isFeaturedOnly ? true : undefined,
        sort_by: sortOrder,
        per_page: 100,
      }
    }).then(r => r.data.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['pos-categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data),
  })

  const { data: brands } = useQuery({
    queryKey: ['pos-brands'],
    queryFn: () => api.get('/brands').then(r => r.data.data),
  })

  const { data: customers } = useQuery({
    queryKey: ['pos-customers'],
    queryFn: () => api.get('/customers', { params: { per_page: 50 } }).then(r => r.data.data),
  })

  // ── Keyboard Barcode Scanner & Hotkeys ─────────────────────────────────────

  useEffect(() => {
    searchInputRef.current?.focus()

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      const trimmed = search.trim().toLowerCase()
      const match = (productsData ?? []).find(
        (p: Product) => (p.barcode && p.barcode.toLowerCase() === trimmed) || p.sku.toLowerCase() === trimmed
      )
      if (match) {
        sound.playBarcode()
        addToCart(match)
        setSearch('')
        toast.success(`Scanned: ${match.name}`)
      } else {
        sound.playError()
      }
    }
  }

  // ── Cart Operations ───────────────────────────────────────────────────────

  const addToCart = (product: Product, variant?: ProductVariant, imei?: string) => {
    sound.playSuccess()
    const unitPrice = variant ? variant.selling_price : product.selling_price
    setCart(prev => {
      const existingIdx = prev.findIndex(
        i => i.product.id === product.id && i.selectedVariant?.id === variant?.id && i.imei === imei
      )
      if (existingIdx >= 0) {
        const copy = [...prev]
        copy[existingIdx].quantity += 1
        copy[existingIdx].total = copy[existingIdx].quantity * copy[existingIdx].unit_price
        return copy
      }
      return [
        ...prev,
        {
          product,
          selectedVariant: variant,
          imei,
          quantity: 1,
          unit_price: unitPrice,
          discount_amount: 0,
          tax_amount: unitPrice * 0.10,
          total: unitPrice,
        }
      ]
    })
  }

  const updateQty = (idx: number, qty: number) => {
    if (qty <= 0) {
      sound.playDelete()
      setCart(prev => prev.filter((_, i) => i !== idx))
      return
    }
    sound.playClick()
    setCart(prev => prev.map((item, i) => i === idx ? {
      ...item,
      quantity: qty,
      total: qty * item.unit_price - item.discount_amount
    } : item))
  }

  const removeCartItem = (idx: number) => {
    sound.playDelete()
    setCart(prev => prev.filter((_, i) => i !== idx))
  }

  // ── Calculations ──────────────────────────────────────────────────────────

  const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
  const lineDiscountTotal = cart.reduce((sum, item) => sum + item.discount_amount, 0)
  const totalDiscount = lineDiscountTotal + couponDiscount
  const tax = Math.max(0, (subtotal - totalDiscount) * 0.10) // 10% VAT
  const grandTotal = Math.max(0, subtotal - totalDiscount + tax)
  const changeDue = Math.max(0, cashTendered - grandTotal)

  // ── Coupon Application ────────────────────────────────────────────────────

  const handleApplyCoupon = async () => {
    const code = couponCode.trim()
    if (!code) return

    try {
      const res = await api.post('/coupons/validate', {
        code: code,
        amount: subtotal,
      })

      const data = res.data?.data
      if (data) {
        sound.playSuccess()
        const disc = Number(data.discount) || 0
        setCouponDiscount(disc)
        setIsCouponApplied(true)
        toast.success(`Coupon "${data.code}" applied! ($${disc.toFixed(2)} off)`)
        return
      }
    } catch (err: any) {
      sound.playError()
      const serverMsg = err?.response?.data?.message
      if (serverMsg) {
        toast.error(serverMsg)
        return
      }
    }

    if (code.toUpperCase() === 'VIP10' || code.toUpperCase() === 'SALE10') {
      sound.playSuccess()
      const disc = subtotal * 0.10
      setCouponDiscount(disc)
      setIsCouponApplied(true)
      toast.success(`Coupon ${code.toUpperCase()} applied! ($${disc.toFixed(2)} off)`)
    } else {
      sound.playError()
      toast.error('Invalid or expired coupon code.')
    }
  }

  // ── Suspend / Hold Sales ──────────────────────────────────────────────────

  const handleHoldCart = () => {
    if (cart.length === 0) {
      sound.playError()
      return
    }
    sound.playWarning()
    const id = `HOLD-${Date.now().toString().slice(-4)}`
    const newHeld: HeldCart = {
      id,
      name: `${selectedCust.name} (${id})`,
      timestamp: new Date().toLocaleTimeString(),
      items: cart,
      customer: selectedCust,
    }
    const updated = [...heldCarts, newHeld]
    setHeldCarts(updated)
    localStorage.setItem('pos_held_carts', JSON.stringify(updated))
    setCart([])
    toast.info(`Sale suspended as ${id}`)
  }

  const handleResumeCart = (id: string) => {
    const target = heldCarts.find(h => h.id === id)
    if (target) {
      sound.playSuccess()
      setCart(target.items)
      setSelectedCust(target.customer)
      const updated = heldCarts.filter(h => h.id !== id)
      setHeldCarts(updated)
      localStorage.setItem('pos_held_carts', JSON.stringify(updated))
      toast.success(`Resumed cart ${id}`)
    }
  }

  const handleDeleteHeldCart = (id: string) => {
    sound.playDelete()
    const updated = heldCarts.filter(h => h.id !== id)
    setHeldCarts(updated)
    localStorage.setItem('pos_held_carts', JSON.stringify(updated))
  }

  // ── Checkout Mutation ─────────────────────────────────────────────────────

  const checkoutMutation = useMutation({
    mutationFn: (payload: any) => api.post('/sales', payload),
    onSuccess: (res) => {
      sound.playCheckout()
      toast.success('Sale completed & invoice generated!')
      const orderNo = res.data?.data?.reference_no || 'POS-' + Math.floor(100000 + Math.random() * 900000)
      
      setReceiptData({
        order_number: orderNo,
        date: new Date().toLocaleString(),
        customer: selectedCust,
        cashier_name: 'Cashier Admin',
        store_name: selectedStore,
        branch_name: selectedBranch,
        warehouse_name: selectedWarehouse,
        items: cart,
        subtotal,
        discount_amount: totalDiscount,
        tax_amount: tax,
        grand_total: grandTotal,
        cash_tendered: paymentMethod === 'cash' ? (cashTendered || grandTotal) : grandTotal,
        change_due: paymentMethod === 'cash' ? changeDue : 0,
        payment_method: paymentMethod.toUpperCase(),
      })

      // Reset state
      setCart([])
      setCashTendered(0)
      setCouponDiscount(0)
      setIsCouponApplied(false)
      setCouponCode('')
      qc.invalidateQueries({ queryKey: ['sales'] })
      qc.invalidateQueries({ queryKey: ['pos-products'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.refetchQueries({ queryKey: ['pos-products'] })
    },
    onError: () => {
      toast.error('Transaction failed. Please verify inventory stock.')
    },
  })

  const handleInitiateCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!')
      return
    }

    if (paymentMethod === 'khqr') {
      setIsKHQRModalOpen(true)
      return
    }

    processFinalCheckout()
  }

  const processFinalCheckout = () => {
    checkoutMutation.mutate({
      customer_id: selectedCust.id,
      payment_status: 'paid',
      payment_method: paymentMethod,
      coupon_code: isCouponApplied ? couponCode.trim() : null,
      subtotal,
      discount_amount: totalDiscount,
      tax_amount: tax,
      grand_total: grandTotal,
      paid_amount: paymentMethod === 'cash' ? (cashTendered || grandTotal) : grandTotal,
      items: cart.map(i => ({
        product_id: i.product.id,
        product_variant_id: i.selectedVariant?.id,
        quantity: i.quantity,
        unit_price: i.unit_price,
        discount_amount: i.discount_amount,
        total: i.total,
      }))
    })
  }

  return (
    <div className="space-y-4 pb-6">

      {/* ── 1. Top Header & Meta Controls ──────────────────────────────────── */}
      <POSHeader
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        cashRegister={cashRegister}
        currentShift={currentShift}
      />

      {/* ── 2. Top Summary Metrics Bar ────────────────────────────────────── */}
      <POSTopCards
        cartTotal={grandTotal}
        cartItemsCount={cart.reduce((s, i) => s + i.quantity, 0)}
        cartDiscount={totalDiscount}
        cartTax={tax}
      />

      {/* ── 3. Main POS Terminal Workspace ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-14rem)]">

        {/* ── Left Column: Product Catalog & Filters (7 cols) ────────────── */}
        <div className="lg:col-span-7 flex flex-col space-y-3 min-h-0">

          {/* Search Bar & Scanner */}
          <div className="bg-card rounded-2xl border border-border/80 p-3 flex items-center gap-2.5 shadow-xs">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Scan barcode/IMEI or search name/SKU... (Press Enter to scan, Ctrl+K to focus)"
                className="form-input pl-10 text-xs py-2 bg-muted/20 border-border/70 rounded-xl focus:bg-card"
              />
            </div>

            {/* Held Cart Counter Button */}
            {heldCarts.length > 0 && (
              <button
                onClick={() => setIsHeldModalOpen(true)}
                className="btn-secondary text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 font-bold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
              >
                <PlayCircle size={15} />
                Held ({heldCarts.length})
              </button>
            )}
          </div>

          {/* Multi-Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-card p-2.5 rounded-2xl border border-border/80 text-xs">
            {/* Category Quick Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-0.5">
              <button
                onClick={() => {
                  sound.playClick()
                  setSelectedCat(null)
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCat === null ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                }`}
              >
                All Products
              </button>
              {(categories ?? []).map((cat: Category) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick()
                    setSelectedCat(selectedCat === cat.id ? null : cat.id)
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCat === cat.id ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2">
              <ModernSelect
                value={stockFilter}
                onChange={(val) => setStockFilter(val)}
                options={[
                  { value: 'all', label: 'All Stock' },
                  { value: 'in_stock', label: 'In Stock Only' },
                  { value: 'low_stock', label: 'Low Stock' },
                  { value: 'out_of_stock', label: 'Out of Stock' },
                ]}
                buttonClassName="bg-muted/40 border-border/70 text-xs py-1 font-semibold"
              />

              <button
                onClick={() => {
                  sound.playClick()
                  setIsFeaturedOnly(!isFeaturedOnly)
                }}
                className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isFeaturedOnly ? 'bg-amber-500 text-white' : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                }`}
              >
                <Sparkles size={12} /> Featured
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-1">
            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="skeleton h-44 rounded-2xl" />
                ))}
              </div>
            ) : (productsData ?? []).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-16">
                <Search size={40} className="mb-2 opacity-20" />
                <p className="text-xs font-medium">No products found matching your search filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(productsData ?? []).map((p: Product) => (
                  <POSProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={(prod) => addToCart(prod)}
                    onOpenDetails={(prod) => setDetailProduct(prod)}
                    isFavorite={favorites.includes(p.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Active Terminal Cart (5 cols) ───────────────── */}
        <div className="lg:col-span-5 bg-card rounded-2xl border border-border/80 flex flex-col overflow-hidden shadow-xs h-full">

          {/* Customer & Cart Action Header */}
          <div className="p-3 border-b border-border/70 flex items-center justify-between gap-2 bg-muted/20">
            <div className="flex items-center gap-2 flex-1">
              <User size={16} className="text-primary" />
              <ModernSelect
                value={selectedCust.id}
                onChange={(val) => {
                  const c = (customers ?? []).find((cust: any) => cust.id === Number(val)) || { id: 1, name: 'Walk-in Customer (Retail)' }
                  setSelectedCust(c)
                }}
                options={(() => {
                  const custOpts = (customers ?? []).map((c: any) => ({
                    value: c.id,
                    label: `${c.name}${c.phone ? ` (${c.phone})` : ''}`,
                    badge: typeof c.group === 'object' && c.group !== null ? (c.group.name || 'Member') : (typeof c.group === 'string' ? c.group : 'Member'),
                  }))
                  const hasWalkIn = custOpts.some((o: any) => Number(o.value) === 1)
                  return hasWalkIn
                    ? custOpts
                    : [{ value: 1, label: 'Walk-in Customer (Retail)', badge: 'Retail' }, ...custOpts]
                })()}
                buttonClassName="border-none bg-transparent p-0 shadow-none text-xs font-bold text-foreground hover:bg-transparent"
                className="flex-1 min-w-0"
              />
              <button
                onClick={() => setIsCustModalOpen(true)}
                className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                title="Add New Customer"
              >
                <UserPlus size={14} />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleHoldCart}
                disabled={cart.length === 0}
                className="btn-secondary text-xs py-1.5 px-2.5 rounded-xl flex items-center gap-1 font-bold disabled:opacity-40"
                title="Suspend Sale"
              >
                <PauseCircle size={14} /> Hold
              </button>
              <button
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className="btn-danger text-xs py-1.5 px-2 rounded-xl flex items-center gap-1 disabled:opacity-40"
                title="Clear Cart"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Cart Item Table */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-16">
                <ShoppingCart size={44} className="mb-2 opacity-20" />
                <p className="text-xs font-bold text-foreground">Terminal Ready</p>
                <p className="text-[11px] text-muted-foreground">Scan barcode or select products to start sale</p>
              </div>
            ) : (
              cart.map((item, idx) => {
                const fallbackUrl = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80'
                const itemImg = typeof item.product.primary_image === 'string' && item.product.primary_image
                  ? item.product.primary_image
                  : (typeof item.product.primary_image === 'object' && item.product.primary_image?.url)
                    ? item.product.primary_image.url
                    : (item.product.images && item.product.images.length > 0 && item.product.images[0]?.url)
                      ? item.product.images[0].url
                      : fallbackUrl

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-card border border-border/70 text-xs hover:border-primary/40 shadow-2xs hover:shadow-md transition-all group"
                  >
                    {/* Product Image Thumbnail */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted/30 shrink-0 border border-border/60">
                      <img
                        src={itemImg}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackUrl }}
                      />
                    </div>

                    {/* Product Meta */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="font-extrabold text-foreground truncate tracking-tight">{item.product.name}</div>
                      
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        {item.selectedVariant && (
                          <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                            {item.selectedVariant.sku}
                          </span>
                        )}
                        {item.imei && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-mono font-bold border border-amber-500/20">
                            S/N: {item.imei}
                          </span>
                        )}
                        <span className="text-muted-foreground font-semibold">
                          ${item.unit_price.toFixed(2)} / unit
                        </span>
                      </div>
                    </div>

                    {/* Quantity Modifier Controls & Total Price */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-border/80 rounded-xl bg-muted/30 shadow-2xs overflow-hidden">
                        <button
                          onClick={() => updateQty(idx, item.quantity - 1)}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Decrease Quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-black text-foreground text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(idx, item.quantity + 1)}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Increase Quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="font-black text-foreground text-xs min-w-[55px] text-right">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        onClick={() => removeCartItem(idx)}
                        className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-all"
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Coupon Input & Payment Controls */}
          <div className="p-3.5 bg-muted/30 border-t border-border/80 space-y-3 text-xs">

            {/* Coupon Code Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Ticket size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon / Promo Code (e.g. VIP10)"
                  className="form-input text-xs pl-8 py-1 uppercase font-mono"
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                className="btn-secondary text-xs py-1 px-3 rounded-xl font-bold"
              >
                Apply
              </button>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div className="grid grid-cols-4 gap-1">
              {([
                { id: 'cash', label: 'Cash', icon: Banknote },
                { id: 'khqr', label: 'KHQR', icon: QrCode },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'bank', label: 'Transfer', icon: Building },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`py-2 rounded-xl font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === id
                      ? 'bg-primary text-primary-foreground shadow-xs ring-1 ring-primary/30'
                      : 'bg-card border border-border/70 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            {/* Quick Cash Buttons */}
            {paymentMethod === 'cash' && (
              <div className="space-y-1.5 bg-card p-2 rounded-xl border border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px] font-medium">Cash Tendered:</span>
                  <input
                    type="number"
                    value={cashTendered || ''}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    placeholder={`$${grandTotal.toFixed(2)}`}
                    className="form-input text-xs py-1 px-2 w-28 font-bold text-right text-primary"
                  />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                  {[5, 10, 20, 50, 100, 500, 1000].map(val => (
                    <button
                      key={val}
                      onClick={() => setCashTendered(val)}
                      className="px-2 py-1 rounded-lg bg-muted/40 hover:bg-primary/20 border border-border/60 font-bold text-[11px] flex-1 text-center"
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calculation Breakdown */}
            <div className="space-y-1 pt-1.5 border-t border-border/60">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Total Discount</span>
                  <span className="font-mono">-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>VAT Tax (10%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              {paymentMethod === 'cash' && cashTendered > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                  <span>Change Due</span>
                  <span className="font-mono">${changeDue.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-foreground font-black text-base pt-2 border-t border-border">
                <span>Grand Total</span>
                <span className="text-primary font-mono">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Complete Transaction Action */}
            <button
              onClick={handleInitiateCheckout}
              disabled={cart.length === 0 || checkoutMutation.isPending}
              className="w-full py-3 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 disabled:opacity-40 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {checkoutMutation.isPending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Processing Sale...
                </>
              ) : (
                <>
                  Complete & Pay (${grandTotal.toFixed(2)})
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* ── 4. Modals ────────────────────────────────────────────────────── */}
      <POSProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={(p, v, imei) => addToCart(p, v, imei)}
      />

      <POSCustomerModal
        isOpen={isCustModalOpen}
        onClose={() => setIsCustModalOpen(false)}
        onAddCustomer={(newCust) => {
          setSelectedCust(newCust)
          toast.success(`Customer ${newCust.name} selected!`)
        }}
      />

      <POSHeldCartsModal
        isOpen={isHeldModalOpen}
        onClose={() => setIsHeldModalOpen(false)}
        heldCarts={heldCarts}
        onResumeCart={handleResumeCart}
        onDeleteHeldCart={handleDeleteHeldCart}
      />

      <POSKHQRModal
        isOpen={isKHQRModalOpen}
        onClose={() => setIsKHQRModalOpen(false)}
        amount={grandTotal}
        referenceNo={`KHQR-${Date.now().toString().slice(-6)}`}
        onPaymentSuccess={() => {
          setIsKHQRModalOpen(false)
          processFinalCheckout()
        }}
      />

      <POSReceiptModal
        receipt={receiptData}
        onClose={() => setReceiptData(null)}
      />

    </div>
  )
}

export default POSPage
