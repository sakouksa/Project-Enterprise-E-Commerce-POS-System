import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'
import {
  Users, Plus, Search, Filter, RefreshCw, Download, Settings
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import ResetButton from '@/components/shared/ResetButton'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

import CustomerGroupsPage from './CustomerGroupsPage'
import CustomerAddressesPage from './CustomerAddressesPage'

import { CustomerStatsCards } from './components/CustomerStatsCards'
import { CustomerFilterDrawer } from './components/CustomerFilterDrawer'
import { CustomerDetailDrawer } from './components/CustomerDetailDrawer'
import { CustomerFormModal } from './components/CustomerFormModal'
import { CustomerTableSection } from './components/CustomerTableSection'
import type { Customer, CustomerFormData } from './types'

const CustomersPage: React.FC = () => {
  const { t } = useTranslation()
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
    reset: resetPagination,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'customers' })

  // Modals & Drawers
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [showColSettings, setShowColSettings] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    email: true,
    phone: true,
    group: true,
    totalSpent: true,
    orderCount: true,
    loyaltyPoints: true,
    status: true,
    actions: true,
  })

  // Filter States
  const [statusFilter, setStatusFilter] = useState('all')
  const [groupIdFilter, setGroupIdFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')

  // Photo upload states
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoAction, setPhotoAction] = useState<'keep' | 'remove' | 'change'>('keep')

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CustomerFormData>({
    defaultValues: {
      company_id: '1',
      customer_group_id: '',
      user_id: '',
      name: '',
      email: '',
      phone: '',
      gender: '',
      birth_date: '',
      tax_number: '',
      notes: '',
      is_active: true
    }
  })

  // Queries
  const { data: companies } = useQuery({
    queryKey: ['companies-list-dropdown'],
    queryFn: () => api.get('/companies', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: groups } = useQuery({
    queryKey: ['customer-groups-list'],
    queryFn: () => api.get('/customer-groups', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: users } = useQuery({
    queryKey: ['users-list-dropdown'],
    queryFn: () => api.get('/users', { params: { per_page: 200 } }).then(r => r.data.data ?? []),
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['customers', page, debouncedSearch, perPage, statusFilter, groupIdFilter, genderFilter],
    queryFn: () => api.get('/customers', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        status: statusFilter,
        customer_group_id: groupIdFilter,
        gender: genderFilter,
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
    enabled: activeTab === 'customers',
  })

  const { data: statsData } = useQuery({
    queryKey: ['customers-stats', debouncedSearch, statusFilter, groupIdFilter, genderFilter],
    queryFn: () => api.get('/customers/stats', {
      params: {
        search: debouncedSearch,
        status: statusFilter,
        customer_group_id: groupIdFilter,
        gender: genderFilter,
      }
    }).then(r => r.data.data),
    enabled: activeTab === 'customers',
  })

  const customers: Customer[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => api.post('/customers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
      toast.success('Customer registered successfully.')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to create customer.')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => api.post(`/customers/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
      toast.success('Customer profile updated.')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update customer.')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
      toast.success('Customer deleted.')
      setDeleteTarget(null)
      adjustAfterDelete(customers.length)
    },
    onError: () => {
      toast.error('Failed to delete customer.')
      setDeleteTarget(null)
    }
  })

  const openCreateModal = () => {
    setEditingCustomer(null)
    setPhotoFile(null)
    setPhotoPreview(null)
    setPhotoAction('keep')
    reset({
      company_id: '1',
      customer_group_id: '',
      user_id: '',
      name: '',
      email: '',
      phone: '',
      gender: '',
      birth_date: '',
      credit_limit: '1000',
      tax_number: '',
      notes: '',
      is_active: true
    })
    setModalOpen(true)
  }

  const openEditModal = (cust: Customer) => {
    setEditingCustomer(cust)
    setPhotoFile(null)
    setPhotoPreview(cust.photo ?? null)
    setPhotoAction('keep')
    reset({
      company_id: cust.company_id.toString(),
      customer_group_id: cust.customer_group_id?.toString() ?? '',
      user_id: cust.user_id?.toString() ?? '',
      name: cust.name,
      email: cust.email ?? '',
      phone: cust.phone ?? '',
      gender: cust.gender ?? '',
      birth_date: cust.birth_date ?? '',
      credit_limit: cust.credit_limit?.toString() ?? '1000',
      tax_number: cust.tax_number ?? '',
      notes: cust.notes ?? '',
      is_active: cust.is_active
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCustomer(null)
  }

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
      setPhotoAction('change')
    }
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    setPhotoAction('remove')
  }

  const onFormSubmit = (formData: CustomerFormData) => {
    const dataPayload = new FormData()
    dataPayload.append('company_id', formData.company_id)
    if (formData.customer_group_id) dataPayload.append('customer_group_id', formData.customer_group_id)
    if (formData.user_id) dataPayload.append('user_id', formData.user_id)
    dataPayload.append('name', formData.name)
    if (formData.email) dataPayload.append('email', formData.email)
    if (formData.phone) dataPayload.append('phone', formData.phone)
    if (formData.gender) dataPayload.append('gender', formData.gender)
    if (formData.birth_date) dataPayload.append('birth_date', formData.birth_date)
    if (formData.credit_limit) dataPayload.append('credit_limit', formData.credit_limit)
    if (formData.tax_number) dataPayload.append('tax_number', formData.tax_number)
    if (formData.notes) dataPayload.append('notes', formData.notes)
    dataPayload.append('is_active', formData.is_active ? '1' : '0')

    if (photoAction === 'change' && photoFile) {
      dataPayload.append('photo', photoFile)
    } else if (photoAction === 'remove') {
      dataPayload.append('photo', '')
    }

    if (editingCustomer) {
      dataPayload.append('_method', 'PUT')
      updateMutation.mutate({ id: editingCustomer.id, data: dataPayload })
    } else {
      createMutation.mutate(dataPayload)
    }
  }

  const handleExport = () => toast.info('Exporting customer dataset...')

  const resetAllFilters = () => {
    setStatusFilter('all')
    setGroupIdFilter('')
    setGenderFilter('')
    resetPagination()
  }

  return (
    <div className="space-y-5 print:p-0">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Customers' }]} />

      {/* Hero Header */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span>Customer Relationship Management</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            Manage customer accounts, purchase history, loyalty rewards, customer groups, and delivery addresses.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto no-scrollbar print:hidden">
        {[
          { id: 'customers', label: 'All Customers' },
          { id: 'groups', label: 'Customer Groups' },
          { id: 'addresses', label: 'Delivery Addresses' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'groups' ? (
        <CustomerGroupsPage />
      ) : activeTab === 'addresses' ? (
        <CustomerAddressesPage />
      ) : (
        <>
          {/* KPI Cards */}
          <CustomerStatsCards stats={statsData} totalFallback={pagination.total} />

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-xs print:hidden">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[260px] sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search customer name, email, phone..."
                  className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground"
                />
              </div>

              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all shadow-xs"
              >
                <Filter size={14} />
                <span>Filter</span>
              </button>

              <ResetButton onClick={resetAllFilters} />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => qc.invalidateQueries({ queryKey: ['customers'] })}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowColSettings(!showColSettings)}
                  className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-xs"
                  title="Column Settings"
                >
                  <Settings size={14} />
                </button>
                <AnimatePresence>
                  {showColSettings && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowColSettings(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1">
                        <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">Toggle Columns</p>
                        {Object.keys(visibleColumns).map((col) => (
                          <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                            <input
                              type="checkbox"
                              checked={visibleColumns[col]}
                              onChange={(e) => setVisibleColumns((prev) => ({ ...prev, [col]: e.target.checked }))}
                              className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                            />
                            <span>{col}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Filter Drawer */}
          <CustomerFilterDrawer
            isOpen={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            groupIdFilter={groupIdFilter}
            setGroupIdFilter={setGroupIdFilter}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            groups={groups || []}
            onReset={resetAllFilters}
          />

          {/* Table */}
          <CustomerTableSection
            customers={customers}
            isLoading={isLoading}
            isFetching={isFetching}
            visibleColumns={visibleColumns}
            openEditModal={openEditModal}
            setViewCustomer={setViewCustomer}
            setDeleteTarget={setDeleteTarget}
          />

          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />

          {/* Detail Drawer */}
          <CustomerDetailDrawer
            customer={viewCustomer}
            onClose={() => setViewCustomer(null)}
            openEditModal={openEditModal}
          />

          {/* Form Modal */}
          <CustomerFormModal
            isOpen={modalOpen}
            onClose={closeModal}
            editingCustomer={editingCustomer}
            onSubmit={handleSubmit(onFormSubmit)}
            isSubmitting={isSubmitting || createMutation.isPending || updateMutation.isPending}
            register={register}
            errors={errors}
            companies={companies || []}
            groups={groups || []}
            users={users || []}
            photoPreview={photoPreview}
            onPhotoChange={onPhotoChange}
            removePhoto={removePhoto}
          />

          {/* Delete Dialog */}
          <ConfirmDialog
            open={!!deleteTarget}
            title="Delete Customer Profile"
            message={`Are you sure you want to delete customer "${deleteTarget?.name}"?`}
            onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            onCancel={() => setDeleteTarget(null)}
          />
        </>
      )}
    </div>
  )
}

export default CustomersPage
