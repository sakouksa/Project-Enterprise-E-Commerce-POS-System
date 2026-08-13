import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, MapPin, Loader2,
  ChevronUp, ChevronDown, Download, Settings, CheckCircle2
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TableActionMenu from '@/components/shared/TableActionMenu'
import ModernSelect from '@/components/shared/ModernSelect'
import { useTranslation } from 'react-i18next'

interface CustomerAddress {
  id: number
  customer_id: number
  customer?: { name: string }
  label: string
  name: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  latitude?: number
  longitude?: number
  is_default: boolean
  created_at: string
}

interface AddressFormData {
  customer_id: string
  label: 'Home' | 'Office' | 'Warehouse' | 'Other'
  name: string
  phone: string
  address: string
  city: string
  province: string
  country: string
  postal_code: string
  latitude: string
  longitude: string
  is_default: boolean
}

interface CustomerAddressesPageProps {
  isTab?: boolean
  setActions?: (actions: { onExport: () => void; onAdd: () => void }) => void
}

const CustomerAddressesPage: React.FC<CustomerAddressesPageProps> = ({ isTab = false, setActions }) => {
  const { t } = useTranslation()
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

  const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CustomerAddress | null>(null)
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)
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

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))
  }

  // Filters & Sorting state
  const [customerFilter, setCustomerFilter] = useState('')
  const [defaultFilter, setDefaultFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<AddressFormData>({
    defaultValues: {
      customer_id: '',
      label: 'Home',
      name: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      country: 'Cambodia',
      postal_code: '',
      latitude: '',
      longitude: '',
      is_default: false
    }
  })

  const watchCustomerId = watch('customer_id')
  const watchLabel = watch('label')

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

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/customer-addresses', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] })
      toast.success(t('toast.created', { item: t('customers.customerAddresses') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/customer-addresses/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] })
      toast.success(t('toast.updated', { item: t('customers.customerAddresses') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
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

  const addresses: CustomerAddress[] = addressesData?.data ?? []
  const pagination = addressesData?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingAddress(null)
    reset({
      customer_id: '',
      label: 'Home',
      name: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      country: 'Cambodia',
      postal_code: '',
      latitude: '',
      longitude: '',
      is_default: false
    })
    setModalOpen(true)
  }

  const openEditModal = (addr: CustomerAddress) => {
    setEditingAddress(addr)
    reset({
      customer_id: addr.customer_id.toString(),
      label: addr.label as any,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      province: addr.province,
      country: addr.country,
      postal_code: addr.postal_code ?? '',
      latitude: addr.latitude ? addr.latitude.toString() : '',
      longitude: addr.longitude ? addr.longitude.toString() : '',
      is_default: addr.is_default
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingAddress(null)
  }

  const onFormSubmit = (formData: AddressFormData) => {
    const payload = {
      customer_id: parseInt(formData.customer_id),
      label: formData.label,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      country: formData.country,
      postal_code: formData.postal_code,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      is_default: formData.is_default
    }

    if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const handleExport = () => {
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
        const labelKey = addr.label ? `label${addr.label.charAt(0).toUpperCase() + addr.label.slice(1).toLowerCase()}` : ''
        const translatedLabel = labelKey ? t(`customers.${labelKey}`, addr.label) : (addr.label || '—')
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
  }

  const handleResetFilters = () => {
    setCustomerFilter('')
    setDefaultFilter('all')
    setSortBy('created_at')
    setSortOrder('desc')
    resetPagination()
  }

  useEffect(() => {
    if (setActions) {
      setActions({
        onExport: handleExport,
        onAdd: openCreateModal
      })
    }
  }, [setActions, addresses])

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
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder={t('customers.searchAddresses')}
                className="form-input pl-9"
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

            <button
              onClick={handleResetFilters}
              className="btn-secondary px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              {t('common.reset')}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => qc.invalidateQueries({ queryKey: ['customer-addresses'] })}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm"
              title={t('common.refresh')}
            >
              <RefreshCw size={14} />
            </button>
            <div className="relative">
              <button
                onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm cursor-pointer select-none"
                title={t('products.toggleColumns', 'Columns')}
              >
                <Settings size={14} />
              </button>
              {columnDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setColumnDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1 text-left">
                    <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">{t('products.toggleColumns', 'Toggle Columns')}</p>
                    {Object.keys(visibleColumns).map(col => {
                      const colLabels: Record<string, string> = {
                        id: t('customers.id', 'ID'),
                        customer: t('customers.title', 'Customer'),
                        label: t('customers.addressLabel', 'Label'),
                        recipient: t('customers.recipient', 'Recipient'),
                        phone: t('common.phone', 'Phone'),
                        address: t('customers.addresses', 'Address'),
                        region: t('customers.region', 'Region'),
                        postalCode: t('customers.postalCode', 'Postal Code'),
                        coordinates: t('customers.coordinates', 'Coordinates'),
                        status: t('common.status', 'Status'),
                        actions: t('common.actions', 'Actions')
                      }
                      return (
                        <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col as keyof typeof visibleColumns]}
                            onChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                            className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                          />
                          <span>{colLabels[col] || col}</span>
                        </label>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <TableWrapper isFetching={isFetching}>
          <div className="overflow-x-auto">
            <table className="w-full data-table min-w-[1200px]">
              <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
                <tr>
                  {visibleColumns.id && (
                    <th onClick={() => handleSort('id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.id', 'ID')} {renderSortIcon('id')}
                    </th>
                  )}
                  {visibleColumns.customer && (
                    <th onClick={() => handleSort('customer_id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.title')} {renderSortIcon('customer_id')}
                    </th>
                  )}
                  {visibleColumns.label && (
                    <th onClick={() => handleSort('label')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.addressLabel')} {renderSortIcon('label')}
                    </th>
                  )}
                  {visibleColumns.recipient && (
                    <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.recipient')} {renderSortIcon('name')}
                    </th>
                  )}
                  {visibleColumns.phone && (
                    <th onClick={() => handleSort('phone')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('common.phone')} {renderSortIcon('phone')}
                    </th>
                  )}
                  {visibleColumns.address && (
                    <th onClick={() => handleSort('address')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.addresses')} {renderSortIcon('address')}
                    </th>
                  )}
                  {visibleColumns.region && (
                    <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.region')}
                    </th>
                  )}
                  {visibleColumns.postalCode && (
                    <th onClick={() => handleSort('postal_code')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.postalCode')} {renderSortIcon('postal_code')}
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
                    <th className="text-right p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">{t('common.actions')}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-muted/5">
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
                ) : addresses.map((addr) => (
                  <tr key={addr.id} className="hover:bg-muted/10 transition-colors">
                    {visibleColumns.id && <td className="p-4 text-sm font-mono text-muted-foreground">{addr.id}</td>}
                    {visibleColumns.customer && (
                      <td className="p-4 font-semibold text-sm text-foreground">
                        {addr.customer?.name ?? '—'}
                      </td>
                    )}
                    {visibleColumns.label && (
                      <td className="p-4 text-sm">
                        <span className="px-2.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-bold border border-border">
                          {addr.label}
                        </span>
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
                            Secondary
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
                ))}
                {!isLoading && addresses.length === 0 && (
                  <tr>
                    <td colSpan={12} className="py-16 text-center">
                      <MapPin size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-muted-foreground">{t('common.noData')}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TableWrapper>

        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      {/* Form Dialog Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-auto flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <h3 className="font-bold text-lg text-foreground">
                  {editingAddress ? t('customers.editAddress', 'Edit Address') : t('customers.addAddress', 'Add Address')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ModernSelect
                        label={`${t('customers.customer', 'Customer')} *`}
                        value={watchCustomerId || ''}
                        onChange={(val) => setValue('customer_id', val, { shouldValidate: true })}
                        options={[
                          { value: '', label: t('customers.selectCustomer', '-- Select Customer --') },
                          ...(customers ?? []).map((c: any) => ({ value: String(c.id), label: c.name }))
                        ]}
                      />
                      {errors.customer_id && <p className="text-rose-500 text-xs mt-1">{errors.customer_id.message}</p>}
                    </div>
                    <div>
                      <ModernSelect
                        label={`${t('customers.addressLabel', 'Address Label')} *`}
                        value={watchLabel || 'Home'}
                        onChange={(val) => setValue('label', val as any)}
                        options={[
                          { value: 'Home', label: t('customers.labelHome', 'Home') },
                          { value: 'Office', label: t('customers.labelOffice', 'Office') },
                          { value: 'Warehouse', label: t('customers.labelWarehouse', 'Warehouse') },
                          { value: 'Other', label: t('customers.labelOther', 'Other') }
                        ]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                        {t('customers.receiverName', 'Recipient Name')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        {...register('name', { required: t('customers.validation.receiverNameRequired', 'Recipient name is required') })}
                        placeholder={t('customers.receiverNamePlaceholder', 'e.g. Jane Doe')}
                        className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                      />
                      {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                        {t('customers.phone', 'Phone Number')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        {...register('phone', { required: t('customers.validation.phoneRequired', 'Phone number is required') })}
                        placeholder={t('customers.phonePlaceholder', 'e.g. +855 12 345 678')}
                        className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                      />
                      {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                      {t('customers.streetAddress', 'Street Address')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      {...register('address', { required: t('customers.validation.addressRequired', 'Street address is required') })}
                      placeholder={t('customers.streetAddressPlaceholder', 'e.g. No. 123, St. 456')}
                      className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                    />
                    {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                        {t('customers.city', 'City')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        {...register('city', { required: t('customers.validation.cityRequired', 'City is required') })}
                        placeholder={t('customers.cityPlaceholder', 'e.g. Phnom Penh')}
                        className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                      />
                      {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                        {t('customers.province', 'Province')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        {...register('province', { required: t('customers.validation.provinceRequired', 'Province is required') })}
                        placeholder={t('customers.provincePlaceholder', 'e.g. Phnom Penh')}
                        className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                      />
                      {errors.province && <p className="text-rose-500 text-xs mt-1">{errors.province.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                        {t('customers.country', 'Country')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        {...register('country', { required: t('customers.validation.countryRequired', 'Country is required') })}
                        placeholder={t('customers.countryPlaceholder', 'Cambodia')}
                        className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                      />
                      {errors.country && <p className="text-rose-500 text-xs mt-1">{errors.country.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                        {t('customers.postalCode', 'Postal Code')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        {...register('postal_code', { required: t('customers.validation.postalCodeRequired', 'Postal code is required') })}
                        placeholder={t('customers.postalCodePlaceholder', '12000')}
                        className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                      />
                      {errors.postal_code && <p className="text-rose-500 text-xs mt-1">{errors.postal_code.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                        {t('customers.latitude', 'Latitude')}
                      </label>
                      <input
                        step="any"
                        {...register('latitude', {
                          validate: val => !val || !isNaN(Number(val)) || t('customers.validation.latitudeNumeric', 'Latitude must be numeric')
                        })}
                        placeholder={t('customers.latitudePlaceholder', '11.5564')}
                        className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                      />
                      {errors.latitude && <p className="text-rose-500 text-xs mt-1">{errors.latitude.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                        {t('customers.longitude', 'Longitude')}
                      </label>
                      <input
                        step="any"
                        {...register('longitude', {
                          validate: val => !val || !isNaN(Number(val)) || t('customers.validation.longitudeNumeric', 'Longitude must be numeric')
                        })}
                        placeholder={t('customers.longitudePlaceholder', '104.9282')}
                        className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                      />
                      {errors.longitude && <p className="text-rose-500 text-xs mt-1">{errors.longitude.message}</p>}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefaultCheckbox"
                        {...register('is_default')}
                        className="rounded border-border text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="isDefaultCheckbox" className="text-sm text-foreground font-semibold cursor-pointer select-none">
                        {t('customers.setDefault', 'Set as Default Address')}
                      </label>
                    </div>
                  </div>
                </div>

                {/* PINNED FOOTER (ALWAYS VISIBLE WITHOUT SCROLLING!) */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-card shrink-0 z-10">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border border-border rounded-xl transition-colors cursor-pointer"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                    className="px-5 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {(isSubmitting || createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
                    {editingAddress ? t('customers.saveChanges', 'Save Changes') : t('customers.addAddress', 'Add Address')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('confirm.deleteTitle', { item: t('customers.customerAddresses') })}
        message={t('confirm.deleteMessage', { item: t('customers.customerAddresses'), name: deleteTarget?.label })}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default CustomerAddressesPage
