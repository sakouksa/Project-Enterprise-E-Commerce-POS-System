import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Search, Trash2, RefreshCw, MapPin,
  ChevronUp, ChevronDown, Download, CheckCircle2,
  AlertCircle, Home, Building2, Package, Tag, Store, Building, Factory, Hotel
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TableActionMenu from '@/components/shared/TableActionMenu'
import ModernSelect from '@/components/shared/ModernSelect'
import ColumnSettingsPopover from '@/components/shared/ColumnSettingsPopover'
import ResetButton from '@/components/shared/ResetButton'
import { useTranslation } from 'react-i18next'
import { CustomerAddressModal, type CustomerAddress } from '@/components/common'

interface CustomerAddressesPageProps {
  isTab?: boolean
  onRegisterActions?: (actions: { openAdd: () => void; exportData: () => void }) => void
}

const getTranslatedAddressLabel = (label: string, t: any) => {
  const norm = (label || '').trim().toLowerCase()
  if (!label) return '—'
  if (norm === 'home') return t('customers.labelHome', 'Home')
  if (norm === 'office') return t('customers.labelOffice', 'Office')
  if (norm === 'warehouse') return t('customers.labelWarehouse', 'Warehouse')
  if (norm === 'other') return t('customers.labelOther', 'Other')
  if (norm === 'store' || norm === 'shop') return t('customers.labelStore', 'Store')
  if (norm === 'branch') return t('customers.labelBranch', 'Branch')
  if (norm === 'condo') return t('customers.labelCondo', 'Condo')
  if (norm === 'villa') return t('customers.labelVilla', 'Villa')
  if (norm === 'factory') return t('customers.labelFactory', 'Factory')
  if (norm === 'hotel') return t('customers.labelHotel', 'Hotel')
  if (norm === 'apartment') return t('customers.labelApartment', 'Apartment')
  if (norm === 'hq' || norm === 'headquarters') return t('customers.labelHQ', 'Headquarters')
  return label
}

const renderAddressLabelBadge = (label: string, t: any) => {
  const norm = (label || '').trim().toLowerCase()
  if (!label) {
    return <span className="text-muted-foreground">—</span>
  }

  if (norm === 'home' || norm.startsWith('home')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap shadow-2xs">
        <Home size={12} className="shrink-0 text-blue-500" />
        <span>{norm === 'home' ? t('customers.labelHome', 'Home') : label}</span>
      </span>
    )
  }

  if (norm === 'office' || norm === 'work' || norm === 'hq' || norm.startsWith('office')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 whitespace-nowrap shadow-2xs">
        <Building2 size={12} className="shrink-0 text-purple-500" />
        <span>{norm === 'office' ? t('customers.labelOffice', 'Office') : label}</span>
      </span>
    )
  }

  if (norm === 'warehouse' || norm.startsWith('warehouse')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap shadow-2xs">
        <Package size={12} className="shrink-0 text-amber-500" />
        <span>{norm === 'warehouse' ? t('customers.labelWarehouse', 'Warehouse') : label}</span>
      </span>
    )
  }

  if (norm === 'store' || norm === 'shop') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shadow-2xs">
        <Store size={12} className="shrink-0 text-emerald-500" />
        <span>{t('customers.labelStore', 'Store')}</span>
      </span>
    )
  }

  if (norm === 'branch') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 whitespace-nowrap shadow-2xs">
        <Building size={12} className="shrink-0 text-cyan-500" />
        <span>{t('customers.labelBranch', 'Branch')}</span>
      </span>
    )
  }

  if (norm === 'condo' || norm === 'apartment') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 whitespace-nowrap shadow-2xs">
        <Building2 size={12} className="shrink-0 text-indigo-500" />
        <span>{norm === 'condo' ? t('customers.labelCondo', 'Condo') : t('customers.labelApartment', 'Apartment')}</span>
      </span>
    )
  }

  if (norm === 'villa') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap shadow-2xs">
        <Home size={12} className="shrink-0 text-rose-500" />
        <span>{t('customers.labelVilla', 'Villa')}</span>
      </span>
    )
  }

  if (norm === 'factory') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 whitespace-nowrap shadow-2xs">
        <Factory size={12} className="shrink-0 text-orange-500" />
        <span>{t('customers.labelFactory', 'Factory')}</span>
      </span>
    )
  }

  if (norm === 'hotel') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 whitespace-nowrap shadow-2xs">
        <Hotel size={12} className="shrink-0 text-teal-500" />
        <span>{t('customers.labelHotel', 'Hotel')}</span>
      </span>
    )
  }

  if (norm === 'other') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap shadow-2xs">
        <Tag size={12} className="shrink-0 text-rose-500" />
        <span>{t('customers.labelOther', 'Other')}</span>
      </span>
    )
  }

  // Custom label tag
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap shadow-2xs">
      <Tag size={12} className="shrink-0 text-primary" />
      <span className="max-w-[120px] truncate" title={label}>{label}</span>
    </span>
  )
}

const CustomerAddressesPage: React.FC<CustomerAddressesPageProps> = ({ isTab = false, onRegisterActions }) => {
  const { t, i18n } = useTranslation(['customers', 'common'])
  const isKhmer = i18n.language === 'km'
  const toast = useToast()
  const qc = useQueryClient()

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset: resetPagination,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'customeraddresses' })

  // Bulk selection states
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CustomerAddress | null>(null)
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    customer: true,
    label: true,
    recipient: true,
    phone: true,
    address: true,
    region: true,
    postalCode: true,
    coordinates: true,
    status: true,
    actions: true,
  })

  // Filters & Sorting state
  const [customerFilter, setCustomerFilter] = useState('')
  const [defaultFilter, setDefaultFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Queries
  const { data: customers } = useQuery({
    queryKey: ['customers-addresses-dropdown'],
    queryFn: () => api.get('/customers', { params: { per_page: 200 } }).then(r => r.data.data ?? []),
  })

  const { data: addressesData, isLoading, isFetching } = useQuery({
    queryKey: ['customer-addresses', page, debouncedSearch, perPage, customerFilter, defaultFilter, sortBy, sortOrder],
    queryFn: () => api.get('/customer-addresses', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        customer_id: customerFilter,
        is_default: defaultFilter === 'default' ? '1' : defaultFilter === 'secondary' ? '0' : undefined,
        sort_by: sortBy,
        sort_order: sortOrder
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/customer-addresses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] })
      toast.success(t('toast.deleted', { item: t('customers.customerAddresses') }))
      setDeleteTarget(null)
      adjustAfterDelete(addresses.length)
    },
    onError: () => {
      toast.error(t('toast.error'))
      setDeleteTarget(null)
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/customer-addresses/bulk-delete', { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] })
      toast.success(t('toast.deleted', { item: `${selectedRows.length} ${t('customers.customerAddresses', 'Customer Addresses')}` }))
      setSelectedRows([])
      setBulkDeleteConfirmOpen(false)
      adjustAfterDelete(selectedRows.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', 'Failed to delete selected customer addresses.'))
      setBulkDeleteConfirmOpen(false)
    }
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(addresses.map((a) => a.id).filter((id): id is number => typeof id === 'number'))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id])
    } else {
      setSelectedRows((prev) => prev.filter((i) => i !== id))
    }
  }

  const addresses: CustomerAddress[] = addressesData?.data ?? []
  const pagination = addressesData?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = React.useCallback(() => {
    setEditingAddress(null)
    setModalOpen(true)
  }, [])

  const openEditModal = (addr: CustomerAddress) => {
    setEditingAddress(addr)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingAddress(null)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
    }
    setPage(1)
  }

  const handleExport = React.useCallback(() => {
    const infoId = toast.info(t('customers.toast.exportDownloading', 'Downloading customer address data...'))
    setTimeout(() => {
      if (infoId) toast.dismiss(infoId)

      const titleText = t('customers.customerAddresses', 'Customer Addresses')
      const headers = [
        t('customers.id', 'ID'),
        t('customers.customer', 'Customer'),
        t('customers.addressLabel', 'Address Label'),
        t('customers.receiverName', 'Recipient Name'),
        t('customers.phone', 'Phone'),
        t('customers.streetAddress', 'Address'),
        t('customers.city', 'City'),
        t('customers.province', 'Province'),
        t('customers.country', 'Country'),
        t('customers.postalCode', 'Postal Code'),
        t('customers.latitude', 'Latitude'),
        t('customers.longitude', 'Longitude'),
        t('customers.defaultAddress', 'Default Address')
      ]

      let tbodyHtml = ''
      addresses.forEach(addr => {
        const customerName = addr.customer?.name || (addr.customer_id ? `Customer #${addr.customer_id}` : '—')
        const translatedLabel = getTranslatedAddressLabel(addr.label, t)
        const defaultText = addr.is_default ? t('common.yes', 'Yes') : t('common.no', 'No')

        tbodyHtml += '<tr>' +
          '<td class="ref-cell">' + addr.id + '</td>' +
          '<td><b>' + customerName + '</b></td>' +
          '<td class="text-center">' + translatedLabel + '</td>' +
          '<td>' + (addr.name || '—') + '</td>' +
          '<td>' + (addr.phone || '—') + '</td>' +
          '<td>' + (addr.address || '—') + '</td>' +
          '<td>' + (addr.city || '—') + '</td>' +
          '<td>' + (addr.province || '—') + '</td>' +
          '<td>' + (addr.country || '—') + '</td>' +
          '<td class="text-center">' + (addr.postal_code || '—') + '</td>' +
          '<td class="text-center">' + (addr.latitude ?? '—') + '</td>' +
          '<td class="text-center">' + (addr.longitude ?? '—') + '</td>' +
          '<td class="text-center">' + defaultText + '</td>' +
          '</tr>'
      })

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
        '  .text-center { text-align: center; }' +
        '  .ref-cell { font-family: monospace; font-weight: bold; color: #1e40af; }' +
        '</style>' +
        '</head>' +
        '<body>' +
        '  <table>' +
        '    <thead>' +
        '      <tr><th colspan="13" class="title-cell">ENTERPRISE POS - ' + titleText + '</th></tr>' +
        '      <tr><th colspan="13" class="subtitle-cell">Generated on: ' + new Date().toLocaleString() + ' | Total Records: ' + addresses.length + '</th></tr>' +
        '      <tr>' +
        headers.map(h => '<th>' + h + '</th>').join('') +
        '      </tr>' +
        '    </thead>' +
        '    <tbody>' +
        tbodyHtml +
        '    </tbody>' +
        '  </table>' +
        '</body>' +
        '</html>'

      const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = `customer_addresses_${new Date().toISOString().slice(0, 10)}.xls`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(t('customers.toast.exportSuccessAddresses', 'Customer addresses exported successfully.'))
    }, 800)
  }, [addresses, t, toast])

  const handleResetFilters = () => {
    setCustomerFilter('')
    setDefaultFilter('all')
    setSortBy('created_at')
    setSortOrder('desc')
    setSelectedRows([])
    resetPagination()
  }

  useEffect(() => {
    if (onRegisterActions) {
      onRegisterActions({
        openAdd: openCreateModal,
        exportData: handleExport,
      })
    }
  }, [onRegisterActions, openCreateModal, handleExport])

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('customers.customerAddresses')}</h1>
            <p className="text-muted-foreground text-sm">
              {t('common.showing', { from: pagination.from || 0, to: pagination.to || 0, total: pagination.total })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm animate-fade-in"
            >
              <Download size={15} />
              {t('common.export')}
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm animate-fade-in"
            >
              <Plus size={16} />
              {t('customers.addAddress')}
            </button>
          </div>
        </div>
      )}

      {/* Filters row */}
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-56 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder={t('customers.searchAddresses')}
                className="form-input pl-9 pr-3 w-full h-9 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            {/* Customer Filter */}
            <ModernSelect
              value={customerFilter}
              onChange={val => { setCustomerFilter(val); setPage(1); }}
              options={[
                { value: '', label: `${t('customers.title')}: ${t('common.allStatus')}` },
                ...(customers ?? []).map((c: any) => ({ value: String(c.id), label: c.name }))
              ]}
              className="w-52"
            />

            {/* Default/Secondary Filter */}
            <ModernSelect
              value={defaultFilter}
              onChange={val => { setDefaultFilter(val); setPage(1); }}
              options={[
                { value: 'all', label: `${t('common.status')}: ${t('common.allStatus')}` },
                { value: 'default', label: t('customers.defaultAddress') },
                { value: 'secondary', label: t('customers.secondaryAddress', 'Secondary Address') }
              ]}
              className="w-48"
            />

            <ResetButton onClick={handleResetFilters} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => qc.invalidateQueries({ queryKey: ['customer-addresses'] })}
              className="h-9 w-9 flex items-center justify-center hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground border border-border/80 bg-background transition-colors shadow-xs cursor-pointer active:scale-95"
              title={t('common.refresh')}
            >
              <RefreshCw size={14} />
            </button>
            <ColumnSettingsPopover
              columns={[
                { key: 'id', label: t('customers.id', 'ID') },
                { key: 'customer', label: t('customers.title', 'Customer') },
                { key: 'label', label: t('customers.addressLabel', 'Label') },
                { key: 'recipient', label: t('customers.recipient', 'Recipient') },
                { key: 'phone', label: t('common.phone', 'Phone') },
                { key: 'address', label: t('customers.addresses', 'Address') },
                { key: 'region', label: t('customers.region', 'Region') },
                { key: 'postalCode', label: t('customers.postalCode', 'Postal Code') },
                { key: 'coordinates', label: t('customers.coordinates', 'Coordinates') },
                { key: 'status', label: t('common.status', 'Status') },
              ]}
              visibleColumns={visibleColumns}
              onChange={(cols: Record<string, boolean>) => setVisibleColumns(cols as any)}
            />
          </div>
        </div>
      </div>

      {/* Bulk actions panel */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            <AlertCircle size={16} />
            <span>{selectedRows.length} {t('customers.selectedCount', t('common.selected', 'Selected'))}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkDeleteConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-xl hover:bg-red-500 cursor-pointer transition-colors shadow-xs"
            >
              <Trash2 size={13} />
              <span>{t('customers.deleteSelected', t('common.deleteSelected', 'Delete Selected'))}</span>
            </button>
            <button
              onClick={() => setSelectedRows([])}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 cursor-pointer"
            >
              {t('common.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Customer Addresses Enterprise Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <TableWrapper isFetching={isFetching}>
            <div className="overflow-x-auto">
              <table className="w-full data-table min-w-[1200px]">
                <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
                  <tr>
                    <th className="w-10 text-center !px-3">
                      <input
                        type="checkbox"
                        className="checkbox h-4 w-4 rounded border-border"
                        checked={addresses.length > 0 && selectedRows.length === addresses.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    {visibleColumns.id && (
                      <th onClick={() => handleSort('id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.id', 'ID')} {renderSortIcon('id')}
                      </th>
                    )}
                    {visibleColumns.customer && (
                      <th onClick={() => handleSort('customer_id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.title', 'Customer')} {renderSortIcon('customer_id')}
                      </th>
                    )}
                    {visibleColumns.label && (
                      <th onClick={() => handleSort('label')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.addressLabel', 'Label')} {renderSortIcon('label')}
                      </th>
                    )}
                    {visibleColumns.recipient && (
                      <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.recipient', 'Recipient')} {renderSortIcon('name')}
                      </th>
                    )}
                    {visibleColumns.phone && (
                      <th onClick={() => handleSort('phone')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('common.phone', 'Phone')} {renderSortIcon('phone')}
                      </th>
                    )}
                    {visibleColumns.address && (
                      <th onClick={() => handleSort('address')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.addresses', 'Address')} {renderSortIcon('address')}
                      </th>
                    )}
                    {visibleColumns.region && (
                      <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.region', 'Region')}
                      </th>
                    )}
                    {visibleColumns.postalCode && (
                      <th onClick={() => handleSort('postal_code')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.postalCode', 'Postal Code')} {renderSortIcon('postal_code')}
                      </th>
                    )}
                    {visibleColumns.coordinates && (
                      <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.coordinates', 'Coordinates (Lat, Lng)')}
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th onClick={() => handleSort('is_default')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none whitespace-nowrap">
                        {t('customers.defaultAddress', 'Default Address')} {renderSortIcon('is_default')}
                      </th>
                    )}
                    {visibleColumns.actions && (
                      <th className="text-right p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">{t('customers.actions', t('common.actions', 'Actions'))}</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="hover:bg-muted/5">
                        <td className="w-10 text-center !px-3"><div className="skeleton h-4 w-4 rounded mx-auto" /></td>
                        {visibleColumns.id && <td className="p-4"><div className="skeleton h-4 w-8 rounded" /></td>}
                        {visibleColumns.customer && <td className="p-4"><div className="skeleton h-4 w-32 rounded" /></td>}
                        {visibleColumns.label && <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>}
                        {visibleColumns.recipient && <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>}
                        {visibleColumns.phone && <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>}
                        {visibleColumns.address && <td className="p-4"><div className="skeleton h-4 w-40 rounded" /></td>}
                        {visibleColumns.region && <td className="p-4"><div className="skeleton h-4 w-36 rounded" /></td>}
                        {visibleColumns.postalCode && <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>}
                        {visibleColumns.coordinates && <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>}
                        {visibleColumns.status && <td className="p-4"><div className="skeleton h-4 w-12 rounded" /></td>}
                        {visibleColumns.actions && <td className="p-4 text-right"><div className="skeleton h-4 w-16 rounded ml-auto" /></td>}
                      </tr>
                    ))
                  ) : addresses.map((addr) => {
                    const isSelected = typeof addr.id === 'number' ? selectedRows.includes(addr.id) : false
                    return (
                      <tr key={addr.id} className={`hover:bg-muted/10 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                        <td className="w-10 text-center !px-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="checkbox h-4 w-4 rounded border-border"
                            checked={isSelected}
                            onChange={(e) => addr.id && handleSelectRow(addr.id, e.target.checked)}
                          />
                        </td>
                        {visibleColumns.id && <td className="p-4 text-sm font-mono text-muted-foreground">{addr.id}</td>}
                        {visibleColumns.customer && (
                          <td className="p-4 font-semibold text-sm text-foreground">
                            {addr.customer?.name ?? '—'}
                          </td>
                        )}
                        {visibleColumns.label && (
                          <td className="p-4 text-sm">
                            {renderAddressLabelBadge(addr.label, t)}
                          </td>
                        )}
                        {visibleColumns.recipient && <td className="p-4 text-sm font-semibold text-foreground">{addr.name}</td>}
                        {visibleColumns.phone && <td className="p-4 text-sm font-mono text-muted-foreground">{addr.phone}</td>}
                        {visibleColumns.address && (
                          <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate" title={addr.address}>
                            {addr.address}
                          </td>
                        )}
                        {visibleColumns.region && (
                          <td className="p-4 text-sm text-muted-foreground">
                            {addr.city}, {addr.province} ({addr.country})
                          </td>
                        )}
                        {visibleColumns.postalCode && <td className="p-4 text-sm text-muted-foreground font-mono">{addr.postal_code}</td>}
                        {visibleColumns.coordinates && (
                          <td className="p-4 text-sm text-muted-foreground font-mono">
                            {addr.latitude !== null && addr.longitude !== null ? `${addr.latitude}, ${addr.longitude}` : '—'}
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="p-4 text-sm whitespace-nowrap">
                            {addr.is_default ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shadow-2xs">
                                <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
                                <span>{t('customers.defaultAddress', 'Default Address')}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-border/60 whitespace-nowrap">
                                {t('customers.secondaryAddress', 'Secondary Address')}
                              </span>
                            )}
                          </td>
                        )}
                        {visibleColumns.actions && (
                          <td className="p-4 text-right">
                            <TableActionMenu
                              onEdit={() => openEditModal(addr)}
                              onDelete={() => setDeleteTarget(addr)}
                            />
                          </td>
                        )}
                      </tr>
                    )
                  })}
                  {!isLoading && addresses.length === 0 && (
                    <tr>
                      <td colSpan={12} className="py-16 text-center">
                        <MapPin size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-muted-foreground">{t('common.noData', 'No data available')}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TableWrapper>

          <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
        </div>

      {/* ─── Global Customer Address Modal ─── */}
      <CustomerAddressModal
        isOpen={modalOpen}
        onClose={closeModal}
        initialData={editingAddress}
      />

      {/* Single Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="customers.deleteAddressTitle"
        itemName={deleteTarget?.label ? `${deleteTarget.label} (${deleteTarget.address || deleteTarget.name || ''})` : deleteTarget?.name || deleteTarget?.address}
        confirmText="common.confirmDelete"
        cancelText="common.cancel"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && typeof deleteTarget.id === 'number' && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        title={t('customers.bulkDeleteAddressesTitle', 'Delete Selected Addresses')}
        message={t('customers.confirmBulkDeleteAddressesMessage', {
          count: selectedRows.length,
          defaultValue: `Are you sure you want to delete ${selectedRows.length} selected addresses? This action cannot be undone.`
        }).replace('{{count}}', String(selectedRows.length))}
        confirmText={t('common.confirmDelete', 'Delete')}
        cancelText={t('common.cancel', 'Cancel')}
        loading={bulkDeleteMutation.isPending}
        onConfirm={() => bulkDeleteMutation.mutate(selectedRows)}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  )
}

export default CustomerAddressesPage
