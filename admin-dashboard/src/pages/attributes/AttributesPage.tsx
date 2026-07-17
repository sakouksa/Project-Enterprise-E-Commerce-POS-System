import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Tag, Filter } from 'lucide-react'
import api from '@/api/client'
import Pagination from '@/components/shared/Pagination'
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'
import { useToast } from '@/hooks/useToast'

interface Attribute {
  id: number
  company_id: number
  name: string
}

const AttributesPage: React.FC<{ isTab?: boolean }> = ({ isTab }) => {
  const qc = useQueryClient()
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAttr, setEditingAttr] = useState<Attribute | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Attribute | null>(null)

  // Form states
  const [name, setName] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['attributes', page, search],
    queryFn: () => api.get('/attributes', { params: { page, search, per_page: 10 } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (newAttr: any) => api.post('/attributes', newAttr),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success('Attribute created successfully.')
      closeModal()
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Failed to create attribute.'
      toast.error(msg)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/attributes/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success('Attribute updated successfully.')
      closeModal()
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Failed to update attribute.'
      toast.error(msg)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/attributes/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attributes'] })
      toast.success('Attribute deleted successfully.')
      setDeleteTarget(null)
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'Failed to delete attribute.'
      toast.error(msg)
      setDeleteTarget(null)
    }
  })

  const attributes: Attribute[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingAttr(null)
    setName('')
    setModalOpen(true)
  }

  const openEditModal = (attr: Attribute) => {
    setEditingAttr(attr)
    setName(attr.name)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingAttr(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { company_id: 1, name }

    if (editingAttr) {
      updateMutation.mutate({ id: editingAttr.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-5">
      {!isTab && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Attributes</h1>
            <p className="text-muted-foreground text-sm">{pagination.total} product attributes total</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                       bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus size={16} />
            Add Attribute
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search attributes (Color, Size, etc.)..."
              className="form-input pl-9"
            />
          </div>
          <button
            onClick={() => { setSearch(''); setPage(1) }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Filter size={14} />
            Reset
          </button>
          {isTab && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                         bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm ml-auto"
            >
              <Plus size={16} />
              Add Attribute
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Attribute Name</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton h-4 w-48 rounded" /></td>
                      <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                    </tr>
                  ))
                : attributes.map((attr) => (
                    <tr key={attr.id} className="group">
                      <td className="font-medium text-foreground text-sm flex items-center gap-2">
                        <Tag size={16} className="text-blue-500" />
                        {attr.name}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(attr)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(attr)}
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
              {!isLoading && attributes.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-16 text-center">
                    <Tag size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No attributes found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          onPageChange={setPage}
        />
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
                  {editingAttr ? 'Edit Attribute' : 'Add Attribute'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Attribute Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Size, Color, Material, etc."
                    className="form-input"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-90 shadow-sm"
                  >
                    {editingAttr ? 'Save Changes' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        title="Attribute"
        itemName={deleteTarget?.name || ''}
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onSoftDelete={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id)
          }
        }}
      />
    </div>
  )
}

export default AttributesPage
