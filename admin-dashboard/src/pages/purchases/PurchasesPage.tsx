import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Eye, RefreshCw, X, ShoppingBag, CheckCircle, Trash2, Loader2,
  Printer, Download, DollarSign, Calendar, Landmark, Warehouse as WarehouseIcon,
  Tag, Percent, PlusCircle, ArrowLeft, Trash, Save, Edit, RefreshCw as ResetIcon,
  ChevronUp, ChevronDown
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

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
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['purchases', page, debouncedSearch, perPage, statusFilter, supplierFilter, warehouseFilter, sortBy, sortOrder],
    queryFn: () => api.get('/purchases', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        status: statusFilter,
        supplier_id: supplierFilter,
        warehouse_id: warehouseFilter,
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

  const handlePrint = () => {
    window.print()
  }

  const totals = getFormTotals()

  return (
    <div className="space-y-6">
      {/* ─── BREADCRUMB & HEADER ────────────────────────────────────────────── */}
      <div className="print:hidden space-y-2">
        <Breadcrumb items={[{ label: t('nav.purchaseManagement') }, { label: t('nav.purchaseOrders') }]} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader
            title={t('nav.purchaseOrders')}
            subtitle="Create, audit, receive and manage purchase orders to suppliers."
          />
          {activeWorkspaceTab === 'list' ? (
            <button
              onClick={() => switchToTab('create')}
              className="btn-primary flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-semibold shadow-sm transition-all self-start sm:self-center"
            >
              <Plus size={16} />
              {t('purchases.createPO')}
            </button>
          ) : (
            <button
              onClick={() => switchToTab('list')}
              className="flex items-center gap-2 px-4 py-2.5 border border-border bg-card rounded-lg hover:bg-muted text-foreground transition-all self-start sm:self-center font-semibold"
            >
              <ArrowLeft size={16} />
              {t('common.cancel')}
            </button>
          )}
        </div>
      </div>

      {activeWorkspaceTab === 'list' ? (
        <>
          {/* ─── DASHBOARD METRICS ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
            <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('purchases.totalOrdered')}</span>
                <h3 className="text-xl font-bold text-foreground mt-1.5">
                  {formatCurrency((reportData?.total_purchases ?? 0) / 4100, 'USD')}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/15 text-blue-600 dark:text-blue-400 rounded-xl transition-all group-hover:scale-105">
                <Landmark size={20} />
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-amber-500" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('purchases.outstandingDue')}</span>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mt-1.5">
                  {formatCurrency((reportData?.total_due ?? 0) / 4100, 'USD')}
                </h3>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400 rounded-xl transition-all group-hover:scale-105">
                <DollarSign size={20} />
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('purchases.totalPaid')}</span>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mt-1.5">
                  {formatCurrency((reportData?.total_paid ?? 0) / 4100, 'USD')}
                </h3>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/15 text-green-600 dark:text-green-400 rounded-xl transition-all group-hover:scale-105">
                <Landmark size={20} />
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('purchases.receivedCount')}</span>
                <h3 className="text-xl font-bold text-foreground mt-1.5">
                  {reportData?.purchases_count ?? 0}
                </h3>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/15 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all group-hover:scale-105">
                <ShoppingBag size={20} />
              </div>
            </div>
          </div>

          {/* ─── FILTERS (HORIZONTAL & RESPONSIVE) ────────────────────────────── */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm print:hidden">
            <div className="flex flex-col xl:flex-row xl:items-center gap-4">
              <div className="relative flex-1 min-w-0">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search reference number or supplier..."
                  className="form-input pl-9 w-full bg-muted/40 hover:bg-muted border border-border rounded-lg text-sm py-2 px-3 focus:bg-background transition-all"
                />
              </div>

              {/* Filters alignment horizontal grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                  className="form-input text-sm border border-border rounded-lg p-2.5 bg-background min-w-[140px] w-full"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="ordered">Ordered</option>
                  <option value="partial">Partial</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={supplierFilter}
                  onChange={e => { setSupplierFilter(e.target.value); setPage(1) }}
                  className="form-input text-sm border border-border rounded-lg p-2.5 bg-background min-w-[160px] w-full"
                >
                  <option value="">All Suppliers</option>
                  {(suppliers ?? []).map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <select
                  value={warehouseFilter}
                  onChange={e => { setWarehouseFilter(e.target.value); setPage(1) }}
                  className="form-input text-sm border border-border rounded-lg p-2.5 bg-background min-w-[160px] w-full"
                >
                  <option value="">All Warehouses</option>
                  {(warehouses ?? []).map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setStatusFilter('')
                  setSupplierFilter('')
                  setWarehouseFilter('')
                  reset()
                }}
                className="px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg border border-border flex items-center justify-center gap-1.5 transition-all self-stretch xl:self-auto"
              >
                <ResetIcon size={14} />
                Reset Filters
              </button>
            </div>
          </div>

          {/* ─── DATA TABLE ────────────────────────────────────────────────────── */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden print:hidden">
            <TableWrapper isFetching={isFetching}>
              <table className="w-full data-table">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th onClick={() => handleSort('reference_number')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Reference {renderSortIcon('reference_number')}
                    </th>
                    <th onClick={() => handleSort('date')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Date {renderSortIcon('date')}
                    </th>
                    <th onClick={() => handleSort('supplier_id')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Supplier {renderSortIcon('supplier_id')}
                    </th>
                    <th onClick={() => handleSort('warehouse_id')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Warehouse {renderSortIcon('warehouse_id')}
                    </th>
                    <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Items
                    </th>
                    <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Subtotal
                    </th>
                    <th onClick={() => handleSort('grand_total')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Grand Total {renderSortIcon('grand_total')}
                    </th>
                    <th onClick={() => handleSort('payment_status')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Payment Status {renderSortIcon('payment_status')}
                    </th>
                    <th onClick={() => handleSort('status')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Status {renderSortIcon('status')}
                    </th>
                    <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">
                      Created By
                    </th>
                    <th className="text-right py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none whitespace-nowrap">Actions</th>
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
                        <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>
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
                        <td className="py-4 px-4 font-semibold text-primary text-sm font-mono whitespace-nowrap">
                          {purchase.reference_number}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(purchase.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-foreground whitespace-nowrap">
                          {purchase.supplier?.name}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                          {purchase.warehouse?.name}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground font-semibold whitespace-nowrap">
                          {purchase.items_count ?? purchase.items?.length ?? 0} {t('purchases.items', 'items')}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                          {formatListDualCurrency(purchase.subtotal, purchase)}
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-foreground whitespace-nowrap">
                          {formatListDualCurrency(purchase.grand_total, purchase)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={PAYMENT_BADGE[purchase.payment_status]}>
                            {purchase.payment_status}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={STATUS_BADGE[purchase.status]}>
                            {purchase.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground whitespace-nowrap">
                          {purchase.creator?.name || 'N/A'}
                        </td>
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
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md shadow-sm transition-all"            >
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
                  <button
                    onClick={handlePrint}
                    className="p-1.5 hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Printer size={15} />
                  </button>
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
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 flex items-center gap-1.5 transition-all shadow-sm"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-sm transition-all disabled:opacity-60"
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
    </div>
  )
}

export default PurchasesPage
