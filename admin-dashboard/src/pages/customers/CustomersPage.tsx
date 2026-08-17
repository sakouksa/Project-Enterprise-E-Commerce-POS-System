import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { AnimatePresence } from 'framer-motion'
import {
  Users, Plus, Search, Filter, RefreshCw, Download, Settings, X, UsersRound, MapPin
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import ResetButton from '@/components/shared/ResetButton'
import WorkspaceTabs from '@/components/shared/WorkspaceTabs'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Breadcrumb from '@/components/common/Breadcrumb'
import ColumnSettingsPopover from '@/components/shared/ColumnSettingsPopover'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'

import CustomerGroupsPage from './CustomerGroupsPage'
import CustomerAddressesPage from './CustomerAddressesPage'

import { CustomerStatsCards } from './components/CustomerStatsCards'
import { CustomerFilterDrawer } from './components/CustomerFilterDrawer'
import { CustomerDetailDrawer } from './components/CustomerDetailDrawer'
import { CustomerFormModal } from './components/CustomerFormModal'
import { CustomerTableSection } from './components/CustomerTableSection'
import { getAbsoluteImageUrl } from '@/utils/image'
import type { Customer, CustomerFormData } from './types'

const CustomersPage: React.FC = () => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['customers', 'common', 'toast'])
  const toast = useToast()
  const qc = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
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

  // Subtab Action Delegators
  const [groupsActions, setGroupsActions] = useState<{ openAdd: () => void; exportData: () => void } | null>(null)
  const [addressesActions, setAddressesActions] = useState<{ openAdd: () => void; exportData: () => void } | null>(null)

  // Photo upload states
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoAction, setPhotoAction] = useState<'keep' | 'remove' | 'change'>('keep')

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
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
      credit_limit: '1000',
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

  // Top stats cards remain active across tab changes for enterprise CRM overview
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
      toast.success(t('toast.created', { item: t('customers.title', 'Customer') }))
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error', 'Failed to create customer.'))
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => api.post(`/customers/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
      toast.success(t('toast.updated', { item: t('customers.title', 'Customer') }))
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? t('toast.error', 'Failed to update customer.'))
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
      toast.success(t('toast.deleted', { item: t('customers.title', 'Customer') }))
      setDeleteTarget(null)
      adjustAfterDelete(customers.length)
    },
    onError: () => {
      toast.error(t('toast.error', 'Failed to delete customer.'))
      setDeleteTarget(null)
    }
  })

  const openCreateModal = () => {
    navigate('/customers/create')
  }

  const openEditModal = (cust: Customer) => {
    navigate(`/customers/${cust.id}/edit`)
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

  const handleExport = () => {
    const infoId = toast.info(t('customers.toast.exportDownloading', 'Downloading customer dataset...'))
    setTimeout(() => {
      try {
        const headers = [
          t('customers.id', 'ID'),
          t('customers.name', 'Customer Name'),
          t('customers.email', 'Email'),
          t('customers.phone', 'Phone'),
          t('customers.customerGroup', 'Group'),
          t('customers.totalSpent', 'Total Spent'),
          t('customers.orderCount', 'Orders'),
          t('customers.loyaltyPoints', 'Loyalty Points'),
          t('common.status', 'Status'),
        ]
        const rows = (customers || []).map((c: any) => [
          c.id,
          `"${(c.name || '').replace(/"/g, '""')}"`,
          `"${(c.email || '').replace(/"/g, '""')}"`,
          `"${(c.phone || '').replace(/"/g, '""')}"`,
          `"${(c.group?.name || t('customers.standardGroup', 'Standard')).replace(/"/g, '""')}"`,
          c.total_spent || 0,
          c.order_count || 0,
          c.loyalty_points || 0,
          c.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')
        ])
        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `customers_export_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.dismiss(infoId)
        toast.success(t('customers.toast.exportSuccess', 'Customer list exported successfully.'))
      } catch (e) {
        toast.dismiss(infoId)
        toast.error(t('toast.error', 'Export failed'))
      }
    }, 400)
  }

  const resetAllFilters = () => {
    setStatusFilter('all')
    setGroupIdFilter('')
    setGenderFilter('')
    resetPagination()
  }

  return (
    <div className="space-y-5 print:p-0">
      <Breadcrumb
        items={
          activeTab === 'groups'
            ? [
                { label: t('customers.title', 'Customers'), path: '/customers' },
                { label: t('customers.customerGroups', 'Customer Groups') }
              ]
            : activeTab === 'addresses'
            ? [
                { label: t('customers.title', 'Customers'), path: '/customers' },
                { label: t('customers.customerAddresses', 'Customer Addresses') }
              ]
            : [{ label: t('customers.title', 'Customers') }]
        }
      />

      {/* Hero Header */}
      <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs print:hidden">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span>{t('customers.headerTitle', 'Customer Relationship Management')}</span>
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            {t('customers.headerSubtitle', 'Manage customer accounts, purchase history, loyalty rewards, customer groups, and delivery addresses.')}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'customers' ? (
            <>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs cursor-pointer"
              >
                <Download size={15} />
                <span>{t('customers.exportCsv', 'Export CSV')}</span>
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
              >
                <Plus size={16} />
                <span>{t('customers.addCustomer', 'Add Customer')}</span>
              </button>
            </>
          ) : activeTab === 'groups' ? (
            <>
              <button
                onClick={() => groupsActions?.exportData?.()}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs cursor-pointer"
              >
                <Download size={15} />
                <span>{t('customers.exportCsv', 'Export CSV')}</span>
              </button>
              <button
                onClick={() => groupsActions?.openAdd?.()}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
              >
                <Plus size={16} />
                <span>{t('customers.addGroup', 'Add Group')}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => addressesActions?.exportData?.()}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs cursor-pointer"
              >
                <Download size={15} />
                <span>{t('customers.exportCsv', 'Export CSV')}</span>
              </button>
              <button
                onClick={() => addressesActions?.openAdd?.()}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
              >
                <Plus size={16} />
                <span>{t('customers.addAddress', 'Add Address')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Top Overview Cards (Clean Design & Always Visible at top across tab changes) */}
      <CustomerStatsCards stats={statsData} totalFallback={pagination.total} />

      {/* Sub-tabs Navigation */}
      <WorkspaceTabs
        tabs={[
          { id: 'customers', label: t('customers.tab_allCustomers', 'All Customers'), icon: Users },
          { id: 'groups', label: t('customers.tab_groups', 'Customer Groups'), icon: UsersRound },
          { id: 'addresses', label: t('customers.tab_addresses', 'Delivery Addresses'), icon: MapPin },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Active Tab View */}
      {activeTab === 'groups' ? (
        <CustomerGroupsPage isTab={true} onRegisterActions={setGroupsActions} />
      ) : activeTab === 'addresses' ? (
        <CustomerAddressesPage isTab={true} onRegisterActions={setAddressesActions} />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border shadow-sm print:hidden">
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
              <div className="relative min-w-[280px] sm:min-w-[340px] md:w-96 max-w-md flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t('customers.searchPlaceholder', 'Search customer name, email, phone...')}
                  className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm rounded-xl border border-border bg-card hover:border-muted-foreground/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all placeholder:text-muted-foreground shadow-sm font-medium"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                    type="button"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className={`inline-flex items-center gap-2 h-10 px-3.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer select-none shrink-0 ${
                  (statusFilter !== 'all' || groupIdFilter || genderFilter)
                    ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15'
                    : 'border-border bg-card hover:bg-muted/80 text-foreground'
                }`}
              >
                <Filter size={15} className={(statusFilter !== 'all' || groupIdFilter || genderFilter) ? 'text-primary' : 'text-muted-foreground'} />
                <span>{t('common.filter', 'Filter')}</span>
                {(statusFilter !== 'all' || groupIdFilter || genderFilter) && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              <ResetButton onClick={resetAllFilters} />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                type="button"
                onClick={() => qc.invalidateQueries({ queryKey: ['customers'] })}
                className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/80 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer shrink-0"
                title={t('common.refresh', 'Refresh')}
              >
                <RefreshCw size={15} />
              </button>

              <ColumnSettingsPopover
                columns={[
                  { key: 'name', label: t('customers.name', 'Customer Name') },
                  { key: 'email', label: t('customers.email', 'Email') },
                  { key: 'phone', label: t('customers.phone', 'Phone') },
                  { key: 'group', label: t('customers.customerGroup', 'Group') },
                  { key: 'totalSpent', label: t('customers.totalSpent', 'Total Spent') },
                  { key: 'orderCount', label: t('customers.ordersCount', 'Orders') },
                  { key: 'loyaltyPoints', label: t('customers.loyaltyPoints', 'Loyalty Points') },
                  { key: 'status', label: t('common.status', 'Status') },
                ]}
                visibleColumns={visibleColumns}
                onChange={setVisibleColumns}
              />
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
            watch={watch}
            setValue={setValue}
          />

          {/* Delete Dialog */}
          <ConfirmDialog
            open={!!deleteTarget}
            title="customers.deleteTitle"
            itemName={deleteTarget?.name}
            confirmText="common.confirmDelete"
            cancelText="common.cancel"
            loading={deleteMutation.isPending}
            onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            onCancel={() => setDeleteTarget(null)}
          />
        </>
      )}
    </div>
  )
}

export default CustomersPage
