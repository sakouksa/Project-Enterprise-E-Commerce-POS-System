import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, Users, Loader2,
  ChevronUp, ChevronDown, Download, ToggleLeft, ToggleRight, Settings
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TableActionMenu from '@/components/shared/TableActionMenu'
import ModernSelect from '@/components/shared/ModernSelect'
import { useTranslation } from 'react-i18next'

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
  setActions?: (actions: { onExport: () => void; onAdd: () => void }) => void
}

const CustomerGroupsPage: React.FC<CustomerGroupsPageProps> = ({ isTab = false, setActions }) => {
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
      toast.success(t('customers.toast.exportSuccessGroups', 'Customer groups list exported successfully.'))
    }, 800)
  }

  const handleResetFilters = () => {
    setStatusFilter('all')
    setSortBy('created_at')
    setSortOrder('desc')
    resetPagination()
  }

  useEffect(() => {
    if (setActions) {
      setActions({
        onExport: handleExport,
        onAdd: openCreateModal
      })
    }
  }, [setActions, groups])

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('customers.customerGroups')}</h1>
            <p className="text-muted-foreground text-sm">
              {t('common.showing', { from: pagination.from || 0, to: pagination.to || 0, total: pagination.total })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm animate-fade-in"
            >
              <Download size={15} />
              {t('common.export')}
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm animate-fade-in"
            >
              <Plus size={16} />
              {t('common.add')}
            </button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-56 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder={t('customers.searchGroups')}
                className="form-input pl-9"
              />
            </div>
            
            {/* Status Filter */}
            <ModernSelect
              value={statusFilter}
              onChange={val => { setStatusFilter(val); setPage(1); }}
              options={[
                { value: 'all', label: `${t('common.status')}: ${t('common.active')} / ${t('common.inactive')}` },
                { value: 'active', label: t('common.active') },
                { value: 'inactive', label: t('common.inactive') },
                { value: 'deleted', label: t('common.archived') }
              ]}
              className="w-52"
            />

            <button
              onClick={handleResetFilters}
              className="btn-secondary px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              {t('common.reset')}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => qc.invalidateQueries({ queryKey: ['customer-groups'] })}
              className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm"
              title={t('common.refresh')}
            >
              <RefreshCw size={14} />
            </button>
            <div className="relative">
              <button
                onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground border border-border bg-card transition-colors shadow-sm cursor-pointer select-none"
                title={t('products.toggleColumns', 'Columns')}
              >
                <Settings size={14} />
              </button>
              {columnDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setColumnDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl p-2 z-20 space-y-1 text-left">
                    <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase">{t('products.toggleColumns', 'Toggle Columns')}</p>
                    {Object.keys(visibleColumns).map(col => {
                      const colLabels: Record<string, string> = {
                        id: t('customers.id', 'ID'),
                        name: t('customers.name', 'Group Name'),
                        description: t('customers.description', 'Description'),
                        discount: t('customers.discount', 'Discount'),
                        status: t('common.status', 'Status'),
                        actions: t('common.actions', 'Actions')
                      }
                      return (
                        <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-xl text-xs cursor-pointer text-foreground capitalize">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col as keyof typeof visibleColumns]}
                            onChange={() => toggleColumn(col as keyof typeof visibleColumns)}
                            className="form-checkbox h-3.5 w-3.5 text-primary rounded border-border"
                          />
                          <span>{colLabels[col] || col}</span>
                        </label>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
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
                      {t('common.name')} {renderSortIcon('name')}
                    </th>
                  )}
                  {visibleColumns.description && (
                    <th onClick={() => handleSort('description')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('common.description')} {renderSortIcon('description')}
                    </th>
                  )}
                  {visibleColumns.discount && (
                    <th onClick={() => handleSort('discount_percent')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('customers.discount')} {renderSortIcon('discount_percent')}
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                      {t('common.status')} {renderSortIcon('is_active')}
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th className="text-right p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">{t('common.actions')}</th>
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
                        <td className="p-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                          {Number(group.discount_percent)}%
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="p-4 text-sm">
                          <span className={group.is_active ? 'badge-success text-xs font-semibold' : 'badge-muted text-xs'}>
                            {group.is_active ? t('common.active') : t('common.inactive')}
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

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-md border border-border rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <h3 className="font-bold text-lg text-foreground">
                  {editingGroup ? t('customers.editGroup', 'Edit Group') : t('customers.addGroup', 'Add Group')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                  {/* Company Select */}
                  <div>
                    <ModernSelect
                      label={`${t('customers.company', 'Company')} *`}
                      value={watchCompanyId || ''}
                      onChange={(val) => setValue('company_id', val, { shouldValidate: true })}
                      options={[
                        { value: '', label: t('customers.selectCompany', '-- Select Company --') },
                        ...(companies ?? []).map((c: any) => ({ value: String(c.id), label: c.name }))
                      ]}
                    />
                    {errors.company_id && <p className="text-rose-500 text-xs mt-1">{errors.company_id.message}</p>}
                  </div>

                  {/* Group Name */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                      {t('customers.groupName', 'Group Name')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      {...register('name', { required: t('customers.validation.nameRequired', 'Group name is required') })}
                      placeholder={t('customers.groupNamePlaceholder', 'e.g. VIP Customers')}
                      className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                    />
                    {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                      {t('customers.discountPercent', 'Discount Percent (%)')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      {...register('discount_percent', {
                        required: t('customers.validation.discountNumeric', 'Discount percent is required'),
                        valueAsNumber: true,
                        min: { value: 0, message: t('customers.validation.discountMin', 'Discount must be positive') },
                        max: { value: 100, message: t('customers.validation.discountMax', 'Discount cannot exceed 100%') }
                      })}
                      placeholder="0.00"
                      className="form-input w-full border border-border rounded-xl p-2.5 bg-background text-foreground text-xs font-medium dark:[color-scheme:dark]"
                    />
                    {errors.discount_percent && <p className="text-rose-500 text-xs mt-1">{errors.discount_percent.message}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground uppercase mb-1.5">
                      {t('customers.description', 'Description')}
                    </label>
                    <textarea
                      {...register('description')}
                      placeholder={t('customers.groupDescriptionPlaceholder', 'Description of the group...')}
                      rows={3}
                      className="form-input w-full border border-border rounded-xl p-3 bg-background text-foreground text-xs resize-none dark:[color-scheme:dark]"
                    />
                  </div>

                  {/* Active Status toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-foreground uppercase">{t('customers.activeStatus', 'Active Status')}</span>
                    <button
                      type="button"
                      onClick={() => setValue('is_active', !formIsActive)}
                      className="text-primary hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {formIsActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                {/* PINNED FOOTER */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-card shrink-0 z-10">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border border-border rounded-xl transition-colors cursor-pointer"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                    className="px-5 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {(isSubmitting || createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
                    {editingGroup ? t('customers.saveChanges', 'Save Changes') : t('customers.addGroup', 'Add Group')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('confirm.deleteTitle', { item: t('customers.customerGroups') })}
        message={t('confirm.deleteMessage', { item: t('customers.customerGroups'), name: deleteTarget?.name })}
        confirmText={t('confirm.confirmDelete')}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default CustomerGroupsPage
