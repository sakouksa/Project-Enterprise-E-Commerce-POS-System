import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, X, Tag, ToggleLeft, ToggleRight, Loader2, 
  ChevronUp, ChevronDown, Download, Upload, Trash, RefreshCw, AlertCircle, 
  Sliders, Paintbrush, ListPlus, Settings
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
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'
import { ModernSelect } from '@/pages/pos/components/ModernSelect'

interface AttributeValue {
  id: number
  attribute_id: number
  value: string
  color_code?: string | null
  sort_order: number
}

interface Attribute {
  id: number
  company_id: number
  name: string
  type: 'select' | 'color' | 'button' | 'text'
  is_active: boolean
  values?: AttributeValue[]
  deleted_at?: string | null
}

const AttributesPage: React.FC<{ isTab?: boolean; triggerAdd?: number }> = ({ isTab, triggerAdd }) => {
  const { t, i18n } = useTranslation()
  const qc = useQueryClient()
  const toast = useToast()

  // Open add modal when parent triggers it (parent auto-resets to 0 after 200ms)
  React.useEffect(() => {
    if (triggerAdd && triggerAdd > 0) openCreateModal()
  }, [triggerAdd])

  const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'attributes' })

  // UI state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAttr, setEditingAttr] = useState<Attribute | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Attribute | null>(null)
  const [recycleBinMode, setRecycleBinMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // Nested values list management state
  const [valuesList, setValuesList] = useState<Omit<AttributeValue, 'id'>[]>([])
  const [newValueText, setNewValueText] = useState('')
  const [newColorCode, setNewColorCode] = useState('#4f46e5')
  const [newValueSort, setNewValueSort] = useState('0')

  // CSV Import Modal
  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [type, setType] = useState<'select' | 'color' | 'button' | 'text'>('select')
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
    queryKey: ['attributes', page, debouncedSearch, perPage, sortBy, sortOrder, recycleBinMode],
    queryFn: () => api.get('/attributes', { 
      params: { 
        page, 
        search: debouncedSearch, 
        per_page: perPage, 
        sort_by: sortBy, 
        sort_order: sortOrder,
        status: recycleBinMode ? 'deleted' : undefined
      } 
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const attributes: Attribute[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: attributes.length, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/attributes', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success(t('toast.created'))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => api.put(`/attributes/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success(t('toast.updated'))
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/attributes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success(t('toast.deleted'))
      setDeleteTarget(null)
      adjustAfterDelete(attributes.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    }
  })

  const restoreMutation = useMutation({
    mutationFn: (id: number) => api.post(`/attributes/${id}/restore`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success(t('toast.restored'))
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    }
  })

  const forceDeleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/attributes/${id}/force`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success(t('toast.deleted'))
      setDeleteTarget(null)
      adjustAfterDelete(attributes.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    }
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/attributes/bulk-delete', { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success(t('toast.deleted'))
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    }
  })

  const bulkRestoreMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/attributes/bulk-restore', { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success(t('toast.restored'))
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    }
  })

  // Value list builder handlers
  const handleAddValue = () => {
    if (!newValueText.trim()) {
      toast.warning(t('products.enterValueWarning', 'Please enter a value name (e.g. Red, Medium) first.'))
      return
    }
    const valText = newValueText.trim()
    setValuesList(prev => [
      ...prev,
      {
        attribute_id: editingAttr?.id ?? 0,
        value: valText,
        color_code: type === 'color' ? newColorCode : null,
        sort_order: parseInt(newValueSort) || 0
      }
    ])
    toast.success(`${t('products.valueAdded', 'Value added')}: ${valText}`)
    setNewValueText('')
    setNewValueSort('0')
  }

  const handleRemoveValue = (index: number) => {
    setValuesList(prev => prev.filter((_, i) => i !== index))
  }

  // Modal Handlers
  const openCreateModal = () => {
    setEditingAttr(null)
    setName('')
    setType('select')
    setIsActive(true)
    setValuesList([])
    setNewValueText('')
    setNewColorCode('#4f46e5')
    setNewValueSort('0')
    setModalOpen(true)
  }

  const openEditModal = (attr: Attribute) => {
    setEditingAttr(attr)
    setName(attr.name)
    setType(attr.type)
    setIsActive(attr.is_active)
    setValuesList(attr.values ? attr.values.map(v => ({ attribute_id: v.attribute_id, value: v.value, color_code: v.color_code, sort_order: v.sort_order })) : [])
    setNewValueText('')
    setNewColorCode('#4f46e5')
    setNewValueSort('0')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingAttr(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let currentValues = [...valuesList]
    if (newValueText.trim()) {
      currentValues.push({
        attribute_id: editingAttr?.id ?? 0,
        value: newValueText.trim(),
        color_code: type === 'color' ? newColorCode : null,
        sort_order: parseInt(newValueSort) || 0
      })
      setNewValueText('')
      setNewValueSort('0')
    }

    const payload = {
      company_id: 1,
      name,
      type,
      is_active: isActive,
      values: currentValues
    }

    if (editingAttr) {
      updateMutation.mutate({ id: editingAttr.id, payload })
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
      await api.post('/attributes/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(t('toast.importSuccess'))
      setImportOpen(false)
      setImportFile(null)
      qc.invalidateQueries({ queryKey: ['attributes'] })
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t('toast.importError'))
    } finally {
      setImporting(false)
    }
  }

  const handleExport = () => {
    api.get('/attributes/export', { responseType: 'blob' })
      .then(res => {
        const blob = new Blob(['\uFEFF', res.data], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `attributes_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        toast.success(t('toast.exportSuccess'))
      })
      .catch(() => toast.error(t('toast.exportError')))
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-5">
      {!isTab && (
        <>
          <Breadcrumb items={[{ label: t('dashboard.title') || 'Dashboard', path: '/dashboard' }, { label: t('products.tabAttributes') }]} />

          <PageHeader
            title={t('products.tabAttributes')}
            subtitle={t('products.heroSubtitle')}
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download size={15} />
                  {t('products.exportCSV')}
                </button>

                <button
                  onClick={() => setImportOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Upload size={15} />
                  {t('products.importCSV')}
                </button>

                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white
                             bg-primary rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  {t('products.addAttribute')}
                </button>
              </div>
            }
          />
        </>
      )}

      {/* Bulk Actions Panel */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            <AlertCircle size={16} />
            <span>{selectedRows.length} {t('products.selectedCount')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => bulkDeleteMutation.mutate(selectedRows)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 cursor-pointer"
            >
              <Trash size={13} />
              {t('products.deleteSelected')}
            </button>
            <button
              onClick={() => setSelectedRows([])}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 cursor-pointer"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder={t('products.searchAttributes')} />
          <ResetButton onClick={() => { setSearch(''); setSortBy('created_at'); setSortOrder('desc'); setPage(1); setRecycleBinMode(false); setSelectedRows([]) }} />
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => qc.invalidateQueries({ queryKey: ['attributes'] })}
              title={t('products.refresh')}
              className="p-2 text-muted-foreground border border-border bg-card rounded-xl hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={attributes.length > 0 && selectedRows.length === attributes.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(attributes.map(a => a.id))
                      } else {
                        setSelectedRows([])
                      }
                    }}
                    className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary cursor-pointer"
                  />
                </th>
                <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                  {t('products.colAttributeName')} {renderSortIcon('name')}
                </th>
                <th onClick={() => handleSort('type')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3 w-32">
                  {t('products.colDisplayType')} {renderSortIcon('type')}
                </th>
                <th className="text-left py-3">{t('products.colValuesConfigured')}</th>
                <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3 w-28">
                  {t('products.colStatus')} {renderSortIcon('is_active')}
                </th>
                <th className="text-right pr-4 py-3 select-none w-28">{t('products.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="w-12"><div className="skeleton h-4 w-4 rounded mx-auto" /></td>
                    <td><div className="skeleton h-4 w-32 rounded" /></td>
                    <td><div className="skeleton h-4 w-20 rounded" /></td>
                    <td><div className="skeleton h-4 w-48 rounded" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded ml-auto pr-4" /></td>
                  </tr>
                ))
              ) : (
                attributes.map((attr) => (
                  <tr key={attr.id} className="group border-b border-border/40 hover:bg-muted/30">
                    <td className="w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(attr.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(prev => [...prev, attr.id])
                          } else {
                            setSelectedRows(prev => prev.filter(id => id !== attr.id))
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="font-medium text-foreground text-sm py-3 flex items-center gap-2">
                      <Sliders size={16} className="text-indigo-500 flex-shrink-0" />
                      <span>{attr.name}</span>
                    </td>
                    <td className="text-sm font-semibold capitalize text-muted-foreground">{attr.type}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1.5 max-w-lg">
                        {attr.values && attr.values.length > 0 ? (
                          attr.values.map(val => (
                            <span 
                              key={val.id} 
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border border-border/60 bg-muted/40 text-foreground"
                            >
                              {attr.type === 'color' && val.color_code && (
                                <span className="w-2.5 h-2.5 rounded-full border border-border" style={{ backgroundColor: val.color_code }} />
                              )}
                              {val.value}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground/60">—</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={attr.is_active ? 'badge-success' : 'badge-muted'}>
                        {attr.is_active ? t('products.active') : t('products.inactive')}
                      </span>
                    </td>
                    <td className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(attr)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title={t('products.edit')}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(attr)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                          title={t('products.delete')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && attributes.length === 0 && (
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

      {/* Attribute Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {editingAttr ? t('products.editAttribute') : t('products.addAttribute')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">{t('products.colAttributeName')}</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Color, Size, Material"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">{t('products.colDisplayType')}</label>
                    <ModernSelect
                      value={type}
                      onChange={(val) => setType(String(val) as any)}
                      options={[
                        { value: 'select', label: t('products.dropdownSelect') },
                        { value: 'color', label: t('products.colorSwatches') },
                        { value: 'button', label: t('products.productButtons') },
                        { value: 'text', label: t('products.plainTextField') },
                      ]}
                      placeholder={t('products.colDisplayType')}
                      buttonClassName="font-normal text-sm border-border bg-card cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pl-4">
                    <span className="text-sm font-medium text-muted-foreground">{t('products.colStatus')}</span>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className="text-primary hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                {/* Nested Values Builder */}
                <div className="pt-4 border-t border-border space-y-3">
                  <h4 className="font-medium text-sm text-foreground flex items-center gap-1.5">
                    <ListPlus size={16} className="text-primary" />
                    {t('products.colValuesConfigured')}
                  </h4>

                  {/* Builder Form */}
                  <div className="grid grid-cols-12 gap-2 items-end bg-muted/20 p-3 rounded-xl border border-border/40">
                    <div className={type === 'color' ? 'col-span-4' : 'col-span-7'}>
                      <input
                        value={newValueText}
                        onChange={(e) => setNewValueText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddValue()
                          }
                        }}
                        placeholder={type === 'color' ? 'Red' : 'e.g. Medium'}
                        className="form-input py-1.5 text-xs"
                      />
                    </div>

                    {type === 'color' && (
                      <div className="col-span-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="color"
                            value={newColorCode}
                            onChange={(e) => setNewColorCode(e.target.value)}
                            className="w-7 h-7 rounded border border-border p-0 cursor-pointer"
                          />
                          <input
                            value={newColorCode}
                            onChange={(e) => setNewColorCode(e.target.value)}
                            className="form-input py-1.5 text-[10px] font-mono w-16"
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-span-3">
                      <input
                        type="number"
                        value={newValueSort}
                        onChange={(e) => setNewValueSort(e.target.value)}
                        className="form-input py-1.5 text-xs"
                      />
                    </div>

                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={handleAddValue}
                        className="w-full py-1.5 text-xs bg-primary text-white font-semibold rounded-lg hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* List of current values */}
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {valuesList.map((val, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-2 rounded-lg border border-border bg-card text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {type === 'color' && val.color_code && (
                            <span 
                              className="w-4 h-4 rounded-full border border-border flex-shrink-0" 
                              style={{ backgroundColor: val.color_code }} 
                            />
                          )}
                          <span className="font-medium text-foreground">{val.value}</span>
                          {val.color_code && <span className="text-[10px] text-muted-foreground font-mono">({val.color_code})</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveValue(idx)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 p-1 rounded cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {valuesList.length === 0 && (
                      <div className="text-center py-4 text-xs text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
                        {t('products.noValuesConfigured', 'No values added yet. Enter a value name above and click +')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    {editingAttr ? t('common.save') : t('products.addAttribute')}
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
                <h3 className="font-semibold text-lg text-foreground">{t('products.importCSV')}</h3>
                <button onClick={() => setImportOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
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
                    id="csv-attribute-upload"
                    required
                  />
                  <label htmlFor="csv-attribute-upload" className="cursor-pointer font-medium text-primary hover:underline">
                    {importFile ? importFile.name : t('products.clickToUploadCSV')}
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setImportOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg cursor-pointer"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={importing || !importFile}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {importing && <Loader2 size={14} className="animate-spin" />}
                    {t('products.importCSV')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unified Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        title={t('products.tabAttributes')}
        itemName={deleteTarget?.name || ''}
        isPending={deleteMutation.isPending || forceDeleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onSoftDelete={() => {
          if (deleteTarget) {
            if (recycleBinMode) {
              forceDeleteMutation.mutate(deleteTarget.id)
            } else {
              deleteMutation.mutate(deleteTarget.id)
            }
          }
        }}
      />
    </div>
  )
}

export default AttributesPage
