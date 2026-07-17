import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminLayout from '@/components/layout/AdminLayout'   // ← canonical grouped layout
import { useAuthStore } from '@/stores/authStore'
import ToastContainer from '@/components/ui/ToastContainer'
import ThemeSynchronizer from '@/components/shared/ThemeSynchronizer'

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

// Customers
const CustomersPage       = React.lazy(() => import('@/pages/customers/CustomersPage'))
const CustomerGroupsPage  = React.lazy(() => import('@/pages/customers/CustomerGroupsPage'))

// Employees
const EmployeesPage       = React.lazy(() => import('@/pages/employees/EmployeesPage'))

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
const FinancePage         = React.lazy(() => import('@/pages/finance/FinancePage'))
const PaymentMethodsPage  = React.lazy(() => import('@/pages/payments/PaymentMethodsPage'))
const TransactionsPage    = React.lazy(() => import('@/pages/payments/TransactionsPage'))

// Company
const CompanyPage         = React.lazy(() => import('@/pages/company/CompanyPage'))
const BranchesPage        = React.lazy(() => import('@/pages/company/BranchesPage'))
const StoresPage          = React.lazy(() => import('@/pages/company/StoresPage'))
const WarehousesPage      = React.lazy(() => import('@/pages/company/WarehousesPage'))

// Reports
const ReportsPage         = React.lazy(() => import('@/pages/reports/ReportsPage'))

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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  if (isLoggedIn) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

const PageFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex gap-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce"
             style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  </div>
)

// ─── App ─────────────────────────────────────────────────────────────────────

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeSynchronizer />
    <BrowserRouter>
      <ToastContainer />
      <React.Suspense fallback={<PageFallback />}>
        <Routes>

          {/* ── Public ──────────────────────────────────────────────────── */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/"      element={<Navigate to="/dashboard" replace />} />

          {/* ── Protected ───────────────────────────────────────────────── */}
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>

            {/* Dashboard */}
            <Route path="/dashboard"               element={<DashboardPage />} />

            {/* ── Products ──────────────────────────────────────────────── */}
            <Route path="/products"                element={<ProductsPage />} />
            <Route path="/products/create"         element={<ProductFormPage />} />
            <Route path="/products/:id/edit"       element={<ProductFormPage />} />
            <Route path="/categories"              element={<CategoriesPage />} />
            <Route path="/brands"                  element={<BrandsPage />} />
            <Route path="/units"                   element={<UnitsPage />} />
            <Route path="/attributes"              element={<AttributesPage />} />

            {/* ── Inventory ─────────────────────────────────────────────── */}
            <Route path="/inventory"               element={<InventoryPage />} />
            <Route path="/inventory/adjustments"   element={<InventoryPage tab="adjustments" />} />
            <Route path="/inventory/transfers"     element={<InventoryPage tab="transfers" />} />
            <Route path="/inventory/opnames"       element={<InventoryPage tab="opnames" />} />
            <Route path="/inventory/movements"     element={<InventoryPage tab="movements" />} />
            <Route path="/warehouses"              element={<CompanyPage activeTab="warehouses" />} />

            {/* ── Sales ─────────────────────────────────────────────────── */}
            <Route path="/pos"                     element={<POSPage />} />
            <Route path="/sales"                   element={<SalesPage />} />
            <Route path="/orders"                  element={<OrdersPage />} />

            {/* ── Purchases ─────────────────────────────────────────────── */}
            <Route path="/purchases"               element={<PurchasesPage />} />
            <Route path="/purchases/returns"       element={<PurchaseReturnsPage />} />
            <Route path="/suppliers"               element={<SuppliersPage />} />

            {/* ── Customers ─────────────────────────────────────────────── */}
            <Route path="/customers"               element={<CustomersPage />} />
            <Route path="/customers/groups"        element={<CustomerGroupsPage />} />

            {/* ── Employees ─────────────────────────────────────────────── */}
            <Route path="/employees"               element={<EmployeesPage />} />

            {/* ── Marketing ─────────────────────────────────────────────── */}
            <Route path="/marketing"               element={<PromotionsPage />} />
            <Route path="/marketing/promotions"    element={<PromotionsPage />} />
            <Route path="/marketing/coupons"       element={<CouponsPage />} />
            <Route path="/marketing/flash-sales"   element={<FlashSalesPage />} />
            <Route path="/marketing/banners"       element={<BannersPage />} />

            {/* ── CMS ───────────────────────────────────────────────────── */}
            <Route path="/cms"                     element={<CMSPage />} />

            {/* ── Shipping ──────────────────────────────────────────────── */}
            <Route path="/shipping"                element={<ShippingPage />} />

            {/* ── Finance ───────────────────────────────────────────────── */}
            <Route path="/expenses"                element={<FinancePage />} />
            <Route path="/payments/methods"        element={<PaymentMethodsPage />} />
            <Route path="/payments/transactions"   element={<TransactionsPage />} />
            <Route path="/finance"                 element={<FinancePage />} />

            {/* ── Company ───────────────────────────────────────────────── */}
            <Route path="/branches"                element={<CompanyPage activeTab="branches" />} />
            <Route path="/stores"                  element={<CompanyPage activeTab="stores" />} />
            <Route path="/company"                 element={<CompanyPage activeTab="profile" />} />

            {/* ── Reports ───────────────────────────────────────────────── */}
            <Route path="/reports"                 element={<ReportsPage type="sales" />} />
            <Route path="/reports/sales"           element={<ReportsPage type="sales" />} />
            <Route path="/reports/inventory"       element={<ReportsPage type="inventory" />} />
            <Route path="/reports/profit-loss"     element={<ReportsPage type="profit-loss" />} />

            {/* ── Administration ────────────────────────────────────────── */}
            <Route path="/users"                   element={<UsersPage />} />
            <Route path="/roles"                   element={<RolesPage />} />
            <Route path="/permissions"             element={<PermissionsPage />} />
            <Route path="/activity-logs"           element={<ActivityLogsPage />} />
            <Route path="/recycle-bin"             element={<RecycleBinPage />} />

            {/* ── Settings / Reviews ────────────────────────────────────── */}
            <Route path="/settings"                element={<SettingsPage />} />
            <Route path="/reviews"                 element={<ReviewsPage />} />
            <Route path="/profile"                 element={<ProfilePage />} />

            {/* ── Fallback ──────────────────────────────────────────────── */}
            <Route path="*"                        element={<Navigate to="/dashboard" replace />} />

          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </QueryClientProvider>
)

export default App
