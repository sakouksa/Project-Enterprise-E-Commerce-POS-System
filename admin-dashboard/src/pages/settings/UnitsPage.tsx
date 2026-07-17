import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import {
  Breadcrumb, PageHeader, SearchFilter, DataTable,
  FormDrawer, StatusBadge, LoadingSpinner
} from '@/components/common'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'

interface Unit {
  id:          number
  name:        string
  symbol:      string
  description: string
  is_active:   boolean
}

const BLANK_FORM = {
  name:        '',
  symbol:      '',
  description: '',
  is_active:   true,
}

const UnitsPage: React.FC<{ isTab?: boolean }> = ({ isTab }) => {
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
  } = useServerPagination({ storageKey: 'units' })
    const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [form, setForm] = useState(BLANK_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Unit | null>(null)

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['units', page, debouncedSearch, perPage],
    queryFn: () => api.get('/units', { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const units: Unit[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // ─── Mutations ────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (payload: typeof BLANK_FORM) => {
      if (editingUnit) {
        return api.put(`/units/${editingUnit.id}`, payload)
      } else {
        return api.post('/units', { ...payload, company_id: 1 })
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units'] })
      toast.success(editingUnit ? 'Unit updated successfully.' : 'Unit created successfully.')
      closeDrawer()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to save unit.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/units/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units'] })
      toast.success('Unit deleted successfully.')
      setDeleteTarget(null)
      adjustAfterDelete(units.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete unit.')
      setDeleteTarget(null)
    }
  })

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const openCreateDrawer = () => {
    setEditingUnit(null)
    setForm(BLANK_FORM)
    setDrawerOpen(true)
  }

  const openEditDrawer = (unit: Unit) => {
    setEditingUnit(unit)
    setForm({
      name:        unit.name,
      symbol:      unit.symbol,
      description: unit.description || '',
      is_active:   unit.is_active,
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingUnit(null)
    setForm(BLANK_FORM)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await saveMutation.mutateAsync(form)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (row: Unit) => {
    setDeleteTarget(row)
  }

  const columns = [
    { key: 'name',        title: 'Unit Name',    sortable: true },
    { key: 'symbol',      title: 'Symbol',       sortable: true },
    { key: 'description', title: 'Description' },
    {
      key: 'is_active',
      title: 'Status',
      render: (val: any) => (
        <StatusBadge status={val ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '100px',
      render: (_: any, row: Unit) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditDrawer(row)}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {!isTab && (
        <>
          <Breadcrumb items={[{ label: 'Settings', path: '/settings' }, { label: 'Units' }]} />

          <PageHeader
            title="Units of Measure"
            subtitle="Manage product packaging classifications, symbols, and fractional quantities."
            action={
              <button
                onClick={openCreateDrawer}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors px-4 py-2"
              >
                <Plus size={16} />
                Add Unit
              </button>
            }
          />
        </>
      )}

      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchFilter
              searchValue={search}
              onSearchChange={(val) => { setSearch(val); setPage(1) }}
              onReset={() => { setSearch(''); setPage(1) }}
              onRefresh={() => qc.invalidateQueries({ queryKey: ['units'] })}
              searchPlaceholder="Search unit by name or symbol..."
            />
          </div>
          {isTab && (
            <button
              onClick={openCreateDrawer}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors px-4 py-2 whitespace-nowrap"
            >
              <Plus size={16} />
              Add Unit
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner fullPage label="Retrieving units of measure..." />
      ) : (
        <div className="space-y-4">
          <DataTable columns={columns} data={units} />

          <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
        </div>
      )}

      {/* Drawer */}
      <FormDrawer
        open={drawerOpen}
        title={editingUnit ? 'Edit Unit Specification' : 'Add Unit'}
        subtitle={editingUnit ? 'Modify unit configuration.' : 'Create a new unit category.'}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
        loading={submitting}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Unit Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="form-input w-full text-sm"
              placeholder="e.g. Pieces"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Symbol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.symbol}
              onChange={e => setForm({ ...form, symbol: e.target.value })}
              className="form-input w-full text-sm font-mono"
              placeholder="e.g. pcs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="form-input w-full text-sm resize-none"
              placeholder="Optional notes or details..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={e => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-600/30 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-foreground cursor-pointer">
              Active Unit status
            </label>
          </div>
        </div>
      </FormDrawer>

      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        title="Unit"
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
            saveMutation.mutate({
              name: deleteTarget.name,
              symbol: deleteTarget.symbol,
              description: deleteTarget.description,
              is_active: false
            }, {
              onSuccess: () => {
                setDeleteTarget(null)
                toast.success('Unit archived successfully.')
              }
            })
          }
        }}
      />
    </div>
  )
}

export default UnitsPage
