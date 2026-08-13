import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import {
  Plus, DollarSign, Wallet, Receipt, Landmark, CreditCard, Search, Filter, RefreshCw,
  ChevronUp, ChevronDown, Download, Upload, Settings
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Breadcrumb from '@/components/common/Breadcrumb'
import ResetButton from '@/components/shared/ResetButton'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import { useTranslation } from 'react-i18next'

import TransactionsPage from '../payments/TransactionsPage'
import PaymentMethodsPage from '../payments/PaymentMethodsPage'
import { FinanceStatsCards } from './components/FinanceStatsCards'
import { FinanceFilterDrawer } from './components/FinanceFilterDrawer'
import { FinanceFormDrawer } from './components/FinanceFormDrawer'
import { FinanceImportModal } from './components/FinanceImportModal'
import { ExpensesTab } from './components/tabs/ExpensesTab'
import { CategoriesTab } from './components/tabs/CategoriesTab'
import { RegistersTab } from './components/tabs/RegistersTab'
import { CurrenciesTab } from './components/tabs/CurrenciesTab'
import { TaxesTab } from './components/tabs/TaxesTab'
import type { TabType, ExpenseForm, CategoryForm, RegisterForm, CurrencyForm, TaxForm } from './types'

const FinancePage: React.FC = () => {
  const { t } = useTranslation(['finance', 'common'])
  const qc = useQueryClient()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as TabType) || 'expenses'

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: `finance_${activeTab}` })

  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab })
    reset()
  }

  // Triggers for subcomponents
  const [txnAddTrigger, setTxnAddTrigger] = useState(0)
  const [pmAddTrigger, setPmAddTrigger] = useState(0)

  // Drawers & Modals
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Forms
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
    title: '',
    expense_category_id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    branch_id: '1',
    reference_number: '',
    receipt: '',
    status: 'approved'
  })
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: '',
    code: '',
    is_active: true
  })
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    title: '',
    status: 'open',
    opening_balance: '0',
    closing_balance: '0',
    branch_id: '1',
    store_id: '1',
    notes: ''
  })
  const [currencyForm, setCurrencyForm] = useState<CurrencyForm>({
    name: '',
    code: '',
    symbol: '',
    exchange_rate: '1.00',
    is_active: true,
    is_default: false
  })
  const [taxForm, setTaxForm] = useState<TaxForm>({
    name: '',
    rate: '',
    type: 'percentage',
    is_active: true
  })

  // Sorting State
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Column Settings
  const [showColSettings, setShowColSettings] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    expense_title: true,
    expense_category: true,
    expense_amount: true,
    expense_date: true,
    expense_description: true,
    category_name: true,
    category_code: true,
    category_status: true,
    register_title: true,
    register_balance: true,
    register_status: true,
    currency_name: true,
    currency_code: true,
    currency_symbol: true,
    currency_rate: true,
    currency_status: true,
    tax_name: true,
    tax_rate: true,
    tax_type: true,
    tax_status: true,
  })

  // Advanced Filters
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterAccount, setFilterAccount] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('')
  const [filterDateStart, setFilterDateStart] = useState('')
  const [filterDateEnd, setFilterDateEnd] = useState('')
  const [filterAmountMin, setFilterAmountMin] = useState('')
  const [filterAmountMax, setFilterAmountMax] = useState('')
  const [filterCreatedBy, setFilterCreatedBy] = useState('')

  // Queries
  const { data: expensesData, isLoading: loadingExpenses, isFetching: fetchingExpenses } = useQuery({
    queryKey: ['expenses-tab', page, debouncedSearch, perPage],
    queryFn: () => api.get('/expenses', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: activeTab === 'expenses',
  })

  const { data: categoriesData, isLoading: loadingCategories, isFetching: fetchingCategories } = useQuery({
    queryKey: ['expense-categories-tab', page, debouncedSearch, perPage],
    queryFn: () => api.get('/expense-categories', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: activeTab === 'categories' || activeTab === 'expenses',
  })

  const { data: registersData, isLoading: loadingRegisters, isFetching: fetchingRegisters } = useQuery({
    queryKey: ['cash-registers-tab', page, debouncedSearch, perPage],
    queryFn: () => api.get('/pos/cash-registers', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: activeTab === 'registers',
  })

  const { data: currenciesData, isLoading: loadingCurrencies, isFetching: fetchingCurrencies } = useQuery({
    queryKey: ['currencies-tab', page, debouncedSearch, perPage],
    queryFn: () => api.get('/currencies', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: activeTab === 'currencies',
  })

  const { data: taxesData, isLoading: loadingTaxes, isFetching: fetchingTaxes } = useQuery({
    queryKey: ['taxes-tab', page, debouncedSearch, perPage],
    queryFn: () => api.get('/taxes', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: activeTab === 'taxes',
  })

  const expenses = expensesData?.data ?? []
  const categories = categoriesData?.data ?? []
  const registers = registersData?.data ?? []
  const currencies = currenciesData?.data ?? []
  const taxes = taxesData?.data ?? []

  // Stats Queries
  const { data: allExpenses } = useQuery({
    queryKey: ['all-expenses-stats'],
    queryFn: () => api.get('/expenses', { params: { per_page: 1000 } }).then(r => r.data.data ?? []),
  })

  const { data: allRegisters } = useQuery({
    queryKey: ['all-registers-stats'],
    queryFn: () => api.get('/pos/cash-registers', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: allSales } = useQuery({
    queryKey: ['all-sales-stats-finance'],
    queryFn: () => api.get('/sales', { params: { per_page: 1000 } }).then(r => r.data.data ?? []),
  })

  // Mutations
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
      qc.invalidateQueries({ queryKey: [`${activeTab}-tab`] })
      qc.invalidateQueries({ queryKey: ['all-expenses-stats'] })
      qc.invalidateQueries({ queryKey: ['all-registers-stats'] })
      qc.invalidateQueries({ queryKey: ['all-sales-stats-finance'] })
      toast.success(editingItem ? 'Updated successfully.' : 'Created successfully.')
      closeDrawer()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to save details.')
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
      qc.invalidateQueries({ queryKey: [`${activeTab}-tab`] })
      qc.invalidateQueries({ queryKey: ['all-expenses-stats'] })
      qc.invalidateQueries({ queryKey: ['all-registers-stats'] })
      qc.invalidateQueries({ queryKey: ['all-sales-stats-finance'] })
      toast.success('Record deleted successfully.')
      adjustAfterDelete(1)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to delete record.')
  })

  const handleAddActionClick = () => {
    if (activeTab === 'transactions') {
      setTxnAddTrigger(prev => prev + 1)
    } else if (activeTab === 'payment_methods') {
      setPmAddTrigger(prev => prev + 1)
    } else {
      openCreateDrawer()
    }
  }

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setExpenseForm(prev => ({ ...prev, receipt: `receipts/${file.name}` }))
    }
  }

  const openCreateDrawer = () => {
    setEditingItem(null)
    setExpenseForm({
      title: '',
      expense_category_id: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      branch_id: '1',
      reference_number: '',
      receipt: '',
      status: 'approved'
    })
    setCategoryForm({ name: '', code: '', is_active: true })
    setRegisterForm({
      title: '',
      status: 'open',
      opening_balance: '0',
      closing_balance: '0',
      branch_id: '1',
      store_id: '1',
      notes: ''
    })
    setCurrencyForm({ name: '', code: '', symbol: '', exchange_rate: '1.00', is_active: true, is_default: false })
    setTaxForm({ name: '', rate: '', type: 'percentage', is_active: true })
    setDrawerOpen(true)
  }

  const openEditDrawer = (row: any) => {
    setEditingItem(row)
    if (activeTab === 'expenses') {
      setExpenseForm({
        title: row.title || '',
        expense_category_id: String(row.expense_category_id ?? row.category?.id ?? ''),
        amount: String(row.amount ?? ''),
        date: row.date ? row.date.split('T')[0] : new Date().toISOString().split('T')[0],
        description: row.description || '',
        branch_id: String(row.branch_id ?? '1'),
        reference_number: row.reference_number || '',
        receipt: row.receipt || '',
        status: row.status || 'approved'
      })
    } else if (activeTab === 'categories') {
      setCategoryForm({
        name: row.name || '',
        code: row.code || '',
        is_active: !!row.is_active,
      })
    } else if (activeTab === 'registers') {
      setRegisterForm({
        title: row.title || row.name || '',
        status: row.status || 'open',
        opening_balance: String(row.opening_balance ?? '0'),
        closing_balance: String(row.closing_balance ?? '0'),
        branch_id: String(row.branch_id ?? '1'),
        store_id: String(row.store_id ?? '1'),
        notes: row.notes || '',
      })
    } else if (activeTab === 'currencies') {
      setCurrencyForm({
        name: row.name || '',
        code: row.code || '',
        symbol: row.symbol || '',
        exchange_rate: String(row.exchange_rate ?? '1.00'),
        is_active: !!row.is_active,
        is_default: !!row.is_default,
      })
    } else if (activeTab === 'taxes') {
      setTaxForm({
        name: row.name || '',
        rate: String(row.rate ?? ''),
        type: row.type || 'percentage',
        is_active: !!row.is_active,
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
    let payload: any = {}
    if (activeTab === 'expenses') {
      payload = {
        title: expenseForm.title || `Expense - ${new Date().toLocaleDateString()}`,
        expense_category_id: expenseForm.expense_category_id ? Number(expenseForm.expense_category_id) : null,
        amount: Number(expenseForm.amount),
        date: expenseForm.date,
        description: expenseForm.description || null,
        branch_id: Number(expenseForm.branch_id || 1),
        reference_number: expenseForm.reference_number || null,
        receipt: expenseForm.receipt || null,
        status: expenseForm.status || 'approved',
      }
    } else if (activeTab === 'categories') {
      payload = {
        name: categoryForm.name,
        code: categoryForm.code || null,
        is_active: categoryForm.is_active,
      }
    } else if (activeTab === 'registers') {
      payload = {
        title: registerForm.title,
        status: registerForm.status,
        opening_balance: Number(registerForm.opening_balance),
        closing_balance: registerForm.closing_balance ? Number(registerForm.closing_balance) : null,
        notes: registerForm.notes || null,
        branch_id: Number(registerForm.branch_id || 1),
        store_id: Number(registerForm.store_id || 1),
      }
    } else if (activeTab === 'currencies') {
      payload = {
        name: currencyForm.name,
        code: currencyForm.code,
        symbol: currencyForm.symbol,
        exchange_rate: Number(currencyForm.exchange_rate),
        is_active: currencyForm.is_active,
        is_default: currencyForm.is_default,
      }
    } else if (activeTab === 'taxes') {
      payload = {
        name: taxForm.name,
        rate: Number(taxForm.rate),
        type: taxForm.type,
        is_active: taxForm.is_active,
      }
    }
    saveMutation.mutate(payload)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={12} className="inline ml-1" /> : <ChevronDown size={12} className="inline ml-1" />
  }

  const handleResetFilters = () => {
    setFilterType('')
    setFilterStatus('')
    setFilterAccount('')
    setFilterCategory('')
    setFilterPaymentMethod('')
    setFilterDateStart('')
    setFilterDateEnd('')
    setFilterAmountMin('')
    setFilterAmountMax('')
    setFilterCreatedBy('')
    setSearch('')
  }

  const getAddButtonLabel = () => {
    switch (activeTab) {
      case 'expenses': return t('finance.add_expense', 'Add Expense')
      case 'categories': return t('finance.add_category', 'Add Category')
      case 'registers': return t('finance.add_register', 'Add Register')
      case 'transactions': return t('finance.add_transaction', 'Log Transaction')
      case 'payment_methods': return t('finance.add_payment_method', 'Add Method')
      case 'currencies': return t('finance.add_currency', 'Add Currency')
      case 'taxes': return t('finance.add_tax', 'Add Tax Rule')
      default: return t('finance.add_transaction', 'Add Transaction')
    }
  }

  const isLoading =
    activeTab === 'expenses' ? loadingExpenses :
    activeTab === 'categories' ? loadingCategories :
    activeTab === 'registers' ? loadingRegisters :
    activeTab === 'currencies' ? loadingCurrencies : loadingTaxes

  const isFetching =
    activeTab === 'expenses' ? fetchingExpenses :
    activeTab === 'categories' ? fetchingCategories :
    activeTab === 'registers' ? fetchingRegisters :
    activeTab === 'currencies' ? fetchingCurrencies : fetchingTaxes

  const paginationData =
    activeTab === 'expenses' ? expensesData?.pagination :
    activeTab === 'categories' ? categoriesData?.pagination :
    activeTab === 'registers' ? registersData?.pagination :
    activeTab === 'currencies' ? currenciesData?.pagination : taxesData?.pagination

  const pagination = paginationData ?? { total: 0, current_page: 1, last_page: 1 }

  return (
    <div className="space-y-5 print:p-0">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Financial Management' }]} />

      {/* Header Card */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span>{t('finance.financial_management', 'Financial Management')}</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            {t('finance.subtitle_desc', 'Track sales revenue, operating expenses, cash registers, multi-currency rates, and taxes across the Enterprise POS system.')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <Upload size={15} />
            <span>Import CSV</span>
          </button>
          <button
            onClick={handleAddActionClick}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus size={16} />
            <span>{getAddButtonLabel()}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <FinanceStatsCards allSales={allSales} allExpenses={allExpenses} allRegisters={allRegisters} />

      {/* Workspace Tabs */}
      <div className="flex border border-border bg-card rounded-2xl p-1 overflow-x-auto gap-1 shadow-xs w-full md:w-auto">
        {[
          { id: 'expenses', label: t('finance.expenses', 'Expenses'), icon: <Receipt size={15} /> },
          { id: 'categories', label: t('finance.categories', 'Categories'), icon: <Wallet size={15} /> },
          { id: 'registers', label: t('finance.registers', 'Till Registers'), icon: <Landmark size={15} /> },
          { id: 'transactions', label: t('finance.transactions', 'Transactions'), icon: <DollarSign size={15} /> },
          { id: 'payment_methods', label: t('finance.payment_methods', 'Payment Methods'), icon: <CreditCard size={15} /> },
          { id: 'currencies', label: t('finance.currencies', 'Currencies'), icon: <DollarSign size={15} /> },
          { id: 'taxes', label: t('finance.taxes', 'Tax Rules'), icon: <Receipt size={15} /> },
        ].map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setActiveTab(tabItem.id as TabType)}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tabItem.id ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tabItem.icon}
            <span>{tabItem.label}</span>
          </button>
        ))}
      </div>

      {/* Content Tabs */}
      {activeTab === 'transactions' ? (
        <TransactionsPage isTab triggerAdd={txnAddTrigger} />
      ) : activeTab === 'payment_methods' ? (
        <PaymentMethodsPage isTab triggerAdd={pmAddTrigger} />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-xs print:hidden">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search ledger records..."
                  className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
                />
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all shadow-xs"
              >
                <Filter size={14} />
                <span>Filter</span>
              </button>

              <ResetButton onClick={handleResetFilters} />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => qc.invalidateQueries({ queryKey: [`${activeTab}-tab`] })}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowColSettings(!showColSettings)}
                  className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
                  title="Column Settings"
                >
                  <Settings size={14} />
                </button>
                <AnimatePresence>
                  {showColSettings && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowColSettings(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">Toggle Columns</p>
                        {Object.keys(visibleColumns).map((col) => (
                          <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                            <input
                              type="checkbox"
                              checked={visibleColumns[col]}
                              onChange={(e) => setVisibleColumns((prev) => ({ ...prev, [col]: e.target.checked }))}
                              className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                            />
                            <span>{col.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {activeTab === 'expenses' && (
            <ExpensesTab
              expenses={expenses}
              isLoading={isLoading}
              isFetching={isFetching}
              visibleColumns={visibleColumns}
              openEditDrawer={openEditDrawer}
              handleDelete={handleDelete}
              renderSortIcon={renderSortIcon}
              handleSort={handleSort}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab
              categories={categories}
              isLoading={isLoading}
              isFetching={isFetching}
              visibleColumns={visibleColumns}
              openEditDrawer={openEditDrawer}
              handleDelete={handleDelete}
            />
          )}

          {activeTab === 'registers' && (
            <RegistersTab
              registers={registers}
              isLoading={isLoading}
              isFetching={isFetching}
              visibleColumns={visibleColumns}
              openEditDrawer={openEditDrawer}
              handleDelete={handleDelete}
            />
          )}

          {activeTab === 'currencies' && (
            <CurrenciesTab
              currencies={currencies}
              isLoading={isLoading}
              isFetching={isFetching}
              visibleColumns={visibleColumns}
              openEditDrawer={openEditDrawer}
              handleDelete={handleDelete}
            />
          )}

          {activeTab === 'taxes' && (
            <TaxesTab
              taxes={taxes}
              isLoading={isLoading}
              isFetching={isFetching}
              visibleColumns={visibleColumns}
              openEditDrawer={openEditDrawer}
              handleDelete={handleDelete}
            />
          )}

          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}

      {/* Filter Drawer */}
      <FinanceFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        activeTab={activeTab}
        categories={categories}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterAccount={filterAccount}
        setFilterAccount={setFilterAccount}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterPaymentMethod={filterPaymentMethod}
        setFilterPaymentMethod={setFilterPaymentMethod}
        filterDateStart={filterDateStart}
        setFilterDateStart={setFilterDateStart}
        filterDateEnd={filterDateEnd}
        setFilterDateEnd={setFilterDateEnd}
        filterAmountMin={filterAmountMin}
        setFilterAmountMin={setFilterAmountMin}
        filterAmountMax={filterAmountMax}
        setFilterAmountMax={setFilterAmountMax}
        filterCreatedBy={filterCreatedBy}
        setFilterCreatedBy={setFilterCreatedBy}
        onReset={handleResetFilters}
      />

      {/* Form Drawer */}
      <FinanceFormDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        activeTab={activeTab}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        isPending={saveMutation.isPending}
        categories={categories}
        expenseForm={expenseForm}
        setExpenseForm={setExpenseForm}
        handleReceiptFileChange={handleReceiptFileChange}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        currencyForm={currencyForm}
        setCurrencyForm={setCurrencyForm}
        taxForm={taxForm}
        setTaxForm={setTaxForm}
      />

      {/* Import Modal */}
      <FinanceImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        activeTab={activeTab}
        importFile={importFile}
        setImportFile={setImportFile}
        importing={importing}
        setImporting={setImporting}
      />
    </div>
  )
}

export default FinancePage
