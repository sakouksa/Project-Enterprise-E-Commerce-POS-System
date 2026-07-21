import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, X, Percent, ToggleLeft, ToggleRight, Loader2, 
  ChevronUp, ChevronDown, Download, Upload, Trash, RefreshCw, AlertCircle 
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import EmptyState from '@/components/shared/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

interface Tax {
  id: number
  company_id: number
  name: string
  rate: number
  type: 'percentage' | 'fixed'
  is_active: boolean
  deleted_at?: string | null
}

const TaxesPage: React.FC<{ isTab?: boolean }> = ({ isTab }) => {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const toast = useToast()
  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'taxes' })

  // UI state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTax, setEditingTax] = useState<Tax | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Tax | null>(null)
  const [recycleBinMode, setRecycleBinMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // CSV Import Modal
  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [rate, setRate] = useState('0')
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage')
  const [isActive, setIsActive] = useState(true)

  // Sorting states
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

  // Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['taxes', page, debouncedSearch, perPage, sortBy, sortOrder, recycleBinMode],
    queryFn: () => api.get('/taxes', { 
      params: { 
        page, 
        search: debouncedSearch, 
        per_page: perPage, 
        sort_by: sortBy, 
        sort_order: sortOrder,
        status: recycleBinMode ? 'deleted' : 'active'
      } 
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const taxes: Tax[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newTax: any) => api.post('/taxes', { ...newTax, company_id: 1 }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['taxes'] })
      closeModal()
      toast.success('Tax rule created successfully')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create tax rule')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/taxes/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['taxes'] })
      closeModal()
      toast.success('Tax rule updated successfully')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update tax rule')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/taxes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['taxes'] })
      toast.success('Tax rule deleted successfully')
      setDeleteTarget(null)
      adjustAfterDelete(taxes.length)
      setSelectedRows(r => r.filter(x => x !== deleteTarget?.id))
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete tax rule')
      setDeleteTarget(null)
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (id: number) => api.post(`/taxes/${id}/restore`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['taxes'] })
      toast.success('Tax rule restored successfully')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to restore tax rule')
    }
  })

  const forceDeleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/taxes/${id}/force`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['taxes'] })
      toast.success('Tax rule permanently deleted')
      setDeleteTarget(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to permanently delete tax rule')
      setDeleteTarget(null)
    }
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/taxes/bulk-delete', { ids }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['taxes'] })
      toast.success(res.data.message || 'Taxes deleted successfully')
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete selected taxes')
    }
  })

  const bulkRestoreMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/taxes/bulk-restore', { ids }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['taxes'] })
      toast.success(res.data.message || 'Taxes restored successfully')
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to restore selected taxes')
    }
  })

  const openCreateModal = () => {
    setEditingTax(null)
    setName('')
    setRate('0')
    setType('percentage')
    setIsActive(true)
    setModalOpen(true)
  }

  const openEditModal = (tax: Tax) => {
    setEditingTax(tax)
    setName(tax.name)
    setRate(String(tax.rate))
    setType(tax.type)
    setIsActive(tax.is_active)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingTax(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { name, rate: parseFloat(rate) || 0, type, is_active: isActive }

    if (editingTax) {
      updateMutation.mutate({ id: editingTax.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)
    const fd = new FormData()
    fd.append('file', importFile)
    try {
      const res = await api.post('/taxes/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(res.data.message || 'Import completed')
      setImportOpen(false)
      setImportFile(null)
      qc.invalidateQueries({ queryKey: ['taxes'] })
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const handleExport = () => {
    api.get('/taxes/export', { responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `taxes_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch(() => toast.error('Failed to export taxes'))
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-5">
      {!isTab && (
        <>
          <Breadcrumb items={[{ label: t('nav.group.productInventory') }, { label: 'Taxes' }]} />

          <PageHeader
            title="Tax Configurations"
            subtitle="Manage global tax brackets, fixed/percentage calculations, and store charges."
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRecycleBinMode(!recycleBinMode)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                             ${recycleBinMode 
                               ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                               : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
                >
                  <Trash size={15} />
                  {recycleBinMode ? 'Recycle Bin' : 'Trash'}
                </button>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download size={15} />
                  Export
                </button>

                <button
                  onClick={() => setImportOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Upload size={15} />
                  Import
                </button>

                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white
                             bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Plus size={16} />
                  Add Tax Rule
                </button>
              </div>
            }
          />
        </>
      )}

      {/* Bulk actions panel */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            <AlertCircle size={16} />
            <span>{selectedRows.length} tax rules selected</span>
          </div>
          <div className="flex items-center gap-2">
            {recycleBinMode ? (
              <>
                <button
                  onClick={() => bulkRestoreMutation.mutate(selectedRows)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
                >
                  <RefreshCw size={13} />
                  Restore Selected
                </button>
                <button
                  onClick={() => {
                    if (confirm('Permanently delete selected tax rules? This cannot be undone.')) {
                      selectedRows.forEach(id => forceDeleteMutation.mutate(id))
                      setSelectedRows([])
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500"
                >
                  <Trash size={13} />
                  Permanent Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => bulkDeleteMutation.mutate(selectedRows)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500"
              >
                <Trash size={13} />
                Delete Selected
              </button>
            )}
            <button
              onClick={() => setSelectedRows([])}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search tax rules by name..." />
          <ResetButton onClick={() => { setSearch(''); setSortBy('created_at'); setSortOrder('desc'); setPage(1); setRecycleBinMode(false); setSelectedRows([]) }} />
          {isTab && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white
                         bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm ml-auto"
            >
              <Plus size={16} />
              Add Tax Rule
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={taxes.length > 0 && selectedRows.length === taxes.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(taxes.map(t => t.id))
                      } else {
                        setSelectedRows([])
                      }
                    }}
                    className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary"
                  />
                </th>
                <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                  Tax Name {renderSortIcon('name')}
                </th>
                <th onClick={() => handleSort('rate')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3 w-32">
                  Rate {renderSortIcon('rate')}
                </th>
                <th onClick={() => handleSort('type')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3 w-36">
                  Calculation Type {renderSortIcon('type')}
                </th>
                <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3 w-28">
                  Status {renderSortIcon('is_active')}
                </th>
                <th className="text-right pr-4 py-3 select-none w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="w-12"><div className="skeleton h-4 w-4 rounded mx-auto" /></td>
                    <td><div className="skeleton h-4 w-32 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-28 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded ml-auto pr-4" /></td>
                  </tr>
                ))
              ) : (
                taxes.map((tax) => (
                  <tr key={tax.id} className="group border-b border-border/40 hover:bg-muted/30">
                    <td className="w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(tax.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(prev => [...prev, tax.id])
                          } else {
                            setSelectedRows(prev => prev.filter(id => id !== tax.id))
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary"
                      />
                    </td>
                    <td className="font-medium text-foreground text-sm py-3 flex items-center gap-2">
                      <Percent size={16} className="text-blue-500 flex-shrink-0" />
                      <span>{tax.name}</span>
                    </td>
                    <td className="font-mono text-sm font-semibold text-foreground py-3">
                      {tax.rate}{tax.type === 'percentage' ? '%' : ''}
                    </td>
                    <td className="text-sm font-semibold capitalize text-muted-foreground py-3">
                      {tax.type}
                    </td>
                    <td>
                      <span className={tax.is_active ? 'badge-success' : 'badge-muted'}>
                        {tax.is_active ? t('common.active') : t('common.inactive')}
                      </span>
                    </td>
                    <td className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {recycleBinMode ? (
                          <>
                            <button
                              onClick={() => restoreMutation.mutate(tax.id)}
                              className="p-1.5 hover:bg-muted rounded-lg text-indigo-500 hover:text-indigo-600 transition-colors"
                              title="Restore"
                            >
                              <RefreshCw size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(tax)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                              title="Permanent Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openEditModal(tax)}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(tax)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && taxes.length === 0 && (
                <EmptyState cols={6} />
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

      {/* Tax Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {editingTax ? 'Edit Tax Config' : 'Add Tax Rule'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Tax Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. VAT 11%, GST"
                    className="form-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Rate {type === 'percentage' ? '(%)' : '($)'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      required
                      min="0"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Calculation Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="form-input"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Flat ($)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Active status</span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="text-primary hover:opacity-80 transition-opacity"
                  >
                    {isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-muted-foreground" />}
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 shadow-sm flex items-center gap-1.5"
                  >
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    {editingTax ? t('common.save') : t('common.create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSV Import Modal */}
      <AnimatePresence>
        {importOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">Import Tax Rules</h3>
                <button onClick={() => setImportOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleImport} className="p-6 space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/10 transition-colors">
                  <Upload className="mx-auto text-muted-foreground mb-2" size={32} />
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="csv-tax-upload"
                    required
                  />
                  <label htmlFor="csv-tax-upload" className="cursor-pointer font-medium text-primary hover:underline">
                    {importFile ? importFile.name : 'Click to select CSV File'}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">Columns needed: Name, Rate, Type, Active</p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setImportOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={importing || !importFile}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg flex items-center gap-1.5"
                  >
                    {importing && <Loader2 size={14} className="animate-spin" />}
                    Import CSV
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete/Force Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={28} />
                <h3 className="font-semibold text-lg text-foreground">Confirm Delete</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete tax rule <strong>{deleteTarget.name}</strong>?
                {recycleBinMode 
                  ? ' This will permanently remove it from the database and cannot be undone.'
                  : ' You can restore it later from the recycle bin.'}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (recycleBinMode) {
                      forceDeleteMutation.mutate(deleteTarget.id)
                    } else {
                      deleteMutation.mutate(deleteTarget.id)
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TaxesPage
