import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Tag, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
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

interface Brand {
  id: number
  company_id: number
  name: string
  slug: string
  description?: string
  is_active: boolean
}

const BrandsPage: React.FC<{ isTab?: boolean }> = ({ isTab }) => {
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
  } = useServerPagination({ storageKey: 'brands' })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['brands', page, debouncedSearch, perPage],
    queryFn: () => api.get('/brands', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newBrand: any) => api.post('/brands', newBrand),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['brands'] })
      closeModal()
      toast.success(t('toast.created', { item: t('pageContent.Brand') }))
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? t('toast.error')
      toast.error(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/brands/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['brands'] })
      closeModal()
      toast.success(t('toast.updated', { item: t('pageContent.Brand') }))
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? t('toast.error')
      toast.error(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/brands/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['brands'] })
      toast.success(t('toast.deleted', { item: t('pageContent.Brand') }))
      setDeleteTarget(null)
      adjustAfterDelete(brands.length)
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? t('toast.error')
      toast.error(msg)
      setDeleteTarget(null)
    },
  })

  const brands: Brand[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingBrand(null)
    setName('')
    setDescription('')
    setIsActive(true)
    setModalOpen(true)
  }

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand)
    setName(brand.name)
    setDescription(brand.description ?? '')
    setIsActive(brand.is_active)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingBrand(null)
  }

  const triggerDelete = (brand: Brand) => {
    setDeleteTarget(brand)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { company_id: 1, name, description, is_active: isActive }

    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-5">
      {!isTab && (
        <>
          <Breadcrumb items={[{ label: t('nav.group.productInventory') }, { label: t('nav.brands') }]} />

          {/* Header */}
          <PageHeader
            title={t('nav.brands')}
            subtitle={t('pageContent.Manage product manufacturer brands and labels', { defaultValue: 'Manage product manufacturer brands and labels' })}
            action={
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                           bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
              >
                <Plus size={16} />
                {t('pageContent.Add Brand')}
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
              {t('pageContent.Add Brand')}
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
                : brands.map((brand) => (
                    <tr key={brand.id} className="group hover:bg-muted/20 transition-colors">
                      <td className="font-medium text-foreground text-sm flex items-center gap-2">
                        <Tag size={16} className="text-blue-500" />
                        {brand.name}
                      </td>
                      <td className="text-muted-foreground font-mono text-xs">{brand.slug}</td>
                      <td className="text-muted-foreground text-sm">{brand.description ?? '—'}</td>
                      <td>
                        <span className={brand.is_active ? 'badge-success' : 'badge-muted'}>
                          {brand.is_active ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(brand)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            title={t('common.edit')}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => triggerDelete(brand)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg
                                       text-muted-foreground hover:text-red-500 transition-colors"
                            title={t('common.delete')}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!isLoading && brands.length === 0 && (
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
                  {editingBrand ? t('pageContent.Edit Brand') : t('pageContent.Add Brand')}
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
                    placeholder="Apple, Samsung, Nike, etc."
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
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 shadow-sm flex items-center gap-1.5"
                  >
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    {editingBrand ? t('common.save') : t('common.create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        title={t('pageContent.Brand')}
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
                toast.success(t('toast.updated', { item: t('pageContent.Brand') }))
              }
            })
          }
        }}
      />
    </div>
  )
}

export default BrandsPage
