import React from 'react'
import { ShieldCheck, MapPin, Phone, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCompanyStore } from '@/stores/companyStore'
import { getAbsoluteImageUrl } from '@/utils/image'

export interface CompanyPrintInfo {
  name?: string
  tagline?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  vatNumber?: string
  logoUrl?: string
}

export interface GlobalPrintHeaderProps {
  title?: string
  subtitleKhmer?: string
  documentTypeLabel?: string
  referenceNumber: string
  referenceLabel?: string
  date?: string | Date | null
  dateLabel?: string
  status?: string
  statusVariant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  companyInfo?: CompanyPrintInfo
  extraMeta?: Array<{ label: string; value: string }>
}

const formatDisplayDate = (d: string | Date | null | undefined): string => {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  if (isNaN(date.getTime())) return typeof d === 'string' ? d : '—'
  const day = String(date.getDate()).padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export const GlobalPrintHeader: React.FC<GlobalPrintHeaderProps> = ({
  title,
  subtitleKhmer,
  documentTypeLabel,
  referenceNumber,
  referenceLabel,
  date,
  dateLabel,
  status,
  companyInfo,
  extraMeta = [],
}) => {
  const { t } = useTranslation(['purchases', 'common'])
  const { branding } = useCompanyStore()
  const rawLogo = companyInfo?.logoUrl || branding.logo || '/logo.svg'
  const logoUrl = getAbsoluteImageUrl(rawLogo) || '/logo.svg'

  const company: CompanyPrintInfo = {
    name: companyInfo?.name || branding.company_name || branding.brand_name || 'NEXPOS ENTERPRISE',
    tagline: companyInfo?.tagline || branding.brand_tagline || 'Omni-Channel Retail & Multi-Branch Inventory System',
    address: companyInfo?.address || branding.address || 'Phnom Penh, Kingdom of Cambodia',
    phone: companyInfo?.phone || branding.phone || '+855 (0) 23 888 999',
    email: companyInfo?.email || branding.email || 'support@nexpos.io',
    website: companyInfo?.website || 'www.nexpos.io',
    vatNumber: companyInfo?.vatNumber || 'VAT Reg No: VAT-88902194',
    logoUrl,
  }

  const docType = documentTypeLabel || t('purchases.officialDebitNote', t('officialDebitNote', 'Official Enterprise Document'))
  const refLabel = referenceLabel || t('purchases.returnReference', t('returnReference', 'Reference #'))
  const dLabel = dateLabel || t('purchases.returnDate', t('returnDate', 'Date'))
  const docTitle = title || t('purchases.purchaseReturnDebitNoteTitle', t('purchaseReturnDebitNoteTitle', 'PURCHASE RETURN / DEBIT NOTE'))

  return (
    <div className="w-full pb-3 border-b-2 border-slate-800 select-none [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
      <div className="flex justify-between items-start gap-4">
        
        {/* ─── Left Column: Store Branding & Contact Info ─────────────────── */}
        <div className="flex items-start gap-3 max-w-[420px]">
          {/* Logo container */}
          <div
            style={{ width: '52px', height: '52px', minWidth: '52px', minHeight: '52px', maxWidth: '52px', maxHeight: '52px' }}
            className="w-[52px] h-[52px] min-w-[52px] min-h-[52px] rounded-xl border border-slate-300 bg-white p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs"
          >
            <img
              src={company.logoUrl}
              alt={company.name}
              style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
              className="w-full h-full object-contain block shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
          </div>

          {/* Store Name & Contact Details */}
          <div className="space-y-0.5 text-xs">
            <h1 className="font-bold text-sm tracking-tight text-slate-950 uppercase leading-none">
              {company.name}
            </h1>
            <p className="font-semibold text-[9.5px] text-slate-600 uppercase tracking-wider">
              {company.tagline}
            </p>
            <div className="pt-0.5 text-[9px] space-y-0.5 text-slate-600 leading-tight">
              <p className="flex items-center gap-1">
                <MapPin size={9} className="text-slate-500 shrink-0" />
                <span>{company.address}</span>
              </p>
              <p className="flex items-center gap-1">
                <Phone size={9} className="text-slate-500 shrink-0" />
                <span>{company.phone}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="flex items-center gap-1">
                  <Mail size={9} className="text-slate-500 shrink-0" />
                  <span>{company.email}</span>
                </span>
                <span>•</span>
                <span className="font-mono text-slate-700">
                  {company.vatNumber}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ─── Right Column: Official Document Details & Ref Block ────────── */}
        <div className="text-right space-y-1.5 min-w-[210px] max-w-[280px]">
          {/* Document Official Badge & Title */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-end">
              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded border border-slate-300 text-[8.5px] font-bold tracking-wider uppercase bg-slate-50 text-slate-700">
                <ShieldCheck size={9} className="text-slate-600" />
                <span>{docType}</span>
              </span>
            </div>
            <h2 className="font-bold text-sm text-slate-950 tracking-tight leading-tight">
              {docTitle}
            </h2>
            {subtitleKhmer && subtitleKhmer !== docTitle && (
              <p className="font-medium text-[10px] text-slate-600 uppercase tracking-wide leading-tight">
                {subtitleKhmer}
              </p>
            )}
          </div>

          {/* Reference, Date & Status Clean Box */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-right space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold text-slate-700 uppercase tracking-wider">{refLabel}:</span>
              <span className="font-mono font-bold text-xs text-slate-950 bg-white px-1.5 py-0.2 rounded border border-slate-300">
                {referenceNumber}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[9.5px] text-slate-700 pt-0.5 border-t border-slate-200">
              <span className="font-medium text-slate-600">{dLabel}:</span>
              <span className="font-mono font-semibold text-slate-900">{formatDisplayDate(date)}</span>
            </div>

            {status && (
              <div className="flex justify-between items-center text-[9.5px] pt-0.5 border-t border-slate-200">
                <span className="font-medium text-slate-600">{t('purchases.statusLabel', t('statusLabel', 'Status'))}:</span>
                <span className="font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border border-slate-300 bg-white text-slate-800 text-[8px]">
                  {status}
                </span>
              </div>
            )}

            {extraMeta.map((meta, i) => (
              <div key={i} className="flex justify-between items-center text-[9.5px] pt-0.5 border-t border-slate-200">
                <span className="font-medium text-slate-600">{meta.label}:</span>
                <span className="font-mono font-semibold text-slate-900">{meta.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
