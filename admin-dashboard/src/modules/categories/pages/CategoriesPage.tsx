import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Folder, ToggleLeft, ToggleRight, Loader2, Edit2, Trash2 } from 'lucide-react'
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
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'
import { useTranslation } from 'react-i18next'

interface Category {
  id: number
  company_id: number
  name: string
  slug: string
  description?: string
  is_active: boolean
}

const CategoriesPage: React.FC<{ isTab?: boolean }> = ({ isTab }) => {
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
  } = useServerPagination({ storageKey: 'categories' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['categories', page, debouncedSearch, perPage],
    queryFn: () => api.get('/categories', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newCategory: any) => api.post('/categories', newCategory),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      closeModal()
      toast.success(t('toast.created', { item: t('pageContent.Category') }))
    },
    onError: () => {
      toast.error(t('toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/categories/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      closeModal()
      toast.success(t('toast.updated', { item: t('pageContent.Category') }))
    },
    onError: () => {
      toast.error(t('toast.error'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success(t('toast.deleted', { item: t('pageContent.Category') }))
      setDeleteTarget(null)
      adjustAfterDelete(categories.length)
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? t('toast.error')
      toast.error(msg)
      setDeleteTarget(null)
    },
  })

  const categories: Category[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingCategory(null)
    setName('')
    setDescription('')
    setIsActive(true)
    setModalOpen(true)
  }

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat)
    setName(cat.name)
    setDescription(cat.description ?? '')
    setIsActive(cat.is_active)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { company_id: 1, name, description, is_active: isActive }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
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
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                           bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
              >
                <Plus size={16} />
                {t('pageContent.Add Category')}
              </button>
            }
          />
        </>
      )}

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder={t('common.search')} />
          <ResetButton onClick={() => { setSearch(''); setPage(1) }} />
          {isTab && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                         bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm ml-auto"
            >
              <Plus size={16} />
              {t('pageContent.Add Category')}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">{t('pageContent.Name')}</th>
                <th className="text-left">{t('pageContent.Slug')}</th>
                <th className="text-left">{t('pageContent.Description')}</th>
                <th className="text-left">{t('pageContent.Status')}</th>
                <th className="text-right">{t('pageContent.Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton h-4 w-32 rounded" /></td>
                      <td><div className="skeleton h-4 w-28 rounded" /></td>
                      <td><div className="skeleton h-4 w-48 rounded" /></td>
                      <td><div className="skeleton h-4 w-16 rounded" /></td>
                      <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                    </tr>
                  ))
                : categories.map((cat) => (
                    <tr key={cat.id} className="group">
                      <td className="font-medium text-foreground text-sm flex items-center gap-2">
                        <Folder size={16} className="text-indigo-500" />
                        {cat.name}
                      </td>
                      <td className="text-muted-foreground font-mono text-xs">{cat.slug}</td>
                      <td className="text-muted-foreground text-sm">{cat.description ?? '—'}</td>
                      <td>
                        <span className={cat.is_active ? 'badge-success' : 'badge-muted'}>
                          {cat.is_active ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cat)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg
                                       text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!isLoading && categories.length === 0 && (
                <EmptyState cols={5} />
              )}
            </tbody>
          </table>
      </TableWrapper>

        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-lg text-foreground">
                  {editingCategory ? t('pageContent.Edit Category') : t('pageContent.Add Category')}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">{t('pageContent.Name')}</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Category Name"
                    className="form-input"
                  />
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

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{t('pageContent.Status')}</span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="text-primary hover:opacity-80 transition-opacity"
                  >
                    {isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-muted-foreground" />}
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

      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        title={t('pageContent.Category')}
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
            updateMutation.mutate({
              id: deleteTarget.id,
              data: { company_id: 1, name: deleteTarget.name, description: deleteTarget.description, is_active: false }
            }, {
              onSuccess: () => {
                setDeleteTarget(null)
                toast.success(t('toast.updated', { item: t('pageContent.Category') }))
              }
            })
          }
        }}
      />
    </div>
  )
}

export default CategoriesPage
