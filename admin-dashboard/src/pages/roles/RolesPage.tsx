import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Edit2, Trash2, RefreshCw, X,
  ShieldAlert, Loader2, Shield,
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

interface Role {
  id:         number
  name:       string
  guard_name: string
}

const RolesPage: React.FC = () => {
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
  } = useServerPagination({ storageKey: 'roles' })
    const [modalOpen, setModalOpen]   = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)

  const [name, setName] = useState('')

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['roles', page, debouncedSearch, perPage],
    queryFn: () => api.get('/roles', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/roles', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role created successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create role.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/roles/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role updated successfully.')
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update role.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/roles/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role deleted successfully.')
      setDeleteTarget(null)
      adjustAfterDelete(roles.length)
    },
    onError: () => {
      toast.error('Failed to delete role. It may be assigned to users.')
      setDeleteTarget(null)
    },
  })

  const roles: Role[] = data?.data ?? []
  const pagination    = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const openCreateModal = () => {
    setEditingRole(null)
    setName('')
    setModalOpen(true)
  }

  const openEditModal = (role: Role) => {
    setEditingRole(role)
    setName(role.name)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingRole(null)
    setName('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { name, guard_name: 'api' }
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Roles</h1>
          <p className="text-muted-foreground text-sm">{pagination.total} roles configured</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                     bg-gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus size={16} />
          Add Role
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['roles'] })}
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
                <th className="text-left">Role Name</th>
                <th className="text-left">Guard</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton h-4 w-32 rounded" /></td>
                      <td><div className="skeleton h-4 w-16 rounded" /></td>
                      <td><div className="skeleton h-4 w-12 rounded ml-auto" /></td>
                    </tr>
                  ))
                : roles.map((r) => (
                    <tr key={r.id} className="group">
                      <td className="font-semibold text-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={16} className="text-indigo-500" />
                          {r.name.toUpperCase().replace(/_/g, ' ')}
                        </div>
                      </td>
                      <td className="text-muted-foreground text-xs font-mono">{r.guard_name}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(r)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(r)}
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
              {!isLoading && roles.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-16 text-center">
                    <Shield size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No roles found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </TableWrapper>

        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
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
                  {editingRole ? 'Edit Role' : 'Create Role'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. manager, cashier, warehouse_staff"
                    className="form-input"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Use lowercase with underscores</p>
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
                    {isSaving ? 'Saving...' : editingRole ? 'Save Changes' : 'Create Role'}
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
        title="Delete Role"
        message={`Are you sure you want to delete role "${deleteTarget?.name?.toUpperCase()}"? Users assigned to this role will lose their access.`}
        confirmText="Delete Role"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default RolesPage
