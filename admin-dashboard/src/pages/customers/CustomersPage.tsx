import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, User, Users, MapPin, ToggleLeft, ToggleRight,
  Loader2, Eye, Mail, Phone, Calendar, Award, DollarSign, BookOpen, Download, ChevronUp,
  ChevronDown, Image, Sparkles, Building, Briefcase, Activity, CheckCircle2, EyeOff, Star,
  Package, Filter, Settings, Printer, Wallet, Trash, LayoutGrid, List
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import EmptyState from '@/components/shared/EmptyState'
import ResetButton from '@/components/shared/ResetButton'
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
  credit_limit?:     number
  outstanding_balance?: number
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
  credit_limit: string
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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)
  const [groupActions, setGroupActions] = useState<{ onExport?: () => void; onAdd?: () => void } | null>(null)
  const [addressActions, setAddressActions] = useState<{ onExport?: () => void; onAdd?: () => void } | null>(null)
  const [visibleColumns, setVisibleColumns] = useState({
    photo: true,
    name: true,
    email: true,
    phone: true,
    gender: true,
    group: true,
    user: true,
    birthDate: true,
    totalSpent: true,
    orderCount: true,
    loyaltyPoints: true,
    taxNumber: true,
    status: true,
  })

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))
  }

  // Filters & Sorting state
  const [statusFilter, setStatusFilter] = useState('all')
  const [groupIdFilter, setGroupIdFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [hasAddressFilter, setHasAddressFilter] = useState('')
  const [hasUserFilter, setHasUserFilter] = useState('')
  const [birthdayMonthFilter, setBirthdayMonthFilter] = useState('')
  const [customerTypeFilter, setCustomerTypeFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [provinceFilter, setProvinceFilter] = useState('')
  const [minSpentFilter, setMinSpentFilter] = useState('')
  const [maxSpentFilter, setMaxSpentFilter] = useState('')
  const [createdDateFilter, setCreatedDateFilter] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Count active filters
  const activeFiltersCount = [
    statusFilter !== 'all' ? statusFilter : '',
    groupIdFilter,
    genderFilter,
    startDate,
    endDate,
    hasAddressFilter,
    hasUserFilter,
    birthdayMonthFilter,
    customerTypeFilter,
    locationFilter,
    provinceFilter,
    minSpentFilter,
    maxSpentFilter,
    createdDateFilter
  ].filter(Boolean).length

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
    queryKey: ['customers', page, debouncedSearch, perPage, statusFilter, groupIdFilter, genderFilter, startDate, endDate, sortBy, sortOrder, hasAddressFilter, hasUserFilter, birthdayMonthFilter, customerTypeFilter, locationFilter, provinceFilter, minSpentFilter, maxSpentFilter, createdDateFilter],
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
        sort_order: sortOrder,
        has_address: hasAddressFilter,
        has_user: hasUserFilter,
        birthday_month: birthdayMonthFilter,
        customer_type: customerTypeFilter,
        location: locationFilter,
        province: provinceFilter,
        min_spent: minSpentFilter,
        max_spent: maxSpentFilter,
        created_date: createdDateFilter
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const { data: statsData } = useQuery({
    queryKey: ['customers-stats', debouncedSearch, statusFilter, groupIdFilter, genderFilter, startDate, endDate, hasAddressFilter, hasUserFilter, birthdayMonthFilter, customerTypeFilter, locationFilter, provinceFilter, minSpentFilter, maxSpentFilter, createdDateFilter],
    queryFn: () => api.get('/customers/stats', {
      params: {
        search: debouncedSearch,
        status: statusFilter,
        customer_group_id: groupIdFilter,
        gender: genderFilter,
        start_date: startDate,
        end_date: endDate,
        has_address: hasAddressFilter,
        has_user: hasUserFilter,
        birthday_month: birthdayMonthFilter,
        customer_type: customerTypeFilter,
        location: locationFilter,
        province: provinceFilter,
        min_spent: minSpentFilter,
        max_spent: maxSpentFilter,
        created_date: createdDateFilter
      }
    }).then(r => r.data.data),
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
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
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
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
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
      qc.invalidateQueries({ queryKey: ['customers-stats'] })
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
    toast.info('Downloading...')
    setTimeout(() => {
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
      toast.success('Customer list exported successfully.')
    }, 800)
  }

  const handleResetFilters = () => {
    setStatusFilter('all')
    setGroupIdFilter('')
    setGenderFilter('')
    setStartDate('')
    setEndDate('')
    setHasAddressFilter('')
    setHasUserFilter('')
    setBirthdayMonthFilter('')
    setCustomerTypeFilter('')
    setLocationFilter('')
    setProvinceFilter('')
    setMinSpentFilter('')
    setMaxSpentFilter('')
    setCreatedDateFilter('')
    setSortBy('created_at')
    setSortOrder('desc')
    resetPagination()
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: t('customers.title', 'Customer Management') },
          {
            label: activeTab === 'customers' ? t('customers.customerList', 'Customer List') :
              activeTab === 'groups' ? t('customers.customerGroups', 'Customer Groups') :
                t('customers.customerAddresses', 'Customer Addresses')
          }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {t('customers.title', 'Customer Management')}
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
            {t('customers.description', 'Manage customers, customer groups, purchase history, loyalty information, credit balance, and customer relationship data across the Enterprise POS and E-Commerce platform.')}
          </p>
        </div>
        {activeTab === 'customers' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
            >
              <Download size={15} />
              <span>{t('buttons.export', 'Export')}</span>
            </button>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {t('customers.addCustomer', 'Add Customer')}
            </button>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => groupActions?.onExport?.()}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
            >
              <Download size={15} />
              <span>{t('buttons.export', 'Export')}</span>
            </button>

            <button
              onClick={() => groupActions?.onAdd?.()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {t('common.add', 'Add Group')}
            </button>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => addressActions?.onExport?.()}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm"
            >
              <Download size={15} />
              <span>{t('buttons.export', 'Export')}</span>
            </button>

            <button
              onClick={() => addressActions?.onAdd?.()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              {t('customers.addAddress', 'Add Address')}
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Customers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/80 p-4 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">{t('customers.totalCustomersCard', 'Total Customers')}</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-mono">{statsData?.total_customers ?? 0}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-semibold">
              <span className="text-emerald-500">{statsData?.active_customers ?? 0} {t('common.active', 'Active')}</span>
              <span>•</span>
              <span className="text-muted-foreground">{statsData?.inactive_customers ?? 0} {t('common.inactive', 'Inactive')}</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <User size={20} />
          </div>
        </motion.div>

        {/* Card 2: Customer Groups */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border/80 p-4 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">{t('customers.segments', 'Customer Segments')}</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-mono">{statsData?.total_groups ?? 0}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-semibold">
              <span className="text-purple-500">{statsData?.vip_customers ?? 0} VIP</span>
              <span>•</span>
              <span className="text-blue-500">Retail & Wholesale</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Users size={20} />
          </div>
        </motion.div>

        {/* Card 3: Customer Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/80 p-4 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">{t('customers.activity', 'Customer Activity')}</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-mono">{(statsData?.total_orders ?? 0).toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-semibold">
              <span className="text-emerald-500">+{statsData?.new_customers_this_month ?? 12} New</span>
              <span>•</span>
              <span className="text-blue-500">Active Buying</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Activity size={20} />
          </div>
        </motion.div>

        {/* Card 4: Customer Value */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border/80 p-4 rounded-2xl flex items-center justify-between shadow-2xs hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">{t('customers.customerValue', 'Customer Value')}</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight font-mono truncate max-w-[170px]">
              ${(Number(statsData?.total_spent) || 0).toFixed(2)}
            </p>
            <p className="text-[11px] text-muted-foreground font-semibold">
              Avg Spent: ${(Number(statsData?.avg_spent_per_customer) || 0).toFixed(2)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <DollarSign size={20} />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex border border-border bg-card rounded-2xl p-1 overflow-x-auto gap-1 shadow-sm">
        {[
          { id: 'customers', label: t('customers.tab_customers', 'Customers'), icon: <User size={15} /> },
          { id: 'groups', label: t('customers.tab_groups', 'Customer Groups'), icon: <Users size={15} /> },
          { id: 'addresses', label: t('customers.tab_addresses', 'Customer Addresses'), icon: <MapPin size={15} /> },
        ].map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setPage(1);
                setSearch('');
                handleResetFilters();
                setActiveTab(item.id);
              }}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap
                          ${isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'groups' ? (
        <CustomerGroupsPage isTab setActions={setGroupActions} />
      ) : activeTab === 'addresses' ? (
        <CustomerAddressesPage isTab setActions={setAddressActions} />
      ) : (
        <>
          {/* Premium Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-2xl border border-border/80 shadow-2xs">
            {/* Search Box & Advanced Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative flex-1 min-w-[240px] sm:max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t('customers.searchPlaceholder', 'Search Customer Name, Phone, Email, Code...')}
                  className="form-input pl-9 w-full text-xs rounded-xl border border-border/70 bg-card text-foreground"
                />
              </div>

              <button
                onClick={() => { sound.playClick(); setFilterDrawerOpen(true); }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  activeFiltersCount > 0
                    ? 'bg-primary/10 border-primary/30 text-primary font-bold'
                    : 'bg-card border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Filter size={14} />
                <span>{t('common.filter', 'Filter')}</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-primary text-white rounded-full leading-none">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <ResetButton onClick={() => { sound.playClick(); handleResetFilters(); }} label={t("common.reset", "Reset")} />
            </div>

            {/* Refresh & Add Customer */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  sound.playClick()
                  qc.invalidateQueries({ queryKey: ['customers'] })
                  qc.invalidateQueries({ queryKey: ['customers-stats'] })
                }}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border/70 bg-card transition-colors shadow-2xs cursor-pointer"
                title={t('common.refresh', 'Refresh')}
              >
                <RefreshCw size={14} />
              </button>

              <button
                onClick={() => { sound.playClick(); openCreateModal(); }}
                className="btn-primary py-2 px-3.5 text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Plus size={15} />
                <span>{t('customers.addCustomer', 'Add Customer')}</span>
              </button>
            </div>
          </div>

          {/* ── MODERN CUSTOMER CARDS GRID ───────────────────────────────────── */}
          <div className="space-y-4 w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border/80 rounded-2xl p-4 space-y-3">
                    <div className="skeleton h-6 w-full rounded-lg" />
                    <div className="skeleton h-12 w-full rounded-xl" />
                    <div className="skeleton h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (data?.data ?? []).length === 0 ? (
              <div className="bg-card rounded-2xl border border-border/80 p-16 text-center text-muted-foreground">
                <Users size={48} className="mx-auto mb-3 text-muted-foreground/30" />
                <p className="font-bold text-foreground text-sm">No Customers Found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting search or clearing filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full">
                {(data?.data ?? []).map((c: Customer) => (
                  <div
                    key={c.id}
                    className="bg-card hover:bg-accent/20 border border-border/80 hover:border-primary/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all duration-200 shadow-2xs hover:shadow-md group relative overflow-hidden"
                  >
                    {/* Top Status & Group Badges Row */}
                    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                        c.is_active
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      }`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 truncate max-w-[170px]">
                        {c.group?.name || 'Regular'}
                      </span>
                    </div>

                    {/* Avatar + Name + Customer ID */}
                    <div className="flex items-center gap-3 pt-0.5">
                      {c.photo ? (
                        <img src={c.photo} alt={c.name} className="w-12 h-12 rounded-2xl object-cover border border-border shadow-xs shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/30 flex items-center justify-center text-primary font-black text-lg border border-primary/20 shrink-0 shadow-2xs">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {c.name}
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded border border-border/60 inline-block mt-0.5">
                          #CUST-{String(c.id).padStart(4, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-1.5 text-xs border-t border-b border-border/50 py-2.5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail size={13} className="text-primary shrink-0" />
                        <span className="font-mono text-[11px] truncate text-foreground font-medium">
                          {c.email || 'No email registered'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone size={13} className="text-emerald-500 shrink-0" />
                        <span className="font-mono text-[11px] font-bold text-foreground">
                          {c.phone || 'No phone number'}
                        </span>
                      </div>
                    </div>

                    {/* Financial & Loyalty CRM Pill Container */}
                    <div className="bg-muted/30 border border-border/60 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">Total Spent</div>
                        <div className="text-base font-black text-primary font-mono">
                          ${(Number(c.total_spent) || 0).toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[10px]">
                        <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg border border-blue-500/20 font-bold">
                          {c.order_count ?? 0} Orders
                        </div>
                        <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg border border-amber-500/20 font-bold flex items-center gap-1">
                          <Star size={11} className="fill-amber-400 text-amber-500" />
                          {c.loyalty_points ?? 0} Pts
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Footer */}
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          sound.playClick()
                          setDetailTab('overview')
                          setViewCustomer(c)
                        }}
                        className="btn-secondary flex-1 py-1.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                      >
                        <Eye size={14} /> Profile
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick()
                          openEditModal(c)
                        }}
                        className="p-1.5 rounded-xl border border-border/80 hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 transition-all cursor-pointer text-muted-foreground"
                        title="Edit Customer"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick()
                          setDeleteTarget(c)
                        }}
                        className="p-1.5 rounded-xl border border-border/80 hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 transition-all cursor-pointer text-muted-foreground"
                        title="Delete Customer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
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
                      <span className="block font-bold text-sm text-foreground">${(Number(editingCustomer.total_spent) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer flex items-center gap-1.5"
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
                          <span className="font-bold text-sm block">${(Number(viewCustomer.total_spent) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                            ${viewCustomer.order_count > 0 ? (Number(viewCustomer.total_spent) / viewCustomer.order_count).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
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
                                <div className="font-bold text-foreground">${Number(order.total_amount || order.grand_total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
      />

      {/* Modern Slide-out Filter Drawer */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
            />
            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col h-full overflow-hidden text-left"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-card">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Filter size={16} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-foreground">
                      {t('common.filter', 'Filter Options')}
                    </h3>
                    {activeFiltersCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full leading-none text-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    {t('common.status', 'Status')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'all', label: t('common.allStatus', 'All Statuses'), activeClass: 'bg-muted border-primary text-foreground', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'active', label: t('common.active', 'Active'), activeClass: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'inactive', label: t('common.inactive', 'Inactive'), activeClass: 'bg-slate-500/10 border-slate-500/40 text-slate-600 dark:text-slate-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'deleted', label: t('common.archived', 'Archived'), activeClass: 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setStatusFilter(opt.value); setPage(1) }}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-center select-none active:scale-95 duration-100
                                   ${statusFilter === opt.value ? opt.activeClass : opt.inactiveClass}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    {t('customers.gender', 'Gender')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: '', label: t('common.allStatus', 'All Genders'), activeClass: 'bg-muted border-primary text-foreground', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'male', label: t('customers.genderMale', 'Male'), activeClass: 'bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'female', label: t('customers.genderFemale', 'Female'), activeClass: 'bg-pink-500/10 border-pink-500/40 text-pink-600 dark:text-pink-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                      { value: 'other', label: t('customers.genderOther', 'Other'), activeClass: 'bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-400', inactiveClass: 'border-border text-muted-foreground hover:bg-muted/50' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setGenderFilter(opt.value); setPage(1) }}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-center select-none active:scale-95 duration-100
                                   ${genderFilter === opt.value ? opt.activeClass : opt.inactiveClass}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Group Filter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('customers.customerGroup', 'Customer Group')}</label>
                  <select
                    value={groupIdFilter}
                    onChange={e => { setGroupIdFilter(e.target.value); setPage(1) }}
                    className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                  >
                    <option value="">{t('common.allStatus', 'All Groups')}</option>
                    {(groups ?? []).map((g: any) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Type Filter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('customers.customerType', 'Customer Type')}
                  </label>
                  <select
                    value={customerTypeFilter}
                    onChange={(e) => { setCustomerTypeFilter(e.target.value); setPage(1) }}
                    className="form-input w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs cursor-pointer text-foreground"
                  >
                    <option value="">All Types</option>
                    <option value="retail">Retail Customer</option>
                    <option value="wholesale">Wholesale Customer</option>
                    <option value="vip">VIP Customer</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('customers.location', 'Location / City')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <MapPin size={14} />
                    </div>
                    <input
                      type="text"
                      value={locationFilter}
                      onChange={(e) => { setLocationFilter(e.target.value); setPage(1) }}
                      placeholder="e.g. Jakarta, Phnom Penh"
                      className="form-input pl-9 w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs text-foreground"
                    />
                  </div>
                </div>

                {/* Province Filter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('customers.province', 'Province / State')}
                  </label>
                  <input
                    type="text"
                    value={provinceFilter}
                    onChange={(e) => { setProvinceFilter(e.target.value); setPage(1) }}
                    placeholder="e.g. West Java, Kandal"
                    className="form-input w-full text-sm rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs text-foreground"
                  />
                </div>

                {/* Birthday Month */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Birthday Month</label>
                  <select
                    value={birthdayMonthFilter}
                    onChange={e => { setBirthdayMonthFilter(e.target.value); setPage(1) }}
                    className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                  >
                    <option value="">All Months</option>
                    {Array.from({ length: 12 }).map((_, m) => (
                      <option key={m+1} value={m+1}>
                        {new Date(2000, m, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Has Address & Has User Grouped */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Has Address</label>
                    <select
                      value={hasAddressFilter}
                      onChange={e => { setHasAddressFilter(e.target.value); setPage(1) }}
                      className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                    >
                      <option value="">All</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Has User Account</label>
                    <select
                      value={hasUserFilter}
                      onChange={e => { setHasUserFilter(e.target.value); setPage(1) }}
                      className="form-input rounded-xl text-sm w-full bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 cursor-pointer text-foreground"
                    >
                      <option value="">All</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Purchase Amount Range */}
                <div className="space-y-3 pt-4 border-t border-border/80">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('customers.amountRange', 'Purchase Amount Range ($)')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Min Spent ($)</span>
                      <input
                        type="number"
                        value={minSpentFilter}
                        onChange={(e) => { setMinSpentFilter(e.target.value); setPage(1) }}
                        placeholder="Min ($)"
                        className="form-input w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-semibold block">Max Spent ($)</span>
                      <input
                        type="number"
                        value={maxSpentFilter}
                        onChange={(e) => { setMaxSpentFilter(e.target.value); setPage(1) }}
                        placeholder="Max ($)"
                        className="form-input w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>

                {/* Created Date Filter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {t('customers.createdDate', 'Registration Date')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none">
                      <Calendar size={14} />
                    </div>
                    <input
                      type="date"
                      value={createdDateFilter}
                      onChange={(e) => { setCreatedDateFilter(e.target.value); setPage(1) }}
                      className="form-input pl-9 w-full text-xs rounded-xl bg-card border-border hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2 shadow-xs text-foreground cursor-pointer"
                    />
                  </div>
                </div>

                {/* Date Filters Range */}
                <div className="space-y-1.5 pt-4 border-t border-border/80">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Created Date Between</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => { setStartDate(e.target.value); setPage(1) }}
                      className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      title="Registered Start Date"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => { setEndDate(e.target.value); setPage(1) }}
                      className="form-input text-xs rounded-xl bg-card border-border text-foreground cursor-pointer py-1.5"
                      title="Registered End Date"
                    />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-border flex items-center justify-between bg-muted/10">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                >
                  {t('common.reset', 'Reset All')}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-95 active:scale-95 transition-all"
                >
                  {t('common.apply', 'Apply')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomersPage
