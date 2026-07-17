import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Warehouse,
  ShoppingBag, Settings, ChevronRight, ChevronLeft,
  Bell, Search, Sun, Moon, LogOut, User, Building2, Truck,
  DollarSign, BarChart3, ChevronDown, Store, Zap,
  Briefcase, FileText, History, ShieldAlert, BarChart2, Globe
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'

// ─── Navigation Types ────────────────────────────────────────────────────────

interface NavChild {
  labelKey: string
  path: string
  permission?: string
}

interface NavItem {
  labelKey: string
  icon: React.ReactNode
  path?: string
  children?: NavChild[]
  permission?: string
}

interface NavGroup {
  groupKey: string
  groupLabelKey?: string
  items: NavItem[]
}

// ─── Navigation Structure ─────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  // ── 1. Dashboard ─────────────────────────────────────────────────────────
  {
    groupKey: 'dashboard',
    groupLabelKey: '',
    items: [
      { labelKey: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    ],
  },

  // ── 2. Products ───────────────────────────────────────────────────────────
  {
    groupKey: 'products',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.productManagement',
        icon: <Package size={18} />,
        path: '/products',
        permission: 'product.view',
      },
    ],
  },

  // ── 2b. Inventory ──────────────────────────────────────────────────────────
  {
    groupKey: 'inventory',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.inventoryManagement',
        icon: <Warehouse size={18} />,
        path: '/inventory',
        permission: 'inventory.view',
      },
    ],
  },

  // ── 3. Sales ──────────────────────────────────────────────────────────────
  {
    groupKey: 'sales',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.salesManagement',
        icon: <ShoppingCart size={18} />,
        permission: 'sale.view',
        children: [
          { labelKey: 'nav.posTerminal',    path: '/pos', permission: 'sale.create' },
          { labelKey: 'nav.salesOrders',    path: '/sales', permission: 'sale.view' },
          { labelKey: 'orders',          path: '/orders', permission: 'order.view' },
        ],
      },
    ],
  },

  // ── 4. Customers ──────────────────────────────────────────────────────────
  {
    groupKey: 'customers',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.customerManagement',
        icon: <Users size={18} />,
        path: '/customers',
        permission: 'customer.view',
      },
    ],
  },

  // ── 5. Purchases ──────────────────────────────────────────────────────────
  {
    groupKey: 'purchases',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.purchaseManagement',
        icon: <ShoppingBag size={18} />,
        permission: 'purchase.view',
        children: [
          { labelKey: 'nav.purchaseOrders', path: '/purchases', permission: 'purchase.view' },
          { labelKey: 'nav.suppliers',       path: '/suppliers', permission: 'supplier.view' },
          { labelKey: 'nav.purchaseReturns',path: '/purchases/returns', permission: 'purchase_return.view' },
        ],
      },
    ],
  },

  // ── 6. Employees ──────────────────────────────────────────────────────────
  {
    groupKey: 'employees',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.employeeManagement',
        icon: <Briefcase size={18} />,
        path: '/employees',
        permission: 'employee.view',
      },
    ],
  },

  // ── 7. Finance ────────────────────────────────────────────────────────────
  {
    groupKey: 'finance',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.financeManagement',
        icon: <DollarSign size={18} />,
        path: '/finance',
        permission: 'expense.view',
      },
    ],
  },

  // ── 8. Content Management ──────────────────────────────────────────────────
  {
    groupKey: 'cms',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.contentManagement',
        icon: <FileText size={18} />,
        path: '/cms',
        permission: 'page.view',
      },
    ],
  },

  // ── 9. Marketing ──────────────────────────────────────────────────────────
  {
    groupKey: 'marketing',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.marketingManagement',
        icon: <Zap size={18} />,
        permission: 'promotion.view',
        children: [
          { labelKey: 'nav.coupons',         path: '/marketing/coupons', permission: 'coupon.view' },
          { labelKey: 'nav.promotions',      path: '/marketing/promotions', permission: 'promotion.view' },
          { labelKey: 'nav.flashSales',     path: '/marketing/flash-sales', permission: 'flash_sale.view' },
        ],
      },
    ],
  },

  // ── 10. Shipping ──────────────────────────────────────────────────────────
  {
    groupKey: 'shipping',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.shippingManagement',
        icon: <Truck size={18} />,
        path: '/shipping',
        permission: 'shipping_method.view',
      },
    ],
  },

  // ── 11. Company ───────────────────────────────────────────────────────────
  {
    groupKey: 'company',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.companyManagement',
        icon: <Building2 size={18} />,
        path: '/company',
        permission: 'company.view',
      },
    ],
  },

  // ── 12. Reports ───────────────────────────────────────────────────────────
  {
    groupKey: 'reports',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.reportsManagement',
        icon: <BarChart2 size={18} />,
        permission: 'report.view',
        children: [
          { labelKey: 'nav.salesReport',     path: '/reports/sales', permission: 'report.view' },
          { labelKey: 'nav.purchaseReports',  path: '/reports/sales?tab=purchase', permission: 'report.view' },
          { labelKey: 'nav.inventoryReport', path: '/reports/inventory', permission: 'report.view' },
          { labelKey: 'nav.profitLoss',     path: '/reports/profit-loss', permission: 'report.view' },
        ],
      },
    ],
  },

  // ── 13. Administration ────────────────────────────────────────────────────
  {
    groupKey: 'security',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.administrationManagement',
        icon: <User size={18} />,
        permission: 'user.view',
        children: [
          { labelKey: 'nav.allUsers',       path: '/users', permission: 'user.view' },
          { labelKey: 'nav.roles',           path: '/roles', permission: 'role.view' },
          { labelKey: 'nav.permissions',     path: '/permissions', permission: 'permission.view' },
        ],
      },
    ],
  },

  // ── 14. System ────────────────────────────────────────────────────────────
  {
    groupKey: 'activity',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.systemManagement',
        icon: <History size={18} />,
        permission: 'activity_log.view',
        children: [
          { labelKey: 'nav.recycleBin',      path: '/recycle-bin', permission: 'activity_log.view' },
          { labelKey: 'nav.activityLogs',    path: '/activity-logs', permission: 'activity_log.view' },
        ],
      },
    ],
  },

  // ── 15. Settings ──────────────────────────────────────────────────────────
  {
    groupKey: 'settings',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.settingsManagement',
        icon: <Settings size={18} />,
        path: '/settings',
        permission: 'setting.view',
      },
    ],
  },
]

// ─── SidebarItem ─────────────────────────────────────────────────────────────

const SidebarItem: React.FC<{ item: NavItem; collapsed: boolean }> = ({ item, collapsed }) => {
  const { t } = useTranslation()
  const { hasPermission } = useAuthStore()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Filter children by permission
  const visibleChildren = item.children?.filter(child =>
    !child.permission || hasPermission(child.permission)
  )

  const isGroupActive = visibleChildren?.some(c => location.pathname === c.path ||
    (c.path.includes('?') && location.pathname === c.path.split('?')[0]))

  // Auto-open when a child is active
  useEffect(() => {
    if (isGroupActive) setOpen(true)
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  if (visibleChildren && visibleChildren.length > 0) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`sidebar-item w-full justify-between ${isGroupActive ? 'text-white' : ''}`}
        >
          <div className="flex items-center gap-3">
            <span className={isGroupActive ? 'text-blue-400' : ''}>{item.icon}</span>
            {!collapsed && <span>{t(item.labelKey)}</span>}
          </div>
          {!collapsed && (
            <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {open && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              className="overflow-hidden ml-6 mt-0.5 space-y-0.5"
            >
              {visibleChildren.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                     ${isActive
                       ? 'text-blue-400 bg-blue-600/15 font-medium'
                       : 'text-slate-400 hover:text-white hover:bg-white/5'
                     }`
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />
                  {t(child.labelKey)}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <NavLink
      to={item.path!}
      title={collapsed ? t(item.labelKey) : undefined}
      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
    >
      <span>{item.icon}</span>
      {!collapsed && <span>{t(item.labelKey)}</span>}
    </NavLink>
  )
}

// ─── SidebarGroup ─────────────────────────────────────────────────────────────

const SidebarGroup: React.FC<{ group: NavGroup; collapsed: boolean; hasPermission: (p: string) => boolean }> =
  ({ group, collapsed, hasPermission }) => {
    const { t } = useTranslation()

    const visibleItems = group.items.filter(item => {
      if (item.permission && !hasPermission(item.permission)) return false

      if (item.children) {
        const visibleChildren = item.children.filter(child =>
          !child.permission || hasPermission(child.permission)
        )
        return visibleChildren.length > 0
      }

      return true
    })

    if (visibleItems.length === 0) return null

    return (
      <div className="space-y-0.5">
        {!collapsed && group.groupLabelKey && (
          <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500 select-none">
            {t(group.groupLabelKey)}
          </p>
        )}
        {collapsed && group.groupLabelKey && (
          <div className="border-t border-white/5 my-2" />
        )}
        {visibleItems.map(item => (
          <SidebarItem key={item.labelKey} item={item} collapsed={collapsed} />
        ))}
      </div>
    )
  }

// ─── AdminLayout ──────────────────────────────────────────────────────────────

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed]   = useState(false)
  const { user, darkMode, toggleDark, logout, hasPermission } = useAuthStore()
  const { language, setLanguage } = useThemeStore()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    logout()
    navigate('/login')
  }

  const sidebarWidth = collapsed ? 'w-16' : 'w-64'

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col ${sidebarWidth} transition-all duration-300 ease-in-out
                    bg-[hsl(222,47%,11%)] border-r border-white/5 relative z-20 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/5 flex-shrink-0">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Store size={16} className="text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold uppercase tracking-wider leading-none">Enterprise POS</p>
                <span className="text-[10px] text-slate-400 font-medium">{t('common.management_system', 'Management System')}</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto">
              <Store size={16} className="text-white" />
            </div>
          )}
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2">
          {NAV_GROUPS.map(group => (
            <SidebarGroup
              key={group.groupKey}
              group={group}
              collapsed={collapsed}
              hasPermission={hasPermission}
            />
          ))}
        </nav>

        {/* User card */}
        {!collapsed && (
          <div className="p-3 border-t border-white/5">
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xs font-semibold">{user?.name?.[0] ?? 'U'}</span>
                )}
              </div>
              <div className="flex-1 overflow-hidden min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-slate-400 text-xs truncate">{user?.roles?.[0]?.replace('_', ' ')}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors"
                title={t('auth.logout', 'Logout')}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full
                     flex items-center justify-center text-muted-foreground hover:text-foreground
                     shadow-sm transition-colors z-30"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('common.search_anything', 'Search anything...')}
                className="pl-9 pr-4 py-2 text-sm bg-muted border-0 rounded-lg w-64
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background
                           placeholder:text-muted-foreground transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
              className="w-10 h-9 px-1.5 rounded-lg flex items-center justify-center text-muted-foreground
                         hover:text-foreground hover:bg-muted transition-colors font-semibold text-xs uppercase gap-1"
              title={language === 'en' ? t('common.switch_to_khmer', 'Switch to Khmer') : t('common.switch_to_english', 'Switch to English')}
            >
              <Globe size={15} />
              <span>{language}</span>
            </button>

            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground
                         hover:text-foreground hover:bg-muted transition-colors"
              title={darkMode ? t('common.light_mode', 'Light mode') : t('common.dark_mode', 'Dark mode')}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground
                               hover:text-foreground hover:bg-muted transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div 
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xs font-semibold">{user?.name?.[0] ?? 'U'}</span>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
