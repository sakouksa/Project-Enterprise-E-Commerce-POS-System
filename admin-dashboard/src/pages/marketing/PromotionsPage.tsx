import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, RefreshCw, X, Loader2, Tag, Calendar } from 'lucide-react'
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
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'

interface Promotion {
  id: number
  name: string
  description?: string
  type: string
  conditions: string
  rewards: string
  starts_at: string
  ends_at: string
  priority: number
  is_active: boolean
}

const PromotionsPage: React.FC = () => {
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
    reset,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'promotions' })
    const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('discount')
  const [conditions, setConditions] = useState('[]')
  const [rewards, setRewards] = useState('[]')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [priority, setPriority] = useState('0')
  const [isActive, setIsActive] = useState(true)

  // API List
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['promotions', page, debouncedSearch, perPage],
    queryFn: () => api.get('/promotions', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const promotions: Promotion[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newPromo: any) => api.post('/promotions', newPromo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] })
      closeModal()
      toast.success('Promotion created successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create promotion.')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/promotions/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] })
      closeModal()
      toast.success('Promotion updated successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update promotion.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/promotions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] })
      setConfirmOpen(false)
      toast.success('Promotion deleted successfully.')
      adjustAfterDelete(promotions.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete promotion.')
      setConfirmOpen(false)
    }
  })

  const openCreateModal = () => {
    setEditingPromo(null)
    setName('')
    setDescription('')
    setType('discount')
    setConditions('[]')
    setRewards('[]')
    setStartsAt('')
    setEndsAt('')
    setPriority('0')
    setIsActive(true)
    setModalOpen(true)
  }

  const openEditModal = (p: Promotion) => {
    setEditingPromo(p)
    setName(p.name)
    setDescription(p.description ?? '')
    setType(p.type)
    setConditions(p.conditions)
    setRewards(p.rewards)
    setStartsAt(p.starts_at?.replace(' ', 'T') ?? '')
    setEndsAt(p.ends_at?.replace(' ', 'T') ?? '')
    setPriority(p.priority?.toString() ?? '0')
    setIsActive(p.is_active)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingPromo(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      company_id: 1, name, description, type, conditions, rewards,
      starts_at: startsAt, ends_at: endsAt, priority: Number(priority), is_active: isActive ? 1 : 0
    }

    if (editingPromo) {
      updateMutation.mutate({ id: editingPromo.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const confirmDelete = (id: number) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
    }
  }

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Marketing', path: '/marketing/coupons' }, { label: 'Promotions' }]} />
      
      <PageHeader 
        title="Promotions Manager" 
        subtitle="Create automatic discount and marketing campaign rules"
        action={
          <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Promotion
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-lg border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search promotions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input w-full pl-10"
          />
        </div>
        <button onClick={() => qc.invalidateQueries({ queryKey: ['promotions'] })} className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Promotion Name</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Starts At</th>
                  <th>Ends At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted-foreground p-8">No promotions found.</td>
                  </tr>
                ) : (
                  promotions.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td className="font-semibold text-foreground">{p.name}</td>
                      <td>
                        <span className="badge badge-secondary">{p.type}</span>
                      </td>
                      <td>{p.priority}</td>
                      <td>{p.starts_at}</td>
                      <td>{p.ends_at}</td>
                      <td>
                        <span className={`badge ${p.is_active ? 'badge-success' : 'badge-muted'}`}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(p)} className="btn btn-icon btn-secondary" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => confirmDelete(p.id)} className="btn btn-icon btn-danger" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-md w-full">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="text-lg font-bold text-foreground">
                  {editingPromo ? 'Edit Promotion' : 'Add Promotion'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Promotion Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="input w-full min-h-[60px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Type</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="input w-full">
                      <option value="discount">Automatic Discount</option>
                      <option value="buy_x_get_y">Buy X Get Y Free</option>
                      <option value="free_shipping">Free Shipping</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Priority Rank</label>
                    <input type="number" required value={priority} onChange={e => setPriority(e.target.value)} className="input w-full" />
                  </div>
                </div>
                <div>
                  <label className="label">Conditions (JSON Config)</label>
                  <textarea required value={conditions} onChange={e => setConditions(e.target.value)} className="input w-full min-h-[60px] font-mono text-xs" />
                </div>
                <div>
                  <label className="label">Rewards (JSON Config)</label>
                  <textarea required value={rewards} onChange={e => setRewards(e.target.value)} className="input w-full min-h-[60px] font-mono text-xs" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Starts At</label>
                    <input type="datetime-local" required value={startsAt} onChange={e => setStartsAt(e.target.value)} className="input w-full" />
                  </div>
                  <div>
                    <label className="label">Ends At</label>
                    <input type="datetime-local" required value={endsAt} onChange={e => setEndsAt(e.target.value)} className="input w-full" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="checkbox" />
                  <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">Active Promotion</label>
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-3 mt-4">
                  <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn btn-primary flex items-center gap-2">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={16} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        open={confirmOpen} 
        onCancel={() => setConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Are you sure you want to delete this promotion?"
      />
    </div>
  )
}

export default PromotionsPage
