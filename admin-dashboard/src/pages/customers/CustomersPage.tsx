import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, User, Users, MapPin, ToggleLeft, ToggleRight,
  Loader2, Eye, Mail, Phone, Calendar, Award, DollarSign, BookOpen, Compass
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
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'

import CustomerGroupsPage from './CustomerGroupsPage'
import CustomerAddressesPage from './CustomerAddressesPage'

interface Customer {
  id:                number
  company_id:        number
  customer_group_id?: number
  group?:            { name: string; discount_percent: number }
  name:              string
  email?:            string
  phone?:            string
  gender?:           'male' | 'female' | 'other'
  birth_date?:       string
  total_spent:       number
  order_count:       number
  loyalty_points:    number
  tax_number?:       string
  notes?:            string
  is_active:         boolean
}

const CustomersPage: React.FC = () => {
  const toast = useToast()
  const qc = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('workspaceTab') as 'customers' | 'groups' | 'addresses') || 'customers'
  const setActiveTab = (tab: string) => {
    if (tab === 'customers') {
      setSearchParams({})
    } else {
      setSearchParams({ workspaceTab: tab })
    }
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
  } = useServerPagination({ storageKey: 'customers' })
    const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [customerGroupId, setCustomerGroupId] = useState('')
  const [gender, setGender] = useState<'' | 'male' | 'female' | 'other'>('')
  const [birthDate, setBirthDate] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [loyaltyPoints, setLoyaltyPoints] = useState('0')
  const [notes, setNotes] = useState('')
  const [isActive, setIsActive] = useState(true)

  const { data: groups } = useQuery({
    queryKey: ['customer-groups-list'],
    queryFn: () => api.get('/customer-groups').then(r => r.data.data ?? []),
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['customers', page, debouncedSearch, perPage],
    queryFn: () => api.get('/customers', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newCust: any) => api.post('/customers', newCust),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer created successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create customer.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/customers/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer updated successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update customer.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer deleted successfully.')
      setDeleteTarget(null)
      adjustAfterDelete(customers.length)
    },
    onError: () => {
      toast.error('Failed to delete customer.')
      setDeleteTarget(null)
    },
  })

  const customers: Customer[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingCustomer(null)
    setName('')
    setEmail('')
    setPhone('')
    setCustomerGroupId('')
    setGender('')
    setBirthDate('')
    setTaxNumber('')
    setLoyaltyPoints('0')
    setNotes('')
    setIsActive(true)
    setModalOpen(true)
  }

  const openEditModal = (cust: Customer) => {
    setEditingCustomer(cust)
    setName(cust.name)
    setEmail(cust.email ?? '')
    setPhone(cust.phone ?? '')
    setCustomerGroupId(cust.customer_group_id?.toString() ?? '')
    setGender(cust.gender ?? '')
    setBirthDate(cust.birth_date ?? '')
    setTaxNumber(cust.tax_number ?? '')
    setLoyaltyPoints(cust.loyalty_points?.toString() ?? '0')
    setNotes(cust.notes ?? '')
    setIsActive(cust.is_active)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCustomer(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      company_id: 1,
      name,
      email: email || null,
      phone: phone || null,
      customer_group_id: customerGroupId ? Number(customerGroupId) : null,
      gender: gender || null,
      birth_date: birthDate || null,
      tax_number: taxNumber || null,
      loyalty_points: Number(loyaltyPoints) || 0,
      notes: notes || null,
      is_active: isActive,
    }

    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Customers' }, { label: activeTab === 'customers' ? 'Directory' : activeTab === 'groups' ? 'Groups' : 'Addresses' }]} />

      {/* Workspace Tabs */}
      <div className="flex border-b border-border bg-card rounded-t-xl px-4 overflow-x-auto gap-2">
        {[
          { id: 'customers', label: 'Customer List', icon: <User size={14} /> },
          { id: 'groups',    label: 'Customer Groups', icon: <Users size={14} /> },
          { id: 'addresses', label: 'Customer Addresses', icon: <MapPin size={14} /> },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setPage(1); setSearch(''); setActiveTab(item.id); }}
              className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                          ${isActive
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      <PageHeader
        title={
          activeTab === 'customers' ? 'Customers' :
          activeTab === 'groups' ? 'Customer Groups' :
          'Customer Addresses'
        }
        subtitle={
          activeTab === 'customers' ? 'Manage customer profiles, loyalty tiers, and purchase parameters' :
          activeTab === 'groups' ? 'Segment customers into groups with customized discounts' :
          'Manage physical locations and default delivery coordinates for customers'
        }
        action={
          activeTab === 'customers' && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                         bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus size={16} />
              Add Customer
            </button>
          )
        }
      />

      {activeTab === 'groups' ? (
        <CustomerGroupsPage isTab />
      ) : activeTab === 'addresses' ? (
        <CustomerAddressesPage isTab />
      ) : (
        <>
          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
              <button
                onClick={() => qc.invalidateQueries({ queryKey: ['customers'] })}
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
                  <tr>
                    <th className="text-left">Customer</th>
                    <th className="text-left">Group Tier</th>
                    <th className="text-left">Contact Info</th>
                    <th className="text-left">Total Spent</th>
                    <th className="text-left">Loyalty Points</th>
                    <th className="text-left">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <LoadingSkeleton cols={7} />
                  ) : (data?.data ?? []).map((c: Customer) => (
                        <tr key={c.id} className="group hover:bg-muted/25 transition-colors">
                          <td>
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-primary flex-shrink-0" />
                              <span className="font-medium text-foreground text-sm">{c.name}</span>
                            </div>
                          </td>
                          <td>
                            {c.group ? (
                              <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/30">
                                {c.group.name} ({c.group.discount_percent}%)
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground font-light">Regular</span>
                            )}
                          </td>
                          <td>
                            <div className="text-xs space-y-0.5 text-muted-foreground">
                              {c.email && <div className="flex items-center gap-1"><Mail size={10} /> {c.email}</div>}
                              {c.phone && <div className="flex items-center gap-1"><Phone size={10} /> {c.phone}</div>}
                            </div>
                          </td>
                          <td className="text-sm font-semibold text-foreground">
                            Rp {(c.total_spent ?? 0).toLocaleString('id-ID')}
                            <div className="text-[10px] text-muted-foreground font-normal">{c.order_count ?? 0} orders</div>
                          </td>
                          <td>
                            <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-950/30">
                              <Award size={10} fill="currentColor" /> {c.loyalty_points} pts
                            </span>
                          </td>
                          <td>
                            <span className={c.is_active ? 'badge-success' : 'badge-muted'}>
                              {c.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewCustomer(c)}
                                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                title="View Detail"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => openEditModal(c)}
                                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(c)}
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
                  {!isLoading && (data?.data ?? []).length === 0 && (
                    <EmptyState cols={7} message="No customers found" icon={<User size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
                  )}
                </tbody>
              </table>
            </TableWrapper>

            {/* Pagination */}
            <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
          </div>
        </>
      )}

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
                  {editingCustomer ? 'Edit Customer' : 'Add Customer'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Customer Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Customer Name"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Loyalty Tier Group</label>
                    <select
                      value={customerGroupId}
                      onChange={(e) => setCustomerGroupId(e.target.value)}
                      className="form-input"
                    >
                      <option value="">No Special Group (Regular)</option>
                      {(groups ?? []).map((g: any) => (
                        <option key={g.id} value={g.id}>{g.name} ({g.discount_percent}%)</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@email.com"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="form-input"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Tax ID / NPWP</label>
                    <input
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      placeholder="NPWP"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Loyalty Points Balance</label>
                    <input
                      type="number"
                      value={loyaltyPoints}
                      onChange={(e) => setLoyaltyPoints(e.target.value)}
                      placeholder="0"
                      className="form-input"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-6">
                    <span className="text-sm font-medium text-muted-foreground">Active Status</span>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      {isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Notes / Preferences</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specific notes or billing instructions"
                    rows={3}
                    className="form-input resize-none"
                  />
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
                    {editingCustomer ? 'Save Changes' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Drawer */}
      <AnimatePresence>
        {viewCustomer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-md border-l border-border h-full flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">Customer Profile</h3>
                <button onClick={() => setViewCustomer(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Basic Info</h4>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium text-foreground">{viewCustomer.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Group Tier:</span>
                      <span className="font-medium text-primary">{viewCustomer.group?.name ?? 'Regular'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="font-medium capitalize">{viewCustomer.gender ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Calendar size={12} /> Birth Date:</span>
                      <span className="font-medium">{viewCustomer.birth_date ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax Number:</span>
                      <span className="font-mono text-xs">{viewCustomer.tax_number ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={viewCustomer.is_active ? 'text-green-500 font-medium' : 'text-muted-foreground'}>
                        {viewCustomer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Contact Details</h4>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Mail size={12} /> Email:</span>
                      <span className="font-medium">{viewCustomer.email ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Phone size={12} /> Phone:</span>
                      <span className="font-medium">{viewCustomer.phone ?? '—'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Transactions & loyalty</h4>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><DollarSign size={12} /> Total Spent:</span>
                      <span className="font-semibold text-foreground">Rp {(viewCustomer.total_spent ?? 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orders Count:</span>
                      <span className="font-medium">{viewCustomer.order_count ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Award size={12} /> Loyalty Points:</span>
                      <span className="font-medium text-amber-500">{viewCustomer.loyalty_points ?? 0} pts</span>
                    </div>
                  </div>
                </div>

                {viewCustomer.notes && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Internal Notes</h4>
                    <div className="bg-muted/30 p-3 rounded-lg border border-border text-sm text-muted-foreground flex gap-2">
                      <BookOpen size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span>{viewCustomer.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        title="Customer"
        itemName={deleteTarget?.name || ''}
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onSoftDelete={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id)
          }
        }}
        onArchive={() => {
          if (deleteTarget) {
            updateMutation.mutate({
              id: deleteTarget.id,
              data: {
                company_id: 1,
                name: deleteTarget.name,
                email: deleteTarget.email,
                phone: deleteTarget.phone,
                is_active: false
              }
            }, {
              onSuccess: () => {
                setDeleteTarget(null)
                toast.success('Customer archived successfully.')
              }
            })
          }
        }}
      />
    </div>
  )
}

export default CustomersPage
