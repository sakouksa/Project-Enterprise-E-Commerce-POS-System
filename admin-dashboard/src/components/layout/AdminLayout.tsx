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
import { useThemeStore, applyPrimaryCssVar } from '@/stores/themeStore'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'
import Header from './Header'

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

// ─── Category Icon Color & Styling Map ───────────────────────────────────────

const CATEGORY_STYLES: Record<string, { colorClass: string; bgClass: string; hexColor: string }> = {
  dashboard:      { colorClass: 'text-sky-500',      bgClass: 'bg-sky-500/15 dark:bg-sky-500/25',      hexColor: '#0284c7' },
  products:       { colorClass: 'text-indigo-500',   bgClass: 'bg-indigo-500/15 dark:bg-indigo-500/25', hexColor: '#6366f1' },
  inventory:      { colorClass: 'text-emerald-500',  bgClass: 'bg-emerald-500/15 dark:bg-emerald-500/25', hexColor: '#10b981' },
  sales:          { colorClass: 'text-amber-500',    bgClass: 'bg-amber-500/15 dark:bg-amber-500/25',   hexColor: '#f59e0b' },
  customers:      { colorClass: 'text-pink-500',     bgClass: 'bg-pink-500/15 dark:bg-pink-500/25',     hexColor: '#ec4899' },
  purchases:      { colorClass: 'text-purple-500',   bgClass: 'bg-purple-500/15 dark:bg-purple-500/25', hexColor: '#8b5cf6' },
  employees:      { colorClass: 'text-teal-500',     bgClass: 'bg-teal-500/15 dark:bg-teal-500/25',     hexColor: '#14b8a6' },
  finance:        { colorClass: 'text-green-500',    bgClass: 'bg-green-500/15 dark:bg-green-500/25',   hexColor: '#22c55e' },
  cms:            { colorClass: 'text-blue-500',     bgClass: 'bg-blue-500/15 dark:bg-blue-500/25',     hexColor: '#3b82f6' },
  marketing:      { colorClass: 'text-yellow-500',   bgClass: 'bg-yellow-500/15 dark:bg-yellow-500/25', hexColor: '#eab308' },
  shipping:       { colorClass: 'text-orange-500',   bgClass: 'bg-orange-500/15 dark:bg-orange-500/25', hexColor: '#f97316' },
  company:        { colorClass: 'text-cyan-500',     bgClass: 'bg-cyan-500/15 dark:bg-cyan-500/25',     hexColor: '#06b6d4' },
  reports:        { colorClass: 'text-fuchsia-500',  bgClass: 'bg-fuchsia-500/15 dark:bg-fuchsia-500/25', hexColor: '#d946ef' },
  administration: { colorClass: 'text-rose-500',     bgClass: 'bg-rose-500/15 dark:bg-rose-500/25',     hexColor: '#f43f5e' },
  activity:       { colorClass: 'text-violet-500',   bgClass: 'bg-violet-500/15 dark:bg-violet-500/25', hexColor: '#7c3aed' },
  notifications:  { colorClass: 'text-indigo-400',   bgClass: 'bg-indigo-400/15 dark:bg-indigo-400/25', hexColor: '#818cf8' },
  settings:       { colorClass: 'text-blue-600',     bgClass: 'bg-blue-600/15 dark:bg-blue-600/25',     hexColor: '#2563eb' },
}

// ─── Navigation Structure ─────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    groupKey: 'dashboard',
    groupLabelKey: '',
    items: [
      { labelKey: 'Dashboard', icon: <LayoutDashboard size={17} />, path: '/dashboard' },
    ],
  },
  {
    groupKey: 'products',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.productManagement',
        icon: <Package size={17} />,
        path: '/products',
        permission: 'product.view',
      },
    ],
  },
  {
    groupKey: 'inventory',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.inventoryManagement',
        icon: <Warehouse size={17} />,
        path: '/inventory',
        permission: 'inventory.view',
      },
    ],
  },
  {
    groupKey: 'sales',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.salesManagement',
        icon: <ShoppingCart size={17} />,
        permission: 'sale.view',
        children: [
          { labelKey: 'nav.posTerminal',    path: '/pos', permission: 'sale.create' },
          { labelKey: 'nav.salesOrders',    path: '/sales', permission: 'sale.view' },
          { labelKey: 'orders',          path: '/orders', permission: 'order.view' },
        ],
      },
    ],
  },
  {
    groupKey: 'customers',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.customerManagement',
        icon: <Users size={17} />,
        path: '/customers',
        permission: 'customer.view',
      },
    ],
  },
  {
    groupKey: 'purchases',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.purchaseManagement',
        icon: <ShoppingBag size={17} />,
        permission: 'purchase.view',
        children: [
          { labelKey: 'nav.purchaseOrders', path: '/purchases', permission: 'purchase.view' },
          { labelKey: 'nav.suppliers',       path: '/suppliers', permission: 'supplier.view' },
          { labelKey: 'nav.purchaseReturns',path: '/purchases/returns', permission: 'purchase_return.view' },
        ],
      },
    ],
  },
  {
    groupKey: 'employees',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.employeeManagement',
        icon: <Briefcase size={17} />,
        path: '/employees',
        permission: 'employee.view',
      },
    ],
  },
  {
    groupKey: 'finance',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.financeManagement',
        icon: <DollarSign size={17} />,
        permission: 'finance.view',
        children: [
          { labelKey: 'nav.expenses',         path: '/expenses', permission: 'expense.view' },
          { labelKey: 'nav.paymentMethods',   path: '/payments/methods', permission: 'payment.view' },
          { labelKey: 'nav.transactions',     path: '/payments/transactions', permission: 'payment.view' },
        ],
      },
    ],
  },
  {
    groupKey: 'cms',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.contentManagement',
        icon: <FileText size={17} />,
        path: '/cms',
        permission: 'cms.view',
      },
    ],
  },
  {
    groupKey: 'marketing',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.marketing',
        icon: <Zap size={17} />,
        permission: 'promotions.view',
        children: [
          { labelKey: 'nav.promotions', path: '/marketing/promotions', permission: 'promotions.view' },
          { labelKey: 'nav.coupons',    path: '/marketing/coupons', permission: 'coupons.view' },
          { labelKey: 'nav.flashSales', path: '/marketing/flash-sales', permission: 'flash_sales.view' },
          { labelKey: 'nav.banners',    path: '/marketing/banners', permission: 'banners.view' },
        ],
      },
    ],
  },
  {
    groupKey: 'shipping',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.shippingManagement',
        icon: <Truck size={17} />,
        path: '/shipping',
        permission: 'shipping.view',
      },
    ],
  },
  {
    groupKey: 'company',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.companyManagement',
        icon: <Building2 size={17} />,
        permission: 'company.view',
        children: [
          { labelKey: 'nav.companyInfo', path: '/company', permission: 'company.view' },
          { labelKey: 'nav.branches',    path: '/branches', permission: 'company.view' },
          { labelKey: 'nav.stores',      path: '/stores', permission: 'company.view' },
          { labelKey: 'nav.warehouses',  path: '/warehouses', permission: 'inventory.view' },
        ],
      },
    ],
  },
  {
    groupKey: 'reports',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.reports',
        icon: <BarChart3 size={17} />,
        permission: 'report.view',
        children: [
          { labelKey: 'nav.salesReport',     path: '/reports/sales', permission: 'report.view' },
          { labelKey: 'nav.purchaseReport',  path: '/reports/purchase', permission: 'report.view' },
          { labelKey: 'nav.inventoryReport', path: '/reports/inventory', permission: 'report.view' },
          { labelKey: 'nav.profitLossReport',path: '/reports/profit-loss', permission: 'report.view' },
        ],
      },
    ],
  },
  {
    groupKey: 'administration',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.administration',
        icon: <ShieldAlert size={17} />,
        permission: 'user.view',
        children: [
          { labelKey: 'nav.users',       path: '/users', permission: 'user.view' },
          { labelKey: 'nav.roles',       path: '/roles', permission: 'role.view' },
          { labelKey: 'nav.permissions', path: '/permissions', permission: 'permission.view' },
        ],
      },
    ],
  },
  {
    groupKey: 'activity',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.systemManagement',
        icon: <History size={17} />,
        permission: 'activity_log.view',
        children: [
          { labelKey: 'nav.recycleBin',      path: '/recycle-bin', permission: 'activity_log.view' },
          { labelKey: 'nav.activityLogs',    path: '/activity-logs', permission: 'activity_log.view' },
        ],
      },
    ],
  },
  {
    groupKey: 'notifications',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.notifications',
        icon: <Bell size={17} />,
        permission: 'notification.view',
        children: [
          { labelKey: 'nav.allNotifications', path: '/notifications', permission: 'notification.view' },
          { labelKey: 'nav.notificationTemplates', path: '/notification-templates', permission: 'notification.template.view' },
          { labelKey: 'nav.notificationSettings', path: '/notifications/settings', permission: 'notification.view' },
        ],
      },
    ],
  },
  {
    groupKey: 'settings',
    groupLabelKey: '',
    items: [
      {
        labelKey: 'nav.settingsManagement',
        icon: <Settings size={17} />,
        path: '/settings',
        permission: 'setting.view',
      },
    ],
  },
]

// ─── SidebarItem Component with Micro-Animations & Curated Icon Colors ─────────

const SidebarItem: React.FC<{ item: NavItem; groupKey: string; collapsed: boolean }> = ({ item, groupKey, collapsed }) => {
  const { t } = useTranslation()
  const { hasPermission } = useAuthStore()
  const location = useLocation()
  const { sidebar: sidebarConfig } = useThemeStore()

  const catStyle = CATEGORY_STYLES[groupKey] || { colorClass: 'text-primary', bgClass: 'bg-primary/15', hexColor: '#3b82f6' }

  // Filter children by permission
  const visibleChildren = item.children?.filter(child =>
    !child.permission || hasPermission(child.permission)
  )

  const isGroupActive = visibleChildren?.some(c =>
    location.pathname === c.path || (c.path.includes('?') && location.pathname === c.path.split('?')[0])
  )
  const isDirectActive = !item.children && location.pathname === item.path

  const [open, setOpen] = useState(isGroupActive ?? false)

  useEffect(() => {
    if (isGroupActive) {
      setOpen(true)
    }
  }, [location.pathname, isGroupActive])

  const paddingClass = sidebarConfig?.compact ? 'py-1.5 px-2' : 'py-2 px-2.5'
  const roundedStyle = sidebarConfig?.roundedStyle || '0.75rem'

  const customTextColor = sidebarConfig?.textColor
  const customActiveBg = sidebarConfig?.activeBgColor || 'hsl(var(--primary))'
  const customActiveText = sidebarConfig?.activeTextColor || '#ffffff'

  if (visibleChildren && visibleChildren.length > 0) {
    return (
      <div className="space-y-1">
        <motion.button
          type="button"
          onClick={() => setOpen(o => !o)}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            borderRadius: roundedStyle,
            color: isGroupActive ? customActiveBg : (customTextColor || undefined),
            backgroundColor: isGroupActive ? `${customActiveBg}18` : undefined,
          }}
          className={`group flex items-center w-full justify-between gap-3 text-xs font-bold transition-all duration-150 cursor-pointer select-none whitespace-nowrap ${paddingClass} ${
            !isGroupActive ? 'hover:bg-foreground/10' : ''
          } ${!customTextColor && !isGroupActive ? 'text-foreground' : ''}`}
        >
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              style={{
                backgroundColor: isGroupActive ? customActiveBg : undefined,
                color: isGroupActive ? customActiveText : undefined,
              }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 shadow-2xs ${
                !isGroupActive ? `${catStyle.bgClass} ${catStyle.colorClass}` : ''
              }`}
            >
              {item.icon}
            </motion.div>
            {!collapsed && <span className="font-bold tracking-wide">{t(item.labelKey)}</span>}
          </div>
          {!collapsed && (
            <ChevronDown
              size={14}
              style={{ color: isGroupActive ? customActiveBg : (customTextColor || undefined) }}
              className={`transition-transform duration-200 shrink-0 opacity-70 group-hover:opacity-100 ${open ? 'rotate-180' : ''}`}
            />
          )}
        </motion.button>

        <AnimatePresence initial={false}>
          {open && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ borderColor: isGroupActive ? `${customActiveBg}60` : `${catStyle.hexColor}40` }}
              className="overflow-hidden ml-5 pl-2.5 border-l-2 space-y-1 my-1"
            >
              {visibleChildren.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  style={({ isActive }) => ({
                    borderRadius: roundedStyle,
                    backgroundColor: isActive ? customActiveBg : undefined,
                    color: isActive ? customActiveText : (customTextColor || undefined),
                  })}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'shadow-xs scale-[1.01]'
                        : `hover:bg-foreground/10 hover:translate-x-1 ${!customTextColor ? 'text-foreground' : ''}`
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <motion.span
                        whileHover={{ scale: 1.5 }}
                        style={{ backgroundColor: isActive ? customActiveText : catStyle.hexColor }}
                        className={`rounded-full shrink-0 transition-transform ${
                          isActive ? 'w-2 h-2 shadow-xs' : 'w-1.5 h-1.5 opacity-70 group-hover:opacity-100'
                        }`}
                      />
                      <span className="truncate">{t(child.labelKey)}</span>
                    </>
                  )}
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
      style={({ isActive }) => ({
        borderRadius: roundedStyle,
        backgroundColor: isActive ? customActiveBg : undefined,
        color: isActive ? customActiveText : (customTextColor || undefined),
      })}
      className={({ isActive }) =>
        `group flex items-center gap-2.5 text-xs font-bold transition-all duration-150 cursor-pointer select-none whitespace-nowrap ${paddingClass} ${
          isActive
            ? 'shadow-md font-bold scale-[1.01]'
            : `hover:bg-foreground/10 hover:translate-x-1 ${!customTextColor ? 'text-foreground' : ''}`
        }`
      }
    >
      {({ isActive }) => (
        <>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              backgroundColor: isActive ? customActiveText : undefined,
              color: isActive ? customActiveBg : undefined,
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 shadow-2xs ${
              !isActive ? `${catStyle.bgClass} ${catStyle.colorClass}` : ''
            }`}
          >
            {item.icon}
          </motion.div>
          {!collapsed && <span className="font-bold tracking-wide">{t(item.labelKey)}</span>}
        </>
      )}
    </NavLink>
  )
}

// ─── SidebarGroup Component ───────────────────────────────────────────────────

const SidebarGroup: React.FC<{ group: NavGroup; collapsed: boolean; hasPermission: (p: string) => boolean }> =
  ({ group, collapsed, hasPermission }) => {
    const { t } = useTranslation()
    const { sidebar: sidebarConfig } = useThemeStore()

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
          <p 
            style={{ color: sidebarConfig?.textColor || undefined }}
            className="px-3 pt-3.5 pb-1 text-[10px] font-extrabold uppercase tracking-widest opacity-60 select-none"
          >
            {t(group.groupLabelKey)}
          </p>
        )}
        {collapsed && group.groupLabelKey && (
          <div 
            style={{ borderColor: sidebarConfig?.borderColor || 'rgba(128, 128, 128, 0.15)' }}
            className="border-t my-2" 
          />
        )}
        {visibleItems.map(item => (
          <SidebarItem key={item.labelKey} item={item} groupKey={group.groupKey} collapsed={collapsed} />
        ))}
      </div>
    )
  }

// ─── AdminLayout Component ────────────────────────────────────────────────────

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed]   = useState(false)
  const { user, darkMode, toggleDark, logout, hasPermission } = useAuthStore()
  const { language, setLanguage, primaryColor, sidebar: sidebarConfig } = useThemeStore()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (primaryColor) {
      applyPrimaryCssVar(primaryColor)
    }
  }, [primaryColor])

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    logout()
    navigate('/login')
  }

  const isCollapsed = collapsed || sidebarConfig?.collapsed
  const sidebarWidth = isCollapsed
    ? '68px'
    : sidebarConfig?.width
    ? `${sidebarConfig.width}px`
    : '256px'

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: sidebarWidth,
          backgroundColor: sidebarConfig?.bgColor || '#0f172a',
          borderColor: sidebarConfig?.borderColor || 'rgba(128, 128, 128, 0.15)',
        }}
        className="hidden lg:flex flex-col transition-all duration-300 ease-in-out border-r relative z-50 flex-shrink-0 shadow-sm"
      >

        {/* Logo Header with Spring Glow */}
        <div 
          style={{ borderColor: sidebarConfig?.borderColor || 'rgba(128, 128, 128, 0.15)' }}
          className="flex items-center h-16 px-4 border-b flex-shrink-0"
        >
          {!collapsed ? (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Store size={16} className="text-white" />
              </div>
              <div className="overflow-hidden">
                <p 
                  style={{ color: sidebarConfig?.textColor || undefined }}
                  className="text-xs font-black uppercase tracking-wider leading-none"
                >
                  Enterprise POS
                </p>
                <span 
                  style={{ color: sidebarConfig?.textColor || undefined }}
                  className="text-[10px] opacity-70 font-bold block mt-0.5"
                >
                  {t('common.management_system', 'Management System')}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center mx-auto shadow-md cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <Store size={16} className="text-white" />
            </motion.div>
          )}
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-1">
          {NAV_GROUPS.map(group => (
            <SidebarGroup
              key={group.groupKey}
              group={group}
              collapsed={collapsed}
              hasPermission={hasPermission}
            />
          ))}
        </nav>

        {/* User Card with Micro-Spring Animation */}
        {!collapsed && (
          <div 
            style={{ borderColor: sidebarConfig?.borderColor || 'rgba(128, 128, 128, 0.15)' }}
            className="p-3 border-t"
          >
            <motion.div 
              whileHover={{ scale: 1.02, x: 2 }}
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-foreground/10 transition-colors cursor-pointer group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs ring-2 ring-primary/20">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xs font-bold">{user?.name?.[0] ?? 'U'}</span>
                )}
              </div>
              <div className="flex-1 overflow-hidden min-w-0">
                <p 
                  style={{ color: sidebarConfig?.textColor || undefined }}
                  className="text-xs font-extrabold truncate"
                >
                  {user?.name || 'Super Admin'}
                </p>
                <p 
                  style={{ color: sidebarConfig?.textColor || undefined }}
                  className="text-[10px] opacity-70 truncate capitalize font-semibold"
                >
                  {user?.roles?.[0]?.replace('_', ' ') || 'super admin'}
                </p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleLogout()
                }}
                style={{ color: sidebarConfig?.textColor || undefined }}
                className="opacity-70 hover:opacity-100 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                title={t('auth.logout', 'Logout')}
              >
                <LogOut size={15} />
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* Collapse toggle */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full
                     flex items-center justify-center text-muted-foreground hover:text-foreground
                     shadow-md transition-colors z-30 cursor-pointer"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </motion.button>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setCollapsed(c => !c)} />

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
