import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X,
  Shield, Lock, Loader2,
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface Permission {
  id:         number
  name:       string
  guard_name: string
}

const PermissionsPage: React.FC = () => {
  const qc    = useQueryClient()
  const toast = useToast()

    const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'permissions' })
    const [modalOpen, setModalOpen]           = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [deleteTarget, setDeleteTarget]     = useState<Permission | null>(null)

  const [name, setName] = useState('')

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['permissions', page, debouncedSearch, perPage],
    queryFn: () => api.get('/permissions', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/permissions', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['permissions'] })
      toast.success('Permission created successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create permission.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/permissions/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['permissions'] })
      toast.success('Permission updated successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update permission.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/permissions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['permissions'] })
      toast.success('Permission deleted successfully.')
      setDeleteTarget(null)
      adjustAfterDelete(permissions.length)
    },
    onError: () => {
      toast.error('Failed to delete permission.')
      setDeleteTarget(null)
    },
  })

  const permissions: Permission[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingPermission(null)
    setName('')
    setModalOpen(true)
  }

  const openEditModal = (p: Permission) => {
    setEditingPermission(p)
    setName(p.name)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingPermission(null)
    setName('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { name, guard_name: 'api' }
    if (editingPermission) {
      updateMutation.mutate({ id: editingPermission.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  // Group permissions by module prefix (e.g. "product.create" → "product")
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    const module = p.name.includes('.') ? p.name.split('.')[0] : 'general'
    if (!acc[module]) acc[module] = []
    acc[module].push(p)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Permissions</h1>
          <p className="text-muted-foreground text-sm">{pagination.total} security capabilities configured</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                     bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={16} />
          Add Permission
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['permissions'] })}
            className="p-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Permission Key</th>
                <th className="text-left">Guard</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton h-4 w-48 rounded" /></td>
                      <td><div className="skeleton h-4 w-16 rounded" /></td>
                      <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                    </tr>
                  ))
                : permissions.map((p) => (
                    <tr key={p.id} className="group">
                      <td className="text-sm">
                        <div className="flex items-center gap-2">
                          <Lock size={14} className="text-blue-500 flex-shrink-0" />
                          <span className="font-mono text-foreground font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground text-xs font-mono">{p.guard_name}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg
                                       text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!isLoading && permissions.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-16 text-center">
                    <Shield size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No permissions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </TableWrapper>

        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          total={pagination.total}
          perPage={25}
          onPageChange={setPage}
        />
      </div>

      {/* Create / Edit Modal */}
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
                  {editingPermission ? 'Edit Permission' : 'Create Permission'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Permission Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. product.create, order.view"
                    className="form-input font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: <code className="bg-muted px-1 rounded text-xs">module.action</code> (e.g. product.create)
                  </p>
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
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg
                               hover:opacity-90 shadow-sm flex items-center gap-2 disabled:opacity-60"
                  >
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    {isSaving ? 'Saving...' : editingPermission ? 'Save Changes' : 'Create Permission'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Permission"
        message={`Are you sure you want to delete permission "${deleteTarget?.name}"? Roles using this permission will lose access.`}
        confirmText="Delete Permission"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default PermissionsPage
