import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { PageFallback } from './components/PageFallback'

import { authRoutes } from './modules/authRoutes'
import { dashboardRoutes } from './modules/dashboardRoutes'
import { productRoutes } from './modules/productRoutes'
import { inventoryRoutes } from './modules/inventoryRoutes'
import { salesRoutes } from './modules/salesRoutes'
import { purchaseRoutes } from './modules/purchaseRoutes'
import { customerRoutes } from './modules/customerRoutes'
import { employeeRoutes } from './modules/employeeRoutes'
import { marketingRoutes } from './modules/marketingRoutes'
import { cmsRoutes } from './modules/cmsRoutes'
import { shippingRoutes } from './modules/shippingRoutes'
import { financeRoutes } from './modules/financeRoutes'
import { companyRoutes } from './modules/companyRoutes'
import { reportRoutes } from './modules/reportRoutes'
import { adminRoutes } from './modules/adminRoutes'
import { notificationRoutes } from './modules/notificationRoutes'
import { chatbotRoutes } from './modules/chatbotRoutes'
import { securityRoutes } from './modules/securityRoutes'
import { settingsRoutes } from './modules/settingsRoutes'

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* ── Public Routes ─────────────────────────────────────────────────── */}
        {authRoutes}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── Protected Admin Layout ────────────────────────────────────────── */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          {dashboardRoutes}
          {productRoutes}
          {inventoryRoutes}
          {salesRoutes}
          {purchaseRoutes}
          {customerRoutes}
          {employeeRoutes}
          {marketingRoutes}
          {cmsRoutes}
          {shippingRoutes}
          {financeRoutes}
          {companyRoutes}
          {reportRoutes}
          {adminRoutes}
          {notificationRoutes}
          {chatbotRoutes}
          {securityRoutes}
          {settingsRoutes}

          {/* ── Wildcard Fallback ───────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
