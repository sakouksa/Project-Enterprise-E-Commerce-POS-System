import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, ShoppingBag, Package, Users, Truck, 
  Settings2, RefreshCw, BarChart2 
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'

export const QuickActions: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { hasPermission } = useAuthStore()

  const items = [
    {
      label: t('nav.posTerminal', 'Create Sale'),
      path: '/pos',
      icon: <ShoppingCart className="w-4 h-4 text-blue-500" />,
      permission: 'sale.create',
      color: 'hover:bg-blue-500/5 hover:border-blue-500/20'
    },
    {
      label: t('purchases.createPO', 'Create Purchase'),
      path: '/purchases',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-500" />,
      permission: 'purchase.create',
      color: 'hover:bg-emerald-500/5 hover:border-emerald-500/20'
    },
    {
      label: t('products.create', 'Add Product'),
      path: '/products/create',
      icon: <Package className="w-4 h-4 text-indigo-500" />,
      permission: 'product.create',
      color: 'hover:bg-indigo-500/5 hover:border-indigo-500/20'
    },
    {
      label: t('customers.create', 'Add Customer'),
      path: '/customers',
      icon: <Users className="w-4 h-4 text-purple-500" />,
      permission: 'customer.create',
      color: 'hover:bg-purple-500/5 hover:border-purple-500/20'
    },
    {
      label: t('suppliers.create', 'Add Supplier'),
      path: '/suppliers',
      icon: <Truck className="w-4 h-4 text-pink-500" />,
      permission: 'supplier.create',
      color: 'hover:bg-pink-500/5 hover:border-pink-500/20'
    },
    {
      label: t('inventory.adjustments', 'Inventory Adjustment'),
      path: '/inventory/adjustments',
      icon: <Settings2 className="w-4 h-4 text-amber-500" />,
      permission: 'inventory.edit',
      color: 'hover:bg-amber-500/5 hover:border-amber-500/20'
    },
    {
      label: t('inventory.stock_transfer', 'Transfer Stock'),
      path: '/inventory/transfers',
      icon: <RefreshCw className="w-4 h-4 text-cyan-500" />,
      permission: 'inventory.edit',
      color: 'hover:bg-cyan-500/5 hover:border-cyan-500/20'
    },
    {
      label: t('nav.reportsManagement', 'Generate Report'),
      path: '/reports',
      icon: <BarChart2 className="w-4 h-4 text-slate-500" />,
      permission: 'reports.view',
      color: 'hover:bg-slate-500/5 hover:border-slate-500/20'
    },
  ]

  const allowedItems = items.filter((item) => !item.permission || hasPermission(item.permission))

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-sm text-foreground mb-4">
        {t('common.quick_actions', 'Quick Actions')}
      </h3>
      <div className="grid grid-cols-1 gap-2.5">
        {allowedItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full p-3 rounded-xl border border-border/60 text-left flex items-center gap-3 transition-all duration-200 ${item.color}`}
          >
            <span className="p-1.5 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              {item.icon}
            </span>
            <span className="text-xs font-bold text-foreground truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
