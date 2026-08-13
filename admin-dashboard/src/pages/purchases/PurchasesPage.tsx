import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Eye, RefreshCw, X, ShoppingBag, CheckCircle, Trash2, Loader2,
  Printer, Download, DollarSign, Calendar, Landmark, Warehouse as WarehouseIcon,
  Tag, Percent, PlusCircle, ArrowLeft, Trash, Save, Edit, RefreshCw as ResetIcon,
  ChevronUp, ChevronDown, Wallet, FileCheck, Truck, ShoppingCart,
  Settings, Filter, AlertCircle, ShieldAlert, Sliders,
  EditIcon, Edit2
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ResetButton from '@/components/shared/ResetButton'
import TableActionMenu from '@/components/shared/TableActionMenu'
import Breadcrumb from '@/components/common/Breadcrumb'

// Modular Components & Helpers
import { STATUS_BADGE, PAYMENT_BADGE, type Purchase, type PurchaseItem } from './types/purchase.types'
import { formatCurrency, getDualValues, getDetailDualValues, formatListDualCurrency } from './utils/purchaseCurrency'
import { PurchasesStatsCards } from './components/PurchasesStatsCards'
import { PurchasesFilterDrawer } from './components/PurchasesFilterDrawer'
import { PurchaseDetailDrawer } from './components/PurchaseDetailDrawer'
import { PurchaseFormSection } from './components/PurchaseFormSection'

const PurchasesPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [receiveTarget, setReceiveTarget] = useState<Purchase | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Purchase | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [viewingId, setViewingId] = useState<number | null>(null)

  // Server pagination hook
  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset
  } = useServerPagination({ storageKey: 'purchases' })

  // Filters state
  const [statusFilter, setStatusFilter] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [purchaseDateStartFilter, setPurchaseDateStartFilter] = useState('')
  const [purchaseDateEndFilter, setPurchaseDateEndFilter] = useState('')
  const [dueDateStartFilter, setDueDateStartFilter] = useState('')
  const [dueDateEndFilter, setDueDateEndFilter] = useState('')
  const [minAmountFilter, setMinAmountFilter] = useState('')
  const [maxAmountFilter, setMaxAmountFilter] = useState('')
  const [createdByFilter, setCreatedByFilter] = useState('')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    reference: true,
    date: true,
    supplier: true,
    warehouse: true,
    items: true,
    subtotal: true,
    grandTotal: true,
    paymentStatus: true,
    status: true,
    createdBy: true
  })
  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const activeFiltersCount = [
    statusFilter,
    supplierFilter,
    warehouseFilter,
    paymentStatusFilter,
    purchaseDateStartFilter,
    purchaseDateEndFilter,
    dueDateStartFilter,
    dueDateEndFilter,
    minAmountFilter,
    maxAmountFilter,
    createdByFilter
  ].filter(Boolean).length

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  const handleResetFilters = () => {
    setStatusFilter('')
    setSupplierFilter('')
    setWarehouseFilter('')
    setPaymentStatusFilter('')
    setPurchaseDateStartFilter('')
    setPurchaseDateEndFilter('')
    setDueDateStartFilter('')
    setDueDateEndFilter('')
    setMinAmountFilter('')
    setMaxAmountFilter('')
    setCreatedByFilter('')
    setSortBy('created_at')
    setSortOrder('desc')
    reset()
  }

  // Form inputs for creation/edition
  const [editPurchaseId, setEditPurchaseId] = useState<number | null>(null)
  const [supplierId, setSupplierId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [branchId, setBranchId] = useState('1')
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [shippingCost, setShippingCost] = useState('0')
  const [paidAmount, setPaidAmount] = useState('0')
  const [notes, setNotes] = useState('')
  const [currencyCode, setCurrencyCode] = useState('USD')
  const [exchangeRate, setExchangeRate] = useState('4100')

  // Payment recording modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')

  // Create / Edit items list
  const [formItems, setFormItems] = useState<any[]>([])

  const handleCurrencyChange = (newCurrency: string) => {
    if (newCurrency === currencyCode) return
    const rate = parseFloat(exchangeRate) || 4100
    const updatedItems = formItems.map(item => {
      const currentCost = parseFloat(item.unit_cost) || 0
      let newCost = currentCost
      if (newCurrency === 'KHR') {
        newCost = currentCost * rate
      } else {
        newCost = currentCost / rate
      }
      return {
        ...item,
        unit_cost: newCost.toFixed(2)
      }
    })
    setFormItems(updatedItems)
    setCurrencyCode(newCurrency)
  }

  // Search & add product helper
  const [prodSearch, setProdSearch] = useState('')
  const [prodDropdownOpen, setProdDropdownOpen] = useState(false)
  const [recvQuantities, setRecvQuantities] = useState<Record<number, string>>({})

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data: suppliers } = useQuery({
    queryKey: ['suppliers-list'],
    queryFn: () => api.get('/suppliers', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses-list'],
    queryFn: () => api.get('/warehouses', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: branches } = useQuery({
    queryKey: ['branches-list'],
    queryFn: () => api.get('/branches', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: products } = useQuery({
    queryKey: ['products-for-po-select'],
    queryFn: () => api.get('/products', { params: { per_page: 500 } }).then(r => r.data.data ?? []),
  })

  const selectableProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return []
    const items: any[] = []
    products.forEach((product: any) => {
      if (product.has_variants && product.variants && product.variants.length > 0) {
        product.variants.forEach((v: any) => {
          let displayName = v.name || ''
          if (!displayName) displayName = product.name
          else if (!displayName.toLowerCase().startsWith(product.name.toLowerCase())) {
            displayName = `${product.name} - ${v.name}`
          }
          const sku = v.sku || product.sku || ''
          const barcode = v.barcode || product.barcode || ''
          const searchText = `${product.name} ${v.name || ''} ${displayName} ${sku} ${barcode}`.toLowerCase()
          items.push({
            id: `${product.id}-${v.id}`,
            product_id: product.id,
            product_variant_id: v.id,
            name: displayName,
            sku,
            barcode,
            cost_price: v.cost_price ?? product.cost_price ?? 0,
            search_text: searchText,
          })
        })
      } else {
        const sku = product.sku || ''
        const barcode = product.barcode || ''
        const searchText = `${product.name} ${sku} ${barcode}`.toLowerCase()
        items.push({
          id: String(product.id),
          product_id: product.id,
          product_variant_id: null,
          name: product.name,
          sku,
          barcode,
          cost_price: product.cost_price ?? 0,
          search_text: searchText,
        })
      }
    })
    return items
  }, [products])

  const filteredProducts = useMemo(() => {
    const query = prodSearch.trim().toLowerCase()
    if (!query) return selectableProducts
    const tokens = query.split(/[\s()/-]+/).filter(Boolean)
    if (tokens.length === 0) return selectableProducts
    return selectableProducts.filter((item: any) => {
      if (item.search_text.includes(query)) return true
      return tokens.every((token: string) => item.search_text.includes(token))
    })
  }, [selectableProducts, prodSearch])

  const { data: reportData } = useQuery({
    queryKey: ['purchase-dashboard-stats'],
    queryFn: () => api.get('/purchase-report').then(r => r.data.data),
  })

  const { data: users } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => api.get('/users', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: [
      'purchases',
      page,
      debouncedSearch,
      perPage,
      statusFilter,
      supplierFilter,
      warehouseFilter,
      paymentStatusFilter,
      purchaseDateStartFilter,
      purchaseDateEndFilter,
      dueDateStartFilter,
      dueDateEndFilter,
      minAmountFilter,
      maxAmountFilter,
      createdByFilter,
      sortBy,
      sortOrder
    ],
    queryFn: () => api.get('/purchases', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        status: statusFilter,
        supplier_id: supplierFilter,
        warehouse_id: warehouseFilter,
        payment_status: paymentStatusFilter,
        purchase_date_start: purchaseDateStartFilter,
        purchase_date_end: purchaseDateEndFilter,
        due_date_start: dueDateStartFilter,
        due_date_end: dueDateEndFilter,
        min_amount: minAmountFilter,
        max_amount: maxAmountFilter,
        created_by: createdByFilter,
        sort_by: sortBy,
        sort_order: sortOrder
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const purchases: Purchase[] = Array.isArray(data?.data) ? data.data : []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // ─── Mutations ────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (newPO: any) => api.post('/purchases', newPO),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      toast.success(t('purchases.toast.createSuccess', 'Purchase order created successfully!'))
      setActiveWorkspaceTab('list')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error')),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => api.put(`/purchases/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      toast.success(t('purchases.toast.updateSuccess', 'Purchase order updated successfully!'))
      setActiveWorkspaceTab('list')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error')),
  })

  const receiveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => api.post(`/purchases/${id}/receive`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success(t('purchases.toast.receiveSuccess', 'Shipment receiving recorded!'))
      setReceiveTarget(null)
      setSelectedPurchase(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error')),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchases/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      toast.success(t('purchases.toast.cancelledSuccess', 'Purchase order cancelled successfully.'))
      setCancelTarget(null)
      setSelectedPurchase(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error')),
  })

  const paymentMutation = useMutation({
    mutationFn: ({ id, amount, notes }: { id: number; amount: number; notes: string }) =>
      api.post(`/purchases/${id}/record-payment`, { amount, notes }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      toast.success(t('purchases.toast.paymentSuccess', 'Payment recorded successfully!'))
      setPaymentModalOpen(false)
      setPaymentAmount('')
      setPaymentNotes('')
      if (res?.data?.data) setSelectedPurchase(res.data.data as Purchase)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error')),
  })

  // ─── Actions ──────────────────────────────────────────────────────────────
  const switchToTab = (tab: 'list' | 'create' | 'edit', poToEdit?: Purchase) => {
    setActiveWorkspaceTab(tab)
    if (tab === 'create') {
      setEditPurchaseId(null)
      setSupplierId('')
      setWarehouseId('')
      setBranchId('1')
      setPoDate(new Date().toISOString().split('T')[0])
      setDueDate('')
      setShippingCost('0')
      setPaidAmount('0')
      setNotes('')
      setCurrencyCode('USD')
      setExchangeRate('4100')
      setFormItems([])
    } else if (tab === 'edit' && poToEdit) {
      setEditLoading(true)
      setEditPurchaseId(poToEdit.id)
      setSupplierId(poToEdit.supplier?.id.toString() ?? '')
      setWarehouseId(poToEdit.warehouse?.id.toString() ?? '')
      setBranchId(poToEdit.branch?.id.toString() ?? '1')
      setPoDate(poToEdit.date)
      setDueDate(poToEdit.due_date ?? '')
      setShippingCost(poToEdit.shipping_cost.toString())
      setNotes(poToEdit.notes ?? '')
      setCurrencyCode(poToEdit.currency_code)
      setExchangeRate(poToEdit.exchange_rate.toString())

      api.get(`/purchases/${poToEdit.id}`)
        .then(res => {
          const fullPO = res.data.data as Purchase
          const mapped = (fullPO.items ?? []).map(item => ({
            id: item.id,
            product_id: item.product_id,
            product_variant_id: item.product_variant_id || null,
            product_name: item.variant?.name ? `${item.product_name ?? item.product?.name ?? `Product #${item.product_id}`} (${item.variant.name})` : (item.product_name ?? item.product?.name ?? `Product #${item.product_id}`),
            quantity: item.quantity.toString(),
            unit_cost: item.unit_cost.toString(),
            discount_percent: item.discount_percent.toString(),
            tax_percent: item.tax_percent.toString(),
            notes: item.notes ?? ''
          }))
          setFormItems(mapped)
        })
        .catch(() => toast.error('Failed to load purchase items.'))
        .finally(() => setEditLoading(false))
    }
  }

  const handleViewPurchase = (po: Purchase) => {
    setViewingId(po.id)
    api.get(`/purchases/${po.id}`)
      .then(res => setSelectedPurchase(res.data.data as Purchase))
      .catch(() => toast.error('Failed to load purchase details.'))
      .finally(() => setViewingId(null))
  }

  const addProductToForm = (item: any) => {
    const exists = formItems.find(i => i.product_id === item.product_id && i.product_variant_id === item.product_variant_id)
    if (exists) {
      toast.error('Product/Variant already added to list.')
      return
    }

    let baseCost = parseFloat(item.cost_price) || 0
    if (currencyCode === 'USD') {
      const rate = parseFloat(exchangeRate) || 4100
      baseCost = baseCost / rate
    }

    setFormItems(prev => [
      ...prev,
      {
        product_id: item.product_id,
        product_variant_id: item.product_variant_id || null,
        product_name: item.name,
        quantity: '1',
        unit_cost: baseCost.toFixed(2),
        discount_percent: '0',
        tax_percent: '0',
        notes: ''
      }
    ])
    setProdSearch('')
    setProdDropdownOpen(false)
  }

  const updateFormItem = (index: number, key: string, value: string) => {
    const updated = [...formItems]
    updated[index][key] = value
    setFormItems(updated)
  }

  const removeFormItem = (index: number) => {
    const updated = [...formItems]
    updated.splice(index, 1)
    setFormItems(updated)
  }

  const getFormTotals = () => {
    let subtotal = 0
    let totalDiscount = 0
    let totalTax = 0

    formItems.forEach(item => {
      const qty = parseFloat(item.quantity) || 0
      const cost = parseFloat(item.unit_cost) || 0
      const itemSubtotal = qty * cost
      const discAmt = itemSubtotal * ((parseFloat(item.discount_percent) || 0) / 100)
      const taxAmt = (itemSubtotal - discAmt) * ((parseFloat(item.tax_percent) || 0) / 100)
      subtotal += itemSubtotal
      totalDiscount += discAmt
      totalTax += taxAmt
    })

    const ship = parseFloat(shippingCost) || 0
    return {
      subtotal,
      discount_amount: totalDiscount,
      tax_amount: totalTax,
      grand_total: subtotal - totalDiscount + totalTax + ship
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplierId || !warehouseId || !branchId || formItems.length === 0) {
      toast.error('Please complete all required fields and add at least one product.')
      return
    }

    const payload = {
      company_id: 1,
      branch_id: Number(branchId),
      warehouse_id: Number(warehouseId),
      supplier_id: Number(supplierId),
      date: poDate,
      due_date: dueDate || null,
      shipping_cost: parseFloat(shippingCost) || 0,
      paid_amount: parseFloat(paidAmount) || 0,
      notes: notes,
      currency_code: currencyCode,
      exchange_rate: currencyCode === 'KHR' ? 1 : (parseFloat(exchangeRate) || 4100),
      items: formItems.map(item => ({
        product_id: item.product_id,
        product_variant_id: item.product_variant_id || null,
        quantity: parseFloat(item.quantity) || 1,
        unit_cost: parseFloat(item.unit_cost) || 0,
        discount_percent: parseFloat(item.discount_percent) || 0,
        tax_percent: parseFloat(item.tax_percent) || 0,
        notes: item.notes || null
      }))
    }

    if (editPurchaseId) {
      updateMutation.mutate({ id: editPurchaseId, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const openReceiveModal = (po: Purchase) => {
    if (po.items && po.items.length > 0) {
      setReceiveTarget(po)
      const initialQtys: Record<number, string> = {}
      po.items.forEach(item => {
        initialQtys[item.id] = (item.quantity - item.quantity_received).toString()
      })
      setRecvQuantities(initialQtys)
      return
    }
    api.get(`/purchases/${po.id}`).then(res => {
      const fullPO = res.data.data as Purchase
      setReceiveTarget(fullPO)
      const initialQtys: Record<number, string> = {}
      ;(fullPO.items ?? []).forEach(item => {
        initialQtys[item.id] = (item.quantity - item.quantity_received).toString()
      })
      setRecvQuantities(initialQtys)
    }).catch(() => toast.error('Failed to load purchase items.'))
  }

  const handleReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!receiveTarget) return
    const payload = {
      items: (receiveTarget.items ?? []).map(item => ({
        purchase_item_id: item.id,
        quantity_received: parseFloat(recvQuantities[item.id]) || 0
      })).filter(i => i.quantity_received > 0)
    }
    if (payload.items.length === 0) {
      toast.error('Please input receiving quantity for at least one item.')
      return
    }
    receiveMutation.mutate({ id: receiveTarget.id, payload })
  }

  const totals = getFormTotals()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="print:hidden space-y-2">
        <Breadcrumb items={[{ label: t('nav.purchaseManagement', 'Purchase Management') }, { label: t('nav.purchaseOrders', 'Purchase Orders') }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              {t('nav.purchaseOrders', 'Purchase Orders')}
            </h1>
            <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
              {t('purchases.subtitle', 'Manage purchase orders, suppliers, receiving status, payments, inventory replenishment, and procurement operations.')}
            </p>
          </div>
          {activeWorkspaceTab !== 'list' ? (
            <button
              onClick={() => switchToTab('list')}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-border bg-card rounded-xl hover:bg-muted text-foreground transition-all self-start md:self-center text-xs font-bold shadow-xs cursor-pointer"
            >
              <ArrowLeft size={14} />
              {t('common.cancel', 'Back')}
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => switchToTab('create')}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                {t('purchases.createPO', 'Add Purchase')}
              </button>
            </div>
          )}
        </div>
      </div>

      {activeWorkspaceTab === 'list' ? (
        <>
          {/* Dashboard Metrics */}
          <PurchasesStatsCards
            reportData={reportData}
            purchases={purchases}
            suppliersCount={suppliers?.length ?? 0}
          />

          {/* Search & Action Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm print:hidden">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[280px] sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t('purchases.searchPlaceholder', 'Search Reference, Supplier, Invoice...')}
                  className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
                />
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 shadow-sm cursor-pointer ${
                  activeFiltersCount > 0 
                    ? 'bg-primary/10 border-primary/30 text-primary font-semibold' 
                    : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Filter size={14} className={activeFiltersCount > 0 ? 'text-primary' : 'text-muted-foreground'} />
                <span>{t('common.filter', 'Filter')}</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary text-white rounded-full leading-none">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <ResetButton onClick={handleResetFilters} label={t("common.reset", "Reset")} />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => {
                  qc.invalidateQueries({ queryKey: ['purchases'] })
                  qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
                }}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm cursor-pointer"
                title={t('common.refresh', 'Refresh')}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden print:hidden">
            <TableWrapper isFetching={isFetching}>
              <table className="w-full data-table">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th onClick={() => handleSort('reference_number')} className="sticky left-0 z-30 bg-background border-r border-border text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                      {t('purchases.reference', 'Reference')} {renderSortIcon('reference_number')}
                    </th>
                    <th onClick={() => handleSort('date')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                      {t('purchases.date', 'Date')} {renderSortIcon('date')}
                    </th>
                    <th onClick={() => handleSort('supplier_id')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                      {t('purchases.supplier', 'Supplier')} {renderSortIcon('supplier_id')}
                    </th>
                    <th onClick={() => handleSort('warehouse_id')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                      {t('purchases.warehouse', 'Warehouse')} {renderSortIcon('warehouse_id')}
                    </th>
                    <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                      {t('purchases.items', 'Items')}
                    </th>
                    <th onClick={() => handleSort('grand_total')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                      {t('purchases.grandTotal', 'Grand Total')} {renderSortIcon('grand_total')}
                    </th>
                    <th onClick={() => handleSort('payment_status')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                      {t('purchases.paymentStatus', 'Payment Status')} {renderSortIcon('payment_status')}
                    </th>
                    <th onClick={() => handleSort('status')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                      {t('purchases.status', 'Status')} {renderSortIcon('status')}
                    </th>
                    <th className="sticky right-0 z-30 bg-background border-l border-border text-center py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap min-w-[96px]">{t('common.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-12 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : purchases.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-16 text-center">
                        <ShoppingBag size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-muted-foreground text-sm font-medium">{t('purchases.noPurchasesFound', 'No purchase orders found')}</p>
                      </td>
                    </tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => handleViewPurchase(purchase)}>
                        <td className="sticky left-0 z-10 bg-background group-hover:bg-muted border-r border-border py-3 px-4 font-mono font-bold text-xs text-primary whitespace-nowrap">
                          {purchase.reference_number}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                          {purchase.date || '—'}
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground text-xs whitespace-nowrap">
                          {purchase.supplier?.name || '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                          {purchase.warehouse?.name || '—'}
                        </td>
                        <td className="py-3 px-4 text-xs text-foreground font-semibold whitespace-nowrap">
                          {purchase.items_count ?? (purchase.items ? purchase.items.length : 0)}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-xs text-foreground whitespace-nowrap">
                          {formatListDualCurrency(purchase.grand_total, purchase)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-xs font-bold">
                          <span className={PAYMENT_BADGE[purchase.payment_status] ?? 'px-2 py-0.5 rounded text-[11px] bg-muted'}>
                            {purchase.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-xs font-bold">
                          <span className={STATUS_BADGE[purchase.status] ?? 'px-2 py-0.5 rounded text-[11px] bg-muted'}>
                            {purchase.status}
                          </span>
                        </td>
                        <td className="sticky right-0 z-10 bg-background group-hover:bg-muted border-l border-border py-3 px-4 text-center whitespace-nowrap min-w-[96px]" onClick={(e) => e.stopPropagation()}>
                          <TableActionMenu
                            onView={() => handleViewPurchase(purchase)}
                            onEdit={purchase.status === 'draft' || purchase.status === 'ordered' ? () => switchToTab('edit', purchase) : undefined}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </TableWrapper>
            <Pagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              total={pagination.total}
              perPage={perPage}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
            />
          </div>
        </>
      ) : (
        /* Create & Edit PO Form Section */
        <PurchaseFormSection
          editPurchaseId={editPurchaseId}
          editLoading={editLoading}
          supplierId={supplierId}
          setSupplierId={setSupplierId}
          warehouseId={warehouseId}
          setWarehouseId={setWarehouseId}
          branchId={branchId}
          setBranchId={setBranchId}
          poDate={poDate}
          setPoDate={setPoDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
          currencyCode={currencyCode}
          handleCurrencyChange={handleCurrencyChange}
          exchangeRate={exchangeRate}
          setExchangeRate={setExchangeRate}
          shippingCost={shippingCost}
          setShippingCost={setShippingCost}
          notes={notes}
          setNotes={setNotes}
          formItems={formItems}
          updateFormItem={updateFormItem}
          removeFormItem={removeFormItem}
          addProductToForm={addProductToForm}
          suppliers={suppliers || []}
          warehouses={warehouses || []}
          branches={branches || []}
          filteredProducts={filteredProducts}
          prodSearch={prodSearch}
          setProdSearch={setProdSearch}
          prodDropdownOpen={prodDropdownOpen}
          setProdDropdownOpen={setProdDropdownOpen}
          totals={totals}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleFormSubmit}
          onCancel={() => switchToTab('list')}
        />
      )}

      {/* Detail Side Drawer */}
      <PurchaseDetailDrawer
        selectedPurchase={selectedPurchase}
        onClose={() => setSelectedPurchase(null)}
        onOpenReceive={openReceiveModal}
        onOpenPayment={() => { setPaymentModalOpen(true); setPaymentAmount(''); setPaymentNotes('') }}
        onOpenCancel={(po) => setCancelTarget(po)}
      />

      {/* Shipment Receiving Modal */}
      <AnimatePresence>
        {receiveTarget && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-bold text-base text-foreground">
                  Receive Shipment (PO #{receiveTarget.reference_number})
                </h3>
                <button onClick={() => setReceiveTarget(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleReceiveSubmit} className="p-6 space-y-4 text-xs">
                <p className="text-muted-foreground">
                  {t('purchases.receiveShipmentInstructions', 'Input quantities delivered by supplier. Incremented values will automatically update inventory stocks.')}
                </p>

                <div className="border border-border rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="py-2.5 px-3 font-semibold text-muted-foreground">{t('purchases.product', 'Product')}</th>
                        <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center w-20">{t('purchases.ordered', 'Ordered')}</th>
                        <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center w-20">{t('purchases.received', 'Received')}</th>
                        <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center w-28">{t('purchases.toReceive', 'To Receive')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(receiveTarget.items ?? []).map((item) => {
                        const maxAllowed = item.quantity - item.quantity_received
                        return (
                          <tr key={item.id}>
                            <td className="py-3 px-3 font-semibold text-foreground">
                              {item.product_name ?? item.product?.name ?? `Product #${item.product_id}`}
                            </td>
                            <td className="py-3 px-3 text-center text-foreground">{item.quantity}</td>
                            <td className="py-3 px-3 text-center text-emerald-600 font-semibold">{item.quantity_received}</td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max={maxAllowed}
                                value={recvQuantities[item.id] || ''}
                                onChange={(e) => setRecvQuantities({ ...recvQuantities, [item.id]: e.target.value })}
                                className="form-input w-full p-1 text-center border border-border rounded-lg text-xs"
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setReceiveTarget(null)}
                    className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={receiveMutation.isPending}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {receiveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    {t('purchases.recordStockIn', 'Record Stock In')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-rose-500 font-bold">
                  <ShieldAlert size={18} />
                  <span>{t('purchases.cancelPOTitle', 'Cancel Purchase Order')}</span>
                </div>
                <button onClick={() => setCancelTarget(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                {t('purchases.cancelPOPrompt', 'Are you sure you want to cancel purchase order')} <strong>PO #{cancelTarget.reference_number}</strong>?
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => cancelMutation.mutate(cancelTarget.id)}
                  disabled={cancelMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-sm hover:bg-rose-700 cursor-pointer disabled:opacity-50"
                >
                  {cancelMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Record Payment Modal */}
      <AnimatePresence>
        {paymentModalOpen && selectedPurchase && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <DollarSign size={18} className="text-primary" />
                  <span>{t('purchases.recordPayment', 'Record Payment')}</span>
                </div>
                <button onClick={() => setPaymentModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const amt = parseFloat(paymentAmount)
                  if (!amt || amt <= 0) { toast.error('Please enter a valid payment amount.'); return }
                  paymentMutation.mutate({ id: selectedPurchase.id, amount: amt, notes: paymentNotes })
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Amount ({selectedPurchase.currency_code}) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    max={selectedPurchase.due_amount}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={`Max: ${formatCurrency(selectedPurchase.due_amount, selectedPurchase.currency_code)}`}
                    required
                    className="form-input text-xs w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">Notes</label>
                  <input
                    type="text"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Bank reference #..."
                    className="form-input text-xs w-full"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentMutation.isPending}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-90 cursor-pointer disabled:opacity-50"
                  >
                    {paymentMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : 'Record Payment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filter Drawer */}
      <PurchasesFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        suppliers={suppliers || []}
        warehouses={warehouses || []}
        users={users || []}
        supplierFilter={supplierFilter}
        setSupplierFilter={setSupplierFilter}
        warehouseFilter={warehouseFilter}
        setWarehouseFilter={setWarehouseFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        setPaymentStatusFilter={setPaymentStatusFilter}
        purchaseDateStartFilter={purchaseDateStartFilter}
        setPurchaseDateStartFilter={setPurchaseDateStartFilter}
        purchaseDateEndFilter={purchaseDateEndFilter}
        setPurchaseDateEndFilter={setPurchaseDateEndFilter}
        dueDateStartFilter={dueDateStartFilter}
        setDueDateStartFilter={setDueDateStartFilter}
        dueDateEndFilter={dueDateEndFilter}
        setDueDateEndFilter={setDueDateEndFilter}
        minAmountFilter={minAmountFilter}
        setMinAmountFilter={setMinAmountFilter}
        maxAmountFilter={maxAmountFilter}
        setMaxAmountFilter={setMaxAmountFilter}
        createdByFilter={createdByFilter}
        setCreatedByFilter={setCreatedByFilter}
        onReset={handleResetFilters}
        setPage={setPage}
      />
    </div>
  )
}

export default PurchasesPage
