import React from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Clock } from 'lucide-react'

export interface PrintSignatureRole {
  titleKhmer?: string
  titleEnglish?: string
  titleLocalized?: string
  name?: string
  date?: string
}

export interface GlobalPrintFooterProps {
  signatures?: PrintSignatureRole[]
  noticeText?: string
  showTimestamp?: boolean
  customWatermark?: string
  pageNumberText?: string
}

const formatPrintDateTime = (d: Date = new Date()): string => {
  const day = String(d.getDate()).padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year} ${hours}:${minutes}`
}

export const GlobalPrintFooter: React.FC<GlobalPrintFooterProps> = ({
  signatures,
  noticeText,
  showTimestamp = true,
  customWatermark,
  pageNumberText,
}) => {
  const { t } = useTranslation(['purchases', 'common'])

  const defaultSigs: PrintSignatureRole[] = [
    {
      titleLocalized: t('purchases.preparedBy', t('print.preparedBy', 'Prepared By')),
      name: 'Super Admin',
    },
    {
      titleLocalized: t('purchases.warehouseOfficer', t('print.warehouseOfficer', 'Warehouse Officer')),
      name: t('purchases.authorizedManager', 'Authorized Manager'),
    },
    {
      titleLocalized: t('purchases.vendorReceiver', t('print.vendorReceiver', 'Vendor Receiver')),
      name: t('purchases.authorizedRepresentative', 'Authorized Representative'),
    },
  ]

  const activeSignatures = signatures && signatures.length > 0 ? signatures : defaultSigs
  const currentDateTimeStr = formatPrintDateTime()
  const watermark = customWatermark || t('print.watermark', 'Enterprise POS & E-Commerce System • Certified Document Voucher')
  const pageText = pageNumberText || `${t('print.page', 'Page')} 1 / 1`

  return (
    <div className="w-full pt-3 mt-4 border-t border-slate-300 select-none space-y-3 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]">
      {/* Optional Legal / Contract Notice */}
      {noticeText && (
        <div className="text-[9px] text-slate-600 leading-relaxed border-l-2 border-slate-400 pl-2 bg-slate-50 py-1 rounded-r font-normal">
          {noticeText}
        </div>
      )}

      {/* Dynamic Signatures Grid */}
      <div className={`grid grid-cols-${activeSignatures.length} gap-6 text-center text-xs pt-2`}>
        {activeSignatures.map((sig, idx) => (
          <div key={idx} className="space-y-8 flex flex-col justify-between">
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 text-[10px] uppercase tracking-wider">
                {sig.titleLocalized || sig.titleEnglish}
              </p>
              {sig.titleKhmer && sig.titleKhmer !== sig.titleLocalized && (
                <p className="text-[9px] text-slate-500 font-medium">
                  ({sig.titleKhmer})
                </p>
              )}
            </div>

            <div className="border-t border-slate-300 pt-1 text-[9.5px] text-slate-700 space-y-0.5">
              <p className="font-semibold text-slate-900 truncate">
                {sig.name || '__________________________'}
              </p>
              <p className="text-[8.5px] text-slate-500 font-mono">
                {t('purchases.dateLabel', t('print.date', 'Date'))}: {sig.date || '____ / ____ / ________'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* System Watermark / Footer Timestamp */}
      <div className="flex justify-between items-center text-[8.5px] text-slate-500 pt-2 border-t border-slate-200 font-mono">
        <div className="flex items-center gap-1">
          <ShieldCheck size={10} className="text-slate-500 shrink-0" />
          <span>{watermark}</span>
        </div>
        <div className="flex items-center gap-3">
          {showTimestamp && (
            <span className="flex items-center gap-1">
              <Clock size={9} className="text-slate-400 shrink-0" />
              <span>{t('print.printedAt', 'Printed:')} {currentDateTimeStr}</span>
            </span>
          )}
          <span className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">{pageText}</span>
        </div>
      </div>
    </div>
  )
}
