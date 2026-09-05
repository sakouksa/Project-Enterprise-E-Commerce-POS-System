import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const InventoryPage = React.lazy(() => import('@/pages/inventory/InventoryPage'))
const StockAdjustmentForm = React.lazy(() => import('@/pages/inventory/components/StockAdjustmentForm'))
const StockTransferForm = React.lazy(() => import('@/pages/inventory/components/StockTransferForm'))
const StockOpnameForm = React.lazy(() => import('@/pages/inventory/components/StockOpnameForm'))
const CompanyPage = React.lazy(() => import('@/pages/company/CompanyPage'))

export const inventoryRoutes = (
  <React.Fragment>
    <Route path="/inventory" element={<ProtectedRoute permission="inventory.view"><InventoryPage /></ProtectedRoute>} />
    <Route path="/inventory/adjustments" element={<ProtectedRoute permission="inventory.view"><InventoryPage tab="adjustments" /></ProtectedRoute>} />
    <Route path="/inventory/adjustments/create" element={<ProtectedRoute permission="inventory.create"><StockAdjustmentForm /></ProtectedRoute>} />
    <Route path="/inventory/adjustments/:id/edit" element={<ProtectedRoute permission="inventory.edit"><StockAdjustmentForm /></ProtectedRoute>} />
    <Route path="/inventory/adjustments/edit/:id" element={<ProtectedRoute permission="inventory.edit"><StockAdjustmentForm /></ProtectedRoute>} />
    <Route path="/inventory/transfers" element={<ProtectedRoute permission="inventory.view"><InventoryPage tab="transfers" /></ProtectedRoute>} />
    <Route path="/inventory/transfers/create" element={<ProtectedRoute permission="inventory.create"><StockTransferForm /></ProtectedRoute>} />
    <Route path="/inventory/transfers/:id/edit" element={<ProtectedRoute permission="inventory.edit"><StockTransferForm /></ProtectedRoute>} />
    <Route path="/inventory/transfers/edit/:id" element={<ProtectedRoute permission="inventory.edit"><StockTransferForm /></ProtectedRoute>} />
    <Route path="/inventory/opnames" element={<ProtectedRoute permission="inventory.view"><InventoryPage tab="opnames" /></ProtectedRoute>} />
    <Route path="/inventory/opnames/create" element={<ProtectedRoute permission="inventory.create"><StockOpnameForm /></ProtectedRoute>} />
    <Route path="/inventory/opnames/:id/edit" element={<ProtectedRoute permission="inventory.edit"><StockOpnameForm /></ProtectedRoute>} />
    <Route path="/inventory/opnames/edit/:id" element={<ProtectedRoute permission="inventory.edit"><StockOpnameForm /></ProtectedRoute>} />
    <Route path="/inventory/movements" element={<ProtectedRoute permission="inventory.view"><InventoryPage tab="movements" /></ProtectedRoute>} />
    <Route path="/warehouses" element={<ProtectedRoute permission="inventory.view"><CompanyPage activeTab="warehouses" /></ProtectedRoute>} />
  </React.Fragment>
)
