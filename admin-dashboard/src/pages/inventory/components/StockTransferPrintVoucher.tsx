import React from 'react'
import { Package, Warehouse } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const formatPrintDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '—'
  const day = String(date.getDate()).padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const formatPrintDateTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '—'
  const day = String(date.getDate()).padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year} ${hours}:${minutes}`
}

interface StockTransferPrintVoucherProps {
  detail: any
}

export const StockTransferPrintVoucher: React.FC<StockTransferPrintVoucherProps> = ({ detail }) => {
  const { t } = useTranslation()

  if (!detail) return null

  const items = detail.items ?? []
  const totalItemsCount = items.length
  const totalSentQty = items.reduce((acc: number, it: any) => acc + Number(it.quantity_sent || it.quantity_requested || it.quantity || 0), 0)
  const totalReceivedQty = items.reduce((acc: number, it: any) => acc + Number(it.quantity_received || 0), 0)

  const rawStatus = (detail.status || 'draft').toLowerCase()
  const statusKey = `inventory.status_${rawStatus}`
  const statusLabel = String(t(statusKey, rawStatus.replace('_', ' ').toUpperCase()))

  const refNumber = detail.reference_number || `TR-${detail.id || '20260808-0001'}`

  return (
    <div className="hidden print:block print:w-full print:bg-white print:text-black font-sans text-xs p-2 leading-tight select-none">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-start pb-3 border-b border-gray-300 gap-4">
        
        {/* Left: Company Branding */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs">
            <Package size={24} className="text-white" />
          </div>
          <div className="space-y-0.5 text-xs text-gray-800">
            <h1 className="font-extrabold text-sm text-gray-900 tracking-tight leading-none">ENTERPRISE POS</h1>
            <p className="font-bold text-[10px] uppercase text-gray-500 tracking-wider">Management System</p>
            <div className="pt-1 text-[10px] space-y-0.5 text-gray-600 font-medium">
              <p>📍 Phnom Penh, Cambodia</p>
              <p>📞 +855 12 345 678</p>
              <p>✉️ info@enterprisepos.com</p>
            </div>
          </div>
        </div>

        {/* Center: Voucher Title */}
        <div className="text-center space-y-0.5 self-center">
          <h2 className="font-extrabold text-sm text-gray-900">
            {t('inventory.printTransferTitle', 'STOCK TRANSFER')}
          </h2>
          <h3 className="font-black text-xs text-gray-700 tracking-wider uppercase">
            {t('inventory.transfer_card', 'STOCK TRANSFER')}
          </h3>
        </div>

        {/* Right: Meta & QR / Barcode */}
        <div className="text-right space-y-1 min-w-[190px]">
          <div className="flex justify-end">
            <svg className="w-12 h-12" viewBox="0 0 100 100" fill="currentColor">
              <rect width="100" height="100" fill="white" />
              <path d="M10 10h30v30H10zM15 15v20h20V15zM20 20h10v10H20zM60 10h30v30H60zM65 15v20h20V15zM70 20h10v10H70zM10 60h30v30H10zM15 65v20h20V65zM20 70h10v10H20zM45 10h10v10H45zM45 30h10v10H45zM45 50h10v10H45zM45 70h10v10H45zM45 85h10v10H45zM60 50h10v10H60zM75 50h15v10H75zM60 70h15v10H60zM80 70h10v20H80zM60 85h15v10H60z" fill="#000" />
            </svg>
          </div>
          <div className="text-[10px] space-y-0.5 text-gray-800 font-medium">
            <p><span className="font-bold">{t('inventory.transferNo', 'Transfer No')} :</span> <span className="font-mono font-bold">{refNumber}</span></p>
            <p><span className="font-bold">{t('common.date', 'Date')} :</span> {formatPrintDate(detail.created_at || detail.date)}</p>
            <p><span className="font-bold">{t('common.page', 'Page')} :</span> 1 / 1</p>
          </div>
          {/* Barcode Graphic */}
          <div className="pt-0.5 flex flex-col items-end">
            <div className="flex items-center gap-[1px] h-5">
              {[2,1,3,1,2,1,4,1,2,3,1,2,1,3,2,1,4,1,2,1,3,1,2,1,3,2,1,2].map((w, i) => (
                <div key={i} className="bg-black h-full" style={{ width: `${w}px` }} />
              ))}
            </div>
            <p className="text-[8px] font-mono tracking-widest text-gray-600 mt-0.5">*{refNumber}*</p>
          </div>
        </div>

      </div>

      {/* Warehouse Transfer Route Box */}
      <div className="mt-3 border border-gray-300 rounded-xl p-3 bg-white grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs">
        {/* From Warehouse */}
        <div className="space-y-1.5">
          <h4 className="font-bold text-gray-900 text-[11px]">{t('inventory.fromWarehouse', 'From Warehouse')}</h4>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-800 shrink-0">
              <Warehouse size={18} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="font-bold text-gray-900 text-xs">{detail.from_warehouse?.name || 'Warehouse 2'}</p>
              <p className="text-[10px] text-gray-600">{t('inventory.location', 'Location')} : {detail.from_warehouse?.address || detail.from_warehouse?.location || 'Phnom Penh'}</p>
              <p className="text-[10px] text-gray-600">{t('inventory.phone', 'Phone')} : {detail.from_warehouse?.phone || '+855 12 222 333'}</p>
            </div>
          </div>
        </div>

        {/* Center Arrow */}
        <div className="flex flex-col items-center px-3">
          <div className="text-gray-900 font-bold text-xl leading-none">➔</div>
        </div>

        {/* To Warehouse */}
        <div className="space-y-1.5">
          <h4 className="font-bold text-gray-900 text-[11px]">{t('inventory.toWarehouse', 'To Warehouse')}</h4>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-800 shrink-0">
              <Warehouse size={18} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="font-bold text-gray-900 text-xs">{detail.to_warehouse?.name || 'Warehouse 1'}</p>
              <p className="text-[10px] text-gray-600">{t('inventory.location', 'Location')} : {detail.to_warehouse?.address || detail.to_warehouse?.location || 'Phnom Penh'}</p>
              <p className="text-[10px] text-gray-600">{t('inventory.phone', 'Phone')} : {detail.to_warehouse?.phone || '+855 12 111 222'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Info Box */}
      <div className="mt-3 border border-gray-300 rounded-xl p-3 bg-white grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
        <div className="space-y-1">
          <div className="grid grid-cols-[110px_1fr] items-center">
            <span className="font-bold text-gray-900">{t('inventory.transferDate', 'Transfer Date')}</span>
            <span>: {formatPrintDate(detail.created_at || detail.date)}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-center">
            <span className="font-bold text-gray-900">{t('inventory.expectedArrival', 'Expected Arrival')}</span>
            <span>: {formatPrintDate(detail.expected_arrival || detail.created_at)}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-center">
            <span className="font-bold text-gray-900">{t('inventory.reason', 'Reason')}</span>
            <span>: {detail.reason || 'Replenishment'}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold text-gray-900">{t('inventory.notes', 'Notes')}</span>
            <span>: {detail.notes || t('inventory.noNotesAttached', 'Restock items for sales')}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="font-bold text-gray-900">{t('common.status', 'Status')}</span>
            <div className="flex items-center gap-1">
              <span>:</span>
              <span className="bg-blue-700 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-md tracking-wider">
                {statusLabel}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="font-bold text-gray-900">{t('inventory.priority', 'Priority')}</span>
            <span>: {detail.priority || 'Normal'}</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="font-bold text-gray-900">{t('inventory.operatorUser', 'Created By')}</span>
            <span>: {detail.user?.name || 'Super Admin'}</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="font-bold text-gray-900">{t('inventory.approvedBy', 'Approved By')}</span>
            <span>: {detail.approved_by || 'Manager'}</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="font-bold text-gray-900">{t('inventory.shippedBy', 'Shipped By')}</span>
            <span>: {detail.shipped_by || detail.user?.name || 'Super Admin'}</span>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mt-3 space-y-1.5">
        <h3 className="font-extrabold text-xs text-gray-900">{t('inventory.items', 'Items')}</h3>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 font-bold text-gray-900 text-center">
                <th className="p-1.5 border-r border-gray-300 w-8">{t('common.no', 'No.')}</th>
                <th className="p-1.5 border-r border-gray-300 text-left">{t('inventory.colProductName', 'Product Item')}</th>
                <th className="p-1.5 border-r border-gray-300">{t('common.sku', 'SKU')}</th>
                <th className="p-1.5 border-r border-gray-300">{t('inventory.serialNumber', 'IMEI / Serial')}</th>
                <th className="p-1.5 border-r border-gray-300">
                  {t('inventory.sentQty', 'Sent Qty')}
                </th>
                <th className="p-1.5 border-r border-gray-300">
                  {t('inventory.recQty', 'Received Qty')}
                </th>
                <th className="p-1.5 border-r border-gray-300 w-14">{t('common.unit', 'Unit')}</th>
                <th className="p-1.5 w-14">{t('common.note', 'Note')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 font-medium text-gray-800">
              {items.map((item: any, idx: number) => (
                <tr key={item.id || idx}>
                  <td className="p-1.5 text-center border-r border-gray-300">{idx + 1}</td>
                  <td className="p-1.5 border-r border-gray-300 font-semibold">{item.product?.name || `Product #${item.product_id}`}</td>
                  <td className="p-1.5 text-center border-r border-gray-300 font-mono text-[10px]">
                    {item.product?.sku || 'SKU-IPH-001'}
                    {item.variant ? `<br/>${item.variant.sku}` : ''}
                  </td>
                  <td className="p-1.5 text-center border-r border-gray-300 text-[10px]">{item.serial_number || '-'}</td>
                  <td className="p-1.5 text-center border-r border-gray-300 font-bold">{item.quantity_sent || item.quantity_requested || item.quantity || 0}</td>
                  <td className="p-1.5 text-center border-r border-gray-300 font-bold">{item.quantity_received || 0}</td>
                  <td className="p-1.5 text-center border-r border-gray-300 uppercase text-[10px]">{item.product?.unit?.code || 'PCS'}</td>
                  <td className="p-1.5 text-center text-[10px]">{item.notes || '-'}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500 italic">{t('inventory.noItemsInTransfer', 'No items listed in this transfer.')}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-100 border-t border-gray-300 font-bold text-xs text-gray-900">
              <tr>
                <td colSpan={3} className="p-2 border-r border-gray-300">
                  {t('inventory.totalItemsCount', 'Total Items: {{count}}', { count: totalItemsCount })}
                </td>
                <td colSpan={3} className="p-2 text-center border-r border-gray-300">
                  {t('inventory.totalSentQty', 'Total Sent Qty: {{count}}', { count: totalSentQty })}
                </td>
                <td colSpan={2} className="p-2 text-center">
                  {t('inventory.totalReceivedQty', 'Total Received Qty: {{count}}', { count: totalReceivedQty })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="mt-3 space-y-1.5">
        <h3 className="font-extrabold text-xs text-gray-900">{t('inventory.activity', 'Activity Log')}</h3>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 font-bold text-gray-900">
                <th className="p-1.5 border-r border-gray-300 text-center w-8">{t('common.no', 'No.')}</th>
                <th className="p-1.5 border-r border-gray-300">{t('inventory.dateTime', 'Date / Time')}</th>
                <th className="p-1.5 border-r border-gray-300">{t('inventory.by', 'By')}</th>
                <th className="p-1.5 border-r border-gray-300">{t('inventory.action', 'Action')}</th>
                <th className="p-1.5">{t('common.note', 'Note')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 font-medium text-gray-800">
              <tr>
                <td className="p-1.5 text-center border-r border-gray-300">1</td>
                <td className="p-1.5 border-r border-gray-300">{formatPrintDateTime(detail.created_at)}</td>
                <td className="p-1.5 border-r border-gray-300">{detail.user?.name || 'Super Admin'}</td>
                <td className="p-1.5 border-r border-gray-300 font-bold">{t('inventory.actionCreated', 'Created')}</td>
                <td className="p-1.5">{t('inventory.noteCreated', 'Stock transfer created')}</td>
              </tr>
              {detail.approved_at && (
                <tr>
                  <td className="p-1.5 text-center border-r border-gray-300">2</td>
                  <td className="p-1.5 border-r border-gray-300">{formatPrintDateTime(detail.approved_at)}</td>
                  <td className="p-1.5 border-r border-gray-300">{detail.approved_by || 'Manager'}</td>
                  <td className="p-1.5 border-r border-gray-300 font-bold">{t('inventory.actionApproved', 'Approved')}</td>
                  <td className="p-1.5">{t('inventory.noteApproved', 'Approved by Manager')}</td>
                </tr>
              )}
              {detail.shipped_at && (
                <tr>
                  <td className="p-1.5 text-center border-r border-gray-300">3</td>
                  <td className="p-1.5 border-r border-gray-300">{formatPrintDateTime(detail.shipped_at)}</td>
                  <td className="p-1.5 border-r border-gray-300">{detail.shipped_by || detail.user?.name || 'Super Admin'}</td>
                  <td className="p-1.5 border-r border-gray-300 font-bold">{t('inventory.actionShipped', 'Shipped')}</td>
                  <td className="p-1.5">{t('inventory.noteShipped', 'Items shipped from warehouse')}</td>
                </tr>
              )}
              <tr>
                <td className="p-1.5 text-center border-r border-gray-300">4</td>
                <td className="p-1.5 border-r border-gray-300">{detail.received_at ? formatPrintDateTime(detail.received_at) : '-'}</td>
                <td className="p-1.5 border-r border-gray-300">{detail.received_by || '-'}</td>
                <td className="p-1.5 border-r border-gray-300 font-bold">{t('inventory.actionReceived', 'Received')}</td>
                <td className="p-1.5">{detail.received_at ? t('inventory.actionReceived', 'Received') : t('inventory.notePending', 'Pending')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Signatures Box */}
      <div className="mt-3 border border-gray-300 rounded-xl p-3 bg-white grid grid-cols-3 divide-x divide-gray-300 text-xs">
        {/* Created By */}
        <div className="px-2 text-center space-y-6">
          <h4 className="font-bold text-gray-900 text-[11px]">{t('inventory.signatureCreatedBy', 'Created By')}</h4>
          <div className="space-y-0.5">
            <div className="w-4/5 border-b border-gray-400 mx-auto mb-1" />
            <p className="font-bold text-gray-900">{detail.user?.name || 'Super Admin'}</p>
            <p className="text-[10px] text-gray-600">{formatPrintDateTime(detail.created_at)}</p>
          </div>
        </div>

        {/* Approved By */}
        <div className="px-2 text-center space-y-6">
          <h4 className="font-bold text-gray-900 text-[11px]">{t('inventory.signatureApprovedBy', 'Approved By')}</h4>
          <div className="space-y-0.5">
            <div className="w-4/5 border-b border-gray-400 mx-auto mb-1" />
            <p className="font-bold text-gray-900">{detail.approved_by || 'Manager'}</p>
            <p className="text-[10px] text-gray-600">{detail.approved_at ? formatPrintDateTime(detail.approved_at) : 'Date: _____________'}</p>
          </div>
        </div>

        {/* Received By */}
        <div className="px-2 text-center space-y-6">
          <h4 className="font-bold text-gray-900 text-[11px]">{t('inventory.signatureReceivedBy', 'Received By')}</h4>
          <div className="space-y-0.5">
            <div className="w-4/5 border-b border-gray-400 mx-auto mb-1" />
            <p className="font-bold text-gray-900">{detail.received_by || t('common.signature', '(Signature)')}</p>
            <p className="text-[10px] text-gray-600">{detail.received_at ? formatPrintDateTime(detail.received_at) : 'Date: _____________'}</p>
          </div>
        </div>
      </div>

      {/* Footer Thank You Message */}
      <div className="mt-3 text-center text-xs space-y-0.5 font-medium text-gray-700">
        <p className="font-bold text-gray-900">{t('common.thankYouMessage', 'Thank you for using our system!')}</p>
      </div>

    </div>
  )
}
export default StockTransferPrintVoucher
