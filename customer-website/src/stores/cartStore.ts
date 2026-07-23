import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number
  product_id: number
  product_variant_id?: number | null
  quantity: number
  product?: {
    id: number
    name: string
    sku: string
    selling_price: number
    compare_price: number
    image?: string
  }
  variant?: {
    id: number
    name: string
    selling_price: number
  } | null
  line_total: number
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  total: number
  item_count: number
  coupon_code?: string
  discount?: number
  isOpen: boolean

  // Actions
  setCart: (data: { items: CartItem[]; subtotal: number; total: number; item_count: number }) => void
  setOpen: (open: boolean) => void
  toggleOpen: () => void
  applyCoupon: (code: string, discount: number) => void
  clearCoupon: () => void
  reset: () => void
}

// ─── Cart Store ──────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  subtotal: 0,
  total: 0,
  item_count: 0,
  coupon_code: undefined,
  discount: undefined,
  isOpen: false,

  setCart: (data) =>
    set((s) => ({
      items:      data.items,
      subtotal:   data.subtotal,
      total:      data.total,
      item_count: data.item_count,
      // Recalculate total with coupon
      ...(s.discount != null
        ? { total: Math.max(0, data.subtotal - s.discount) }
        : {}),
    })),

  setOpen:    (open)   => set({ isOpen: open }),
  toggleOpen: ()       => set((s) => ({ isOpen: !s.isOpen })),

  applyCoupon: (code, discount) =>
    set((s) => ({
      coupon_code: code,
      discount,
      total: Math.max(0, s.subtotal - discount),
    })),

  clearCoupon: () =>
    set((s) => ({
      coupon_code: undefined,
      discount: undefined,
      total: s.subtotal,
    })),

  reset: () =>
    set({ items: [], subtotal: 0, total: 0, item_count: 0, coupon_code: undefined, discount: undefined }),
}))
