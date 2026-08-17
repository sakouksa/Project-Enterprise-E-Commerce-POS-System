import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, Users, Loader2,
  ChevronUp, ChevronDown, Download, Award, Building2, Percent,
  Check, Sparkles, FileText, Info
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

interface CustomerGroup {
  id: number
  company_id: number
  company?: { name: string }
  name: string
  description?: string
  discount_percent: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface GroupFormData {
  company_id: string
  name: string
  discount_percent: number
  description: string
  is_active: boolean
}

interface CustomerGroupsPageProps {
  isTab?: boolean
  onRegisterActions?: (actions: { openAdd: () => void; exportData: () => void }) => void
}

const CustomerGroupsPage: React.FC<CustomerGroupsPageProps> = ({ isTab = false, onRegisterActions }) => {
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
  } = useServerPagination({ storageKey: 'customergroups' })

  const [modalOpen, setModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CustomerGroup | null>(null)
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    description: true,
    discount: true,
    status: true,
    actions: true,
  })

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }))
  }

  // Filters & Sorting state
  const [statusFilter, setStatusFilter] = useState('all')
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
  } = useForm<GroupFormData>({
    defaultValues: {
      company_id: '1',
      name: '',
      discount_percent: 0,
      description: '',
      is_active: true
    }
  })

  const formIsActive = watch('is_active')
  const watchCompanyId = watch('company_id')
  const watchDiscount = watch('discount_percent')

  // Queries
  const { data: companies } = useQuery({
    queryKey: ['companies-dropdown'],
    queryFn: () => api.get('/companies', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['customer-groups', page, debouncedSearch, perPage, statusFilter, sortBy, sortOrder],
    queryFn: () => api.get('/customer-groups', {
      params: {
        page,
        search: debouncedSearch,
        per_page: perPage,
        status: statusFilter,
        sort_by: sortBy,
        sort_order: sortOrder
      }
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newGroup: any) => api.post('/customer-groups', newGroup),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-groups'] })
      toast.success(t('toast.created', { item: t('customers.customerGroups') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/customer-groups/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-groups'] })
      toast.success(t('toast.updated', { item: t('customers.customerGroups') }))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/customer-groups/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer-groups'] })
      toast.success(t('toast.deleted', { item: t('customers.customerGroups') }))
      setDeleteTarget(null)
      adjustAfterDelete(groups.length)
    },
    onError: () => {
      toast.error(t('toast.error'))
      setDeleteTarget(null)
    },
  })

  const groups: CustomerGroup[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingGroup(null)
    reset({
      company_id: '1',
      name: '',
      discount_percent: 0,
      description: '',
      is_active: true
    })
    setModalOpen(true)
  }

  const openEditModal = (group: CustomerGroup) => {
    setEditingGroup(group)
    reset({
      company_id: group.company_id.toString(),
      name: group.name,
      discount_percent: Number(group.discount_percent),
      description: group.description ?? '',
      is_active: group.is_active
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingGroup(null)
  }

  const onFormSubmit = (formData: GroupFormData) => {
    const payload = {
      company_id: parseInt(formData.company_id),
      name: formData.name,
      discount_percent: Number(formData.discount_percent),
      description: formData.description || null,
      is_active: formData.is_active
    }

    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data: payload })
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
    const infoId = toast.info(t('customers.toast.exportDownloading', 'Downloading customer groups data...'))
    setTimeout(() => {
      if (infoId) toast.dismiss(infoId)

      const titleText = t('customers.customerGroups', 'Customer Groups')
      const headers = [
        t('customers.id', 'ID'),
        t('customers.company', 'Company Name'),
        t('customers.groupName', 'Group Name'),
        t('customers.description', 'Description'),
        t('customers.discountPercent', 'Discount Percent (%)'),
        t('customers.status', 'Status'),
        t('customers.registeredAt', 'Created At')
      ]

      let tbodyHtml = ''
      groups.forEach(g => {
        const companyName = g.company?.name || (g.company_id ? `Company #${g.company_id}` : '—')
        const statusText = g.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')
        const statusClass = g.is_active ? 'badge-completed' : 'badge-cancelled'

        tbodyHtml += '<tr>' +
          '<td class="ref-cell">' + g.id + '</td>' +
          '<td>' + companyName + '</td>' +
          '<td><b>' + g.name + '</b></td>' +
          '<td>' + (g.description || '—') + '</td>' +
          '<td class="text-center">' + (g.discount_percent || 0) + '%</td>' +
          '<td class="text-center"><span class="badge ' + statusClass + '">' + statusText + '</span></td>' +
          '<td class="text-center">' + (g.created_at ? new Date(g.created_at).toLocaleDateString() : '—') + '</td>' +
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
        '  .badge { font-weight: bold; padding: 3px 8px; border-radius: 4px; display: inline-block; }' +
        '  .badge-completed { background-color: #d1fae5; color: #065f46; }' +
        '  .badge-cancelled { background-color: #fee2e2; color: #991b1b; }' +
        '</style>' +
        '</head>' +
        '<body>' +
        '  <table>' +
        '    <thead>' +
        '      <tr><th colspan="7" class="title-cell">ENTERPRISE POS - ' + titleText + '</th></tr>' +
        '      <tr><th colspan="7" class="subtitle-cell">Generated on: ' + new Date().toLocaleString() + ' | Total Records: ' + groups.length + '</th></tr>' +
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
      link.download = `customer_groups_${new Date().toISOString().slice(0, 10)}.xls`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(t('customers.toast.exportSuccessGroups', 'នាំចេញបញ្ជីក្រុមអតិថិជនបានជោគជ័យ!'))
    }, 800)
  }

  const handleResetFilters = () => {
    setStatusFilter('all')
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
  }, [onRegisterActions, groups])

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('customers.customerGroups', 'ក្រុមអតិថិជន')}</h1>
            <p className="text-muted-foreground text-sm">
              {t('common.showing', { from: pagination.from || 0, to: pagination.to || 0, total: pagination.total })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm animate-fade-in cursor-pointer"
            >
              <Download size={15} />
              {t('common.export', 'នាំចេញ')}
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm animate-fade-in cursor-pointer"
            >
              <Plus size={16} />
              {t('customers.addGroup', 'បន្ថែមក្រុម')}
            </button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-56 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder={t('customers.searchGroups', 'ស្វែងរកក្រុម...')}
                className="form-input pl-9 pr-3 w-full h-9 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            
            {/* Status Filter */}
            <ModernSelect
              value={statusFilter}
              onChange={val => { setStatusFilter(val); setPage(1); }}
              options={[
                { value: 'all', label: `${t('common.status', 'ស្ថានភាព')}: ${t('common.active', 'សកម្ម')} / ${t('common.inactive', 'អសកម្ម')}` },
                { value: 'active', label: t('common.active', 'សកម្ម') },
                { value: 'inactive', label: t('common.inactive', 'អសកម្ម') },
                { value: 'deleted', label: t('common.archived', 'ទុកក្នុងប័ណ្ណសារ') }
              ]}
              className="w-52"
            />

            <ResetButton onClick={handleResetFilters} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => qc.invalidateQueries({ queryKey: ['customer-groups'] })}
              className="h-9 w-9 flex items-center justify-center hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground border border-border/80 bg-background transition-colors shadow-xs cursor-pointer active:scale-95"
              title={t('common.refresh', 'ផ្ទុកឡើងវិញ')}
            >
              <RefreshCw size={14} />
            </button>
            <ColumnSettingsPopover
              columns={[
                { key: 'id', label: t('customers.id', 'ID') },
                { key: 'name', label: t('customers.groupName', 'ឈ្មោះក្រុម') },
                { key: 'description', label: t('customers.description', 'ការពិពណ៌នា') },
                { key: 'discount', label: t('customers.discount', 'ការបញ្ចុះតម្លៃ') },
                { key: 'status', label: t('common.status', 'ស្ថានភាព') },
              ]}
              visibleColumns={visibleColumns}
              onChange={(cols: Record<string, boolean>) => setVisibleColumns(cols as any)}
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <TableWrapper isFetching={isFetching}>
          <div className="overflow-x-auto">
            <table className="w-full data-table min-w-[800px]">
              <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
                <tr>
                  {visibleColumns.id && (
                    <th onClick={() => handleSort('id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.id', 'ID')} {renderSortIcon('id')}
                    </th>
                  )}
                  {visibleColumns.name && (
                    <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.groupName', 'ឈ្មោះក្រុម')} {renderSortIcon('name')}
                    </th>
                  )}
                  {visibleColumns.description && (
                    <th onClick={() => handleSort('description')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('common.description', 'ការពិពណ៌នា')} {renderSortIcon('description')}
                    </th>
                  )}
                  {visibleColumns.discount && (
                    <th onClick={() => handleSort('discount_percent')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.discount', 'ការបញ្ចុះតម្លៃ')} {renderSortIcon('discount_percent')}
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('common.status', 'ស្ថានភាព')} {renderSortIcon('is_active')}
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th className="text-right p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">{t('common.actions', 'សកម្មភាព')}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-muted/5">
                      {visibleColumns.id && <td className="p-4"><div className="skeleton h-4 w-8 rounded" /></td>}
                      {visibleColumns.name && <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>}
                      {visibleColumns.description && <td className="p-4"><div className="skeleton h-4 w-40 rounded" /></td>}
                      {visibleColumns.discount && <td className="p-4"><div className="skeleton h-4 w-12 rounded" /></td>}
                      {visibleColumns.status && <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>}
                      {visibleColumns.actions && <td className="p-4 text-right"><div className="skeleton h-4 w-16 rounded ml-auto" /></td>}
                    </tr>
                  ))
                ) : (
                  groups.map((group) => (
                    <tr key={group.id} className="hover:bg-muted/10 transition-colors">
                      {visibleColumns.id && <td className="p-4 text-sm font-mono text-muted-foreground">{group.id}</td>}
                      {visibleColumns.name && <td className="p-4 font-semibold text-foreground text-sm">{group.name}</td>}
                      {visibleColumns.description && (
                        <td className="p-4 text-muted-foreground text-sm max-w-[250px] truncate" title={group.description}>
                          {group.description || '-'}
                        </td>
                      )}
                      {visibleColumns.discount && (
                        <td className="p-4 text-sm font-medium text-primary">
                          {Number(group.discount_percent)}%
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="p-4 text-sm">
                          <span className={group.is_active ? 'badge-success text-xs font-semibold' : 'badge-muted text-xs'}>
                            {group.is_active ? t('common.active', 'សកម្ម') : t('common.inactive', 'អសកម្ម')}
                          </span>
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="p-4 text-right">
                          <TableActionMenu
                            onEdit={() => openEditModal(group)}
                            onDelete={() => setDeleteTarget(group)}
                          />
                        </td>
                      )}
                    </tr>
                  ))
                )}
                {!isLoading && groups.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Users size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-muted-foreground">{t('common.noData', 'គ្មានទិន្នន័យ')}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TableWrapper>
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-card w-full max-w-lg border border-border/80 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                      {editingGroup
                        ? t('customers.editGroupTitle', t('customers.editGroup', 'កែសម្រួលក្រុមអតិថិជន'))
                        : t('customers.addGroupTitle', t('customers.addGroup', 'បន្ថែមក្រុមអតិថិជន'))}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t('customers.groupModalSubtitle', 'កំណត់ព័ត៌មានក្រុម និងអត្រាភាគរយបញ្ចុះតម្លៃសម្រាប់អតិថិជន')}
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
                  {/* Company Select */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                      {t('customers.company', 'ក្រុមហ៊ុន / សាខាប្រតិបត្តិការ')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Building2 size={15} />
                      </div>
                      <select
                        {...register('company_id', { required: t('customers.validation.companyRequired', 'សូមជ្រើសរើសក្រុមហ៊ុន') })}
                        className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
                      >
                        <option value="">{t('customers.selectCompany', '-- ជ្រើសរើសក្រុមហ៊ុន --')}</option>
                        {(companies ?? []).map((c: any) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.company_id && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.company_id.message}</p>}
                  </div>

                  {/* Group Name & Discount Percent Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.groupName', 'ឈ្មោះក្រុម')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Award size={15} />
                        </div>
                        <input
                          {...register('name', { required: t('customers.validation.nameRequired', 'តម្រូវឱ្យបញ្ចូលឈ្មោះក្រុម') })}
                          placeholder={t('customers.groupNamePlaceholder', 'ឧ. អតិថិជន VIP / ដៃគូលក់ដុំ')}
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      {errors.name && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                        {t('customers.discountPercent', 'អត្រាបញ្ចុះតម្លៃ (%)')} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Percent size={15} />
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          {...register('discount_percent', {
                            required: t('customers.validation.discountNumeric', 'តម្រូវឱ្យបញ្ចូលអត្រាបញ្ចុះតម្លៃ'),
                            valueAsNumber: true,
                            min: { value: 0, message: t('customers.validation.discountMin', 'អត្រាត្រូវតែធំជាង ឬស្មើ 0') },
                            max: { value: 100, message: t('customers.validation.discountMax', 'អត្រាមិនអាចលើសពី 100% បានឡើយ') }
                          })}
                          placeholder="0.00"
                          className="form-input w-full h-9 pl-9 pr-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium"
                        />
                      </div>
                      {errors.discount_percent && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.discount_percent.message}</p>}
                    </div>
                  </div>

                  {/* Group Benefits Information Preview Card */}
                  <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-2.5">
                    <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-primary block">
                        {t('customers.groupBenefits', 'អត្ថប្រយោជន៍សមាជិកភាព')}
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {Number(watchDiscount || 0) > 0
                          ? t('customers.discountPreviewNotice', 'អតិថិជនក្នុងក្រុមនេះនឹងទទួលបានការបញ្ចុះតម្លៃ {{discount}}% ស្វ័យប្រវត្តិនៅលើ POS & ការលក់។', { discount: watchDiscount })
                          : t('customers.groupStandardNotice', 'អតិថិជនក្នុងក្រុមទូទៅ នឹងទទួលបានតម្លៃលក់ស្តង់ដារ និងអាចសន្ំពិន្ទុភក្តីភាពបានធម្មតា។')}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground/90 mb-1.5">
                      {t('customers.description', 'ការពិពណ៌នា & កំណត់ចំណាំ')}
                    </label>
                    <textarea
                      {...register('description')}
                      placeholder={t('customers.groupDescriptionPlaceholder', 'កំណត់ចំណាំបន្ថែម ឬលក្ខខណ្ឌកំណត់សម្រាប់ក្រុមអតិថិជននេះ...')}
                      rows={3}
                      className="form-input w-full p-3 text-xs sm:text-[13px] rounded-lg border border-border/80 bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium leading-relaxed"
                    />
                  </div>

                  {/* Active Status Switch Card */}
                  <div className="p-3.5 bg-muted/15 border border-border/80 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="groupActiveToggle" className="text-xs sm:text-[13px] font-bold text-foreground cursor-pointer select-none">
                        {t('customers.activeGroupStatus', 'ស្ថានភាពក្រុមសកម្ម')}
                      </label>
                      <p className="text-[11px] text-muted-foreground">
                        {t('customers.activeGroupHelp', 'អនុញ្ញាតឱ្យប្រើប្រាស់ក្រុមនេះសម្រាប់ការលក់ និងអតិថិជន')}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id="groupActiveToggle"
                      checked={formIsActive}
                      onChange={(e) => setValue('is_active', e.target.checked)}
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
                      {editingGroup
                        ? t('customers.saveChanges', 'រក្សាទុកការផ្លាស់ប្តូរ')
                        : t('customers.saveGroup', 'រក្សាទុកក្រុម')}
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
        title="customers.deleteGroupTitle"
        itemName={deleteTarget?.name}
        confirmText="common.confirmDelete"
        cancelText="common.cancel"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default CustomerGroupsPage
