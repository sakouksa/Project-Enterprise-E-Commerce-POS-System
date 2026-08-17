import React from 'react'
import { ShieldCheck, MapPin, Phone, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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

  const company: CompanyPrintInfo = {
    name: companyInfo?.name || t('purchases.printStoreName', t('printStoreName', 'ENTERPRISE POS + E-COMMERCE')),
    tagline: companyInfo?.tagline || t('purchases.printTagline', t('printTagline', 'Omni-Channel Retail & Multi-Branch Inventory System')),
    address: companyInfo?.address || t('purchases.printAddress', t('printAddress', 'Phnom Penh, Kingdom of Cambodia')),
    phone: companyInfo?.phone || t('purchases.printPhone', t('printPhone', '+855 (0) 23 999 888')),
    email: companyInfo?.email || t('purchases.printEmail', t('printEmail', 'support@enterprisepos.com')),
    website: companyInfo?.website || 'www.enterprisepos.com',
    vatNumber: companyInfo?.vatNumber || t('purchases.printVatNumber', t('printVatNumber', 'VAT Reg No: VAT-88902194')),
    logoUrl: companyInfo?.logoUrl || '/logo.svg',
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
            style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', maxWidth: '44px', maxHeight: '44px' }}
            className="w-11 h-11 min-w-11 min-h-11 rounded-lg border border-slate-300 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden"
          >
            <img
              src={company.logoUrl}
              alt={company.name}
              style={{ width: '34px', height: '34px', maxWidth: '34px', maxHeight: '34px' }}
              className="w-8 h-8 object-contain block shrink-0"
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
