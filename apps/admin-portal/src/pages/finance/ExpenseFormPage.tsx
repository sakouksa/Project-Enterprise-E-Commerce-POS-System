import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Receipt,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Eye,
  Check,
  Building2,
  ChevronDown,
  Search,
  FolderClosed,
  Home,
  Wifi,
  Zap,
  Utensils,
  Package,
  Truck,
  Megaphone,
  Server,
  Layers,
  Tag
} from 'lucide-react'
import { expenseService } from '@/services/expenseService'
import { companyService } from '@/services/companyService'
import { useToast } from '@/hooks/useToast'
import { FormHeader, FormFooter, LoadingSpinner, FileUpload } from '@/components/common'
import CustomErrorMessage from '@/components/ui/CustomErrorMessage'

interface ExpenseFormData {
  title: string
  expense_category_id: string
  amount: string
  date: string
  reference_number: string
  description: string
  status: 'approved' | 'pending' | 'rejected'
  branch_id: string
  company_id: string
  receipt: string
}

const generateDefaultRef = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `EXP-${datePart}-${randomNum}`
}

const BLANK_EXPENSE_FORM: ExpenseFormData = {
  title: '',
  expense_category_id: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  reference_number: '',
  description: '',
  status: 'approved',
  branch_id: '1',
  company_id: '1',
  receipt: '',
}

// ─── Category Visual Resolver (Icons & Colors) ──────────────────────────────
const getCategoryMeta = (name?: string, id?: number) => {
  const lower = (name || '').toLowerCase()
  if (lower.includes('office') || lower.includes('supplies') || lower.includes('សម្ភារៈ') || lower.includes('văn phòng')) {
    return { icon: FolderClosed, bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', dot: 'bg-blue-500', name: name || 'Office Supplies' }
  }
  if (lower.includes('rent') || lower.includes('utilit') || lower.includes('ថ្លៃឈ្នួល') || lower.includes('tiện ích')) {
    return { icon: Home, bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', dot: 'bg-amber-500', name: name || 'Rent & Utilities' }
  }
  if (lower.includes('internet') || lower.includes('phone') || lower.includes('ទូរស័ព្ទ') || lower.includes('mạng')) {
    return { icon: Wifi, bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20', dot: 'bg-cyan-500', name: name || 'Internet & Phone' }
  }
  if (lower.includes('electric') || lower.includes('power') || lower.includes('ភ្លើង') || lower.includes('điện')) {
    return { icon: Zap, bg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-500', name: name || 'Electricity' }
  }
  if (lower.includes('meal') || lower.includes('food') || lower.includes('អាហារ') || lower.includes('ăn uống')) {
    return { icon: Utensils, bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', dot: 'bg-orange-500', name: name || 'Meals' }
  }
  if (lower.includes('packag') || lower.includes('shipping') || lower.includes('វេចខ្ចប់') || lower.includes('đóng gói')) {
    return { icon: Package, bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', dot: 'bg-indigo-500', name: name || 'Shipping & Packaging' }
  }
  if (lower.includes('fuel') || lower.includes('logistic') || lower.includes('ដឹកជញ្ជូន') || lower.includes('ប្រេង') || lower.includes('vận chuyển')) {
    return { icon: Truck, bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500', name: name || 'Logistics & Fuel' }
  }
  if (lower.includes('advertis') || lower.includes('marketing') || lower.includes('ផ្សព្វផ្សាយ') || lower.includes('tiếp thị')) {
    return { icon: Megaphone, bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', dot: 'bg-rose-500', name: name || 'Advertising & Marketing' }
  }
  if (lower.includes('server') || lower.includes('cloud') || lower.includes('hosting') || lower.includes('máy chủ')) {
    return { icon: Server, bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', dot: 'bg-purple-500', name: name || 'Server & Cloud' }
  }
  // Deterministic fallbacks
  const colors = [
    { icon: Tag, bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20', dot: 'bg-violet-500' },
    { icon: Layers, bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20', dot: 'bg-teal-500' },
    { icon: FolderClosed, bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20', dot: 'bg-sky-500' },
  ]
  const c = colors[(id || 0) % colors.length]
  return { ...c, name: name || 'Operational Expense' }
}

export const ExpenseFormPage: React.FC = () => {
  const { t } = useTranslation(['finance', 'common', 'nav'])
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  const expenseId = id ? parseInt(id) : null
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()

  const [formData, setFormData] = useState<ExpenseFormData>(() => ({
    ...BLANK_EXPENSE_FORM,
    reference_number: generateDefaultRef()
  }))

  // Custom Dropdown UI States
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')
  const [isBranchOpen, setIsBranchOpen] = useState(false)
  const [branchSearch, setBranchSearch] = useState('')

  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const branchDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const setFormField = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Fetch expense data if editing
  // staleTime:0 + refetchOnMount:'always' ensures we never show stale/cached
  const {
    data: expenseDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['expense-detail', expenseId],
    queryFn: () => (expenseId ? expenseService.getExpense(expenseId) : null),
    enabled: isEdit && !isNaN(expenseId as number),
    staleTime: 0,           // always treat cached data as stale
    refetchOnMount: 'always', // always re-fetch from server when this page mounts
  })

  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['expense-categories-dropdown'],
    queryFn: () => expenseService.getCategories({ per_page: 100 }).then(r => r.data ?? []),
  })

  // Fetch branches for dropdown
  const { data: branches = [] } = useQuery({
    queryKey: ['branches-dropdown'],
    queryFn: () => companyService.getBranches({ per_page: 100 }).then(r => r.data ?? []),
  })

  // Populate data in edit mode
  useEffect(() => {
    if (expenseDetail) {
      setFormData({
        title: expenseDetail.title || '',
        expense_category_id: expenseDetail.expense_category_id?.toString() || expenseDetail.category?.id?.toString() || '',
        amount: expenseDetail.amount?.toString() || '',
        date: expenseDetail.date ? expenseDetail.date.split('T')[0] : new Date().toISOString().split('T')[0],
        reference_number: expenseDetail.reference_number || '',
        description: expenseDetail.description || '',
        status: expenseDetail.status || 'approved',
        branch_id: expenseDetail.branch_id?.toString() || '1',
        company_id: expenseDetail.company_id?.toString() || '1',
        receipt: expenseDetail.receipt || '',
      })
    }
  }, [expenseDetail])

  const handleAutoGenerateRef = () => {
    setFormField('reference_number', generateDefaultRef())
  }

  // Quick Amount Handlers
  const handleAddAmount = (addValue: number) => {
    const current = parseFloat(formData.amount || '0')
    const newVal = (current + addValue).toFixed(2)
    setFormField('amount', newVal)
  }

  const handleSetAmount = (val: string) => {
    setFormField('amount', val)
  }

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      const formattedPayload = {
        ...payload,
        amount: parseFloat(payload.amount || '0'),
        expense_category_id: payload.expense_category_id ? parseInt(payload.expense_category_id) : null,
        branch_id: payload.branch_id ? parseInt(payload.branch_id) : 1,
        company_id: 1,
      }
      if (isEdit && expenseId) {
        return expenseService.updateExpense(expenseId, formattedPayload)
      }
      return expenseService.createExpense(formattedPayload)
    },
    onSuccess: () => {
      // Invalidate all related queries so list, stats, and detail are all fresh
      qc.invalidateQueries({ queryKey: ['expenses-tab'] })
      qc.invalidateQueries({ queryKey: ['all-expenses-stats'] })
      qc.invalidateQueries({ queryKey: ['finance-analytics'] })
      // Also remove the cached detail for this specific expense so the next
      // edit visit always loads fresh data (prevents stale receipt/image cache)
      if (isEdit && expenseId) {
        qc.removeQueries({ queryKey: ['expense-detail', expenseId] })
      }
      toast.success(
        isEdit
          ? t('finance.update_success', 'Expense updated successfully.')
          : t('finance.save_success', 'Expense recorded successfully.')
      )
      navigate('/expenses?tab=expenses')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || t('finance.save_error', 'Failed to save expense.'))
    },
  })

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!formData.title.trim()) {
      toast.error(t('finance.title_required', 'Please enter expense title'))
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error(t('finance.amount_required', 'Please enter a valid amount'))
      return
    }
    saveMutation.mutate(formData)
  }

  // Helper info for selected category & branch
  const selectedCat = categories.find((c: any) => c.id.toString() === formData.expense_category_id)
  const selectedCatMeta = selectedCat ? getCategoryMeta(selectedCat.name, selectedCat.id) : null
  const selectedBranch = branches.find((b: any) => b.id.toString() === formData.branch_id)

  // Filtered lists for dropdowns
  const filteredCategories = categories.filter((c: any) =>
    (c.name || '').toLowerCase().includes(categorySearch.toLowerCase()) ||
    (c.code || '').toLowerCase().includes(categorySearch.toLowerCase())
  )

  const allBranchesList = [
    { id: '1', name: t('finance.main_branch', 'HQ Main Branch'), code: 'HQ-01' },
    ...branches.filter((b: any) => b.id.toString() !== '1').map((b: any) => ({
      id: b.id.toString(),
      name: b.name,
      code: b.code || `BR-${b.id}`
    }))
  ]

  const filteredBranches = allBranchesList.filter((b: any) =>
    (b.name || '').toLowerCase().includes(branchSearch.toLowerCase()) ||
    (b.code || '').toLowerCase().includes(branchSearch.toLowerCase())
  )

  if (isEdit && isLoadingDetail) {
    return <LoadingSpinner label={t('common.loading', 'Loading expense details...')} />
  }

  if (isEdit && isErrorDetail) {
    return (
      <div className="p-6 w-full mx-auto">
        <CustomErrorMessage
          message={detailError?.message || t('finance.fetch_error', 'Error loading expense')}
          onRetry={() => refetchDetail()}
          title={t('finance.fetch_error', 'Error loading expense')}
        />
      </div>
    )
  }

  // Quick preset suggestions
  const QUICK_TEMPLATES = [
    { key: 'tpl_office', defaultText: 'Office Supplies & Equipment' },
    { key: 'tpl_utilities', defaultText: 'Electricity & Water Utilities' },
    { key: 'tpl_server', defaultText: 'Internet & Cloud Hosting' },
    { key: 'tpl_fuel', defaultText: 'Fuel & Transportation' },
    { key: 'tpl_marketing', defaultText: 'Marketing & Advertising' },
  ]

  return (
    <div className="min-h-screen bg-background pb-20 w-full">
      {/* ─── Top Full-Width Form Header ─── */}
      <FormHeader
        title={isEdit ? t('finance.edit_expense', 'Edit Expense') : t('finance.create_expense', 'Record New Expense')}
        subtitle={t('finance.expense_form_sub', 'Fill in operational expense details, financial outlay, reference number, and attach digital invoices.')}
        isEdit={isEdit}
        icon={<Receipt size={22} className="text-emerald-500" />}
        backPath="/expenses?tab=expenses"
        backLabel={t('common.back', 'Back to Expenses')}
        isSubmitting={saveMutation.isPending}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? t('common.save_changes', 'Save Changes') : t('finance.save_expense', 'Save Expense')}
        breadcrumbs={[
          { label: t('nav.financeManagement', 'Finance'), href: '/expenses' },
          { label: t('finance.expenses', 'Expenses'), href: '/expenses?tab=expenses' },
          { label: isEdit ? `${t('common.edit', 'Edit')} #${formData.reference_number || expenseId}` : t('finance.create_expense', 'New Expense') },
        ]}
        statusBadge={
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
            formData.status === 'approved'
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 ring-1 ring-emerald-500/20'
              : formData.status === 'pending'
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 ring-1 ring-amber-500/20'
              : 'bg-rose-500/10 text-rose-500 border-rose-500/30 ring-1 ring-rose-500/20'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {t(`finance.status_${formData.status}`, formData.status)}
          </span>
        }
      />

      {/* ─── Main Full-Width Form Body ─── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full items-start">
          
          {/* ─── LEFT 2 COLUMNS: Financial & General Inputs ─── */}
          <div className="xl:col-span-2 space-y-6">

            {/* CARD 1: Financial Outlay (Hero Amount Section) */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shadow-xs">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {t('finance.financial_details', 'Financial Details & Outlay')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t('finance.financial_details_desc', 'Specify total cash outlay, currency, transaction date, and quick amount increments.')}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  USD ($)
                </span>
              </div>

              {/* Amount Spotlight Input & Date */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-7">
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {t('finance.amount_col', 'Total Amount ($ USD)')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground pointer-events-none">
                      <span className="text-2xl font-bold font-mono">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormField('amount', e.target.value)}
                      placeholder="0.00"
                      className="w-full h-14 pl-11 pr-4 text-2xl font-mono font-extrabold bg-muted/20 dark:bg-muted/10 border-2 border-border focus:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/15 transition-all text-foreground placeholder:text-muted-foreground shadow-2xs"
                    />
                  </div>

                  {/* Quick Amount Suggestion Chips */}
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {[50, 100, 250, 500, 1000, 2500].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => handleAddAmount(amt)}
                        className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-muted/60 dark:bg-muted/20 hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-400 border border-border/60 dark:border-border/80 transition-all cursor-pointer select-none active:scale-95 text-foreground"
                      >
                        +${amt}
                      </button>
                    ))}
                    {formData.amount && (
                      <button
                        type="button"
                        onClick={() => handleSetAmount('')}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        {t('common.clear', 'Clear')}
                      </button>
                    )}
                  </div>
                </div>

                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {t('finance.date_col', 'Expense Date')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormField('date', e.target.value)}
                      className="w-full h-14 px-4 text-sm font-mono font-bold bg-muted/20 dark:bg-muted/10 border-2 border-border focus:border-primary rounded-xl focus:ring-4 focus:ring-primary/15 transition-all text-foreground shadow-2xs cursor-pointer dark:[color-scheme:dark]"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    {t('finance.date_hint', 'Transaction date recorded in general accounting ledger.')}
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2: General Information */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-xs">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {t('finance.general_info', 'General Information')}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t('finance.general_info_desc', 'Enter the title, category, branch, and official approval state.')}
                  </p>
                </div>
              </div>

              {/* Title & Quick Fill Chips */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-foreground">
                    {t('finance.title_col', 'Expense Title')} <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">{t('finance.quick_templates', 'Quick Fill:')}</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormField('title', e.target.value)}
                  placeholder={t('finance.placeholder_title', 'e.g. Office Supplies & Equipment')}
                  className="w-full h-11 px-3.5 rounded-xl text-sm bg-muted/20 dark:bg-muted/10 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-xs font-medium"
                />

                {/* Preset Suggestions */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {QUICK_TEMPLATES.map((item) => {
                    const label = t(`finance.${item.key}`, item.defaultText)
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => setFormField('title', label)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-muted/60 dark:bg-muted/20 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border border-border/40 dark:border-border/60 text-muted-foreground"
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Category & Branch (RICH VISUAL DROPDOWNS WITH ICON & COLORS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 🎨 Visual Category Dropdown */}
                <div className="relative" ref={categoryDropdownRef}>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {t('finance.category_col', 'Expense Category')} <span className="text-rose-500">*</span>
                  </label>
                  
                  {/* Dropdown Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryOpen(!isCategoryOpen)
                      setIsBranchOpen(false)
                    }}
                    className={`w-full h-12 px-3 rounded-xl border text-sm transition-all flex items-center justify-between gap-2 shadow-xs cursor-pointer select-none bg-muted/20 dark:bg-muted/10 ${
                      isCategoryOpen
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {selectedCatMeta ? (
                        <>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${selectedCatMeta.bg}`}>
                            <selectedCatMeta.icon size={15} />
                          </div>
                          <span className="font-bold text-foreground truncate">{selectedCat.name}</span>
                          {selectedCat.code && (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {selectedCat.code}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="w-7 h-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                            <Tag size={15} />
                          </div>
                          <span className="text-muted-foreground text-xs font-medium">
                            -- {t('finance.select_category', 'Select Category')} --
                          </span>
                        </>
                      )}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
                        isCategoryOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Panel */}
                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-popover/95 dark:bg-slate-900/95 backdrop-blur-md border border-border dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/60 overflow-hidden p-2 space-y-1.5"
                      >
                        {/* Search in Dropdown */}
                        <div className="relative px-1 pt-1 pb-1">
                          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            autoFocus
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            placeholder={t('finance.search_category', 'Search category...')}
                            className="w-full h-9 pl-9 pr-3 rounded-lg text-xs bg-muted/60 dark:bg-muted/20 border border-border/80 dark:border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                          />
                        </div>

                        {/* List */}
                        <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1 p-0.5">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat: any) => {
                              const meta = getCategoryMeta(cat.name, cat.id)
                              const Icon = meta.icon
                              const isSelected = formData.expense_category_id === cat.id.toString()

                              return (
                                <button
                                  type="button"
                                  key={cat.id}
                                  onClick={() => {
                                    setFormField('expense_category_id', cat.id.toString())
                                    setIsCategoryOpen(false)
                                    setCategorySearch('')
                                  }}
                                  className={`w-full p-2 rounded-xl flex items-center justify-between gap-2.5 transition-all text-left cursor-pointer ${
                                    isSelected
                                      ? 'bg-primary/10 border border-primary/30 text-primary font-bold'
                                      : 'hover:bg-muted/80 text-foreground border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${meta.bg}`}>
                                      <Icon size={16} />
                                    </div>
                                    <div className="truncate">
                                      <p className="text-xs font-bold leading-tight">{cat.name}</p>
                                      {cat.code && (
                                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{cat.code}</p>
                                      )}
                                    </div>
                                  </div>
                                  {isSelected && <Check size={16} className="text-primary shrink-0" />}
                                </button>
                              )
                            })
                          ) : (
                            <div className="p-4 text-center text-xs text-muted-foreground">
                              {t('finance.no_categories_found', 'No categories found')}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 🏢 Visual Branch Dropdown */}
                <div className="relative" ref={branchDropdownRef}>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {t('finance.branch', 'Branch / Department')}
                  </label>
                  
                  {/* Dropdown Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsBranchOpen(!isBranchOpen)
                      setIsCategoryOpen(false)
                    }}
                    className={`w-full h-12 px-3 rounded-xl border text-sm transition-all flex items-center justify-between gap-2 shadow-xs cursor-pointer select-none bg-muted/20 dark:bg-muted/10 ${
                      isBranchOpen
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Building2 size={15} />
                      </div>
                      <span className="font-bold text-foreground truncate">
                        {formData.branch_id === '1'
                          ? t('finance.main_branch', 'HQ Main Branch')
                          : (selectedBranch?.name || t('finance.main_branch', 'HQ Main Branch'))}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground transition-transform duration-200 shrink-0 ${
                        isBranchOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Panel */}
                  <AnimatePresence>
                    {isBranchOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-popover/95 dark:bg-slate-900/95 backdrop-blur-md border border-border dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/60 overflow-hidden p-2 space-y-1.5"
                      >
                        {/* Search in Dropdown */}
                        <div className="relative px-1 pt-1 pb-1">
                          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            autoFocus
                            value={branchSearch}
                            onChange={(e) => setBranchSearch(e.target.value)}
                            placeholder={t('finance.search_branch', 'Search branch...')}
                            className="w-full h-9 pl-9 pr-3 rounded-lg text-xs bg-muted/60 dark:bg-muted/20 border border-border/80 dark:border-border focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                          />
                        </div>

                        {/* List */}
                        <div className="max-h-56 overflow-y-auto no-scrollbar space-y-1 p-0.5">
                          {filteredBranches.length > 0 ? (
                            filteredBranches.map((br: any) => {
                              const isSelected = formData.branch_id === br.id

                              return (
                                <button
                                  type="button"
                                  key={br.id}
                                  onClick={() => {
                                    setFormField('branch_id', br.id)
                                    setIsBranchOpen(false)
                                    setBranchSearch('')
                                  }}
                                  className={`w-full p-2 rounded-xl flex items-center justify-between gap-2.5 transition-all text-left cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                                      : 'hover:bg-muted/80 text-foreground border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                      <Building2 size={16} />
                                    </div>
                                    <div className="truncate">
                                      <p className="text-xs font-bold leading-tight">{br.name}</p>
                                      {br.code && (
                                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{br.code}</p>
                                      )}
                                    </div>
                                  </div>
                                  {isSelected && <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                                </button>
                              )
                            })
                          ) : (
                            <div className="p-4 text-center text-xs text-muted-foreground">
                              {t('finance.no_branches_found', 'No branches found')}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Reference # & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {t('finance.reference_number', 'Invoice / Reference #')}
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateRef}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={11} />
                      <span>{t('finance.auto_generate', 'Auto Generate')}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.reference_number}
                    onChange={(e) => setFormField('reference_number', e.target.value)}
                    placeholder={t('finance.placeholder_ref', 'e.g. EXP-20260821-4921')}
                    className="w-full h-11 px-3.5 rounded-xl text-sm font-mono bg-muted/20 dark:bg-muted/10 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {t('finance.status_col', 'Approval Status')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'approved', label: t('finance.status_approved', 'Approved'), icon: CheckCircle2, activeClass: 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10 shadow-xs ring-2 ring-emerald-500/20' },
                      { id: 'pending', label: t('finance.status_pending', 'Pending'), icon: Clock, activeClass: 'text-amber-500 border-amber-500/50 bg-amber-500/10 shadow-xs ring-2 ring-amber-500/20' },
                      { id: 'rejected', label: t('finance.status_rejected', 'Rejected'), icon: XCircle, activeClass: 'text-rose-500 border-rose-500/50 bg-rose-500/10 shadow-xs ring-2 ring-rose-500/20' },
                    ].map((st) => {
                      const Icon = st.icon
                      const isSelected = formData.status === st.id
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setFormField('status', st.id)}
                          className={`h-11 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                            isSelected
                              ? `${st.activeClass} font-extrabold`
                              : 'border-border bg-muted/20 dark:bg-muted/10 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          }`}
                        >
                          <Icon size={14} className={isSelected ? '' : 'opacity-70'} />
                          <span className="truncate">{st.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Description & Notes */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  {t('finance.description_col', 'Description / Operational Notes')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormField('description', e.target.value)}
                  placeholder={t('finance.placeholder_desc', 'Enter operational expense details...')}
                  rows={3}
                  className="w-full p-3.5 rounded-xl text-sm bg-muted/20 dark:bg-muted/10 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-xs resize-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Receipt Upload & Live Voucher Preview ─── */}
          <div className="space-y-6">

            {/* CARD 3: Digital Receipt Uploader */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xs">
              <FileUpload
                label={t('finance.receipt_attachment', 'Digital Receipt / Invoice')}
                value={formData.receipt}
                onChange={(newVal) => {
                  setFormField('receipt', newVal || '')
                }}
                accept="image/*,.pdf"
                maxSizeMB={10}
                allowPdf={true}
                allowImage={true}
                enableLightbox={true}
              />
            </div>

            {/* CARD 4: Live Payment Voucher Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-blue-500" />
                  <h3 className="text-sm font-bold text-foreground">
                    {t('finance.live_preview', 'Live Summary Preview')}
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider font-mono">
                  {t('finance.voucher_title', 'VOUCHER')}
                </span>
              </div>

              {/* Authentic Voucher Box */}
              <div className="rounded-xl border border-border/70 dark:border-slate-800 bg-muted/20 dark:bg-slate-950/60 p-4 space-y-3.5">
                
                {/* Total Spotlight */}
                <div className="text-center pb-3 border-b border-dashed border-border/80">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    {t('finance.total_outlay', 'Total Outlay')}
                  </div>
                  <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-1 tracking-tight">
                    ${formData.amount ? parseFloat(formData.amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate font-medium">
                    {formData.title || t('finance.untitled_expense', 'Untitled Expense')}
                  </div>
                </div>

                {/* Line Item Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">{t('finance.category_col', 'Category')}:</span>
                    <div className="flex items-center gap-1.5 font-bold text-foreground truncate max-w-[170px] text-right">
                      {selectedCatMeta && (
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${selectedCatMeta.bg}`}>
                          <selectedCatMeta.icon size={10} />
                        </div>
                      )}
                      <span className="truncate">{selectedCat?.name || t('finance.not_specified', 'Not specified')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">{t('finance.date_col', 'Date')}:</span>
                    <span className="font-mono font-bold text-foreground">{formData.date || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">{t('finance.reference_number', 'Ref #')}:</span>
                    <span className="font-mono font-bold text-primary">{formData.reference_number || t('finance.auto_generated', 'Auto-generated')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">{t('finance.branch', 'Branch')}:</span>
                    <div className="flex items-center gap-1.5 font-bold text-foreground truncate max-w-[170px] text-right">
                      <Building2 size={12} className="text-emerald-500 shrink-0" />
                      <span className="truncate">
                        {formData.branch_id === '1' ? t('finance.main_branch', 'HQ Main Branch') : (selectedBranch?.name || t('finance.main_branch', 'HQ Main Branch'))}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/40">
                    <span className="text-muted-foreground font-medium">{t('finance.status_col', 'Status')}:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      formData.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : formData.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {t(`finance.status_${formData.status}`, formData.status)}
                    </span>
                  </div>
                  {formData.receipt && (
                    <div className="flex items-center justify-between pt-1 border-t border-border/40">
                      <span className="text-muted-foreground font-medium">{t('finance.receipt_attachment', 'Receipt')}:</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                        <Check size={12} />
                        <span>{t('finance.receipt_verified', 'Attached')}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Barcode Mockup */}
                <div className="pt-2 text-center border-t border-dashed border-border/60">
                  <div className="text-[9px] font-mono tracking-widest text-muted-foreground/70 uppercase">
                    ||||| ||| ||||||| |||| |||||||| |||
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground font-semibold mt-0.5">
                    {formData.reference_number || 'EXP-AUTO-REF'}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </form>
      </div>

      {/* ─── Clean Form Footer ─── */}
      <FormFooter
        cancelPath="/expenses?tab=expenses"
        cancelLabel={t('common.cancel', 'Cancel')}
        isEdit={isEdit}
        isSubmitting={saveMutation.isPending}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? t('common.save_changes', 'Save Changes') : t('finance.save_expense', 'Save Expense')}
      />
    </div>
  )
}

export default ExpenseFormPage
