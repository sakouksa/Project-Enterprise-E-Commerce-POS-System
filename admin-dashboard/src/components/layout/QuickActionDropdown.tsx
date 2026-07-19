import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ShoppingCart, ShoppingBag, Package, Users, Truck, DollarSign, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'

const QuickActionDropdown: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { hasPermission } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const actions = [
    {
      label: t('nav.posTerminal', 'POS Terminal'),
      path: '/pos',
      icon: <ShoppingCart className="w-4 h-4 text-blue-500" />,
      permission: 'sale.create',
    },
    {
      label: t('purchases.createPO', 'New Purchase Order'),
      path: '/purchases',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-500" />,
      permission: 'purchase.create',
    },
    {
      label: t('products.create', 'New Product'),
      path: '/products/create',
      icon: <Package className="w-4 h-4 text-indigo-500" />,
      permission: 'product.create',
    },
    {
      label: t('customers.create', 'New Customer'),
      path: '/customers',
      icon: <Users className="w-4 h-4 text-purple-500" />,
      permission: 'customer.create',
    },
    {
      label: t('suppliers.create', 'New Supplier'),
      path: '/suppliers',
      icon: <Truck className="w-4 h-4 text-pink-500" />,
      permission: 'supplier.create',
    },
    {
      label: t('finance.create_expense', 'New Expense'),
      path: '/expenses',
      icon: <DollarSign className="w-4 h-4 text-amber-500" />,
      permission: 'expense.create',
    },
    {
      label: t('inventory.stock_transfer', 'New Transfer'),
      path: '/inventory/transfers',
      icon: <RefreshCw className="w-4 h-4 text-cyan-500" />,
      permission: 'inventory.edit',
    },
  ]

  // Filter actions based on permissions
  const allowedActions = actions.filter((act) => !act.permission || hasPermission(act.permission))

  if (allowedActions.length === 0) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all duration-200"
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t('common.quick_add', 'Quick Add')}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl z-50 p-1.5 backdrop-blur-md"
          >
            <div className="px-3 py-2 border-b border-border/50 mb-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {t('common.quick_actions', 'Quick Actions')}
              </span>
            </div>
            <div className="space-y-0.5">
              {allowedActions.map((act) => (
                <button
                  key={act.path}
                  onClick={() => {
                    navigate(act.path)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150 text-left"
                >
                  <span className="p-1 bg-muted rounded-lg flex items-center justify-center">
                    {act.icon}
                  </span>
                  <span>{act.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuickActionDropdown
