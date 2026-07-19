import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import HeaderSearch from './HeaderSearch'
import HeaderActions from './HeaderActions'

interface HeaderProps {
  onToggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { t } = useTranslation()
  const location = useLocation()

  // Generate dynamic breadcrumbs based on active route path
  const pathSegments = location.pathname.split('/').filter(Boolean)
  
  const getBreadcrumbLabel = (segment: string) => {
    switch (segment) {
      case 'dashboard':
        return t('Dashboard', 'Dashboard')
      case 'products':
        return t('nav.productManagement', 'Products')
      case 'create':
        return t('common.create', 'Create')
      case 'edit':
        return t('common.edit', 'Edit')
      case 'categories':
        return t('nav.categories', 'Categories')
      case 'brands':
        return t('nav.brands', 'Brands')
      case 'units':
        return t('nav.units', 'Units')
      case 'attributes':
        return t('nav.attributes', 'Attributes')
      case 'inventory':
        return t('nav.inventoryManagement', 'Inventory')
      case 'transfers':
        return t('nav.stock_transfer', 'Transfers')
      case 'adjustments':
        return t('inventory.adjustments', 'Adjustments')
      case 'opnames':
        return t('inventory.opname', 'Opnames')
      case 'movements':
        return t('nav.activityLogs', 'Movements')
      case 'sales':
        return t('nav.salesOrders', 'Sales')
      case 'pos':
        return t('nav.posTerminal', 'POS')
      case 'orders':
        return t('orders', 'Orders')
      case 'purchases':
        return t('nav.purchaseManagement', 'Purchases')
      case 'returns':
        return t('nav.purchaseReturns', 'Returns')
      case 'suppliers':
        return t('nav.suppliers', 'Suppliers')
      case 'customers':
        return t('nav.customerManagement', 'Customers')
      case 'employees':
        return t('nav.employeeManagement', 'Employees')
      case 'finance':
        return t('nav.financeManagement', 'Finance')
      case 'expenses':
        return t('finance.expenses', 'Expenses')
      case 'reports':
        return t('nav.reportsManagement', 'Reports')
      case 'users':
        return t('nav.allUsers', 'Users')
      case 'roles':
        return t('nav.roles', 'Roles')
      case 'permissions':
        return t('nav.permissions', 'Permissions')
      case 'activity-logs':
        return t('nav.activityLogs', 'Activity Logs')
      case 'recycle-bin':
        return t('nav.recycleBin', 'Recycle Bin')
      case 'settings':
        return t('nav.settingsManagement', 'Settings')
      case 'profile':
        return t('profile.title', 'Profile')
      default:
        // Capitalize default fallback
        return segment.charAt(0).toUpperCase() + segment.slice(1)
    }
  }

  return (
    <header className="h-[72px] sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-6 bg-white/70 dark:bg-slate-900/70 border-b border-border/40 backdrop-blur-md transition-all duration-300">
      {/* Left side actions */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Toggle button */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors flex-shrink-0"
          title={t('common.toggle_sidebar', 'Toggle Sidebar')}
        >
          <Menu size={20} />
        </button>

        {/* Dynamic breadcrumb */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground font-semibold min-w-0 truncate">
          <Link
            to="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            {t('Dashboard', 'Dashboard')}
          </Link>
          
          {pathSegments.map((segment, idx) => {
            // Don't duplicate dashboard
            if (segment === 'dashboard') return null
            
            const isLast = idx === pathSegments.length - 1
            const path = `/${pathSegments.slice(0, idx + 1).join('/')}`
            const label = getBreadcrumbLabel(segment)

            return (
              <React.Fragment key={idx}>
                <ChevronRight size={12} className="opacity-50 flex-shrink-0" />
                {isLast ? (
                  <span className="text-foreground truncate max-w-[120px] font-bold">{label}</span>
                ) : (
                  <Link
                    to={path}
                    className="hover:text-foreground transition-colors truncate max-w-[100px]"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            )
          })}
        </nav>

        {/* Global Search Component */}
        <div className="hidden sm:block">
          <HeaderSearch />
        </div>
      </div>

      {/* Right side controls */}
      <HeaderActions />
    </header>
  )
}

export default Header
