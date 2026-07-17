import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, RotateCcw, ShieldAlert, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'

interface TrashItem {
  id: number
  name?: string
  title?: string
  sku?: string
  email?: string
  phone?: string
  code?: string
  amount?: string
  deleted_at?: string
}

type TabType = 'products' | 'customers' | 'suppliers' | 'expenses' | 'categories' | 'brands' | 'warehouses' | 'blogs'

const RecycleBinPage: React.FC = () => {
  const qc = useQueryClient()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<TabType>('products')
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
  } = useServerPagination({ storageKey: 'recyclebin' })
    const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null)
  const [confirmAction, setConfirmAction] = useState<'restore' | 'force_delete' | null>(null)

  const tabLabels: Record<TabType, { en: string; kh: string }> = {
    products: { en: 'Products', kh: 'ទំនិញ' },
    customers: { en: 'Customers', kh: 'អតិថិជន' },
    suppliers: { en: 'Suppliers', kh: 'អ្នកផ្គត់ផ្គង់' },
    expenses: { en: 'Expenses', kh: 'ការចំណាយ' },
    categories: { en: 'Categories', kh: 'ក្រុមទំនិញ' },
    brands: { en: 'Brands', kh: 'ម៉ាកយីហោ' },
    warehouses: { en: 'Warehouses', kh: 'ឃ្លាំងទំនិញ' },
    blogs: { en: 'Blogs', kh: 'អត្ថបទ' },
  }

  // Fetch soft-deleted records for active tab
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['recycle-bin', activeTab, page, search],
    queryFn: () =>
      api
        .get(`/${activeTab}`, {
          params: {
            page,
            search,
            status: 'deleted',
            per_page: 10,
          },
        })
        .then((r) => r.data),
    placeholderData: (prev) => prev,
  })

  // Restore Mutation
  const restoreMutation = useMutation({
    mutationFn: (id: number) => api.post(`/${activeTab}/${id}/restore`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recycle-bin', activeTab] })
      toast.success('Record restored successfully.')
      closeConfirm()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to restore record.')
      closeConfirm()
    },
  })

  // Force Delete Mutation
  const forceDeleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/${activeTab}/${id}/force`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recycle-bin', activeTab] })
      toast.success('Record permanently deleted.')
      closeConfirm()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to permanently delete record.')
      closeConfirm()
    },
  })

  const records: TrashItem[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setPage(1)
    setSearch('')
  }

  const triggerAction = (item: TrashItem, action: 'restore' | 'force_delete') => {
    setSelectedItem(item)
    setConfirmAction(action)
  }

  const closeConfirm = () => {
    setSelectedItem(null)
    setConfirmAction(null)
  }

  const executeAction = () => {
    if (!selectedItem) return
    if (confirmAction === 'restore') {
      restoreMutation.mutate(selectedItem.id)
    } else if (confirmAction === 'force_delete') {
      forceDeleteMutation.mutate(selectedItem.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <Breadcrumb items={[{ label: 'System', path: '#' }, { label: 'Recycle Bin' }]} />
        <PageHeader title="Recycle Bin / ធុងសំរាម" subtitle="Manage and restore soft-deleted records or delete them forever." />
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-px">
        {(Object.keys(tabLabels) as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 text-sm font-medium transition-all relative ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tabLabels[tab].en} <span className="text-xs text-gray-400">({tabLabels[tab].kh})</span>
            </span>
          </button>
        ))}
      </div>

      {/* Main workspace */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {/* Table top toolbar */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search deleted items..."
                className="w-64 pl-3 pr-8 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-gray-500">Loading deleted items...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Trash is empty</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">
                There are no soft-deleted records in this module.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-55/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 font-medium">
                <tr>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Reference/Code</th>
                  <th className="p-4">Deleted At</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {records.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {item.name || item.title || `Record #${item.id}`}
                      </div>
                      {(item.email || item.phone) && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {item.email} {item.phone && `• ${item.phone}`}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-500">
                      {item.sku || item.code || (item.amount && `$${item.amount}`) || '-'}
                    </td>
                    <td className="p-4 text-gray-500">
                      {item.deleted_at ? new Date(item.deleted_at).toLocaleString() : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => triggerAction(item, 'restore')}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restore
                        </button>
                        <button
                          onClick={() => triggerAction(item, 'force_delete')}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Forever
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination footer */}
        {pagination.last_page > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xl max-w-md w-full"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-full ${
                      confirmAction === 'restore'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-600'
                    }`}
                  >
                    {confirmAction === 'restore' ? (
                      <RotateCcw className="w-6 h-6" />
                    ) : (
                      <ShieldAlert className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {confirmAction === 'restore' ? 'Restore Record' : 'Delete Forever'}
                  </h3>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to {confirmAction === 'restore' ? 'restore' : 'permanently delete'}{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      "{selectedItem.name || selectedItem.title || `Record #${selectedItem.id}`}"
                    </span>
                    ?
                  </p>
                  {confirmAction === 'force_delete' && (
                    <p className="text-xs text-red-500 font-medium">
                      ⚠️ WARNING: This action is permanent, and cannot be undone. Associated physical files will be deleted.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={closeConfirm}
                    disabled={restoreMutation.isPending || forceDeleteMutation.isPending}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeAction}
                    disabled={restoreMutation.isPending || forceDeleteMutation.isPending}
                    className={`px-4 py-2 text-sm text-white rounded-lg transition flex items-center gap-1.5 ${
                      confirmAction === 'restore'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {(restoreMutation.isPending || forceDeleteMutation.isPending) && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RecycleBinPage
