import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, Truck, ToggleLeft, ToggleRight,
  Loader2, Eye, Mail, Phone, MapPin, DollarSign, BookOpen, Building,
  ChevronUp, ChevronDown, TrendingUp, ShoppingCart, Wallet, Filter,
  Settings, Download, Printer, ArrowLeft, Calendar, Award, AlertCircle
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TableActionMenu from '@/components/shared/TableActionMenu'
import Breadcrumb from '@/components/common/Breadcrumb'

// Types & Sub-components
import { BLANK_SUPPLIER_FORM, type Supplier, type SupplierFormData, type SupplierContact } from './types/supplier.types'
import { SuppliersStatsCards } from './components/SuppliersStatsCards'
import { SuppliersFilterDrawer } from './components/SuppliersFilterDrawer'
import { SupplierDetailDrawer } from './components/SupplierDetailDrawer'
import { SupplierFormModal } from './components/SupplierFormModal'

const SuppliersPage: React.FC = () => {
  const { t } = useTranslation()
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
  } = useServerPagination({ storageKey: 'suppliers' })

  const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // Form State
  const [formData, setFormData] = useState<SupplierFormData>(BLANK_SUPPLIER_FORM)
  const [contacts, setContacts] = useState<SupplierContact[]>([])

  const setFormField = (field: keyof SupplierFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Filters State
  const [statusFilter, setStatusFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [createdByFilter, setCreatedByFilter] = useState('')
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

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

  const handleResetFilters = () => {
    setStatusFilter('')
    setCountryFilter('')
    setCityFilter('')
    setCreatedByFilter('')
    reset()
  }

  const { data: users } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => api.get('/users', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: reportData } = useQuery({
    queryKey: ['purchase-dashboard-stats'],
    queryFn: () => api.get('/purchase-report').then(r => r.data.data),
  })

  // Suppliers Query
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      'suppliers', page, debouncedSearch, perPage, sortBy, sortOrder,
      statusFilter, countryFilter, cityFilter, createdByFilter
    ],
    queryFn: () => api.get('/suppliers', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        is_active: statusFilter || undefined,
        country: countryFilter || undefined,
        city: cityFilter || undefined,
        created_by: createdByFilter || undefined
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const suppliers: Supplier[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/suppliers', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      qc.invalidateQueries({ queryKey: ['suppliers-list'] })
      toast.success(t('suppliers.toast.createSuccess', 'Supplier created successfully.'))
      setModalOpen(false)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to create supplier.')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => api.put(`/suppliers/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      qc.invalidateQueries({ queryKey: ['suppliers-list'] })
      toast.success(t('suppliers.toast.updateSuccess', 'Supplier updated successfully.'))
      setModalOpen(false)
      setEditingSupplier(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update supplier.')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/suppliers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] })
      qc.invalidateQueries({ queryKey: ['suppliers-list'] })
      toast.success(t('suppliers.toast.deleteSuccess', 'Supplier deleted successfully.'))
      setDeleteTarget(null)
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to delete supplier.')
  })

  const openCreateModal = () => {
    setEditingSupplier(null)
    setFormData(BLANK_SUPPLIER_FORM)
    setContacts([])
    setModalOpen(true)
  }

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name || '',
      code: supplier.code || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      fax: supplier.fax || '',
      address: supplier.address || '',
      city: supplier.city || '',
      province: supplier.province || '',
      country: supplier.country || '',
      postal_code: supplier.postal_code || '',
      tax_number: supplier.tax_number || '',
      bank_name: supplier.bank_name || '',
      bank_account_number: supplier.bank_account_number || '',
      bank_account_name: supplier.bank_account_name || '',
      notes: supplier.notes || '',
      is_active: !!supplier.is_active,
    })
    setContacts(supplier.contacts ? [...supplier.contacts] : [])
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      contacts: contacts.filter(c => c.name.trim().length > 0)
    }

    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="print:hidden space-y-2">
        <Breadcrumb items={[{ label: t('nav.purchaseManagement', 'Purchase Management') }, { label: t('nav.suppliers', 'Suppliers') }]} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              {t('suppliers.suppliersTitle', 'Supplier Directory')}
            </h1>
            <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
              Manage enterprise vendor relationships, logistics points of contact, credit terms, and banking information.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            {t('suppliers.addSupplier', 'Add Supplier')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <SuppliersStatsCards suppliers={suppliers} reportData={reportData} />

      {/* Search & Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm print:hidden">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[280px] sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search Supplier Name, Code, Phone, Email..."
              className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
            />
          </div>

          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted cursor-pointer shadow-sm"
          >
            <Filter size={14} />
            <span>Filter</span>
          </button>

          <ResetButton onClick={handleResetFilters} label="Reset" />
        </div>

        <button
          onClick={() => refetch()}
          className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm cursor-pointer"
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden print:hidden">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('suppliers.tableSupplier', 'Supplier')} {renderSortIcon('name')}
                </th>
                <th onClick={() => handleSort('code')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('suppliers.tableCode', 'Code')} {renderSortIcon('code')}
                </th>
                <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('suppliers.tableContacts', 'Contacts')}
                </th>
                <th onClick={() => handleSort('city')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('suppliers.tableLocation', 'Location')} {renderSortIcon('city')}
                </th>
                <th className="text-left py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('suppliers.tableTaxNumber', 'Tax Number')}
                </th>
                <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap">
                  {t('suppliers.tableStatus', 'Status')} {renderSortIcon('is_active')}
                </th>
                <th className="sticky right-0 z-10 bg-background border-l border-border text-center py-3.5 px-4 font-semibold text-xs uppercase text-muted-foreground whitespace-nowrap min-w-[96px]">{t('suppliers.tableActions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4"><div className="skeleton h-4 w-32 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-36 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                    <td className="p-4"><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground text-sm">
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-muted/30 transition-colors group cursor-pointer" onClick={() => setViewSupplier(supplier)}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Truck size={15} className="text-primary shrink-0" />
                        <span className="font-bold text-foreground text-xs">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {supplier.code}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      <div className="space-y-0.5">
                        {supplier.email && <div className="flex items-center gap-1"><Mail size={11} /> {supplier.email}</div>}
                        {supplier.phone && <div className="flex items-center gap-1"><Phone size={11} /> {supplier.phone}</div>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {supplier.city ? `${supplier.city}, ${supplier.country || ''}` : supplier.address || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {supplier.tax_number || '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-xs font-bold">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        supplier.is_active
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {supplier.is_active ? t('suppliers.active', 'Active') : t('suppliers.inactive', 'Inactive')}
                      </span>
                    </td>
                    <td className="sticky right-0 z-10 bg-background group-hover:bg-muted border-l border-border py-3 px-4 text-center whitespace-nowrap min-w-[96px]" onClick={(e) => e.stopPropagation()}>
                      <TableActionMenu
                        onView={() => setViewSupplier(supplier)}
                        onEdit={() => openEditModal(supplier)}
                        onDelete={() => setDeleteTarget(supplier)}
                      />
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

      {/* Form Modal */}
      <SupplierFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingSupplier={editingSupplier}
        formData={formData}
        setFormField={setFormField}
        contacts={contacts}
        setContacts={setContacts}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
      />

      {/* Detail Drawer */}
      <SupplierDetailDrawer
        supplier={viewSupplier}
        onClose={() => setViewSupplier(null)}
        onOpenEdit={(s) => openEditModal(s)}
      />

      {/* Filter Drawer */}
      <SuppliersFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        countryFilter={countryFilter}
        setCountryFilter={setCountryFilter}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        users={users || []}
        createdByFilter={createdByFilter}
        setCreatedByFilter={setCreatedByFilter}
        onReset={handleResetFilters}
        setPage={setPage}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Supplier"
        message={`Are you sure you want to permanently delete supplier "${deleteTarget?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  )
}

export default SuppliersPage
