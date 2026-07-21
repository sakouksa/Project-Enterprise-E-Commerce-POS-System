import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, X, Loader2, 
  DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw as RefundIcon,
  Filter, Download, Landmark
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
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useTranslation } from 'react-i18next'

interface Transaction {
  id: number
  company_id: number
  payment_id?: number
  type: string
  amount: number
  description?: string
  reference_type?: string
  reference_id?: number
  created_at: string
  company?: { id: number; name: string }
  payment_method?: { id: number; name: string }
}

interface TransactionForm {
  company_id: string
  payment_id: string
  type: string
  amount: string
  description: string
  reference_type: string
  reference_id: string
}

const BLANK_FORM: TransactionForm = {
  company_id: '',
  payment_id: '',
  type: 'debit',
  amount: '',
  description: '',
  reference_type: '',
  reference_id: '',
}

const TransactionsPage: React.FC<{ isTab?: boolean; triggerAdd?: number }> = ({ isTab, triggerAdd }) => {
  const { t } = useTranslation()
  const toast = useToast()
  const qc = useQueryClient()
  
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
  } = useServerPagination({ storageKey: 'transactions' })

  React.useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      openCreateDrawer()
    }
  }, [triggerAdd])
    const [typeFilter, setTypeFilter] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null)
  
  // Form states
  const [form, setForm] = useState<TransactionForm>(BLANK_FORM)

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['transactions', page, debouncedSearch, perPage, typeFilter],
    queryFn: () => api.get('/transactions', { 
      params: { page, search: debouncedSearch, type: typeFilter, per_page: perPage } 
    }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  const { data: companies } = useQuery({
    queryKey: ['companies-select'],
    queryFn: () => api.get('/companies', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods-select'],
    queryFn: () => api.get('/payment-methods', { params: { per_page: 100 } }).then(r => r.data.data ?? []),
  })

  // ─── Mutations ────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post('/transactions', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaction logged successfully')
      closeDrawer()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to log transaction')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => api.put(`/transactions/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaction updated successfully')
      closeDrawer()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update transaction')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaction deleted successfully')
      setDeleteTarget(null)
      adjustAfterDelete(transactions.length)
    },
    onError: () => {
      toast.error('Failed to delete transaction')
      setDeleteTarget(null)
    }
  })

  const transactions: Transaction[] = data?.data ?? []
  const pagination = data?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Stats calculation
  const totalVolume = transactions.reduce((acc, t) => acc + Number(t.amount), 0)
  const salesVolume = transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + Number(t.amount), 0)
  const purchaseVolume = transactions.filter(t => t.type === 'purchase').reduce((acc, t) => acc + Number(t.amount), 0)

  const openCreateDrawer = () => {
    setEditingTransaction(null)
    setForm(BLANK_FORM)
    setDrawerOpen(true)
  }

  const openEditDrawer = (tx: Transaction) => {
    setEditingTransaction(tx)
    setForm({
      company_id: String(tx.company_id),
      payment_id: tx.payment_id ? String(tx.payment_id) : '',
      type: tx.type,
      amount: String(tx.amount),
      description: tx.description ?? '',
      reference_type: tx.reference_type ?? '',
      reference_id: tx.reference_id ? String(tx.reference_id) : '',
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingTransaction(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company_id || !form.amount || !form.type) {
      toast.error('Please fill in all required fields')
      return
    }

    const payload = {
      company_id: Number(form.company_id),
      payment_id: form.payment_id ? Number(form.payment_id) : null,
      type: form.type,
      amount: Number(form.amount),
      description: form.description || null,
      reference_type: form.reference_type || null,
      reference_id: form.reference_id ? Number(form.reference_id) : null,
    }

    if (editingTransaction) {
      updateMutation.mutate({ id: editingTransaction.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Company ID', 'Type', 'Amount', 'Reference Type', 'Reference ID', 'Description', 'Created At']
    const rows = transactions.map(t => [
      t.id,
      t.company_id,
      t.type,
      t.amount,
      t.reference_type || '',
      t.reference_id || '',
      t.description || '',
      t.created_at
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `transactions_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Transactions exported successfully')
  }

  return (
    <div className="space-y-6">
      {!isTab && (
        <>
          <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Payments', path: '/payments/methods' }, { label: 'Transactions' }]} />
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <PageHeader 
              title="Transaction History" 
              subtitle="Real-time audit log of all sales, purchases, and refund transactions across branches."
            />
            <div className="flex items-center gap-3">
              <button onClick={exportCSV} className="btn btn-secondary flex items-center gap-2">
                <Download size={16} /> Export CSV
              </button>
              <button onClick={openCreateDrawer} className="btn btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
                <Plus size={16} /> Log Transaction
              </button>
            </div>
          </div>
        </>
      )}

      {/* Stats Cards */}
      {!isTab && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-sm font-medium">Total Volume</span>
              <h3 className="text-2xl font-bold text-foreground">
                ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-sm font-medium">Sales Inflow</span>
              <h3 className="text-2xl font-bold text-green-600">
                +${salesVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
              <ArrowUpRight size={24} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-sm font-medium">Purchases Outflow</span>
              <h3 className="text-2xl font-bold text-red-500">
                -${purchaseVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl">
              <ArrowDownRight size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search by description or reference..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="form-input pl-10 w-full"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={typeFilter} 
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="form-select w-full sm:w-44 bg-background border border-input rounded-lg text-sm px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="sale">Sale</option>
            <option value="purchase">Purchase</option>
            <option value="refund">Refund</option>
          </select>

          <button onClick={() => refetch()} className="btn btn-secondary flex items-center gap-2">
            <RefreshCw size={16} />
          </button>
          
          {isTab && (
            <button onClick={exportCSV} className="btn btn-secondary flex items-center gap-2">
              <Download size={16} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
      <TableWrapper isFetching={isFetching}>
        <table className="w-full data-table">
            <thead>
              <tr>
                <th className="w-[8%] text-left py-4 px-5">ID</th>
                <th className="w-[15%] text-left py-4 px-5">Type</th>
                <th className="w-[15%] text-left py-4 px-5">Amount</th>
                <th className="w-[20%] text-left py-4 px-5">Company</th>
                <th className="w-[20%] text-left py-4 px-5">Payment Method</th>
                <th className="w-[20%] text-left py-4 px-5">Reference</th>
                <th className="w-[18%] text-left py-4 px-5">Created At</th>
                <th className="w-[100px] text-right py-4 px-5">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-4 px-5"><div className="skeleton h-4 w-8 rounded" /></td>
                    <td className="py-4 px-5"><div className="skeleton h-4 w-16 rounded" /></td>
                    <td className="py-4 px-5"><div className="skeleton h-4 w-20 rounded" /></td>
                    <td className="py-4 px-5"><div className="skeleton h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><div className="skeleton h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><div className="skeleton h-4 w-32 rounded" /></td>
                    <td className="py-4 px-5"><div className="skeleton h-4 w-28 rounded" /></td>
                    <td className="py-4 px-5"><div className="skeleton h-6 w-12 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted-foreground py-12">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Landmark className="text-muted-foreground/40" size={40} />
                      <span>No transactions logged in this period.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-5 font-mono text-xs">{t.id}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        (t.type === 'sale' || t.type === 'debit') ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
                        (t.type === 'purchase' || t.type === 'credit') ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                        'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
                      }`}>
                        {(t.type === 'sale' || t.type === 'debit') && <ArrowUpRight size={12} />}
                        {(t.type === 'purchase' || t.type === 'credit') && <ArrowDownRight size={12} />}
                        {t.type !== 'sale' && t.type !== 'debit' && t.type !== 'purchase' && t.type !== 'credit' && <ArrowUpRight size={12} />}
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-semibold text-foreground">
                      ${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-5 text-sm">{t.company?.name ?? `Company #${t.company_id}`}</td>
                    <td className="py-4 px-5 text-sm">{t.payment_method?.name ?? '-'}</td>
                    <td className="py-4 px-5 text-xs text-muted-foreground font-medium">
                      {t.reference_type ? `${t.reference_type} #${t.reference_id}` : '-'}
                    </td>
                    <td className="py-4 px-5 text-xs text-muted-foreground whitespace-nowrap">{t.created_at ? new Date(t.created_at).toLocaleDateString() : '-'}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditDrawer(t)} className="p-1.5 hover:text-blue-500 rounded hover:bg-muted transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(t)} className="p-1.5 hover:text-red-500 rounded hover:bg-muted transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
      </TableWrapper>
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      {/* Add / Edit Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                <h3 className="text-lg font-semibold text-foreground">
                  {editingTransaction ? 'Edit Transaction Details' : 'Log New Transaction'}
                </h3>
                <button onClick={closeDrawer} className="p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Company select */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Select Company *</label>
                  <select
                    value={form.company_id}
                    onChange={e => setForm({ ...form, company_id: e.target.value })}
                    className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5 cursor-pointer"
                    required
                  >
                    <option value="">-- Choose Company --</option>
                    {companies?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Method select */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Payment Method</label>
                  <select
                    value={form.payment_id}
                    onChange={e => setForm({ ...form, payment_id: e.target.value })}
                    className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5 cursor-pointer"
                  >
                    <option value="">-- None (Cash / Invoiced) --</option>
                    {paymentMethods?.map((pm: any) => (
                      <option key={pm.id} value={pm.id}>{pm.name} ({pm.code})</option>
                    ))}
                  </select>
                </div>

                {/* Transaction Type */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Type *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5 cursor-pointer"
                    required
                  >
                    <option value="debit">Debit (Inflow)</option>
                    <option value="credit">Credit (Outflow)</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Amount ($) *</label>
                  <div className="relative">
                    <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={form.amount}
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                      placeholder="e.g. 250.00"
                      className="form-input pl-9 w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5"
                      required
                    />
                  </div>
                </div>

                {/* Reference details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Ref Type</label>
                    <input
                      type="text"
                      placeholder="e.g. order, invoice"
                      value={form.reference_type}
                      onChange={e => setForm({ ...form, reference_type: e.target.value })}
                      className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Ref ID</label>
                    <input
                      type="number"
                      placeholder="e.g. 104"
                      value={form.reference_id}
                      onChange={e => setForm({ ...form, reference_id: e.target.value })}
                      className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all py-2.5"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide additional logging notes..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="form-input w-full text-xs rounded-xl border border-border bg-card text-foreground hover:border-muted-foreground/30 focus:ring-primary/20 focus:border-primary transition-all p-3 resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                  <button type="button" onClick={closeDrawer} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="btn btn-primary bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={16} />}
                    {editingTransaction ? 'Save Changes' : 'Confirm transaction'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Transaction Entry"
        message="Are you sure you want to delete this transaction record? This action cannot be undone and will permanently remove this entry from the system audits."
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id)
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default TransactionsPage
