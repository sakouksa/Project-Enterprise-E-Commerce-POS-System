import React, { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, DollarSign, Receipt, Landmark, CreditCard, Search, Filter, RefreshCw,
  ChevronUp, ChevronDown, Upload, X, Percent, Globe, Download,
  FolderTree
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Breadcrumb from '@/components/common/Breadcrumb'
import ResetButton from '@/components/shared/ResetButton'
import Pagination from '@/components/shared/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import ColumnSettingsPopover from '@/components/shared/ColumnSettingsPopover'
import BulkSelectionBanner from '@/components/shared/BulkSelectionBanner'
import WorkspaceTabs from '@/components/shared/WorkspaceTabs'
import { useServerPagination } from '@/hooks/useServerPagination'
import { useTranslation } from 'react-i18next'
import { downloadCsv } from '@/utils/export'

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
  const { t } = useTranslation(['finance', 'common', 'nav'])
  const qc = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()
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
    setSelectedExpenseIds([])
    setSelectedCategoryIds([])
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
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number | null; name?: string }>({
    open: false,
    id: null,
    name: ''
  })

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
    icon: 'FolderClosed',
    color: 'blue',
    description: '',
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
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    expense_title: true,
    expense_category: true,
    expense_amount: true,
    expense_date: true,
    expense_description: true,
    category_name: true,
    category_code: true,
    category_transactions: true,
    category_total_spent: true,
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
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('')
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('')
  const [filterDateStart, setFilterDateStart] = useState('')
  const [filterDateEnd, setFilterDateEnd] = useState('')
  const [filterAmountMin, setFilterAmountMin] = useState('')
  const [filterAmountMax, setFilterAmountMax] = useState('')
  const [filterCreatedBy, setFilterCreatedBy] = useState('')

  const effectiveCategory = activeCategoryFilter || filterCategory

  const isFilterActive = Boolean(
    filterStatus ||
    filterCategory ||
    activeCategoryFilter ||
    filterDateStart ||
    filterDateEnd ||
    filterAmountMin ||
    filterAmountMax ||
    filterCreatedBy ||
    filterType ||
    filterAccount ||
    filterPaymentMethod
  )

  // Queries
  const { data: expensesData, isLoading: loadingExpenses, isFetching: fetchingExpenses } = useQuery({
    queryKey: [
      'expenses-tab',
      page,
      debouncedSearch,
      perPage,
      sortBy,
      sortOrder,
      effectiveCategory,
      filterStatus,
      filterDateStart,
      filterDateEnd,
      filterAmountMin,
      filterAmountMax,
      filterCreatedBy,
    ],
    queryFn: () => api.get('/expenses', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        category_id: effectiveCategory || undefined,
        status: filterStatus || undefined,
        start_date: filterDateStart || undefined,
        end_date: filterDateEnd || undefined,
        min_amount: filterAmountMin || undefined,
        max_amount: filterAmountMax || undefined,
        user_id: filterCreatedBy || undefined,
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: activeTab === 'expenses',
  })

  const { data: categoriesData, isLoading: loadingCategories, isFetching: fetchingCategories } = useQuery({
    queryKey: ['expense-categories-tab', page, debouncedSearch, perPage, filterStatus, sortBy, sortOrder],
    queryFn: () => api.get('/expense-categories', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        status: filterStatus || undefined,
        sort_by: sortBy,
        sort_order: sortOrder
      }
    }).then(r => r.data),
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

  // Stats & Analytics Queries
  const { data: financeAnalytics } = useQuery({
    queryKey: ['finance-analytics'],
    queryFn: () => api.get('/finance/analytics').then(r => r.data.data),
  })

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
      qc.invalidateQueries({ queryKey: ['finance-analytics'] })
      qc.invalidateQueries({ queryKey: ['all-registers-stats'] })
      qc.invalidateQueries({ queryKey: ['all-sales-stats-finance'] })
      toast.success(editingItem ? t('finance.update_success', 'Updated successfully.') : t('finance.save_success', 'Saved successfully.'))
      closeDrawer()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('finance.save_error', 'Failed to save details.'))
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
      toast.success(t('finance.delete_success', 'Record deleted successfully.'))
      setDeleteConfirm({ open: false, id: null, name: '' })
      adjustAfterDelete(1)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('finance.delete_error', 'Failed to delete record.'))
  })

  // Bulk Selection & Quick Category Filters for Expenses
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<number[]>([])
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)

  const handleSelectExpenseRow = (id: number) => {
    setSelectedExpenseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAllExpenses = (allIds: number[]) => {
    if (allIds.every((id) => selectedExpenseIds.includes(id))) {
      setSelectedExpenseIds([])
    } else {
      setSelectedExpenseIds(allIds)
    }
  }

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return api.post('/expenses/bulk-delete', { ids })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expenses-tab'] })
      qc.invalidateQueries({ queryKey: ['all-expenses-stats'] })
      toast.success(t('finance.bulk_delete_success', 'Selected expenses deleted successfully.'))
      setSelectedExpenseIds([])
      adjustAfterDelete(selectedExpenseIds.length)
    },
    onError: () => toast.error(t('finance.delete_error', 'Failed to delete selected expenses.'))
  })

  // Bulk Selection for Categories
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [bulkDeleteCategoryConfirmOpen, setBulkDeleteCategoryConfirmOpen] = useState(false)

  const handleSelectCategoryRow = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAllCategories = (allIds: number[]) => {
    if (allIds.every((id) => selectedCategoryIds.includes(id))) {
      setSelectedCategoryIds([])
    } else {
      setSelectedCategoryIds(allIds)
    }
  }

  const bulkDeleteCategoriesMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return api.post('/expense-categories/bulk-delete', { ids })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expense-categories-tab'] })
      qc.invalidateQueries({ queryKey: ['expense-categories-dropdown'] })
      toast.success(t('finance.bulk_delete_categories_success', 'Selected categories deleted successfully.'))
      setSelectedCategoryIds([])
      adjustAfterDelete(selectedCategoryIds.length)
    },
    onError: () => toast.error(t('finance.delete_error', 'Failed to delete selected categories.'))
  })

  const handleExportExpenses = () => {
    const toastId = toast.info(t('common.exporting', 'Exporting expenses dataset...'))
    setTimeout(() => {
      try {
        const headers = [
          t('finance.title_col', 'Title'),
          t('finance.category_col', 'Category'),
          t('finance.amount_col', 'Amount ($)'),
          t('finance.date_col', 'Date'),
          t('finance.status_col', 'Status'),
          t('finance.reference_number', 'Reference #'),
          t('finance.description_col', 'Description'),
        ]
        const rows = (expenses || []).map((exp: any) => [
          exp.title || `Expense #${exp.id}`,
          exp.category?.name || 'General',
          exp.amount || 0,
          exp.date || '',
          exp.status || 'approved',
          exp.reference_number || `EXP-${String(exp.id).padStart(5, '0')}`,
          exp.description || '',
        ])
        downloadCsv('expenses', headers, rows)
        toast.dismiss(toastId)
        toast.success(t('finance.export_success', 'Expenses exported successfully.'))
      } catch {
        toast.dismiss(toastId)
        toast.error(t('finance.export_error', 'Failed to export expenses.'))
      }
    }, 300)
  }

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
    if (activeTab === 'expenses') {
      navigate('/expenses/create')
      return
    }
    setEditingItem(null)
    setCategoryForm({ name: '', code: '', icon: 'FolderClosed', color: 'blue', description: '', is_active: true })
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
    if (activeTab === 'expenses') {
      navigate(`/expenses/${row.id}/edit`)
      return
    }
    setEditingItem(row)
    if (activeTab === 'categories') {
      setCategoryForm({
        name: row.name || '',
        code: row.code || '',
        icon: row.icon || 'FolderClosed',
        color: row.color || 'blue',
        description: row.description || '',
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

  const handleDelete = (id: number, name?: string) => {
    setDeleteConfirm({ open: true, id, name })
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
        icon: categoryForm.icon || null,
        color: categoryForm.color || null,
        description: categoryForm.description || null,
        is_active: categoryForm.is_active,
      }
    }
 else if (activeTab === 'registers') {
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
    setActiveCategoryFilter('')
    setFilterPaymentMethod('')
    setFilterDateStart('')
    setFilterDateEnd('')
    setFilterAmountMin('')
    setFilterAmountMax('')
    setFilterCreatedBy('')
    setSearch('')
    setPage(1)
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

  const currentTabColumns = useMemo(() => {
    switch (activeTab) {
      case 'expenses':
        return [
          { key: 'expense_title', label: t('finance.title_col', 'Title') },
          { key: 'expense_category', label: t('finance.category_col', 'Category') },
          { key: 'expense_amount', label: t('finance.amount_col', 'Amount') },
          { key: 'expense_date', label: t('finance.date_col', 'Date') },
          { key: 'expense_description', label: t('finance.description_col', 'Description') },
        ]
      case 'categories':
        return [
          { key: 'category_name', label: t('finance.category_name', 'Category Name') },
          { key: 'category_code', label: t('finance.code_col', 'Code') },
          { key: 'category_transactions', label: t('finance.transactions_count_col', 'Transactions') },
          { key: 'category_total_spent', label: t('finance.total_spent_col', 'Total Spent') },
          { key: 'category_status', label: t('finance.status_col', 'Status') },
        ]
      case 'registers':
        return [
          { key: 'register_title', label: t('finance.register_title', 'Register Title') },
          { key: 'register_balance', label: t('finance.current_balance', 'Current Balance') },
          { key: 'register_status', label: t('finance.status_col', 'Status') },
        ]
      case 'currencies':
        return [
          { key: 'currency_name', label: t('finance.currency_name', 'Currency Name') },
          { key: 'currency_code', label: t('finance.iso_code', 'ISO Code') },
          { key: 'currency_symbol', label: t('finance.symbol_col', 'Symbol') },
          { key: 'currency_rate', label: t('finance.exchange_rate', 'Exchange Rate') },
          { key: 'currency_status', label: t('finance.status_col', 'Status') },
        ]
      case 'taxes':
        return [
          { key: 'tax_name', label: t('finance.tax_rule_name', 'Tax Rule Name') },
          { key: 'tax_rate', label: t('finance.tax_rate', 'Tax Rate (%)') },
          { key: 'tax_type', label: t('finance.type_col', 'Type') },
          { key: 'tax_status', label: t('finance.status_col', 'Status') },
        ]
      default:
        return []
    }
  }, [activeTab, t])

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
      <Breadcrumb items={[
        { label: t('common.dashboard', 'Dashboard'), path: '/dashboard' },
        { label: t('finance.financial_management', 'Financial Management') }
      ]} />

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
          {activeTab === 'expenses' && (
            <button
              onClick={handleExportExpenses}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs cursor-pointer"
            >
              <Download size={15} />
              <span>{t('finance.export_csv', 'Export CSV')}</span>
            </button>
          )}
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs cursor-pointer"
          >
            <Upload size={15} />
            <span>{t('finance.import_csv', 'Import CSV')}</span>
          </button>
          <button
            onClick={handleAddActionClick}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>{getAddButtonLabel()}</span>
          </button>
        </div>
      </div>

      {/* Clean Analytics Display Cards */}
      <FinanceStatsCards
        analytics={financeAnalytics}
        allSales={allSales}
        allExpenses={allExpenses}
        allRegisters={allRegisters}
      />

      {/* Workspace Tabs Navigation (Matching Product & Customer Catalog Design) */}
      <WorkspaceTabs
        tabs={[
          {
            id: 'expenses',
            label: t('finance.tab_expenses', t('finance.expenses', 'Expenses')),
            icon: Receipt,
            count: expensesData?.pagination?.total ?? (allExpenses?.length || 0),
          },
          {
            id: 'categories',
            label: t('finance.tab_categories', t('finance.categories', 'Categories')),
            icon: FolderTree,
            count: categoriesData?.pagination?.total ?? (categories?.length || 0),
          },
          {
            id: 'registers',
            label: t('finance.tab_registers', t('finance.registers', 'Till Registers')),
            icon: Landmark,
            count: registersData?.pagination?.total ?? (allRegisters?.length || 0),
          },
          {
            id: 'transactions',
            label: t('finance.tab_transactions', t('finance.transactions', 'Transactions')),
            icon: DollarSign,
          },
          {
            id: 'payment_methods',
            label: t('finance.tab_payment_methods', t('finance.payment_methods', 'Payment Methods')),
            icon: CreditCard,
          },
          {
            id: 'currencies',
            label: t('finance.tab_currencies', t('finance.currencies', 'Currencies')),
            icon: Globe,
            count: currenciesData?.pagination?.total ?? (currencies?.length || 0),
          },
          {
            id: 'taxes',
            label: t('finance.tab_taxes', t('finance.taxes', 'Tax Rules')),
            icon: Percent,
            count: taxesData?.pagination?.total ?? (taxes?.length || 0),
          },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as TabType)}
      />

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
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t('finance.search_placeholder', 'Search ledger records...')}
                  className="w-full h-10 pl-9 pr-8 text-xs sm:text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-xs"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                    type="button"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Standard Filter Button with equal h-10 height */}
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 ${
                  isFilterActive
                    ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15'
                    : 'border-border bg-card hover:bg-muted/80 text-foreground'
                }`}
              >
                <Filter
                  size={15}
                  className={isFilterActive ? 'text-primary' : 'text-muted-foreground'}
                />
                <span>{t('finance.filter', t('common.filter', 'Filter'))}</span>
                {isFilterActive && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              <ResetButton onClick={handleResetFilters} />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              {/* Standard Global Refresh Button */}
              <button
                type="button"
                onClick={() => qc.invalidateQueries({ queryKey: [`${activeTab}-tab`] })}
                className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 transition-all duration-200 shadow-xs hover:shadow active:scale-[0.98] cursor-pointer shrink-0"
                title={t('finance.refresh', t('common.refresh', 'Refresh'))}
              >
                <RefreshCw size={15} />
              </button>

              {/* Standard Global Column Settings Popover */}
              <ColumnSettingsPopover
                columns={currentTabColumns}
                visibleColumns={visibleColumns}
                onChange={setVisibleColumns}
              />
            </div>
          </div>

          {activeTab === 'expenses' && (
            <>
              <BulkSelectionBanner
                selectedCount={selectedExpenseIds.length}
                onDelete={() => setBulkDeleteConfirmOpen(true)}
                onClear={() => setSelectedExpenseIds([])}
                deleteLoading={bulkDeleteMutation.isPending}
                deleteLabel={t('finance.delete_selected', t('common.deleteSelected', 'Delete Selected'))}
                clearLabel={t('common.cancel', 'Cancel')}
              />
              <ExpensesTab
                expenses={expenses}
                allExpenses={allExpenses}
                categories={categories}
                isLoading={isLoading}
                isFetching={isFetching}
                visibleColumns={visibleColumns}
                openEditDrawer={openEditDrawer}
                handleDelete={handleDelete}
                renderSortIcon={renderSortIcon}
                handleSort={handleSort}
                selectedRows={selectedExpenseIds}
                handleSelectRow={handleSelectExpenseRow}
                handleSelectAll={handleSelectAllExpenses}
                activeCategoryFilter={activeCategoryFilter}
                setActiveCategoryFilter={setActiveCategoryFilter}
              />
            </>
          )}

          {activeTab === 'categories' && (
            <>
              <BulkSelectionBanner
                selectedCount={selectedCategoryIds.length}
                onDelete={() => setBulkDeleteCategoryConfirmOpen(true)}
                onClear={() => setSelectedCategoryIds([])}
                deleteLoading={bulkDeleteCategoriesMutation.isPending}
                deleteLabel={t('finance.delete_selected_categories', t('common.deleteSelected', 'Delete Selected'))}
                clearLabel={t('common.cancel', 'Cancel')}
              />
              <CategoriesTab
                categories={categories}
                isLoading={isLoading}
                isFetching={isFetching}
                visibleColumns={visibleColumns}
                openEditDrawer={openEditDrawer}
                handleDelete={handleDelete}
                renderSortIcon={renderSortIcon}
                handleSort={handleSort}
                selectedRows={selectedCategoryIds}
                handleSelectRow={handleSelectCategoryRow}
                handleSelectAll={handleSelectAllCategories}
              />
            </>
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

      {/* Single Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title={t('finance.delete_confirm_title', 'Delete Record')}
        message={t('finance.delete_confirm_msg', 'Are you sure you want to delete this record? This action cannot be undone.')}
        itemName={deleteConfirm.name}
        confirmText="common.confirmDelete"
        cancelText="common.cancel"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteConfirm.id && deleteMutation.mutate(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: '' })}
      />

      {/* Bulk Delete Confirmation Dialog (Exact same modal design as Product module) */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        title={t('finance.bulk_delete_title', 'Delete Selected Expenses')}
        message={t('finance.bulk_delete_confirm_msg', {
          count: selectedExpenseIds.length,
          defaultValue: `Are you sure you want to delete all ${selectedExpenseIds.length} selected expenses? This action cannot be undone.`
        }).replace('{{count}}', String(selectedExpenseIds.length))}
        confirmText="common.confirmDelete"
        cancelText="common.cancel"
        loading={bulkDeleteMutation.isPending}
        onConfirm={() => {
          bulkDeleteMutation.mutate(selectedExpenseIds, {
            onSettled: () => setBulkDeleteConfirmOpen(false)
          })
        }}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />

      {/* Bulk Delete Categories Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteCategoryConfirmOpen}
        title={t('finance.bulk_delete_categories_title', 'Delete Selected Categories')}
        message={t('finance.bulk_delete_categories_confirm_msg', {
          count: selectedCategoryIds.length,
          defaultValue: `Are you sure you want to delete all ${selectedCategoryIds.length} selected categories? This action cannot be undone.`
        }).replace('{{count}}', String(selectedCategoryIds.length))}
        confirmText="common.confirmDelete"
        cancelText="common.cancel"
        loading={bulkDeleteCategoriesMutation.isPending}
        onConfirm={() => {
          bulkDeleteCategoriesMutation.mutate(selectedCategoryIds, {
            onSettled: () => setBulkDeleteCategoryConfirmOpen(false)
          })
        }}
        onCancel={() => setBulkDeleteCategoryConfirmOpen(false)}
      />
    </div>
  )
}

export default FinancePage
