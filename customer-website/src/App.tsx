import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSettingsStore } from '@/stores'
import StorefrontLayout from '@/layouts/StorefrontLayout'
import AccountLayout   from '@/layouts/AccountLayout'
import AuthLayout      from '@/layouts/AuthLayout'
import { useAuthStore } from '@/stores'
import Spinner         from '@/components/ui/Spinner'

// ─── Lazy Pages ──────────────────────────────────────────────────────────────

// Public pages
const HomePage           = React.lazy(() => import('@/pages/HomePage'))
const ProductListPage    = React.lazy(() => import('@/pages/ProductListPage'))
const ProductDetailPage  = React.lazy(() => import('@/pages/ProductDetailPage'))
const SearchPage         = React.lazy(() => import('@/pages/SearchPage'))
const CartPage           = React.lazy(() => import('@/pages/CartPage'))
const CheckoutPage       = React.lazy(() => import('@/pages/CheckoutPage'))
const CheckoutSuccess    = React.lazy(() => import('@/pages/CheckoutSuccessPage'))
const CheckoutFailed     = React.lazy(() => import('@/pages/CheckoutFailedPage'))
const TrackOrderPage     = React.lazy(() => import('@/pages/TrackOrderPage'))
const BlogPage           = React.lazy(() => import('@/pages/BlogPage'))
const BlogDetailPage     = React.lazy(() => import('@/pages/BlogDetailPage'))
const AboutPage          = React.lazy(() => import('@/pages/AboutPage'))
const ContactPage        = React.lazy(() => import('@/pages/ContactPage'))
const FAQPage            = React.lazy(() => import('@/pages/FAQPage'))
const WishlistPage       = React.lazy(() => import('@/pages/WishlistPage'))

// Auth pages
const LoginPage          = React.lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage       = React.lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage  = React.lazy(() => import('@/pages/auth/ResetPasswordPage'))

// Account pages
const AccountDashboard   = React.lazy(() => import('@/pages/account/DashboardPage'))
const AccountProfile     = React.lazy(() => import('@/pages/account/ProfilePage'))
const AccountOrders      = React.lazy(() => import('@/pages/account/OrdersPage'))
const AccountOrderDetail = React.lazy(() => import('@/pages/account/OrderDetailPage'))
const AccountAddresses   = React.lazy(() => import('@/pages/account/AddressesPage'))
const AccountWishlist    = React.lazy(() => import('@/pages/WishlistPage'))
const AccountReviews     = React.lazy(() => import('@/pages/account/ReviewsPage'))
const AccountSettings    = React.lazy(() => import('@/pages/account/SettingsPage'))

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
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  if (!isLoggedIn) return <Navigate to="/auth/login" replace />
  return <>{children}</>
}

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  if (isLoggedIn) return <Navigate to="/account" replace />
  return <>{children}</>
}

// ─── Page Fallback ───────────────────────────────────────────────────────────

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
)

// ─── Theme Sync ───────────────────────────────────────────────────────────────

const ThemeSync: React.FC = () => {
  const { theme } = useSettingsStore()

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
  }, [theme])

  return null
}

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeSync />
        <Suspense fallback={<PageFallback />}>
          <Routes>

            {/* ── Storefront (public) ─────────────────────────────────── */}
            <Route element={<StorefrontLayout />}>
              <Route path="/"                  element={<HomePage />} />
              <Route path="/products"          element={<ProductListPage />} />
              <Route path="/products/:slug"    element={<ProductDetailPage />} />
              <Route path="/category/:slug"    element={<ProductListPage />} />
              <Route path="/brand/:slug"       element={<ProductListPage />} />
              <Route path="/search"            element={<SearchPage />} />
              <Route path="/cart"              element={<CartPage />} />
              <Route path="/wishlist"          element={<WishlistPage />} />
              <Route path="/track"             element={<TrackOrderPage />} />
              <Route path="/blog"              element={<BlogPage />} />
              <Route path="/blog/:slug"        element={<BlogDetailPage />} />
              <Route path="/about"             element={<AboutPage />} />
              <Route path="/contact"           element={<ContactPage />} />
              <Route path="/faq"               element={<FAQPage />} />

              {/* Checkout */}
              <Route path="/checkout"          element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/checkout/success"  element={<CheckoutSuccess />} />
              <Route path="/checkout/failed"   element={<CheckoutFailed />} />
            </Route>

            {/* ── Auth ────────────────────────────────────────────────── */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login"          element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/auth/register"       element={<GuestRoute><RegisterPage /></GuestRoute>} />
              <Route path="/auth/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
              <Route path="/auth/reset-password"  element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
            </Route>

            {/* ── Customer Account ─────────────────────────────────────── */}
            <Route element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
              <Route path="/account"                 element={<AccountDashboard />} />
              <Route path="/account/profile"         element={<AccountProfile />} />
              <Route path="/account/orders"          element={<AccountOrders />} />
              <Route path="/account/orders/:number"  element={<AccountOrderDetail />} />
              <Route path="/account/addresses"       element={<AccountAddresses />} />
              <Route path="/account/wishlist"        element={<AccountWishlist />} />
              <Route path="/account/reviews"         element={<AccountReviews />} />
              <Route path="/account/settings"        element={<AccountSettings />} />
            </Route>

            {/* ── Fallback ─────────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
