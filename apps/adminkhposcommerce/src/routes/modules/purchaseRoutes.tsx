import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const PurchasesPage = React.lazy(() => import('@/pages/purchases/PurchasesPage'))
const PurchaseReturnsPage = React.lazy(() => import('@/pages/purchases/PurchaseReturnsPage'))
const PurchaseReturnFormPage = React.lazy(() => import('@/pages/purchases/PurchaseReturnFormPage'))
const SuppliersPage = React.lazy(() => import('@/pages/suppliers/SuppliersPage'))
const SupplierFormPage = React.lazy(() => import('@/pages/suppliers/SupplierFormPage'))

export const purchaseRoutes = (
  <React.Fragment>
    <Route path="/purchases" element={<ProtectedRoute permission="purchases.view"><PurchasesPage /></ProtectedRoute>} />
    <Route path="/purchases/create" element={<ProtectedRoute permission="purchases.create"><PurchasesPage /></ProtectedRoute>} />
    <Route path="/purchases/:id/edit" element={<ProtectedRoute permission="purchases.edit"><PurchasesPage /></ProtectedRoute>} />
    <Route path="/purchases/returns" element={<ProtectedRoute permission="purchases.view"><PurchaseReturnsPage /></ProtectedRoute>} />
    <Route path="/purchases/returns/create" element={<ProtectedRoute permission="purchases.create"><PurchaseReturnFormPage /></ProtectedRoute>} />
    <Route path="/purchases/returns/:id/edit" element={<ProtectedRoute permission="purchases.edit"><PurchaseReturnFormPage /></ProtectedRoute>} />
    <Route path="/suppliers" element={<ProtectedRoute permission="suppliers.view"><SuppliersPage /></ProtectedRoute>} />
    <Route path="/suppliers/create" element={<ProtectedRoute permission="suppliers.create"><SupplierFormPage /></ProtectedRoute>} />
    <Route path="/suppliers/:id/edit" element={<ProtectedRoute permission="suppliers.edit"><SupplierFormPage /></ProtectedRoute>} />
    <Route path="/suppliers/edit/:id" element={<ProtectedRoute permission="suppliers.edit"><SupplierFormPage /></ProtectedRoute>} />
  </React.Fragment>
)
