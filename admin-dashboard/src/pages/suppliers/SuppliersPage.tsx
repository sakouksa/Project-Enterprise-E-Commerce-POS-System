import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, Truck, ToggleLeft, ToggleRight,
  Loader2, Eye, Mail, Phone, MapPin, DollarSign, BookOpen, Building,
  ChevronUp, ChevronDown
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
  const qc    = useQueryClient()
  const toast = useToast()
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
    queryKey: ['suppliers', page, debouncedSearch, perPage, sortBy, sortOrder],
    queryFn: () => api.get('/suppliers', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder
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
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Purchases' }, { label: 'Suppliers' }]} />

      <PageHeader
        title="Suppliers"
        subtitle="Manage logistics partners, wholesalers, and vendor directories"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                       bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus size={16} />
            Add Supplier
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['suppliers'] })}
            className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Supplier {renderSortIcon('name')}
                </th>
                <th onClick={() => handleSort('code')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Code {renderSortIcon('code')}
                </th>
                <th onClick={() => handleSort('email')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Contacts {renderSortIcon('email')}
                </th>
                <th onClick={() => handleSort('city')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Location {renderSortIcon('city')}
                </th>
                <th onClick={() => handleSort('tax_number')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Tax Number {renderSortIcon('tax_number')}
                </th>
                <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted/65 py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">
                  Status {renderSortIcon('is_active')}
                </th>
                <th className="text-right py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground select-none">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton h-4 w-32 rounded" /></td>
                      <td><div className="skeleton h-4 w-16 rounded" /></td>
                      <td><div className="skeleton h-4 w-28 rounded" /></td>
                      <td><div className="skeleton h-4 w-36 rounded" /></td>
                      <td><div className="skeleton h-4 w-20 rounded" /></td>
                      <td><div className="skeleton h-4 w-16 rounded" /></td>
                      <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                    </tr>
                  ))
                : suppliers.map((supplier) => (
                    <tr key={supplier.id} className="group hover:bg-muted/25 transition-colors">
                      <td>
                        <div className="flex items-center gap-2">
                          <Truck size={16} className="text-primary flex-shrink-0" />
                          <span className="font-medium text-foreground text-sm">{supplier.name}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-muted-foreground">{supplier.code}</td>
                      <td>
                        <div className="text-xs space-y-0.5 text-muted-foreground">
                          {supplier.email && <div className="flex items-center gap-1"><Mail size={10} /> {supplier.email}</div>}
                          {supplier.phone && <div className="flex items-center gap-1"><Phone size={10} /> {supplier.phone}</div>}
                        </div>
                      </td>
                      <td className="text-muted-foreground text-sm">
                        {supplier.city ? `${supplier.city}, ${supplier.province ?? ''}` : supplier.address ?? '—'}
                      </td>
                      <td className="text-muted-foreground font-mono text-xs">{supplier.tax_number ?? '—'}</td>
                      <td>
                        <span className={supplier.is_active ? 'badge-success' : 'badge-muted'}>
                          {supplier.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
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
                    <p className="text-muted-foreground">No suppliers found</p>
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
    </div>
  )
}

export default SuppliersPage
