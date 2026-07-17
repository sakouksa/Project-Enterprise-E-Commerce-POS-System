import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Loader2, DollarSign, Wallet, ShieldAlert, Sparkles, Receipt, Landmark, CreditCard } from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import {
  Breadcrumb, PageHeader, SearchFilter, DataTable,
  FormDrawer, StatusBadge, LoadingSpinner
} from '@/components/common'

import TransactionsPage from '../payments/TransactionsPage'
import PaymentMethodsPage from '../payments/PaymentMethodsPage'

type TabType = 'expenses' | 'categories' | 'registers' | 'transactions' | 'payment_methods' | 'currencies' | 'taxes'

const FinancePage: React.FC = () => {
  const qc = useQueryClient()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as TabType) || 'expenses'
  const setActiveTab = (tab: TabType) => setSearchParams({ tab })
  const [search, setSearch] = useState('')

  // Drawer & form states
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Specific Forms
  const [expenseForm, setExpenseForm] = useState({ category_id: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' })
  const [categoryForm, setCategoryForm] = useState({ name: '', code: '', description: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', status: 'closed', balance: '0' })
  const [currencyForm, setCurrencyForm] = useState({ name: '', code: '', symbol: '', exchange_rate: '1.00', is_active: true })
  const [taxForm, setTaxForm] = useState({ name: '', rate: '', description: '', is_active: true })

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data: expenses, isLoading: loadingExpenses } = useQuery({
    queryKey: ['expenses-tab', search],
    queryFn: () => api.get('/expenses', { params: { search, per_page: 100 } }).then(r => r.data.data ?? []),
    enabled: activeTab === 'expenses',
  })

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['expense-categories-tab', search],
    queryFn: () => api.get('/expense-categories', { params: { search, per_page: 100 } }).then(r => r.data.data ?? []),
    enabled: activeTab === 'categories' || activeTab === 'expenses',
  })

  const { data: registers, isLoading: loadingRegisters } = useQuery({
    queryKey: ['cash-registers-tab', search],
    queryFn: () => api.get('/pos/cash-registers', { params: { search, per_page: 100 } }).then(r => r.data.data ?? []),
    enabled: activeTab === 'registers',
  })

  const { data: currencies, isLoading: loadingCurrencies } = useQuery({
    queryKey: ['currencies-tab', search],
    queryFn: () => api.get('/currencies', { params: { search, per_page: 100 } }).then(r => r.data.data ?? []),
    enabled: activeTab === 'currencies',
  })

  const { data: taxes, isLoading: loadingTaxes } = useQuery({
    queryKey: ['taxes-tab', search],
    queryFn: () => api.get('/taxes', { params: { search, per_page: 100 } }).then(r => r.data.data ?? []),
    enabled: activeTab === 'taxes',
  })

  // ─── Mutations ────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      const endpoint =
        activeTab === 'expenses' ? '/expenses' :
        activeTab === 'categories' ? '/expense-categories' :
        activeTab === 'registers' ? '/pos/cash-registers' :
        activeTab === 'currencies' ? '/currencies' : '/taxes'

      if (editingItem) {
        return api.put(`${endpoint}/${editingItem.id}`, payload)
      } else {
        return api.post(endpoint, { ...payload, company_id: 1 })
      }
    },
    onSuccess: () => {
      const key =
        activeTab === 'expenses' ? 'expenses-tab' :
        activeTab === 'categories' ? 'expense-categories-tab' :
        activeTab === 'registers' ? 'cash-registers-tab' :
        activeTab === 'currencies' ? 'currencies-tab' : 'taxes-tab'

      qc.invalidateQueries({ queryKey: [key] })
      toast.success(editingItem ? 'Updated successfully.' : 'Created successfully.')
      closeDrawer()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to save transaction details.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      const endpoint =
        activeTab === 'expenses' ? '/expenses' :
        activeTab === 'categories' ? '/expense-categories' :
        activeTab === 'registers' ? '/pos/cash-registers' :
        activeTab === 'currencies' ? '/currencies' : '/taxes'
      return api.delete(`${endpoint}/${id}`)
    },
    onSuccess: () => {
      const key =
        activeTab === 'expenses' ? 'expenses-tab' :
        activeTab === 'categories' ? 'expense-categories-tab' :
        activeTab === 'registers' ? 'cash-registers-tab' :
        activeTab === 'currencies' ? 'currencies-tab' : 'taxes-tab'
      qc.invalidateQueries({ queryKey: [key] })
      toast.success('Record deleted successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete record.')
    }
  })

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const openCreateDrawer = () => {
    setEditingItem(null)
    setExpenseForm({ category_id: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' })
    setCategoryForm({ name: '', code: '', description: '' })
    setRegisterForm({ name: '', status: 'closed', balance: '0' })
    setCurrencyForm({ name: '', code: '', symbol: '', exchange_rate: '1.00', is_active: true })
    setTaxForm({ name: '', rate: '', description: '', is_active: true })
    setDrawerOpen(true)
  }

  const openEditDrawer = (row: any) => {
    setEditingItem(row)
    if (activeTab === 'expenses') {
      setExpenseForm({
        category_id: String(row.category?.id ?? row.category_id ?? ''),
        amount:      String(row.amount),
        date:        row.date || '',
        description: row.description || '',
      })
    } else if (activeTab === 'categories') {
      setCategoryForm({
        name:        row.name,
        code:        row.code || '',
        description: row.description || '',
      })
    } else if (activeTab === 'registers') {
      setRegisterForm({
        name:    row.name,
        status:  row.status,
        balance: String(row.balance || '0'),
      })
    } else if (activeTab === 'currencies') {
      setCurrencyForm({
        name:          row.name,
        code:          row.code,
        symbol:        row.symbol,
        exchange_rate: String(row.exchange_rate),
        is_active:     !!row.is_active,
      })
    } else if (activeTab === 'taxes') {
      setTaxForm({
        name:        row.name,
        rate:        String(row.rate),
        description: row.description || '',
        is_active:   !!row.is_active,
      })
    }
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingItem(null)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleSubmit = () => {
    const payload =
      activeTab === 'expenses' ? expenseForm :
      activeTab === 'categories' ? categoryForm :
      activeTab === 'registers' ? registerForm :
      activeTab === 'currencies' ? currencyForm : taxForm

    saveMutation.mutate(payload)
  }

  // ─── Table Columns ────────────────────────────────────────────────────────
  const getColumns = () => {
    switch (activeTab) {
      case 'expenses':
        return [
          { key: 'category.name', title: 'Category' },
          { key: 'amount',      title: 'Amount', render: (val: any) => `$${Number(val).toFixed(2)}` },
          { key: 'date',        title: 'Date' },
          { key: 'description', title: 'Description' },
          {
            key: 'actions',
            title: 'Actions',
            width: '100px',
            render: (_: any, row: any) => (
              <div className="flex items-center gap-2">
                <button onClick={() => openEditDrawer(row)} className="p-1 hover:bg-muted rounded text-muted-foreground"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(row.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded"><Trash2 size={14} /></button>
              </div>
            )
          }
        ]
      case 'categories':
        return [
          { key: 'name',        title: 'Category Name' },
          { key: 'code',        title: 'Code' },
          { key: 'description', title: 'Description' },
          {
            key: 'actions',
            title: 'Actions',
            width: '100px',
            render: (_: any, row: any) => (
              <div className="flex items-center gap-2">
                <button onClick={() => openEditDrawer(row)} className="p-1 hover:bg-muted rounded text-muted-foreground"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(row.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded"><Trash2 size={14} /></button>
              </div>
            )
          }
        ]
      case 'registers':
        return [
          { key: 'name',    title: 'Register Name' },
          { key: 'balance', title: 'Current Balance', render: (val: any) => `$${Number(val).toFixed(2)}` },
          { key: 'status',  title: 'Status', render: (val: any) => <StatusBadge status={val} /> },
          {
            key: 'actions',
            title: 'Actions',
            width: '100px',
            render: (_: any, row: any) => (
              <div className="flex items-center gap-2">
                <button onClick={() => openEditDrawer(row)} className="p-1 hover:bg-muted rounded text-muted-foreground"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(row.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded"><Trash2 size={14} /></button>
              </div>
            )
          }
        ]
      case 'currencies':
        return [
          { key: 'name',          title: 'Currency Name' },
          { key: 'code',          title: 'Code' },
          { key: 'symbol',        title: 'Symbol' },
          { key: 'exchange_rate', title: 'Exchange Rate' },
          { key: 'is_active',     title: 'Status', render: (val: any) => <StatusBadge status={val ? 'active' : 'inactive'} /> },
          {
            key: 'actions',
            title: 'Actions',
            width: '100px',
            render: (_: any, row: any) => (
              <div className="flex items-center gap-2">
                <button onClick={() => openEditDrawer(row)} className="p-1 hover:bg-muted rounded text-muted-foreground"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(row.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded"><Trash2 size={14} /></button>
              </div>
            )
          }
        ]
      case 'taxes':
        return [
          { key: 'name',        title: 'Tax Rule Name' },
          { key: 'rate',        title: 'Tax Rate (%)', render: (val: any) => `${Number(val)}%` },
          { key: 'description', title: 'Description' },
          { key: 'is_active',   title: 'Status', render: (val: any) => <StatusBadge status={val ? 'active' : 'inactive'} /> },
          {
            key: 'actions',
            title: 'Actions',
            width: '100px',
            render: (_: any, row: any) => (
              <div className="flex items-center gap-2">
                <button onClick={() => openEditDrawer(row)} className="p-1 hover:bg-muted rounded text-muted-foreground"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(row.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded"><Trash2 size={14} /></button>
              </div>
            )
          }
        ]
    }
  }

  const isLoading =
    activeTab === 'expenses' ? loadingExpenses :
    activeTab === 'categories' ? loadingCategories :
    activeTab === 'registers' ? loadingRegisters :
    activeTab === 'currencies' ? loadingCurrencies : loadingTaxes

  const getData = () => {
    switch (activeTab) {
      case 'expenses': return expenses ?? []
      case 'categories': return categories ?? []
      case 'registers': return registers ?? []
      case 'currencies': return currencies ?? []
      case 'taxes': return taxes ?? []
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Finance Workspace' }]} />

      <PageHeader
        title="Finance Workspace"
        subtitle="Consolidated management of company expenses, POS cash registers, global currencies, and tax rules."
        action={
          (activeTab !== 'transactions' && activeTab !== 'payment_methods') && (
            <button
              onClick={openCreateDrawer}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
            >
              <Plus size={16} />
              Create New
            </button>
          )
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-border bg-card rounded-t-xl px-4 overflow-x-auto gap-2">
        {[
          { id: 'expenses',        label: 'Expenses Ledger', icon: <DollarSign size={14} /> },
          { id: 'categories',      label: 'Expense Categories', icon: <Wallet size={14} /> },
          { id: 'registers',       label: 'Cash Registers', icon: <ShieldAlert size={14} /> },
          { id: 'transactions',    label: 'Transactions History', icon: <Landmark size={14} /> },
          { id: 'payment_methods', label: 'Payment Methods', icon: <CreditCard size={14} /> },
          { id: 'currencies',      label: 'Currencies', icon: <Sparkles size={14} /> },
          { id: 'taxes',           label: 'Tax Rules', icon: <Receipt size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as TabType); setSearch('') }}
            className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                        ${activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'transactions' ? (
        <TransactionsPage isTab />
      ) : activeTab === 'payment_methods' ? (
        <PaymentMethodsPage isTab />
      ) : (
        <div className="bg-card rounded-b-xl border border-t-0 border-border p-6 shadow-sm space-y-4">
          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder={`Search within ${activeTab}...`}
          />

          {isLoading ? (
            <LoadingSpinner fullPage label={`Loading ${activeTab} data...`} />
          ) : (
            <DataTable columns={getColumns() as any} data={getData()} />
          )}
        </div>
      )}

      {/* Drawer Forms */}
      <FormDrawer
        open={drawerOpen}
        title={editingItem ? `Edit Details` : `Create New`}
        subtitle="Submit updated values for audit logs."
        onClose={closeDrawer}
        onSubmit={handleSubmit}
        loading={saveMutation.isPending}
      >
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Expense Category *</label>
              <select
                value={expenseForm.category_id}
                onChange={e => setExpenseForm({ ...expenseForm, category_id: e.target.value })}
                className="form-input w-full text-sm cursor-pointer"
                required
              >
                <option value="">Choose Category</option>
                {categories?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                value={expenseForm.amount}
                onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                className="form-input w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Transaction Date *</label>
              <input
                type="date"
                value={expenseForm.date}
                onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="form-input w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
              <textarea
                value={expenseForm.description}
                onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                className="form-input w-full text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Category Name *</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="form-input w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Category Code</label>
              <input
                type="text"
                value={categoryForm.code}
                onChange={e => setCategoryForm({ ...categoryForm, code: e.target.value })}
                className="form-input w-full text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
              <textarea
                value={categoryForm.description}
                onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="form-input w-full text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        {activeTab === 'registers' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Register Location Name *</label>
              <input
                type="text"
                value={registerForm.name}
                onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                className="form-input w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Opening Cash Balance ($) *</label>
              <input
                type="number"
                step="0.01"
                value={registerForm.balance}
                onChange={e => setRegisterForm({ ...registerForm, balance: e.target.value })}
                className="form-input w-full text-sm"
                required
              />
            </div>
          </div>
        )}

        {activeTab === 'currencies' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Currency Code *</label>
                <input
                  type="text"
                  value={currencyForm.code}
                  onChange={e => setCurrencyForm({ ...currencyForm, code: e.target.value })}
                  placeholder="e.g. USD, EUR"
                  className="form-input w-full text-sm font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Symbol *</label>
                <input
                  type="text"
                  value={currencyForm.symbol}
                  onChange={e => setCurrencyForm({ ...currencyForm, symbol: e.target.value })}
                  placeholder="e.g. $, €"
                  className="form-input w-full text-sm font-mono"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Currency Name *</label>
              <input
                type="text"
                value={currencyForm.name}
                onChange={e => setCurrencyForm({ ...currencyForm, name: e.target.value })}
                className="form-input w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Exchange Rate (vs Base) *</label>
              <input
                type="number"
                step="0.0001"
                value={currencyForm.exchange_rate}
                onChange={e => setCurrencyForm({ ...currencyForm, exchange_rate: e.target.value })}
                className="form-input w-full text-sm"
                required
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="currency_active"
                checked={currencyForm.is_active}
                onChange={e => setCurrencyForm({ ...currencyForm, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-600/30"
              />
              <label htmlFor="currency_active" className="text-sm font-semibold text-foreground cursor-pointer">
                Active status
              </label>
            </div>
          </div>
        )}

        {activeTab === 'taxes' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Tax Rule Label *</label>
              <input
                type="text"
                value={taxForm.name}
                onChange={e => setTaxForm({ ...taxForm, name: e.target.value })}
                className="form-input w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Tax Rate Percentage (%) *</label>
              <input
                type="number"
                step="0.01"
                value={taxForm.rate}
                onChange={e => setTaxForm({ ...taxForm, rate: e.target.value })}
                className="form-input w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
              <textarea
                value={taxForm.description}
                onChange={e => setTaxForm({ ...taxForm, description: e.target.value })}
                className="form-input w-full text-sm resize-none"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="tax_active"
                checked={taxForm.is_active}
                onChange={e => setTaxForm({ ...taxForm, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-600/30"
              />
              <label htmlFor="tax_active" className="text-sm font-semibold text-foreground cursor-pointer">
                Active status
              </label>
            </div>
          </div>
        )}
      </FormDrawer>
    </div>
  )
}

export default FinancePage
