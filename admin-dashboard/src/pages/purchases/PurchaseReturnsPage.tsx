import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Eye, RefreshCw, X, ArrowLeftRight, Loader2,
  CheckCircle, Trash2, Printer, Calendar, Tag, Info, Trash,
  ChevronUp, ChevronDown, RotateCcw, DollarSign, Wallet, Truck,
  Warehouse, Filter, Settings, Download
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

interface PurchaseReturnItem {
  id: number
  purchase_return_id: number
  purchase_item_id: number
  product_id: number
  product_variant_id?: number
  quantity: number
  unit_cost: number
  total: number
  notes?: string
  variant?: { name: string }
  product_name?: string | null
  sku?: string | null
}

interface PurchaseReturn {
  id: number
  reference_number: string
  purchase_id: number
  supplier?: { name: string; email?: string; phone?: string; address?: string }
  user?: { name: string }
  date: string
  total_amount: number
  reason?: string
  status: string
  created_at: string
  items: PurchaseReturnItem[]
  purchase?: { reference_number: string }
}

const STATUS_BADGE: Record<string, string> = {
  draft:     'px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  approved:  'px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const PurchaseReturnsPage: React.FC = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const qc = useQueryClient()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedReturn, setSelectedReturn] = useState<PurchaseReturn | null>(null)
  const [approveTarget, setApproveTarget] = useState<PurchaseReturn | null>(null)
  const [cancelTarget, setCancelTarget] = useState<PurchaseReturn | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PurchaseReturn | null>(null)

  const formatCurrency = (val: number | string, curr: string = 'USD') => {
    const num = typeof val === 'number' ? val : parseFloat(val) || 0
    if (curr === 'KHR') {
      return '៛' + new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
      }).format(Math.round(num))
    }
    return '$' + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  // Advanced filters state
  const [statusFilter, setStatusFilter] = useState('')
  const [refundStatusFilter, setRefundStatusFilter] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [purchaseRefFilter, setPurchaseRefFilter] = useState('')
  const [invoiceNoFilter, setInvoiceNoFilter] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [minReturnAmountFilter, setMinReturnAmountFilter] = useState('')
  const [maxReturnAmountFilter, setMaxReturnAmountFilter] = useState('')
  const [returnDateStartFilter, setReturnDateStartFilter] = useState('')
  const [returnDateEndFilter, setReturnDateEndFilter] = useState('')
  const [createdDateStartFilter, setCreatedDateStartFilter] = useState('')
  const [createdDateEndFilter, setCreatedDateEndFilter] = useState('')
  const [createdByFilter, setCreatedByFilter] = useState('')

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    reference: true,
    purchase: true,
    supplier: true,
    date: true,
    amount: true,
    status: true,
    actions: true
  })

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const activeFiltersCount = [
    statusFilter,
    refundStatusFilter,
    supplierFilter,
    purchaseRefFilter,
    invoiceNoFilter,
    warehouseFilter,
    categoryFilter,
    brandFilter,
    productFilter,
    minReturnAmountFilter,
    maxReturnAmountFilter,
    returnDateStartFilter,
    returnDateEndFilter,
    createdDateStartFilter,
    createdDateEndFilter,
    createdByFilter
  ].filter(Boolean).length

  const handleResetFilters = () => {
    setStatusFilter('')
    setRefundStatusFilter('')
    setSupplierFilter('')
    setPurchaseRefFilter('')
    setInvoiceNoFilter('')
    setWarehouseFilter('')
    setCategoryFilter('')
    setBrandFilter('')
    setProductFilter('')
    setMinReturnAmountFilter('')
    setMaxReturnAmountFilter('')
    setReturnDateStartFilter('')
    setReturnDateEndFilter('')
    setCreatedDateStartFilter('')
    setCreatedDateEndFilter('')
    setCreatedByFilter('')
    reset()
  }

  // Lookups for Filter selectors
  const { data: filterSuppliers } = useQuery({
    queryKey: ['filter-suppliers-list'],
    queryFn: () => api.get('/suppliers', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: filterWarehouses } = useQuery({
    queryKey: ['filter-warehouses-list'],
    queryFn: () => api.get('/warehouses', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: filterUsers } = useQuery({
    queryKey: ['filter-users-list'],
    queryFn: () => api.get('/users', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

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

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset
  } = useServerPagination({ storageKey: 'purchasereturns' })

  // Form states
  const [purchaseId, setPurchaseId] = useState('')
  const [reason, setReason] = useState('')
  const [returnItems, setReturnItems] = useState<any[]>([])
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState('draft')

  // Fetch list of purchases to create a return from (only received/partial ones)
  const { data: purchasesData } = useQuery({
    queryKey: ['purchases-list-for-returns'],
    queryFn: () => api.get('/purchases', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  // Fetch details of selected purchase order to populate items
  const { data: purchaseDetail, isFetching: loadingPurchaseDetails } = useQuery({
    queryKey: ['purchase-detail-for-return', purchaseId],
    queryFn: () => purchaseId ? api.get(`/purchases/${purchaseId}`).then(r => r.data.data) : null,
    enabled: !!purchaseId,
  })

  useEffect(() => {
    if (purchaseDetail) {
      // Map purchase items into return form items
      const items = purchaseDetail.items.map((item: any) => {
        const alreadyReturned = parseFloat(item.already_returned) || 0
        const qtyReceived = parseFloat(item.quantity_received) || 0
        const available = Math.max(0, qtyReceived - alreadyReturned)

        return {
          purchase_item_id: item.id,
          product_id: item.product_id,
          product_variant_id: item.product_variant_id || null,
          product_name: item.product_name || item.product?.name || `Product #${item.product_id}`,
          variant_name: item.variant?.name || '',
          sku: item.sku || item.product?.sku || '',
          quantity_ordered: parseFloat(item.quantity) || 0,
          quantity_received: qtyReceived,
          already_returned: alreadyReturned,
          available_to_return: available,
          quantity: '0', // user input
          unit_cost: parseFloat(item.unit_cost) || 0,
          discount_percent: parseFloat(item.discount_percent) || 0,
          tax_percent: parseFloat(item.tax_percent) || 0,
          notes: ''
        }
      })
      setReturnItems(items)
    } else {
      setReturnItems([])
    }
  }, [purchaseDetail])

  // Fetch returns list
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'purchase-returns', page, debouncedSearch, perPage, sortBy, sortOrder,
      statusFilter, refundStatusFilter, supplierFilter, purchaseRefFilter,
      invoiceNoFilter, warehouseFilter, categoryFilter, brandFilter,
      productFilter, minReturnAmountFilter, maxReturnAmountFilter,
      returnDateStartFilter, returnDateEndFilter, createdDateStartFilter,
      createdDateEndFilter, createdByFilter
    ],
    queryFn: () => api.get('/purchase-returns', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter || undefined,
        refund_status: refundStatusFilter || undefined,
        supplier_id: supplierFilter || undefined,
        purchase_reference: purchaseRefFilter || undefined,
        invoice_number: invoiceNoFilter || undefined,
        warehouse_id: warehouseFilter || undefined,
        category: categoryFilter || undefined,
        brand: brandFilter || undefined,
        product: productFilter || undefined,
        min_amount: minReturnAmountFilter || undefined,
        max_amount: maxReturnAmountFilter || undefined,
        return_date_start: returnDateStartFilter || undefined,
        return_date_end: returnDateEndFilter || undefined,
        created_date_start: createdDateStartFilter || undefined,
        created_date_end: createdDateEndFilter || undefined,
        created_by: createdByFilter || undefined
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const returns: PurchaseReturn[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newReturn: any) => api.post('/purchase-returns', newReturn),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.returnCreatedSuccess', { defaultValue: 'Purchase return created successfully.' }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const approveMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchase-returns/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.returnApprovedSuccess', { defaultValue: 'Purchase return approved. Inventory updated.' }))
      setApproveTarget(null)
      setSelectedReturn(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => api.post(`/purchase-returns/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.returnCancelledSuccess', { defaultValue: 'Purchase return cancelled.' }))
      setCancelTarget(null)
      setSelectedReturn(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/purchase-returns/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchase-returns'] })
      qc.invalidateQueries({ queryKey: ['purchases'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      qc.invalidateQueries({ queryKey: ['products-for-po-select'] })
      qc.invalidateQueries({ queryKey: ['inventory-levels'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements-list'] })
      qc.invalidateQueries({ queryKey: ['inventory-movements'] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      qc.invalidateQueries({ queryKey: ['low-stock'] })
      toast.success(t('purchases.toast.returnDeletedSuccess', { defaultValue: 'Purchase return deleted successfully.' }))
      setDeleteTarget(null)
      setSelectedReturn(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const handleExport = () => {
    toast.info(t('purchases.toast.returnExportDownloading', 'Downloading purchase returns...'))

    api.get('/purchase-returns', {
      params: {
        page: 1,
        search: debouncedSearch,
        per_page: pagination.total || 1000,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter || undefined,
        refund_status: refundStatusFilter || undefined,
        supplier_id: supplierFilter || undefined,
        purchase_reference: purchaseRefFilter || undefined,
        invoice_number: invoiceNoFilter || undefined,
        warehouse_id: warehouseFilter || undefined,
        category: categoryFilter || undefined,
        brand: brandFilter || undefined,
        product: productFilter || undefined,
        min_amount: minReturnAmountFilter || undefined,
        max_amount: maxReturnAmountFilter || undefined,
        return_date_start: returnDateStartFilter || undefined,
        return_date_end: returnDateEndFilter || undefined,
        created_date_start: createdDateStartFilter || undefined,
        created_date_end: createdDateEndFilter || undefined,
        created_by: createdByFilter || undefined
      }
    })
    .then(res => {
      const allReturns = res.data?.data || []
      if (allReturns.length === 0) {
        toast.warning(t('purchases.toast.returnExportEmpty', 'No data to export.'))
        return
      }

      let tbodyHtml = '';
      allReturns.forEach((item: any) => {
        const totalAmountUSD = (Number(item.total_amount) || 0) / 4100
        const itemsCount = item.items?.length || 0

        const statusClass = item.status === 'completed' || item.status === 'approved' ? 'badge-completed' :
                            item.status === 'cancelled' ? 'badge-cancelled' : 'badge-draft'

        tbodyHtml += '<tr>' +
          '<td class="ref-cell">' + item.reference_number + '</td>' +
          '<td class="ref-cell">' + (item.purchase?.reference_number ?? '—') + '</td>' +
          '<td>' + (item.supplier?.name ?? '—') + '</td>' +
          '<td class="date-cell">' + new Date(item.date).toLocaleDateString() + '</td>' +
          '<td class="text-center">' + itemsCount + '</td>' +
          '<td class="currency-cell">' + totalAmountUSD + '</td>' +
          '<td class="text-center"><span class="badge ' + statusClass + '">' + (item.status || 'draft').toUpperCase() + '</span></td>' +
          '<td>' + (item.reason || '—') + '</td>' +
          '<td>' + (item.user?.name ?? '—') + '</td>' +
          '</tr>';
      });

      const grandTotalSum = allReturns.reduce((sum: number, item: any) => sum + ((Number(item.total_amount) || 0) / 4100), 0);

      const summaryHtml = '<tr class="summary-row">' +
        '<td colspan="5" style="text-align: right; padding-right: 15px;">TOTALS:</td>' +
        '<td class="currency-cell">' + grandTotalSum + '</td>' +
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
        '  .badge-completed, .badge-approved { background-color: #d1fae5; color: #065f46; }' +
        '  .badge-cancelled { background-color: #fee2e2; color: #991b1b; }' +
        '  .badge-draft { background-color: #f1f5f9; color: #334155; }' +
        '  .summary-row { background-color: #e2e8f0; font-weight: bold; border-top: 2px solid #2563eb; }' +
        '</style>' +
        '</head>' +
        '<body>' +
        '  <table>' +
        '    <thead>' +
        '      <tr><th colspan="9" class="title-cell">ENTERPRISE POS - PURCHASE RETURNS REPORT</th></tr>' +
        '      <tr><th colspan="9" class="subtitle-cell">Generated on: ' + new Date().toLocaleString() + ' | Total Records: ' + allReturns.length + '</th></tr>' +
        '      <tr>' +
        '        <th style="width: 140px;">Return Reference</th>' +
        '        <th style="width: 140px;">Purchase Ref</th>' +
        '        <th style="width: 180px;">Supplier</th>' +
        '        <th style="width: 100px;">Date</th>' +
        '        <th style="width: 80px; text-align: center;">Items</th>' +
        '        <th style="width: 120px; text-align: right;">Total Amount</th>' +
        '        <th style="width: 120px; text-align: center;">Status</th>' +
        '        <th style="width: 200px;">Reason</th>' +
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
      link.download = `purchase_returns_export_${new Date().toISOString().slice(0, 10)}.xls`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(t('purchases.toast.returnExportSuccess', 'Purchase returns exported to Excel successfully.'))
    })
    .catch((err) => {
      console.error(err)
      toast.error(t('purchases.toast.returnExportError', 'Failed to export purchase returns.'))
    })
  }

  const openCreateModal = () => {
    setPurchaseId('')
    setReason('')
    setReturnItems([])
    setReturnDate(new Date().toISOString().split('T')[0])
    setStatus('draft')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleItemQtyChange = (idx: number, val: string) => {
    const updated = [...returnItems]
    updated[idx].quantity = val
    setReturnItems(updated)
  }

  const handleItemNotesChange = (idx: number, val: string) => {
    const updated = [...returnItems]
    updated[idx].notes = val
    setReturnItems(updated)
  }

  const getReturnTotal = () => {
    return returnItems.reduce((acc, item) => {
      const qty = parseFloat(item.quantity) || 0
      const cost = parseFloat(item.unit_cost) || 0
      return acc + (qty * cost)
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!purchaseId) return

    // Validate all items
    for (const item of returnItems) {
      const qty = parseFloat(item.quantity) || 0
      if (qty < 0) {
        toast.error('Return quantity cannot be negative.')
        return
      }
      if (qty > item.available_to_return) {
        toast.error(`Return quantity for "${item.product_name}" cannot exceed available quantity (${item.available_to_return}).`)
        return
      }
    }

    const itemsPayload = returnItems
      .map(item => ({
        purchase_item_id: item.purchase_item_id,
        product_id: item.product_id,
        product_variant_id: item.product_variant_id || null,
        quantity: parseFloat(item.quantity) || 0,
        unit_cost: parseFloat(item.unit_cost) || 0,
        notes: item.notes || null
      }))
      .filter(i => i.quantity > 0)

    if (itemsPayload.length === 0) {
      toast.error('Please input return quantity for at least one item.')
      return
    }

    const selectedPO = (purchasesData ?? []).find((p: any) => p.id === Number(purchaseId))

    createMutation.mutate({
      company_id: 1,
      purchase_id: Number(purchaseId),
      supplier_id: selectedPO?.supplier_id || 0,
      date: returnDate,
      reason: reason || 'Goods Return',
      status: status,
      items: itemsPayload,
    })
  }

  return (
    <div className="space-y-6">
      {/* ─── BREADCRUMB & HEADER ────────────────────────────────────────────── */}
      <div className="print:hidden space-y-2">
        <Breadcrumb items={[{ label: 'Purchases' }, { label: 'Returns' }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <RotateCcw className="h-6 w-6 text-primary" />
              Purchase Returns Management
            </h1>
            <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
              Manage returned purchase items, supplier returns, refund status, inventory adjustments, and return transactions across the Enterprise POS and Inventory system.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
            >
              <Download size={15} />
              <span>{t('buttons.export', 'Export')}</span>
            </button>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus size={16} />
              {t('purchases.createReturn', 'Create Return')}
            </button>
          </div>
        </div>
      </div>

      {/* ─── DASHBOARD METRICS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* Card 1: Total Purchase Returns */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Purchase Returns</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">{returns.length}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-500 font-bold">
                {returns.filter(r => r.status === 'completed' || r.status === 'approved').length} Active
              </span>
              <span>•</span>
              <span className="text-rose-500">
                {returns.filter(r => r.status === 'cancelled').length} Cancelled
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <RotateCcw size={22} />
          </div>
        </motion.div>

        {/* Card 2: Return Amount */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Return Amount</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight truncate max-w-[190px]">
              {formatCurrency(returns.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0) / 4100, 'USD')}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-500 font-bold">Refunded: {formatCurrency(returns.reduce((sum, r) => sum + (r.status === 'completed' ? Number(r.total_amount) : 0), 0) / 4100, 'USD')}</span>
              <span>•</span>
              <span className="text-rose-500">Pending: {formatCurrency(returns.reduce((sum, r) => sum + (r.status !== 'completed' ? Number(r.total_amount) : 0), 0) / 4100, 'USD')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
            <Wallet size={22} />
          </div>
        </motion.div>

        {/* Card 3: Supplier Return Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Supplier Return Activity</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">
              {new Set(returns.map(r => r.supplier?.name).filter(Boolean)).size} Suppliers
            </p>
            <p className="text-[11px] text-muted-foreground">
              Avg Return: {formatCurrency(returns.length ? (returns.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0) / returns.length) / 4100 : 0, 'USD')}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Truck size={22} />
          </div>
        </motion.div>

        {/* Card 4: Inventory Impact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Inventory Impact</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">
              {returns.reduce((sum, r) => sum + (r.items?.reduce((s, item) => s + (Number(item.quantity) || 0), 0) || 0), 0)} Items
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-500 font-bold">Restored: {returns.filter(r => r.status === 'approved').reduce((sum, r) => sum + (r.items?.reduce((s, item) => s + (Number(item.quantity) || 0), 0) || 0), 0)}</span>
              <span>•</span>
              <span className="text-rose-500">Damaged: 0</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
            <Warehouse size={22} />
          </div>
        </motion.div>
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
              placeholder="Search Return Ref, Purchase Ref, Supplier, Product, SKU..."
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
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary text-white rounded-full leading-none">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <ResetButton onClick={handleResetFilters} label="Reset" />
        </div>

        {/* Right side: Actions (Refresh, Print, Column settings, Export CSV, Create Return) */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['purchase-returns'] })}
            className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>

          {/* Column Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm select-none"
              title="Columns"
            >
              <Settings size={14} />
            </button>
            {columnDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setColumnDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">Toggle Columns</p>
                  {Object.keys(visibleColumns).map(col => (
                    <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                      <input
                        type="checkbox"
                        checked={visibleColumns[col as keyof typeof visibleColumns]}
                        onChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                        className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                      />
                      <span>
                        {col === 'reference' ? 'Return Reference' :
                         col === 'purchase' ? 'Purchase Ref' :
                         col === 'supplier' ? 'Supplier' :
                         col === 'date' ? 'Date' :
                         col === 'amount' ? 'Total Amount' :
                         col === 'status' ? 'Status' :
                         'Actions'}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

            </div>
      </div>

      {/* Table Container UI */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden print:hidden">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {visibleColumns.reference && (
                  <th onClick={() => handleSort('reference_number')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Reference {renderSortIcon('reference_number')}
                  </th>
                )}
                {visibleColumns.purchase && (
                  <th onClick={() => handleSort('purchase_id')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Purchase {renderSortIcon('purchase_id')}
                  </th>
                )}
                {visibleColumns.supplier && (
                  <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Supplier
                  </th>
                )}
                {visibleColumns.date && (
                  <th onClick={() => handleSort('date')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Date {renderSortIcon('date')}
                  </th>
                )}
                {visibleColumns.amount && (
                  <th onClick={() => handleSort('total_amount')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Total {renderSortIcon('total_amount')}
                  </th>
                )}
                {visibleColumns.status && (
                  <th onClick={() => handleSort('status')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Status {renderSortIcon('status')}
                  </th>
                )}
                <th className="text-left py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Created By
                </th>
                {visibleColumns.actions && (
                  <th className="text-right py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {visibleColumns.reference && <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>}
                    {visibleColumns.purchase && <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>}
                    {visibleColumns.supplier && <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>}
                    {visibleColumns.date && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                    {visibleColumns.amount && <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>}
                    {visibleColumns.status && <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>}
                    <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>
                    {visibleColumns.actions && <td className="p-4"><div className="skeleton h-4 w-12 rounded ml-auto" /></td>}
                  </tr>
                ))
              ) : returns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <ArrowLeftRight size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-sm font-semibold mb-3">No purchase returns found</p>
                    <button
                      onClick={openCreateModal}
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow hover:opacity-90 transition-opacity"
                    >
                      Create Purchase Return
                    </button>
                  </td>
                </tr>
              ) : (
                returns.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                    {visibleColumns.reference && (
                      <td className="py-4 px-4 font-semibold text-primary font-mono text-sm">
                        {item.reference_number}
                      </td>
                    )}
                    {visibleColumns.purchase && (
                      <td className="py-4 px-4 text-sm text-foreground">
                        {item.purchase?.reference_number ?? '—'}
                      </td>
                    )}
                    {visibleColumns.supplier && (
                      <td className="py-4 px-4 text-sm text-foreground">
                        {item.supplier?.name ?? '—'}
                      </td>
                    )}
                    {visibleColumns.date && (
                      <td className="py-4 px-4 text-sm text-muted-foreground font-mono">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                    )}
                    {visibleColumns.amount && (
                      <td className="py-4 px-4 text-sm font-bold text-foreground">
                        {formatCurrency(item.total_amount / 4100, 'USD')}
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td className="py-4 px-4">
                        {item.status === 'completed' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold capitalize">
                            Completed
                          </span>
                        ) : item.status === 'approved' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold capitalize">
                            Approved
                          </span>
                        ) : item.status === 'cancelled' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold capitalize">
                            Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold capitalize">
                            {item.status || 'Pending'}
                          </span>
                        )}
                      </td>
                    )}
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {item.user?.name ?? '—'}
                    </td>
                    {visibleColumns.actions && (
                      <td className="py-4 px-4 text-right flex items-center justify-end gap-1.5 pt-3">
                        <button
                          onClick={() => setSelectedReturn(item)}
                          className="p-1 px-2.5 hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs font-semibold bg-card"
                        >
                          <Eye size={13} />
                          {t('common.view')}
                        </button>
                        {item.status === 'draft' && (
                          <>
                            <button
                              onClick={() => setApproveTarget(item)}
                              className="p-1 px-2.5 hover:bg-green-500/10 hover:text-green-600 border border-transparent rounded-lg text-green-500 transition-colors flex items-center gap-1 text-xs font-bold bg-green-500/5"
                            >
                              <CheckCircle size={13} />
                              Approve
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-1 px-2 hover:bg-red-500/10 hover:text-red-600 border border-transparent rounded-lg text-red-500 transition-colors flex items-center gap-1 text-xs font-semibold bg-red-500/5"
                            >
                              <Trash size={13} />
                            </button>
                          </>
                        )}
                        {item.status === 'approved' && (
                          <button
                            onClick={() => setCancelTarget(item)}
                            className="p-1 px-2.5 hover:bg-red-500/10 hover:text-red-600 border border-transparent rounded-lg text-red-500 transition-colors flex items-center gap-1 text-xs font-bold bg-red-500/5"
                          >
                            <X size={13} />
                            Cancel
                          </button>
                        )}
                      </td>
                    )}
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

      {/* ─── CREATE RETURN MODAL ─── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-bold text-lg text-foreground">
                  {t('purchases.createReturn')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Select Purchase Order (PO) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={purchaseId}
                    onChange={(e) => setPurchaseId(e.target.value)}
                    required
                    className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                  >
                    <option value="">Select PO</option>
                    {(purchasesData ?? [])
                      .filter((p: any) => p.status === 'received' || p.status === 'partial')
                      .map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.reference_number} — {p.supplier?.name} (Total: Rp {p.grand_total.toLocaleString('id-ID')})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-1.5">Company</label>
                    <input
                      type="text"
                      value="Enterprise Headquarters"
                      disabled
                      className="form-input w-full border border-border rounded-lg p-2.5 bg-muted/30 text-sm font-medium cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-muted-foreground mb-1.5">Supplier</label>
                    <input
                      type="text"
                      value={
                        (purchasesData ?? []).find((p: any) => p.id === Number(purchaseId))?.supplier?.name ?? '—'
                      }
                      disabled
                      className="form-input w-full border border-border rounded-lg p-2.5 bg-muted/30 text-sm font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Return Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                      className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Status <span className="text-red-500">*</span></label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                      className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                </div>

                {loadingPurchaseDetails && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-blue-500 mr-2" />
                    <span className="text-sm text-muted-foreground">Loading items from Purchase Order...</span>
                  </div>
                )}

                {returnItems.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-foreground">Return Items Quantities</h4>
                    <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border">
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground">Product & SKU</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">Ordered</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">Delivered</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center">Returned</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center bg-blue-500/5 text-blue-600 dark:text-blue-400">Available</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-center w-24">Return Qty</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-right">Cost Price</th>
                            <th className="py-2.5 px-3 font-semibold text-muted-foreground text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {returnItems.map((item, idx) => {
                            const returnQty = parseFloat(item.quantity) || 0
                            const lineTotal = returnQty * item.unit_cost

                            return (
                              <tr key={idx} className="hover:bg-muted/5">
                                <td className="py-2.5 px-3">
                                  <span className="font-semibold text-foreground block">{item.product_name}</span>
                                  {item.variant_name && (
                                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium mt-0.5 inline-block mr-1">
                                      {item.variant_name}
                                    </span>
                                  )}
                                  {item.sku && (
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                      SKU: {item.sku}
                                    </span>
                                  )}
                                  <input
                                    placeholder="Add notes for return item..."
                                    value={item.notes}
                                    onChange={(e) => handleItemNotesChange(idx, e.target.value)}
                                    className="block mt-1 w-full text-[10px] bg-transparent border-0 border-b border-transparent focus:border-border p-0 text-muted-foreground"
                                  />
                                </td>
                                <td className="py-2.5 px-3 text-center text-muted-foreground">{item.quantity_ordered}</td>
                                <td className="py-2.5 px-3 text-center text-muted-foreground">{item.quantity_received}</td>
                                <td className="py-2.5 px-3 text-center text-red-500 font-medium">{item.already_returned}</td>
                                <td className="py-2.5 px-3 text-center bg-blue-500/5 font-bold text-blue-600 dark:text-blue-400">{item.available_to_return}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <input
                                    type="number"
                                    min="0"
                                    max={item.available_to_return}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const inputVal = parseFloat(e.target.value) || 0
                                      if (inputVal > item.available_to_return) {
                                        handleItemQtyChange(idx, String(item.available_to_return))
                                      } else {
                                        handleItemQtyChange(idx, e.target.value)
                                      }
                                    }}
                                    className="form-input w-full p-1 text-center text-xs border border-border rounded font-bold"
                                  />
                                </td>
                                <td className="py-2.5 px-3 text-right text-muted-foreground">
                                  Rp {item.unit_cost.toLocaleString('id-ID')}
                                </td>
                                <td className="py-2.5 px-3 text-right font-bold text-foreground">
                                  Rp {lineTotal.toLocaleString('id-ID')}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border">
                      <span className="text-sm font-semibold text-foreground">Estimated Return Value:</span>
                      <span className="text-base font-bold text-red-600">Rp {getReturnTotal().toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Reason for Return</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter return reason (e.g., damaged goods, incorrect shipment)..."
                    rows={3}
                    className="form-input w-full border border-border rounded-lg p-2.5 bg-background text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg transition-colors text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={() => setStatus('draft')}
                    disabled={createMutation.isPending || (!!purchaseId && returnItems.length === 0)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-foreground rounded-lg transition-colors text-sm font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {createMutation.isPending && status === 'draft' && <Loader2 size={14} className="animate-spin" />}
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    onClick={() => setStatus('approved')}
                    disabled={createMutation.isPending || (!!purchaseId && returnItems.length === 0)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-bold flex items-center gap-1.5 shadow"
                  >
                    {createMutation.isPending && status === 'approved' && <Loader2 size={14} className="animate-spin" />}
                    Approve
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── RETURN DETAILS DRAWER ─── */}
      <AnimatePresence>
        {selectedReturn && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end print:bg-white print:backdrop-blur-none print:static print:w-full">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-xl border-l border-border h-full flex flex-col shadow-2xl print:border-none print:shadow-none print:w-full print:h-auto print:static"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border print:hidden">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-foreground font-mono">
                    Return #{selectedReturn.reference_number}
                  </h3>
                  <span className={STATUS_BADGE[selectedReturn.status]}>
                    {selectedReturn.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedReturn(null)} className="text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0 print:overflow-visible">
                {/* Print Title Header */}
                <div className="hidden print:block border-b border-border pb-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold font-mono">DEBIT NOTE / GOODS RETURN</h1>
                      <p className="text-sm font-semibold text-muted-foreground mt-1">Return Ref: #{selectedReturn.reference_number}</p>
                      <p className="text-xs text-muted-foreground">Original PO Ref: #{selectedReturn.purchase?.reference_number}</p>
                      <p className="text-xs text-muted-foreground">Date: {new Date(selectedReturn.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Operations */}
                {selectedReturn.status === 'draft' && (
                  <div className="bg-muted/40 p-4 rounded-xl space-y-3.5 border border-border print:hidden">
                    <h4 className="text-sm font-bold text-foreground">Return Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setApproveTarget(selectedReturn)}
                        className="px-3.5 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-500 flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <CheckCircle size={14} />
                        Approve & Ship Return
                      </button>
                      <button
                        onClick={() => setCancelTarget(selectedReturn)}
                        className="px-3.5 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-500 flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        Cancel Return
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase">Supplier Details</span>
                    <h4 className="text-sm font-bold text-foreground">{selectedReturn.supplier?.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">{selectedReturn.supplier?.phone}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-1">
                    <span className="text-xs text-muted-foreground font-bold uppercase">Return Details</span>
                    <p className="text-xs text-muted-foreground">Original PO: #{selectedReturn.purchase?.reference_number}</p>
                    <p className="text-xs text-muted-foreground">Created By: {selectedReturn.user?.name}</p>
                    <p className="text-xs text-muted-foreground">Date: {new Date(selectedReturn.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Return Items */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider text-xs">Returned Items</h4>
                  <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border">
                          <th className="py-3 px-3 font-semibold text-muted-foreground">Product</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-center">Returned Qty</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Unit Cost</th>
                          <th className="py-3 px-3 font-semibold text-muted-foreground text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedReturn.items?.map((item) => (
                          <tr key={item.id} className="hover:bg-muted/5">
                            <td className="py-3.5 px-3">
                              <span className="font-semibold text-foreground text-sm">{item.product_name || item.variant?.name || 'Returned Product'}</span>
                              {item.sku && <p className="text-[10px] text-muted-foreground font-mono">SKU: {item.sku}</p>}
                              {item.notes && <p className="text-xs text-muted-foreground mt-0.5 font-mono">{item.notes}</p>}
                            </td>
                            <td className="py-3.5 px-3 text-center font-bold text-red-500">{item.quantity}</td>
                            <td className="py-3.5 px-3 text-right text-muted-foreground">Rp {item.unit_cost.toLocaleString('id-ID')}</td>
                            <td className="py-3.5 px-3 text-right font-bold text-foreground">Rp {item.total.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Return Totals */}
                <div className="flex justify-end">
                  <div className="w-full md:w-72 bg-muted/20 p-4 rounded-xl border border-border space-y-2 text-sm">
                    <div className="flex justify-between font-bold text-base text-foreground">
                      <span>Total Returned Value</span>
                      <span className="text-red-600 dark:text-red-400">Rp {selectedReturn.total_amount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {selectedReturn.reason && (
                  <div className="p-4 bg-muted/25 rounded-xl border border-border">
                    <h5 className="font-bold text-foreground text-xs uppercase mb-1">Reason for Return</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedReturn.reason}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── APPROVE CONFIRMATION ─── */}
      <ConfirmDialog
        open={!!approveTarget}
        title="Approve & Ship Return"
        message={`Are you sure you want to approve Return #${approveTarget?.reference_number}? This will subtract return quantities from warehouse inventory stocks.`}
        confirmText="Approve Return"
        loading={approveMutation.isPending}
        onConfirm={() => approveTarget && approveMutation.mutate(approveTarget.id)}
        onCancel={() => setApproveTarget(null)}
        variant="warning"
      />

      {/* ─── CANCEL CONFIRMATION ─── */}
      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Return"
        message={`Are you sure you want to cancel Return #${cancelTarget?.reference_number}?`}
        confirmText="Cancel Return"
        loading={cancelMutation.isPending}
        onConfirm={() => cancelTarget && cancelMutation.mutate(cancelTarget.id)}
        onCancel={() => setCancelTarget(null)}
        variant="danger"
      />

      {/* ─── DELETE CONFIRMATION ─── */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Purchase Return"
        message={`Are you sure you want to delete Return #${deleteTarget?.reference_number}? This action cannot be undone.`}
        confirmText="Delete Return"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
      {/* Advanced Purchase Return Filters Drawer (Right Sidebar Panel) */}
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
                    Advanced Purchase Return Filters
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
                {/* Return Status */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Return Status</h4>
                  <div className="space-y-1.5">
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                      className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                    >
                      <option value="">All Return Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Refund Status */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Refund Status</h4>
                  <div className="space-y-1.5">
                    <select
                      value={refundStatusFilter}
                      onChange={(e) => { setRefundStatusFilter(e.target.value); setPage(1); }}
                      className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                    >
                      <option value="">All Refund Statuses</option>
                      <option value="refunded">Refunded</option>
                      <option value="partial_refund">Partial Refund</option>
                      <option value="pending_refund">Pending Refund</option>
                    </select>
                  </div>
                </div>

                {/* Supplier Filter */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Supplier Filter</h4>
                  <div className="space-y-1.5">
                    <select
                      value={supplierFilter}
                      onChange={(e) => { setSupplierFilter(e.target.value); setPage(1); }}
                      className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                    >
                      <option value="">All Suppliers</option>
                      {(filterSuppliers ?? []).map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Purchase Information */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Purchase Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Purchase Ref</span>
                      <input
                        type="text"
                        value={purchaseRefFilter}
                        onChange={(e) => { setPurchaseRefFilter(e.target.value); setPage(1); }}
                        placeholder="PO Ref"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Invoice No</span>
                      <input
                        type="text"
                        value={invoiceNoFilter}
                        onChange={(e) => { setInvoiceNoFilter(e.target.value); setPage(1); }}
                        placeholder="Invoice #"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Warehouse Filter */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Warehouse Filter</h4>
                  <div className="space-y-1.5">
                    <select
                      value={warehouseFilter}
                      onChange={(e) => { setWarehouseFilter(e.target.value); setPage(1); }}
                      className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                    >
                      <option value="">All Warehouses</option>
                      {(filterWarehouses ?? []).map((w: any) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Filter */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Product Filter</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Category</span>
                      <input
                        type="text"
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                        placeholder="Category"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Brand</span>
                      <input
                        type="text"
                        value={brandFilter}
                        onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }}
                        placeholder="Brand"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Product</span>
                      <input
                        type="text"
                        value={productFilter}
                        onChange={(e) => { setProductFilter(e.target.value); setPage(1); }}
                        placeholder="Product"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Amount Filter */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Amount Filter</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Min Amount</span>
                      <input
                        type="number"
                        value={minReturnAmountFilter}
                        onChange={(e) => { setMinReturnAmountFilter(e.target.value); setPage(1); }}
                        placeholder="Min"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Max Amount</span>
                      <input
                        type="number"
                        value={maxReturnAmountFilter}
                        onChange={(e) => { setMaxReturnAmountFilter(e.target.value); setPage(1); }}
                        placeholder="Max"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Filters */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Date Filters</h4>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Return Date Between</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={returnDateStartFilter}
                        onChange={(e) => { setReturnDateStartFilter(e.target.value); setPage(1); }}
                        className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      />
                      <input
                        type="date"
                        value={returnDateEndFilter}
                        onChange={(e) => { setReturnDateEndFilter(e.target.value); setPage(1); }}
                        className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Created Date Between</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={createdDateStartFilter}
                        onChange={(e) => { setCreatedDateStartFilter(e.target.value); setPage(1); }}
                        className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      />
                      <input
                        type="date"
                        value={createdDateEndFilter}
                        onChange={(e) => { setCreatedDateEndFilter(e.target.value); setPage(1); }}
                        className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Created By */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Created By</label>
                  <select
                    value={createdByFilter}
                    onChange={(e) => { setCreatedByFilter(e.target.value); setPage(1); }}
                    className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                  >
                    <option value="">All Users</option>
                    {(filterUsers ?? []).map((u: any) => (
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

export default PurchaseReturnsPage
