import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, X, Folder, ToggleLeft, ToggleRight, Loader2, Edit2, Trash2, 
  ChevronUp, ChevronDown, ChevronRight, Download, Upload, Trash, RefreshCw, 
  AlertCircle, CheckCircle2, Image as ImageIcon, Settings
} from 'lucide-react'
import api from '@/api/client'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import EmptyState from '@/components/shared/EmptyState'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'

interface Category {
  id: number
  company_id: number
  parent_id?: number | null
  name: string
  slug: string
  description?: string
  image?: string | null
  sort_order: number
  is_active: boolean
  parent?: Category | null
  deleted_at?: string | null
}

interface TreeCategory extends Category {
  children?: TreeCategory[]
}

const CategoriesPage: React.FC<{ isTab?: boolean; triggerAdd?: number }> = ({ isTab, triggerAdd }) => {
  const { t, i18n } = useTranslation()
  const qc = useQueryClient()
  const toast = useToast()

  const txt = (key: string) => t(`products.${key}`)

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
  } = useServerPagination({ storageKey: 'categories' })

  // UI state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [recycleBinMode, setRecycleBinMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({})

  // CSV Import Modal
  const [importOpen, setImportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<string>('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Sorting states
  const [sortBy, setSortBy] = useState('sort_order')
  const [sortOrderField, setSortOrderField] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrderField(sortOrderField === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrderField('asc')
    }
    setPage(1)
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrderField === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />
  }

  // Fetch all categories for dropdown (exclude current editing category children)
  const { data: allCatsData } = useQuery({
    queryKey: ['categories-list-dropdown'],
    queryFn: () => api.get('/categories', { params: { per_page: 500 } }).then(r => r.data.data),
  })
  const dropdownCats: Category[] = allCatsData ?? []

  // Main Categories query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['categories', page, debouncedSearch, perPage, sortBy, sortOrderField, recycleBinMode],
    queryFn: () => api.get('/categories', { 
      params: { 
        page, 
        search: debouncedSearch, 
        per_page: perPage, 
        sort_by: sortBy, 
        sort_order: sortOrderField,
        status: recycleBinMode ? 'deleted' : 'active'
      } 
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const categories: Category[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (fd: FormData) => api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['categories-list-dropdown'] })
      closeModal()
      toast.success(t('toast.created', { item: t('pageContent.Category') }))
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? t('toast.error')
      toast.error(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, fd }: { id: number; fd: FormData }) => {
      // Use POST with _method=PUT to support multipart form data updates in Laravel
      fd.append('_method', 'PUT')
      return api.post(`/categories/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['categories-list-dropdown'] })
      closeModal()
      toast.success(t('toast.updated', { item: t('pageContent.Category') }))
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? t('toast.error')
      toast.error(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['categories-list-dropdown'] })
      toast.success(t('toast.deleted', { item: t('pageContent.Category') }))
      setDeleteTarget(null)
      adjustAfterDelete(categories.length)
      setSelectedRows(r => r.filter(x => x !== deleteTarget?.id))
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? t('toast.error')
      toast.error(msg)
      setDeleteTarget(null)
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (id: number) => api.post(`/categories/${id}/restore`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['categories-list-dropdown'] })
      toast.success('Category restored successfully')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error'))
    }
  })

  const forceDeleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}/force`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['categories-list-dropdown'] })
      toast.success('Category permanently deleted')
      setDeleteTarget(null)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to permanently delete category')
      setDeleteTarget(null)
    }
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/categories/bulk-delete', { ids }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['categories-list-dropdown'] })
      toast.success(res.data.message || 'Categories deleted successfully')
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete selected categories')
    }
  })

  const bulkRestoreMutation = useMutation({
    mutationFn: (ids: number[]) => api.post('/categories/bulk-restore', { ids }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['categories-list-dropdown'] })
      toast.success(res.data.message || 'Categories restored successfully')
      setSelectedRows([])
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to restore selected categories')
    }
  })

  const openCreateModal = () => {
    setEditingCategory(null)
    setName('')
    setParentId('')
    setDescription('')
    setSortOrder('0')
    setIsActive(true)
    setImageFile(null)
    setImagePreview(null)
    setModalOpen(true)
  }

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat)
    setName(cat.name)
    setParentId(cat.parent_id ? String(cat.parent_id) : '')
    setDescription(cat.description ?? '')
    setSortOrder(String(cat.sort_order ?? 0))
    setIsActive(cat.is_active)
    setImageFile(null)
    if (cat.image) {
      setImagePreview(cat.image.startsWith('http') ? cat.image : `${api.defaults.baseURL?.replace('/api/v1', '')}/storage/${cat.image}`)
    } else {
      setImagePreview(null)
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCategory(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('company_id', '1')
    fd.append('name', name)
    if (parentId) fd.append('parent_id', parentId)
    fd.append('description', description)
    fd.append('sort_order', sortOrder)
    fd.append('is_active', isActive ? '1' : '0')
    if (imageFile) {
      fd.append('image_file', imageFile)
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, fd })
    } else {
      createMutation.mutate(fd)
    }
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)
    const fd = new FormData()
    fd.append('file', importFile)
    try {
      const res = await api.post('/categories/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success(res.data.message || 'Import completed')
      setImportOpen(false)
      setImportFile(null)
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['categories-list-dropdown'] })
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const handleExport = () => {
    api.get('/categories/export', { responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `categories_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .catch(() => toast.error('Failed to export categories'))
  }

  // Construct Tree structure if not in search or recycle bin
  const buildTree = (flatList: Category[]): TreeCategory[] => {
    const map: Record<number, TreeCategory> = {}
    const roots: TreeCategory[] = []
    
    flatList.forEach(item => {
      map[item.id] = { ...item, children: [] }
    })
    
    flatList.forEach(item => {
      const mapped = map[item.id]
      if (item.parent_id && map[item.parent_id]) {
        map[item.parent_id].children?.push(mapped)
      } else {
        roots.push(mapped)
      }
    })
    
    const sortTree = (nodes: TreeCategory[]) => {
      nodes.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      nodes.forEach(node => {
        if (node.children) {
          sortTree(node.children)
        }
      })
    }
    sortTree(roots)
    return roots
  }

  const isTreeView = !debouncedSearch && !recycleBinMode
  const treeData = buildTree(categories)

  const toggleNode = (id: number) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Render tree rows recursively
  const renderTreeRows = (nodes: TreeCategory[], depth = 0): React.ReactNode[] => {
    let rows: React.ReactNode[] = []
    
    nodes.forEach(node => {
      const isExpanded = expandedNodes[node.id] ?? true
      const hasChildren = node.children && node.children.length > 0
      
      rows.push(
        <tr key={node.id} className="group hover:bg-muted/30 border-b border-border/40">
          <td className="w-12 text-center">
            <input
              type="checkbox"
              checked={selectedRows.includes(node.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRows(prev => [...prev, node.id])
                } else {
                  setSelectedRows(prev => prev.filter(id => id !== node.id))
                }
              }}
              className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary"
            />
          </td>
          <td className="font-medium text-foreground text-sm py-3">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggleNode(node.id)}
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <div className="w-6 h-6 flex items-center justify-center text-muted-foreground/30">•</div>
              )}
              {node.image ? (
                <img 
                  src={node.image.startsWith('http') ? node.image : `${api.defaults.baseURL?.replace('/api/v1', '')}/storage/${node.image}`} 
                  alt={node.name} 
                  className="w-6 h-6 rounded object-cover border border-border flex-shrink-0"
                />
              ) : (
                <Folder size={16} className="text-indigo-500 flex-shrink-0" />
              )}
              <span>{node.name}</span>
            </div>
          </td>
          <td className="text-muted-foreground font-mono text-xs">{node.slug}</td>
          <td className="text-muted-foreground text-sm">{node.description ?? '—'}</td>
          <td className="text-muted-foreground text-sm text-center">{node.sort_order ?? 0}</td>
          <td>
            <span className={node.is_active ? 'badge-success' : 'badge-muted'}>
              {node.is_active ? t('common.active') : t('common.inactive')}
            </span>
          </td>
          <td className="text-right pr-4">
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => openEditModal(node)}
                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => setDeleteTarget(node)}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </td>
        </tr>
      )
      
      if (hasChildren && isExpanded) {
        rows = rows.concat(renderTreeRows(node.children!, depth + 1))
      }
    })
    
    return rows
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <>
          <Breadcrumb items={[{ label: t('nav.group.productInventory') }, { label: t('nav.categories') }]} />

          <PageHeader
            title={t('nav.categories')}
            subtitle={t('pageContent.categoriesConfigured', { count: pagination.total, defaultValue: `${pagination.total} categories configured` })}
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
                  {t('pageContent.Add Category')}
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
            <span>{selectedRows.length} categories selected</span>
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
                    if (confirm('Permanently delete selected categories? This cannot be undone.')) {
                      // Bulk force delete (looping or creating a dedicated endpoint if available. Since there's no bulk force delete endpoint, loop it)
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
          <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} />
          <ResetButton onClick={() => { setSearch(''); setSortBy('sort_order'); setSortOrderField('asc'); setPage(1); setRecycleBinMode(false); setSelectedRows([]) }} />
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => qc.invalidateQueries({ queryKey: ['categories'] })}
              title="Refresh"
              className="p-2 text-muted-foreground border border-border bg-card rounded-xl hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Table / Tree view container */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <TableWrapper isFetching={isFetching}>
          <table className="w-full data-table">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={categories.length > 0 && selectedRows.length === categories.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(categories.map(c => c.id))
                      } else {
                        setSelectedRows([])
                      }
                    }}
                    className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary"
                  />
                </th>
                <th onClick={() => handleSort('name')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                  {t('pageContent.Name')} {renderSortIcon('name')}
                </th>
                <th onClick={() => handleSort('slug')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                  {t('pageContent.Slug')} {renderSortIcon('slug')}
                </th>
                <th onClick={() => handleSort('description')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3">
                  {t('pageContent.Description')} {renderSortIcon('description')}
                </th>
                <th onClick={() => handleSort('sort_order')} className="text-center cursor-pointer hover:bg-muted/65 select-none py-3 w-28">
                  Sort Order {renderSortIcon('sort_order')}
                </th>
                <th onClick={() => handleSort('is_active')} className="text-left cursor-pointer hover:bg-muted/65 select-none py-3 w-28">
                  {t('pageContent.Status')} {renderSortIcon('is_active')}
                </th>
                <th className="text-right pr-4 py-3 select-none w-28">{t('pageContent.Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="w-12"><div className="skeleton h-4 w-4 rounded mx-auto" /></td>
                    <td><div className="skeleton h-4 w-32 rounded" /></td>
                    <td><div className="skeleton h-4 w-28 rounded" /></td>
                    <td><div className="skeleton h-4 w-48 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded mx-auto" /></td>
                    <td><div className="skeleton h-4 w-16 rounded" /></td>
                    <td><div className="skeleton h-4 w-12 rounded ml-auto pr-4" /></td>
                  </tr>
                ))
              ) : isTreeView ? (
                renderTreeRows(treeData)
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="group border-b border-border/40 hover:bg-muted/30">
                    <td className="w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(prev => [...prev, cat.id])
                          } else {
                            setSelectedRows(prev => prev.filter(id => id !== cat.id))
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-primary rounded border-border focus:ring-primary"
                      />
                    </td>
                    <td className="font-medium text-foreground text-sm py-3 flex items-center gap-2">
                      {cat.image ? (
                        <img 
                          src={cat.image.startsWith('http') ? cat.image : `${api.defaults.baseURL?.replace('/api/v1', '')}/storage/${cat.image}`} 
                          alt={cat.name} 
                          className="w-6 h-6 rounded object-cover border border-border flex-shrink-0"
                        />
                      ) : (
                        <Folder size={16} className="text-indigo-500 flex-shrink-0" />
                      )}
                      <span>{cat.name}</span>
                    </td>
                    <td className="text-muted-foreground font-mono text-xs">{cat.slug}</td>
                    <td className="text-muted-foreground text-sm">{cat.description ?? '—'}</td>
                    <td className="text-muted-foreground text-sm text-center">{cat.sort_order ?? 0}</td>
                    <td>
                      <span className={cat.is_active ? 'badge-success' : 'badge-muted'}>
                        {cat.is_active ? t('common.active') : t('common.inactive')}
                      </span>
                    </td>
                    <td className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {recycleBinMode ? (
                          <>
                            <button
                              onClick={() => restoreMutation.mutate(cat.id)}
                              className="p-1.5 hover:bg-muted rounded-lg text-indigo-500 hover:text-indigo-600 transition-colors"
                              title="Restore"
                            >
                              <RefreshCw size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(cat)}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                              title="Permanent Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => openEditModal(cat)}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(cat)}
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
              {!isLoading && categories.length === 0 && (
                <EmptyState cols={7} />
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

      {/* Category Create/Edit Modal */}
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
                  {editingCategory ? t('pageContent.Edit Category') : t('pageContent.Add Category')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">{t('pageContent.Name')}</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Category Name"
                      className="form-input"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Parent Category</label>
                    <select
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Root Category (None)</option>
                      {dropdownCats
                        .filter(c => !editingCategory || (c.id !== editingCategory.id && c.parent_id !== editingCategory.id))
                        .map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      min="0"
                      className="form-input"
                    />
                  </div>

                  <div className="flex items-center justify-between pl-4">
                    <span className="text-sm font-medium text-muted-foreground">{t('pageContent.Status')}</span>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      {isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-muted-foreground" />}
                    </button>
                  </div>
                </div>

                {/* Category Image picker */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Category Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-muted-foreground/45" size={24} />
                      )}
                    </div>
                    <div className="flex-grow">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="category-image-upload"
                      />
                      <label
                        htmlFor="category-image-upload"
                        className="inline-flex items-center justify-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
                      >
                        Upload Image
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">Recommended: PNG or JPG, square resolution.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{t('pageContent.Description')}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('pageContent.Description')}
                    rows={3}
                    className="form-input resize-none"
                  />
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
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 shadow-sm flex items-center gap-1.5"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
                    {editingCategory ? t('common.save') : t('common.create')}
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
                <h3 className="font-semibold text-lg text-foreground">Import Categories</h3>
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
                    id="csv-file-upload"
                    required
                  />
                  <label htmlFor="csv-file-upload" className="cursor-pointer font-medium text-primary hover:underline">
                    {importFile ? importFile.name : 'Click to select CSV File'}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">Columns needed: Parent Category, Name, Slug, Description, Image, Sort Order, Active</p>
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
                Are you sure you want to delete category <strong>{deleteTarget.name}</strong>?
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

export default CategoriesPage
