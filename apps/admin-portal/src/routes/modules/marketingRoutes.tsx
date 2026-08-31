import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const PromotionsPage = React.lazy(() => import('@/pages/marketing/PromotionsPage'))
const CouponsPage = React.lazy(() => import('@/pages/marketing/CouponsPage'))
const FlashSalesPage = React.lazy(() => import('@/pages/marketing/FlashSalesPage'))
const BannersPage = React.lazy(() => import('@/pages/marketing/BannersPage'))
const BannerFormPage = React.lazy(() => import('@/pages/marketing/BannerFormPage'))

export const marketingRoutes = (
  <React.Fragment>
    <Route path="/marketing" element={<ProtectedRoute permission="promotions.view"><PromotionsPage /></ProtectedRoute>} />
    <Route path="/marketing/promotions" element={<ProtectedRoute permission="promotions.view"><PromotionsPage /></ProtectedRoute>} />
    <Route path="/marketing/coupons" element={<ProtectedRoute permission="coupons.view"><CouponsPage /></ProtectedRoute>} />
    <Route path="/marketing/flash-sales" element={<ProtectedRoute permission="flash_sales.view"><FlashSalesPage /></ProtectedRoute>} />
    <Route path="/marketing/banners" element={<ProtectedRoute permission="banners.view"><BannersPage /></ProtectedRoute>} />
    <Route path="/marketing/banners/create" element={<ProtectedRoute permission="banners.create"><BannerFormPage /></ProtectedRoute>} />
    <Route path="/marketing/banners/:id/edit" element={<ProtectedRoute permission="banners.edit"><BannerFormPage /></ProtectedRoute>} />
    <Route path="/marketing/banners/edit/:id" element={<ProtectedRoute permission="banners.edit"><BannerFormPage /></ProtectedRoute>} />
  </React.Fragment>
)
