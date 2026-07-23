import React from 'react'
import { DollarSign, ShoppingBag, ShoppingCart, Percent, Receipt, TrendingUp, Users, Vault, Lock, Layers } from 'lucide-react'

interface POSTopCardsProps {
  todaySales?: number
  todayOrders?: number
  cartTotal: number
  cartItemsCount: number
  cartDiscount: number
  cartTax: number
  activeCustomersCount?: number
}

export const POSTopCards: React.FC<POSTopCardsProps> = ({
  todaySales = 1248.50,
  todayOrders = 18,
  cartTotal,
  cartItemsCount,
  cartDiscount,
  cartTax,
  activeCustomersCount = 142,
}) => {
  const estProfit = cartTotal > 0 ? cartTotal * 0.35 : 0

  const cards = [
    {
      title: "Today's Sales",
      value: `$${todaySales.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Today's Orders",
      value: `${todayOrders} sales`,
      icon: ShoppingBag,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Cart Total",
      value: `$${cartTotal.toFixed(2)}`,
      icon: ShoppingCart,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      highlight: true,
    },
    {
      title: "Cart Items",
      value: `${cartItemsCount} items`,
      icon: Layers,
      color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    },
    {
      title: "Discount",
      value: `-$${cartDiscount.toFixed(2)}`,
      icon: Percent,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "VAT Tax (10%)",
      value: `$${cartTax.toFixed(2)}`,
      icon: Receipt,
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Est. Profit Margin",
      value: `$${estProfit.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
    },
    {
      title: "Active Customers",
      value: `${activeCustomersCount}`,
      icon: Users,
      color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
    },
    {
      title: "Cash Drawer Float",
      value: "$500.00",
      icon: Vault,
      color: "text-emerald-600 bg-emerald-600/10 border-emerald-600/20",
    },
    {
      title: "Register Status",
      value: "Open",
      icon: Lock,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
      {cards.map((c, i) => {
        const Icon = c.icon
        return (
          <div
            key={i}
            className={`p-2.5 rounded-xl border transition-all ${
              c.highlight
                ? 'bg-primary/5 border-primary/40 shadow-xs ring-1 ring-primary/20'
                : 'bg-card border-border/70 hover:border-border'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-semibold text-muted-foreground truncate">{c.title}</span>
              <div className={`p-1 rounded-md border ${c.color}`}>
                <Icon size={12} />
              </div>
            </div>
            <div className="text-xs font-black text-foreground truncate">{c.value}</div>
          </div>
        )
      })}
    </div>
  )
}
