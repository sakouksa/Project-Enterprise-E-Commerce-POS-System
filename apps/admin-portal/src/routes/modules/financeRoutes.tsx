import React from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '../guards/ProtectedRoute'

const FinancePage = React.lazy(() => import('@/pages/finance/FinancePage'))
const ExpenseFormPage = React.lazy(() => import('@/pages/finance/ExpenseFormPage'))
const PaymentMethodsPage = React.lazy(() => import('@/pages/payments/PaymentMethodsPage'))
const TransactionsPage = React.lazy(() => import('@/pages/payments/TransactionsPage'))

export const financeRoutes = (
  <React.Fragment>
    <Route path="/expenses" element={<ProtectedRoute permission="expenses.view"><FinancePage /></ProtectedRoute>} />
    <Route path="/expenses/create" element={<ProtectedRoute permission="expenses.create"><ExpenseFormPage /></ProtectedRoute>} />
    <Route path="/expenses/:id/edit" element={<ProtectedRoute permission="expenses.edit"><ExpenseFormPage /></ProtectedRoute>} />
    <Route path="/expenses/edit/:id" element={<ProtectedRoute permission="expenses.edit"><ExpenseFormPage /></ProtectedRoute>} />
    <Route path="/payments/methods" element={<ProtectedRoute permission="payments.view"><PaymentMethodsPage /></ProtectedRoute>} />
    <Route path="/payments/transactions" element={<ProtectedRoute permission="payments.view"><TransactionsPage /></ProtectedRoute>} />
    <Route path="/finance" element={<ProtectedRoute permission="finance.view"><FinancePage /></ProtectedRoute>} />
  </React.Fragment>
)
