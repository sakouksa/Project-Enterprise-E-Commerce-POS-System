import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminLayout from '@/components/layout/AdminLayout'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import ToastContainer from '@/components/ui/ToastContainer'
import ThemeSynchronizer from '@/components/shared/ThemeSynchronizer'
import NetworkStatusListener from '@/components/shared/NetworkStatusListener'
import AccessDeniedPage from '@/components/shared/AccessDeniedPage'

// ─── Lazy Pages ─────────────────────────────────────────────────────────────

// Auth
const LoginPage           = React.lazy(() => import('@/pages/auth/LoginPage'))

// Dashboard
const DashboardPage       = React.lazy(() => import('@/pages/dashboard/DashboardPage'))

// Products
const ProductsPage        = React.lazy(() => import('@/pages/products/ProductsPage'))
const ProductFormPage     = React.lazy(() => import('@/pages/products/ProductFormPage'))
const CategoriesPage      = React.lazy(() => import('@/modules/categories/pages/CategoriesPage'))
const BrandsPage          = React.lazy(() => import('@/pages/brands/BrandsPage'))
const AttributesPage      = React.lazy(() => import('@/pages/attributes/AttributesPage'))
const TaxesPage           = React.lazy(() => import('@/pages/products/TaxesPage'))

// Inventory
const InventoryPage       = React.lazy(() => import('@/pages/inventory/InventoryPage'))

// Sales
const SalesPage           = React.lazy(() => import('@/pages/sales/SalesPage'))
const OrdersPage          = React.lazy(() => import('@/pages/orders/OrdersPage'))
const POSPage             = React.lazy(() => import('@/pages/pos/POSPage'))

// Purchases
const PurchasesPage       = React.lazy(() => import('@/pages/purchases/PurchasesPage'))
const PurchaseReturnsPage = React.lazy(() => import('@/pages/purchases/PurchaseReturnsPage'))
const SuppliersPage       = React.lazy(() => import('@/pages/suppliers/SuppliersPage'))
const SupplierFormPage   = React.lazy(() => import('@/pages/suppliers/SupplierFormPage'))

// Customers
const CustomersPage       = React.lazy(() => import('@/pages/customers/CustomersPage'))
const CustomerFormPage   = React.lazy(() => import('@/pages/customers/CustomerFormPage'))
const CustomerGroupsPage  = React.lazy(() => import('@/pages/customers/CustomerGroupsPage'))

// Employees
const EmployeesPage       = React.lazy(() => import('@/pages/employees/EmployeesPage'))
const EmployeeFormPage   = React.lazy(() => import('@/pages/employees/EmployeeFormPage'))

// Marketing
const CouponsPage         = React.lazy(() => import('@/pages/marketing/CouponsPage'))
const BannersPage         = React.lazy(() => import('@/pages/marketing/BannersPage'))
const FlashSalesPage      = React.lazy(() => import('@/pages/marketing/FlashSalesPage'))
const PromotionsPage      = React.lazy(() => import('@/pages/marketing/PromotionsPage'))

// CMS
const CMSPage             = React.lazy(() => import('@/pages/cms/CMSPage'))

// Shipping
const ShippingPage        = React.lazy(() => import('@/pages/shipping/ShippingPage'))

// Finance
const ExpensesPage        = React.lazy(() => import('@/pages/expenses/ExpensesPage'))
const ExpenseFormPage     = React.lazy(() => import('@/pages/finance/ExpenseFormPage'))
const FinancePage         = React.lazy(() => import('@/pages/finance/FinancePage'))
const PaymentMethodsPage  = React.lazy(() => import('@/pages/payments/PaymentMethodsPage'))
const TransactionsPage    = React.lazy(() => import('@/pages/payments/TransactionsPage'))

// Company
const CompanyPage         = React.lazy(() => import('@/pages/company/CompanyPage'))

// Reports
const ReportsPage         = React.lazy(() => import('@/pages/reports/ReportsPage'))
const SalesReportPage     = React.lazy(() => import('@/pages/reports/SalesReportPage'))
const PurchaseReportPage  = React.lazy(() => import('@/pages/reports/PurchaseReportPage'))

// Administration
const UsersPage           = React.lazy(() => import('@/pages/users/UsersPage'))
const RolesPage           = React.lazy(() => import('@/pages/roles/RolesPage'))
const PermissionsPage     = React.lazy(() => import('@/pages/permissions/PermissionsPage'))
const ActivityLogsPage    = React.lazy(() => import('@/pages/logs/ActivityLogsPage'))
const RecycleBinPage      = React.lazy(() => import('@/pages/recycle-bin/RecycleBinPage'))

// Settings / Reviews
const SettingsPage        = React.lazy(() => import('@/pages/settings/SettingsPage'))
const UnitsPage           = React.lazy(() => import('@/pages/settings/UnitsPage'))
const ReviewsPage         = React.lazy(() => import('@/pages/reviews/ReviewsPage'))
const ProfilePage         = React.lazy(() => import('@/pages/profile/ProfilePage'))

// Security & Devices
const SecurityOverviewDashboard = React.lazy(() => import('@/pages/security/SecurityOverviewDashboard'))
const DeviceManagementPage      = React.lazy(() => import('@/pages/security/DeviceManagementPage'))
const SecuritySettingsPage      = React.lazy(() => import('@/pages/security/SecuritySettingsPage'))

// Notifications
const NotificationListPage        = React.lazy(() => import('@/pages/notifications/NotificationListPage'))
const NotificationTemplateListPage = React.lazy(() => import('@/pages/notifications/NotificationTemplateListPage'))
const NotificationSettingsPage    = React.lazy(() => import('@/pages/notifications/NotificationSettingsPage'))

// AI Chatbot
const ChatbotManagementPage       = React.lazy(() => import('@/pages/chatbot/ChatbotManagementPage'))

// ─── Query Client ────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            5 * 60 * 1000,
      retry:                1,
      refetchOnWindowFocus: false,
    },
  },
})

// ─── Route Guards ────────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: React.ReactNode
  permission?: string | string[]
  role?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission, role }) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const hasRole = useAuthStore((s) => s.hasRole)
  const hasPermission = useAuthStore((s) => s.hasPermission)

  if (!isLoggedIn) return <Navigate to="/login" replace />

  if (role && !hasRole(role)) {
    return <AccessDeniedPage />
  }

  if (permission && !hasPermission(permission)) {
    return <AccessDeniedPage />
  }

  return <>{children}</>
}

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  if (isLoggedIn) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

const PageFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
)

// ─── AppContent & App ─────────────────────────────────────────────────────────

const AppContent: React.FC = () => {
  return (
    <div className="h-full">
      <NetworkStatusListener />
      <ToastContainer />
      <React.Suspense fallback={<PageFallback />}>
        <Routes>

          {/* ── Public ──────────────────────────────────────────────────── */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/"              element={<Navigate to="/dashboard" replace />} />

          {/* ── Protected ───────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>

            {/* Dashboard */}
            <Route path="/dashboard"               element={<DashboardPage />} />

            {/* ── Products ──────────────────────────────────────────────── */}
            <Route path="/products"                element={<ProtectedRoute permission={['products.view', 'product.view']}><ProductsPage /></ProtectedRoute>} />
            <Route path="/products/create"         element={<ProtectedRoute permission={['products.create', 'product.create']}><ProductFormPage /></ProtectedRoute>} />
            <Route path="/products/:id/edit"       element={<ProtectedRoute permission={['products.edit', 'product.update', 'product.edit']}><ProductFormPage /></ProtectedRoute>} />
            <Route path="/products/edit/:id"       element={<ProtectedRoute permission={['products.edit', 'product.update', 'product.edit']}><ProductFormPage /></ProtectedRoute>} />
            <Route path="/categories"              element={<ProtectedRoute permission={['categories.view', 'category.view']}><CategoriesPage /></ProtectedRoute>} />
            <Route path="/brands"                  element={<ProtectedRoute permission={['brands.view', 'brand.view']}><BrandsPage /></ProtectedRoute>} />
            <Route path="/units"                   element={<ProtectedRoute permission={['units.view', 'unit.view']}><UnitsPage /></ProtectedRoute>} />
            <Route path="/taxes"                   element={<ProtectedRoute permission={['taxes.view', 'tax.view']}><TaxesPage /></ProtectedRoute>} />
            <Route path="/attributes"              element={<ProtectedRoute permission={['attributes.view', 'attribute.view']}><AttributesPage /></ProtectedRoute>} />

            {/* ── Inventory ─────────────────────────────────────────────── */}
            <Route path="/inventory"               element={<ProtectedRoute permission="inventory.view"><InventoryPage /></ProtectedRoute>} />
            <Route path="/inventory/adjustments"   element={<ProtectedRoute permission="inventory.view"><InventoryPage tab="adjustments" /></ProtectedRoute>} />
            <Route path="/inventory/transfers"     element={<ProtectedRoute permission="inventory.view"><InventoryPage tab="transfers" /></ProtectedRoute>} />
            <Route path="/inventory/opnames"       element={<ProtectedRoute permission="inventory.view"><InventoryPage tab="opnames" /></ProtectedRoute>} />
            <Route path="/inventory/movements"     element={<ProtectedRoute permission="inventory.view"><InventoryPage tab="movements" /></ProtectedRoute>} />
            <Route path="/warehouses"              element={<ProtectedRoute permission="inventory.view"><CompanyPage activeTab="warehouses" /></ProtectedRoute>} />

            {/* ── Sales ─────────────────────────────────────────────────── */}
            <Route path="/pos"                     element={<ProtectedRoute permission="pos.access"><POSPage /></ProtectedRoute>} />
            <Route path="/sales"                   element={<ProtectedRoute permission="sales.view"><SalesPage /></ProtectedRoute>} />
            <Route path="/orders"                  element={<ProtectedRoute permission="orders.view"><OrdersPage /></ProtectedRoute>} />

            {/* ── Purchases ─────────────────────────────────────────────── */}
            <Route path="/purchases"               element={<ProtectedRoute permission="purchases.view"><PurchasesPage /></ProtectedRoute>} />
            <Route path="/purchases/create"        element={<ProtectedRoute permission="purchases.create"><PurchasesPage /></ProtectedRoute>} />
            <Route path="/purchases/:id/edit"      element={<ProtectedRoute permission="purchases.edit"><PurchasesPage /></ProtectedRoute>} />
            <Route path="/purchases/returns"       element={<ProtectedRoute permission="purchases.view"><PurchaseReturnsPage /></ProtectedRoute>} />
            <Route path="/suppliers"               element={<ProtectedRoute permission="suppliers.view"><SuppliersPage /></ProtectedRoute>} />
            <Route path="/suppliers/create"        element={<ProtectedRoute permission="suppliers.create"><SupplierFormPage /></ProtectedRoute>} />
            <Route path="/suppliers/:id/edit"      element={<ProtectedRoute permission="suppliers.edit"><SupplierFormPage /></ProtectedRoute>} />
            <Route path="/suppliers/edit/:id"      element={<ProtectedRoute permission="suppliers.edit"><SupplierFormPage /></ProtectedRoute>} />

            {/* ── Customers ─────────────────────────────────────────────── */}
            <Route path="/customers"               element={<ProtectedRoute permission="customers.view"><CustomersPage /></ProtectedRoute>} />
            <Route path="/customers/create"        element={<ProtectedRoute permission="customers.create"><CustomerFormPage /></ProtectedRoute>} />
            <Route path="/customers/:id/edit"      element={<ProtectedRoute permission="customers.edit"><CustomerFormPage /></ProtectedRoute>} />
            <Route path="/customers/edit/:id"      element={<ProtectedRoute permission="customers.edit"><CustomerFormPage /></ProtectedRoute>} />
            <Route path="/customers/groups"        element={<ProtectedRoute permission="customers.view"><CustomerGroupsPage /></ProtectedRoute>} />

            {/* ── Employees ─────────────────────────────────────────────── */}
            <Route path="/employees"               element={<ProtectedRoute permission="employees.view"><EmployeesPage /></ProtectedRoute>} />
            <Route path="/employees/create"        element={<ProtectedRoute permission="employees.create"><EmployeeFormPage /></ProtectedRoute>} />
            <Route path="/employees/:id/edit"      element={<ProtectedRoute permission="employees.edit"><EmployeeFormPage /></ProtectedRoute>} />
            <Route path="/employees/edit/:id"      element={<ProtectedRoute permission="employees.edit"><EmployeeFormPage /></ProtectedRoute>} />

            {/* ── Marketing ─────────────────────────────────────────────── */}
            <Route path="/marketing"               element={<ProtectedRoute permission="promotions.view"><PromotionsPage /></ProtectedRoute>} />
            <Route path="/marketing/promotions"    element={<ProtectedRoute permission="promotions.view"><PromotionsPage /></ProtectedRoute>} />
            <Route path="/marketing/coupons"       element={<ProtectedRoute permission="coupons.view"><CouponsPage /></ProtectedRoute>} />
            <Route path="/marketing/flash-sales"   element={<ProtectedRoute permission="flash_sales.view"><FlashSalesPage /></ProtectedRoute>} />
            <Route path="/marketing/banners"       element={<ProtectedRoute permission="banners.view"><BannersPage /></ProtectedRoute>} />

            {/* ── CMS ───────────────────────────────────────────────────── */}
            <Route path="/cms"                     element={<ProtectedRoute permission="cms.view"><CMSPage /></ProtectedRoute>} />

            {/* ── Shipping ──────────────────────────────────────────────── */}
            <Route path="/shipping"                element={<ProtectedRoute permission="shipping.view"><ShippingPage /></ProtectedRoute>} />

            {/* ── Finance ───────────────────────────────────────────────── */}
            <Route path="/expenses"                element={<ProtectedRoute permission="expenses.view"><FinancePage /></ProtectedRoute>} />
            <Route path="/expenses/create"         element={<ProtectedRoute permission="expenses.create"><ExpenseFormPage /></ProtectedRoute>} />
            <Route path="/expenses/:id/edit"       element={<ProtectedRoute permission="expenses.edit"><ExpenseFormPage /></ProtectedRoute>} />
            <Route path="/expenses/edit/:id"       element={<ProtectedRoute permission="expenses.edit"><ExpenseFormPage /></ProtectedRoute>} />
            <Route path="/payments/methods"        element={<ProtectedRoute permission="payments.view"><PaymentMethodsPage /></ProtectedRoute>} />
            <Route path="/payments/transactions"   element={<ProtectedRoute permission="payments.view"><TransactionsPage /></ProtectedRoute>} />
            <Route path="/finance"                 element={<ProtectedRoute permission="finance.view"><FinancePage /></ProtectedRoute>} />

            {/* ── Company ───────────────────────────────────────────────── */}
            <Route path="/branches"                element={<ProtectedRoute permission="company.view"><CompanyPage activeTab="branches" /></ProtectedRoute>} />
            <Route path="/stores"                  element={<ProtectedRoute permission="company.view"><CompanyPage activeTab="stores" /></ProtectedRoute>} />
            <Route path="/company"                 element={<ProtectedRoute permission="company.view"><CompanyPage activeTab="companies" /></ProtectedRoute>} />

            {/* ── Reports ───────────────────────────────────────────────── */}
            <Route path="/reports"                 element={<ProtectedRoute permission="reports.view"><ReportsPage type="sales" /></ProtectedRoute>} />
            <Route path="/reports/sales"           element={<ProtectedRoute permission="reports.view"><SalesReportPage /></ProtectedRoute>} />
            <Route path="/reports/purchase"        element={<ProtectedRoute permission="reports.view"><PurchaseReportPage /></ProtectedRoute>} />
            <Route path="/reports/purchases"       element={<ProtectedRoute permission="reports.view"><PurchaseReportPage /></ProtectedRoute>} />
            <Route path="/reports/inventory"       element={<ProtectedRoute permission="reports.view"><ReportsPage type="inventory" /></ProtectedRoute>} />
            <Route path="/reports/profit-loss"     element={<ProtectedRoute permission="reports.view"><ReportsPage type="profit-loss" /></ProtectedRoute>} />

            {/* ── Administration ────────────────────────────────────────── */}
            <Route path="/users"                   element={<ProtectedRoute permission="user.view"><UsersPage /></ProtectedRoute>} />
            <Route path="/roles"                   element={<ProtectedRoute permission="role.view"><RolesPage /></ProtectedRoute>} />
            <Route path="/permissions"             element={<ProtectedRoute permission="permission.view"><PermissionsPage /></ProtectedRoute>} />
            <Route path="/activity-logs"           element={<ProtectedRoute permission="activity_log.view"><ActivityLogsPage /></ProtectedRoute>} />
            <Route path="/recycle-bin"             element={<ProtectedRoute permission="activity_log.view"><RecycleBinPage /></ProtectedRoute>} />

            {/* ── Notifications ────────────────────────────────────────── */}
            <Route path="/notifications"            element={<ProtectedRoute permission="notification.view"><NotificationListPage /></ProtectedRoute>} />
            <Route path="/notification-templates"   element={<ProtectedRoute permission="notification.template.view"><NotificationTemplateListPage /></ProtectedRoute>} />
            <Route path="/notifications/settings"  element={<ProtectedRoute permission="notification.view"><NotificationSettingsPage /></ProtectedRoute>} />

            {/* ── AI Chatbot & Telegram ──────────────────────────────────── */}
            <Route path="/chatbot"                  element={<ProtectedRoute><ChatbotManagementPage /></ProtectedRoute>} />


            {/* ── Security & Devices ────────────────────────────────────── */}
            <Route path="/security"                element={<ProtectedRoute><SecurityOverviewDashboard /></ProtectedRoute>} />
            <Route path="/security/overview"       element={<ProtectedRoute><SecurityOverviewDashboard /></ProtectedRoute>} />
            <Route path="/security/devices"        element={<ProtectedRoute><DeviceManagementPage /></ProtectedRoute>} />
            <Route path="/security/settings"       element={<ProtectedRoute permission="settings.view"><SecuritySettingsPage /></ProtectedRoute>} />

            {/* ── Settings / Reviews ────────────────────────────────────── */}
            <Route path="/settings"                element={<ProtectedRoute permission="settings.view"><SettingsPage /></ProtectedRoute>} />
            <Route path="/reviews"                 element={<ProtectedRoute permission="reviews.view"><ReviewsPage /></ProtectedRoute>} />
            <Route path="/profile"                 element={<ProfilePage />} />

            {/* ── Fallback ──────────────────────────────────────────────── */}
            <Route path="*"                        element={<Navigate to="/dashboard" replace />} />

          </Route>
        </Routes>
      </React.Suspense>
    </div>
  )
}

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeSynchronizer />
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </QueryClientProvider>
)

export default App
