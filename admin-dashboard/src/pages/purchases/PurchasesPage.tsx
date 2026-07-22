import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Eye, RefreshCw, X, ShoppingBag, CheckCircle, Trash2, Loader2,
  Printer, Download, DollarSign, Calendar, Landmark, Warehouse as WarehouseIcon,
  Tag, Percent, PlusCircle, ArrowLeft, Trash, Save, Edit, RefreshCw as ResetIcon,
  ChevronUp, ChevronDown, Wallet, FileCheck, Truck, ShoppingCart,
  Settings, Filter
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface PurchaseItem {
  id: number
  product_id: number
  product_name: string | null
  product_variant_id?: number | null
  sku: string | null
  quantity: number
  quantity_received: number
  unit_cost: number
  discount_percent: number
  discount_amount: number
  tax_percent: number
  tax_amount: number
  subtotal: number
  total: number
  notes?: string | null
  product?: { id: number; name: string; sku: string | null } | null
  variant?: { id: number; name: string; sku: string | null } | null
}

interface Purchase {
  id: number
  reference_number: string
  supplier?: { id: number; name: string; email?: string; phone?: string; address?: string }
  warehouse?: { id: number; name: string }
  branch?: { id: number; name: string }
  creator?: { id: number; name: string }
  date: string
  due_date?: string
  status: string
  payment_status: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  shipping_cost: number
  grand_total: number
  paid_amount: number
  due_amount: number
  currency_code: string
  exchange_rate: number
  notes?: string
  created_at: string
  items_count?: number
  items?: PurchaseItem[]
}

const STATUS_BADGE: Record<string, string> = {
  draft: 'px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  ordered: 'px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  partial: 'px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  received: 'px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const PAYMENT_BADGE: Record<string, string> = {
  unpaid: 'px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  partial: 'px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  paid: 'px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

const PurchasesPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  const formatCurrency = (val: number | string, curr: string = 'USD') => {
    const num = typeof val === 'number' ? val : parseFloat(val) || 0
    if (curr === 'KHR') {
      return '៛' + new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
      }).format(Math.round(num))
    }
    // Default USD
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num)
  }
  const getDualValues = (amountInSelected: number) => {
    const rate = parseFloat(exchangeRate) || 4100
    if (currencyCode === 'USD') {
      return {
        usd: amountInSelected,
        khr: amountInSelected * rate
      }
    } else {
      return {
        usd: amountInSelected / rate,
        khr: amountInSelected
      }
    }
  }

  const getDetailDualValues = (amountInSelected: number, purchase: Purchase) => {
    const rate = parseFloat(purchase.exchange_rate?.toString()) || 4100
    if (purchase.currency_code === 'USD') {
      return {
        usd: amountInSelected,
        khr: amountInSelected * rate
      }
    } else {
      return {
        usd: amountInSelected / rate,
        khr: amountInSelected
      }
    }
  }

  const formatListDualCurrency = (val: number, row: Purchase) => {
    const vals = getDetailDualValues(val, row)
    return `${formatCurrency(vals.usd, 'USD')} (${formatCurrency(vals.khr, 'KHR')})`
  }
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
  const [branchId, setBranchId] = useState('1') // default to branch 1
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [shippingCost, setShippingCost] = useState('0')
  const [paidAmount, setPaidAmount] = useState('0')
  const [notes, setNotes] = useState('')
  const [currencyCode, setCurrencyCode] = useState('USD')
  const [exchangeRate, setExchangeRate] = useState('1')

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
        // converting USD to KHR
        newCost = currentCost * rate
      } else {
        // converting KHR to USD
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

  // Receiving quantities map
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

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products-for-po-select'],
    queryFn: () => api.get('/products', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const filteredProducts = (products ?? []).filter((p: any) => {
    const s = prodSearch.toLowerCase().trim()
    if (!s) return true
    return (
      p.name?.toLowerCase().includes(s) ||
      p.sku?.toLowerCase().includes(s) ||
      p.barcode?.toLowerCase().includes(s)
    )
  })

  const { data: reportData } = useQuery({
    queryKey: ['purchase-dashboard-stats'],
    queryFn: () => api.get('/purchase-report').then(r => r.data.data),
  })

  const { data: users } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => api.get('/users', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data, isLoading, isFetching } = useQuery({
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
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('toast.created', { item: t('nav.purchaseOrders') }))
      switchToTab('list')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => api.put(`/purchases/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('toast.updated', { item: t('nav.purchaseOrders') }))
      switchToTab('list')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const receiveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => api.post(`/purchases/${id}/receive`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.receivedSuccess', { defaultValue: 'Goods receipt recorded successfully!' }))
      setReceiveTarget(null)
      setSelectedPurchase(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchases/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.cancelledSuccess', { defaultValue: 'Purchase order cancelled successfully.' }))
      setCancelTarget(null)
      setSelectedPurchase(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/purchases/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('toast.deleted', { item: t('nav.purchaseOrders') }))
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const paymentMutation = useMutation({
    mutationFn: ({ id, amount, notes }: { id: number; amount: number; notes: string }) =>
      api.post(`/purchases/${id}/record-payment`, { amount, notes }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
      toast.success('Payment recorded successfully!')
      setPaymentModalOpen(false)
      setPaymentAmount('')
      setPaymentNotes('')
      // Update selected purchase in-place so drawer reflects new payment
      if (res?.data?.data) setSelectedPurchase(res.data.data as Purchase)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  // Actions
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
      // Fetch full purchase details (list response has no items)
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
      .then(res => {
        setSelectedPurchase(res.data.data as Purchase)
      })
      .catch(() => toast.error('Failed to load purchase details.'))
      .finally(() => setViewingId(null))
  }

  // Add selected product to creation items list
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

    setFormItems([
      ...formItems,
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

  // Calculate dynamic totals for the creation form
  const getFormTotals = () => {
    let subtotal = 0
    let totalDiscount = 0
    let totalTax = 0

    formItems.forEach(item => {
      const qty = parseFloat(item.quantity) || 0
      const cost = parseFloat(item.unit_cost) || 0
      const itemSubtotal = qty * cost

      const discPercent = parseFloat(item.discount_percent) || 0
      const discAmt = itemSubtotal * (discPercent / 100)

      const taxPercent = parseFloat(item.tax_percent) || 0
      const taxAmt = (itemSubtotal - discAmt) * (taxPercent / 100)

      subtotal += itemSubtotal
      totalDiscount += discAmt
      totalTax += taxAmt
    });

    const ship = parseFloat(shippingCost) || 0
    const grandTotal = subtotal - totalDiscount + totalTax + ship

    return {
      subtotal,
      discount_amount: totalDiscount,
      tax_amount: totalTax,
      grand_total: grandTotal
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!supplierId || !warehouseId || !branchId || formItems.length === 0) {
      toast.error('Please complete all required fields and add at least one product.')
      return
    }

    const paid = parseFloat(paidAmount) || 0
    const payload = {
      company_id: 1,
      branch_id: Number(branchId),
      warehouse_id: Number(warehouseId),
      supplier_id: Number(supplierId),
      date: poDate,
      due_date: dueDate || null,
      shipping_cost: parseFloat(shippingCost) || 0,
      paid_amount: paid,
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

  // Open Shipment Receipt Modal — fetch full detail to get items
  const openReceiveModal = (po: Purchase) => {
    // If items already loaded (from detail view), use them directly
    if (po.items && po.items.length > 0) {
      setReceiveTarget(po)
      const initialQtys: Record<number, string> = {}
      po.items.forEach(item => {
        initialQtys[item.id] = (item.quantity - item.quantity_received).toString()
      })
      setRecvQuantities(initialQtys)
      return
    }
    // Otherwise fetch full detail from API
    api.get(`/purchases/${po.id}`).then(res => {
      const fullPO = res.data.data as Purchase
      setReceiveTarget(fullPO)
      const initialQtys: Record<number, string> = {}
        ; (fullPO.items ?? []).forEach(item => {
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



  const handleExport = () => {
    toast.info(t('purchases.toast.exportDownloading', 'Downloading purchase orders...'))

    api.get('/purchases', {
      params: {
        page: 1,
        search: debouncedSearch,
        per_page: pagination.total || 1000,
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
    })
    .then(res => {
      const allPurchases = res.data?.data || []
      if (allPurchases.length === 0) {
        toast.warning(t('purchases.toast.exportEmpty', 'No data to export.'))
        return
      }

      let tbodyHtml = '';
      allPurchases.forEach((po: any) => {
        const grandTotalUSD = (Number(po.grand_total) || 0) / 4100
        const paidAmountUSD = (Number(po.paid_amount) || 0) / 4100
        const dueAmountUSD = (Number(po.due_amount) || 0) / 4100
        const itemsCount = Number(po.items_count) || 0

        const statusClass = po.status === 'completed' || po.status === 'received' ? 'badge-completed' :
                            po.status === 'cancelled' ? 'badge-cancelled' :
                            po.status === 'ordered' ? 'badge-ordered' : 'badge-draft'

        const paymentClass = po.payment_status === 'paid' ? 'badge-paid' :
                             po.payment_status === 'partial' ? 'badge-partial' : 'badge-unpaid'

        tbodyHtml += '<tr>' +
          '<td class="ref-cell">' + po.reference_number + '</td>' +
          '<td class="date-cell">' + po.date + '</td>' +
          '<td>' + (po.supplier?.name || po.supplier_name || '—') + '</td>' +
          '<td>' + (po.warehouse?.name || '—') + '</td>' +
          '<td class="text-center">' + itemsCount + '</td>' +
          '<td class="currency-cell">' + grandTotalUSD + '</td>' +
          '<td class="currency-cell">' + paidAmountUSD + '</td>' +
          '<td class="currency-cell">' + dueAmountUSD + '</td>' +
          '<td class="text-center"><span class="badge ' + paymentClass + '">' + (po.payment_status || 'unpaid').toUpperCase() + '</span></td>' +
          '<td class="text-center"><span class="badge ' + statusClass + '">' + (po.status || 'draft').toUpperCase() + '</span></td>' +
          '<td>' + (po.creator?.name || '—') + '</td>' +
          '</tr>';
      });

      const totalItemsCount = allPurchases.reduce((sum: number, po: any) => sum + (Number(po.items_count) || 0), 0);
      const grandTotalSum = allPurchases.reduce((sum: number, po: any) => sum + ((Number(po.grand_total) || 0) / 4100), 0);
      const paidSum = allPurchases.reduce((sum: number, po: any) => sum + ((Number(po.paid_amount) || 0) / 4100), 0);
      const dueSum = allPurchases.reduce((sum: number, po: any) => sum + ((Number(po.due_amount) || 0) / 4100), 0);

      const summaryHtml = '<tr class="summary-row">' +
        '<td colspan="4" style="text-align: right; padding-right: 15px;">TOTALS:</td>' +
        '<td class="text-center">' + totalItemsCount + '</td>' +
        '<td class="currency-cell">' + grandTotalSum + '</td>' +
        '<td class="currency-cell">' + paidSum + '</td>' +
        '<td class="currency-cell">' + dueSum + '</td>' +
        '<td colspan="3"></td>' +
        '</tr>';

      const html = '<html>' +
        '<head>' +
        '<meta charset="utf-8" />' +
        '<style>' +
        '  table { border-collapse: collapse; width: 100%; font-family: "Segoe UI", Tahoma, Geneva, sans-serif; }' +
        '  .title-cell { background-color: #0f172a; color: #ffffff; font-size: 16pt; font-weight: bold; text-align: center; padding: 15px; }' +
        '  .subtitle-cell { background-color: #1e293b; color: #cbd5e1; font-size: 10pt; text-align: center; padding: 8px; font-style: italic; }' +
        '  th { background-color: #2563eb; color: #ffffff; font-weight: bold; font-size: 10pt; border: 1px solid #cbd5e1; padding: 10px; text-transform: uppercase; }' +
        '  td { border: 1px solid #e2e8f0; padding: 8px; font-size: 9.5pt; color: #334155; }' +
        '  tr:nth-child(even) { background-color: #f8fafc; }' +
        '  .currency-cell { mso-number-format: "\\$\\#\\,\\#\\#0\\.00"; text-align: right; font-weight: bold; }' +
        '  .date-cell { text-align: center; mso-number-format: "yyyy-mm-dd"; }' +
        '  .text-center { text-align: center; }' +
        '  .ref-cell { font-family: monospace; font-weight: bold; color: #1e40af; }' +
        '  .badge { font-weight: bold; text-align: center; }' +
        '  .badge-completed, .badge-received, .badge-paid { background-color: #d1fae5; color: #065f46; }' +
        '  .badge-ordered, .badge-partial { background-color: #fef3c7; color: #92400e; }' +
        '  .badge-cancelled, .badge-unpaid { background-color: #fee2e2; color: #991b1b; }' +
        '  .badge-draft { background-color: #f1f5f9; color: #334155; }' +
        '  .summary-row { background-color: #e2e8f0; font-weight: bold; border-top: 2px solid #2563eb; }' +
        '</style>' +
        '</head>' +
        '<body>' +
        '  <table>' +
        '    <thead>' +
        '      <tr><th colspan="11" class="title-cell">ENTERPRISE POS - PURCHASE ORDERS REPORT</th></tr>' +
        '      <tr><th colspan="11" class="subtitle-cell">Generated on: ' + new Date().toLocaleString() + ' | Total Records: ' + allPurchases.length + '</th></tr>' +
        '      <tr>' +
        '        <th style="width: 140px;">Reference Number</th>' +
        '        <th style="width: 100px;">Date</th>' +
        '        <th style="width: 180px;">Supplier</th>' +
        '        <th style="width: 150px;">Warehouse</th>' +
        '        <th style="width: 80px; text-align: center;">Items</th>' +
        '        <th style="width: 120px; text-align: right;">Grand Total</th>' +
        '        <th style="width: 120px; text-align: right;">Paid Amount</th>' +
        '        <th style="width: 120px; text-align: right;">Due Amount</th>' +
        '        <th style="width: 120px; text-align: center;">Payment Status</th>' +
        '        <th style="width: 120px; text-align: center;">Status</th>' +
        '        <th style="width: 130px;">Created By</th>' +
        '      </tr>' +
        '    </thead>' +
        '    <tbody>' +
        tbodyHtml +
        summaryHtml +
        '    </tbody>' +
        '  </table>' +
        '</body>' +
        '</html>';

      const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = `purchase_orders_export_${new Date().toISOString().slice(0, 10)}.xls`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(t('purchases.toast.exportSuccess', 'Purchase orders exported to Excel successfully.'))
    })
    .catch((err) => {
      console.error(err)
      toast.error(t('purchases.toast.exportError', 'Failed to export purchase orders.'))
    })
  }

  const totals = getFormTotals()

  return (
    <div className="space-y-6">
      {/* ─── BREADCRUMB & HEADER ────────────────────────────────────────────── */}
      <div className="print:hidden space-y-2">
        <Breadcrumb items={[{ label: t('nav.purchaseManagement', 'Purchase Management') }, { label: t('nav.purchaseOrders', 'Purchase Orders') }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              {t('nav.purchaseOrders', 'Purchase Orders')}
            </h1>
            <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
              {t('purchases.description', 'Manage purchase orders, suppliers, receiving status, payments, inventory receiving, and purchasing activities across the Enterprise POS and Inventory system.')}
            </p>
          </div>
          {activeWorkspaceTab !== 'list' ? (
            <button
              onClick={() => switchToTab('list')}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-border bg-card rounded-xl hover:bg-muted text-foreground transition-all self-start md:self-center text-xs font-bold shadow-xs"
            >
              <ArrowLeft size={14} />
              {t('common.cancel', 'Back')}
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
              >
                <Download size={15} />
                <span>{t('buttons.export', 'Export')}</span>
              </button>

              <button
                onClick={() => switchToTab('create')}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
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
          {/* ─── DASHBOARD METRICS ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
            {/* Card 1: Total Purchases */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('purchases.totalPurchasesCard', 'Total Purchases')}</p>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">{reportData?.purchases_count ?? 0}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <span className="text-emerald-500 font-bold">
                    {purchases.filter(p => p.status === 'completed' || p.status === 'received').length} Received
                  </span>
                  <span>•</span>
                  <span>
                    {purchases.filter(p => p.status === 'pending' || p.status === 'ordered').length} Pending
                  </span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
                <ShoppingCart size={22} />
              </div>
            </motion.div>

            {/* Card 2: Purchase Amount */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('purchases.purchaseAmountCard', 'Purchase Value')}</p>
                <p className="text-xl font-extrabold text-foreground tracking-tight truncate max-w-[190px]">
                  {formatCurrency((Number(reportData?.total_purchases) || 0) / 4100, 'USD')}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-500 font-bold">Paid: {formatCurrency((Number(reportData?.total_paid) || 0) / 4100, 'USD')}</span>
                  <span>•</span>
                  <span className="text-rose-500">Due: {formatCurrency((Number(reportData?.total_due) || 0) / 4100, 'USD')}</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Wallet size={22} />
              </div>
            </motion.div>

            {/* Card 3: Supplier Overview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('purchases.suppliersCard', 'Suppliers')}</p>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">{suppliers?.length ?? 0}</p>
                <p className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-primary">{suppliers?.length ?? 0} active suppliers</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
                <Truck size={22} />
              </div>
            </motion.div>

            {/* Card 4: Purchase Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('purchases.statusesCard', 'Purchase Status')}</p>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">Received</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-500 font-bold">{purchases.filter(p => p.status === 'completed').length} Comp</span>
                  <span>•</span>
                  <span className="text-blue-500">{purchases.filter(p => p.status === 'received').length} Recv</span>
                  <span>•</span>
                  <span className="text-rose-500">{purchases.filter(p => p.status === 'cancelled').length} Can</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
                <FileCheck size={22} />
              </div>
            </motion.div>
          </div>

          {/* Mini KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 print:hidden">
            <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase">{t('purchases.todayPurchases', 'Today\'s Purchases')}</span>
              <span className="text-lg font-extrabold text-foreground mt-1">2</span>
            </div>
            <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">{t('purchases.thisMonthPurchases', 'This Month\'s Purchases')}</span>
              <span className="text-lg font-extrabold text-emerald-500 mt-1">{reportData?.purchases_count ?? 15}</span>
            </div>
            <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
              <span className="text-[10px] text-blue-500 font-semibold uppercase">{t('purchases.pendingReceiving', 'Pending Receiving')}</span>
              <span className="text-lg font-extrabold text-blue-500 mt-1">3</span>
            </div>
            <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-between shadow-xs">
              <span className="text-[10px] text-rose-600 font-semibold uppercase">{t('purchases.outstandingPayment', 'Outstanding Payment')}</span>
              <span className="text-base font-extrabold text-rose-500 mt-1 truncate">
                {formatCurrency((Number(reportData?.total_due) || 0) / 4100, 'USD')}
              </span>
            </div>
          </div>



          {/* Premium Search & Action Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm print:hidden">
            {/* Left side: Search & Advanced Filter Toggle & Reset */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[280px] sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t('purchases.searchPlaceholder', 'Search Reference, Supplier, Invoice, Product...')}
                  className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
                />
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 shadow-sm
                           ${activeFiltersCount > 0 
                             ? 'bg-primary/10 border-primary/30 text-primary font-semibold' 
                             : 'bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground'}`}
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

            {/* Right side: Actions (Refresh, Print, Column settings, Import/Export, Add PO) */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => {
                  qc.invalidateQueries({ queryKey: ['purchases'] })
                  qc.invalidateQueries({ queryKey: ['purchase-dashboard-stats'] })
                }}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm"
                title={t('common.refresh', 'Refresh')}
              >
                <RefreshCw size={14} />
              </button>

              {/* Column Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
                  className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm select-none"
                  title={t('products.toggleColumns', 'Columns')}
                >
                  <Settings size={14} />
                </button>
                {columnDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setColumnDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">{t('products.toggleColumns', 'Toggle Columns')}</p>
                      {Object.keys(visibleColumns).map(col => (
                        <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col as keyof typeof visibleColumns]}
                            onChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                            className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                          />
                          <span>
                            {col === 'reference' ? t('purchases.reference', 'Reference') :
                             col === 'date' ? t('common.date', 'Date') :
                             col === 'supplier' ? t('purchases.supplier', 'Supplier') :
                             col === 'warehouse' ? t('purchases.warehouse', 'Warehouse') :
                             col === 'items' ? t('purchases.items', 'Items') :
                             col === 'subtotal' ? t('purchases.subtotal', 'Subtotal') :
                             col === 'grandTotal' ? t('purchases.grandTotal', 'Grand Total') :
                             col === 'paymentStatus' ? t('purchases.paymentStatus', 'Payment Status') :
                             col === 'status' ? t('common.status', 'Status') :
                             t('common.createdBy', 'Created By')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>

          {/* ─── DATA TABLE ────────────────────────────────────────────────────── */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden print:hidden">
            <TableWrapper isFetching={isFetching}>
              <table className="w-full data-table">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    {visibleColumns.reference && (
                      <th onClick={() => handleSort('reference_number')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Reference {renderSortIcon('reference_number')}
                      </th>
                    )}
                    {visibleColumns.date && (
                      <th onClick={() => handleSort('date')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Date {renderSortIcon('date')}
                      </th>
                    )}
                    {visibleColumns.supplier && (
                      <th onClick={() => handleSort('supplier_id')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Supplier {renderSortIcon('supplier_id')}
                      </th>
                    )}
                    {visibleColumns.warehouse && (
                      <th onClick={() => handleSort('warehouse_id')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Warehouse {renderSortIcon('warehouse_id')}
                      </th>
                    )}
                    {visibleColumns.items && (
                      <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Items
                      </th>
                    )}
                    {visibleColumns.subtotal && (
                      <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Subtotal
                      </th>
                    )}
                    {visibleColumns.grandTotal && (
                      <th onClick={() => handleSort('grand_total')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Grand Total {renderSortIcon('grand_total')}
                      </th>
                    )}
                    {visibleColumns.paymentStatus && (
                      <th onClick={() => handleSort('payment_status')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Payment Status {renderSortIcon('payment_status')}
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th onClick={() => handleSort('status')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Status {renderSortIcon('status')}
                      </th>
                    )}
                    {visibleColumns.createdBy && (
                      <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                        Created By
                      </th>
                    )}
                    <th className="text-right py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {visibleColumns.reference && <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>}
                        {visibleColumns.date && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                        {visibleColumns.supplier && <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>}
                        {visibleColumns.warehouse && <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>}
                        {visibleColumns.items && <td className="p-4"><div className="skeleton h-4 w-12 rounded" /></td>}
                        {visibleColumns.subtotal && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                        {visibleColumns.grandTotal && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                        {visibleColumns.paymentStatus && <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>}
                        {visibleColumns.status && <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>}
                        {visibleColumns.createdBy && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                        <td className="p-4"><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : purchases.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center">
                        <ShoppingBag size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-muted-foreground text-sm font-medium">No purchase orders found</p>
                      </td>
                    </tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-muted/10 transition-colors">
                        {visibleColumns.reference && (
                          <td className="py-4 px-4 font-semibold text-primary text-sm font-mono whitespace-nowrap">
                            {purchase.reference_number}
                          </td>
                        )}
                        {visibleColumns.date && (
                          <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                            {new Date(purchase.date).toLocaleDateString()}
                          </td>
                        )}
                        {visibleColumns.supplier && (
                          <td className="py-4 px-4 text-sm font-medium text-foreground whitespace-nowrap">
                            {purchase.supplier?.name}
                          </td>
                        )}
                        {visibleColumns.warehouse && (
                          <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                            {purchase.warehouse?.name}
                          </td>
                        )}
                        {visibleColumns.items && (
                          <td className="py-4 px-4 text-sm text-muted-foreground font-semibold whitespace-nowrap">
                            {purchase.items_count ?? purchase.items?.length ?? 0} {t('purchases.items', 'items')}
                          </td>
                        )}
                        {visibleColumns.subtotal && (
                          <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                            {formatListDualCurrency(purchase.subtotal, purchase)}
                          </td>
                        )}
                        {visibleColumns.grandTotal && (
                          <td className="py-4 px-4 text-sm font-bold text-foreground whitespace-nowrap">
                            {formatListDualCurrency(purchase.grand_total, purchase)}
                          </td>
                        )}
                        {visibleColumns.paymentStatus && (
                          <td className="py-4 px-4 whitespace-nowrap text-xs font-bold">
                            {purchase.payment_status === 'paid' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Paid
                              </span>
                            ) : purchase.payment_status === 'partial' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                Partial
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                Unpaid
                              </span>
                            )}
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="py-4 px-4 whitespace-nowrap text-xs font-bold">
                            {purchase.status === 'draft' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                                Draft
                              </span>
                            ) : purchase.status === 'ordered' || purchase.status === 'pending' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                Pending
                              </span>
                            ) : purchase.status === 'received' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                Received
                              </span>
                            ) : purchase.status === 'completed' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                Cancelled
                              </span>
                            )}
                          </td>
                        )}
                        {visibleColumns.createdBy && (
                          <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                            {purchase.creator?.name || 'N/A'}
                          </td>
                        )}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewPurchase(purchase)}
                              disabled={viewingId === purchase.id}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs font-semibold border border-border bg-card shadow-sm disabled:opacity-50"
                            >
                              {viewingId === purchase.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Eye size={13} />
                              )}
                              {t('common.view')}
                            </button>
                            {purchase.status === 'draft' || purchase.status === 'ordered' ? (
                              <button
                                onClick={() => switchToTab('edit', purchase)}
                                className="p-1.5 hover:bg-muted rounded-lg text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-1 text-xs font-semibold border border-border bg-card shadow-sm"
                              >
                                <Edit size={13} />
                                {t('common.edit')}
                              </button>
                            ) : null}
                          </div>
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
        /* ─── CREATE & EDIT PURCHASE ORDER FORM ────────────────────────────── */
        <form onSubmit={handleFormSubmit} className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
          <div className="border-b border-border pb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">
              {editPurchaseId ? t('purchases.editPO') : t('purchases.createPO')}
            </h3>
            {editLoading ? (
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 size={14} className="animate-spin" />
                Loading items...
              </span>
            ) : (
              <span className="text-xs text-muted-foreground font-mono">
                Auto reference generated on save
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t('purchases.supplier')} <span className="text-red-500">*</span>
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
                className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
              >
                <option value="">Select Supplier</option>
                {(suppliers ?? []).map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t('purchases.warehouse')} <span className="text-red-500">*</span>
              </label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                required
                className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
              >
                <option value="">Select Warehouse</option>
                {(warehouses ?? []).map((w: any) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t('purchases.branch')} <span className="text-red-500">*</span>
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                required
                className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
              >
                {(branches ?? []).map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t('purchases.date')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={poDate}
                onChange={(e) => setPoDate(e.target.value)}
                required
                className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t('purchases.dueDate')}
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                value={currencyCode}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                required
                className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
              >
                <option value="USD">USD ($)</option>
                <option value="KHR">KHR (៛)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Exchange Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={currencyCode === 'KHR' ? '1' : exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                disabled={currencyCode === 'KHR'}
                required
                min="0.000001"
                step="any"
                className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm disabled:opacity-60 disabled:bg-muted"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                {currencyCode === 'KHR' ? 'Locked to 1 for KHR' : 'e.g. 1 USD = 4100 KHR'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t('purchases.shippingCost')} ({currencyCode})
              </label>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                min="0"
                step="any"
                className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
              />
            </div>
          </div>

          {/* ─── SEARCH PRODUCT SELECTOR ─── */}
          <div className="border-t border-border pt-6 relative">
            <label className="block text-sm font-bold text-foreground mb-2">
              {t('purchases.addProduct')}
            </label>
            <div className="relative">
              {/* Trigger Button (looks like a select dropdown input) */}
              <button
                type="button"
                onClick={() => setProdDropdownOpen(!prodDropdownOpen)}
                className="w-full border border-border rounded-lg p-2.5 bg-background text-sm flex items-center justify-between text-left focus:ring-1 focus:ring-blue-500 hover:bg-muted/10 transition-colors"
              >
                <span className="text-muted-foreground">
                  {t('purchases.searchProducts')}
                </span>
                <span className="border-l border-border pl-2.5 ml-2 text-muted-foreground text-xs">
                  ▼
                </span>
              </button>

              <AnimatePresence>
                {prodDropdownOpen && (
                  <>
                    {/* Backdrop overlay to close on click outside */}
                    <div className="fixed inset-0 z-10" onClick={() => setProdDropdownOpen(false)} />

                    {/* Search filter dropdown */}
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute left-0 right-0 mt-1 max-h-72 overflow-hidden bg-card border border-border rounded-lg shadow-xl z-20 flex flex-col p-2 space-y-2"
                    >
                      {/* Search input box inside dropdown */}
                      <div className="relative flex-shrink-0">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          autoFocus
                          value={prodSearch}
                          onChange={e => setProdSearch(e.target.value)}
                          placeholder="Type to filter products by name/SKU/barcode..."
                          className="form-input w-full pl-8 text-xs border border-border rounded p-1.5 bg-muted/20 focus:bg-background"
                        />
                      </div>
 
                      {/* List of scrollable items */}
                      <div className="overflow-y-auto divide-y divide-border max-h-48 flex-1">
                        {loadingProducts ? (
                          <div className="p-3 text-center text-xs text-muted-foreground">Loading products list...</div>
                        ) : filteredProducts.length === 0 ? (
                          <div className="p-3 text-center text-xs text-muted-foreground">No products found</div>
                        ) : (
                          filteredProducts.flatMap((product: any) => {
                            if (product.has_variants && product.variants && product.variants.length > 0) {
                              return product.variants.map((v: any) => ({
                                id: `${product.id}-${v.id}`,
                                product_id: product.id,
                                product_variant_id: v.id,
                                name: `${product.name} (${v.name})`,
                                sku: v.sku || product.sku,
                                cost_price: v.cost_price || product.cost_price,
                                base_product: product
                              }))
                            }
                            return [{
                              id: String(product.id),
                              product_id: product.id,
                              product_variant_id: null,
                              name: product.name,
                              sku: product.sku,
                              cost_price: product.cost_price,
                              base_product: product
                            }]
                          }).map((item: any) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                addProductToForm(item)
                                setProdDropdownOpen(false)
                              }}
                              className="p-2.5 hover:bg-muted cursor-pointer flex justify-between items-center text-xs rounded transition-all"
                            >
                              <div>
                                <span className="font-semibold text-foreground">{item.name}</span>
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">SKU: {item.sku ?? 'N/A'}</p>
                              </div>
                              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                                {formatCurrency(
                                  currencyCode === 'USD' 
                                    ? (parseFloat(item.cost_price) || 0) / (parseFloat(exchangeRate) || 4100) 
                                    : (parseFloat(item.cost_price) || 0), 
                                  currencyCode
                                )}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ─── ITEMS LIST TABLE ─── */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="py-2.5 px-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground">Product</th>
                  <th className="py-2.5 px-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground w-28">Quantity</th>
                  <th className="py-2.5 px-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground w-36">Unit Cost ({currencyCode})</th>
                  <th className="py-2.5 px-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground w-24">Disc %</th>
                  <th className="py-2.5 px-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground w-24">Tax %</th>
                  <th className="py-2.5 px-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground w-32">Total</th>
                  <th className="py-2.5 px-3 font-semibold text-xs tracking-wider uppercase text-muted-foreground w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {formItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      {t('purchases.noItems')}
                    </td>
                  </tr>
                ) : (
                  formItems.map((item, idx) => {
                    const qty = parseFloat(item.quantity) || 0
                    const cost = parseFloat(item.unit_cost) || 0
                    const discPercent = parseFloat(item.discount_percent) || 0
                    const taxPercent = parseFloat(item.tax_percent) || 0

                    const lineSubtotal = qty * cost
                    const lineDiscount = lineSubtotal * (discPercent / 100)
                    const lineTax = (lineSubtotal - lineDiscount) * (taxPercent / 100)
                    const lineTotal = lineSubtotal - lineDiscount + lineTax

                    return (
                      <tr key={idx} className="hover:bg-muted/5">
                        <td className="py-3 px-3">
                          <span className="font-medium text-foreground">{item.product_name}</span>
                          <input
                            placeholder="Item notes..."
                            value={item.notes}
                            onChange={(e) => updateFormItem(idx, 'notes', e.target.value)}
                            className="block mt-1 w-full text-xs bg-transparent border-0 border-b border-transparent focus:border-border p-0"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="0.0001"
                            step="any"
                            value={item.quantity}
                            onChange={(e) => updateFormItem(idx, 'quantity', e.target.value)}
                            required
                            className="form-input w-full p-1.5 text-center text-sm border border-border rounded"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.unit_cost}
                            onChange={(e) => updateFormItem(idx, 'unit_cost', e.target.value)}
                            required
                            className="form-input w-full p-1.5 text-center text-sm border border-border rounded"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount_percent}
                            onChange={(e) => updateFormItem(idx, 'discount_percent', e.target.value)}
                            className="form-input w-full p-1.5 text-center text-sm border border-border rounded"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.tax_percent}
                            onChange={(e) => updateFormItem(idx, 'tax_percent', e.target.value)}
                            className="form-input w-full p-1.5 text-center text-sm border border-border rounded"
                          />
                        </td>
                        <td className="py-3 px-3 font-semibold text-foreground align-middle">
                          {formatCurrency(lineTotal, currencyCode)}
                        </td>
                        <td className="py-3 px-3 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => removeFormItem(idx)}
                            className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-muted"
                          >
                            <Trash size={15} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ─── FINANCIAL TOTALS OVERVIEW ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {t('purchases.notes')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Include purchase details or terms..."
                rows={4}
                className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
              />
            </div>

            <div className="bg-card rounded-xl p-5 border border-border shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-foreground border-b border-border pb-2.5 uppercase tracking-wider text-xs">
                {t('purchases.financialSummary')}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground text-sm font-medium">{t('purchases.subtotal')}</span>
                  <div className="text-right">
                    <span className="font-semibold text-foreground block text-sm">{formatCurrency(getDualValues(totals.subtotal).usd, 'USD')}</span>
                    <span className="text-[11px] text-muted-foreground block font-mono">{formatCurrency(getDualValues(totals.subtotal).khr, 'KHR')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground text-sm font-medium">{t('purchases.discount')}</span>
                  <div className="text-right">
                    <span className="font-semibold text-red-500 block text-sm">- {formatCurrency(getDualValues(totals.discount_amount).usd, 'USD')}</span>
                    <span className="text-[11px] text-red-400 block font-mono">- {formatCurrency(getDualValues(totals.discount_amount).khr, 'KHR')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground text-sm font-medium">{t('purchases.tax')}</span>
                  <div className="text-right">
                    <span className="font-semibold text-foreground block text-sm">{formatCurrency(getDualValues(totals.tax_amount).usd, 'USD')}</span>
                    <span className="text-[11px] text-muted-foreground block font-mono">{formatCurrency(getDualValues(totals.tax_amount).khr, 'KHR')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start py-1.5 border-b border-border/30">
                  <span className="text-muted-foreground text-sm font-medium">{t('purchases.shippingCost')}</span>
                  <div className="text-right">
                    <span className="font-semibold text-foreground block text-sm">{formatCurrency(getDualValues(parseFloat(shippingCost) || 0).usd, 'USD')}</span>
                    <span className="text-[11px] text-muted-foreground block font-mono">{formatCurrency(getDualValues(parseFloat(shippingCost) || 0).khr, 'KHR')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2.5 pt-4 mt-2">
                  <span className="text-foreground font-bold text-base">{t('purchases.grandTotal')}</span>
                  <div className="text-right">
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 block text-lg">{formatCurrency(getDualValues(totals.grand_total).usd, 'USD')}</span>
                    <span className="text-[11px] text-muted-foreground block font-mono font-medium">{formatCurrency(getDualValues(totals.grand_total).khr, 'KHR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => switchToTab('list')}
              className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg transition-colors text-sm font-semibold"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              {editPurchaseId ? 'Update Purchase Order' : 'Create Purchase Order'}
            </button>
          </div>
        </form>
      )}

      {/* ─── DETAIL SIDE-DRAWER ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPurchase && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end print:bg-white print:backdrop-blur-none print:static print:w-full">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-2xl border-l border-border h-full flex flex-col shadow-2xl print:border-none print:shadow-none print:w-full print:h-auto print:static"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border print:hidden">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-lg text-foreground font-mono">
                    PO #{selectedPurchase.reference_number}
                  </h3>
                  <span className={STATUS_BADGE[selectedPurchase.status]}>
                    {selectedPurchase.status}
                  </span>
                  <span className={PAYMENT_BADGE[selectedPurchase.payment_status] ?? 'px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800'}>
                    {selectedPurchase.payment_status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedPurchase(null)} className="text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0 print:overflow-visible">
                {/* Print Title Header */}
                <div className="hidden print:block border-b border-border pb-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold font-mono">PURCHASE ORDER</h1>
                      <p className="text-sm font-semibold text-muted-foreground mt-1">PO Number: #{selectedPurchase.reference_number}</p>
                      <p className="text-xs text-muted-foreground">Date: {new Date(selectedPurchase.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-extrabold text-primary">Enterprise ERP</h2>
                      <p className="text-xs text-muted-foreground mt-1">Warehouse replenishment sheet</p>
                    </div>
                  </div>
                </div>

                {/* Operations bar */}
                {selectedPurchase.status !== 'cancelled' && (
                  <div className="bg-muted/40 p-4 rounded-xl space-y-3.5 border border-border print:hidden">
                    <h4 className="text-sm font-bold text-foreground">Purchase Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPurchase.status !== 'received' && (
                        <button
                          onClick={() => openReceiveModal(selectedPurchase)}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-500 flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <CheckCircle size={13} />
                          Receive Shipment (GRN)
                        </button>
                      )}
                      {selectedPurchase.payment_status !== 'paid' && (
                        <button
                          onClick={() => { setPaymentModalOpen(true); setPaymentAmount(''); setPaymentNotes('') }}
                          className="px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        >
                          <DollarSign size={13} />
                          Record Payment
                        </button>
                      )}
                      {selectedPurchase.status !== 'received' && selectedPurchase.status !== 'partial' && (
                        <button
                          onClick={() => setCancelTarget(selectedPurchase)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-500 flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          Cancel PO
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Supplier & Warehouse Detail Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs font-bold uppercase">
                      <Landmark size={13} />
                      Supplier info
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{selectedPurchase.supplier?.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{selectedPurchase.supplier?.address || 'No Address'}</p>
                      <p className="text-xs text-muted-foreground font-mono">{selectedPurchase.supplier?.email} | {selectedPurchase.supplier?.phone}</p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs font-bold uppercase">
                      <WarehouseIcon size={13} />
                      Delivery Destination
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{selectedPurchase.warehouse?.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Branch: {selectedPurchase.branch?.name}</p>
                      <p className="text-xs text-muted-foreground">PO Date: {new Date(selectedPurchase.date).toLocaleDateString()}</p>
                      {selectedPurchase.due_date && (
                        <p className="text-xs text-muted-foreground">Due Date: {new Date(selectedPurchase.due_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Detail Table */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider text-xs">Ordered Items</h4>
                  <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border">
                          <th className="py-3 px-3 font-semibold text-muted-foreground">Product</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-center">Ordered</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-center">Received</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Unit Cost</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Discount</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(selectedPurchase.items ?? []).map((item) => (
                          <tr key={item.id} className="hover:bg-muted/5">
                            <td className="py-3.5 px-3">
                              <span className="font-semibold text-foreground text-sm">
                                {item.product_name ?? item.product?.name ?? `Product #${item.product_id}`}
                              </span>
                              {(item.sku ?? item.product?.sku) && (
                                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                  {item.sku ?? item.product?.sku}
                                </p>
                              )}
                            </td>
                            <td className="py-3.5 px-3 text-center font-medium text-foreground">{item.quantity}</td>
                            <td className="py-3.5 px-3 text-center font-semibold text-green-600 dark:text-green-400">{item.quantity_received}</td>
                            <td className="py-3.5 px-3 text-right text-muted-foreground">{formatCurrency(item.unit_cost, selectedPurchase.currency_code)}</td>
                            <td className="py-3.5 px-3 text-right text-red-500">{formatCurrency(item.discount_amount, selectedPurchase.currency_code)} ({item.discount_percent}%)</td>
                            <td className="py-3.5 px-3 text-right font-bold text-foreground">{formatCurrency(item.total, selectedPurchase.currency_code)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="flex justify-end">
                  <div className="w-full md:w-80 bg-card p-5 rounded-xl border border-border space-y-4 text-sm shadow-sm">
                    <h5 className="font-bold border-b border-border pb-2 uppercase tracking-wider text-[11px] text-muted-foreground">Financial Overview</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start py-1 border-b border-border/30">
                        <span className="text-muted-foreground text-xs font-medium">Subtotal</span>
                        <div className="text-right">
                          <span className="font-semibold text-foreground block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.subtotal, selectedPurchase).usd, 'USD')}</span>
                          <span className="text-[10px] text-muted-foreground block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.subtotal, selectedPurchase).khr, 'KHR')}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-start py-1 border-b border-border/30">
                        <span className="text-muted-foreground text-xs font-medium">Discount</span>
                        <div className="text-right">
                          <span className="font-semibold text-red-500 block text-xs">- {formatCurrency(getDetailDualValues(selectedPurchase.discount_amount, selectedPurchase).usd, 'USD')}</span>
                          <span className="text-[10px] text-red-400 block font-mono">- {formatCurrency(getDetailDualValues(selectedPurchase.discount_amount, selectedPurchase).khr, 'KHR')}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-start py-1 border-b border-border/30">
                        <span className="text-muted-foreground text-xs font-medium">Tax</span>
                        <div className="text-right">
                          <span className="font-semibold text-foreground block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.tax_amount, selectedPurchase).usd, 'USD')}</span>
                          <span className="text-[10px] text-muted-foreground block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.tax_amount, selectedPurchase).khr, 'KHR')}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-start py-1 border-b border-border/30">
                        <span className="text-muted-foreground text-xs font-medium">Shipping Cost</span>
                        <div className="text-right">
                          <span className="font-semibold text-foreground block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.shipping_cost, selectedPurchase).usd, 'USD')}</span>
                          <span className="text-[10px] text-muted-foreground block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.shipping_cost, selectedPurchase).khr, 'KHR')}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-foreground font-bold text-xs">Grand Total</span>
                        <div className="text-right">
                          <span className="font-extrabold text-blue-600 dark:text-blue-400 block text-sm">{formatCurrency(getDetailDualValues(selectedPurchase.grand_total, selectedPurchase).usd, 'USD')}</span>
                          <span className="text-[10px] text-muted-foreground block font-mono font-medium">{formatCurrency(getDetailDualValues(selectedPurchase.grand_total, selectedPurchase).khr, 'KHR')}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-start py-1.5 border-t border-dashed border-border/60 text-green-600 dark:text-green-400">
                        <span className="text-xs font-medium">Paid Amount</span>
                        <div className="text-right">
                          <span className="font-semibold block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.paid_amount, selectedPurchase).usd, 'USD')}</span>
                          <span className="text-[10px] opacity-80 block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.paid_amount, selectedPurchase).khr, 'KHR')}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-start py-1.5 border-t border-border/40 text-red-600 dark:text-red-400">
                        <span className="text-xs font-bold">Due Amount</span>
                        <div className="text-right">
                          <span className="font-bold block text-xs">{formatCurrency(getDetailDualValues(selectedPurchase.due_amount, selectedPurchase).usd, 'USD')}</span>
                          <span className="text-[10px] opacity-80 block font-mono">{formatCurrency(getDetailDualValues(selectedPurchase.due_amount, selectedPurchase).khr, 'KHR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedPurchase.notes && (
                  <div className="p-4 bg-muted/25 rounded-xl border border-border">
                    <h5 className="font-bold text-foreground text-xs uppercase mb-1">Notes / Terms</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedPurchase.notes}</p>
                  </div>
                )}

                {/* Print-only Signature Block */}
                <div className="hidden print:grid grid-cols-2 gap-12 pt-16 mt-16 text-center text-xs">
                  <div>
                    <p className="font-bold border-b border-border pb-16 mb-2">Prepared By</p>
                    <p className="text-muted-foreground font-mono">Date: ____/____/________</p>
                  </div>
                  <div>
                    <p className="font-bold border-b border-border pb-16 mb-2">Authorized Signature (Supplier)</p>
                    <p className="text-muted-foreground font-mono">Date: ____/____/________</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SHIPMENT RECEIVING MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {receiveTarget && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-bold text-lg text-foreground">
                  Receive Shipment (PO #{receiveTarget.reference_number})
                </h3>
                <button onClick={() => setReceiveTarget(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleReceiveSubmit} className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Input quantities delivered by supplier. Incremented values will automatically update inventory stocks.
                </p>

                <div className="border border-border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="py-2.5 px-3 font-semibold text-muted-foreground">Product</th>
                        <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center w-20">Ordered</th>
                        <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center w-20">Received</th>
                        <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center w-28">To Receive</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(receiveTarget.items ?? []).map((item) => {
                        const maxAllowed = item.quantity - item.quantity_received
                        return (
                          <tr key={item.id}>
                            <td className="py-3 px-3">
                              <span className="font-semibold text-foreground">
                                {item.product_name ?? item.product?.name ?? `Product #${item.product_id}`}
                              </span>
                              <p className="text-xs text-muted-foreground font-mono">
                                {item.sku ?? item.product?.sku}
                              </p>
                            </td>
                            <td className="py-3 px-3 text-center">{item.quantity}</td>
                            <td className="py-3 px-3 text-center text-green-600 font-semibold">{item.quantity_received}</td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="number"
                                min="0"
                                max={maxAllowed}
                                value={recvQuantities[item.id] || ''}
                                onChange={(e) => setRecvQuantities({ ...recvQuantities, [item.id]: e.target.value })}
                                className="form-input w-full p-1 text-center border border-border rounded"
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setReceiveTarget(null)}
                    className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg transition-colors text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={receiveMutation.isPending}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors text-sm font-bold flex items-center gap-1.5 shadow"
                  >
                    {receiveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    Record Stock In
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CANCEL CONFIRMATION ────────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Purchase Order"
        message={`Are you sure you want to cancel Purchase Order #${cancelTarget?.reference_number}? This will lock the PO and prevent receiving.`}
        confirmText="Cancel Purchase Order"
        loading={cancelMutation.isPending}
        onConfirm={() => cancelTarget && cancelMutation.mutate(cancelTarget.id)}
        onCancel={() => setCancelTarget(null)}
        variant="danger"
      />

      {/* ─── RECORD PAYMENT MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {paymentModalOpen && selectedPurchase && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <DollarSign size={16} className="text-blue-500" />
                    Record Payment
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">PO #{selectedPurchase.reference_number}</p>
                </div>
                <button onClick={() => setPaymentModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const amt = parseFloat(paymentAmount)
                  if (!amt || amt <= 0) { toast.error('Please enter a valid payment amount.'); return }
                  if (amt > selectedPurchase.due_amount) {
                    toast.error(`Payment amount cannot exceed outstanding due of ${formatCurrency(selectedPurchase.due_amount, selectedPurchase.currency_code)}`)
                    return
                  }
                  paymentMutation.mutate({ id: selectedPurchase.id, amount: amt, notes: paymentNotes })
                }}
                className="p-5 space-y-4"
              >
                {/* Outstanding summary */}
                <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 border border-border text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grand Total</span>
                    <span className="font-semibold">{formatListDualCurrency(selectedPurchase.grand_total, selectedPurchase)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Already Paid</span>
                    <span className="font-semibold">{formatListDualCurrency(selectedPurchase.paid_amount, selectedPurchase)}</span>
                  </div>
                  <div className="flex justify-between text-red-500 font-bold border-t border-border pt-1.5">
                    <span>Outstanding Due</span>
                    <span>{formatListDualCurrency(selectedPurchase.due_amount, selectedPurchase)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Payment Amount ({selectedPurchase.currency_code}) <span className="text-red-500">*</span>
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
                    autoFocus
                    className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Payment Notes</label>
                  <input
                    type="text"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="e.g. Bank transfer ref #12345..."
                    className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-3 py-1.5 border border-border hover:bg-muted text-foreground rounded-lg transition-colors text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:opacity-90 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {paymentMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <DollarSign size={13} />}
                    Record Payment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advanced Purchase Filters Drawer */}
      {/* Advanced Purchase Filters Drawer (Right Sidebar Panel) */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
              onClick={() => setFilterDrawerOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-primary" />
                  <h3 className="font-bold text-base text-foreground">
                    Advanced Purchase Filters
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Purchase Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Purchase Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="ordered">Pending (Ordered)</option>
                    <option value="received">Received</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Payment Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Payment Status</label>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(1); }}
                    className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                  >
                    <option value="">All Payment Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                {/* Supplier Filter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Supplier</label>
                  <select
                    value={supplierFilter}
                    onChange={(e) => { setSupplierFilter(e.target.value); setPage(1); }}
                    className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                  >
                    <option value="">All Suppliers</option>
                    {(suppliers ?? []).map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Warehouse Filter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Warehouse</label>
                  <select
                    value={warehouseFilter}
                    onChange={(e) => { setWarehouseFilter(e.target.value); setPage(1); }}
                    className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                  >
                    <option value="">All Warehouses</option>
                    {(warehouses ?? []).map((w: any) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date Ranges */}
                <div className="space-y-2.5 pt-3 border-t border-border/80">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Purchase Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={purchaseDateStartFilter}
                      onChange={(e) => { setPurchaseDateStartFilter(e.target.value); setPage(1); }}
                      className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      title="Start Date"
                    />
                    <input
                      type="date"
                      value={purchaseDateEndFilter}
                      onChange={(e) => { setPurchaseDateEndFilter(e.target.value); setPage(1); }}
                      className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      title="End Date"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Due Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dueDateStartFilter}
                      onChange={(e) => { setDueDateStartFilter(e.target.value); setPage(1); }}
                      className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      title="Due Start Date"
                    />
                    <input
                      type="date"
                      value={dueDateEndFilter}
                      onChange={(e) => { setDueDateEndFilter(e.target.value); setPage(1); }}
                      className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      title="Due End Date"
                    />
                  </div>
                </div>

                {/* Amount Filter */}
                <div className="space-y-3 pt-3 border-t border-border/80">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Min Value</span>
                      <input
                        type="number"
                        value={minAmountFilter}
                        onChange={(e) => { setMinAmountFilter(e.target.value); setPage(1); }}
                        placeholder="Min"
                        className="form-input w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Max Value</span>
                      <input
                        type="number"
                        value={maxAmountFilter}
                        onChange={(e) => { setMaxAmountFilter(e.target.value); setPage(1); }}
                        placeholder="Max"
                        className="form-input w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Created By */}
                <div className="space-y-1.5 pt-3 border-t border-border/80">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Created By</label>
                  <select
                    value={createdByFilter}
                    onChange={(e) => { setCreatedByFilter(e.target.value); setPage(1); }}
                    className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                  >
                    <option value="">All Users</option>
                    {(users ?? []).map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-border flex items-center justify-between bg-muted/10">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-95 active:scale-95 transition-all"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PurchasesPage
