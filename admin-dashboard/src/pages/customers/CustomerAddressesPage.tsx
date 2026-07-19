import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, MapPin, Loader2,
  ChevronUp, ChevronDown, Download
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
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
}

const CustomerAddressesPage: React.FC<CustomerAddressesPageProps> = ({ isTab = false }) => {
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
    const headers = ['ID', 'Customer', 'Label', 'Receiver Name', 'Phone', 'Address', 'City', 'Province', 'Country', 'Postal Code', 'Latitude', 'Longitude', 'Default']
    const rows = addresses.map(addr => [
      addr.id,
      addr.customer?.name || `Customer #${addr.customer_id}`,
      addr.label,
      `"${addr.name.replace(/"/g, '""')}"`,
      `"${addr.phone.replace(/"/g, '""')}"`,
      `"${addr.address.replace(/"/g, '""')}"`,
      `"${addr.city.replace(/"/g, '""')}"`,
      `"${addr.province.replace(/"/g, '""')}"`,
      `"${addr.country.replace(/"/g, '""')}"`,
      addr.postal_code,
      addr.latitude || '',
      addr.longitude || '',
      addr.is_default ? 'Yes' : 'No'
    ])
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `customer_addresses_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(t('toast.exportSuccess'))
  }

  const handleResetFilters = () => {
    setCustomerFilter('')
    setDefaultFilter('all')
    setSortBy('created_at')
    setSortOrder('desc')
    resetPagination()
  }

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
            <button onClick={handleExport} className="btn-secondary flex items-center gap-1.5 px-4 py-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors text-sm font-medium">
              <Download size={16} />
              {t('common.export')}
            </button>
            <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-sm font-medium">
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
            <select
              value={customerFilter}
              onChange={e => { setCustomerFilter(e.target.value); setPage(1) }}
              className="form-input w-48"
            >
              <option value="">{t('customers.title')}: {t('common.allStatus')}</option>
              {customers?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Default/Secondary Filter */}
            <select
              value={defaultFilter}
              onChange={e => { setDefaultFilter(e.target.value); setPage(1) }}
              className="form-input w-40"
            >
              <option value="all">{t('common.status')}: {t('common.allStatus')}</option>
              <option value="default">{t('customers.defaultAddress')}</option>
              <option value="secondary">Secondary</option>
            </select>

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
              className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              title={t('common.refresh')}
            >
              <RefreshCw size={14} />
            </button>

            {isTab && (
              <>
                <button onClick={handleExport} className="btn-secondary flex items-center gap-1.5 px-3 py-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors text-sm font-medium">
                  <Download size={14} />
                  {t('common.export')}
                </button>
                <button onClick={openCreateModal} className="btn-primary flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-sm font-medium">
                  <Plus size={14} />
                  {t('customers.addAddress')}
                </button>
              </>
            )}
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
                  <th onClick={() => handleSort('id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    ID {renderSortIcon('id')}
                  </th>
                  <th onClick={() => handleSort('customer_id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('customers.title')} {renderSortIcon('customer_id')}
                  </th>
                  <th onClick={() => handleSort('label')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('customers.addressLabel')} {renderSortIcon('label')}
                  </th>
                  <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('customers.recipient')} {renderSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('phone')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('common.phone')} {renderSortIcon('phone')}
                  </th>
                  <th onClick={() => handleSort('address')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('common.address')} {renderSortIcon('address')}
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('customers.region')}
                  </th>
                  <th onClick={() => handleSort('postal_code')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('customers.postalCode')} {renderSortIcon('postal_code')}
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    Coordinates (Lat, Lng)
                  </th>
                  <th onClick={() => handleSort('is_default')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('customers.defaultAddress')} {renderSortIcon('is_default')}
                  </th>
                  <th className="text-right p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-muted/5">
                      <td className="p-4"><div className="skeleton h-4 w-8 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-32 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-40 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-36 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-12 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-24 rounded" /></td>
                      <td className="p-4 text-right"><div className="skeleton h-4 w-16 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : addresses.map((addr) => (
                  <tr key={addr.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 text-sm font-mono text-muted-foreground">{addr.id}</td>
                    <td className="p-4 font-semibold text-sm text-foreground">
                      {addr.customer?.name ?? '—'}
                    </td>
                    <td className="p-4 text-sm">
                      <span className="px-2.5 py-0.5 rounded bg-muted text-muted-foreground text-xs font-bold border border-border">
                        {addr.label}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-semibold text-foreground">{addr.name}</td>
                    <td className="p-4 text-sm font-mono text-muted-foreground">{addr.phone}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate" title={addr.address}>
                      {addr.address}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {addr.city}, {addr.province} ({addr.country})
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{addr.postal_code}</td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">
                      {addr.latitude !== null && addr.longitude !== null ? `${addr.latitude}, ${addr.longitude}` : '—'}
                    </td>
                    <td className="p-4 text-sm">
                      {addr.is_default ? (
                        <span className="badge-success text-xs font-semibold">{t('customers.defaultAddress')}</span>
                      ) : (
                        <span className="badge-muted text-xs">Secondary</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(addr)}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(addr)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
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
              className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl my-8"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {editingAddress ? t('customers.editAddress') : t('customers.addAddress')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.title')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('customer_id', { required: t('customers.validation.customerRequired') })}
                      className="form-input"
                    >
                      <option value="">-- Choose Customer --</option>
                      {customers?.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.addressLabel')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('label', { required: true })}
                      className="form-input"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.receiverName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name', { required: t('customers.validation.receiverNameRequired') })}
                      placeholder="e.g. Jane Doe"
                      className="form-input"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('common.phone')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('phone', { required: t('customers.validation.phoneRequired') })}
                      placeholder="e.g. +855 12 345 678"
                      className="form-input"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('customers.streetAddress')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('address', { required: t('customers.validation.addressRequired') })}
                    placeholder="e.g. No. 123, St. 456"
                    className="form-input"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.city')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('city', { required: t('customers.validation.cityRequired') })}
                      placeholder="Phnom Penh"
                      className="form-input"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.province')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('province', { required: t('customers.validation.provinceRequired') })}
                      placeholder="Phnom Penh"
                      className="form-input"
                    />
                    {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.country')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('country', { required: t('customers.validation.countryRequired') })}
                      placeholder="Cambodia"
                      className="form-input"
                    />
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.postalCode')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('postal_code', { required: t('customers.validation.postalCodeRequired') })}
                      placeholder="12000"
                      className="form-input"
                    />
                    {errors.postal_code && <p className="text-red-500 text-xs mt-1">{errors.postal_code.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.latitude')}
                    </label>
                    <input
                      step="any"
                      {...register('latitude', {
                        validate: val => !val || !isNaN(Number(val)) || t('customers.validation.latitudeNumeric')
                      })}
                      placeholder="11.5564"
                      className="form-input"
                    />
                    {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.longitude')}
                    </label>
                    <input
                      step="any"
                      {...register('longitude', {
                        validate: val => !val || !isNaN(Number(val)) || t('customers.validation.longitudeNumeric')
                      })}
                      placeholder="104.9282"
                      className="form-input"
                    />
                    {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDefaultCheckbox"
                      {...register('is_default')}
                      className="rounded border-border text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <label htmlFor="isDefaultCheckbox" className="text-sm text-foreground font-semibold cursor-pointer select-none">
                      {t('customers.setDefault')}
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted border border-border rounded-lg transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center gap-1.5"
                  >
                    {(isSubmitting || createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
                    {editingAddress ? t('common.save') : t('customers.addAddress')}
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
