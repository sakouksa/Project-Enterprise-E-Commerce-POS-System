import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Receipt,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Edit,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Paperclip,
  DollarSign,
  FolderClosed,
  Home,
  Wifi,
  Zap,
  Utensils,
  Package,
  Truck,
  Megaphone,
  Server,
  Tag,
  ShieldCheck,
  Eye,
  Maximize2
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '@/utils/formatters'
import { getStorageFileUrl } from '@/utils/image'
import { useToast } from '@/hooks/useToast'

interface ExpenseDetailModalProps {
  expense: any | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (expense: any) => void
}

// ─── Visual Category Resolver with Full 5-Language Mapping ──────────────────
const resolveCategoryMeta = (name?: string, t?: any) => {
  const lower = (name || '').toLowerCase()
  if (lower.includes('office') || lower.includes('supplies') || lower.includes('សម្ភារៈ') || lower.includes('văn phòng')) {
    return {
      icon: FolderClosed,
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      label: t ? t('finance.tpl_office', 'Office Supplies & Equipment') : 'Office Supplies'
    }
  }
  if (lower.includes('rent') || lower.includes('utilit') || lower.includes('ថ្លៃឈ្នួល') || lower.includes('tiện ích')) {
    return {
      icon: Home,
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      label: t ? t('finance.tpl_utilities', 'Rent & Utilities') : 'Rent & Utilities'
    }
  }
  if (lower.includes('internet') || lower.includes('phone') || lower.includes('ទូរស័ព្ទ') || lower.includes('mạng')) {
    return {
      icon: Wifi,
      bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      label: t ? t('finance.tpl_server', 'Internet & Phone') : 'Internet & Phone'
    }
  }
  if (lower.includes('electric') || lower.includes('power') || lower.includes('ភ្លើង') || lower.includes('điện')) {
    return {
      icon: Zap,
      bg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
      label: t ? t('finance.tpl_utilities', 'Warehouse Electricity') : 'Electricity'
    }
  }
  if (lower.includes('meal') || lower.includes('food') || lower.includes('អាហារ') || lower.includes('ăn uống')) {
    return {
      icon: Utensils,
      bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      label: t ? t('finance.tpl_marketing', 'Employee Meals') : 'Meals'
    }
  }
  if (lower.includes('packag') || lower.includes('shipping') || lower.includes('វេចខ្ចប់') || lower.includes('đóng gói')) {
    return {
      icon: Package,
      bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      label: t ? t('finance.tpl_fuel', 'Shipping & Packaging') : 'Shipping & Packaging'
    }
  }
  if (lower.includes('fuel') || lower.includes('logistic') || lower.includes('ដឹកជញ្ជូន') || lower.includes('ប្រេង') || lower.includes('vận chuyển')) {
    return {
      icon: Truck,
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      label: t ? t('finance.tpl_fuel', 'Logistics & Fuel') : 'Logistics & Fuel'
    }
  }
  if (lower.includes('advertis') || lower.includes('marketing') || lower.includes('ផ្សព្វផ្សាយ') || lower.includes('tiếp thị')) {
    return {
      icon: Megaphone,
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      label: t ? t('finance.tpl_marketing', 'Advertising & Marketing') : 'Advertising & Marketing'
    }
  }
  if (lower.includes('server') || lower.includes('cloud') || lower.includes('hosting') || lower.includes('máy chủ')) {
    return {
      icon: Server,
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      label: t ? t('finance.tpl_server', 'Server & Cloud Hosting') : 'Server & Cloud'
    }
  }
  return {
    icon: Tag,
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    label: name || (t ? t('finance.all_categories', 'Operational Expense') : 'Miscellaneous')
  }
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  expense,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { t, i18n } = useTranslation(['finance', 'common'])
  const currentLocale = i18n.language === 'km' ? 'km-KH' : i18n.language === 'zh' ? 'zh-CN' : i18n.language === 'th' ? 'th-TH' : i18n.language === 'vi' ? 'vi-VN' : 'en-US'
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!isOpen || !expense) return null

  const referenceNo = expense.reference_number || `EXP-${String(expense.id).padStart(5, '0')}`
  const amount = Number(expense.amount || 0)
  const status = expense.status || 'approved'
  const rawCatName = expense.category?.name || expense.category_name || ''
  const catMeta = resolveCategoryMeta(rawCatName, t)
  const CategoryIcon = catMeta.icon
  const receiptUrl = getStorageFileUrl(expense.receipt)
  const isPdf = Boolean(expense.receipt && expense.receipt.toLowerCase().endsWith('.pdf'))

  const copyReference = () => {
    navigator.clipboard.writeText(referenceNo)
    setCopied(true)
    toast.success(t('common.copied', 'Copied to clipboard!'))
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={13} />
            <span>{t('finance.status_approved', 'Approved')}</span>
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock size={13} />
            <span>{t('finance.status_pending', 'Pending Review')}</span>
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle size={13} />
            <span>{t('finance.status_rejected', 'Rejected')}</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
            <span>{status}</span>
          </span>
        )
    }
  }

  const formatExpenseDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    if (i18n.language === 'km') {
      const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
      const day = d.getDate()
      const month = khmerMonths[d.getMonth()]
      const year = d.getFullYear()
      return `ថ្ងៃទី ${day} ខែ${month} ឆ្នាំ${year}`
    }
    return d.toLocaleDateString(currentLocale, { dateStyle: 'medium' })
  }

  const branchDisplayName =
    expense.branch_id === 1 || expense.branch?.id === 1 || expense.branch?.name === 'Head Office 1'
      ? t('finance.main_branch', 'Headquarters (HQ Main Branch)')
      : (expense.branch?.name || t('finance.main_branch', 'Headquarters (HQ Main Branch)'))

  const descriptionText =
    !expense.description || expense.description === 'Regular business operational expense.'
      ? t('finance.default_regular_desc', 'Regular business operational expense recorded in general ledger.')
      : expense.description

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        />

        {/* Slide-Over Drawer Container (Right Side) */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-xl bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-hidden pointer-events-auto z-10"
          >
            {/* ─── 1. Header Bar ─── */}
            <div className="p-5 sm:px-6 border-b border-border/80 bg-gradient-to-b from-muted/40 via-card to-card flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <Receipt size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-foreground truncate">
                      {t('finance.expense_details', 'Expense Voucher Details')}
                    </h2>
                    {getStatusBadge()}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {t('finance.recorded_financial_outlay', 'Recorded financial operational outlay')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title={t('finance.print_voucher', 'Print Voucher')}
                >
                  <Printer size={17} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title={t('common.close', 'Close')}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ─── 2. Scrollable Body ─── */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

              {/* Spotlight Amount Card */}
              <div className="bg-gradient-to-br from-rose-500/[0.07] via-card to-amber-500/[0.04] border border-rose-500/20 rounded-2xl p-5 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-rose-500" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t('finance.total_outlay', 'Total Outlay Amount')}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    USD ($)
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tracking-tight">
                    {formatCurrency(amount, { locale: currentLocale })}
                  </div>
                  <button
                    onClick={copyReference}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-card border border-border text-foreground hover:bg-muted/80 transition-colors shadow-2xs cursor-pointer select-none"
                    title={t('common.copy', 'Copy reference')}
                  >
                    <span>{referenceNo}</span>
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-muted-foreground" />}
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between gap-2 text-xs flex-wrap">
                  <span className="text-muted-foreground font-medium truncate">
                    {expense.title || t('finance.untitled_expense', 'Untitled Expense')}
                  </span>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold shrink-0 ${catMeta.bg}`}>
                    <CategoryIcon size={13} />
                    <span>{catMeta.label}</span>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t('finance.general_info', 'Transaction Information')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/80 space-y-1">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary" />
                      <span>{t('finance.date_col', 'Expense Date')}</span>
                    </p>
                    <p className="text-sm font-semibold text-foreground font-mono">
                      {formatExpenseDate(expense.date)}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/80 space-y-1">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 size={13} className="text-emerald-500" />
                      <span>{t('finance.branch', 'Branch / Department')}</span>
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {branchDisplayName}
                    </p>
                  </div>
                </div>

                {/* Description & Operational Notes */}
                <div className="p-4 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border/80 space-y-1.5">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={13} className="text-amber-500" />
                    <span>{t('finance.description_col', 'Description & Notes')}</span>
                  </p>
                  <p className="text-xs text-foreground leading-relaxed font-medium">
                    {descriptionText}
                  </p>
                </div>
              </div>

              {/* Digital Invoice / Receipt File */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip size={13} />
                    <span>{t('finance.receipt_attachment', 'Digital Invoice Attachment')}</span>
                  </h3>
                  {expense.receipt && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 size={11} />
                      {t('finance.receipt_verified', 'Attached File')}
                    </span>
                  )}
                </div>

                {expense.receipt ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 dark:bg-muted/10 border border-border shadow-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          <Receipt size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{expense.receipt}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {isPdf ? 'PDF Document / Voucher' : t('finance.voucher_digital_type', 'Digital Image / PDF voucher')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setLightboxOpen(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity shadow-2xs cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>{t('common.view', 'View')}</span>
                        </button>
                        <a
                          href={receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors cursor-pointer"
                          title="Open in new tab"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    {/* Image Preview if it's an image */}
                    {!isPdf && (
                      <div
                        onClick={() => setLightboxOpen(true)}
                        className="rounded-xl overflow-hidden border border-border bg-black/5 dark:bg-black/40 p-2 flex items-center justify-center cursor-pointer group relative"
                      >
                        <img
                          src={receiptUrl}
                          alt="Receipt Preview"
                          className="max-h-56 object-contain rounded-lg w-full transition-transform group-hover:scale-[1.01]"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2 text-white text-xs font-bold">
                          <Maximize2 size={16} />
                          <span>{t('common.view', 'Preview Fullscreen')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground border-2 border-dashed border-border/70 rounded-2xl bg-muted/10">
                    <p className="font-medium">{t('finance.no_receipt_attached', 'No digital receipt attached for this entry.')}</p>
                  </div>
                )}
              </div>

              {/* Barcode & Verification Footer */}
              <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/20 dark:bg-muted/10 text-center space-y-1 relative">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  <ShieldCheck size={13} />
                  <span>{t('finance.receipt_verified', 'Verified Voucher')}</span>
                </div>
                <div className="text-[10px] font-mono tracking-widest text-muted-foreground/70 uppercase">
                  ||||| ||| ||||||| |||| |||||||| ||| |||||
                </div>
                <div className="text-[11px] font-mono font-bold text-muted-foreground">
                  {referenceNo}
                </div>
              </div>

            </div>

            {/* ─── 3. Action Footer ─── */}
            <div className="p-4 sm:px-6 bg-muted/40 dark:bg-slate-900/60 border-t border-border flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer select-none"
              >
                {t('common.close', 'Close')}
              </button>

              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onEdit(expense)
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-95 transition-opacity cursor-pointer shadow-xs select-none"
                >
                  <Edit size={14} />
                  <span>{t('finance.edit_expense_btn', 'Edit Expense')}</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* ─── Lightbox / Interactive Modal for PDF & Image Preview ─── */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm pointer-events-auto">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              {/* Lightbox Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Receipt size={18} className="text-primary shrink-0" />
                  <span className="text-sm font-bold text-foreground truncate">{expense.receipt}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => setLightboxOpen(false)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Lightbox Content */}
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/5 dark:bg-black/40 min-h-[400px]">
                {isPdf ? (
                  <iframe
                    src={receiptUrl}
                    title="PDF Document"
                    className="w-full h-[70vh] rounded-xl border border-border bg-white"
                  />
                ) : (
                  <img
                    src={receiptUrl}
                    alt="Receipt Attachment Preview"
                    className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-md"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  )
}

export default ExpenseDetailModal
