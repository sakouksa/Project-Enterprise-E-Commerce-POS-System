import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, User, Users, MapPin, ToggleLeft, ToggleRight,
  Loader2, Eye, Mail, Phone, Calendar, Award, DollarSign, BookOpen, Download, ChevronUp,
  ChevronDown, Image, Sparkles, Building, Briefcase, Activity
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import EmptyState from '@/components/shared/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'
import { useTranslation } from 'react-i18next'

import CustomerGroupsPage from './CustomerGroupsPage'
import CustomerAddressesPage from './CustomerAddressesPage'

interface Customer {
  id:                 number
  company_id:        number
  company?:          { name: string }
  customer_group_id?: number
  group?:            { name: string; discount_percent: number }
  user_id?:          number
  user?:             { name: string; email: string }
  name:              string
  email?:            string
  phone?:            string
  gender?:           'male' | 'female' | 'other'
  birth_date?:       string
  photo?:            string
  total_spent:       number
  order_count:       number
  loyalty_points:    number
  tax_number?:       string
  notes?:            string
  is_active:         boolean
  created_at:        string
  updated_at:        string
}

interface CustomerFormData {
  company_id: string
  customer_group_id: string
  user_id: string
  name: string
  email: string
  phone: string
  gender: string
  birth_date: string
  tax_number: string
  notes: string
  is_active: boolean
}

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

  // Modal, Drawer and target states
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  // Filters & Sorting state
  const [statusFilter, setStatusFilter] = useState('all')
  const [groupIdFilter, setGroupIdFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Detail view state tabs
  const [detailTab, setDetailTab] = useState<'overview' | 'addresses' | 'activity'>('overview')

  // Photo upload states
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoAction, setPhotoAction] = useState<'keep' | 'remove' | 'change'>('keep')

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const formIsActive = watch('is_active')

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
    queryKey: ['customers', page, debouncedSearch, perPage, statusFilter, groupIdFilter, genderFilter, startDate, endDate, sortBy, sortOrder],
    queryFn: () => api.get('/customers', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        status: statusFilter,
        customer_group_id: groupIdFilter,
        gender: genderFilter,
        start_date: startDate,
        end_date: endDate,
        sort_by: sortBy,
        sort_order: sortOrder
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  // Customer Addresses Query for Detail Drawer
  const { data: customerAddresses, isLoading: loadingAddresses } = useQuery({
    queryKey: ['customer-addresses-profile', viewCustomer?.id],
    queryFn: () => {
      if (!viewCustomer) return []
      return api.get('/customer-addresses', { params: { customer_id: viewCustomer.id } }).then(r => r.data.data ?? [])
    },
    enabled: !!viewCustomer,
  })

  // Customer Orders Query for Detail Drawer
  const { data: customerOrders, isLoading: loadingOrders } = useQuery({
    queryKey: ['customer-orders-profile', viewCustomer?.id],
    queryFn: () => {
      if (!viewCustomer) return []
      return api.get(`/customers/${viewCustomer.id}/orders`).then(r => r.data.data ?? [])
    },
    enabled: !!viewCustomer && detailTab === 'activity',
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => api.post('/customers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success(t('toast.created', { item: t('customers.title') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => api.post(`/customers/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success(t('toast.updated', { item: t('customers.title') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] })
      toast.success(t('toast.deleted', { item: t('customers.title') }))
      setDeleteTarget(null)
      adjustAfterDelete(customers.length)
    },
    onError: () => {
      toast.error(t('toast.error'))
      setDeleteTarget(null)
    },
  })

  const customers: Customer[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

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
    if (formData.tax_number) dataPayload.append('tax_number', formData.tax_number)
    if (formData.notes) dataPayload.append('notes', formData.notes)
    dataPayload.append('is_active', formData.is_active ? '1' : '0')

    // Photo file attachment
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
    const headers = [
      'ID', 'Company ID', 'Customer Group', 'Linked User ID', 'Name', 'Email', 'Phone',
      'Gender', 'Birth Date', 'Total Spent', 'Order Count', 'Loyalty Points', 'Tax Number', 'Status', 'Created At'
    ]
    const rows = customers.map(c => [
      c.id,
      c.company_id,
      c.group?.name || 'Regular',
      c.user_id || '',
      `"${c.name.replace(/"/g, '""')}"`,
      c.email ? `"${c.email.replace(/"/g, '""')}"` : '',
      c.phone ? `"${c.phone.replace(/"/g, '""')}"` : '',
      c.gender || '',
      c.birth_date || '',
      c.total_spent,
      c.order_count,
      c.loyalty_points,
      c.tax_number ? `"${c.tax_number.replace(/"/g, '""')}"` : '',
      c.is_active ? 'Active' : 'Inactive',
      c.created_at
    ])
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `customers_list_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(t('toast.exportSuccess'))
  }

  const handleResetFilters = () => {
    setStatusFilter('all')
    setGroupIdFilter('')
    setGenderFilter('')
    setStartDate('')
    setEndDate('')
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
      <Breadcrumb items={[{ label: t('customers.title') }, { label: activeTab === 'customers' ? t('customers.customerList') : activeTab === 'groups' ? t('customers.customerGroups') : t('customers.customerAddresses') }]} />

      {/* Workspace Tabs */}
      <div className="flex border-b border-border bg-card rounded-t-xl px-4 overflow-x-auto gap-2">
        {[
          { id: 'customers', label: t('customers.customerList'), icon: <User size={14} /> },
          { id: 'groups',    label: t('customers.customerGroups'), icon: <Users size={14} /> },
          { id: 'addresses', label: t('customers.customerAddresses'), icon: <MapPin size={14} /> },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setPage(1); setSearch(''); handleResetFilters(); setActiveTab(item.id); }}
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
          activeTab === 'customers' ? t('customers.title') :
          activeTab === 'groups' ? t('customers.customerGroups') :
          t('customers.customerAddresses')
        }
        subtitle={
          activeTab === 'customers' ? t('customers.manageProfiles') :
          activeTab === 'groups' ? t('customers.segmentGroups') :
          t('customers.manageLocations')
        }
        action={
          activeTab === 'customers' && (
            <div className="flex gap-2">
              <button onClick={handleExport} className="btn-secondary flex items-center gap-1.5 px-4 py-2 border border-border text-foreground hover:bg-muted rounded-lg transition-colors text-sm font-medium">
                <Download size={16} />
                {t('common.export')}
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                           bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
              >
                <Plus size={16} />
                {t('customers.addCustomer')}
              </button>
            </div>
          )
        }
      />

      {activeTab === 'groups' ? (
        <CustomerGroupsPage isTab />
      ) : activeTab === 'addresses' ? (
        <CustomerAddressesPage isTab />
      ) : (
        <>
          {/* Filters Card */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-56 max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder={t('customers.customerList') + ' ' + t('common.search')}
                  className="form-input pl-9"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                className="form-input w-40"
              >
                <option value="all">{t('common.status')}: {t('common.allStatus')}</option>
                <option value="active">{t('common.active')}</option>
                <option value="inactive">{t('common.inactive')}</option>
                <option value="deleted">{t('common.archived')}</option>
              </select>

              {/* Group Filter */}
              <select
                value={groupIdFilter}
                onChange={e => { setGroupIdFilter(e.target.value); setPage(1) }}
                className="form-input w-44"
              >
                <option value="">{t('customers.customerGroup')}: {t('common.allStatus')}</option>
                {(groups ?? []).map((g: any) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>

              {/* Gender Filter */}
              <select
                value={genderFilter}
                onChange={e => { setGenderFilter(e.target.value); setPage(1) }}
                className="form-input w-36"
              >
                <option value="">{t('customers.gender')}: {t('common.allStatus')}</option>
                <option value="male">{t('customers.genderMale')}</option>
                <option value="female">{t('customers.genderFemale')}</option>
                <option value="other">{t('customers.genderOther')}</option>
              </select>

              {/* Date Filters */}
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => { setStartDate(e.target.value); setPage(1) }}
                  className="form-input py-1.5 px-2 text-xs"
                  title="Registered Start Date"
                />
                <span className="text-muted-foreground text-xs">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => { setEndDate(e.target.value); setPage(1) }}
                  className="form-input py-1.5 px-2 text-xs"
                  title="Registered End Date"
                />
              </div>

              <button
                onClick={handleResetFilters}
                className="btn-secondary px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground ml-auto"
              >
                {t('common.reset')}
              </button>

              <button
                onClick={() => qc.invalidateQueries({ queryKey: ['customers'] })}
                className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                title={t('common.refresh')}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <TableWrapper isFetching={isFetching}>
              <div className="overflow-x-auto">
                <table className="w-full data-table min-w-[1500px]">
                  <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
                    <tr>
                      <th onClick={() => handleSort('photo')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.photo')} {renderSortIcon('photo')}
                      </th>
                      <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('common.name')} {renderSortIcon('name')}
                      </th>
                      <th onClick={() => handleSort('email')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('common.email')} {renderSortIcon('email')}
                      </th>
                      <th onClick={() => handleSort('phone')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('common.phone')} {renderSortIcon('phone')}
                      </th>
                      <th onClick={() => handleSort('gender')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.gender')} {renderSortIcon('gender')}
                      </th>
                      <th onClick={() => handleSort('customer_group_id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.customerGroup')} {renderSortIcon('customer_group_id')}
                      </th>
                      <th onClick={() => handleSort('user_id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.selectUser')} {renderSortIcon('user_id')}
                      </th>
                      <th onClick={() => handleSort('birth_date')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.birthDate')} {renderSortIcon('birth_date')}
                      </th>
                      <th onClick={() => handleSort('total_spent')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.totalSpent')} {renderSortIcon('total_spent')}
                      </th>
                      <th onClick={() => handleSort('order_count')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.orderCount')} {renderSortIcon('order_count')}
                      </th>
                      <th onClick={() => handleSort('loyalty_points')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.loyaltyPoints')} {renderSortIcon('loyalty_points')}
                      </th>
                      <th onClick={() => handleSort('tax_number')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('customers.taxNumber')} {renderSortIcon('tax_number')}
                      </th>
                      <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                        {t('common.status')} {renderSortIcon('is_active')}
                      </th>
                      <th className="text-right p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="hover:bg-muted/5">
                          {Array.from({ length: 15 }).map((_, col) => (
                            <td key={col} className="p-4"><div className="skeleton h-4 w-20 rounded" /></td>
                          ))}
                          <td className="p-4 text-right"><div className="skeleton h-4 w-16 rounded ml-auto" /></td>
                        </tr>
                      ))
                    ) : (data?.data ?? []).map((c: Customer) => (
                      <tr key={c.id} className="group hover:bg-muted/20 transition-colors">
                        {/* Photo */}
                        <td className="p-4">
                          {c.photo ? (
                            <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-full object-cover border border-border shadow-sm" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
                              <User size={16} />
                            </div>
                          )}
                        </td>
                        {/* Name */}
                        <td className="p-4 font-semibold text-foreground text-sm whitespace-nowrap">
                          {c.name}
                        </td>
                        {/* Email */}
                        <td className="p-4 text-sm text-muted-foreground font-mono">{c.email || '—'}</td>
                        {/* Phone */}
                        <td className="p-4 text-sm text-muted-foreground font-mono">{c.phone || '—'}</td>
                        {/* Gender */}
                        <td className="p-4 text-sm capitalize">{c.gender ? t(`customers.gender${c.gender.charAt(0).toUpperCase() + c.gender.slice(1)}`) : '—'}</td>
                        {/* Group */}
                        <td className="p-4 text-sm">
                          {c.group ? (
                            <span className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/30 whitespace-nowrap">
                              {c.group.name} ({Number(c.group.discount_percent)}%)
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground font-light">Regular</span>
                          )}
                        </td>
                        {/* Linked User */}
                        <td className="p-4 text-sm whitespace-nowrap">
                          {c.user ? (
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs text-foreground">{c.user.name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{c.user.email}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground font-light">—</span>
                          )}
                        </td>
                        {/* Birth Date */}
                        <td className="p-4 text-sm font-mono text-muted-foreground">{c.birth_date || '—'}</td>
                        {/* Total Spent */}
                        <td className="p-4 text-sm font-bold text-foreground">
                          Rp {(Number(c.total_spent) || 0).toLocaleString('id-ID')}
                        </td>
                        {/* Order Count */}
                        <td className="p-4 text-sm font-medium text-foreground">{c.order_count ?? 0} orders</td>
                        {/* Loyalty Points */}
                        <td className="p-4 text-sm">
                          <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-semibold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-950/30 whitespace-nowrap">
                            <Award size={10} fill="currentColor" /> {Number(c.loyalty_points) || 0} pts
                          </span>
                        </td>
                        {/* Tax Number */}
                        <td className="p-4 text-sm font-mono text-muted-foreground">{c.tax_number || '—'}</td>
                        {/* Status */}
                        <td className="p-4 text-sm">
                          <span className={c.is_active ? 'badge-success text-xs font-semibold' : 'badge-muted text-xs'}>
                            {c.is_active ? t('common.active') : t('common.inactive')}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setDetailTab('overview'); setViewCustomer(c); }}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                              title={t('common.view')}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => openEditModal(c)}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-blue-600 transition-colors"
                              title={t('common.edit')}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(c)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                              title={t('common.delete')}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!isLoading && customers.length === 0 && (
                      <EmptyState cols={16} message={t('common.noData')} icon={<User size={40} className="mx-auto mb-3 text-muted-foreground/30" />} />
                    )}
                  </tbody>
                </table>
              </div>
            </TableWrapper>

            {/* Pagination */}
            <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
          </div>
        </>
      )}

      {/* Form Dialog Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl my-8"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {editingCustomer ? t('customers.editCustomer') : t('customers.addCustomer')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Photo Upload Row */}
                <div className="flex items-center gap-4 bg-muted/20 p-3 rounded-lg border border-border">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-border shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
                      <Image size={24} />
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase">{t('customers.photoUpload')}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onPhotoChange}
                        id="photoUploadInput"
                        className="hidden"
                      />
                      <label htmlFor="photoUploadInput" className="btn-secondary px-3 py-1.5 text-xs font-semibold border border-border rounded hover:bg-muted cursor-pointer">
                        {t('common.import')}
                      </label>
                      {photoPreview && (
                        <button type="button" onClick={removePhoto} className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded">
                          {t('common.delete')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company & Group row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.company')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('company_id', { required: t('customers.validation.companyRequired') })}
                      className="form-input"
                    >
                      <option value="">-- {t('customers.selectCompany')} --</option>
                      {companies?.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.company_id && <p className="text-red-500 text-xs mt-1">{errors.company_id.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.customerGroup')}
                    </label>
                    <select
                      {...register('customer_group_id')}
                      className="form-input"
                    >
                      <option value="">No Special Group (Regular)</option>
                      {(groups ?? []).map((g: any) => (
                        <option key={g.id} value={g.id}>{g.name} ({Number(g.discount_percent)}%)</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name & User row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name', { required: t('customers.validation.nameRequired') })}
                      placeholder="Customer Full Name"
                      className="form-input"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                      {t('customers.selectUser')} (System Login Link)
                    </label>
                    <select
                      {...register('user_id')}
                      className="form-input"
                    >
                      <option value="">-- Select Linked User --</option>
                      {users?.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email & Phone row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('common.email')}</label>
                    <input
                      type="email"
                      {...register('email', {
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: t('customers.validation.emailInvalid')
                        }
                      })}
                      placeholder="customer@email.com"
                      className="form-input"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('common.phone')}</label>
                    <input
                      {...register('phone')}
                      placeholder="Phone number"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Gender, Birth Date & Tax Number row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('customers.gender')}</label>
                    <select
                      {...register('gender')}
                      className="form-input"
                    >
                      <option value="">Select</option>
                      <option value="male">{t('customers.genderMale')}</option>
                      <option value="female">{t('customers.genderFemale')}</option>
                      <option value="other">{t('customers.genderOther')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('customers.birthDate')}</label>
                    <input
                      type="date"
                      {...register('birth_date')}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('customers.taxNumber')}</label>
                    <input
                      {...register('tax_number')}
                      placeholder="Tax ID"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Auto Calculated Statistics - Read Only view in Form */}
                {editingCustomer && (
                  <div className="bg-muted/40 p-4 rounded-lg border border-border grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-semibold text-muted-foreground uppercase">{t('customers.totalSpent')}</span>
                      <span className="block font-bold text-sm text-foreground">Rp {(Number(editingCustomer.total_spent) || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[10px] font-semibold text-muted-foreground uppercase">{t('customers.orderCount')}</span>
                      <span className="block font-bold text-sm text-foreground">{editingCustomer.order_count} orders</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[10px] font-semibold text-muted-foreground uppercase">{t('customers.loyaltyPoints')}</span>
                      <span className="block font-bold text-sm text-amber-500">{editingCustomer.loyalty_points} pts</span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">{t('common.notes')}</label>
                  <textarea
                    {...register('notes')}
                    placeholder="Customer billing directions or preferences..."
                    rows={3}
                    className="form-input resize-none"
                  />
                </div>

                {/* Active Status toggle */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{t('customers.status')}</span>
                  <button
                    type="button"
                    onClick={() => setValue('is_active', !formIsActive)}
                    className="text-primary hover:opacity-80 transition-opacity"
                  >
                    {formIsActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-muted-foreground" />}
                  </button>
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
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center gap-1.5"
                  >
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    {editingCustomer ? t('common.save') : t('common.create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enhanced Customer Profile Detail Slide-over Drawer */}
      <AnimatePresence>
        {viewCustomer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card w-full max-w-lg border-l border-border h-full flex flex-col shadow-2xl z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  {viewCustomer.photo ? (
                    <img src={viewCustomer.photo} alt={viewCustomer.name} className="w-10 h-10 rounded-full object-cover border border-border shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
                      <User size={20} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-foreground leading-tight">{viewCustomer.name}</h3>
                    <span className="text-xs text-muted-foreground font-mono">ID: {viewCustomer.id}</span>
                  </div>
                </div>
                <button onClick={() => setViewCustomer(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-border bg-muted/20 px-4">
                {[
                  { id: 'overview',  label: t('customers.basicInfo'), icon: <User size={14} /> },
                  { id: 'addresses', label: t('customers.addresses'), icon: <MapPin size={14} /> },
                  { id: 'activity',  label: t('customers.activity'), icon: <Activity size={14} /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id as any)}
                    className={`flex items-center gap-1.5 py-3 px-4 text-xs font-semibold border-b-2 -mb-[2px] transition-colors whitespace-nowrap
                                ${detailTab === tab.id
                                  ? 'border-blue-600 text-blue-600'
                                  : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Tab: Overview */}
                {detailTab === 'overview' && (
                  <div className="space-y-5">
                    {/* Basic Info Block */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('customers.basicInfo')}</h4>
                      <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('common.name')}:</span>
                          <span className="font-semibold text-foreground">{viewCustomer.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('customers.customerGroup')}:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{viewCustomer.group?.name ?? 'Regular'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('customers.gender')}:</span>
                          <span className="font-medium capitalize">{viewCustomer.gender ? t(`customers.gender${viewCustomer.gender.charAt(0).toUpperCase() + viewCustomer.gender.slice(1)}`) : '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1"><Calendar size={12} /> {t('customers.birthDate')}:</span>
                          <span className="font-medium font-mono">{viewCustomer.birth_date ?? '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('customers.taxNumber')}:</span>
                          <span className="font-mono text-xs text-foreground">{viewCustomer.tax_number ?? '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('common.status')}:</span>
                          <span className={viewCustomer.is_active ? 'text-green-500 font-semibold' : 'text-muted-foreground'}>
                            {viewCustomer.is_active ? t('common.active') : t('common.inactive')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details Block */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('customers.contactDetails')}</h4>
                      <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1.5"><Mail size={12} /> {t('common.email')}:</span>
                          <span className="font-medium font-mono text-foreground">{viewCustomer.email ?? '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1.5"><Phone size={12} /> {t('common.phone')}:</span>
                          <span className="font-medium font-mono text-foreground">{viewCustomer.phone ?? '—'}</span>
                        </div>
                        {viewCustomer.user && (
                          <div className="flex justify-between text-sm pt-1.5 border-t border-border">
                            <span className="text-muted-foreground flex items-center gap-1.5"><Building size={12} /> Linked Account:</span>
                            <span className="font-semibold text-foreground">{viewCustomer.user.name} ({viewCustomer.user.email})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Purchase Summary & Statistics */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('customers.transactionsLoyalty')}</h4>
                      <div className="bg-muted/30 p-4 rounded-xl border border-border grid grid-cols-2 gap-4">
                        <div className="bg-card p-3 rounded-lg border border-border text-center">
                          <DollarSign size={16} className="text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                          <span className="text-[10px] text-muted-foreground uppercase block">{t('customers.totalSpent')}</span>
                          <span className="font-bold text-sm block">Rp {(Number(viewCustomer.total_spent) || 0).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="bg-card p-3 rounded-lg border border-border text-center">
                          <Award size={16} className="text-amber-500 mx-auto mb-1" />
                          <span className="text-[10px] text-muted-foreground uppercase block">{t('customers.loyaltyPoints')}</span>
                          <span className="font-bold text-sm text-amber-500 block">{Number(viewCustomer.loyalty_points) || 0} pts</span>
                        </div>
                        <div className="bg-card p-3 rounded-lg border border-border text-center">
                          <Briefcase size={16} className="text-purple-500 mx-auto mb-1" />
                          <span className="text-[10px] text-muted-foreground uppercase block">{t('customers.orderCount')}</span>
                          <span className="font-bold text-sm block">{viewCustomer.order_count ?? 0} Orders</span>
                        </div>
                        <div className="bg-card p-3 rounded-lg border border-border text-center">
                          <Sparkles size={16} className="text-green-500 mx-auto mb-1" />
                          <span className="text-[10px] text-muted-foreground uppercase block">Avg Order Value</span>
                          <span className="font-bold text-sm block">
                            Rp {viewCustomer.order_count > 0 ? (Math.round(Number(viewCustomer.total_spent) / viewCustomer.order_count)).toLocaleString('id-ID') : '0'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {viewCustomer.notes && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('customers.internalNotes')}</h4>
                        <div className="bg-muted/30 p-4 rounded-xl border border-border text-sm text-muted-foreground flex gap-2.5">
                          <BookOpen size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span>{viewCustomer.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Addresses */}
                {detailTab === 'addresses' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('customers.addresses')}</h4>
                    {loadingAddresses ? (
                      <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, idx) => (
                          <div key={idx} className="skeleton h-24 w-full rounded-xl" />
                        ))}
                      </div>
                    ) : customerAddresses && customerAddresses.length > 0 ? (
                      <div className="space-y-3">
                        {customerAddresses.map((addr: any) => (
                          <div key={addr.id} className="p-4 bg-card rounded-xl border border-border shadow-sm relative overflow-hidden">
                            {addr.is_default && (
                              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
                                {t('customers.defaultAddress')}
                              </span>
                            )}
                            <div className="font-semibold text-foreground text-sm flex items-center gap-1.5 mb-1.5">
                              <span className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground font-bold border border-border">
                                {addr.label}
                              </span>
                              <span>{addr.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono mb-2">{addr.phone}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mb-1.5">{addr.address}</p>
                            <p className="text-xs text-foreground font-medium">
                              {addr.city}, {addr.province} ({addr.country}) - {addr.postal_code}
                            </p>
                            {addr.latitude !== null && addr.longitude !== null && (
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono mt-2 border-t border-border/50 pt-1.5">
                                <MapPin size={10} />
                                <span>Lat: {addr.latitude}, Lng: {addr.longitude}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-border rounded-xl">
                        <MapPin size={32} className="mx-auto mb-2 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground">No registered addresses found for this customer.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Activity */}
                {detailTab === 'activity' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('customers.activity')}</h4>
                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t('customers.registeredAt')}</p>
                          <p className="text-xs text-muted-foreground font-mono">{viewCustomer.created_at ? new Date(viewCustomer.created_at).toLocaleString() : '—'}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 border-t border-border/50 pt-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Last updated profile parameters</p>
                          <p className="text-xs text-muted-foreground font-mono">{viewCustomer.updated_at ? new Date(viewCustomer.updated_at).toLocaleString() : '—'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order history list in Activity */}
                    <div className="space-y-3 mt-6">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Orders</h4>
                      {loadingOrders ? (
                        <div className="skeleton h-20 w-full rounded-xl" />
                      ) : customerOrders && customerOrders.length > 0 ? (
                        <div className="space-y-2">
                          {customerOrders.slice(0, 5).map((order: any) => (
                            <div key={order.id} className="p-3 bg-card rounded-lg border border-border text-sm flex items-center justify-between shadow-sm">
                              <div>
                                <span className="font-semibold text-foreground font-mono">#{order.order_number || order.id}</span>
                                <div className="text-[10px] text-muted-foreground font-mono">{new Date(order.created_at).toLocaleDateString()}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-foreground">Rp {Number(order.total_amount || order.grand_total || 0).toLocaleString('id-ID')}</div>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border font-semibold capitalize">{order.status || 'Completed'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-border rounded-xl">
                          <p className="text-xs text-muted-foreground">No recent order transactions found.</p>
                        </div>
                      )}
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
            const formData = new FormData()
            formData.append('company_id', deleteTarget.company_id.toString())
            formData.append('name', deleteTarget.name)
            formData.append('is_active', '0')
            formData.append('_method', 'PUT')
            updateMutation.mutate({
              id: deleteTarget.id,
              data: formData
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
