import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, MapPin, Loader2,
  ChevronUp, ChevronDown, Download, Settings, CheckCircle2,
  User, Home, Building2, Phone, UserCheck, Navigation, Globe, Compass, Check, Tag
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
import { useThemeStore } from '@/stores/themeStore'

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
  onRegisterActions?: (actions: { openAdd: () => void; exportData: () => void }) => void
}

const CustomerAddressesPage: React.FC<CustomerAddressesPageProps> = ({ isTab = false, onRegisterActions }) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['customers', 'common'])
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
    if (onRegisterActions) {
      onRegisterActions({
        openAdd: openCreateModal,
        exportData: handleExport,
      })
    }
  }, [onRegisterActions, addresses])

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
                        <span className="px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-semibold border border-border/80">
                          {addr.label ? t(`customers.label${addr.label.charAt(0).toUpperCase() + addr.label.slice(1).toLowerCase()}`, addr.label) : '—'}
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
                            <span>{t('customers.defaultAddress', 'អាសយដ្ឋានលំនាំដើម')}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-border/60 whitespace-nowrap">
                            {t('customers.secondaryAddress', 'អាសយដ្ឋានរង')}
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
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-card border border-border/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                      {editingAddress
                        ? t('customers.editAddressTitle', t('customers.editAddress', 'កែសម្រួលអាសយដ្ឋានដឹកជញ្ជូន'))
                        : t('customers.addAddressTitle', t('customers.addAddress', 'បន្ថែមអាសយដ្ឋានដឹកជញ្ជូន'))}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t('customers.addressModalSubtitle', 'គ្រប់គ្រងអាសយដ្ឋាន ទីតាំង និងព័ត៌មានអ្នកទទួលទំនិញ')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                  {/* Customer & Address Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.customer', 'អតិថិជន')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <User size={15} />
                        </div>
                        <select
                          {...register('customer_id', { required: t('customers.validation.customerRequired', 'សូមជ្រើសរើសអតិថិជន') })}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                        >
                          <option value="">{t('customers.selectCustomer', '-- ជ្រើសរើសអតិថិជន --')}</option>
                          {(customers ?? []).map((c: any) => (
                            <option key={c.id} value={String(c.id)}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.customer_id && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.customer_id.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.addressLabel', 'ប្រភេទអាសយដ្ឋាន')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Tag size={15} />
                        </div>
                        <select
                          {...register('label')}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                        >
                          <option value="Home">{t('customers.labelHome', 'ផ្ទះ')}</option>
                          <option value="Office">{t('customers.labelOffice', 'ការិយាល័យ')}</option>
                          <option value="Warehouse">{t('customers.labelWarehouse', 'ឃ្លាំង')}</option>
                          <option value="Other">{t('customers.labelOther', 'ផ្សេងៗ')}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Recipient Name & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.receiverName', 'ឈ្មោះអ្នកទទួល')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <UserCheck size={15} />
                        </div>
                        <input
                          {...register('name', { required: t('customers.validation.receiverNameRequired', 'តម្រូវឱ្យបញ្ចូលឈ្មោះអ្នកទទួល') })}
                          placeholder={t('customers.receiverNamePlaceholder', 'ឧ. សុខ ចាន់ដារ៉ា')}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      {errors.name && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.phone', 'លេខទូរស័ព្ទ')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Phone size={15} />
                        </div>
                        <input
                          {...register('phone', { required: t('customers.validation.phoneRequired', 'តម្រូវឱ្យបញ្ចូលលេខទូរស័ព្ទ') })}
                          placeholder={t('customers.phonePlaceholder', '012 345 678')}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium"
                        />
                      </div>
                      {errors.phone && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                      {t('customers.streetAddress', 'អាសយដ្ឋានផ្លូវ / ទីតាំង')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <MapPin size={15} />
                      </div>
                      <input
                        {...register('address', { required: t('customers.validation.addressRequired', 'តម្រូវឱ្យបញ្ចូលអាសយដ្ឋានផ្លូវ') })}
                        placeholder={t('customers.streetAddressPlaceholder', 'ឧ. ផ្ទះលេខ ១២៣ ផ្លូវ ៤៥៦')}
                        className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    {errors.address && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.address.message}</p>}
                  </div>

                  {/* City, Province, Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.city', 'រាជធានី/ក្រុង')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Navigation size={14} />
                        </div>
                        <input
                          {...register('city', { required: t('customers.validation.cityRequired', 'តម្រូវឱ្យបញ្ចូលរាជធានី/ក្រុង') })}
                          placeholder={t('customers.cityPlaceholder', 'ឧ. ភ្នំពេញ')}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      {errors.city && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.city.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.province', 'ខេត្ត/រដ្ឋ')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Building2 size={14} />
                        </div>
                        <input
                          {...register('province', { required: t('customers.validation.provinceRequired', 'តម្រូវឱ្យបញ្ចូលខេត្ត/រដ្ឋ') })}
                          placeholder={t('customers.provincePlaceholder', 'ឧ. ភ្នំពេញ')}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      {errors.province && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.province.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.country', 'ប្រទេស')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Globe size={14} />
                        </div>
                        <input
                          {...register('country', { required: t('customers.validation.countryRequired', 'តម្រូវឱ្យបញ្ចូលប្រទេស') })}
                          placeholder={t('customers.countryPlaceholder', 'កម្ពុជា')}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      {errors.country && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.country.message}</p>}
                    </div>
                  </div>

                  {/* Postal Code, Latitude, Longitude */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.postalCode', 'លេខកូដប្រៃសណីយ៍')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Compass size={14} />
                        </div>
                        <input
                          {...register('postal_code', { required: t('customers.validation.postalCodeRequired', 'តម្រូវឱ្យបញ្ចូលលេខកូដប្រៃសណីយ៍') })}
                          placeholder={t('customers.postalCodePlaceholder', '12000')}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium"
                        />
                      </div>
                      {errors.postal_code && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.postal_code.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.latitude', 'រយៈទទឹង (Latitude)')}
                      </label>
                      <input
                        step="any"
                        {...register('latitude', {
                          validate: val => !val || !isNaN(Number(val)) || t('customers.validation.latitudeNumeric', 'រយៈទទឹងត្រូវតែជាលេខ')
                        })}
                        placeholder={t('customers.latitudePlaceholder', '11.5564')}
                        className="form-input w-full h-9 px-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium"
                      />
                      {errors.latitude && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.latitude.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.longitude', 'រយៈបណ្តោយ (Longitude)')}
                      </label>
                      <input
                        step="any"
                        {...register('longitude', {
                          validate: val => !val || !isNaN(Number(val)) || t('customers.validation.longitudeNumeric', 'រយៈបណ្តោយត្រូវតែជាលេខ')
                        })}
                        placeholder={t('customers.longitudePlaceholder', '104.9282')}
                        className="form-input w-full h-9 px-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium"
                      />
                      {errors.longitude && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.longitude.message}</p>}
                    </div>
                  </div>

                  {/* Set as Default Address Card */}
                  <div className="p-3.5 bg-muted/15 border border-border/80 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="isDefaultCheckbox" className="text-xs sm:text-[13px] font-bold text-foreground cursor-pointer select-none">
                        {t('customers.setDefault', 'កំណត់ជាអាសយដ្ឋានលំនាំដើម')}
                      </label>
                      <p className="text-[11px] text-muted-foreground">
                        {t('customers.defaultAddressHelp', 'ប្រើប្រាស់អាសយដ្ឋាននេះជាអាទិភាពដំបូងលើការបញ្ជាទិញ និងវិក្កយបត្រ POS')}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="isDefaultCheckbox"
                      {...register('is_default')}
                      className="form-checkbox h-4.5 w-4.5 text-primary rounded border-border focus:ring-primary cursor-pointer"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-border/80 bg-muted/20 shrink-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="h-9 px-4 text-xs sm:text-[13px] font-bold border border-border/80 bg-card rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    {t('common.cancel', 'បោះបង់')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                    className="h-9 px-5 text-xs sm:text-[13px] bg-primary text-primary-foreground rounded-lg font-bold shadow-xs hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    {(isSubmitting || createMutation.isPending || updateMutation.isPending) ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    <span>
                      {editingAddress
                        ? t('customers.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ')
                        : t('customers.saveAddress', 'រក្សាទុកអាសយដ្ឋាន')}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget}
        title="customers.deleteAddressTitle"
        itemName={deleteTarget?.label ? `${deleteTarget.label} (${deleteTarget.address || deleteTarget.name || ''})` : deleteTarget?.name || deleteTarget?.address}
        confirmText="common.confirmDelete"
        cancelText="common.cancel"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default CustomerAddressesPage
