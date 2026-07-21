import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X, Users, Loader2,
  ChevronUp, ChevronDown, Download, ToggleLeft, ToggleRight
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
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
    toast.info('Downloading...')
    setTimeout(() => {
      const headers = ['ID', 'Company Name', 'Group Name', 'Description', 'Discount Percent', 'Status', 'Created At']
      const rows = groups.map(g => [
        g.id,
        g.company?.name || `Company #${g.company_id}`,
        `"${g.name.replace(/"/g, '""')}"`,
        g.description ? `"${g.description.replace(/"/g, '""')}"` : '',
        g.discount_percent,
        g.is_active ? 'Active' : 'Inactive',
        g.created_at
      ])
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `customer_groups_${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Customer groups list exported successfully.')
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
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              className="form-input w-40"
            >
              <option value="all">{t('common.status')}: {t('common.active')} / {t('common.inactive')}</option>
              <option value="active">{t('common.active')}</option>
              <option value="inactive">{t('common.inactive')}</option>
              <option value="deleted">{t('common.archived')}</option>
            </select>

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
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <TableWrapper isFetching={isFetching}>
          <div className="overflow-x-auto">
            <table className="w-full data-table min-w-[800px]">
              <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
                <tr>
                  <th onClick={() => handleSort('id')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    ID {renderSortIcon('id')}
                  </th>
                  <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('common.name')} {renderSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('description')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('common.description')} {renderSortIcon('description')}
                  </th>
                  <th onClick={() => handleSort('discount_percent')} className="text-left cursor-pointer hover:bg-muted/65 p-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider select-none">
                    {t('customers.discount')} {renderSortIcon('discount_percent')}
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
                      <td className="p-4"><div className="skeleton h-4 w-8 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-28 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-40 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-12 rounded" /></td>
                      <td className="p-4"><div className="skeleton h-4 w-16 rounded" /></td>
                      <td className="p-4 text-right"><div className="skeleton h-4 w-16 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  groups.map((group) => (
                    <tr key={group.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 text-sm font-mono text-muted-foreground">{group.id}</td>
                      <td className="p-4 font-semibold text-foreground text-sm">{group.name}</td>
                      <td className="p-4 text-muted-foreground text-sm max-w-[250px] truncate" title={group.description}>
                        {group.description || '-'}
                      </td>
                      <td className="p-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                        {Number(group.discount_percent)}%
                      </td>
                      <td className="p-4 text-sm">
                        <span className={group.is_active ? 'badge-success text-xs font-semibold' : 'badge-muted text-xs'}>
                          {group.is_active ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEditModal(group)} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-blue-600 rounded-lg transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteTarget(group)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-muted-foreground hover:text-red-500 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
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
              className="bg-card w-full max-w-md border border-border rounded-xl shadow-2xl overflow-hidden my-8"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {editingGroup ? t('customers.editGroup') : t('customers.addGroup')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
                {/* Company Select */}
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

                {/* Group Name */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('customers.groupName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('name', { required: t('customers.validation.nameRequired') })}
                    placeholder="e.g. VIP Customers"
                    className="form-input"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('customers.discountPercent')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    {...register('discount_percent', {
                      required: t('customers.validation.discountNumeric'),
                      valueAsNumber: true,
                      min: { value: 0, message: t('customers.validation.discountMin') },
                      max: { value: 100, message: t('customers.validation.discountMax') }
                    })}
                    className="form-input"
                  />
                  {errors.discount_percent && <p className="text-red-500 text-xs mt-1">{errors.discount_percent.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                    {t('customers.description')}
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Description of the group..."
                    className="form-input h-20 resize-none"
                  />
                </div>

                {/* Active Status toggle */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{t('customers.activeStatus')}</span>
                  <button
                    type="button"
                    onClick={() => setValue('is_active', !formIsActive)}
                    className="text-primary hover:opacity-80 transition-opacity"
                  >
                    {formIsActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-muted-foreground" />}
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted">
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center gap-2"
                  >
                    {(isSubmitting || createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
                    {t('common.save')}
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
