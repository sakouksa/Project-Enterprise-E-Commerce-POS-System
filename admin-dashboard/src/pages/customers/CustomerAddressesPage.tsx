import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, MapPin, Loader2 } from 'lucide-react'
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
  postal_code?: string
  is_default: boolean
}

interface CustomerAddressesPageProps {
  isTab?: boolean
}

const CustomerAddressesPage: React.FC<CustomerAddressesPageProps> = ({ isTab = false }) => {
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
    reset,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'customeraddresses' })
    const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CustomerAddress | null>(null)

  // Form states
  const [customerId, setCustomerId] = useState('')
  const [label, setLabel] = useState('Home')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [country, setCountry] = useState('Cambodia')
  const [postalCode, setPostalCode] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  // Queries
  const { data: customers } = useQuery({
    queryKey: ['customers-select-dropdown'],
    queryFn: () => api.get('/customers', { params: { per_page: 200 } }).then(r => r.data.data ?? []),
  })

  const { data: addressesData, isLoading, isFetching } = useQuery({
    queryKey: ['customer-addresses', page, debouncedSearch, perPage],
    queryFn: () => api.get('/customer-addresses', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/customer-addresses', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] })
      toast.success('Customer address created successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create address.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/customer-addresses/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] })
      toast.success('Customer address updated successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update address.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/customer-addresses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-addresses'] })
      toast.success('Customer address deleted successfully.')
      setDeleteTarget(null)
      adjustAfterDelete(addresses.length)
    },
    onError: () => {
      toast.error('Failed to delete address.')
      setDeleteTarget(null)
    },
  })

  const addresses: CustomerAddress[] = addressesData?.data ?? []
  const pagination = addressesData?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingAddress(null)
    setCustomerId('')
    setLabel('Home')
    setName('')
    setPhone('')
    setAddress('')
    setCity('')
    setProvince('')
    setCountry('Cambodia')
    setPostalCode('')
    setIsDefault(false)
    setModalOpen(true)
  }

  const openEditModal = (addr: CustomerAddress) => {
    setEditingAddress(addr)
    setCustomerId(addr.customer_id.toString())
    setLabel(addr.label)
    setName(addr.name)
    setPhone(addr.phone)
    setAddress(addr.address)
    setCity(addr.city)
    setProvince(addr.province)
    setCountry(addr.country)
    setPostalCode(addr.postal_code ?? '')
    setIsDefault(addr.is_default)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingAddress(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || !name || !phone || !address || !city) {
      toast.error('Please fill in all required fields.')
      return
    }

    const payload = {
      customer_id: parseInt(customerId),
      label,
      name,
      phone,
      address,
      city,
      province,
      country,
      postal_code: postalCode || null,
      is_default: isDefault,
    }

    if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customer Addresses</h1>
            <p className="text-muted-foreground text-sm">{pagination.total} registered addresses total</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                       bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>
      )}

      {/* Filters & Actions row */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['customer-addresses'] })}
            className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>

          {isTab && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                         bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm ml-auto"
            >
              <Plus size={16} />
              Add Address
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Customer</th>
                <th className="text-left">Label</th>
                <th className="text-left">Recipient</th>
                <th className="text-left">Address</th>
                <th className="text-left">Region</th>
                <th className="text-left">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton h-4 w-32 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-28 rounded" /></td>
                    <td><div className="skeleton h-4 w-40 rounded" /></td>
                    <td><div className="skeleton h-4 w-24 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : addresses.map((addr) => (
                <tr key={addr.id} className="hover:bg-muted/10 transition-colors">
                  <td className="font-semibold text-sm text-foreground">
                    {addr.customer?.name ?? '—'}
                  </td>
                  <td className="text-sm">
                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-bold border border-border">
                      {addr.label}
                    </span>
                  </td>
                  <td className="text-sm">
                    <div className="font-medium text-foreground">{addr.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{addr.phone}</div>
                  </td>
                  <td className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {addr.address}
                  </td>
                  <td className="text-sm text-muted-foreground">
                    {addr.city}, {addr.province} ({addr.country})
                  </td>
                  <td>
                    {addr.is_default ? (
                      <span className="badge-success text-xs font-semibold">Default</span>
                    ) : (
                      <span className="badge-muted text-xs">Secondary</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(addr)}
                        className="p-1.5 hover:bg-muted text-muted-foreground hover:text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(addr)}
                        className="p-1.5 hover:bg-muted text-muted-foreground hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && addresses.length === 0 && (
                <EmptyState cols={7} message="No addresses registered yet" icon={<MapPin size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
              )}
            </tbody>
          </table>
        </TableWrapper>

        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      {/* Form Dialog Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {editingAddress ? 'Edit Customer Address' : 'Register New Address'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      Select Customer <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="form-input"
                    >
                      <option value="">-- Choose Customer --</option>
                      {customers?.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      Address Label
                    </label>
                    <input
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="e.g. Home, Office, HQ"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      Recipient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +855 12 345 678"
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. No. 123, St. 456"
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Phnom Penh"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      State / Province
                    </label>
                    <input
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Phnom Penh"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      Country
                    </label>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Cambodia"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      Postal Code
                    </label>
                    <input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="12000"
                      className="form-input"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-7">
                    <input
                      type="checkbox"
                      id="isDefaultCheckbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="rounded border-border text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <label htmlFor="isDefaultCheckbox" className="text-sm text-foreground font-semibold cursor-pointer select-none">
                      Set as default shipping address
                    </label>
                  </div>
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
                    {editingAddress ? 'Save Changes' : 'Register Address'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Customer Address"
        message={`Are you sure you want to delete ${deleteTarget?.label} address for ${deleteTarget?.name}? This action is irreversible.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default CustomerAddressesPage
