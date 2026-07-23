import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, Truck, ToggleLeft, ToggleRight,
  Loader2, Eye, Mail, Phone, MapPin, DollarSign, BookOpen, Building,
  ChevronUp, ChevronDown, TrendingUp, ShoppingCart, Wallet, Filter,
  Settings, Download, Printer, ArrowLeft, Calendar, Award
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
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

interface SupplierContact {
  id:                  number
  name:                string
  email?:              string
  phone?:              string
  position?:           string
}

interface Supplier {
  id:                  number
  company_id:          number
  name:                string
  code:                string
  email?:              string
  phone?:              string
  fax?:                string
  address?:            string
  city?:               string
  province?:           string
  country?:            string
  postal_code?:        string
  tax_number?:         string
  bank_name?:          string
  bank_account_number?: string
  bank_account_name?:   string
  notes?:              string
  is_active:           boolean
  contacts?:           SupplierContact[]
}

const SuppliersPage: React.FC = () => {
  const { t } = useTranslation()
  const qc    = useQueryClient()
  const toast = useToast()

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
  } = useServerPagination({ storageKey: 'suppliers' })
    const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)

  // Advanced filters state
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [provinceFilter, setProvinceFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [minAmountFilter, setMinAmountFilter] = useState('')
  const [maxAmountFilter, setMaxAmountFilter] = useState('')
  const [minOrdersFilter, setMinOrdersFilter] = useState('')
  const [maxOrdersFilter, setMaxOrdersFilter] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('')
  const [createdDateStartFilter, setCreatedDateStartFilter] = useState('')
  const [createdDateEndFilter, setCreatedDateEndFilter] = useState('')
  const [updatedDateStartFilter, setUpdatedDateStartFilter] = useState('')
  const [updatedDateEndFilter, setUpdatedDateEndFilter] = useState('')
  const [createdByFilter, setCreatedByFilter] = useState('')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    code: true,
    contacts: true,
    location: true,
    taxNumber: true,
    status: true
  })

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const activeFiltersCount = [
    statusFilter,
    typeFilter,
    countryFilter,
    provinceFilter,
    cityFilter,
    minAmountFilter,
    maxAmountFilter,
    minOrdersFilter,
    maxOrdersFilter,
    paymentStatusFilter,
    createdDateStartFilter,
    createdDateEndFilter,
    updatedDateStartFilter,
    updatedDateEndFilter,
    createdByFilter
  ].filter(Boolean).length

  const handleResetFilters = () => {
    setStatusFilter('')
    setTypeFilter('')
    setCountryFilter('')
    setProvinceFilter('')
    setCityFilter('')
    setMinAmountFilter('')
    setMaxAmountFilter('')
    setMinOrdersFilter('')
    setMaxOrdersFilter('')
    setPaymentStatusFilter('')
    setCreatedDateStartFilter('')
    setCreatedDateEndFilter('')
    setUpdatedDateStartFilter('')
    setUpdatedDateEndFilter('')
    setCreatedByFilter('')
    reset()
  }

  const { data: users } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => api.get('/users/list').then(r => r.data)
  })

  const { data: reportData } = useQuery({
    queryKey: ['purchase-dashboard-stats'],
    queryFn: () => api.get('/purchase-report').then(r => r.data.data),
  })

  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [contacts, setContacts] = useState<any[]>([])

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

  const addContactRow = () => {
    setContacts([...contacts, { name: '', title: '', email: '', phone: '', is_primary: contacts.length === 0 }])
  }

  const removeContactRow = (idx: number) => {
    setContacts(contacts.filter((_, i) => i !== idx))
  }

  const updateContactField = (idx: number, field: string, value: any) => {
    const updated = [...contacts]
    if (field === 'is_primary') {
      updated.forEach((c, i) => {
        c.is_primary = i === idx ? value : false
      })
    } else {
      updated[idx][field] = value
    }
    setContacts(updated)
  }

  // Form states
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [fax, setFax] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [country, setCountry] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccountNumber, setBankAccountNumber] = useState('')
  const [bankAccountName, setBankAccountName] = useState('')
  const [notes, setNotes] = useState('')
  const [isActive, setIsActive] = useState(true)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'suppliers', page, debouncedSearch, perPage, sortBy, sortOrder,
      statusFilter, typeFilter, countryFilter, provinceFilter, cityFilter,
      minAmountFilter, maxAmountFilter, minOrdersFilter, maxOrdersFilter,
      paymentStatusFilter, createdDateStartFilter, createdDateEndFilter,
      updatedDateStartFilter, updatedDateEndFilter, createdByFilter
    ],
    queryFn: () => api.get('/suppliers', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        country: countryFilter || undefined,
        province: provinceFilter || undefined,
        city: cityFilter || undefined,
        min_amount: minAmountFilter || undefined,
        max_amount: maxAmountFilter || undefined,
        min_orders: minOrdersFilter || undefined,
        max_orders: maxOrdersFilter || undefined,
        payment_status: paymentStatusFilter || undefined,
        created_date_start: createdDateStartFilter || undefined,
        created_date_end: createdDateEndFilter || undefined,
        updated_date_start: updatedDateStartFilter || undefined,
        updated_date_end: updatedDateEndFilter || undefined,
        created_by: createdByFilter || undefined
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newSupplier: any) => api.post('/suppliers', newSupplier),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      toast.success('Supplier created successfully.')
      closeModal()
    },
    onError: (err: any) => { toast.error(err?.response?.data?.message ?? 'Failed to create supplier.') },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/suppliers/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      toast.success('Supplier updated successfully.')
      closeModal()
    },
    onError: (err: any) => { toast.error(err?.response?.data?.message ?? 'Failed to update supplier.') },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/suppliers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      toast.success('Supplier deleted successfully.')
      setDeleteTarget(null)
      adjustAfterDelete(suppliers.length)
    },
    onError: () => {
      toast.error('Failed to delete supplier.')
      setDeleteTarget(null)
    },
  })

  const suppliers: Supplier[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const handleExport = () => {
    toast.info(t('purchases.toast.supplierExportDownloading', 'Downloading suppliers...'))

    api.get('/suppliers', {
      params: {
        page: 1,
        search: debouncedSearch,
        per_page: pagination.total || 1000,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        country: countryFilter || undefined,
        province: provinceFilter || undefined,
        city: cityFilter || undefined,
        min_amount: minAmountFilter || undefined,
        max_amount: maxAmountFilter || undefined,
        min_orders: minOrdersFilter || undefined,
        max_orders: maxOrdersFilter || undefined,
        payment_status: paymentStatusFilter || undefined,
        created_date_start: createdDateStartFilter || undefined,
        created_date_end: createdDateEndFilter || undefined,
        updated_date_start: updatedDateStartFilter || undefined,
        updated_date_end: updatedDateEndFilter || undefined,
        created_by: createdByFilter || undefined
      }
    })
    .then(res => {
      const allSuppliers = res.data?.data || []
      if (allSuppliers.length === 0) {
        toast.warning(t('purchases.toast.supplierExportEmpty', 'No data to export.'))
        return
      }

      let tbodyHtml = '';
      allSuppliers.forEach((s: any) => {
        const totalPurchaseUSD = (Number(s.total_purchases_amount) || 0) / 4100
        const totalDueUSD = (Number(s.total_due_amount) || 0) / 4100
        const purchaseOrdersCount = Number(s.purchase_orders_count) || 0

        const statusClass = s.is_active ? 'badge-completed' : 'badge-cancelled'

        tbodyHtml += '<tr>' +
          '<td class="ref-cell">' + s.code + '</td>' +
          '<td>' + s.name + '</td>' +
          '<td>' + (s.email ?? '—') + '</td>' +
          '<td>' + (s.phone ?? '—') + '</td>' +
          '<td>' + ((s.city || s.country) ? `${s.city || ''}, ${s.country || ''}`.replace(/^,\s*/, '') : '—') + '</td>' +
          '<td class="text-center">' + purchaseOrdersCount + '</td>' +
          '<td class="currency-cell">' + totalPurchaseUSD + '</td>' +
          '<td class="currency-cell">' + totalDueUSD + '</td>' +
          '<td class="text-center"><span class="badge ' + statusClass + '">' + (s.is_active ? 'ACTIVE' : 'INACTIVE') + '</span></td>' +
          '<td>' + (s.tax_number ?? '—') + '</td>' +
          '</tr>';
      });

      const grandTotalPurchase = allSuppliers.reduce((sum: number, s: any) => sum + ((Number(s.total_purchases_amount) || 0) / 4100), 0);
      const grandTotalDue = allSuppliers.reduce((sum: number, s: any) => sum + ((Number(s.total_due_amount) || 0) / 4100), 0);

      const summaryHtml = '<tr class="summary-row">' +
        '<td colspan="6" style="text-align: right; padding-right: 15px;">TOTALS:</td>' +
        '<td class="currency-cell">' + grandTotalPurchase + '</td>' +
        '<td class="currency-cell">' + grandTotalDue + '</td>' +
        '<td colspan="2"></td>' +
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
        '  .text-center { text-align: center; }' +
        '  .ref-cell { font-family: monospace; font-weight: bold; color: #1e40af; }' +
        '  .badge { font-weight: bold; text-align: center; }' +
        '  .badge-completed { background-color: #d1fae5; color: #065f46; }' +
        '  .badge-cancelled { background-color: #fee2e2; color: #991b1b; }' +
        '  .summary-row { background-color: #e2e8f0; font-weight: bold; border-top: 2px solid #2563eb; }' +
        '</style>' +
        '</head>' +
        '<body>' +
        '  <table>' +
        '    <thead>' +
        '      <tr><th colspan="10" class="title-cell">ENTERPRISE POS - SUPPLIERS REPORT</th></tr>' +
        '      <tr><th colspan="10" class="subtitle-cell">Generated on: ' + new Date().toLocaleString() + ' | Total Records: ' + allSuppliers.length + '</th></tr>' +
        '      <tr>' +
        '        <th style="width: 100px;">Code</th>' +
        '        <th style="width: 180px;">Supplier Name</th>' +
        '        <th style="width: 180px;">Email</th>' +
        '        <th style="width: 130px;">Phone</th>' +
        '        <th style="width: 150px;">Location</th>' +
        '        <th style="width: 80px; text-align: center;">PO Count</th>' +
        '        <th style="width: 140px; text-align: right;">Total Purchases Value</th>' +
        '        <th style="width: 120px; text-align: right;">Total Due Value</th>' +
        '        <th style="width: 100px; text-align: center;">Status</th>' +
        '        <th style="width: 130px;">Tax Number</th>' +
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
      link.download = `suppliers_export_${new Date().toISOString().slice(0, 10)}.xls`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(t('purchases.toast.supplierExportSuccess', 'Suppliers exported to Excel successfully.'))
    })
    .catch((err) => {
      console.error(err)
      toast.error(t('purchases.toast.supplierExportError', 'Failed to export suppliers.'))
    })
  }

  const openCreateModal = () => {
    setEditingSupplier(null)
    setName('')
    setCode('')
    setEmail('')
    setPhone('')
    setFax('')
    setAddress('')
    setCity('')
    setProvince('')
    setCountry('')
    setPostalCode('')
    setTaxNumber('')
    setBankName('')
    setBankAccountNumber('')
    setBankAccountName('')
    setNotes('')
    setIsActive(true)
    setContacts([])
    setModalOpen(true)
  }

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setName(supplier.name)
    setCode(supplier.code)
    setEmail(supplier.email ?? '')
    setPhone(supplier.phone ?? '')
    setFax(supplier.fax ?? '')
    setAddress(supplier.address ?? '')
    setCity(supplier.city ?? '')
    setProvince(supplier.province ?? '')
    setCountry(supplier.country ?? '')
    setPostalCode(supplier.postal_code ?? '')
    setTaxNumber(supplier.tax_number ?? '')
    setBankName(supplier.bank_name ?? '')
    setBankAccountNumber(supplier.bank_account_number ?? '')
    setBankAccountName(supplier.bank_account_name ?? '')
    setNotes(supplier.notes ?? '')
    setIsActive(supplier.is_active)
    setContacts(supplier.contacts ?? [])
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingSupplier(null)
    setContacts([])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      company_id: 1,
      name,
      code,
      email: email || null,
      phone: phone || null,
      fax: fax || null,
      address: address || null,
      city: city || null,
      province: province || null,
      country: country || null,
      postal_code: postalCode || null,
      tax_number: taxNumber || null,
      bank_name: bankName || null,
      bank_account_number: bankAccountNumber || null,
      bank_account_name: bankAccountName || null,
      notes: notes || null,
      is_active: isActive,
      contacts: contacts.map(c => ({
        name: c.name,
        title: c.title || c.position || null,
        email: c.email || null,
        phone: c.phone || null,
        is_primary: !!c.is_primary,
      }))
    }

    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-6">
      {/* ─── BREADCRUMB & HEADER ────────────────────────────────────────────── */}
      <div className="print:hidden space-y-2">
        <Breadcrumb items={[{ label: 'Purchases' }, { label: 'Suppliers' }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Supplier Management
            </h1>
            <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
              Manage suppliers, supplier information, purchasing relationships, payment terms, outstanding balances, and supplier performance across the Enterprise POS and Inventory platform.
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
              {t('suppliers.addSupplier', 'Add Supplier')}
            </button>
          </div>
        </div>
      </div>

      {/* ─── DASHBOARD METRICS ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* Card 1: Total Suppliers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Suppliers</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">{suppliers.length}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-500 font-bold">
                {suppliers.filter(s => s.is_active).length} Active
              </span>
              <span>•</span>
              <span className="text-rose-500">
                {suppliers.filter(s => !s.is_active).length} Inactive
              </span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
            <Truck size={22} />
          </div>
        </motion.div>

        {/* Card 2: Supplier Performance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Supplier Performance</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">Top Tier</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span className="text-emerald-500 font-bold">5 Top</span>
              <span>•</span>
              <span>{Math.max(0, suppliers.length - 8)} Regular</span>
              <span>•</span>
              <span className="text-blue-500">3 New</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-500">
            <TrendingUp size={22} />
          </div>
        </motion.div>

        {/* Card 3: Purchase Relationship */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Purchases Relation</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight truncate max-w-[190px]">
              {formatCurrency((Number(reportData?.total_purchases) || 0) / 4100, 'USD')}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {reportData?.purchases_count ?? 0} POs <span className="text-muted-foreground/40">•</span> Avg: {formatCurrency(((Number(reportData?.total_purchases) || 0) / (reportData?.purchases_count || 1)) / 4100, 'USD')}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShoppingCart size={22} />
          </div>
        </motion.div>

        {/* Card 4: Supplier Payment Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Outstanding Payment</p>
            <p className="text-xl font-extrabold text-rose-500 tracking-tight truncate max-w-[190px]">
              {formatCurrency((Number(reportData?.total_due) || 0) / 4100, 'USD')}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-500 font-bold">Paid: {formatCurrency((Number(reportData?.total_paid) || 0) / 4100, 'USD')}</span>
              <span>•</span>
              <span className="text-rose-500">Due: {formatCurrency((Number(reportData?.total_due) || 0) / 4100, 'USD')}</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500">
            <Wallet size={22} />
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
              placeholder="Search Supplier Name, Code, Phone, Email, Company..."
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

        {/* Right side: Actions (Refresh, Print, Column settings, Import/Export, Add Supplier) */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['suppliers'] })}
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
                        {col === 'name' ? 'Supplier Name' :
                         col === 'code' ? 'Code' :
                         col === 'contacts' ? 'Contacts' :
                         col === 'location' ? 'Location' :
                         col === 'taxNumber' ? 'Tax Number' :
                         'Status'}
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
                {visibleColumns.name && (
                  <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Supplier {renderSortIcon('name')}
                  </th>
                )}
                {visibleColumns.code && (
                  <th onClick={() => handleSort('code')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Code {renderSortIcon('code')}
                  </th>
                )}
                {visibleColumns.contacts && (
                  <th onClick={() => handleSort('email')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Contacts {renderSortIcon('email')}
                  </th>
                )}
                {visibleColumns.location && (
                  <th onClick={() => handleSort('city')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Location {renderSortIcon('city')}
                  </th>
                )}
                {visibleColumns.taxNumber && (
                  <th onClick={() => handleSort('tax_number')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Tax Number {renderSortIcon('tax_number')}
                  </th>
                )}
                {visibleColumns.status && (
                  <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                    Status {renderSortIcon('is_active')}
                  </th>
                )}
                <th className="text-right py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {visibleColumns.name && <td><div className="skeleton h-4 w-32 rounded" /></td>}
                      {visibleColumns.code && <td><div className="skeleton h-4 w-16 rounded" /></td>}
                      {visibleColumns.contacts && <td><div className="skeleton h-4 w-28 rounded" /></td>}
                      {visibleColumns.location && <td><div className="skeleton h-4 w-36 rounded" /></td>}
                      {visibleColumns.taxNumber && <td><div className="skeleton h-4 w-20 rounded" /></td>}
                      {visibleColumns.status && <td><div className="skeleton h-4 w-16 rounded" /></td>}
                      <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                    </tr>
                  ))
                : suppliers.map((supplier) => (
                    <tr key={supplier.id} className="group hover:bg-muted/25 transition-colors">
                      {visibleColumns.name && (
                        <td>
                          <div className="flex items-center gap-2">
                            <Truck size={16} className="text-primary flex-shrink-0" />
                            <span className="font-medium text-foreground text-sm">{supplier.name}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.code && (
                        <td className="font-mono text-xs text-muted-foreground">{supplier.code}</td>
                      )}
                      {visibleColumns.contacts && (
                        <td>
                          <div className="text-xs space-y-0.5 text-muted-foreground">
                            {supplier.email && <div className="flex items-center gap-1"><Mail size={10} /> {supplier.email}</div>}
                            {supplier.phone && <div className="flex items-center gap-1"><Phone size={10} /> {supplier.phone}</div>}
                          </div>
                        </td>
                      )}
                      {visibleColumns.location && (
                        <td className="text-muted-foreground text-sm">
                          {supplier.city ? `${supplier.city}, ${supplier.province ?? ''}` : supplier.address ?? '—'}
                        </td>
                      )}
                      {visibleColumns.taxNumber && (
                        <td className="text-muted-foreground font-mono text-xs">{supplier.tax_number ?? '—'}</td>
                      )}
                      {visibleColumns.status && (
                        <td>
                          {supplier.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                              Active
                            </span>
                          ) : supplier.notes?.toLowerCase().includes('block') ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold">
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 text-xs font-bold">
                              Inactive
                            </span>
                          )}
                        </td>
                      )}
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewSupplier(supplier)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            title="View Detail"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEditModal(supplier)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(supplier)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg
                                       text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!isLoading && suppliers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Truck size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-sm font-semibold mb-3">No suppliers found</p>
                    <button
                      onClick={openCreateModal}
                      className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow hover:opacity-90 transition-opacity"
                    >
                      Add Supplier
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </TableWrapper>

        {/* Pagination */}
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl my-4"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Code</label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      placeholder="SUP001"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Supplier Name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="supplier@mail.com"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contact number"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Fax Number</label>
                    <input
                      value={fax}
                      onChange={(e) => setFax(e.target.value)}
                      placeholder="Fax"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Tax ID / NPWP</label>
                    <input
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      placeholder="NPWP Tax Number"
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Supplier physical office coordinate"
                    rows={2}
                    className="form-input resize-none"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Province</label>
                    <input
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="State/Prov"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Country</label>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="ID"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Postal Code</label>
                    <input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal Code"
                      className="form-input"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Bank Name</label>
                    <input
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Bank Mandiri/BCA"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Bank Account Number</label>
                    <input
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="Account Number"
                      className="form-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Bank Account Name</label>
                    <input
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="Beneficiary Name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Notes / Terms</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special terms, logistics instructions"
                    rows={2}
                    className="form-input resize-none"
                  />
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Supplier Contacts</label>
                    <button
                      type="button"
                      onClick={addContactRow}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Contact
                    </button>
                  </div>

                  {contacts.length === 0 ? (
                    <div className="text-center py-4 bg-muted/20 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
                      No contacts added yet. Click Add Contact to add one.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {contacts.map((contact, idx) => (
                        <div key={idx} className="p-3 bg-muted/30 border border-border rounded-xl space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => removeContactRow(idx)}
                            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 rounded"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-muted-foreground font-semibold">Name</label>
                              <input
                                value={contact.name}
                                onChange={(e) => updateContactField(idx, 'name', e.target.value)}
                                className="form-input text-xs p-1"
                                placeholder="Contact Name"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground font-semibold">Position</label>
                              <input
                                value={contact.title || contact.position || ''}
                                onChange={(e) => updateContactField(idx, 'title', e.target.value)}
                                className="form-input text-xs p-1"
                                placeholder="e.g. Sales Manager"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-muted-foreground font-semibold">Email</label>
                              <input
                                type="email"
                                value={contact.email || ''}
                                onChange={(e) => updateContactField(idx, 'email', e.target.value)}
                                className="form-input text-xs p-1"
                                placeholder="Email"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground font-semibold">Phone</label>
                              <input
                                value={contact.phone || ''}
                                onChange={(e) => updateContactField(idx, 'phone', e.target.value)}
                                className="form-input text-xs p-1"
                                placeholder="Phone number"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1">
                            <input
                              type="checkbox"
                              id={`contact-primary-${idx}`}
                              checked={!!contact.is_primary}
                              onChange={(e) => updateContactField(idx, 'is_primary', e.target.checked)}
                              className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                            />
                            <label htmlFor={`contact-primary-${idx}`} className="text-[10px] font-semibold text-muted-foreground select-none">
                              Primary Contact
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-medium text-muted-foreground">Active Status</span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="text-primary hover:opacity-80 transition-opacity"
                  >
                    {isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-muted-foreground" />}
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 shadow-sm flex items-center gap-1.5"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
                    {editingSupplier ? 'Save Changes' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Drawer */}
      <AnimatePresence>
        {viewSupplier && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-md border-l border-border h-full flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">Supplier Profile</h3>
                <button onClick={() => setViewSupplier(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Corporate Profile</h4>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Code:</span>
                      <span className="font-mono font-medium">{viewSupplier.code}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Company Name:</span>
                      <span className="font-medium">{viewSupplier.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax Number:</span>
                      <span className="font-mono text-xs">{viewSupplier.tax_number ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={viewSupplier.is_active ? 'text-green-500 font-medium' : 'text-muted-foreground'}>
                        {viewSupplier.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Contact Channels</h4>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Mail size={12} /> Email:</span>
                      <span className="font-medium">{viewSupplier.email ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Phone size={12} /> Phone:</span>
                      <span className="font-medium">{viewSupplier.phone ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fax:</span>
                      <span className="font-medium">{viewSupplier.fax ?? '—'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bank & Remittance details</h4>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><DollarSign size={12} /> Bank Name:</span>
                      <span className="font-medium">{viewSupplier.bank_name ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Account Number:</span>
                      <span className="font-mono font-medium">{viewSupplier.bank_account_number ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Beneficiary Name:</span>
                      <span className="font-medium">{viewSupplier.bank_account_name ?? '—'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Contacts</h4>
                  <div className="space-y-2">
                    {(!viewSupplier.contacts || viewSupplier.contacts.length === 0) ? (
                      <div className="text-xs text-muted-foreground bg-muted/20 border border-border p-3 rounded-lg text-center">
                        No contact persons registered.
                      </div>
                    ) : (
                      viewSupplier.contacts.map((contact: any, index: number) => (
                        <div key={index} className="bg-muted/30 p-3 rounded-lg border border-border space-y-1 relative">
                          {contact.is_primary && (
                            <span className="absolute top-2 right-2 text-[9px] font-bold bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-full uppercase">
                              Primary
                            </span>
                          )}
                          <div className="text-sm font-semibold text-foreground">{contact.name}</div>
                          {(contact.title || contact.position) && (
                            <div className="text-xs text-muted-foreground font-medium">{contact.title || contact.position}</div>
                          )}
                          <div className="text-xs text-muted-foreground space-y-0.5 pt-0.5">
                            {contact.email && <p>Email: {contact.email}</p>}
                            {contact.phone && <p>Phone: {contact.phone}</p>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Office Address</h4>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-start gap-1"><MapPin size={14} className="mt-0.5" /> Address:</span>
                      <span className="font-medium text-right max-w-[200px] break-words">{viewSupplier.address ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">City:</span>
                      <span className="font-medium">{viewSupplier.city ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Province:</span>
                      <span className="font-medium">{viewSupplier.province ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Country:</span>
                      <span className="font-medium">{viewSupplier.country ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Postal Code:</span>
                      <span className="font-medium">{viewSupplier.postal_code ?? '—'}</span>
                    </div>
                  </div>
                </div>

                {viewSupplier.notes && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Internal Notes</h4>
                    <div className="bg-muted/30 p-3 rounded-lg border border-border text-sm text-muted-foreground flex gap-2">
                      <BookOpen size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span>{viewSupplier.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Supplier"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />

      {/* Advanced Supplier Filters Drawer (Right Sidebar Panel) */}
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
                    Advanced Supplier Filters
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
                {/* Supplier Information */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Supplier Information</h4>
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Supplier Status</span>
                    <ModernSelect
                      value={statusFilter}
                      onChange={(val) => { setStatusFilter(String(val)); setPage(1); }}
                      options={[
                        { value: '', label: 'All Statuses' },
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                      ]}
                      placeholder="All Statuses"
                    />
                  </div>
                </div>

                {/* Supplier Type */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Supplier Type</h4>
                  <div className="space-y-1.5">
                    <ModernSelect
                      value={typeFilter}
                      onChange={(val) => { setTypeFilter(String(val)); setPage(1); }}
                      options={[
                        { value: '', label: 'All Types' },
                        { value: 'manufacturer', label: 'Manufacturer' },
                        { value: 'wholesaler', label: 'Wholesaler' },
                        { value: 'distributor', label: 'Distributor' },
                        { value: 'other', label: 'Other' },
                      ]}
                      placeholder="All Types"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Location Filter</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Country</span>
                      <input
                        type="text"
                        value={countryFilter}
                        onChange={(e) => { setCountryFilter(e.target.value); setPage(1); }}
                        placeholder="Country"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Province</span>
                      <input
                        type="text"
                        value={provinceFilter}
                        onChange={(e) => { setProvinceFilter(e.target.value); setPage(1); }}
                        placeholder="Province"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">City</span>
                      <input
                        type="text"
                        value={cityFilter}
                        onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
                        placeholder="City"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Purchase Information */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Purchase Information</h4>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Purchase Amount Range</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={minAmountFilter}
                        onChange={(e) => { setMinAmountFilter(e.target.value); setPage(1); }}
                        placeholder="Min"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                      <input
                        type="number"
                        value={maxAmountFilter}
                        onChange={(e) => { setMaxAmountFilter(e.target.value); setPage(1); }}
                        placeholder="Max"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Total Purchase Orders Range</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={minOrdersFilter}
                        onChange={(e) => { setMinOrdersFilter(e.target.value); setPage(1); }}
                        placeholder="Min POs"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                      <input
                        type="number"
                        value={maxOrdersFilter}
                        onChange={(e) => { setMaxOrdersFilter(e.target.value); setPage(1); }}
                        placeholder="Max POs"
                        className="form-input text-xs rounded-xl bg-card border-border py-1.5 text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Filter */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Payment Filter</h4>
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Payment Status</span>
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
                </div>

                {/* Date Filters */}
                <div className="space-y-3 pb-3 border-b border-border/60">
                  <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Date Range Filters</h4>
                  <div className="space-y-1">
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
                  <div className="space-y-1 mt-2">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Updated Date Between</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={updatedDateStartFilter}
                        onChange={(e) => { setUpdatedDateStartFilter(e.target.value); setPage(1); }}
                        className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      />
                      <input
                        type="date"
                        value={updatedDateEndFilter}
                        onChange={(e) => { setUpdatedDateEndFilter(e.target.value); setPage(1); }}
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

export default SuppliersPage
